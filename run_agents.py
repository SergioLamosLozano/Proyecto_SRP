#!/usr/bin/env python3
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
        print("\nComandos disponibles:")
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
    
    # Inicializar coordinador con la ruta del archivo
    coordinator = AgentCoordinator(str(config_path))
    
    try:
        if command == "status":
            status = coordinator.get_system_status()
            print("\n🤖 Estado del Sistema de Agentes")
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
