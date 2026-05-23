import React, { useState, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    FlatList,
    ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import ActivityItem from '../components/ActivityItem';
import { useSession } from '../context/SessionContext';
import studentService from '../services/studentService';
import colors from '../styles/colors';

const SeguimientoScreen = ({ navigation }) => {
    const { currentStudent } = useSession();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            if (currentStudent?.id) {
                loadActivities();
            }
        }, [currentStudent])
    );

    const loadActivities = async () => {
        try {
            setLoading(true);
            const response = await studentService.getStudentGrades(currentStudent.id);
            
            if (response.success) {
                // Extraer todas las actividades de todas las materias
                const allActivities = response.data.flatMap(subject =>
                    subject.grades.map(grade => ({
                        ...grade,
                        subjectName: subject.name,
                        subjectIcon: subject.icon
                    }))
                );
                setActivities(allActivities);
            }
        } catch (error) {
            console.error('Error cargando actividades:', error);
        } finally {
            setLoading(false);
        }
    };

    const sobresalientes = activities.filter(a => a.grade >= 4.0).length;

    return (
        <View style={styles.mainContainer}>
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={[colors.primary, colors.secondary]}
                style={styles.headerGradient}
            >
                <SafeAreaView>
                    <View style={styles.headerContent}>
                        <View style={styles.headerTop}>
                            <TouchableOpacity
                                onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Dashboard')}
                                style={styles.backButton}
                            >
                                <MaterialCommunityIcons name="arrow-left" size={24} color={colors.white} />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>Seguimiento</Text>
                            <View style={{ width: 44 }} />
                        </View>
                        <View style={styles.summaryBox}>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryCount}>{loading ? '...' : activities.length}</Text>
                                <Text style={styles.summaryLabel}>Actividades</Text>
                            </View>
                            <View style={styles.summaryDivider} />
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryCount}>
                                    {loading ? '...' : sobresalientes}
                                </Text>
                                <Text style={styles.summaryLabel}>Sobresalientes</Text>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.loadingText}>Cargando actividades...</Text>
                </View>
            ) : (
                <FlatList
                    data={activities}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <ActivityItem activity={item} />}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={() => (
                        <Text style={styles.sectionTitle}>Registro de Calificaciones</Text>
                    )}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <MaterialCommunityIcons name="clipboard-text-outline" size={60} color={colors.border} />
                            <Text style={styles.emptyText}>No hay actividades registradas aún.</Text>
                        </View>
                    )}
                />
            )}
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
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: colors.white,
        letterSpacing: 0.5,
    },
    summaryBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    summaryItem: {
        flex: 1,
        alignItems: 'center',
    },
    summaryCount: {
        fontSize: 28,
        fontWeight: '900',
        color: colors.white,
    },
    summaryLabel: {
        fontSize: 13,
        color: colors.textSecondary,
        marginTop: 2,
    },
    summaryDivider: {
        width: 1,
        height: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    listContent: {
        paddingHorizontal: 25,
        paddingTop: 20,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: colors.text,
        marginBottom: 20,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        fontSize: 16,
        color: colors.textMuted,
        marginTop: 15,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: colors.textMuted,
    },
});

export default SeguimientoScreen;
