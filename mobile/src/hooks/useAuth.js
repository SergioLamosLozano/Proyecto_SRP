import { useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { useSession } from '../context/SessionContext';
import apiService from '../services/apiService';

export const useAuth = (navigation) => {
    const { setUser } = useSession();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isBiometricSupported, setIsBiometricSupported] = useState(false);
    const [isBiometricEnrolled, setIsBiometricEnrolled] = useState(false);
    const [isBiometricActive, setIsBiometricActive] = useState(false);

    const [alertConfig, setAlertConfig] = useState({
        visible: false,
        type: 'success',
        title: '',
        message: '',
        showCancel: false,
        onCancel: null,
        onConfirm: null,
        okText: 'OK',
        cancelText: 'Cancelar'
    });

    useEffect(() => {
        checkBiometricStatus();
    }, []);

    const checkBiometricStatus = async () => {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        const isActive = await SecureStore.getItemAsync('isBiometricActive');

        setIsBiometricSupported(hasHardware);
        setIsBiometricEnrolled(isEnrolled);
        setIsBiometricActive(isActive === 'true');
    };

    const handleLogin = async () => {
        // Validación básica
        if (!username || !password) {
            setAlertConfig({
                visible: true,
                type: 'error',
                title: 'Campos requeridos',
                message: 'Por favor ingresa usuario y contraseña.',
                showCancel: false
            });
            return;
        }

        console.log('🔐 Intentando login con:', username);

        try {
            // Llamada real al backend Django
            const response = await apiService.login(username.toLowerCase(), password);

            console.log('📥 Respuesta de login:', response);

            if (response.success) {
                // El token ya fue guardado por apiService.login()
                // Extraer datos del usuario desde response.data
                const userData = {
                    username: username.toLowerCase(),
                    name: response.data.first_name || 'Usuario',
                    rol: response.data.rol || 'padres',
                    id: response.data.id,
                };
                
                console.log('✅ Login exitoso, datos del usuario:', userData);
                
                // Guardar información adicional del usuario
                await SecureStore.setItemAsync('saved_username', username.toLowerCase());
                await SecureStore.setItemAsync('user_data', JSON.stringify(userData));
                
                setUser(userData);

                // Preguntar por biometría si está disponible
                if (isBiometricSupported && isBiometricEnrolled && !isBiometricActive) {
                    const hasAsked = await SecureStore.getItemAsync('hasAskedBiometrics');
                    if (!hasAsked) {
                        setAlertConfig({
                            visible: true,
                            type: 'info',
                            title: '¿Activar Biometría?',
                            message: '¿Deseas usar tu huella o rostro para ingresar la próxima vez?',
                            showCancel: true,
                            okText: 'Sí, activar',
                            cancelText: 'Ahora no',
                            onCancel: async () => {
                                await SecureStore.setItemAsync('hasAskedBiometrics', 'true');
                                await SecureStore.setItemAsync('isBiometricActive', 'false');
                                closeAlert();
                                navigation.replace('SelectChild');
                            },
                            onConfirm: async () => {
                                await SecureStore.setItemAsync('hasAskedBiometrics', 'true');
                                await SecureStore.setItemAsync('isBiometricActive', 'true');
                                setIsBiometricActive(true);
                                closeAlert();
                                navigation.replace('SelectChild');
                            }
                        });
                        return;
                    }
                }

                // Login exitoso
                setAlertConfig({
                    visible: true,
                    type: 'success',
                    title: 'Inicio de sesión exitoso',
                    message: 'Bienvenido al sistema de gestión académica.',
                    showCancel: false
                });

                setTimeout(() => {
                    setAlertConfig(prev => ({ ...prev, visible: false }));
                    navigation.replace('SelectChild');
                }, 1500);

            } else {
                // Error de autenticación
                console.log('❌ Error de autenticación:', response.error);
                setAlertConfig({
                    visible: true,
                    type: 'error',
                    title: 'Credenciales no válidas',
                    message: response.error || 'Usuario o contraseña incorrectos.',
                    showCancel: false
                });
            }
        } catch (error) {
            // Error de red o del servidor
            console.error('💥 Error en login:', error);
            setAlertConfig({
                visible: true,
                type: 'error',
                title: 'Error de conexión',
                message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet y que el backend esté corriendo.',
                showCancel: false
            });
        }
    };

    const handleBiometricAuth = async () => {
        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Inicia sesión con tu biometría',
            fallbackLabel: 'Usar contraseña',
            disableDeviceFallback: false,
        });

        if (result.success) {
            try {
                // Verificar si hay un token guardado
                const token = await apiService.getAuthToken();
                const savedUserData = await SecureStore.getItemAsync('user_data');
                
                if (token && savedUserData) {
                    const userData = JSON.parse(savedUserData);
                    setUser(userData);
                    
                    setAlertConfig({
                        visible: true,
                        type: 'success',
                        title: 'Autenticación exitosa',
                        message: 'Ingresando mediante biometría...',
                        showCancel: false
                    });

                    setTimeout(() => {
                        closeAlert();
                        navigation.replace('SelectChild');
                    }, 1000);
                } else {
                    setAlertConfig({
                        visible: true,
                        type: 'error',
                        title: 'Error de Sesión',
                        message: 'Debes iniciar sesión manualmente una vez primero.',
                        showCancel: false
                    });
                }
            } catch (error) {
                setAlertConfig({
                    visible: true,
                    type: 'error',
                    title: 'Error',
                    message: 'No se pudo recuperar la sesión. Inicia sesión nuevamente.',
                    showCancel: false
                });
            }
        }
    };

    const closeAlert = () => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
    };

    return {
        username,
        setUsername,
        password,
        setPassword,
        isBiometricActive: isBiometricSupported && isBiometricEnrolled && isBiometricActive,
        alertConfig,
        handleLogin,
        handleBiometricAuth,
        closeAlert
    };
};
