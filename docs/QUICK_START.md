# 🚀 Guía de Inicio Rápido - Sistema de Agentes SRP

## ¿Qué son los Agentes?

Los agentes son como **pequeñas personas especializadas** trabajando en tu equipo de desarrollo:

- 🎯 **Product Manager Agent**: Gestiona el roadmap y prioridades del proyecto
- 🐛 **Debug Manager Agent**: Encuentra y ayuda a resolver errores en el código
- 📚 **GitHub Manager Agent**: Gestiona el repositorio, commits y documentación
- 🏗️ **Architecture Reviewer Agent**: Analiza la arquitectura y documenta tecnologías

## Instalación en 3 Pasos

### 1. Configurar el Sistema
```bash
python setup_agents.py
```

### 2. Verificar que Todo Funciona
```bash
python run_agents.py status
```

### 3. ¡Listo! Tu Primer Comando
```bash
python run_agents.py run architecture_reviewer
```

## Comandos Esenciales para Estudiantes

### 📊 Ver Estado de tu Proyecto
```bash
python run_agents.py status
```
Te muestra el estado general de tu proyecto y qué agentes están activos.

### 🔍 Antes de Hacer Commit
```bash
python run_agents.py pre-commit
```
Verifica tu código antes de subirlo a GitHub. ¡Evita errores embarazosos!

### 📋 Generar Documentación Arquitectónica
```bash
python run_agents.py run architecture_reviewer
```
Crea automáticamente el archivo `ARQUITECTURA.md` con las tecnologías que usas.

### 🐛 Encontrar Bugs en tu Código
```bash
python run_agents.py run debug_manager
```
Analiza tu código y encuentra problemas potenciales.

### 📈 Gestionar tu Roadmap
```bash
python run_agents.py run product_manager
```
Organiza las tareas y funcionalidades de tu proyecto.

## Flujo de Trabajo Recomendado

### Para Desarrollo Diario:
1. **Al empezar el día**: `python run_agents.py daily`
2. **Antes de cada commit**: `python run_agents.py pre-commit`
3. **Al terminar una feature**: `python run_agents.py run product_manager`

### Para Entregas/Presentaciones:
1. **Generar documentación**: `python run_agents.py run architecture_reviewer`
2. **Verificar calidad**: `python run_agents.py run debug_manager`
3. **Preparar release**: `python run_agents.py deploy-check`

## Archivos Importantes que se Crean

### 📁 Estructura que Verás:
```
tu-proyecto/
├── agents/                    # 🤖 Código de los agentes
├── docs/
│   ├── ARQUITECTURA.md       # 🏗️ Documentación técnica
│   ├── roadmap.md            # 📋 Plan del proyecto
│   └── reports/              # 📊 Reportes automáticos
├── agents_config.json        # ⚙️ Configuración
└── run_agents.py            # 🚀 Script principal
```

### 📄 Archivos que se Generan Automáticamente:
- **`ARQUITECTURA.md`**: Documenta las tecnologías de tu proyecto
- **`roadmap.md`**: Plan de desarrollo y funcionalidades
- **`CHANGELOG.md`**: Historial de cambios
- **Reportes en `docs/reports/`**: Análisis detallados

## Personalización Básica

### Cambiar Configuración:
Edita `agents_config.json`:

```json
{
  "agents": {
    "debug_manager": {
      "enabled": true,
      "config": {
        "quality_threshold": 70,    // Cambia a 80 para ser más estricto
        "max_line_length": 120      // Cambia a 100 para líneas más cortas
      }
    }
  }
}
```

## Integración con Git (Opcional)

### Verificaciones Automáticas:
Crea el archivo `.git/hooks/pre-commit`:

```bash
#!/bin/sh
python run_agents.py pre-commit
```

Hazlo ejecutable:
```bash
chmod +x .git/hooks/pre-commit
```

## Solución de Problemas Comunes

### ❌ "No such file or directory"
**Solución**: Asegúrate de estar en la carpeta raíz de tu proyecto.

### ❌ "Agent not found"
**Solución**: Ejecuta `python setup_agents.py` primero.

### ❌ "Permission denied"
**Solución**: En Linux/Mac, ejecuta `chmod +x run_agents.py`

### ❌ "Git not found"
**Solución**: Instala Git en tu sistema.

## Casos de Uso para Estudiantes

### 📚 Para Proyectos de Clase:
- Genera documentación profesional automáticamente
- Mantén tu código limpio y sin errores
- Organiza tus entregas con roadmaps

### 👥 Para Proyectos en Equipo:
- Coordina el trabajo con reportes automáticos
- Mantén estándares de código consistentes
- Documenta la arquitectura para todos

### 🎓 Para tu Portafolio:
- Demuestra buenas prácticas de desarrollo
- Genera documentación profesional
- Muestra un proceso de desarrollo organizado

## Próximos Pasos

1. **Experimenta**: Prueba cada agente individualmente
2. **Personaliza**: Ajusta la configuración a tus necesidades
3. **Integra**: Úsalos en tu flujo de trabajo diario
4. **Comparte**: Enseña a tus compañeros de clase

## Recursos Adicionales

- 📖 **Documentación completa**: `agents.md`
- 💡 **Ejemplos avanzados**: `docs/AGENT_EXAMPLES.md`
- 🔧 **Configuración detallada**: `agents_config.json`

---

## 🎉 ¡Felicidades!

Ya tienes un equipo de agentes trabajando para ti. Son como tener un **Product Manager**, **QA Tester**, **DevOps Engineer** y **Technical Writer** en tu proyecto.

**Recuerda**: Los agentes son herramientas para ayudarte, no para reemplazar tu creatividad y conocimiento. ¡Úsalos para ser más eficiente y profesional!

---

*Guía creada por el Sistema de Agentes SRP - ¡Desarrolla como un profesional!* 🚀