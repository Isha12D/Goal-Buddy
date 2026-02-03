import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const login = (user) => {
        setCurrentUser(user);
        setError(null);
        localStorage.setItem('token', user.accessToken); // Store token if needed
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('token');
        setError(null);
    };

    const signup = (user) => {
        setCurrentUser(user);
        setError(null);
        localStorage.setItem('token', user.accessToken); // Store token if needed
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, signup, error, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
