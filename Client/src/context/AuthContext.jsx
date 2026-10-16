import { useState, useEffect } from "react";
import React from 'react';
export const authContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);  
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Simulate an API call to fetch user data
            setTimeout(() => {
                setUser({ id: 1, name: 'John Doe' });
                setLoading(false);
            }, 1000);
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <authContext.Provider value={{ user, loading }}>
            {children}
        </authContext.Provider>
    )
}