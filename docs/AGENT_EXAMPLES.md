# 🤖 Ejemplos de Uso - Sistema de Agentes SRP

## Configuración Inicial

```bash
# 1. Ejecutar setup
python setup_agents.py

# 2. Instalar dependencias (opcional)
pip install -r agents_requirements.txt
```

## Comandos Básicos

### Ver estado del sistema
```bash
python run_agents.py status
```

### Ejecutar agente específico
```bash
# Product Manager
python run_agents.py run product_manager

# Debug Manager
python run_agents.py run debug_manager

# GitHub Manager
python run_agents.py run github_manager

# Architecture Reviewer
python run_agents.py run architecture_reviewer
```

### Verificaciones automáticas
```bash
# Antes de hacer commit
python run_agents.py pre-commit

# Antes de deployment
python run_agents.py deploy-check

# Sincronización diaria
python run_agents.py daily
```

## Uso Programático

```python
from agents.coordinator import AgentCoordinator
import json

# Cargar configuración
with open('agents_config.json', 'r') as f:
    config = json.load(f)

# Inicializar coordinador
coordinator = AgentCoordinator(config)

# Ejecutar agente específico
result = coordinator.execute_agent('debug_manager', {
    'check_type': 'pre_commit'
})

# Verificaciones pre-commit
pre_commit_result = coordinator.pre_commit_check()
if not pre_commit_result['passed']:
    print("❌ Pre-commit checks failed")
    for issue in pre_commit_result['issues']:
        print(f"  - {issue}")
```

## Integración con Git Hooks

### Pre-commit Hook
Crear `.git/hooks/pre-commit`:

```bash
#!/bin/sh
python run_agents.py pre-commit
if [ $? -ne 0 ]; then
    echo "❌ Pre-commit checks failed"
    exit 1
fi
```

### Pre-push Hook
Crear `.git/hooks/pre-push`:

```bash
#!/bin/sh
python run_agents.py deploy-check
if [ $? -ne 0 ]; then
    echo "❌ Deploy checks failed"
    exit 1
fi
```

## Configuración Personalizada

Editar `agents_config.json`:

```json
{
  "agents": {
    "debug_manager": {
      "enabled": true,
      "config": {
        "quality_threshold": 80,
        "max_line_length": 100,
        "auto_create_issues": false
      }
    }
  }
}
```

## Automatización con Cron

```bash
# Ejecutar sincronización diaria a las 9 AM
0 9 * * * cd /path/to/project && python run_agents.py daily

# Generar reporte semanal los lunes
0 10 * * 1 cd /path/to/project && python run_agents.py report
```

## Troubleshooting

### Problema: "Agente no encontrado"
- Verificar que el agente esté habilitado en `agents_config.json`
- Verificar que el archivo del agente exista en `agents/`

### Problema: "Error de permisos"
- En sistemas Unix, hacer ejecutable: `chmod +x run_agents.py`
- Verificar permisos de escritura en directorios de logs y reports

### Problema: "Git no encontrado"
- Instalar Git en el sistema
- Verificar que `git` esté en el PATH

## Logs y Debugging

Los logs se guardan en:
- `logs/agents/coordinator.log` - Log del coordinador
- `logs/agents/{agent_name}.log` - Logs de agentes individuales

Para debugging detallado, editar la configuración de logging en cada agente.

## Notas sobre plantillas Excel (carga masiva)

- Las plantillas descargables para carga masiva (estudiantes/profesores) contienen una hoja `Catalogos` con valores legibles y ahora incluyen una hoja adicional `Catalogos_Detalle` que mapea identificadores (IDs) a descripciones legibles.
- El importador en backend acepta tanto identificadores numéricos (IDs) como valores legibles (por ejemplo, `Masculino` o `1`) para los campos que son claves foráneas. Esto permite que los usuarios rellenes las filas de ejemplo con nombres legibles mientras usan `Catalogos_Detalle` como referencia cuando necesiten IDs.
- Si prefieres que las filas de ejemplo usen explícitamente los IDs numéricos, solicitarlo y se actualizará la plantilla de ejemplo para usar los IDs en lugar de las etiquetas legibles.
