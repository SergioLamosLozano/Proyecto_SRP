"""
Clase base para todos los agentes del sistema SRP
"""

import logging
import json
from abc import ABC, abstractmethod
from datetime import datetime
from typing import Dict, List, Any, Optional
from pathlib import Path

class BaseAgent(ABC):
    """
    Clase base abstracta para todos los agentes del sistema.
    Define la interfaz común y funcionalidades compartidas.
    """
    
    def __init__(self, name: str, config: Dict[str, Any] = None):
        self.name = name
        self.config = config or {}
        self.project_root = Path(".")  # Definir project_root aquí
        self.logger = self._setup_logger()
        self.status = "initialized"
        self.last_execution = None
        self.metrics = {
            "executions": 0,
            "errors": 0,
            "success_rate": 0.0
        }
        
    def _setup_logger(self) -> logging.Logger:
        """Configura el logger específico para este agente"""
        logger = logging.getLogger(f"agents.{self.name}")
        logger.setLevel(logging.INFO)
        
        # Crear directorio de logs si no existe
        log_dir = Path("agents/logs")
        log_dir.mkdir(parents=True, exist_ok=True)
        
        # Handler para archivo
        file_handler = logging.FileHandler(log_dir / f"{self.name}.log")
        file_handler.setLevel(logging.INFO)
        
        # Handler para consola
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.WARNING)
        
        # Formato
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        file_handler.setFormatter(formatter)
        console_handler.setFormatter(formatter)
        
        logger.addHandler(file_handler)
        logger.addHandler(console_handler)
        
        return logger
    
    @abstractmethod
    def execute(self, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Método principal de ejecución del agente.
        Debe ser implementado por cada agente específico.
        
        Args:
            context: Contexto de ejecución con datos relevantes
            
        Returns:
            Dict con resultados de la ejecución
        """
        pass
    
    @abstractmethod
    def get_status(self) -> Dict[str, Any]:
        """
        Retorna el estado actual del agente.
        
        Returns:
            Dict con información del estado
        """
        pass
    
    def log_execution(self, success: bool, message: str, details: Dict[str, Any] = None):
        """Registra la ejecución del agente"""
        self.metrics["executions"] += 1
        if not success:
            self.metrics["errors"] += 1
            self.logger.error(f"Execution failed: {message}")
        else:
            self.logger.info(f"Execution successful: {message}")
            
        # Calcular tasa de éxito
        self.metrics["success_rate"] = (
            (self.metrics["executions"] - self.metrics["errors"]) / 
            self.metrics["executions"] * 100
        )
        
        self.last_execution = {
            "timestamp": datetime.now().isoformat(),
            "success": success,
            "message": message,
            "details": details or {}
        }
    
    def send_message(self, recipient: str, message: str, data: Dict[str, Any] = None):
        """
        Envía un mensaje a otro agente o al coordinador.
        
        Args:
            recipient: Nombre del agente destinatario
            message: Mensaje a enviar
            data: Datos adicionales
        """
        message_data = {
            "from": self.name,
            "to": recipient,
            "message": message,
            "data": data or {},
            "timestamp": datetime.now().isoformat()
        }
        
        # Guardar mensaje en cola de comunicación
        messages_dir = Path("agents/messages")
        messages_dir.mkdir(parents=True, exist_ok=True)
        
        message_file = messages_dir / f"{recipient}_inbox.json"
        
        # Leer mensajes existentes
        messages = []
        if message_file.exists():
            with open(message_file, 'r', encoding='utf-8') as f:
                messages = json.load(f)
        
        # Agregar nuevo mensaje
        messages.append(message_data)
        
        # Guardar mensajes actualizados
        with open(message_file, 'w', encoding='utf-8') as f:
            json.dump(messages, f, indent=2, ensure_ascii=False)
        
        self.logger.info(f"Message sent to {recipient}: {message}")
    
    def read_messages(self) -> List[Dict[str, Any]]:
        """
        Lee los mensajes pendientes para este agente.
        
        Returns:
            Lista de mensajes
        """
        messages_file = Path(f"agents/messages/{self.name}_inbox.json")
        
        if not messages_file.exists():
            return []
        
        with open(messages_file, 'r', encoding='utf-8') as f:
            messages = json.load(f)
        
        # Limpiar buzón después de leer
        messages_file.unlink()
        
        return messages
    
    def save_report(self, report_type: str, data: Dict[str, Any]):
        """
        Guarda un reporte generado por el agente.
        
        Args:
            report_type: Tipo de reporte (daily, weekly, etc.)
            data: Datos del reporte
        """
        reports_dir = Path(f"docs/reports/{report_type}")
        reports_dir.mkdir(parents=True, exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        report_file = reports_dir / f"{self.name}_{timestamp}.json"
        
        report_data = {
            "agent": self.name,
            "type": report_type,
            "timestamp": datetime.now().isoformat(),
            "data": data
        }
        
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report_data, f, indent=2, ensure_ascii=False)
        
        self.logger.info(f"Report saved: {report_file}")
    
    def get_project_info(self) -> Dict[str, Any]:
        """
        Obtiene información básica del proyecto.
        
        Returns:
            Dict con información del proyecto
        """
        project_root = Path(".")
        
        # Información básica
        info = {
            "name": "SRP - Sistema de Gestión de Tareas",
            "root_path": str(project_root.absolute()),
            "backend_path": str(project_root / "backend"),
            "frontend_path": str(project_root / "frontend_srp"),
            "agents_path": str(project_root / "agents")
        }
        
        # Verificar estructura
        info["has_backend"] = (project_root / "backend").exists()
        info["has_frontend"] = (project_root / "frontend_srp").exists()
        info["has_agents"] = (project_root / "agents").exists()
        
        return info