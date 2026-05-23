import React, { createContext, useState, useContext } from 'react';

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
    const [alertsShownForStudent, setAlertsShownForStudent] = useState({});
    const [user, setUser] = useState({ name: 'Acudiente' });
    const [currentStudent, setCurrentStudent] = useState(null);

    // Marcar que ya se mostraron las alertas para un estudiante
    const markAlertsShown = (childId) => {
        setAlertsShownForStudent((prev) => ({
            ...prev,
            [childId]: true,
        }));
    };

    const resetSession = () => {
        setAlertsShownForStudent({});
        setUser({ name: 'Acudiente' });
        setCurrentStudent(null);
    };

    return (
        <SessionContext.Provider value={{ 
            alertsShownForStudent,
            markAlertsShown,
            resetSession, 
            user, 
            setUser, 
            currentStudent, 
            setCurrentStudent 
        }}>
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
