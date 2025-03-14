import React, { createContext, useState, useEffect, useContext } from 'react';

import axios from 'axios';
import {useNavigate} from "react-router-dom";



export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);
    const navigate = useNavigate(); // Pour gérer la redirection après connexion réus

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        setIsLoggedIn(!!token && !!userId);
        setUserId(userId);
        setToken(token);
    }, []);



    const login = async (username, password) => {
        try {
            console.log(username,password,"sdfdgxhfg");
            console.log(username, password);
            const response = await axios.post("http://localhost:3000/login", {
                name: username,
                user_pass: password,
            });

            console.log(username,password,"sdfdgxhfg",response);
 // Pour gérer la redirection après connexion réussie
            console.log(Object.values(Object.values(response)[0][7]))
            console.log(Object.values(Object.values(response)[0]))

            console.log((Object.values(response)[0]))
            let tab = []
            tab.push(Object.values((response)[0]))
            tab.push(Object.values(Object.values(response)[0][7]))

            Object.values(Object.values(response)[0][7])

            //     localStorage.setItem('userinfo',Object.values(response) );
            localStorage.setItem('userinfo',tab );
            console.log( localStorage.getItem('userinfo') );
            navigate("/groupe");

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
