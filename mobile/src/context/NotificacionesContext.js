import { createContext, useState, useContext, useEffect, useRef } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import { Linking, Platform } from 'react-native';
import NotificacionesService from '../services/notificacionesService';
import CustomAlert from '../components/CustomAlert';

export const NotificacionesContext = createContext();

export const NotificacionesProvider = ({ children }) => {
    const [permissionStatus, setPermissionStatus] = useState('undetermined');
    const [hasCheckedInitial, setHasCheckedInitial] = useState(false);
    
    // Configuración para el componente CustomAlert
    const [alertConfig, setAlertConfig] = useState({
        visible: false,
        type: 'info',
        title: '',
        message: '',
        showCancel: false,
        onClose: () => {},
        onCancel: null,
        okText: 'OK',
        cancelText: 'Cerrar'
    });

    const responseListener = useRef();

    useEffect(() => {
        // Cargar estado inicial
        checkCurrentPermission();
        NotificacionesService.configurarCanalesAndroid();

        // Escuchar cuando el usuario interactúa con una notificación
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('Notificación presionada:', response.notification.request.content);
        });

        return () => {
            if (responseListener.current) {
                Notifications.removeNotificationSubscription(responseListener.current);
            }
        };
    }, []);

    const checkCurrentPermission = async () => {
        const { status } = await Notifications.getPermissionsAsync();
        setPermissionStatus(status);
        const hasAsked = await SecureStore.getItemAsync('hasAskedNotifications');
        if (hasAsked) setHasCheckedInitial(true);
    };

    /**
     * Lógica principal de solicitud
     */
    const inicializarNotificacionesRelajado = async () => {
        const hasAsked = await SecureStore.getItemAsync('hasAskedNotifications');
        
        if (hasAsked) {
            console.log('Ya se solicitó permiso antes, no molestamos.');
            return;
        }

        // Si es la primera vez, pedimos
        solicitarPermisosConDialogo();
    };

    const solicitarPermisosConDialogo = async () => {
        const status = await NotificacionesService.solicitarPermisoNotificaciones();
        await SecureStore.setItemAsync('hasAskedNotifications', 'true');
        setPermissionStatus(status);
        setHasCheckedInitial(true);

        if (status === 'granted') {
            // Intentar obtener el token (fallará silenciosamente si es Expo Go)
            await NotificacionesService.obtenerTokenPush();
            
            const alertMessage = 'Tus notificaciones fueron activadas correctamente. Te mantendremos informado.';

            setAlertConfig({
                visible: true,
                type: 'success',
                title: 'Notificaciones Listas',
                message: alertMessage,
                showCancel: false,
                okText: 'Excelente',
                onClose: () => {
                    setAlertConfig(prev => ({ ...prev, visible: false }));
                    // Notificación de prueba a los 5 segundos
                    console.log('Programando notificación de prueba...');
                    NotificacionesService.programarNotificacionLocal(
                        'Portal Académico',
                        'Prueba exitosa. El sistema está funcionando.',
                        5
                    );
                }
            });
        } else {
            setAlertConfig({
                visible: true,
                type: 'info',
                title: 'Notificaciones Desactivadas',
                message: 'Puedes activarlas luego desde la configuración de tu dispositivo si cambias de opinión.',
                showCancel: false,
                okText: 'Entendido',
                onClose: () => setAlertConfig(prev => ({ ...prev, visible: false }))
            });
        }
    };

    const abrirConfiguracion = () => {
        if (Platform.OS === 'ios') {
            Linking.openURL('app-settings:');
        } else {
            Linking.openSettings();
        }
    };

    return (
        <NotificacionesContext.Provider value={{ 
            permissionStatus, 
            hasCheckedInitial,
            inicializarNotificacionesRelajado,
            solicitarPermisosConDialogo,
            abrirConfiguracion,
            programarPrueba: () => NotificacionesService.programarNotificacionLocal('Prueba', 'Esto es una prueba manual', 2)
        }}>
            {children}
            <CustomAlert 
                visible={alertConfig.visible}
                type={alertConfig.type}
                title={alertConfig.title}
                message={alertConfig.message}
                onClose={alertConfig.onClose}
                showCancel={alertConfig.showCancel}
                onCancel={alertConfig.onCancel}
                okText={alertConfig.okText}
                cancelText={alertConfig.cancelText}
            />
        </NotificacionesContext.Provider>
    );
};

export const useNotificaciones = () => {
    const context = useContext(NotificacionesContext);
    if (!context) {
        throw new Error('useNotificaciones debe usarse dentro de un NotificacionesProvider');
    }
    return context;
};
