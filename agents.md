# 🤖 Sistema de Agentes de Desarrollo - Proyecto SRP

## 📋 Visión General

Este sistema implementa un equipo de agentes especializados que trabajan de manera coordinada para mejorar la productividad y calidad del desarrollo de software. Cada agente tiene responsabilidades específicas pero colabora con los demás para mantener el proyecto en una dirección unificada.

## 👥 Equipo de Agentes

### 🎯 Product Manager Agent
**Responsabilidades:**
- Gestión del roadmap del proyecto
- Definición y priorización de features
- Coordinación entre agentes
- Seguimiento de métricas de desarrollo
- Comunicación con stakeholders

**Archivos:** `agents/product_manager.py`

### 🐛 Debug Manager Agent
**Responsabilidades:**
- Análisis automático de errores y bugs
- Sugerencias de soluciones
- Monitoreo de calidad del código
- Gestión de logs y debugging
- Reportes de problemas críticos

**Archivos:** `agents/debug_manager.py`

### 🔧 GitHub Manager Agent
**Responsabilidades:**
- Gestión de repositorio y branches
- Automatización de CI/CD
- Code reviews automáticos
- Gestión de issues y PRs
- Deployment y releases

**Archivos:** `agents/github_manager.py`

### 🏗️ Architecture Reviewer Agent
**Responsabilidades:**
- Análisis de arquitectura del proyecto
- Documentación de tecnologías utilizadas
- Revisión de estructura de archivos
- Generación de diagramas arquitectónicos
- Recomendaciones de mejores prácticas

**Archivos:** `agents/architecture_reviewer.py`

## 🔄 Flujo de Trabajo Integrado

### 1. Inicialización del Proyecto
```bash
python agents/coordinator.py --init
```

### 2. Desarrollo Diario
```bash
python agents/coordinator.py --daily-sync
```

### 3. Pre-commit Hooks
```bash
python agents/coordinator.py --pre-commit
```

### 4. Deployment
```bash
python agents/coordinator.py --deploy
```

## 📁 Estructura de Archivos

```
SRP/
├── agents/
│   ├── __init__.py
│   ├── coordinator.py          # Coordinador principal
│   ├── product_manager.py      # Agente Product Manager
│   ├── debug_manager.py        # Agente Debug Manager
│   ├── github_manager.py       # Agente GitHub Manager
│   ├── architecture_reviewer.py # Agente Architecture Reviewer
│   ├── config/
│   │   ├── agents_config.yaml  # Configuración de agentes
│   │   └── workflows.yaml      # Definición de workflows
│   └── utils/
│       ├── communication.py    # Sistema de comunicación entre agentes
│       ├── logger.py          # Sistema de logging
│       └── metrics.py         # Métricas y reportes
├── backend/                   # Django Backend
├── frontend_srp/             # React + Vite Frontend
└── docs/                     # Documentación generada por agentes
    ├── architecture/
    ├── api/
    └── deployment/
```

## 🚀 Instalación y Configuración

### 1. Instalar Dependencias
```bash
pip install -r agents/requirements.txt
```

### 2. Configurar Variables de Entorno
```bash
cp agents/config/.env.example agents/config/.env
# Editar .env con tus configuraciones
```

### 3. Inicializar Sistema de Agentes
```bash
python agents/coordinator.py --setup
```

## 📊 Métricas y Reportes

Los agentes generan reportes automáticos en:
- `docs/reports/daily/` - Reportes diarios
- `docs/reports/weekly/` - Reportes semanales
- `docs/reports/architecture/` - Análisis arquitectónico
- `docs/reports/performance/` - Métricas de rendimiento

## 🔧 Configuración Personalizada

Edita `agents/config/agents_config.yaml` para personalizar:
- Horarios de ejecución
- Niveles de automatización
- Integraciones con herramientas externas
- Notificaciones y alertas

## 📚 Documentación Adicional

- [Guía de Configuración](docs/setup-guide.md)
- [API de Agentes](docs/agents-api.md)
- [Troubleshooting](docs/troubleshooting.md)
- [Mejores Prácticas](docs/best-practices.md)

## 🤝 Contribución

Para agregar nuevos agentes o modificar existentes:
1. Seguir la estructura base en `agents/base_agent.py`
2. Implementar interfaces requeridas
3. Agregar tests en `tests/agents/`
4. Actualizar documentación

---

*Sistema desarrollado para mejorar la productividad en el desarrollo de software mediante automatización inteligente y coordinación de agentes especializados.*