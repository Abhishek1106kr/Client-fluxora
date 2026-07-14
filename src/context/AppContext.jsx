import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    axios.defaults.withCredentials = true;

    const backendUrl = "http://localhost:5002";
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);

    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        return savedTheme || (prefersDark ? "dark" : "light");
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    const getUserData = async () => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${backendUrl}/api/user/data`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            if (data.success) {
                setUserData(data.user);
                if (data.user.role) {
                    localStorage.setItem("role", data.user.role);
                }
                return data.user;
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getAuthState = async () => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.post(`${backendUrl}/api/auth/is-Auth`, {}, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            if (data.success) {
                setIsLoggedIn(true);
                getUserData();
            }
        } catch (error) {
            console.error("Auth check failed:", error.message);
        }
    };

    useEffect(() => {
        getAuthState();
    }, []);

    const value = {
        backendUrl,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        getUserData,
        getAuthState,
        theme,
        toggleTheme,
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

