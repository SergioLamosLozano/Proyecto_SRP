"""
Product Manager Agent - Sistema SRP
==================================

Este agente actúa como Product Manager del proyecto, gestionando
el roadmap, priorizando features y coordinando el desarrollo.
"""

import json
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Any, Optional

from .base_agent import BaseAgent

class ProductManagerAgent(BaseAgent):
    """
    Agente que actúa como Product Manager del proyecto.
    """
    
    def __init__(self, name: str = "product_manager", config: Dict[str, Any] = None):
        super().__init__(name, config)
        self.roadmap_file = Path("docs/roadmap.json")
        self.features_file = Path("docs/features.json")
        
    def execute(self, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Ejecuta las tareas de gestión de producto.
        """
        try:
            self.logger.info("Starting product management tasks")
            
            # Cargar o crear roadmap
            roadmap = self._load_or_create_roadmap()
            
            # Actualizar estado del proyecto
            project_status = self._analyze_project_status()
            
            # Generar reporte de progreso
            progress_report = self._generate_progress_report(roadmap, project_status)
            
            # Actualizar prioridades
            updated_roadmap = self._update_priorities(roadmap, project_status)
            
            # Guardar cambios
            self._save_roadmap(updated_roadmap)
            
            # Generar documentación
            self._generate_product_docs(updated_roadmap, progress_report)
            
            result = {
                "status": "success",
                "roadmap_updated": True,
                "progress_report": progress_report,
                "next_priorities": self._get_next_priorities(updated_roadmap)
            }
            
            self.log_execution(True, "Product management tasks completed")
            return result
            
        except Exception as e:
            self.log_execution(False, f"Product management failed: {str(e)}")
            raise
    
    def _load_or_create_roadmap(self) -> Dict[str, Any]:
        """Carga o crea el roadmap del proyecto"""
        if self.roadmap_file.exists():
            with open(self.roadmap_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        
        # Crear roadmap inicial
        roadmap = {
            "project_info": {
                "name": "Task Manager SRP",
                "version": "1.0.0",
                "start_date": datetime.now().isoformat(),
                "target_completion": (datetime.now() + timedelta(days=90)).isoformat()
            },
            "phases": [
                {
                    "id": "phase_1",
                    "name": "Fundación y Arquitectura",
                    "status": "in_progress",
                    "priority": "high",
                    "start_date": datetime.now().isoformat(),
                    "estimated_duration": 14,
                    "features": [
                        {
                            "id": "arch_setup",
                            "name": "Configuración de arquitectura base",
                            "status": "completed",
                            "priority": "high",
                            "estimated_hours": 8
                        },
                        {
                            "id": "auth_system",
                            "name": "Sistema de autenticación",
                            "status": "in_progress",
                            "priority": "high",
                            "estimated_hours": 16
                        },
                        {
                            "id": "task_crud",
                            "name": "CRUD básico de tareas",
                            "status": "pending",
                            "priority": "high",
                            "estimated_hours": 12
                        }
                    ]
                },
                {
                    "id": "phase_2",
                    "name": "Funcionalidades Core",
                    "status": "pending",
                    "priority": "high",
                    "estimated_duration": 21,
                    "features": [
                        {
                            "id": "task_management",
                            "name": "Gestión avanzada de tareas",
                            "status": "pending",
                            "priority": "high",
                            "estimated_hours": 20
                        },
                        {
                            "id": "collaboration",
                            "name": "Funcionalidades de colaboración",
                            "status": "pending",
                            "priority": "medium",
                            "estimated_hours": 24
                        },
                        {
                            "id": "notifications",
                            "name": "Sistema de notificaciones",
                            "status": "pending",
                            "priority": "medium",
                            "estimated_hours": 16
                        }
                    ]
                },
                {
                    "id": "phase_3",
                    "name": "Optimización y Deployment",
                    "status": "pending",
                    "priority": "medium",
                    "estimated_duration": 14,
                    "features": [
                        {
                            "id": "performance",
                            "name": "Optimización de rendimiento",
                            "status": "pending",
                            "priority": "medium",
                            "estimated_hours": 12
                        },
                        {
                            "id": "testing",
                            "name": "Testing completo",
                            "status": "pending",
                            "priority": "high",
                            "estimated_hours": 16
                        },
                        {
                            "id": "deployment",
                            "name": "Configuración de deployment",
                            "status": "pending",
                            "priority": "high",
                            "estimated_hours": 8
                        }
                    ]
                }
            ],
            "metrics": {
                "total_features": 9,
                "completed_features": 1,
                "in_progress_features": 1,
                "pending_features": 7,
                "completion_percentage": 11.1
            }
        }
        
        return roadmap
    
    def _analyze_project_status(self) -> Dict[str, Any]:
        """Analiza el estado actual del proyecto"""
        project_root = Path(".")
        
        status = {
            "timestamp": datetime.now().isoformat(),
            "structure_health": self._check_project_structure(),
            "development_progress": self._assess_development_progress(),
            "technical_debt": self._assess_technical_debt(),
            "team_velocity": self._calculate_team_velocity()
        }
        
        return status
    
    def _check_project_structure(self) -> Dict[str, Any]:
        """Verifica la salud de la estructura del proyecto"""
        project_root = Path(".")
        
        required_files = [
            "backend/manage.py",
            "backend/requirements.txt",
            "frontend_srp/package.json",
            "frontend_srp/vite.config.js"
        ]
        
        optional_files = [
            "README.md",
            "ARQUITECTURA.md",
            ".gitignore",
            "agents/coordinator.py"
        ]
        
        health = {
            "required_files_present": 0,
            "optional_files_present": 0,
            "missing_files": [],
            "health_score": 0
        }
        
        # Verificar archivos requeridos
        for file_path in required_files:
            if (project_root / file_path).exists():
                health["required_files_present"] += 1
            else:
                health["missing_files"].append(file_path)
        
        # Verificar archivos opcionales
        for file_path in optional_files:
            if (project_root / file_path).exists():
                health["optional_files_present"] += 1
        
        # Calcular score de salud
        required_score = (health["required_files_present"] / len(required_files)) * 70
        optional_score = (health["optional_files_present"] / len(optional_files)) * 30
        health["health_score"] = required_score + optional_score
        
        return health
    
    def _assess_development_progress(self) -> Dict[str, Any]:
        """Evalúa el progreso del desarrollo"""
        progress = {
            "backend_progress": 0,
            "frontend_progress": 0,
            "integration_progress": 0,
            "overall_progress": 0
        }
        
        # Evaluar backend
        backend_path = Path("backend")
        if backend_path.exists():
            backend_files = list(backend_path.rglob("*.py"))
            if len(backend_files) > 5:  # Más que archivos básicos de Django
                progress["backend_progress"] = min(len(backend_files) * 10, 100)
        
        # Evaluar frontend
        frontend_path = Path("frontend_srp/src")
        if frontend_path.exists():
            frontend_files = list(frontend_path.rglob("*.tsx")) + list(frontend_path.rglob("*.ts"))
            if len(frontend_files) > 3:  # Más que archivos básicos
                progress["frontend_progress"] = min(len(frontend_files) * 15, 100)
        
        # Progreso de integración (basado en configuración)
        if (Path("frontend_srp/src").exists() and 
            Path("backend").exists()):
            progress["integration_progress"] = 30
        
        # Progreso general
        progress["overall_progress"] = (
            progress["backend_progress"] * 0.4 +
            progress["frontend_progress"] * 0.4 +
            progress["integration_progress"] * 0.2
        )
        
        return progress
    
    def _assess_technical_debt(self) -> Dict[str, Any]:
        """Evalúa la deuda técnica del proyecto"""
        debt = {
            "documentation_debt": 0,
            "testing_debt": 0,
            "code_quality_debt": 0,
            "overall_debt": 0
        }
        
        # Deuda de documentación
        docs_path = Path("docs")
        if not docs_path.exists() or len(list(docs_path.glob("*.md"))) < 3:
            debt["documentation_debt"] = 40
        
        # Deuda de testing
        test_files = (
            list(Path(".").rglob("*test*.py")) +
            list(Path(".").rglob("*test*.js")) +
            list(Path(".").rglob("*test*.tsx"))
        )
        if len(test_files) < 5:
            debt["testing_debt"] = 60
        
        # Deuda de calidad de código
        if not Path(".eslintrc.js").exists() and not Path("eslint.config.js").exists():
            debt["code_quality_debt"] += 20
        
        # Deuda general
        debt["overall_debt"] = (
            debt["documentation_debt"] * 0.3 +
            debt["testing_debt"] * 0.4 +
            debt["code_quality_debt"] * 0.3
        )
        
        return debt
    
    def _calculate_team_velocity(self) -> Dict[str, Any]:
        """Calcula la velocidad del equipo"""
        # Simulación de velocidad basada en commits recientes
        velocity = {
            "commits_last_week": 0,
            "features_completed_last_sprint": 0,
            "estimated_velocity": "medium",
            "recommendations": []
        }
        
        # En un proyecto real, esto analizaría el historial de git
        velocity["estimated_velocity"] = "medium"
        velocity["recommendations"] = [
            "Implementar daily standups para mejor coordinación",
            "Usar sistema de agentes para automatizar tareas repetitivas",
            "Establecer métricas de código y calidad"
        ]
        
        return velocity
    
    def _generate_progress_report(self, roadmap: Dict[str, Any], status: Dict[str, Any]) -> Dict[str, Any]:
        """Genera reporte de progreso del proyecto"""
        report = {
            "timestamp": datetime.now().isoformat(),
            "project_health": {
                "structure_score": status["structure_health"]["health_score"],
                "progress_score": status["development_progress"]["overall_progress"],
                "debt_score": 100 - status["technical_debt"]["overall_debt"]
            },
            "milestone_status": [],
            "blockers": [],
            "achievements": [],
            "next_actions": []
        }
        
        # Analizar milestones
        for phase in roadmap["phases"]:
            completed_features = len([f for f in phase["features"] if f["status"] == "completed"])
            total_features = len(phase["features"])
            
            milestone = {
                "phase": phase["name"],
                "status": phase["status"],
                "completion": (completed_features / total_features * 100) if total_features > 0 else 0,
                "features_completed": completed_features,
                "total_features": total_features
            }
            report["milestone_status"].append(milestone)
        
        # Identificar blockers
        if status["structure_health"]["health_score"] < 70:
            report["blockers"].append("Estructura del proyecto incompleta")
        
        if status["technical_debt"]["overall_debt"] > 50:
            report["blockers"].append("Alta deuda técnica")
        
        # Logros recientes
        if status["structure_health"]["health_score"] > 80:
            report["achievements"].append("Estructura del proyecto bien establecida")
        
        # Próximas acciones
        report["next_actions"] = [
            "Completar sistema de autenticación",
            "Implementar CRUD básico de tareas",
            "Configurar testing automatizado",
            "Mejorar documentación del proyecto"
        ]
        
        return report
    
    def _update_priorities(self, roadmap: Dict[str, Any], status: Dict[str, Any]) -> Dict[str, Any]:
        """Actualiza las prioridades basado en el estado actual"""
        # Lógica para ajustar prioridades basada en el progreso y blockers
        
        # Si hay problemas de estructura, priorizar fundación
        if status["structure_health"]["health_score"] < 70:
            for phase in roadmap["phases"]:
                if phase["id"] == "phase_1":
                    phase["priority"] = "critical"
        
        # Si hay mucha deuda técnica, priorizar calidad
        if status["technical_debt"]["overall_debt"] > 50:
            for phase in roadmap["phases"]:
                if phase["id"] == "phase_3":
                    for feature in phase["features"]:
                        if feature["id"] in ["testing", "performance"]:
                            feature["priority"] = "high"
        
        # Actualizar métricas
        total_features = sum(len(phase["features"]) for phase in roadmap["phases"])
        completed_features = sum(
            len([f for f in phase["features"] if f["status"] == "completed"])
            for phase in roadmap["phases"]
        )
        
        roadmap["metrics"] = {
            "total_features": total_features,
            "completed_features": completed_features,
            "completion_percentage": (completed_features / total_features * 100) if total_features > 0 else 0,
            "last_updated": datetime.now().isoformat()
        }
        
        return roadmap
    
    def _get_next_priorities(self, roadmap: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Obtiene las próximas prioridades del roadmap"""
        priorities = []
        
        for phase in roadmap["phases"]:
            if phase["status"] in ["in_progress", "pending"]:
                for feature in phase["features"]:
                    if feature["status"] in ["in_progress", "pending"]:
                        priorities.append({
                            "feature": feature["name"],
                            "phase": phase["name"],
                            "priority": feature["priority"],
                            "estimated_hours": feature["estimated_hours"],
                            "status": feature["status"]
                        })
        
        # Ordenar por prioridad
        priority_order = {"critical": 0, "high": 1, "medium": 2, "low": 3}
        priorities.sort(key=lambda x: priority_order.get(x["priority"], 4))
        
        return priorities[:5]  # Top 5 prioridades
    
    def _save_roadmap(self, roadmap: Dict[str, Any]):
        """Guarda el roadmap actualizado"""
        self.roadmap_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(self.roadmap_file, 'w', encoding='utf-8') as f:
            json.dump(roadmap, f, indent=2, ensure_ascii=False)
        
        self.logger.info("Roadmap saved successfully")
    
    def _generate_product_docs(self, roadmap: Dict[str, Any], progress_report: Dict[str, Any]):
        """Genera documentación de producto"""
        docs_dir = Path("docs/product")
        docs_dir.mkdir(parents=True, exist_ok=True)
        
        # Generar roadmap en markdown
        roadmap_md = f"""# 🗺️ Roadmap del Proyecto - Task Manager

## 📊 Estado General del Proyecto

- **Progreso General:** {roadmap['metrics']['completion_percentage']:.1f}%
- **Features Completadas:** {roadmap['metrics']['completed_features']}/{roadmap['metrics']['total_features']}
- **Última Actualización:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## 🎯 Fases del Proyecto

"""
        
        for phase in roadmap["phases"]:
            status_emoji = {"completed": "✅", "in_progress": "🔄", "pending": "⏳"}
            priority_emoji = {"critical": "🔴", "high": "🟡", "medium": "🟢", "low": "⚪"}
            
            roadmap_md += f"""### {status_emoji.get(phase['status'], '❓')} {phase['name']}

**Estado:** {phase['status'].title()}  
**Prioridad:** {priority_emoji.get(phase['priority'], '❓')} {phase['priority'].title()}  
**Duración Estimada:** {phase.get('estimated_duration', 'TBD')} días

#### Features:

"""
            
            for feature in phase["features"]:
                feature_status = status_emoji.get(feature['status'], '❓')
                feature_priority = priority_emoji.get(feature['priority'], '❓')
                
                roadmap_md += f"- {feature_status} **{feature['name']}** ({feature_priority} {feature['priority']}) - {feature['estimated_hours']}h\n"
            
            roadmap_md += "\n"
        
        roadmap_md += f"""## 🚀 Próximas Prioridades

"""
        
        next_priorities = self._get_next_priorities(roadmap)
        for i, priority in enumerate(next_priorities, 1):
            roadmap_md += f"{i}. **{priority['feature']}** ({priority['priority']}) - {priority['estimated_hours']}h\n"
        
        roadmap_md += f"""

## 📈 Métricas de Salud del Proyecto

- **Salud de Estructura:** {progress_report['project_health']['structure_score']:.1f}/100
- **Progreso de Desarrollo:** {progress_report['project_health']['progress_score']:.1f}/100  
- **Calidad de Código:** {progress_report['project_health']['debt_score']:.1f}/100

---

*Roadmap generado automáticamente por Product Manager Agent*
"""
        
        # Guardar roadmap
        with open(docs_dir / "roadmap.md", 'w', encoding='utf-8') as f:
            f.write(roadmap_md)
        
        self.logger.info("Product documentation generated")
    
    def get_status(self) -> Dict[str, Any]:
        """Retorna el estado actual del agente"""
        return {
            "status": self.status,
            "last_execution": self.last_execution,
            "metrics": self.metrics,
            "capabilities": [
                "Roadmap management",
                "Feature prioritization",
                "Progress tracking",
                "Team coordination",
                "Product documentation"
            ]
        }