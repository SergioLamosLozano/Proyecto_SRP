import { useContext } from 'react';
import { NotificacionesContext } from '../context/NotificacionesContext';

/**
 * Hook para acceder al sistema de notificaciones desde cualquier componente.
 */
export const useNotificaciones = () => {
    const context = useContext(NotificacionesContext);
    if (!context) {
        throw new Error('useNotificaciones debe usarse dentro de un NotificacionesProvider');
    }
    return context;
};

export default useNotificaciones;
