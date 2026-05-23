# 🎓 Software Rafael Pombo (SRP)

<p align="center">
  <img src="frontend_srp/public/Logoprincipal.png" alt="Logo SRP" width="200"/>
</p>

<p align="center">
  <strong>Sistema integral de gestión académica para instituciones educativas</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Django-5.2.4-green?style=flat&logo=django" alt="Django"/>
  <img src="https://img.shields.io/badge/React-19.1.1-blue?style=flat&logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/Expo-54.0-black?style=flat&logo=expo" alt="Expo"/>
  <img src="https://img.shields.io/badge/MySQL-8.0-orange?style=flat&logo=mysql" alt="MySQL"/>
</p>

---

## 📋 Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Características Principales](#-características-principales)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Ejecución](#-ejecución)
- [API Endpoints](#-api-endpoints)
- [Aplicación Móvil](#-aplicación-móvil-expo)
- [Módulos del Sistema](#-módulos-del-sistema)
- [Capturas de Pantalla](#-capturas-de-pantalla)
- [Colores Institucionales](#-colores-institucionales)
- [Autores](#-autores)

---

## 📖 Descripción General

El **Software Rafael Pombo (SRP)** es una plataforma completa desarrollada para facilitar la gestión académica en instituciones educativas. El sistema permite administrar estudiantes, profesores, cursos, materias, calificaciones y generar reportes académicos de manera eficiente.

El proyecto está compuesto por tres componentes principales:
- **Backend API**: Desarrollado con Django REST Framework
- **Frontend Web**: Aplicación React para administradores y coordinadores
- **App Móvil**: Aplicación Expo/React Native para padres y acudientes

---

## ✨ Características Principales

### 🖥️ Panel Web (Coordinación)
- ✅ Gestión completa de estudiantes (CRUD)
- ✅ Importación masiva de estudiantes desde Excel
- ✅ Gestión de profesores, cursos y materias
- ✅ Registro y edición de calificaciones con tablas interactivas
- ✅ Visualización de planillas de notas (Módulo CNO)
- ✅ Generación de reportes en Excel con formato institucional
- ✅ Generación de boletines en PDF (individual o por lotes)
- ✅ Dashboard de estadísticas con gráficos interactivos
- ✅ Sistema de autenticación JWT

### 📱 App Móvil (Acudientes)
- ✅ Login seguro con autenticación JWT
- ✅ Selección de estudiante (para acudientes con varios hijos)
- ✅ Dashboard con promedio general y alertas
- ✅ Consulta de materias y calificaciones
- ✅ Filtro de notas por periodo académico
- ✅ Seguimiento de actividades calificadas
- ✅ Alertas automáticas de notas bajas
- ✅ Interfaz moderna con gradientes y animaciones

---

## 🛠️ Tecnologías Utilizadas

### Backend (API REST)
| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| ![Python](https://img.shields.io/badge/Python-3.13+-blue?logo=python&logoColor=white) | 3.13+ | Lenguaje de programación |
| ![Django](https://img.shields.io/badge/Django-5.2.4-green?logo=django&logoColor=white) | 5.2.4 | Framework web de alto nivel |
| ![DRF](https://img.shields.io/badge/DRF-3.16.0-red?logo=django&logoColor=white) | 3.16.0 | Django REST Framework para APIs |
| ![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange?logo=mysql&logoColor=white) | 8.0+ | Sistema de base de datos relacional |
| ![JWT](https://img.shields.io/badge/JWT-5.5.1-purple?logo=jsonwebtokens&logoColor=white) | 5.5.1 | Autenticación con tokens |
| OpenPyXL | 3.1.5 | Generación de archivos Excel |
| ReportLab | 4.4.3+ | Generación de documentos PDF |
| Pandas | 2.3.1 | Procesamiento de datos |

### Frontend Web
| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| ![React](https://img.shields.io/badge/React-19.1.1-blue?logo=react&logoColor=white) | 19.1.1 | Biblioteca para interfaces de usuario |
| ![Vite](https://img.shields.io/badge/Vite-7.1.2-purple?logo=vite&logoColor=white) | 7.1.2 | Herramienta de construcción rápida |
| ![React Router](https://img.shields.io/badge/React_Router-7.8.2-red?logo=reactrouter&logoColor=white) | 7.8.2 | Enrutamiento SPA |
| Axios | 1.11.0 | Cliente HTTP para peticiones API |
| Chart.js | 4.5.0 | Librería de gráficos interactivos |
| Handsontable | 17.0.1 | Tablas tipo Excel editables |
| SweetAlert2 | 11.23.0 | Alertas y modales elegantes |
| React Hook Form | 7.62.0 | Manejo de formularios |

### App Móvil
| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| ![Expo](https://img.shields.io/badge/Expo-54.0.33-black?logo=expo&logoColor=white) | 54.0.33 | Plataforma de desarrollo React Native |
| ![React Native](https://img.shields.io/badge/React_Native-0.81.5-blue?logo=react&logoColor=white) | 0.81.5 | Framework para apps nativas |
| React Navigation | 7.x | Sistema de navegación |
| Expo Linear Gradient | 15.0.8 | Gradientes visuales |
| Expo Secure Store | 15.0.8 | Almacenamiento seguro de tokens |
| Expo Notifications | 0.32.17 | Notificaciones push |

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTES                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────┐              ┌─────────────────┐          │
│   │   Frontend Web  │              │   App Móvil     │          │
│   │   (React/Vite)  │              │  (Expo/RN)      │          │
│   │   Puerto: 5173  │              │  Expo Go        │          │
│   └────────┬────────┘              └────────┬────────┘          │
│            │                                │                    │
│            │         HTTP/HTTPS             │                    │
│            └───────────────┬────────────────┘                    │
│                            │                                     │
├────────────────────────────┼────────────────────────────────────┤
│                            ▼                                     │
│              ┌─────────────────────────┐                        │
│              │      Backend API        │                        │
│              │   (Django REST)         │                        │
│              │   Puerto: 8000          │                        │
│              └────────────┬────────────┘                        │
│                           │                                      │
│                           ▼                                      │
│              ┌─────────────────────────┐                        │
│              │       MySQL 8.0         │                        │
│              │    Base de Datos        │                        │
│              └─────────────────────────┘                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Estructura del Proyecto

```
Proyecto_SRP/
│
├── 📂 backend/                      # API Django REST Framework
│   ├── 📂 backend_srp/             # Configuración principal Django
│   │   ├── settings.py             # Configuración del proyecto
│   │   ├── urls.py                 # URLs principales
│   │   └── wsgi.py                 # Configuración WSGI
│   ├── 📂 core/                    # Aplicación principal
│   │   ├── models.py               # Modelos de base de datos
│   │   ├── views.py                # Vistas y endpoints
│   │   ├── serializer.py           # Serializadores DRF
│   │   ├── urls.py                 # Rutas de la API
│   │   ├── reportes_views.py       # Generación de reportes
│   │   ├── estadisticas_views.py   # Endpoints de estadísticas
│   │   └── 📂 migrations/          # Migraciones de BD
│   ├── manage.py                   # CLI de Django
│   ├── requirements.txt            # Dependencias Python
│   └── .env                        # Variables de entorno
│
├── 📂 frontend_srp/                # Aplicación Web React
│   ├── 📂 src/
│   │   ├── 📂 api/                # Servicios de conexión API
│   │   │   ├── axios.js           # Configuración Axios
│   │   │   ├── auth.js            # Autenticación
│   │   │   ├── estudiantes.js     # CRUD estudiantes
│   │   │   └── cursos.js          # Gestión de cursos
│   │   ├── 📂 components/         # Componentes React
│   │   │   ├── Sidebar.jsx        # Menú lateral
│   │   │   ├── Calificaciones.jsx # Módulo de notas
│   │   │   ├── ReportesAcademicos.jsx
│   │   │   └── ReportesEstadisticas.jsx
│   │   ├── 📂 pages/              # Páginas principales
│   │   └── 📂 styles/             # Archivos CSS
│   ├── 📂 public/                 # Recursos estáticos
│   ├── package.json               # Dependencias Node
│   └── vite.config.js             # Configuración Vite
│
├── 📂 mobile/                      # App Móvil Expo
│   ├── 📂 src/
│   │   ├── 📂 screens/            # Pantallas de la app
│   │   │   ├── LoginScreen.jsx
│   │   │   ├── DashboardScreen.jsx
│   │   │   ├── HomeScreen.jsx
│   │   │   ├── SubjectDetailScreen.jsx
│   │   │   ├── SeguimientoScreen.jsx
│   │   │   └── NotasScreen.jsx
│   │   ├── 📂 components/         # Componentes reutilizables
│   │   │   ├── MenuCard.jsx
│   │   │   ├── GradeAlert.jsx
│   │   │   └── LowGradeCard.jsx
│   │   ├── 📂 services/           # Conexión con API
│   │   │   └── studentService.js
│   │   ├── 📂 context/            # Estado global (Context API)
│   │   │   └── SessionContext.js
│   │   ├── 📂 navigation/         # Configuración de rutas
│   │   │   └── AppNavigator.jsx
│   │   ├── 📂 styles/             # Estilos y colores
│   │   │   └── colors.js
│   │   └── 📂 config/             # Configuración
│   │       └── api.js             # URL del backend
│   ├── 📂 assets/                 # Imágenes y fuentes
│   ├── app.json                   # Configuración Expo
│   └── package.json               # Dependencias
│
└── README.md                       # Este archivo
```

---

## ⚙️ Instalación

### Prerrequisitos

Asegúrate de tener instalado:

| Software | Versión Mínima | Descarga |
|----------|----------------|----------|
| Python | 3.13+ | [python.org](https://www.python.org/downloads/) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org/) |
| MySQL | 8.0+ | [mysql.com](https://dev.mysql.com/downloads/) |
| Git | 2.x | [git-scm.com](https://git-scm.com/) |
| Expo Go | Última | [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) / [App Store](https://apps.apple.com/app/expo-go/id982107779) |

### 1️⃣ Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd Proyecto_SRP
```

### 2️⃣ Configurar la Base de Datos

```sql
-- Crear la base de datos en MySQL
CREATE DATABASE srp_database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Crear usuario (opcional)
CREATE USER 'srp_user'@'localhost' IDENTIFIED BY 'tu_contraseña';
GRANT ALL PRIVILEGES ON srp_database.* TO 'srp_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3️⃣ Configurar el Backend

```bash
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# Windows (CMD):
venv\Scripts\activate
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Crear archivo .env
```

Crear archivo `.env` en la carpeta `backend/`:

```env
# Configuración de Base de Datos
DB_NAME=srp_database
DB_USER=srp_user
DB_PASSWORD=tu_contraseña
DB_HOST=localhost
DB_PORT=3306

# Django Secret Key
SECRET_KEY=tu_clave_secreta_muy_larga_y_segura

# Debug Mode
DEBUG=True
```

```bash
# Ejecutar migraciones
python manage.py migrate

# Crear superusuario para el admin
python manage.py createsuperuser

# (Opcional) Cargar datos de prueba
python manage.py loaddata initial_data.json
```

### 4️⃣ Configurar el Frontend Web

```bash
cd frontend_srp

# Instalar dependencias
npm install

# (Opcional) Verificar configuración de API
# Editar src/api/axios.js si es necesario
```

### 5️⃣ Configurar la App Móvil

```bash
cd mobile

# Instalar dependencias
npm install

# Configurar la IP del backend
# Editar src/config/api.js
```

En `mobile/src/config/api.js`, cambiar la IP:

```javascript
// Cambiar por la IP de tu computadora en la red local
const API_URL = 'http://192.168.1.XXX:8000';
```

> 💡 **Tip**: Para obtener tu IP local:
> - **Windows**: Ejecutar `ipconfig` en CMD
> - **Linux/Mac**: Ejecutar `ifconfig` o `ip addr`

---

## 🚀 Ejecución

### Iniciar Backend (API)

```bash
cd backend

# Activar entorno virtual
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Iniciar servidor (accesible desde la red local)
python manage.py runserver 0.0.0.0:8000
```

✅ API disponible en: `http://localhost:8000`  
✅ Admin Django: `http://localhost:8000/admin`  
✅ Documentación API: `http://localhost:8000/swagger`

### Iniciar Frontend Web

```bash
cd frontend_srp

# Modo desarrollo
npm run dev

# Modo producción
npm run build
npm run preview
```

✅ Aplicación web disponible en: `http://localhost:5173`

### Iniciar App Móvil

```bash
cd mobile

# Iniciar Expo
npm start
# o
npx expo start

# Limpiar caché si hay problemas
npm run clean
```

Opciones de ejecución:
- **📱 Dispositivo físico**: Escanear QR con Expo Go
- **🤖 Emulador Android**: Presionar `a` en la terminal
- **🍎 Simulador iOS**: Presionar `i` en la terminal (solo Mac)

---

## 🔌 API Endpoints

### Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/token/` | Obtener token JWT |
| POST | `/api/token/refresh/` | Refrescar token |

### Estudiantes
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/estudiantes/` | Listar estudiantes |
| POST | `/api/estudiantes/` | Crear estudiante |
| GET | `/api/estudiantes/{id}/` | Obtener estudiante |
| PUT | `/api/estudiantes/{id}/` | Actualizar estudiante |
| DELETE | `/api/estudiantes/{id}/` | Eliminar estudiante |

### Calificaciones
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/notas/` | Listar notas |
| POST | `/api/notas/` | Registrar nota |
| GET | `/api/notas/estudiante/{id}/` | Notas por estudiante |

### Reportes
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/reportes/notas-excel/` | Descargar Excel de notas |
| GET | `/api/reportes/boletines-pdf/` | Descargar boletines PDF |

### Estadísticas
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/estadisticas/rendimiento/` | Estadísticas de rendimiento |
| GET | `/api/estadisticas/promedios/` | Promedios por curso |

---

## 📱 Aplicación Móvil (Expo)

### Descripción

La aplicación móvil está desarrollada con **Expo** y **React Native**, diseñada específicamente para que los padres y acudientes puedan consultar el rendimiento académico de sus hijos de manera fácil y rápida desde cualquier dispositivo móvil.

### Características Técnicas

- **Framework**: Expo SDK 54 con React Native 0.81
- **Navegación**: React Navigation 7 con Stack Navigator
- **Estado Global**: Context API de React
- **Almacenamiento**: Expo Secure Store para tokens JWT
- **UI/UX**: Diseño moderno con gradientes lineales y animaciones
- **Compatibilidad**: Android e iOS

### Pantallas de la App

| Pantalla | Descripción |
|----------|-------------|
| **Login** | Autenticación con número de documento y contraseña |
| **Selección de Hijo** | Lista de estudiantes asociados al acudiente |
| **Dashboard** | Resumen académico con promedio y alertas |
| **Materias** | Lista de materias con promedios individuales |
| **Detalle de Materia** | Notas por actividad con filtro de periodo |
| **Seguimiento** | Historial completo de calificaciones |
| **Notas Definitivas** | Promedios finales por periodo académico |

### Sistema de Alertas

La app incluye un sistema inteligente de alertas para notas bajas:

- 🔴 Se activan cuando hay notas **menores a 3.0**
- 📢 Aparecen **una sola vez** al ingresar al perfil del estudiante
- 🔄 Se resetean al cerrar sesión o cambiar de estudiante
- 👆 Permiten navegar directamente a la materia afectada

### Configuración de Red

Para que la app se conecte correctamente al backend:

1. **Mismo WiFi**: El celular y la computadora deben estar en la misma red
2. **IP Local**: Configurar la IP en `mobile/src/config/api.js`
3. **Firewall**: Asegurar que el puerto 8000 esté abierto

```javascript
// mobile/src/config/api.js
export const API_CONFIG = {
    BASE_URL: 'http://192.168.1.7:8000', // Cambiar por tu IP
    TIMEOUT: 10000,
};
```

### Comandos Útiles

```bash
# Iniciar en modo desarrollo
npm start

# Iniciar con caché limpio
npm run clean

# Ejecutar en Android
npm run android

# Ejecutar en iOS (solo Mac)
npm run ios

# Verificar errores de código
npm run lint
```

---

## 📊 Módulos del Sistema

### 1. Gestión de Estudiantes
- Registro individual y masivo (importación Excel)
- Búsqueda y filtrado avanzado
- Historial académico completo

### 2. Gestión de Calificaciones
- Registro de notas por actividad
- Tablas editables tipo Excel (Handsontable)
- Cálculo automático de promedios

### 3. Módulo CNO (Consulta de Notas)
- Visualización de planillas completas
- Filtros por curso, materia y periodo
- Código de colores para identificar rendimiento

### 4. Reportes Académicos
- **Excel**: Notas con formato institucional y colores
- **PDF**: Boletines individuales o por lotes (ZIP)

### 5. Estadísticas
- Gráficos de rendimiento por curso
- Comparativas entre periodos
- Indicadores de aprobación/reprobación

---

## 🎨 Colores Institucionales

| Color | Código Hex | Uso | Vista |
|-------|------------|-----|-------|
| Rojo Primario | `#D32F2F` | Color principal, headers | 🔴 |
| Rojo Secundario | `#B71C1C` | Acentos, gradientes | 🔴 |
| Verde Éxito | `#4CAF50` | Notas excelentes (4.0-5.0) | 🟢 |
| Amarillo Advertencia | `#FF9800` | Notas aceptables (3.0-3.9) | 🟡 |
| Rojo Error | `#F44336` | Notas insuficientes (<3.0) | 🔴 |
| Gris Neutro | `#9E9E9E` | Sin calificar (0.00) | ⚪ |

### Escala de Calificaciones

| Rango | Clasificación | Color |
|-------|---------------|-------|
| 4.0 - 5.0 | Excelente | � Verde |
| 3.0 - 3.9 | Aceptable | 🟡 Amarillo |
| 1.0 - 2.9 | Insuficiente | 🔴 Rojo |
| 0.0 | Sin calificar | ⚪ Gris |

---

## 🐛 Solución de Problemas Comunes

### Backend

| Problema | Solución |
|----------|----------|
| Error de conexión MySQL | Verificar credenciales en `.env` |
| Migraciones fallidas | `python manage.py migrate --run-syncdb` |
| CORS error | Verificar `CORS_ALLOWED_ORIGINS` en settings |

### Frontend

| Problema | Solución |
|----------|----------|
| Módulos no encontrados | `npm install` o eliminar `node_modules` |
| Error de compilación | Verificar versión de Node.js |
| API no responde | Verificar que el backend esté corriendo |

### Mobile

| Problema | Solución |
|----------|----------|
| No conecta al backend | Verificar IP en `api.js` y mismo WiFi |
| Expo no carga | `npm run clean` para limpiar caché |
| Error de build | `npx expo doctor` para diagnóstico |

---

## 👥 Autores

<table>
  <tr>
    <td align="center">
      <strong>Harold Santiago Vergara</strong><br>
      <sub>Desarrollador Full Stack</sub>
    </td>
    <td align="center">
      <strong>Sergio Lamos Lozano</strong><br>
      <sub>Desarrollador Full Stack</sub>
    </td>
    <td align="center">
      <strong>Juan Manuel Quintero</strong><br>
      <sub>Desarrollador Full Stack</sub>
    </td>
    <td align="center">
      <strong>Jainer Ivan Gallego</strong><br>
      <sub>Desarrollador Full Stack</sub>
    </td>
  </tr>
</table>

---

## 📄 Licencia

Este proyecto es de uso académico e institucional. Todos los derechos reservados.

---

<p align="center">
  <strong>Software Rafael Pombo (SRP)</strong><br>
  Gestión académica simplificada 🎓
</p>

<p align="center">
  Desarrollado con ❤️ para la comunidad educativa
</p>
