import React, { createContext, useState, useContext } from 'react';

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
    const [seenAlerts, setSeenAlerts] = useState({});
    const [user, setUser] = useState({ name: 'Acudiente' });
    const [currentStudent, setCurrentStudent] = useState(null);

    const markAsSeen = (childId) => {
        setSeenAlerts((prev) => ({
            ...prev,
            [childId]: true,
        }));
    };

    const resetSession = () => {
        setSeenAlerts({});
        setUser({ name: 'Acudiente' });
        setCurrentStudent(null);
    };

    return (
        <SessionContext.Provider value={{ seenAlerts, markAsSeen, resetSession, user, setUser, currentStudent, setCurrentStudent }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
};
