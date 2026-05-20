import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SessionProvider } from '../context/SessionContext';
import { NotificacionesProvider } from '../context/NotificacionesContext';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import HomeScreen from '../screens/HomeScreen';
import SubjectDetailScreen from '../screens/SubjectDetailScreen';
import SeguimientoScreen from '../screens/SeguimientoScreen';
import HorarioScreen from '../screens/HorarioScreen';
import MensajesScreen from '../screens/MensajesScreen';
import NotasScreen from '../screens/NotasScreen';
import SelectChildScreen from '../screens/SelectChildScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    return (
        <SessionProvider>
            <NotificacionesProvider>
                <Stack.Navigator
                    initialRouteName="Login"
                    screenOptions={{
                        headerShown: false,
                    }}
                >
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="SelectChild" component={SelectChildScreen} />
                    <Stack.Screen name="Dashboard" component={DashboardScreen} />
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="SubjectDetail" component={SubjectDetailScreen} />
                    <Stack.Screen name="Seguimiento" component={SeguimientoScreen} />
                    <Stack.Screen name="Horario" component={HorarioScreen} />
                    <Stack.Screen name="Mensajes" component={MensajesScreen} />
                    <Stack.Screen name="Notas" component={NotasScreen} />
                </Stack.Navigator>
            </NotificacionesProvider>
        </SessionProvider>
    );
};

export default AppNavigator;
