import React, { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    // FORCE LIGHT MODE
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('dark');
        root.classList.add('light');
        localStorage.setItem('losfer-theme', 'light');
    }, []);

    const value = {
        theme: 'light',
        setTheme: () => console.log('Dark mode is disabled.'),
        darkMode: false,
        setDarkMode: () => console.log('Dark mode is disabled.')
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
