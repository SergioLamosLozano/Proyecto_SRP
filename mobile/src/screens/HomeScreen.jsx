import React, { useState, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import SubjectCard from '../components/SubjectCard';
import CustomAlert from '../components/CustomAlert';
import { useSession } from '../context/SessionContext';
import studentService from '../services/studentService';
import colors from '../styles/colors';

const HomeScreen = ({ navigation }) => {
    const { currentStudent } = useSession();
    const [logoutAlertVisible, setLogoutAlertVisible] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            if (currentStudent?.id) {
                loadSubjects();
            }
        }, [currentStudent])
    );

    const loadSubjects = async () => {
        try {
            setLoading(true);
            console.log('📚 Cargando materias del estudiante:', currentStudent.id);
            
            const response = await studentService.getStudentGrades(currentStudent.id);
            
            if (response.success) {
                console.log('✅ Materias cargadas:', response.data);
                setSubjects(response.data);
            } else {
                console.log('❌ Error cargando materias:', response.error);
            }
        } catch (error) {
            console.error('💥 Error en loadSubjects:', error);
        } finally {
            setLoading(false);
        }
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
                                onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Dashboard')}
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
                        <View style={styles.studentInfo}>
                            <MaterialCommunityIcons name="account-circle" size={80} color={colors.white} />
                            <Text style={styles.studentName}>{currentStudent?.name || 'Estudiante'}</Text>
                            <Text style={styles.studentGrade}>{currentStudent?.grade || 'Sin grado'}</Text>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollPadding}
            >
                <Text style={styles.sectionTitle}>Materias Inscritas</Text>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={styles.loadingText}>Cargando materias...</Text>
                    </View>
                ) : subjects.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="book-off-outline" size={60} color={colors.textMuted} />
                        <Text style={styles.emptyText}>No hay materias registradas</Text>
                    </View>
                ) : (
                    subjects.map((subject) => (
                        <SubjectCard
                            key={subject.id}
                            subject={subject}
                            onPress={() => navigation.navigate('SubjectDetail', { subject })}
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
    },
    backButton: {
        padding: 10,
    },
    logoutButton: {
        padding: 10,
    },
    studentInfo: {
        alignItems: 'center',
        marginTop: 10,
    },
    studentName: {
        fontSize: 24,
        fontWeight: '800',
        color: colors.white,
        marginTop: 15,
    },
    studentGrade: {
        fontSize: 16,
        color: colors.textSecondary,
        marginTop: 5,
    },
    content: {
        flex: 1,
    },
    scrollPadding: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: colors.text,
        marginBottom: 20,
        textAlign: 'center',
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

export default HomeScreen;
