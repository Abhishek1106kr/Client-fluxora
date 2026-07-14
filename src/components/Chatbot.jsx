import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MessageSquare, Send, X, Sparkles, Navigation, User, Bot, Paperclip } from "lucide-react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import avatarImg from "../assets/chatbot_avatar.png";

const QUICK_PROMPTS = [
  { text: "🔍 Find React Jobs", query: "Can you recommend any React engineering opportunities from the database?" },
  { text: "📈 Check my ATS match", query: "Can you check how well my resume matches a standard Software Developer position and give me my ATS score?" },
  { text: "💼 Practice Interviews", query: "How do I start an interview practice session? Please guide me to the right tool." },
  { text: "🗺️ Navigate Site", query: "What tools are available on Fluxora? Explain where to go." }
];

export default function Chatbot() {
  const { backendUrl } = useContext(AppContext);
  const base = backendUrl || "http://localhost:5002";
  const token = localStorage.getItem("token");
  
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "model",
      parts: [{ text: "Hi! I'm **Fluxy**, your AI Career Coach. 🚀\n\nI can retrieve jobs matching your skills, analyze your resume alignment, estimate your ATS score, and navigate you through the website.\n\nWhat would you like to build today?" }]
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const triggerFileUpload = () => {
    if (!token) {
      toast.error("Please login to upload your resume.");
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setMessages(prev => [
      ...prev,
      { role: "user", parts: [{ text: `📎 Staged resume upload: ${file.name}` }] }
    ]);

    try {
      // 1. Upload to storage
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch(`${base}/upload`, {
        method: "POST",
        body: formData
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || !uploadData.success) {
        throw new Error(uploadData.message || "Failed to upload file to storage.");
      }

      const fileUrl = uploadData.fileUrl;

      // 2. Link resume URL to user profile (triggers backend PDF parsing!)
      const updateRes = await fetch(`${base}/api/user/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ resume: fileUrl })
      });

      const updateData = await updateRes.json();
      if (!updateRes.ok || !updateData.success) {
        throw new Error(updateData.message || "Failed to link resume URL to profile.");
      }

      setMessages(prev => [
        ...prev,
        {
          role: "model",
          parts: [{ text: `🎉 **Resume uploaded and parsed successfully!** 📄\n\nI have saved your resume and extracted your technical context. You can now:\n* Ask me: *"What is my ATS score for a Software Developer job?"*\n* Ask me to find matching jobs.\n* Click Quick Prompts to check matches.` }]
        }
      ]);

      toast.success("Resume uploaded and parsed successfully!");

    } catch (err) {
      console.error("[Chatbot Upload] Error:", err.message);
      setMessages(prev => [
        ...prev,
        { role: "model", parts: [{ text: `⚠️ **Upload failed:** ${err.message}` }] }
      ]);
      toast.error(err.message || "Failed to upload resume.");
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSendMessage = async (textToSend) => {
    const messageText = textToSend || input;
    if (!messageText.trim()) return;

    if (!textToSend) setInput("");

    // 1. Append user message to history
    const updatedMessages = [
      ...messages,
      { role: "user", parts: [{ text: messageText }] }
    ];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // 2. Format history for backend
      // Backend expects the array of { role, parts: [{ text }] }
      const res = await fetch(`${base}/api/ai/chatbot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          message: messageText,
          history: updatedMessages
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to get chatbot response.");
      }

      // 3. Append bot response
      setMessages(prev => [
        ...prev,
        { role: "model", parts: [{ text: data.reply }] }
      ]);

      // 4. Handle navigation route redirect if suggested
      if (data.navigate) {
        toast.info(`Guiding you to ${data.navigate}...`, { icon: "🚀" });
        setTimeout(() => {
          navigate(data.navigate);
          setIsOpen(false); // Minimize chat window on redirect
        }, 1200);
      }

    } catch (err) {
      console.error("[Chatbot UI] Error:", err.message);
      setMessages(prev => [
        ...prev,
        { role: "model", parts: [{ text: "⚠️ Sorry, I encountered an issue matching your profile context. Make sure you are logged in and your internet is connected." }] }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Simple markdown renderer for bold, italic, linebreaks, and bullets
  const renderMarkdown = (text) => {
    if (!text) return "";
    
    // Bold
    let html = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-emerald-400 font-bold">$1</strong>');
    
    // Bullet points
    html = html.split('\n').map(line => {
      if (line.trim().startsWith('- ')) {
        return `<li class="ml-4 list-disc text-zinc-300 my-0.5">${line.trim().substring(2)}</li>`;
      }
      return line;
    }).join('\n');
    
    // Line breaks
    html = html.replace(/\n/g, '<br />');
    
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <>
      <style>{`
        @keyframes floatRobot {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(1.5deg); }
        }
        @keyframes shadowScale {
          0%, 100% { transform: scale(1); opacity: 0.35; filter: blur(2px); }
          50% { transform: scale(0.65); opacity: 0.15; filter: blur(3.5px); }
        }
      `}</style>

      {/* ── Chat Launcher Container ── */}
      <div 
        className="fixed bottom-6 right-6 z-50 flex flex-col items-center select-none"
        style={{ pointerEvents: 'none' }}
      >
        {/* Floating Button wrapper */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800/80 hover:border-emerald-500/50 shadow-2xl flex items-center justify-center transition-transform active:scale-95 group relative"
          style={{
            animation: "floatRobot 3.2s ease-in-out infinite",
            pointerEvents: 'auto',
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 0 15px -3px rgba(16, 185, 129, 0.15)"
          }}
          title="Chat with Fluxy"
        >
          {/* Neon inner border glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
          
          <img
            src={avatarImg}
            alt="Fluxy Avatar"
            className="w-12 h-12 object-contain group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
            style={{
              filter: "drop-shadow(0 4px 10px rgba(16, 185, 129, 0.35))"
            }}
          />
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900 shadow-md shadow-emerald-500/50 animate-pulse" />
        </button>

        {/* Levitating Shadow Element */}
        <div 
          className="w-7 h-1.5 bg-emerald-500/20 rounded-full mt-1.5 transition-all duration-300"
          style={{
            animation: "shadowScale 3.2s ease-in-out infinite",
          }}
        />
      </div>

      {/* ── Chat Window ── */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] sm:w-[380px] h-[520px] rounded-3xl bg-slate-950/90 backdrop-blur-lg border border-slate-800/80 shadow-2xl shadow-emerald-500/5 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300">
          
          {/* Header */}
          <div className="p-4 bg-slate-900/60 border-b border-slate-800/60 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center shadow-md">
                <img src={avatarImg} alt="Fluxy Icon" className="w-7 h-7 object-contain" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-outfit text-zinc-50 flex items-center gap-1.5">
                  Fluxy <Sparkles size={12} className="text-emerald-400" />
                </h3>
                <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" /> Online AI Coach
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg border border-slate-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            {messages.map((msg, i) => {
              const isBot = msg.role === "model";
              return (
                <div key={i} className={`flex gap-2.5 items-start ${!isBot ? "flex-row-reverse" : ""}`}>
                  {/* Sender Avatar */}
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                    isBot ? "bg-slate-900 border-slate-800" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  }`}>
                    {isBot ? (
                      <img src={avatarImg} alt="Bot icon" className="w-5 h-5 object-contain" />
                    ) : (
                      <User size={13} />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed ${
                    isBot 
                      ? "bg-slate-900/40 border border-slate-800/80 text-zinc-200" 
                      : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
                  }`}>
                    {renderMarkdown(msg.parts[0]?.text)}
                  </div>
                </div>
              );
            })}
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-2.5 items-start">
                <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                  <img src={avatarImg} alt="Bot loading" className="w-5 h-5 object-contain animate-bounce" />
                </div>
                <div className="p-3 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-zinc-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Container */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0 animate-in fade-in duration-300">
              {QUICK_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(p.query)}
                  className="px-2.5 py-1 text-[10px] font-semibold rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/30 text-zinc-400 hover:text-zinc-200 transition-colors shadow-sm"
                >
                  {p.text}
                </button>
              ))}
            </div>
          )}

          {/* Input Form */}
          <div className="p-4 bg-slate-900/40 border-t border-slate-800/60 flex items-center gap-2 shrink-0">
            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            {/* Upload Resume Button */}
            <button
              onClick={triggerFileUpload}
              disabled={isLoading}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/30 text-zinc-400 hover:text-zinc-200 transition-colors shrink-0 flex items-center justify-center"
              title="Upload Resume PDF"
              style={{ pointerEvents: 'auto' }}
            >
              <Paperclip size={14} />
            </button>

            <textarea
              rows="1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask Fluxy about jobs, ATS scores..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/40 resize-none max-h-16"
            />
            
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !input.trim()}
              className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-slate-950 transition-colors shrink-0 shadow-lg shadow-emerald-500/10 flex items-center justify-center"
            >
              <Send size={14} />
            </button>
          </div>

        </div>
      )}
    </>
  );
}
