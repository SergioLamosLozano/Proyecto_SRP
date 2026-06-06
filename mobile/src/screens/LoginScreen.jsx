import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    SafeAreaView,
    Pressable,
    Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import CustomAlert from '../components/CustomAlert';
import { useAuth } from '../hooks/useAuth';
import { useSession } from '../context/SessionContext';
import { useNotificaciones } from '../hooks/useNotificaciones';
import colors from '../styles/colors';

const LoginScreen = ({ navigation }) => {
    const { resetSession } = useSession();
    const { inicializarNotificacionesRelajado } = useNotificaciones();
    const {
        username,
        setUsername,
        password,
        setPassword,
        isBiometricActive,
        alertConfig,
        handleLogin,
        handleBiometricAuth,
        closeAlert
    } = useAuth(navigation);

    const [showPassword, setShowPassword] = useState(false);
    const scaleValue = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleValue, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleValue, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    useEffect(() => {
        inicializarNotificacionesRelajado();
    }, []);

    useFocusEffect(
        useCallback(() => {
            resetSession();
        }, [])
    );

    return (
        <LinearGradient
            colors={[colors.primary, colors.secondary]}
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.header}>
                            <Image
                                source={require('../../assets/images/Logo.png')}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                            <Text style={styles.welcomeTitle}>¡Bienvenido!</Text>
                            <Text style={styles.welcomeSubtitle}>
                                Inicia sesión para gestionar tus actividades administrativas.
                            </Text>
                        </View>

                        <View style={styles.card}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Usuario</Text>
                                <View style={styles.inputWrapper}>
                                    <MaterialCommunityIcons name="account-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="juan"
                                        placeholderTextColor="#999"
                                        value={username}
                                        onChangeText={setUsername}
                                        autoCapitalize="none"
                                    />
                                </View>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Contraseña</Text>
                                <View style={styles.inputWrapper}>
                                    <MaterialCommunityIcons name="lock-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="••••••••"
                                        placeholderTextColor="#999"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={!showPassword}
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowPassword(!showPassword)}
                                        style={styles.eyeIcon}
                                    >
                                        <MaterialCommunityIcons
                                            name={showPassword ? "eye-off-outline" : "eye-outline"}
                                            size={20}
                                            color={colors.textMuted}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <TouchableOpacity style={styles.forgotPassword}>
                                <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
                            </TouchableOpacity>

                            <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
                                <Pressable
                                    onPressIn={handlePressIn}
                                    onPressOut={handlePressOut}
                                    onPress={handleLogin}
                                    style={styles.button}
                                >
                                    <Text style={styles.buttonText}>Ingresar</Text>
                                </Pressable>
                            </Animated.View>

                            {isBiometricActive && (
                                <>
                                    <View style={styles.dividerContainer}>
                                        <View style={styles.dividerLine} />
                                        <Text style={styles.dividerText}>o ingresa con</Text>
                                        <View style={styles.dividerLine} />
                                    </View>

                                    <TouchableOpacity 
                                        style={styles.biometricButton}
                                        onPress={handleBiometricAuth}
                                    >
                                        <MaterialCommunityIcons 
                                            name="fingerprint" 
                                            size={40} 
                                            color={colors.primary} 
                                        />
                                        <Text style={styles.biometricText}>Acceso Biométrico</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>¿No tienes una cuenta? </Text>
                            <TouchableOpacity>
                                <Text style={styles.footerLink}>Contáctanos</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>

            <CustomAlert
                visible={alertConfig.visible}
                type={alertConfig.type}
                title={alertConfig.title}
                message={alertConfig.message}
                onClose={alertConfig.onConfirm || closeAlert}
                showCancel={alertConfig.showCancel}
                onCancel={alertConfig.onCancel}
                okText={alertConfig.okText}
                cancelText={alertConfig.cancelText}
            />
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 25,
        paddingVertical: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    welcomeTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: colors.white,
        marginBottom: 10,
        letterSpacing: 0.5,
    },
    welcomeSubtitle: {
        fontSize: 15,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 20,
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 24,
        padding: 30,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 15,
        elevation: 8,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 8,
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: 15,
        height: 55,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: colors.text,
        height: '100%',
    },
    eyeIcon: {
        padding: 5,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 25,
    },
    forgotPasswordText: {
        color: colors.primary,
        fontSize: 13,
        fontWeight: '500',
    },
    button: {
        backgroundColor: colors.primary,
        borderRadius: 14,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 1,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
    },
    footerText: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 14,
    },
    footerLink: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '700',
        textDecorationLine: 'underline',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: colors.border,
    },
    dividerText: {
        marginHorizontal: 15,
        color: colors.textMuted,
        fontSize: 12,
        fontWeight: '500',
    },
    biometricButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surface,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border,
        paddingVertical: 12,
    },
    biometricText: {
        marginLeft: 10,
        fontSize: 15,
        fontWeight: '600',
        color: colors.text,
    },
});

export default LoginScreen;
