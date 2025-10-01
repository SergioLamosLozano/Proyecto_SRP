"""
Sistema de Agentes de Desarrollo - Proyecto SRP
===============================================

Este paquete contiene todos los agentes especializados para el desarrollo
colaborativo y automatizado del proyecto SRP.

Agentes disponibles:
- ProductManagerAgent: Gestión de proyecto y roadmap
- DebugManagerAgent: Análisis y resolución de errores
- GitHubManagerAgent: Gestión de repositorio y CI/CD
- ArchitectureReviewerAgent: Análisis arquitectónico y documentación
"""

__version__ = "1.0.0"
__author__ = "Sistema de Agentes SRP"

from .coordinator import AgentCoordinator
from .base_agent import BaseAgent

__all__ = [
    'AgentCoordinator',
    'BaseAgent'
]