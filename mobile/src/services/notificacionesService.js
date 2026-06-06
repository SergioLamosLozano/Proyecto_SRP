import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Configuración de cómo se comportan las notificaciones cuando la app está abierta
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

const NotificacionesService = {
    /**
     * Solicita permisos al sistema operativo para enviar notificaciones.
     * @returns {Promise<string>} 'granted', 'denied', or 'undetermined'
     */
    solicitarPermisoNotificaciones: async () => {
        if (!Device.isDevice) {
            console.log('Debes usar un dispositivo físico para notificaciones push');
            return 'denied';
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            return 'denied';
        }

        return 'granted';
    },

    /**
     * Obtiene el token de Expo para enviar notificaciones push.
     * En Expo Go (SDK 53+), el push remoto no está soportado.
     */
    obtenerTokenPush: async () => {
        if (!Device.isDevice) {
            console.log('Push Token: Ignorado (Simulador)');
            return null;
        }

        // DETECCIÓN DE EXPO GO (SDK 53+)
        // En Expo Go, Constants.appOwnership es 'expo'
        const isExpoGo = Constants.appOwnership === 'expo';
        
        if (isExpoGo) {
            console.warn('PUSH REMOTO: Desactivado automáticamente por estar en Expo Go (SDK 53+).');
            console.info('Para usar Push real, genera una Development Build o un APK.');
            return null;
        }

        try {
            const projectId = Constants.expoConfig?.extra?.eas?.projectId || Constants.expoConfig?.projectId;
            if (!projectId) {
                console.warn('Proyecto sin ProjectId configurado.');
                return null;
            }
            
            const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
            console.log('Push Token (Producción):', token);
            return token;
        } catch (e) {
            console.error('Error obteniendo push token:', e.message);
            return null;
        }
    },

    /**
     * Configura los canales de notificaciones para Android (Requerido para Android 8+)
     */
    configurarCanalesAndroid: async () => {
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'Canal por Defecto',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#D32F2F',
            });
        }
    },

    /**
     * Programa una notificación local para que aparezca después de N segundos.
     */
    programarNotificacionLocal: async (title, body, seconds = 1, data = {}) => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                data,
                sound: true,
                color: '#D32F2F',
            },
            trigger: { seconds },
        });
    },

    /**
     * Cancela todas las notificaciones programadas.
     */
    cancelarNotificacionesPendientes: async () => {
        await Notifications.cancelAllScheduledNotificationsAsync();
    }
};

export default NotificacionesService;
