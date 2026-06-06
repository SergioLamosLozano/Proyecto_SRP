# 📱 App Móvil - Sistema de Gestión Académica

Aplicación móvil desarrollada con **React Native** y **Expo** para padres de familia, permitiendo el seguimiento académico de sus hijos en tiempo real.

## 🚀 Características Principales

- ✅ **Autenticación Segura**: Login con usuario/contraseña y autenticación biométrica (huella/rostro)
- 📊 **Visualización de Notas**: Consulta de calificaciones por materia y actividad
- 📅 **Horario de Clases**: Visualización del horario semanal del estudiante
- 🔔 **Notificaciones Push**: Alertas de notas bajas y eventos importantes
- 💬 **Mensajería**: Comunicación con docentes y administración
- 📈 **Seguimiento Académico**: Monitoreo del progreso y promedio general
- 👨‍👩‍👧‍👦 **Multi-estudiante**: Gestión de múltiples hijos desde una cuenta

## 📋 Requisitos Previos

- **Node.js** >= 18.x
- **npm** o **yarn**
- **Expo CLI**: `npm install -g expo-cli`
- **Expo Go** (para pruebas en dispositivo físico)
- **Android Studio** o **Xcode** (para emuladores)

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
cd mobile
```

2. **Instalar dependencias**
```bash
npm install
# o
yarn install
```

3. **Configurar variables de entorno**

Edita el archivo `src/config/api.js` y configura la URL del backend:

```javascript
export const API_BASE_URL = __DEV__ 
  ? 'http://TU_IP_LOCAL:8000/api'  // Desarrollo
  : 'https://tu-dominio.com/api';   // Producción
```

> **Nota**: Para pruebas en dispositivo físico, usa tu IP local (ej: `http://192.168.1.100:8000/api`)

## 🏃 Ejecución

### Modo Desarrollo

```bash
# Iniciar servidor de desarrollo
npm start

# Iniciar en Android
npm run android

# Iniciar en iOS
npm run ios

# Iniciar en Web
npm run web

# Limpiar caché
npm run clean
```

### Escanear QR con Expo Go

1. Ejecuta `npm start`
2. Escanea el código QR con:
   - **Android**: App Expo Go
   - **iOS**: Cámara nativa

## 📁 Estructura del Proyecto

```
mobile/
├── app/                          # Configuración de Expo Router
│   ├── _layout.jsx              # Layout principal
│   └── index.jsx                # Punto de entrada
├── assets/                       # Recursos estáticos
│   └── images/                  # Imágenes e iconos
├── src/
│   ├── components/              # Componentes reutilizables
│   │   ├── ActivityItem.jsx    # Item de actividad
│   │   ├── CustomAlert.jsx     # Alertas personalizadas
│   │   ├── GradeAlert.jsx      # Alerta de notas bajas
│   │   ├── GradeItem.jsx       # Item de calificación
│   │   ├── LowGradeCard.jsx    # Tarjeta de nota baja
│   │   ├── MenuCard.jsx        # Tarjeta de menú
│   │   └── SubjectCard.jsx     # Tarjeta de materia
│   ├── config/                  # Configuración
│   │   └── api.js              # URLs y endpoints del backend
│   ├── constants/               # Constantes globales
│   │   └── index.js            # Valores reutilizables
│   ├── context/                 # Context API
│   │   ├── NotificacionesContext.js  # Estado de notificaciones
│   │   └── SessionContext.js         # Estado de sesión
│   ├── hooks/                   # Custom Hooks
│   │   ├── useAuth.js          # Hook de autenticación
│   │   └── useNotificaciones.js # Hook de notificaciones
│   ├── models/                  # Modelos de datos
│   │   └── subjectsData.js     # Datos de ejemplo (temporal)
│   ├── navigation/              # Navegación
│   │   └── AppNavigator.jsx    # Configuración de rutas
│   ├── screens/                 # Pantallas principales
│   │   ├── DashboardScreen.jsx      # Dashboard principal
│   │   ├── HomeScreen.jsx           # Pantalla de inicio
│   │   ├── HorarioScreen.jsx        # Horario de clases
│   │   ├── LoginScreen.jsx          # Inicio de sesión
│   │   ├── MensajesScreen.jsx       # Mensajes
│   │   ├── NotasScreen.jsx          # Notas y calificaciones
│   │   ├── SeguimientoScreen.jsx    # Seguimiento académico
│   │   ├── SelectChildScreen.jsx    # Selección de hijo
│   │   └── SubjectDetailScreen.jsx  # Detalle de materia
│   ├── services/                # Servicios
│   │   ├── apiService.js            # Cliente HTTP centralizado
│   │   └── notificacionesService.js # Servicio de notificaciones
│   ├── styles/                  # Estilos globales
│   │   └── colors.js           # Paleta de colores
│   └── utils/                   # Utilidades
│       └── gradeUtils.js       # Funciones para notas
├── .gitignore
├── app.json                     # Configuración de Expo
├── package.json
└── README.md
```

