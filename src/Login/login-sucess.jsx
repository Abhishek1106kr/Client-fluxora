import { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export default function LoginSuccess(){
    const [searchParams]=useSearchParams();
    const navigate=useNavigate();
    const { getAuthState } = useContext(AppContext);

    useEffect(()=>{
        const token=searchParams.get("token");
        if(token){
            localStorage.setItem("authToken",token);
            getAuthState().then(() => {
                navigate("/dashboard");
            });
        }
        else{
            navigate('/login');
        }
    },[searchParams,navigate,getAuthState])
    return(
        <div className="flex items-center justify-center min-h-screen w-full bg-zinc-950 text-zinc-100">
            <p className="text-sm text-center">Redirecting to Dashboard...</p>
        </div>
    );
}