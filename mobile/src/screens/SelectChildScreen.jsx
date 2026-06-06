import React, { useRef, useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    Animated,
    Pressable,
    ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CustomAlert from '../components/CustomAlert';
import colors from '../styles/colors';
import { useSession } from '../context/SessionContext';
import studentService from '../services/studentService';
import * as SecureStore from 'expo-secure-store';

const ChildCard = ({ child, onPress }) => {
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

    return (
        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
            <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={onPress}
                style={styles.card}
            >
                <View style={styles.cardContent}>
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="face-man-profile" size={32} color={colors.primary} />
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.childName}>{child.name}</Text>
                        <Text style={styles.childGrade}>{child.grade}</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textMuted} />
                </View>
            </Pressable>
        </Animated.View>
    );
};

const SelectChildScreen = ({ navigation }) => {
    const { user, setCurrentStudent, resetSession, setUser } = useSession();
    const [logoutAlertVisible, setLogoutAlertVisible] = useState(false);
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadChildren();
    }, []);

    const loadChildren = async () => {
        try {
            setLoading(true);
            setError(null);

            // Obtener el documento del acudiente desde los datos guardados
            const userData = await SecureStore.getItemAsync('user_data');
            
            if (!userData) {
                setError('No se encontró información del usuario');
                setLoading(false);
                return;
            }

            const user = JSON.parse(userData);
            const documentoAcudiente = user.username || user.documento;

            console.log('👨‍👩‍👧‍👦 Cargando hijos del acudiente:', documentoAcudiente);

            // Llamar al servicio para obtener los estudiantes
            const response = await studentService.getStudentsByParent(documentoAcudiente);

            if (response.success) {
                console.log('✅ Hijos cargados:', response.data);
                setChildren(response.data);
                
                // Actualizar el nombre del usuario si viene en la respuesta
                if (response.userName) {
                    const updatedUser = { ...user, name: response.userName };
                    await SecureStore.setItemAsync('user_data', JSON.stringify(updatedUser));
                    setUser(updatedUser);
                }
                
                if (response.data.length === 0) {
                    setError('No se encontraron estudiantes asociados a tu cuenta.');
                }
            } else {
                console.log('❌ Error cargando hijos:', response.error);
                setError(response.error || 'No se pudieron cargar los estudiantes.');
            }
        } catch (error) {
            console.error('💥 Error en loadChildren:', error);
            setError('Error al cargar los estudiantes. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectChild = (child) => {
        setCurrentStudent(child);
        navigation.navigate('Dashboard', { childId: child.id });
    };

    const handleLogoutConfirm = () => {
        setLogoutAlertVisible(false);
        resetSession();
        navigation.replace('Login');
    };

    // Usar el nombre del usuario, no el username (cédula)
    const displayName = user?.name || 'Acudiente';

    return (
        <View style={styles.mainContainer}>
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={[colors.primary, colors.secondary]}
                style={styles.headerGradient}
            >
                <SafeAreaView>
                    <View style={styles.headerContent}>
                        <View style={styles.topRow}>
                            <TouchableOpacity
                                onPress={() => navigation.replace('Login')}
                                style={styles.backButton}
                            >
                                <MaterialCommunityIcons name="arrow-left" size={24} color={colors.white} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setLogoutAlertVisible(true)}
                                style={styles.logoutButton}
                            >
                                <MaterialCommunityIcons name="logout" size={24} color={colors.white} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.headerTextContainer}>
                            <MaterialCommunityIcons name="family-tree" size={60} color={colors.white} />
                            <Text style={styles.title}>Hola, {displayName}</Text>
                            <Text style={styles.subtitle}>
                                Elige al estudiante para ver su información académica.
                            </Text>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollPadding}
            >
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={styles.loadingText}>Cargando estudiantes...</Text>
                    </View>
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <MaterialCommunityIcons name="alert-circle-outline" size={60} color={colors.error} />
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={loadChildren}>
                            <Text style={styles.retryButtonText}>Reintentar</Text>
                        </TouchableOpacity>
                    </View>
                ) : children.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="account-off-outline" size={60} color={colors.textMuted} />
                        <Text style={styles.emptyText}>No hay estudiantes asociados</Text>
                    </View>
                ) : (
                    children.map((child) => (
                        <ChildCard
                            key={child.id}
                            child={child}
                            onPress={() => handleSelectChild(child)}
                        />
                    ))
                )}
            </ScrollView>

            <CustomAlert
                visible={logoutAlertVisible}
                type="info"
                title="Cerrar sesión"
                message="¿Estás seguro de que deseas volver al inicio de sesión?"
                showCancel={true}
                cancelText="Cancelar"
                okText="Sí, salir"
                onCancel={() => setLogoutAlertVisible(false)}
                onClose={handleLogoutConfirm}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.background,
    },
    headerGradient: {
        paddingBottom: 30,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    backButton: {
        padding: 5,
    },
    logoutButton: {
        padding: 5,
    },
    headerTextContainer: {
        alignItems: 'center',
        marginTop: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: colors.white,
        marginTop: 15,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        color: colors.textSecondary,
        marginTop: 8,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    content: {
        flex: 1,
        marginTop: 20,
    },
    scrollPadding: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 20,
        marginBottom: 15,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(211, 47, 47, 0.1)', // primary color with opacity
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    infoContainer: {
        flex: 1,
    },
    childName: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 4,
    },
    childGrade: {
        fontSize: 14,
        color: colors.textMuted,
        fontWeight: '500',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
        color: colors.textMuted,
        fontWeight: '500',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 30,
    },
    errorText: {
        marginTop: 15,
        fontSize: 16,
        color: colors.error,
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 10,
    },
    retryButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        marginTop: 15,
        fontSize: 16,
        color: colors.textMuted,
        textAlign: 'center',
    },
});

export default SelectChildScreen;
