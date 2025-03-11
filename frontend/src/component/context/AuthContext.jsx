import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        setIsLoggedIn(!!token && !!userId);
        setUserId(userId);
        setToken(token);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post("http://localhost:3000/login", {
                mail: email,
                user_pass: password,
            });
            if (response.status === 201) {
                const { token, userId } = response.data;
                localStorage.setItem('token', token);
                localStorage.setItem('userId', userId);
                setIsLoggedIn(true);
                setUserId(userId);
                setToken(token);
            }
        } catch (error) {
            console.error('Error logging in:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        setUserId(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, userId, login, logout, token }}>
            {children}
        </AuthContext.Provider>
    );
};

// 👇 LA LIGNE IMPORTANTE À AJOUTER 👇
export const useAuth = () => useContext(AuthContext);
