#!/usr/bin/env python3
"""
Setup Script para Sistema de Agentes SRP
========================================

Este script configura e instala el sistema de agentes automatizados
para el proyecto SRP (Sistema de Responsabilidad Social).
"""

import json
import os
import sys
from pathlib import Path
from typing import Dict, Any

def create_config_file():
    """Crea el archivo de configuración por defecto"""
    config = {
        "agents": {
            "product_manager": {
                "enabled": True,
                "schedule": "daily",
                "config": {
                    "roadmap_file": "docs/roadmap.md",
                    "reports_dir": "docs/reports/product",
                    "priority_levels": ["critical", "high", "medium", "low"],
                    "sprint_duration_days": 14
                }
            },
            "debug_manager": {
                "enabled": True,
                "schedule": "on_commit",
                "config": {
                    "reports_dir": "docs/reports/debug",
                    "quality_threshold": 70,
                    "max_line_length": 120,
                    "check_security": True,
                    "auto_create_issues": True
                }
            },
            "github_manager": {
                "enabled": True,
                "schedule": "on_demand",
                "config": {
                    "auto_update_docs": True,
                    "pre_commit_checks": True,
                    "changelog_format": "markdown",
                    "release_branch": "main"
                }
            },
            "architecture_reviewer": {
                "enabled": True,
                "schedule": "weekly",
                "config": {
                    "architecture_file": "docs/ARQUITECTURA.md",
                    "reports_dir": "docs/reports/architecture",
                    "scan_directories": ["frontend_srp/src", "backend"],
                    "generate_diagrams": True
                }
            }
        },
        "global": {
            "project_root": ".",
            "logs_dir": "logs/agents",
            "reports_retention_days": 30,
            "notification_enabled": False,
            "notification_webhook": ""
        }
    }
    
    config_path = Path("agents_config.json")
    with open(config_path, 'w', encoding='utf-8') as f:
        json.dump(config, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Archivo de configuración creado: {config_path}")
    return config_path

def create_directories():
    """Crea las carpetas necesarias para el sistema"""
    directories = [
        "docs/reports/product",
        "docs/reports/debug", 
        "docs/reports/architecture",
        "docs/reports/github",
        "docs/issues",
        "logs/agents"
    ]
    
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)
        print(f"📁 Directorio creado: {directory}")

def create_runner_script():
    """Crea script para ejecutar los agentes"""
    runner_content = '''#!/usr/bin/env python3
"""
Agent Runner - Sistema SRP
==========================

Script para ejecutar agentes individuales o coordinados.
"""

import sys
import json
from pathlib import Path
from agents.coordinator import AgentCoordinator

def main():
    if len(sys.argv) < 2:
        print("Uso: python run_agents.py <comando> [opciones]")
        print("\\nComandos disponibles:")
        print("  status          - Mostrar estado de todos los agentes")
        print("  run <agente>    - Ejecutar agente específico")
        print("  daily           - Ejecutar sincronización diaria")
        print("  pre-commit      - Ejecutar verificaciones pre-commit")
        print("  deploy-check    - Ejecutar verificaciones de deployment")
        print("  report          - Generar reporte completo")
        return
    
    command = sys.argv[1]
    
    # Cargar configuración
    config_path = Path("agents_config.json")
    if not config_path.exists():
        print("❌ Archivo de configuración no encontrado. Ejecuta setup_agents.py primero.")
        return
    
    with open(config_path, 'r', encoding='utf-8') as f:
        config = json.load(f)
    
    # Inicializar coordinador
    coordinator = AgentCoordinator(config)
    
    try:
        if command == "status":
            status = coordinator.get_system_status()
            print("\\n🤖 Estado del Sistema de Agentes")
            print("=" * 40)
            for agent_name, agent_status in status["agents"].items():
                status_icon = "✅" if agent_status["status"] == "ready" else "❌"
                print(f"{status_icon} {agent_name}: {agent_status['status']}")
        
        elif command == "run" and len(sys.argv) > 2:
            agent_name = sys.argv[2]
            print(f"🚀 Ejecutando agente: {agent_name}")
            result = coordinator.execute_agent(agent_name)
            if result["status"] == "success":
                print(f"✅ {agent_name} ejecutado exitosamente")
            else:
                print(f"❌ Error ejecutando {agent_name}: {result.get('error', 'Unknown error')}")
        
        elif command == "daily":
            print("🌅 Ejecutando sincronización diaria...")
            result = coordinator.daily_sync()
            print(f"✅ Sincronización completada: {result['summary']}")
        
        elif command == "pre-commit":
            print("🔍 Ejecutando verificaciones pre-commit...")
            result = coordinator.pre_commit_check()
            if result["passed"]:
                print("✅ Todas las verificaciones pasaron")
            else:
                print("❌ Algunas verificaciones fallaron")
                for issue in result.get("issues", []):
                    print(f"  - {issue}")
        
        elif command == "deploy-check":
            print("🚀 Ejecutando verificaciones de deployment...")
            result = coordinator.deployment_check()
            if result["ready"]:
                print("✅ Listo para deployment")
            else:
                print("❌ No listo para deployment")
                for issue in result.get("blockers", []):
                    print(f"  - {issue}")
        
        elif command == "report":
            print("📊 Generando reporte completo...")
            result = coordinator.generate_report()
            print(f"✅ Reporte generado: {result['report_file']}")
        
        else:
            print(f"❌ Comando desconocido: {command}")
    
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
'''
    
    runner_path = Path("run_agents.py")
    with open(runner_path, 'w', encoding='utf-8') as f:
        f.write(runner_content)
    
    # Hacer ejecutable en sistemas Unix
    if sys.platform != 'win32':
        os.chmod(runner_path, 0o755)
    
    print(f"🚀 Script runner creado: {runner_path}")
    return runner_path

