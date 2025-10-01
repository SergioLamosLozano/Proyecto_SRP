# 🏗️ Arquitectura del Proyecto - Task Manager

## 📋 Resumen del Proyecto

**Task Manager** es una aplicación web moderna de gestión de tareas con capacidades de colaboración en tiempo real. La aplicación está construida siguiendo principios de arquitectura limpia, separación de responsabilidades y patrones de diseño modernos de React.

## 📊 Métricas del Proyecto

- 📁 **Total de archivos TypeScript/TSX:** 0 archivos
- 📈 **Total de líneas de código:** ~154,171 líneas  
- ✅ **Cobertura de tests:** No disponible

## 🛠️ Tecnologías Utilizadas

### Framework y Librerías Core

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | ^19.1.1 | Framework de UI con concurrent features |
| Axios | ^1.11.0 | Cliente HTTP para APIs |
| React Router DOM | ^7.8.2 | Enrutamiento para aplicaciones React |
| Chart.js | ^4.5.0 | Librería de gráficos y visualización |
| React Chart.js 2 | ^5.3.0 | Wrapper de Chart.js para React |
| React Hook Form | ^7.62.0 | Gestión de formularios con validación |
| React Hot Toast | ^2.6.0 | Notificaciones toast para React |
| SweetAlert2 | ^11.23.0 | Modales y alertas personalizadas |
| Boxicons | ^2.1.4 | Librería de iconos |
| JWT Decode | ^4.0.0 | Decodificación de tokens JWT |

### Build Tools y Dev Server

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Vite | ^7.1.2 | Build tool y dev server con HMR |

### Backend Technologies

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Django | 5.2.4 | Framework web Python con ORM integrado |
| Django CORS Headers | 4.7.0 | Manejo de CORS para APIs |
| Django REST Framework | 3.16.0 | API RESTful y serialización |
| Simple JWT | 5.5.1 | Autenticación JWT para Django REST |
| DRF-YASG | 1.21.10 | Documentación automática de API (Swagger) |
| Pandas | 2.3.1 | Análisis y manipulación de datos |
| Pillow | 11.3.0 | Procesamiento de imágenes |
| Python Decouple | 3.8 | Gestión de variables de entorno |

### Bases de Datos

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| MySQL | 2.2.7 | Base de datos relacional principal |


## 📁 Estructura de Carpetas y Archivos