## 🎨 Paleta de Colores

```javascript
primary: '#D32F2F'      // Rojo principal
secondary: '#C62828'    // Rojo oscuro
background: '#F5F7FA'   // Fondo claro
white: '#FFFFFF'
text: '#2C3E50'         // Texto principal
textMuted: '#7F8C8D'    // Texto secundario
```

## 🔐 Autenticación

### Credenciales de Prueba

```
Usuario: juan
Contraseña: 123
```

### Flujo de Autenticación

1. **Login Manual**: Usuario y contraseña
2. **Autenticación Biométrica**: Huella o reconocimiento facial (opcional)
3. **Tokens JWT**: Almacenamiento seguro con `expo-secure-store`
4. **Refresh Token**: Renovación automática de sesión

## 📲 Notificaciones

### Configuración

Las notificaciones se configuran automáticamente al iniciar sesión por primera vez.

### Tipos de Notificaciones

- 🔴 **Notas Bajas**: Alerta cuando una calificación es < 3.0
- 📅 **Eventos**: Recordatorios de reuniones y actividades
- 💬 **Mensajes**: Nuevos mensajes de docentes

### Limitaciones en Expo Go

> ⚠️ **Importante**: Las notificaciones push remotas NO funcionan en Expo Go (SDK 53+). Para probar notificaciones push reales, genera un **Development Build** o **APK de producción**.

## 🔗 Integración con Backend

### Endpoints Principales

```javascript
// Autenticación
POST /api/auth/login/
POST /api/auth/logout/
POST /api/auth/token/refresh/

// Estudiantes
GET /api/estudiantes/
GET /api/estudiantes/:id/
GET /api/estudiantes/:id/notas/
GET /api/estudiantes/:id/horario/

// Materias
GET /api/materias/
GET /api/materias/:id/
GET /api/materias/:id/actividades/

// Notificaciones
GET /api/notificaciones/
POST /api/notificaciones/registrar-token/
PATCH /api/notificaciones/:id/marcar-leida/

// Mensajes
GET /api/mensajes/
POST /api/mensajes/enviar/
```

### Configuración del Cliente HTTP

El servicio `apiService.js` maneja automáticamente:
- ✅ Inyección de tokens JWT
- ✅ Refresh automático de tokens
- ✅ Manejo de errores HTTP
- ✅ Timeout de peticiones
- ✅ Interceptores de request/response

## 🧪 Testing

```bash
# Ejecutar linter
npm run lint

# Limpiar caché y reiniciar
npm run clean
```

## 📦 Build de Producción

### Android (APK)

```bash
# Configurar EAS
npm install -g eas-cli
eas login

# Build de desarrollo
eas build --profile development --platform android

# Build de producción
eas build --profile production --platform android
```

### iOS (IPA)

```bash
# Build de desarrollo
eas build --profile development --platform ios

# Build de producción
eas build --profile production --platform ios
```

## 🐛 Solución de Problemas

### Error: "Network request failed"

- Verifica que el backend esté corriendo
- Usa tu IP local en lugar de `localhost` para dispositivos físicos
- Revisa el firewall y permisos de red

### Notificaciones no funcionan

- En Expo Go, solo funcionan notificaciones locales
- Para push remoto, genera un Development Build
- Verifica permisos de notificaciones en el dispositivo

### Autenticación biométrica no disponible

- Verifica que el dispositivo tenga sensor biométrico
- Asegúrate de tener al menos una huella/rostro registrado
- Revisa permisos de la app

## 📚 Tecnologías Utilizadas

- **React Native** 0.81.5
- **Expo** ~54.0
- **Expo Router** ~6.0
- **React Navigation** 7.x
- **Expo Notifications** ~0.32
- **Expo Local Authentication** ~17.0
- **Expo Secure Store** ~15.0
- **React Native Reanimated** ~4.1
- **React Native Gesture Handler** ~2.28

## 👥 Equipo de Desarrollo

Desarrollado para el **Sistema de Gestión Académica** del colegio.

## 📄 Licencia

Este proyecto es privado y de uso exclusivo para la institución educativa.

---

**Última actualización**: Mayo 2026