def create_requirements():
    """Crea archivo requirements.txt para los agentes"""
    requirements = [
        "# Dependencias para Sistema de Agentes SRP",
        "",
        "# Core dependencies",
        "pathlib2>=2.3.0",
        "typing-extensions>=4.0.0",
        "",
        "# Para análisis de código",
        "ast>=3.8",
        "",
        "# Para reportes y logging",
        "json5>=0.9.0",
        "",
        "# Para integración con Git",
        "# Nota: Git debe estar instalado en el sistema",
        "",
        "# Opcional: Para notificaciones",
        "requests>=2.25.0  # Para webhooks",
        "",
        "# Desarrollo y testing",
        "pytest>=6.0.0",
        "pytest-cov>=2.10.0"
    ]
    
    req_path = Path("agents_requirements.txt")
    with open(req_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(requirements))
    
    print(f"📦 Archivo de dependencias creado: {req_path}")
    return req_path

def create_example_usage():
    """Crea archivo con ejemplos de uso"""
    examples = '''# 🤖 Ejemplos de Uso - Sistema de Agentes SRP

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
'''
    
    examples_path = Path("docs/AGENT_EXAMPLES.md")
    examples_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(examples_path, 'w', encoding='utf-8') as f:
        f.write(examples)
    
    print(f"📖 Ejemplos de uso creados: {examples_path}")
    return examples_path

def verify_installation():
    """Verifica que la instalación sea correcta"""
    print("\n🔍 Verificando instalación...")
    
    required_files = [
        "agents/__init__.py",
        "agents/base_agent.py", 
        "agents/coordinator.py",
        "agents/product_manager.py",
        "agents/debug_manager.py",
        "agents/github_manager.py",
        "agents/architecture_reviewer.py",
        "agents_config.json",
        "run_agents.py"
    ]
    
    missing_files = []
    for file_path in required_files:
        if not Path(file_path).exists():
            missing_files.append(file_path)
    
    if missing_files:
        print("❌ Archivos faltantes:")
        for file_path in missing_files:
            print(f"  - {file_path}")
        return False
    
    print("✅ Todos los archivos necesarios están presentes")
    
    # Verificar que se puedan importar los módulos
    try:
        sys.path.insert(0, str(Path.cwd()))
        from agents.coordinator import AgentCoordinator
        from agents.base_agent import BaseAgent
        print("✅ Módulos se importan correctamente")
    except ImportError as e:
        print(f"❌ Error importando módulos: {e}")
        return False
    
    return True

def main():
    """Función principal del setup"""
    print("🚀 Configurando Sistema de Agentes SRP")
    print("=" * 40)
    
    try:
        # Crear estructura de directorios
        create_directories()
        
        # Crear archivo de configuración
        create_config_file()
        
        # Crear script runner
        create_runner_script()
        
        # Crear requirements
        create_requirements()
        
        # Crear ejemplos de uso
        create_example_usage()
        
        # Verificar instalación
        if verify_installation():
            print("\n✅ ¡Sistema de agentes configurado exitosamente!")
            print("\n📋 Próximos pasos:")
            print("1. Revisar configuración en 'agents_config.json'")
            print("2. Ejecutar: python run_agents.py status")
            print("3. Ver ejemplos en 'docs/AGENT_EXAMPLES.md'")
            print("4. Opcional: pip install -r agents_requirements.txt")
        else:
            print("\n❌ La instalación tiene problemas. Revisar errores arriba.")
            return 1
    
    except Exception as e:
        print(f"\n❌ Error durante la configuración: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())