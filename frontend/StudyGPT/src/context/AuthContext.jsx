import React, {createContext, useContext, useState, useEffect } from "react";

// this is a context -- a pipeline where all auth related data is made available globally to all children of <App/> Component
// we can use this context anywhere, so prop drilling is avoided
const AuthContext = createContext();

// making a function for this, to get context in one line rather than tyoing this whole code again and again
export const useAuth = () => {
    // useContext gets the value (or data) of AuthContext
    const context = useContext(AuthContext);
    // error --- if <App/> is not wrapped within <AuthProvider> (after wrapping AuthProvider will give data to all children of App component) then context wont be available
    if(!context){
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

// argument { children } means anything inside AuthProvider is JSX component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuthStatus();
    }, []); // empty dependency array -- run only once, when the component first mounts

    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            
            // local storage saves only strings 
            const userStr = localStorage.getItem('user');

            if(token && userStr) {
                const userData = JSON.parse(userStr);
                setUser(userData);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Auth check failed:', error)
            logout();
        } finally {
            // runs not matter success or failure
            setLoading(false);
        }
    };

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        // again, localStorage only stores string
        localStorage.setItem('user', JSON.stringify(userData));
        
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        setUser(null);
        setIsAuthenticated(false);
        // redirect to root page
        window.location.href = '/'
    };

    const updateUser = (updatedUserData) => {
        // spreading both (see how spreading looks like if you forgot) and last one overrides the same field
        const newUserData = {...user, ...updatedUserData};
        localStorage.setItem('user', JSON.stringify(newUserData));
        setUser(newUserData);
    };

    // everything related to authentication --- made available global
    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        updateUser,
        checkAuthStatus
    };

    // provider provides value of whatever context it is called with (here AuthContext so all auth related values are shared globally in the App)
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}