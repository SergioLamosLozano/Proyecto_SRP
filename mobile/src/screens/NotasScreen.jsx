import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useSession } from '../context/SessionContext';
import studentService from '../services/studentService';
import colors from '../styles/colors';

const NotasScreen = ({ navigation }) => {
    const { currentStudent } = useSession();
    const [periodos, setPeriodos] = useState([]);
    const [generalAverage, setGeneralAverage] = useState('0.0');
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            if (currentStudent?.id) {
                loadDefinitivas();
            }
        }, [currentStudent])
    );

    const loadDefinitivas = async () => {
        try {
            setLoading(true);
            console.log('📊 Cargando definitivas del estudiante:', currentStudent.id);
            
            const response = await studentService.getStudentDefinitivas(currentStudent.id);
            
            if (response.success) {
                console.log('✅ Definitivas cargadas:', response.data);
                setPeriodos(response.data);
                
                // Calcular promedio general de todos los periodos
                if (response.data.length > 0) {
                    const totalAverage = response.data.reduce((sum, periodo) => sum + periodo.promedio, 0);
                    const avg = (totalAverage / response.data.length).toFixed(2);
                    setGeneralAverage(avg);
                }
            } else {
                console.log('❌ Error cargando definitivas:', response.error);
            }
        } catch (error) {
            console.error('💥 Error en loadDefinitivas:', error);
        } finally {
            setLoading(false);
        }
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
                        <View style={styles.headerTop}>
                            <TouchableOpacity
                                onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Dashboard')}
                                style={styles.backButton}
                            >
                                <MaterialCommunityIcons name="arrow-left" size={24} color={colors.white} />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>Reporte Académico</Text>
                            <View style={{ width: 44 }} />
                        </View>

                        <View style={styles.gpaContainer}>
                            <Text style={styles.gpaLabel}>Promedio Acumulado</Text>
                            <Text style={styles.gpaValue}>{loading ? '...' : generalAverage}</Text>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollPadding}
            >
                <Text style={styles.sectionTitle}>Resumen por Periodo</Text>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={styles.loadingText}>Cargando definitivas...</Text>
                    </View>
                ) : periodos.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="clipboard-text-off-outline" size={60} color={colors.textMuted} />
                        <Text style={styles.emptyText}>No hay definitivas registradas</Text>
                    </View>
                ) : (
                    periodos.map((item, index) => (
                        <View key={index} style={styles.periodCard}>
                            <View style={styles.periodInfo}>
                                <Text style={styles.periodTitle}>Periodo {item.periodo}</Text>
                                <Text style={styles.periodStatus}>
                                    {item.materias.length} {item.materias.length === 1 ? 'materia' : 'materias'}
                                </Text>
                            </View>
                            <View style={[
                                styles.gradeBadge,
                                { backgroundColor: item.promedio >= 3.0 ? '#E3F2FD' : '#FFEBEE' }
                            ]}>
                                <Text style={[
                                    styles.gradeText,
                                    { color: item.promedio >= 3.0 ? colors.primary : colors.error }
                                ]}>
                                    {item.promedio.toFixed(2)}
                                </Text>
                            </View>
                        </View>
                    ))
                )}

                <View style={styles.footerInfo}>
                    <MaterialCommunityIcons name="information" size={20} color={colors.textMuted} />
                    <Text style={styles.footerText}>
                        Este reporte muestra las definitivas consolidadas por periodo. Para ver el detalle por materia, dirígete a la sección de Materias.
                    </Text>
                </View>
            </ScrollView>
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
        fontSize: 20,
        fontWeight: '800',
        color: colors.white,
    },
    gpaContainer: {
        alignItems: 'center',
        marginTop: 5,
    },
    gpaLabel: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 5,
    },
    gpaValue: {
        fontSize: 48,
        fontWeight: '900',
        color: colors.white,
    },
    content: {
        flex: 1,
    },
    scrollPadding: {
        padding: 25,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: colors.text,
        marginBottom: 20,
    },
    periodCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 20,
        marginBottom: 15,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 2,
    },
    periodInfo: {
        flex: 1,
    },
    periodTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text,
    },
    periodStatus: {
        fontSize: 12,
        color: colors.textMuted,
        marginTop: 4,
    },
    gradeBadge: {
        width: 60,
        height: 45,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gradeText: {
        fontSize: 18,
        fontWeight: '900',
    },
    footerInfo: {
        flexDirection: 'row',
        marginTop: 20,
        paddingHorizontal: 10,
        alignItems: 'flex-start',
    },
    footerText: {
        flex: 1,
        fontSize: 13,
        color: colors.textMuted,
        marginLeft: 10,
        lineHeight: 18,
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

export default NotasScreen;
