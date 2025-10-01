"""
Coordinador Principal del Sistema de Agentes SRP
===============================================

Este módulo coordina la ejecución y comunicación entre todos los agentes
del sistema, asegurando que trabajen de manera sincronizada hacia objetivos comunes.
"""

import argparse
import json
import logging
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional

from .base_agent import BaseAgent
from .product_manager import ProductManagerAgent
from .debug_manager import DebugManagerAgent
from .github_manager import GitHubManagerAgent
from .architecture_reviewer import ArchitectureReviewerAgent

class AgentCoordinator:
    """
    Coordinador principal que gestiona todos los agentes del sistema.
    """
    
    def __init__(self, config_path: str = "agents_config.json"):
        self.config_path = config_path
        self.config = self._load_config()
        self.logger = self._setup_logger()
        self.agents = {}
        self.execution_history = []
        
        # Inicializar agentes
        self._initialize_agents()
    
    def _setup_logger(self) -> logging.Logger:
        """Configura el logger del coordinador"""
        logger = logging.getLogger("agents.coordinator")
        logger.setLevel(logging.INFO)
        
        # Crear directorio de logs
        log_dir = Path("logs/agents")
        log_dir.mkdir(parents=True, exist_ok=True)
        
        # Handler para archivo
        file_handler = logging.FileHandler(log_dir / "coordinator.log")
        file_handler.setLevel(logging.INFO)
        
        # Handler para consola
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.INFO)
        
        # Formato
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        file_handler.setFormatter(formatter)
        console_handler.setFormatter(formatter)
        
        logger.addHandler(file_handler)
        logger.addHandler(console_handler)
        
        return logger
    
    def _load_config(self) -> Dict[str, Any]:
        """Carga la configuración de los agentes"""
        config_file = Path(self.config_path)
        
        # Configuración por defecto si no existe el archivo
        default_config = {
            "agents": {
                "product_manager": {
                    "enabled": True,
                    "schedule": "daily",
                    "priority": 1
                },
                "debug_manager": {
                    "enabled": True,
                    "schedule": "on_error",
                    "priority": 2
                },
                "github_manager": {
                    "enabled": True,
                    "schedule": "on_commit",
                    "priority": 3
                },
                "architecture_reviewer": {
                    "enabled": True,
                    "schedule": "weekly",
                    "priority": 4
                }
            },
            "coordination": {
                "max_concurrent_agents": 2,
                "timeout_minutes": 30,
                "retry_attempts": 3
            }
        }
        
        if not config_file.exists():
            # Crear directorio de configuración si es necesario
            config_file.parent.mkdir(parents=True, exist_ok=True)
            
            # Guardar configuración por defecto en JSON
            with open(config_file, 'w', encoding='utf-8') as f:
                json.dump(default_config, f, indent=2, ensure_ascii=False)
            
            print(f"✅ Configuración por defecto creada en {config_file}")
        
        try:
            # Cargar configuración desde JSON
            with open(config_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"❌ Error cargando configuración: {e}")
            return default_config
    
    def _initialize_agents(self):
        """Inicializa todos los agentes configurados"""
        agent_classes = {
            "product_manager": ProductManagerAgent,
            "debug_manager": DebugManagerAgent,
            "github_manager": GitHubManagerAgent,
            "architecture_reviewer": ArchitectureReviewerAgent
        }
        
        for agent_name, agent_config in self.config["agents"].items():
            if agent_config.get("enabled", True):
                try:
                    agent_class = agent_classes.get(agent_name)
                    if agent_class:
                        self.agents[agent_name] = agent_class(
                            name=agent_name,
                            config=agent_config
                        )
                        self.logger.info(f"Initialized agent: {agent_name}")
                    else:
                        self.logger.warning(f"Unknown agent type: {agent_name}")
                except Exception as e:
                    self.logger.error(f"Failed to initialize {agent_name}: {e}")
    
    def execute_agent(self, agent_name: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Ejecuta un agente específico.
        
        Args:
            agent_name: Nombre del agente a ejecutar
            context: Contexto de ejecución
            
        Returns:
            Resultado de la ejecución
        """
        if agent_name not in self.agents:
            raise ValueError(f"Agent {agent_name} not found")
        
        agent = self.agents[agent_name]
        
        try:
            self.logger.info(f"Executing agent: {agent_name}")
            result = agent.execute(context or {})
            
            # Registrar ejecución
            execution_record = {
                "agent": agent_name,
                "timestamp": datetime.now().isoformat(),
                "success": True,
                "result": result
            }
            self.execution_history.append(execution_record)
            
            return result
            
        except Exception as e:
            self.logger.error(f"Agent {agent_name} execution failed: {e}")
            
            execution_record = {
                "agent": agent_name,
                "timestamp": datetime.now().isoformat(),
                "success": False,
                "error": str(e)
            }
            self.execution_history.append(execution_record)
            
            raise
    
    def daily_sync(self):
        """Ejecuta la sincronización diaria de agentes"""
        self.logger.info("Starting daily sync")
        
        # Orden de ejecución basado en prioridad
        agents_by_priority = sorted(
            self.agents.items(),
            key=lambda x: self.config["agents"][x[0]].get("priority", 999)
        )
        
        results = {}
        
        for agent_name, agent in agents_by_priority:
            agent_config = self.config["agents"][agent_name]
            
            if agent_config.get("schedule") in ["daily", "always"]:
                try:
                    result = self.execute_agent(agent_name, {"sync_type": "daily"})
                    results[agent_name] = result
                except Exception as e:
                    self.logger.error(f"Daily sync failed for {agent_name}: {e}")
                    results[agent_name] = {"error": str(e)}
        
        # Generar reporte de sincronización
        self._generate_sync_report("daily", results)
        
        return results
    
    def pre_commit_check(self):
        """Ejecuta verificaciones antes de commit"""
        self.logger.info("Starting pre-commit checks")
        
        # Agentes relevantes para pre-commit
        pre_commit_agents = ["debug_manager", "architecture_reviewer"]
        
        results = {}
        all_passed = True
        
        for agent_name in pre_commit_agents:
            if agent_name in self.agents:
                try:
                    result = self.execute_agent(agent_name, {"check_type": "pre_commit"})
                    results[agent_name] = result
                    
                    # Verificar si pasó las verificaciones
                    if result.get("status") != "success":
                        all_passed = False
                        
                except Exception as e:
                    self.logger.error(f"Pre-commit check failed for {agent_name}: {e}")
                    results[agent_name] = {"error": str(e)}
                    all_passed = False
        
        return {
            "passed": all_passed,
            "results": results,
            "issues": [f"{agent}: {result.get('error', 'Failed')}" for agent, result in results.items() if result.get("status") != "success" or "error" in result]
        }
    
    def deploy_check(self):
        """Ejecuta verificaciones antes de deployment"""
        self.logger.info("Starting deployment checks")
        
        # Todos los agentes participan en deployment
        results = {}
        all_passed = True
        
        for agent_name in self.agents:
            try:
                result = self.execute_agent(agent_name, {"check_type": "deployment"})
                results[agent_name] = result
                
                if result.get("status") != "success":
                    all_passed = False
                    
            except Exception as e:
                self.logger.error(f"Deployment check failed for {agent_name}: {e}")
                results[agent_name] = {"error": str(e)}
                all_passed = False
        
        return {
            "ready": all_passed,
            "results": results,
            "blockers": [f"{agent}: {result.get('error', 'Failed')}" for agent, result in results.items() if result.get("status") != "success" or "error" in result]
        }
    
    def _generate_sync_report(self, sync_type: str, results: Dict[str, Any]):
        """Genera reporte de sincronización"""
        report_data = {
            "sync_type": sync_type,
            "timestamp": datetime.now().isoformat(),
            "agents_executed": len(results),
            "successful_agents": len([r for r in results.values() if "error" not in r]),
            "failed_agents": len([r for r in results.values() if "error" in r]),
            "results": results
        }
        
        # Guardar reporte
        reports_dir = Path("docs/reports/coordination")
        reports_dir.mkdir(parents=True, exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        report_file = reports_dir / f"{sync_type}_sync_{timestamp}.json"
        
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report_data, f, indent=2, ensure_ascii=False)
        
        self.logger.info(f"Sync report saved: {report_file}")
    
    def get_system_status(self) -> Dict[str, Any]:
        """Obtiene el estado del sistema completo"""
        status = {
            "coordinator": {
                "active_agents": len(self.agents),
                "last_execution": self.execution_history[-1] if self.execution_history else None,
                "total_executions": len(self.execution_history)
            },
            "agents": {}
        }
        
        for agent_name, agent in self.agents.items():
            status["agents"][agent_name] = agent.get_status()
        
        return status

    def generate_report(self) -> Dict[str, Any]:
        """Genera un reporte completo del sistema ejecutando todos los agentes"""
        self.logger.info("Generating complete system report")
        
        report_data = {
            "timestamp": datetime.now().isoformat(),
            "system_status": self.get_system_status(),
            "agent_results": {},
            "summary": {}
        }
        
        # Ejecutar todos los agentes para obtener información actualizada
        successful_agents = 0
        failed_agents = 0
        
        for agent_name in self.agents:
            try:
                self.logger.info(f"Executing {agent_name} for report")
                result = self.execute_agent(agent_name, {"report_mode": True})
                report_data["agent_results"][agent_name] = result
                
                if result.get("status") == "success":
                    successful_agents += 1
                else:
                    failed_agents += 1
                    
            except Exception as e:
                self.logger.error(f"Failed to execute {agent_name} for report: {e}")
                report_data["agent_results"][agent_name] = {
                    "status": "error",
                    "error": str(e)
                }
                failed_agents += 1
        
        # Generar resumen
        report_data["summary"] = {
            "total_agents": len(self.agents),
            "successful_executions": successful_agents,
            "failed_executions": failed_agents,
            "overall_health": "healthy" if failed_agents == 0 else "degraded" if successful_agents > failed_agents else "critical"
        }
        
        # Guardar reporte
        reports_dir = Path("docs/reports")
        reports_dir.mkdir(parents=True, exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        report_file = reports_dir / f"system_report_{timestamp}.json"
        
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report_data, f, indent=2, ensure_ascii=False)
        
        self.logger.info(f"Complete system report saved: {report_file}")
        
        return {
            "status": "success",
            "report_file": str(report_file),
            "summary": report_data["summary"]
        }

    def deployment_check(self) -> Dict[str, Any]:
        """Alias para deploy_check para compatibilidad"""
        return self.deploy_check()

def main():
    """Función principal para ejecutar el coordinador desde línea de comandos"""
    parser = argparse.ArgumentParser(description="Coordinador de Agentes SRP")
    parser.add_argument("--init", action="store_true", help="Inicializar sistema de agentes")
    parser.add_argument("--daily-sync", action="store_true", help="Ejecutar sincronización diaria")
    parser.add_argument("--pre-commit", action="store_true", help="Ejecutar verificaciones pre-commit")
    parser.add_argument("--deploy", action="store_true", help="Ejecutar verificaciones de deployment")
    parser.add_argument("--status", action="store_true", help="Mostrar estado del sistema")
    parser.add_argument("--agent", type=str, help="Ejecutar agente específico")
    
    args = parser.parse_args()
    
    try:
        coordinator = AgentCoordinator()
        
        if args.init:
            print("✅ Sistema de agentes inicializado correctamente")
            print(f"📁 Configuración: {coordinator.config_path}")
            print(f"🤖 Agentes activos: {len(coordinator.agents)}")
            
        elif args.daily_sync:
            results = coordinator.daily_sync()
            print("📊 Sincronización diaria completada")
            for agent, result in results.items():
                status = "❌" if "error" in result else "✅"
                print(f"  {status} {agent}")
                
        elif args.pre_commit:
            results = coordinator.pre_commit_check()
            status = "✅" if results["overall_status"] == "passed" else "❌"
            print(f"{status} Verificaciones pre-commit: {results['overall_status']}")
            
        elif args.deploy:
            results = coordinator.deploy_check()
            status = "✅" if results["overall_status"] == "passed" else "❌"
            print(f"{status} Verificaciones de deployment: {results['overall_status']}")
            
        elif args.status:
            status = coordinator.get_system_status()
            print("📊 Estado del Sistema de Agentes")
            print(f"🤖 Agentes activos: {status['coordinator']['active_agents']}")
            print(f"📈 Ejecuciones totales: {status['coordinator']['total_executions']}")
            
            for agent_name, agent_status in status["agents"].items():
                print(f"  • {agent_name}: {agent_status.get('status', 'unknown')}")
                
        elif args.agent:
            result = coordinator.execute_agent(args.agent)
            print(f"✅ Agente {args.agent} ejecutado correctamente")
            
        else:
            parser.print_help()
            
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()