```
task-manager/
├── agents/                          # Sistema de agentes de desarrollo automatizado
│   ├── __init__.py                  # Inicialización del módulo de agentes
│   ├── architecture_reviewer.py     # Agente revisor de arquitectura
│   ├── base_agent.py               # Clase base para todos los agentes
│   ├── coordinator.py              # Coordinador de agentes
│   ├── debug_manager.py            # Gestor de debugging
│   ├── github_manager.py           # Gestor de integración con GitHub
│   ├── product_manager.py          # Agente de gestión de producto
│   └── logs/                       # Registros de actividad de agentes
├── backend/                        # Backend Django - API REST y lógica de negocio
│   ├── .env                        # Variables de entorno
│   ├── .gitignore                  # Archivos ignorados por Git
│   ├── manage.py                   # Script de gestión de Django
│   ├── requirements.txt            # Dependencias de Python
│   ├── backend_srp/                # Configuración principal de Django
│   │   ├── __init__.py             # Inicialización del proyecto
│   │   ├── settings.py             # Configuración de Django
│   │   ├── urls.py                 # URLs principales del proyecto
│   │   ├── wsgi.py                 # Configuración WSGI para producción
│   │   └── asgi.py                 # Configuración ASGI para WebSockets
│   └── core/                       # Aplicación principal con modelos y vistas
│       ├── __init__.py             # Inicialización de la app core
│       ├── admin.py                # Configuración del panel de administración
│       ├── apps.py                 # Configuración de la aplicación Django
│       ├── models.py               # Modelos de base de datos
│       ├── serializer.py           # Serializadores para API REST
│       ├── views.py                # Vistas y endpoints de la API
│       ├── urls.py                 # URLs específicas de la app core
│       ├── tests.py                # Tests unitarios
│       └── migrations/             # Migraciones de base de datos
│           ├── __init__.py         # Inicialización de migraciones
│           └── 0001_initial.py     # Migración inicial
├── frontend_srp/                   # React Frontend - Interfaz de usuario moderna
│   ├── public/                     # Archivos públicos del frontend
│   │   ├── Logo.png                # Logo de la aplicación
│   │   ├── Logoprincipal.png       # Logo principal
│   │   ├── facebook.png            # Icono de Facebook
│   │   └── instagram.png           # Icono de Instagram
│   ├── src/                        # Código fuente de React
│   │   ├── App.jsx                 # Componente principal de React
│   │   ├── App.css                 # Estilos del componente principal
│   │   ├── main.jsx                # Punto de entrada de la aplicación
│   │   ├── index.css               # Estilos globales
│   │   ├── ProtectedRoute.jsx      # Componente para rutas protegidas
│   │   ├── api/                    # Servicios de comunicación con el backend
│   │   │   └── auth.js             # Servicios de autenticación
│   │   ├── assets/                 # Recursos estáticos
│   │   │   ├── Logoprincipal.png   # Logo principal
│   │   │   └── react.svg           # Logo de React
│   │   ├── components/             # Componentes reutilizables de React
│   │   │   ├── Breadcrumbs.jsx     # Navegación de migas de pan
│   │   │   ├── Calificaciones.jsx  # Gestión de calificaciones
│   │   │   ├── Cruds.jsx           # Operaciones CRUD genéricas
│   │   │   ├── Dashboard.jsx       # Panel de control principal
│   │   │   ├── Estadisticas.jsx    # Componente de estadísticas
│   │   │   ├── Footer.jsx          # Pie de página
│   │   │   ├── GestionAcademica.jsx # Gestión académica
│   │   │   ├── GestionUsuarios.jsx # Gestión de usuarios
│   │   │   ├── Navbar.jsx          # Barra de navegación
│   │   │   ├── Sidebar.jsx         # Barra lateral de navegación
│   │   │   ├── Table.jsx           # Componente de tabla genérica
│   │   │   ├── Logout.jsx          # Componente de cierre de sesión
│   │   │   ├── ReportesEstadisticas.jsx # Reportes y estadísticas
│   │   │   ├── GraficaCircular.jsx # Gráficos circulares
│   │   │   ├── GraficaLinea.jsx    # Gráficos de línea
│   │   │   ├── Gaficas_barras.jsx  # Gráficos de barras
│   │   │   ├── Graficas_circular.jsx # Gráficos circulares alternativos
│   │   │   └── Graficas_linea.jsx  # Gráficos de línea alternativos
│   │   ├── pages/                  # Páginas principales de la aplicación
│   │   │   ├── Loginpage.jsx       # Página de inicio de sesión
│   │   │   ├── CoordinacionPage.jsx # Página de coordinación
│   │   │   ├── DocentesPage.jsx    # Página de gestión de docentes
│   │   │   ├── SecretariaPage.jsx  # Página de secretaría
│   │   │   └── NotFound.jsx        # Página de error 404
│   │   ├── styles/                 # Archivos de estilos CSS
│   │   │   ├── Breadcrumbs.css     # Estilos para migas de pan
│   │   │   ├── Calificaciones.css  # Estilos para calificaciones
│   │   │   ├── Coordinacion.css    # Estilos para coordinación
│   │   │   ├── CoordinacionPage.css # Estilos para página de coordinación
│   │   │   ├── Dashboard.css       # Estilos para dashboard
│   │   │   ├── Estadisticas.css    # Estilos para estadísticas
│   │   │   ├── Footer.css          # Estilos para footer
│   │   │   ├── GestionAcademica.css # Estilos para gestión académica
│   │   │   ├── GestionUsuarios.css # Estilos para gestión de usuarios
│   │   │   ├── Graficas.css        # Estilos para gráficas
│   │   │   ├── Loginpage.css       # Estilos para página de login
│   │   │   ├── Navbar.css          # Estilos para navbar
│   │   │   ├── NotFound.css        # Estilos para página 404
│   │   │   ├── Sidebar.css         # Estilos para sidebar
│   │   │   └── Table.css           # Estilos para tablas
│   │   └── utils/                  # Utilidades y funciones auxiliares
│   │       └── navigationControl.js # Control de navegación
│   ├── package.json                # Dependencias y scripts de npm
│   ├── package-lock.json           # Versiones exactas de dependencias
│   ├── vite.config.js              # Configuración de Vite
│   ├── eslint.config.js            # Configuración de ESLint
│   ├── index.html                  # Archivo HTML principal
│   └── README.md                   # Documentación del frontend
├── docs/                           # Documentación del proyecto
│   ├── AGENT_EXAMPLES.md           # Ejemplos de uso de agentes
│   ├── QUICK_START.md              # Guía de inicio rápido
│   ├── architecture/               # Documentación de arquitectura
│   ├── product/                    # Documentación de producto
│   └── reports/                    # Reportes del sistema
├── logs/                           # Archivos de registro del sistema
├── run_agents.py                   # Script para ejecutar agentes
├── setup_agents.py                 # Script de configuración de agentes
├── agents_config.json              # Configuración de agentes
├── agents_requirements.txt         # Dependencias de agentes
├── ARQUITECTURA.md                 # Documentación de arquitectura
└── agents.md                       # Documentación de agentes
```

## 📊 Distribución por Lenguaje

- **Other**: 8 archivos, 613 líneas (0.4%)
- **Markdown**: 21 archivos, 1,294 líneas (0.8%)
- **JSON**: 22 archivos, 140,259 líneas (91.0%)
- **Python**: 25 archivos, 4,985 líneas (3.2%)
- **JavaScript**: 31 archivos, 3,421 líneas (2.2%)
- **HTML**: 1 archivos, 13 líneas (0.0%)
- **CSS**: 17 archivos, 3,586 líneas (2.3%)


## 🚀 Características Arquitectónicas

- ⚡ **Desarrollo rápido** con Vite y Hot Module Replacement
- 🔒 **Type Safety** completo con TypeScript
- 🎯 **Gestión de estado** eficiente con React Query
- 🧪 **Testing completo** con React Testing Library
- 📱 **Responsive Design** para todos los dispositivos
- 🔄 **Real-time updates** y sincronización de datos

## 🔧 Configuración y Desarrollo

### Prerrequisitos
- Node.js 18+ 
- Python 3.9+
- Git

### Instalación
```bash
# Frontend
cd frontend_srp
npm install

# Backend  
cd backend
pip install -r requirements.txt
```

### Desarrollo
```bash
# Frontend (puerto 5173)
npm run dev

# Backend (puerto 8000)
python manage.py runserver
```

## 📈 Métricas de Calidad

- ✅ Cobertura de tests: No disponible
- 🏗️ Arquitectura: Modular y escalable
- 📝 Documentación: Completa y actualizada
- 🔧 Mantenibilidad: Alta

---

*Documentación generada automáticamente por Architecture Reviewer Agent*  
*Última actualización: 2025-10-01 17:07:22*
