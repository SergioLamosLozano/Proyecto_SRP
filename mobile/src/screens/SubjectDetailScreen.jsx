import React, { useState, useEffect } from 'react';
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
import { Picker } from '@react-native-picker/picker';
import GradeItem from '../components/GradeItem';
import { useSession } from '../context/SessionContext';
import studentService from '../services/studentService';
import colors from '../styles/colors';
import { nombrePeriodoPorId } from '../utils/periodo';

const SubjectDetailScreen = ({ route, navigation }) => {
    const { subject, allDefinitivas: allDefsInit, activePeriodo } = route.params;
    const { currentStudent } = useSession();

    // El selector inicia en el periodo activo (mismo que ve la card / dashboard)
    const [periodos, setPeriodos] = useState([]);
    const [selectedPeriodo, setSelectedPeriodo] = useState(
        activePeriodo ? String(activePeriodo) : 'todos'
    );
    const [filteredGrades, setFilteredGrades] = useState([]);
    const [average, setAverage] = useState(subject.average);
    const [averageLabel, setAverageLabel] = useState('Promedio');
    const [allDefinitivas] = useState(allDefsInit || []);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPeriodos();
    }, []);

    useEffect(() => {
        filterGradesByPeriod();
    }, [selectedPeriodo]);

    const loadPeriodos = async () => {
        try {
            setLoading(true);
            const response = await studentService.getPeriodos();
            
            if (response.success) {
                setPeriodos(response.data);
            }
        } catch (error) {
            console.error('Error cargando periodos:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterGradesByPeriod = () => {
        // Cuando hay periodo seleccionado mostramos LA DEFINITIVA OFICIAL
        // (ponderada por %actividad y %RA, calculada en backend), idéntica
        // a la que ve el padre en la web. Esto evita que el badge muestre
        // 3.29 (aritmético) cuando la web muestra 3.25 (oficial).
        if (selectedPeriodo === 'todos') {
            setFilteredGrades(subject.grades || []);
            // Promedio de definitivas oficiales del estudiante en esta materia
            // (a través de todos los periodos en los que tenga definitiva).
            const defsMateria = allDefinitivas.filter(
                d => parseInt(d.fk_id_materia) === parseInt(subject.id)
            );
            if (defsMateria.length > 0) {
                const sum = defsMateria.reduce(
                    (acc, d) => acc + (parseFloat(d.valor_definitiva) || 0), 0
                );
                setAverage(parseFloat((sum / defsMateria.length).toFixed(2)));
                setAverageLabel('Promedio (todos los periodos)');
            } else {
                setAverage(0);
                setAverageLabel('Promedio');
            }
            return;
        }

        // Periodo específico: filtrar las notas que pertenecen a él
        const periodoInt = parseInt(selectedPeriodo);
        const filtered = (subject.grades || []).filter(
            g => parseInt(g.period) === periodoInt
        );
        setFilteredGrades(filtered);

        // Buscar la definitiva oficial del backend para ese (materia, periodo)
        const def = allDefinitivas.find(
            d => parseInt(d.fk_id_materia) === parseInt(subject.id)
              && parseInt(d.fk_id_periodo) === periodoInt
        );
        if (def) {
            setAverage(parseFloat(parseFloat(def.valor_definitiva).toFixed(2)));
            setAverageLabel(`Definitiva ${nombrePeriodoPorId(periodos, periodoInt)}`);
        } else {
            setAverage(0);
            setAverageLabel(`Definitiva ${nombrePeriodoPorId(periodos, periodoInt)}`);
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
                        <TouchableOpacity
                            onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Home')}
                            style={styles.backButton}
                        >
                            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.white} />
                        </TouchableOpacity>

                        <View style={styles.subjectHeader}>
                            <View style={styles.iconContainer}>
                                <MaterialCommunityIcons name={subject.icon} size={40} color={colors.primary} />
                            </View>
                            <Text style={styles.subjectName}>{subject.name}</Text>
                            <View style={styles.averageBadge}>
                                <Text style={styles.averageLabel}>{averageLabel}: </Text>
                                <Text style={styles.averageValue}>{average}</Text>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollPadding}
            >
                {/* Selector de Periodo */}
                <View style={styles.periodSelectorContainer}>
                    <Text style={styles.periodLabel}>Filtrar por periodo:</Text>
                    {loading ? (
                        <ActivityIndicator size="small" color={colors.primary} />
                    ) : (
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={selectedPeriodo}
                                onValueChange={(itemValue) => setSelectedPeriodo(itemValue)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Todos los periodos" value="todos" />
                                {periodos.map((periodo) => (
                                    <Picker.Item 
                                        key={periodo.id} 
                                        label={periodo.nombre} 
                                        value={periodo.id} 
                                    />
                                ))}
                            </Picker>
                        </View>
                    )}
                </View>

                <Text style={styles.sectionTitle}>Detalle de Calificaciones</Text>

                {filteredGrades.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="clipboard-text-off-outline" size={60} color={colors.textMuted} />
                        <Text style={styles.emptyText}>
                            No hay calificaciones para {selectedPeriodo === 'todos' ? 'esta materia' : 'este periodo'}
                        </Text>
                    </View>
                ) : (
                    [...filteredGrades]
                        .sort((a, b) => parseFloat(a.grade) - parseFloat(b.grade))
                        .map((grade) => (
                        <GradeItem
                            key={grade.id}
                            activity={grade.activity}
                            grade={grade.grade}
                        />
                    ))
                )}

                <View style={styles.infoCard}>
                    <MaterialCommunityIcons name="information-outline" size={24} color={colors.primary} />
                    <Text style={styles.infoText}>
                        {selectedPeriodo === 'todos' 
                            ? 'Estas notas corresponden a todos los periodos. Si tienes alguna duda, contacta al docente.'
                            : `Estas notas corresponden al ${nombrePeriodoPorId(periodos, selectedPeriodo)}. Si tienes alguna duda, contacta al docente.`
                        }
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
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    backButton: {
        padding: 10,
        marginLeft: -10,
    },
    subjectHeader: {
        alignItems: 'center',
        marginTop: 5,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    subjectName: {
        fontSize: 26,
        fontWeight: '800',
        color: colors.white,
        marginTop: 15,
    },
    averageBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 20,
        marginTop: 10,
    },
    averageLabel: {
        color: colors.white,
        fontSize: 14,
    },
    averageValue: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '700',
    },
    content: {
        flex: 1,
        marginTop: -10,
    },
    scrollPadding: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 20,
        marginTop: 20,
        marginLeft: 5,
    },
    infoCard: {
        flexDirection: 'row',
        backgroundColor: '#E3F2FD',
        padding: 20,
        borderRadius: 18,
        marginTop: 20,
        alignItems: 'center',
    },
    infoText: {
        flex: 1,
        marginLeft: 15,
        fontSize: 14,
        color: '#1976D2',
        lineHeight: 20,
    },
    periodSelectorContainer: {
        backgroundColor: colors.white,
        padding: 20,
        borderRadius: 18,
        marginTop: 20,
        marginBottom: 10,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    periodLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 10,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: colors.background,
    },
    picker: {
        height: 50,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        marginTop: 15,
        fontSize: 16,
        color: colors.textMuted,
        textAlign: 'center',
    },
});

export default SubjectDetailScreen; 
