import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import MenuCard from '../components/MenuCard';
import CustomAlert from '../components/CustomAlert';
import GradeAlert from '../components/GradeAlert';
import LowGradeCard from '../components/LowGradeCard';
import { useSession } from '../context/SessionContext';
import studentService from '../services/studentService';
import { getConsolidatedLowGrades } from '../utils/gradeUtils';
import colors from '../styles/colors';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation, route }) => {
    const { childId } = route.params || {};
    const { seenAlerts, markAsSeen, currentStudent } = useSession();
    
    const [logoutAlertVisible, setLogoutAlertVisible] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [generalAverage, setGeneralAverage] = useState('0.0');
    const [loading, setLoading] = useState(true);
    
    // Low grades logic
    const [lowGrades, setLowGrades] = useState([]); // All low grades for cards
    const [currentAlertIndex, setCurrentAlertIndex] = useState(0);
    const [gradeAlertVisible, setGradeAlertVisible] = useState(false);

    useFocusEffect(
        useCallback(() => {
            if (currentStudent?.id) {
                loadStudentGrades();
            }
        }, [currentStudent])
    );

    const loadStudentGrades = async () => {
        try {
            setLoading(true);
            console.log('📚 Cargando notas del estudiante:', currentStudent.id);
            
            const response = await studentService.getStudentGrades(currentStudent.id);
            
            if (response.success) {
                console.log('✅ Notas cargadas:', response.data);
                setSubjects(response.data);
                
                // Calcular promedio general
                if (response.data.length > 0) {
                    const totalAverage = response.data.reduce((sum, subject) => sum + subject.average, 0);
                    const avg = (totalAverage / response.data.length).toFixed(2);
                    setGeneralAverage(avg);
                }
                
                // Obtener notas bajas
                const consolidated = getConsolidatedLowGrades(response.data);
                setLowGrades(consolidated);

                // Modal logic: Only show if not seen in this session
                if (childId && !seenAlerts[childId]) {
                    if (consolidated.length > 0) {
                        setGradeAlertVisible(true);
                    } else {
                        markAsSeen(childId);
                    }
                }
            } else {
                console.log('❌ Error cargando notas:', response.error);
            }
        } catch (error) {
            console.error('💥 Error en loadStudentGrades:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNextAlert = () => {
        if (currentAlertIndex < lowGrades.length - 1) {
            setCurrentAlertIndex(currentAlertIndex + 1);
        } else {
            handleCloseAlerts();
        }
    };

    const handleCloseAlerts = () => {
        setGradeAlertVisible(false);
        if (childId) {
            markAsSeen(childId);
        }
    };

    const handleViewSubject = (subjectId) => {
        setGradeAlertVisible(false);
        const subject = subjects.find(s => s.id === subjectId);
        if (childId) {
            markAsSeen(childId);
        }
        navigation.navigate('SubjectDetail', { subject });
    };

    const handleLogoutConfirm = () => {
        setLogoutAlertVisible(false);
        navigation.replace('Login');
    };

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
                                onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.replace('SelectChild')}
                                style={styles.backButton}
                            >
                                <MaterialCommunityIcons name="arrow-left" size={24} color={colors.white} />
                            </TouchableOpacity>
                            <View style={styles.logoContainer}>
                                <MaterialCommunityIcons name="shield-check" size={28} color={colors.white} />
                                <Text style={styles.logoText}>Portal Académico</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => setLogoutAlertVisible(true)}
                                style={styles.logoutButton}
                            >
                                <MaterialCommunityIcons name="logout" size={24} color={colors.white} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.welcomeSection}>
                            <Text style={styles.greeting}>Perfil académico de</Text>
                            <Text style={styles.studentName}>{currentStudent?.name || 'Estudiante'}</Text>
                            <Text style={styles.studentGrade}>{currentStudent?.grade || 'Sin grado'}</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.statsRow}
                            onPress={() => navigation.navigate('Notas')}
                        >
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{loading ? '...' : generalAverage}</Text>
                                <Text style={styles.statLabel}>Promedio Gral.</Text>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>100%</Text>
                                <Text style={styles.statLabel}>Asistencia</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.sectionTitle}>Gestión Escolar</Text>

                <View style={styles.menuGrid}>
                    <MenuCard
                        title="Materias"
                        icon="book-open-page-variant"
                        color="#D32F2F"
                        description="Vista general académica"
                        onPress={() => navigation.navigate('Home')}
                    />
                    <MenuCard
                        title="Seguimiento"
                        icon="clipboard-text-clock-outline"
                        color="#1976D2"
                        description="Control de actividades"
                        onPress={() => navigation.navigate('Seguimiento')}
                    />
                    <MenuCard
                        title="Horario"
                        icon="calendar-clock"
                        color="#388E3C"
                        description="Mis clases"
                        onPress={() => navigation.navigate('Horario')}
                    />
                    <MenuCard
                        title="Mensajes"
                        icon="message-text-outline"
                        color="#FBC02D"
                        description="Comunicación"
                        onPress={() => navigation.navigate('Mensajes')}
                    />
                </View>

                <View style={styles.announcementCard}>
                    <View style={styles.announcementIcon}>
                        <MaterialCommunityIcons name="bullhorn-outline" size={24} color={colors.primary} />
                    </View>
                    <View style={styles.announcementContent}>
                        <Text style={styles.announcementTitle}>Próximo Evento</Text>
                        <Text style={styles.announcementText}>Entrega de boletines: Próximo viernes.</Text>
                    </View>
                </View>

                {lowGrades.length > 0 && (
                    <View style={styles.lowGradesSection}>
                        {lowGrades.map((alert) => (
                            <LowGradeCard
                                key={alert.subjectId}
                                subjectName={alert.subjectName}
                                grade={alert.grade}
                                onPress={() => handleViewSubject(alert.subjectId)}
                            />
                        ))}
                    </View>
                )}
            </ScrollView>

            <GradeAlert
                visible={gradeAlertVisible}
                subjectName={lowGrades[currentAlertIndex]?.subjectName}
                grade={lowGrades[currentAlertIndex]?.grade || 0}
                activityName={lowGrades[currentAlertIndex]?.activity}
                onView={() => handleViewSubject(lowGrades[currentAlertIndex]?.subjectId)}
                onNext={handleNextAlert}
                onCancel={handleCloseAlerts}
                isLast={currentAlertIndex === lowGrades.length - 1}
                totalAlerts={lowGrades.length}
            />

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
        paddingBottom: 25,
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35,
    },
    headerContent: {
        paddingHorizontal: 25,
        paddingTop: 10,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: '800',
        marginLeft: 10,
        letterSpacing: 0.5,
    },
    logoutButton: {
        padding: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 12,
    },
    welcomeSection: {
        marginBottom: 25,
    },
    greeting: {
        fontSize: 18,
        color: colors.textSecondary,
    },
    studentName: {
        fontSize: 32,
        fontWeight: '900',
        color: colors.white,
        marginTop: 5,
    },
    studentGrade: {
        fontSize: 16,
        color: colors.textSecondary,
        marginTop: 2,
    },
    statsRow: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderRadius: 20,
        paddingVertical: 20,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 5,
        alignItems: 'center',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: '800',
        color: colors.primary,
    },
    statLabel: {
        fontSize: 13,
        color: colors.textMuted,
        marginTop: 3,
    },
    divider: {
        width: 1,
        height: 40,
        backgroundColor: colors.border,
    },
    scrollContent: {
        padding: 25,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: colors.text,
        marginBottom: 20,
    },
    menuGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    announcementCard: {
        flexDirection: 'row',
        backgroundColor: '#FFE0E0',
        borderRadius: 20,
        padding: 20,
        marginTop: 5,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FFCDD2',
    },
    announcementIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    announcementContent: {
        flex: 1,
    },
    announcementTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.primary,
    },
    announcementText: {
        fontSize: 14,
        color: colors.text,
        marginTop: 2,
    },
    lowGradesSection: {
        marginTop: 15,
    },
});

export default DashboardScreen;
