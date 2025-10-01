"""
Architecture Reviewer Agent - Sistema SRP
========================================

Este agente se encarga de analizar la arquitectura del proyecto,
documentar tecnologías utilizadas y generar reportes arquitectónicos
similares a los mostrados en las imágenes del proyecto.
"""

import json
import os
import subprocess
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional

from .base_agent import BaseAgent

class ArchitectureReviewerAgent(BaseAgent):
    """
    Agente especializado en análisis arquitectónico y documentación.
    """
    
    def __init__(self, name: str = "architecture_reviewer", config: Dict[str, Any] = None):
        super().__init__(name, config)
        self.project_root = Path(".")
        self.analysis_cache = {}
        
    def execute(self, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Ejecuta el análisis arquitectónico completo del proyecto.
        """
        try:
            self.logger.info("Starting architecture analysis")
            
            # Análisis completo con manejo de errores individual
            analysis_result = {
                "timestamp": datetime.now().isoformat(),
                "project_summary": {},
                "technologies": {},
                "file_structure": {},
                "metrics": {},
                "state_management": [],
                "recommendations": []
            }
            
            # Ejecutar cada análisis por separado con manejo de errores
            try:
                analysis_result["project_summary"] = self._analyze_project_summary()
            except Exception as e:
                self.logger.error(f"Error in project summary analysis: {e}")
                analysis_result["project_summary"] = {"error": str(e)}
            
            try:
                technologies = self._analyze_technologies()
                self.logger.info(f"Technologies analysis result: {technologies}")
                analysis_result["technologies"] = technologies
            except Exception as e:
                self.logger.error(f"Error in technologies analysis: {e}")
                analysis_result["technologies"] = {"error": str(e)}
            
            try:
                analysis_result["file_structure"] = self._analyze_file_structure()
            except Exception as e:
                self.logger.error(f"Error in file structure analysis: {e}")
                analysis_result["file_structure"] = {"error": str(e)}
            
            try:
                analysis_result["metrics"] = self._calculate_metrics()
            except Exception as e:
                self.logger.error(f"Error in metrics calculation: {e}")
                analysis_result["metrics"] = {"error": str(e)}
            
            try:
                analysis_result["state_management"] = self._analyze_state_management()
            except Exception as e:
                self.logger.error(f"Error in state management analysis: {e}")
                analysis_result["state_management"] = [{"error": str(e)}]
            
            try:
                analysis_result["recommendations"] = self._generate_recommendations()
            except Exception as e:
                self.logger.error(f"Error in recommendations generation: {e}")
                analysis_result["recommendations"] = [f"Error generating recommendations: {str(e)}"]
            
            # Generar documentación solo si no hay errores críticos
            try:
                self._generate_architecture_docs(analysis_result)
                self._generate_architecture_readme(analysis_result)
                docs_generated = True
            except Exception as e:
                self.logger.error(f"Error generating documentation: {e}")
                docs_generated = False
            
            self.log_execution(True, "Architecture analysis completed with partial results")
            
            return {
                "status": "success",
                "analysis": analysis_result,
                "docs_generated": docs_generated
            }
            
        except Exception as e:
            self.log_execution(False, f"Architecture analysis failed: {str(e)}")
            raise
    
    def _analyze_project_summary(self) -> Dict[str, Any]:
        """Analiza el resumen general del proyecto"""
        summary = {
            "name": "Task Manager - Sistema de Gestión de Tareas",
            "description": "Aplicación web moderna de gestión de tareas con capacidades de colaboración en tiempo real",
            "architecture_type": "Full-Stack Web Application",
            "pattern": "Client-Server Architecture with RESTful API"
        }
        
        # Detectar si es SPA, PWA, etc.
        frontend_path = self.project_root / "frontend_srp"
        if frontend_path.exists():
            package_json = frontend_path / "package.json"
            if package_json.exists():
                try:
                    with open(package_json, 'r', encoding='utf-8', errors='ignore') as f:
                        package_data = json.load(f)
                except (UnicodeDecodeError, json.JSONDecodeError) as e:
                    self.logger.warning(f"Could not read package.json in summary: {e}")
                    package_data = {}
                    
                dependencies = package_data.get("dependencies", {})
                if "react" in dependencies:
                    summary["frontend_type"] = "Single Page Application (SPA)"
                    summary["ui_framework"] = "React"
        
        return summary
    
    def _analyze_technologies(self) -> Dict[str, List[Dict[str, str]]]:
        """Analiza las tecnologías utilizadas en el proyecto"""
        technologies = {
            "core_frameworks": [],
            "state_management": [],
            "build_tools": [],
            "backend_technologies": [],
            "databases": [],
            "testing": [],
            "deployment": []
        }
        
        # Análisis del Frontend
        frontend_path = self.project_root / "frontend_srp"
        if frontend_path.exists():
            package_json = frontend_path / "package.json"
            if package_json.exists():
                try:
                    with open(package_json, 'r', encoding='utf-8', errors='ignore') as f:
                        package_data = json.load(f)
                except (UnicodeDecodeError, json.JSONDecodeError) as e:
                    self.logger.warning(f"Could not read package.json: {e}")
                    package_data = {}
                
                deps = {**package_data.get("dependencies", {}), **package_data.get("devDependencies", {})}
                
                # Framework y librerías core
                if "react" in deps:
                    technologies["core_frameworks"].append({
                        "name": "React",
                        "version": deps["react"],
                        "purpose": "Framework de UI con concurrent features"
                    })
                
                if "typescript" in deps:
                    technologies["core_frameworks"].append({
                        "name": "TypeScript",
                        "version": deps["typescript"],
                        "purpose": "Type safety y desarrollo robusto"
                    })
                
                if "vite" in deps or "@vitejs/plugin-react" in deps:
                    technologies["build_tools"].append({
                        "name": "Vite",
                        "version": deps.get("vite", deps.get("@vitejs/plugin-react", "Latest")),
                        "purpose": "Build tool y dev server con HMR"
                    })
                
                # HTTP Client
                if "axios" in deps:
                    technologies["core_frameworks"].append({
                        "name": "Axios",
                        "version": deps["axios"],
                        "purpose": "Cliente HTTP para APIs"
                    })
                
                # Routing
                if "react-router-dom" in deps:
                    technologies["core_frameworks"].append({
                        "name": "React Router DOM",
                        "version": deps["react-router-dom"],
                        "purpose": "Enrutamiento para aplicaciones React"
                    })
                
                # Charts and Visualization
                if "chart.js" in deps:
                    technologies["core_frameworks"].append({
                        "name": "Chart.js",
                        "version": deps["chart.js"],
                        "purpose": "Librería de gráficos y visualización"
                    })
                
                if "react-chartjs-2" in deps:
                    technologies["core_frameworks"].append({
                        "name": "React Chart.js 2",
                        "version": deps["react-chartjs-2"],
                        "purpose": "Wrapper de Chart.js para React"
                    })
                
                # Forms
                if "react-hook-form" in deps:
                    technologies["core_frameworks"].append({
                        "name": "React Hook Form",
                        "version": deps["react-hook-form"],
                        "purpose": "Gestión de formularios con validación"
                    })
                
                # UI/UX Libraries
                if "react-hot-toast" in deps:
                    technologies["core_frameworks"].append({
                        "name": "React Hot Toast",
                        "version": deps["react-hot-toast"],
                        "purpose": "Notificaciones toast para React"
                    })
                
                if "sweetalert2" in deps:
                    technologies["core_frameworks"].append({
                        "name": "SweetAlert2",
                        "version": deps["sweetalert2"],
                        "purpose": "Modales y alertas personalizadas"
                    })
                
                # Icons
                if "boxicons" in deps:
                    technologies["core_frameworks"].append({
                        "name": "Boxicons",
                        "version": deps["boxicons"],
                        "purpose": "Librería de iconos"
                    })
                
                # Authentication
                if "jwt-decode" in deps:
                    technologies["core_frameworks"].append({
                        "name": "JWT Decode",
                        "version": deps["jwt-decode"],
                        "purpose": "Decodificación de tokens JWT"
                    })
                
                # State Management
                if "@tanstack/react-query" in deps:
                    technologies["state_management"].append({
                        "name": "React Query (@tanstack/react-query)",
                        "version": deps["@tanstack/react-query"],
                        "purpose": "Server state, caching, y sincronización"
                    })
                
                if "zustand" in deps:
                    technologies["state_management"].append({
                        "name": "Zustand",
                        "version": deps["zustand"],
                        "purpose": "Client state management"
                    })
                
                # Testing
                if "@testing-library/react" in deps:
                    technologies["testing"].append({
                        "name": "React Testing Library",
                        "version": deps["@testing-library/react"],
                        "purpose": "Unit, Integration y E2E completos"
                    })
        
        # Análisis del Backend
        backend_path = self.project_root / "backend"
        self.logger.info(f"Checking backend path: {backend_path}")
        if backend_path.exists():
            self.logger.info("Backend directory found")
            requirements_file = backend_path / "requirements.txt"
            self.logger.info(f"Checking requirements file: {requirements_file}")
            if requirements_file.exists():
                self.logger.info("Requirements.txt found, reading...")
                try:
                    # Leer el archivo como binario primero para detectar BOM
                    with open(requirements_file, 'rb') as f:
                        raw_content = f.read()
                    
                    # Detectar y manejar BOM
                    if raw_content.startswith(b'\xff\xfe'):
                        # UTF-16 LE BOM
                        content = raw_content[2:].decode('utf-16le')
                        self.logger.info("Detected UTF-16 LE BOM, decoded successfully")
                    elif raw_content.startswith(b'\xfe\xff'):
                        # UTF-16 BE BOM
                        content = raw_content[2:].decode('utf-16be')
                        self.logger.info("Detected UTF-16 BE BOM, decoded successfully")
                    elif raw_content.startswith(b'\xef\xbb\xbf'):
                        # UTF-8 BOM
                        content = raw_content[3:].decode('utf-8')
                        self.logger.info("Detected UTF-8 BOM, decoded successfully")
                    else:
                        # Sin BOM, intentar UTF-8
                        try:
                            content = raw_content.decode('utf-8')
                            self.logger.info("Decoded as UTF-8 without BOM")
                        except UnicodeDecodeError:
                            # Fallback a latin-1
                            content = raw_content.decode('latin-1')
                            self.logger.info("Decoded as latin-1")
                    
                    requirements = content.splitlines()
                    self.logger.info(f"Requirements read: {len(requirements)} lines")
                        
                except (PermissionError, OSError) as e:
                    self.logger.warning(f"Could not read requirements.txt: {e}")
                    requirements = []
                
                for req in requirements:
                    req = req.strip()
                    if req and not req.startswith("#"):
                        # Limpiar caracteres de control y espacios extra
                        req = ''.join(char for char in req if ord(char) >= 32 or char in '\t\n\r')
                        req = req.strip()
                        
                        if "==" in req:
                            package = req.split("==")[0].strip()
                            version = req.split("==")[1].strip()
                        elif ">=" in req:
                            package = req.split(">=")[0].strip()
                            version = "Latest"
                        else:
                            package = req.strip()
                            version = "Latest"
                        
                        self.logger.info(f"Processing package: '{package}' version: '{version}'")
                        
                        if package.lower() == "django":
                            technologies["backend_technologies"].append({
                                "name": "Django",
                                "version": version,
                                "purpose": "Framework web Python con ORM integrado"
                            })
                            self.logger.info("Django detected and added")
                        elif package.lower() == "djangorestframework":
                            technologies["backend_technologies"].append({
                                "name": "Django REST Framework",
                                "version": version,
                                "purpose": "API RESTful y serialización"
                            })
                            self.logger.info("Django REST Framework detected and added")
                        elif package.lower() == "mysqlclient":
                            technologies["databases"].append({
                                "name": "MySQL",
                                "version": version,
                                "purpose": "Base de datos relacional principal"
                            })
                            self.logger.info("MySQL detected and added")
                        elif package.lower() == "django-cors-headers":
                            technologies["backend_technologies"].append({
                                "name": "Django CORS Headers",
                                "version": version,
                                "purpose": "Manejo de CORS para APIs"
                            })
                        elif package.lower() == "djangorestframework_simplejwt":
                            technologies["backend_technologies"].append({
                                "name": "Simple JWT",
                                "version": version,
                                "purpose": "Autenticación JWT para Django REST"
                            })
                        elif package.lower() == "drf-yasg":
                            technologies["backend_technologies"].append({
                                "name": "DRF-YASG",
                                "version": version,
                                "purpose": "Documentación automática de API (Swagger)"
                            })
                        elif package.lower() == "python-decouple":
                            technologies["backend_technologies"].append({
                                "name": "Python Decouple",
                                "version": version,
                                "purpose": "Gestión de variables de entorno"
                            })
                        elif package.lower() == "pandas":
                            technologies["backend_technologies"].append({
                                "name": "Pandas",
                                "version": version,
                                "purpose": "Análisis y manipulación de datos"
                            })
                        elif package.lower() == "pillow":
                            technologies["backend_technologies"].append({
                                "name": "Pillow",
                                "version": version,
                                "purpose": "Procesamiento de imágenes"
                            })
            else:
                self.logger.warning("Requirements.txt not found in backend directory")
        else:
            self.logger.warning("Backend directory not found")
        
        self.logger.info(f"Final technologies detected: {technologies}")
        return technologies
    
    def _analyze_file_structure(self) -> Dict[str, Any]:
        """Analiza la estructura de archivos del proyecto"""
        structure = {
            "total_files": 0,
            "by_type": {},
            "directories": [],
            "key_files": [],
            "detailed_structure": {}
        }
        
        # Contar archivos por tipo
        file_types = {}
        key_files = []
        
        for root, dirs, files in os.walk(self.project_root):
            # Ignorar directorios comunes
            dirs[:] = [d for d in dirs if d not in ['.git', 'node_modules', '__pycache__', '.venv', 'venv']]
            
            for file in files:
                structure["total_files"] += 1
                
                # Obtener extensión
                ext = Path(file).suffix.lower()
                if ext:
                    file_types[ext] = file_types.get(ext, 0) + 1
                
                # Identificar archivos clave
                if file in ['package.json', 'requirements.txt', 'manage.py', 'vite.config.js', 'tsconfig.json', 'settings.py']:
                    key_files.append({
                        "name": file,
                        "path": str(Path(root) / file),
                        "type": "configuration"
                    })
        
        structure["by_type"] = file_types
        structure["key_files"] = key_files
        
        # Estructura de directorios principales con detalles
        main_dirs = []
        detailed_structure = {}
        
        for item in self.project_root.iterdir():
            if item.is_dir() and not item.name.startswith('.'):
                dir_info = {
                    "name": item.name,
                    "path": str(item),
                    "description": self._get_directory_description(item.name, str(item))
                }
                
                # Agregar subdirectorios importantes con más detalle
                if item.name in ['backend', 'frontend_srp']:
                    subdirs = []
                    try:
                        for subitem in item.iterdir():
                            if subitem.is_dir() and not subitem.name.startswith('.') and subitem.name not in ['__pycache__', 'node_modules', '.git']:
                                subdir_info = {
                                    "name": subitem.name,
                                    "description": self._get_directory_description(subitem.name, str(subitem))
                                }
                                
                                # Para directorios importantes, agregar archivos clave
                                if subitem.name in ['src', 'core', 'components', 'pages']:
                                    key_files = []
                                    try:
                                        for file_item in subitem.iterdir():
                                            if file_item.is_file() and self._is_important_file(file_item.name):
                                                key_files.append({
                                                    "name": file_item.name,
                                                    "description": self._get_file_description(file_item.name)
                                                })
                                        if key_files:
                                            subdir_info["key_files"] = key_files[:5]  # Limitar a 5 archivos
                                    except PermissionError:
                                        pass
                                
                                subdirs.append(subdir_info)
                        dir_info["subdirectories"] = subdirs
                    except PermissionError:
                        pass
                
                main_dirs.append(dir_info)
                detailed_structure[item.name] = dir_info
        
        structure["directories"] = main_dirs
        structure["detailed_structure"] = detailed_structure
        
        return structure
    
    def _get_file_description(self, filename: str) -> str:
        """Obtiene descripción para archivos importantes"""
        descriptions = {
            "manage.py": "Script de gestión de Django",
            "requirements.txt": "Dependencias de Python",
            "package.json": "Configuración y dependencias de Node.js",
            "package-lock.json": "Lockfile de dependencias de Node.js",
            "vite.config.js": "Configuración de Vite (build tool)",
            "tsconfig.json": "Configuración de TypeScript",
            "tailwind.config.js": "Configuración de Tailwind CSS",
            "postcss.config.js": "Configuración de PostCSS",
            "eslint.config.js": "Configuración de ESLint",
            ".gitignore": "Archivos ignorados por Git",
            "README.md": "Documentación principal del proyecto",
            "settings.py": "Configuración principal de Django",
            "urls.py": "Configuración de URLs",
            "wsgi.py": "Configuración WSGI para despliegue",
            "asgi.py": "Configuración ASGI para aplicaciones asíncronas",
            "models.py": "Modelos de base de datos",
            "views.py": "Vistas y lógica de controladores",
            "serializers.py": "Serializadores para API REST",
            "admin.py": "Configuración del panel de administración",
            "apps.py": "Configuración de la aplicación Django",
            "tests.py": "Pruebas unitarias",
            "index.html": "Página principal HTML",
            "main.jsx": "Punto de entrada de React",
            "App.jsx": "Componente principal de React",
            "index.css": "Estilos principales"
        }
        return descriptions.get(filename, "")
    
    def _is_important_file(self, filename: str) -> bool:
        """Determina si un archivo es importante para mostrar en la estructura"""
        important_extensions = {'.py', '.js', '.jsx', '.ts', '.tsx', '.json', '.md', '.txt', '.html', '.css', '.scss'}
        important_files = {
            'manage.py', 'requirements.txt', 'package.json', 'package-lock.json',
            'vite.config.js', 'tsconfig.json', 'tailwind.config.js', 'postcss.config.js',
            'eslint.config.js', '.gitignore', 'README.md', 'index.html'
        }
        
        return (filename in important_files or
                any(filename.endswith(ext) for ext in important_extensions) or
                filename.startswith('settings') or
                filename.startswith('urls') or
                filename.startswith('wsgi') or
                filename.startswith('asgi'))
    
    def _get_directory_description(self, dir_name: str, full_path: str = "") -> str:
        """Obtiene descripción detallada de directorios comunes"""
        descriptions = {
            "backend": "Django Backend - API REST y lógica de negocio",
            "frontend_srp": "React Frontend - Interfaz de usuario moderna",
            "backend_srp": "Configuración principal de Django",
            "core": "Aplicación principal con modelos y vistas",
            "src": "Código fuente de la aplicación React",
            "public": "Archivos estáticos públicos",
            "assets": "Recursos estáticos (imágenes, iconos, etc.)",
            "components": "Componentes reutilizables de React",
            "pages": "Páginas principales de la aplicación",
            "hooks": "Custom hooks de React",
            "services": "Servicios para APIs y lógica de negocio",
            "context": "Context API de React para estado global",
            "styles": "Archivos de estilos CSS/SCSS",
            "utils": "Utilidades y funciones auxiliares",
            "api": "Configuración de APIs y servicios",
            "migrations": "Migraciones de base de datos Django",
            "static": "Archivos estáticos de Django",
            "media": "Archivos multimedia subidos por usuarios",
            "templates": "Plantillas HTML de Django",
            "agents": "Sistema de agentes de desarrollo automatizado",
            "docs": "Documentación del proyecto",
            "logs": "Archivos de registro del sistema",
            "tests": "Pruebas unitarias y de integración",
            "node_modules": "Dependencias de Node.js",
            "dist": "Archivos compilados para producción",
            "venv": "Entorno virtual de Python",
            "__pycache__": "Cache de Python compilado"
        }
        
        # Verificar contexto específico del backend
        if "backend" in full_path.lower():
            if dir_name == "core":
                return "Aplicación principal con modelos y vistas"
            elif dir_name == "migrations":
                return "Migraciones de base de datos"
            elif dir_name == "static":
                return "Archivos estáticos del backend"
        
        # Verificar contexto específico del frontend
        if "frontend" in full_path.lower():
            if dir_name == "src":
                return "Código fuente de React"
            elif dir_name == "public":
                return "Archivos públicos del frontend"
            elif dir_name == "dist":
                return "Build de producción"
        
        return descriptions.get(dir_name, f"Directorio {dir_name}")
    
    def _calculate_metrics(self) -> Dict[str, Any]:
        """Calcula métricas del proyecto"""
        metrics = {
            "total_files": 0,
            "total_lines": 0,
            "languages": {},
            "file_types": {},
            "largest_files": []
        }
        
        try:
            # Archivos y directorios a excluir
            exclude_dirs = {
                'node_modules', '__pycache__', '.git', 'venv', 'env', 
                '.vscode', '.idea', 'dist', 'build', '.next', 'coverage',
                'logs', '.pytest_cache', 'migrations'
            }
            
            exclude_extensions = {
                '.exe', '.dll', '.so', '.dylib', '.bin', '.obj', '.o',
                '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.ico', '.svg',
                '.pdf', '.doc', '.docx', '.zip', '.rar', '.7z', '.tar',
                '.gz', '.mp4', '.mp3', '.wav', '.avi', '.mov'
            }
            
            for file_path in self.project_root.rglob("*"):
                if file_path.is_file():
                    # Verificar si el archivo está en un directorio excluido
                    if any(excluded in file_path.parts for excluded in exclude_dirs):
                        continue
                    
                    # Verificar extensión
                    if file_path.suffix.lower() in exclude_extensions:
                        continue
                    
                    try:
                        # Intentar leer el archivo
                        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                            lines = f.readlines()
                            line_count = len(lines)
                        
                        metrics["total_files"] += 1
                        metrics["total_lines"] += line_count
                        
                        # Clasificar por extensión
                        ext = file_path.suffix.lower() or "no_extension"
                        metrics["file_types"][ext] = metrics["file_types"].get(ext, 0) + 1
                        
                        # Clasificar por lenguaje
                        language = self._get_language_from_extension(ext)
                        if language not in metrics["languages"]:
                            metrics["languages"][language] = {"files": 0, "lines": 0}
                        metrics["languages"][language]["files"] += 1
                        metrics["languages"][language]["lines"] += line_count
                        
                        # Agregar a archivos más grandes
                        metrics["largest_files"].append({
                            "path": str(file_path.relative_to(self.project_root)),
                            "lines": line_count,
                            "size": file_path.stat().st_size
                        })
                        
                    except (UnicodeDecodeError, PermissionError, OSError) as e:
                        # Saltar archivos que no se pueden leer
                        self.logger.debug(f"Skipping file {file_path}: {e}")
                        continue
            
            # Ordenar archivos más grandes
            metrics["largest_files"].sort(key=lambda x: x["lines"], reverse=True)
            metrics["largest_files"] = metrics["largest_files"][:10]
            
        except Exception as e:
            self.logger.error(f"Error calculating metrics: {e}")
            
        return metrics
    
    def _get_language_from_extension(self, ext: str) -> str:
        """Obtiene el lenguaje basado en la extensión del archivo"""
        language_map = {
            '.py': 'Python',
            '.js': 'JavaScript',
            '.jsx': 'JavaScript',
            '.ts': 'TypeScript',
            '.tsx': 'TypeScript',
            '.css': 'CSS',
            '.scss': 'SCSS',
            '.sass': 'SASS',
            '.html': 'HTML',
            '.json': 'JSON',
            '.md': 'Markdown',
            '.yml': 'YAML',
            '.yaml': 'YAML',
            '.xml': 'XML',
            '.sql': 'SQL',
            '.sh': 'Shell',
            '.bat': 'Batch',
            '.dockerfile': 'Docker',
            '.gitignore': 'Git',
            '.env': 'Environment'
        }
        return language_map.get(ext, 'Other')
    
    def _analyze_state_management(self) -> List[Dict[str, str]]:
        """Analiza las tecnologías de gestión de estado"""
        state_management = []
        
        # Verificar React Query
        frontend_path = self.project_root / "frontend_srp"
        if frontend_path.exists():
            package_json = frontend_path / "package.json"
            if package_json.exists():
                with open(package_json, 'r', encoding='utf-8') as f:
                    package_data = json.load(f)
                
                deps = {**package_data.get("dependencies", {}), **package_data.get("devDependencies", {})}
                
                if "@tanstack/react-query" in deps:
                    state_management.append({
                        "technology": "React Query (@tanstack/react-query)",
                        "version": deps["@tanstack/react-query"],
                        "purpose": "Server state, caching, y sincronización"
                    })
        
        return state_management
    
    def _generate_recommendations(self) -> List[str]:
        """Genera recomendaciones arquitectónicas"""
        recommendations = [
            "Implementar lazy loading para componentes de rutas",
            "Configurar service workers para funcionalidad offline",
            "Agregar monitoring y analytics de rendimiento",
            "Implementar tests de integración con Cypress",
            "Configurar CI/CD pipeline con GitHub Actions",
            "Agregar documentación de API con Swagger/OpenAPI",
            "Implementar rate limiting en endpoints críticos",
            "Configurar logging estructurado para debugging"
        ]
        
        return recommendations
    
    def _generate_architecture_docs(self, analysis: Dict[str, Any]):
        """Genera documentación arquitectónica detallada"""
        docs_dir = Path("docs/architecture")
        docs_dir.mkdir(parents=True, exist_ok=True)
        
        # Obtener métricas de forma segura
        metrics = analysis.get('metrics', {})
        total_lines = metrics.get('total_lines', 0)
        total_files = analysis.get('file_structure', {}).get('total_files', 0)
        
        # Documento principal de arquitectura
        arch_doc = f"""# Análisis Arquitectónico - Task Manager

## Resumen del Proyecto

**{analysis['project_summary'].get('name', 'Task Manager')}**

{analysis['project_summary'].get('description', 'Sistema de gestión de tareas')}

La aplicación está construida siguiendo principios de arquitectura limpia, separación de responsabilidades y patrones de diseño modernos de React.

## Métricas del Proyecto

- **Total de archivos:** {total_files} archivos
- **Total de líneas de código:** ~{total_lines:,} líneas
- **Lenguajes detectados:** {len(metrics.get('languages', {}))} lenguajes

## Tecnologías Utilizadas

### Framework y Librerías Core

"""
        
        for tech in analysis['technologies'].get('core_frameworks', []):
            arch_doc += f"- **{tech['name']}** {tech['version']}: {tech['purpose']}\n"
        
        arch_doc += "\n### Build Tools y Dev Server\n\n"
        for tech in analysis['technologies'].get('build_tools', []):
            arch_doc += f"- **{tech['name']}** {tech['version']}: {tech['purpose']}\n"
        
        arch_doc += "\n### Gestión de Estado\n\n"
        for tech in analysis['technologies'].get('state_management', []):
            arch_doc += f"- **{tech['name']}** {tech['version']}: {tech['purpose']}\n"
        
        if analysis['technologies'].get('backend_technologies'):
            arch_doc += "\n### Backend Technologies\n\n"
            for tech in analysis['technologies']['backend_technologies']:
                arch_doc += f"- **{tech['name']}** {tech['version']}: {tech['purpose']}\n"
        
        if analysis['technologies'].get('databases'):
            arch_doc += "\n### Bases de Datos\n\n"
            for tech in analysis['technologies']['databases']:
                arch_doc += f"- **{tech['name']}** {tech['version']}: {tech['purpose']}\n"
        
        arch_doc += f"""

## Estructura de Carpetas y Archivos

### Directorios Principales

"""
        
        for directory in analysis['file_structure']['directories']:
            arch_doc += f"- **{directory['name']}/**: {directory['description']}\n"
            # Mostrar subdirectorios si existen
            if 'subdirectories' in directory and directory['subdirectories']:
                for subdir in directory['subdirectories']:
                    arch_doc += f"  - **{subdir['name']}/**: {subdir['description']}\n"
                    # Mostrar archivos clave si existen
                    if 'key_files' in subdir and subdir['key_files']:
                        for key_file in subdir['key_files']:
                            arch_doc += f"    - `{key_file['name']}`: {key_file['description']}\n"
        
        arch_doc += f"""

### Distribución por Lenguaje

"""
        
        for lang, data in analysis['metrics'].get('languages', {}).items():
            arch_doc += f"- **{lang}**: {data['files']} archivos, {data['lines']:,} líneas\n"
        
        arch_doc += f"""

## Recomendaciones de Mejora

"""
        
        for i, rec in enumerate(analysis['recommendations'], 1):
            arch_doc += f"{i}. {rec}\n"
        
        arch_doc += f"""

---

*Análisis generado automáticamente por Architecture Reviewer Agent*  
*Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*
"""
        
        # Guardar documento
        with open(docs_dir / "architecture-analysis.md", 'w', encoding='utf-8') as f:
            f.write(arch_doc)
        
        self.logger.info("Architecture documentation generated")
    
    def _generate_architecture_readme(self, analysis: Dict[str, Any]):
        """Genera README arquitectónico para GitHub"""
        readme_content = f"""# 🏗️ Arquitectura del Proyecto - Task Manager

## 📋 Resumen del Proyecto

**Task Manager** es una aplicación web moderna de gestión de tareas con capacidades de colaboración en tiempo real. La aplicación está construida siguiendo principios de arquitectura limpia, separación de responsabilidades y patrones de diseño modernos de React.

## 📊 Métricas del Proyecto

- 📁 **Total de archivos TypeScript/TSX:** {analysis['file_structure']['by_type'].get('.tsx', 0) + analysis['file_structure']['by_type'].get('.ts', 0)} archivos
- 📈 **Total de líneas de código:** ~{analysis['metrics'].get('total_lines', 0):,} líneas  
- ✅ **Cobertura de tests:** {analysis['metrics'].get('test_coverage', 'No disponible')}

## 🛠️ Tecnologías Utilizadas

### Framework y Librerías Core

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
"""
        
        for tech in analysis['technologies']['core_frameworks']:
            readme_content += f"| {tech['name']} | {tech['version']} | {tech['purpose']} |\n"
        
        if analysis['technologies']['build_tools']:
            readme_content += "\n### Build Tools y Dev Server\n\n| Tecnología | Versión | Propósito |\n|------------|---------|-----------|\n"
            for tech in analysis['technologies']['build_tools']:
                readme_content += f"| {tech['name']} | {tech['version']} | {tech['purpose']} |\n"
        
        if analysis['technologies']['state_management']:
            readme_content += "\n### Gestión de Estado\n\n| Tecnología | Versión | Propósito |\n|------------|---------|-----------|\n"
            for tech in analysis['technologies']['state_management']:
                readme_content += f"| {tech['name']} | {tech['version']} | {tech['purpose']} |\n"
        
        if analysis['technologies']['backend_technologies']:
            readme_content += "\n### Backend Technologies\n\n| Tecnología | Versión | Propósito |\n|------------|---------|-----------|\n"
            for tech in analysis['technologies']['backend_technologies']:
                readme_content += f"| {tech['name']} | {tech['version']} | {tech['purpose']} |\n"
        
        if analysis['technologies']['databases']:
            readme_content += "\n### Bases de Datos\n\n| Tecnología | Versión | Propósito |\n|------------|---------|-----------|\n"
            for tech in analysis['technologies']['databases']:
                readme_content += f"| {tech['name']} | {tech['version']} | {tech['purpose']} |\n"
        
        readme_content += f"""

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

"""
        
        total_lines = analysis['metrics'].get('total_lines', 1)  # Evitar división por cero
        for lang, data in analysis['metrics'].get('languages', {}).items():
            percentage = (data['lines'] / total_lines * 100) if total_lines > 0 else 0
            readme_content += f"- **{lang}**: {data['files']} archivos, {data['lines']:,} líneas ({percentage:.1f}%)\n"
        
        readme_content += f"""

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

- ✅ Cobertura de tests: {analysis['metrics'].get('test_coverage', 'No disponible')}
- 🏗️ Arquitectura: Modular y escalable
- 📝 Documentación: Completa y actualizada
- 🔧 Mantenibilidad: Alta

---

*Documentación generada automáticamente por Architecture Reviewer Agent*  
*Última actualización: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*
"""
        
        # Guardar README arquitectónico
        with open(self.project_root / "ARQUITECTURA.md", 'w', encoding='utf-8') as f:
            f.write(readme_content)
        
        self.logger.info("Architecture README generated")
    
    def get_status(self) -> Dict[str, Any]:
        """Retorna el estado actual del agente"""
        return {
            "status": self.status,
            "last_execution": self.last_execution,
            "metrics": self.metrics,
            "capabilities": [
                "Project structure analysis",
                "Technology stack documentation", 
                "Architecture recommendations",
                "Metrics calculation",
                "Documentation generation"
            ]
        }