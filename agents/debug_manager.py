"""
Debug Manager Agent - Sistema SRP
================================

Este agente se encarga del análisis automático de errores,
debugging, monitoreo de calidad del código y sugerencias de soluciones.
"""

import json
import re
import subprocess
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional

from .base_agent import BaseAgent

class DebugManagerAgent(BaseAgent):
    """
    Agente especializado en debugging y análisis de errores.
    """
    
    def __init__(self, name: str = "debug_manager", config: Dict[str, Any] = None):
        super().__init__(name, config)
        self.error_patterns = self._load_error_patterns()
        self.solutions_db = self._load_solutions_database()
        
    def execute(self, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Ejecuta el análisis de debugging del proyecto.
        """
        try:
            self.logger.info("Starting debug analysis")
            
            check_type = context.get("check_type", "general") if context else "general"
            
            analysis_result = {
                "timestamp": datetime.now().isoformat(),
                "check_type": check_type,
                "code_quality": self._analyze_code_quality(),
                "potential_bugs": self._scan_for_potential_bugs(),
                "performance_issues": self._check_performance_issues(),
                "security_concerns": self._scan_security_issues(),
                "dependency_issues": self._check_dependencies(),
                "recommendations": []
            }
            
            # Generar recomendaciones
            analysis_result["recommendations"] = self._generate_recommendations(analysis_result)
            
            # Determinar si pasó las verificaciones
            passed = self._evaluate_analysis_results(analysis_result)
            analysis_result["passed"] = passed
            
            # Generar reporte
            self._generate_debug_report(analysis_result)
            
            # Crear issues automáticamente si es necesario
            if not passed and check_type == "pre_commit":
                self._create_automated_issues(analysis_result)
            
            result = {
                "status": "success",
                "passed": passed,
                "analysis": analysis_result,
                "critical_issues": self._get_critical_issues(analysis_result)
            }
            
            self.log_execution(True, f"Debug analysis completed - Passed: {passed}")
            return result
            
        except Exception as e:
            self.log_execution(False, f"Debug analysis failed: {str(e)}")
            raise
    
    def _load_error_patterns(self) -> Dict[str, List[str]]:
        """Carga patrones de errores comunes"""
        return {
            "javascript": [
                r"Cannot read property '.*' of undefined",
                r"Cannot read properties of undefined",
                r".*is not a function",
                r"Uncaught TypeError",
                r"ReferenceError: .* is not defined",
                r"SyntaxError: Unexpected token",
                r"Cannot access '.*' before initialization"
            ],
            "typescript": [
                r"Property '.*' does not exist on type",
                r"Argument of type '.*' is not assignable to parameter",
                r"Type '.*' is missing the following properties",
                r"Cannot find module '.*'",
                r"Type '.*' has no properties in common with type"
            ],
            "python": [
                r"NameError: name '.*' is not defined",
                r"AttributeError: '.*' object has no attribute",
                r"TypeError: .* takes .* positional arguments but .* were given",
                r"IndentationError: expected an indented block",
                r"ImportError: No module named '.*'",
                r"KeyError: '.*'"
            ],
            "react": [
                r"Warning: Each child in a list should have a unique \"key\" prop",
                r"Warning: Cannot update a component while rendering a different component",
                r"Error: Minified React error",
                r"Warning: componentWillMount has been renamed"
            ]
        }
    
    def _load_solutions_database(self) -> Dict[str, Dict[str, str]]:
        """Carga base de datos de soluciones comunes"""
        return {
            "undefined_property": {
                "description": "Acceso a propiedad de objeto undefined",
                "solution": "Usar optional chaining (?.) o verificar que el objeto existe antes de acceder",
                "example": "obj?.property || obj && obj.property"
            },
            "missing_key_prop": {
                "description": "Elementos de lista sin key prop en React",
                "solution": "Agregar prop key única a cada elemento de la lista",
                "example": "items.map(item => <div key={item.id}>{item.name}</div>)"
            },
            "type_error": {
                "description": "Error de tipos en TypeScript",
                "solution": "Verificar y corregir los tipos de datos",
                "example": "Usar interfaces o types apropiados"
            },
            "import_error": {
                "description": "Error de importación de módulo",
                "solution": "Verificar que el módulo esté instalado y la ruta sea correcta",
                "example": "npm install <module> o verificar import path"
            }
        }
    
    def _analyze_code_quality(self) -> Dict[str, Any]:
        """Analiza la calidad del código"""
        quality_report = {
            "score": 0,
            "issues": [],
            "metrics": {
                "complexity": 0,
                "maintainability": 0,
                "readability": 0
            }
        }
        
        # Analizar archivos TypeScript/JavaScript
        frontend_path = Path("frontend_srp/src")
        if frontend_path.exists():
            ts_files = list(frontend_path.rglob("*.ts")) + list(frontend_path.rglob("*.tsx"))
            
            for file_path in ts_files:
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                    # Verificar problemas comunes
                    issues = self._check_file_quality(content, file_path)
                    quality_report["issues"].extend(issues)
                    
                except Exception as e:
                    self.logger.warning(f"Could not analyze {file_path}: {e}")
        
        # Analizar archivos Python
        backend_path = Path("backend")
        if backend_path.exists():
            py_files = list(backend_path.rglob("*.py"))
            
            for file_path in py_files:
                if "__pycache__" in str(file_path):
                    continue
                    
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                    issues = self._check_python_quality(content, file_path)
                    quality_report["issues"].extend(issues)
                    
                except Exception as e:
                    self.logger.warning(f"Could not analyze {file_path}: {e}")
        
        # Calcular score basado en issues encontrados
        total_issues = len(quality_report["issues"])
        critical_issues = len([i for i in quality_report["issues"] if i["severity"] == "critical"])
        high_issues = len([i for i in quality_report["issues"] if i["severity"] == "high"])
        
        # Score de 0-100
        quality_report["score"] = max(0, 100 - (critical_issues * 20) - (high_issues * 10) - (total_issues * 2))
        
        return quality_report
    
    def _check_file_quality(self, content: str, file_path: Path) -> List[Dict[str, Any]]:
        """Verifica la calidad de un archivo TypeScript/JavaScript"""
        issues = []
        lines = content.split('\n')
        
        for i, line in enumerate(lines, 1):
            # Verificar líneas muy largas
            if len(line) > 120:
                issues.append({
                    "file": str(file_path),
                    "line": i,
                    "type": "line_length",
                    "severity": "medium",
                    "message": f"Línea muy larga ({len(line)} caracteres)",
                    "suggestion": "Dividir la línea o refactorizar"
                })
            
            # Verificar console.log en producción
            if "console.log" in line and not line.strip().startswith("//"):
                issues.append({
                    "file": str(file_path),
                    "line": i,
                    "type": "console_log",
                    "severity": "medium",
                    "message": "console.log encontrado",
                    "suggestion": "Remover console.log antes de producción"
                })
            
            # Verificar TODO/FIXME
            if re.search(r'(TODO|FIXME|HACK)', line, re.IGNORECASE):
                issues.append({
                    "file": str(file_path),
                    "line": i,
                    "type": "todo",
                    "severity": "low",
                    "message": "Comentario TODO/FIXME encontrado",
                    "suggestion": "Resolver o crear issue para seguimiento"
                })
        
        # Verificar imports no utilizados (básico)
        import_lines = [line for line in lines if line.strip().startswith('import')]
        for import_line in import_lines:
            if 'import' in import_line and 'from' in import_line:
                # Extraer nombre del import
                match = re.search(r'import\s+{([^}]+)}', import_line)
                if match:
                    imports = [imp.strip() for imp in match.group(1).split(',')]
                    for imp in imports:
                        if imp not in content.replace(import_line, ''):
                            issues.append({
                                "file": str(file_path),
                                "line": lines.index(import_line) + 1,
                                "type": "unused_import",
                                "severity": "low",
                                "message": f"Import '{imp}' parece no estar siendo usado",
                                "suggestion": "Remover import no utilizado"
                            })
        
        return issues
    
    def _check_python_quality(self, content: str, file_path: Path) -> List[Dict[str, Any]]:
        """Verifica la calidad de un archivo Python"""
        issues = []
        lines = content.split('\n')
        
        for i, line in enumerate(lines, 1):
            # Verificar líneas muy largas
            if len(line) > 120:
                issues.append({
                    "file": str(file_path),
                    "line": i,
                    "type": "line_length",
                    "severity": "medium",
                    "message": f"Línea muy larga ({len(line)} caracteres)",
                    "suggestion": "Seguir PEP 8: máximo 79-88 caracteres por línea"
                })
            
            # Verificar print statements
            if re.search(r'\bprint\s*\(', line) and not line.strip().startswith('#'):
                issues.append({
                    "file": str(file_path),
                    "line": i,
                    "type": "print_statement",
                    "severity": "medium",
                    "message": "print() encontrado",
                    "suggestion": "Usar logging en lugar de print()"
                })
        
        return issues
    
    def _scan_for_potential_bugs(self) -> List[Dict[str, Any]]:
        """Escanea en busca de bugs potenciales"""
        potential_bugs = []
        
        # Escanear archivos frontend
        frontend_path = Path("frontend_srp/src")
        if frontend_path.exists():
            for file_path in frontend_path.rglob("*.tsx"):
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    bugs = self._check_react_bugs(content, file_path)
                    potential_bugs.extend(bugs)
                    
                except Exception as e:
                    self.logger.warning(f"Could not scan {file_path}: {e}")
        
        return potential_bugs
    
    def _check_react_bugs(self, content: str, file_path: Path) -> List[Dict[str, Any]]:
        """Verifica bugs comunes en React"""
        bugs = []
        lines = content.split('\n')
        
        for i, line in enumerate(lines, 1):
            # Verificar map sin key
            if '.map(' in line and 'key=' not in line and '<' in line:
                bugs.append({
                    "file": str(file_path),
                    "line": i,
                    "type": "missing_key",
                    "severity": "high",
                    "message": "Posible map sin key prop",
                    "suggestion": "Agregar key prop única a elementos de lista"
                })
            
            # Verificar useEffect sin dependencias
            if 'useEffect(' in line and i < len(lines) - 1:
                next_lines = '\n'.join(lines[i:i+5])
                if '], [])' not in next_lines and '])' in next_lines:
                    bugs.append({
                        "file": str(file_path),
                        "line": i,
                        "type": "useeffect_deps",
                        "severity": "medium",
                        "message": "useEffect posiblemente sin dependencias correctas",
                        "suggestion": "Verificar array de dependencias de useEffect"
                    })
        
        return bugs
    
    def _check_performance_issues(self) -> List[Dict[str, Any]]:
        """Verifica problemas de rendimiento"""
        performance_issues = []
        
        # Verificar tamaño de bundle (si existe)
        frontend_path = Path("frontend_srp")
        if frontend_path.exists():
            # Verificar si hay muchos imports pesados
            src_path = frontend_path / "src"
            if src_path.exists():
                for file_path in src_path.rglob("*.tsx"):
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                        
                        # Verificar imports pesados
                        heavy_imports = ['lodash', 'moment', 'antd']
                        for heavy_import in heavy_imports:
                            if f"import * as {heavy_import}" in content or f"import {heavy_import}" in content:
                                performance_issues.append({
                                    "file": str(file_path),
                                    "type": "heavy_import",
                                    "severity": "medium",
                                    "message": f"Import completo de {heavy_import}",
                                    "suggestion": f"Usar import específico: import {{ specific }} from '{heavy_import}'"
                                })
                    
                    except Exception as e:
                        continue
        
        return performance_issues
    
    def _scan_security_issues(self) -> List[Dict[str, Any]]:
        """Escanea problemas de seguridad"""
        security_issues = []
        
        # Verificar archivos de configuración
        config_files = [
            ".env",
            "backend/.env",
            "frontend_srp/.env"
        ]
        
        for config_file in config_files:
            config_path = Path(config_file)
            if config_path.exists():
                try:
                    with open(config_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # Verificar secrets hardcodeados
                    if re.search(r'(password|secret|key)\s*=\s*["\'][^"\']{8,}["\']', content, re.IGNORECASE):
                        security_issues.append({
                            "file": str(config_path),
                            "type": "hardcoded_secret",
                            "severity": "critical",
                            "message": "Posible secret hardcodeado en archivo de configuración",
                            "suggestion": "Usar variables de entorno para secrets"
                        })
                
                except Exception as e:
                    continue
        
        return security_issues
    
    def _check_dependencies(self) -> Dict[str, Any]:
        """Verifica el estado de las dependencias"""
        dependency_report = {
            "frontend": {"status": "unknown", "issues": []},
            "backend": {"status": "unknown", "issues": []}
        }
        
        # Verificar dependencias frontend
        package_json = Path("frontend_srp/package.json")
        if package_json.exists():
            try:
                with open(package_json, 'r', encoding='utf-8') as f:
                    package_data = json.load(f)
                
                # Verificar si package-lock.json existe
                if not Path("frontend_srp/package-lock.json").exists():
                    dependency_report["frontend"]["issues"].append({
                        "type": "missing_lockfile",
                        "severity": "medium",
                        "message": "package-lock.json no encontrado",
                        "suggestion": "Ejecutar npm install para generar lockfile"
                    })
                
                dependency_report["frontend"]["status"] = "ok"
                
            except Exception as e:
                dependency_report["frontend"]["issues"].append({
                    "type": "parse_error",
                    "severity": "high",
                    "message": f"Error al leer package.json: {e}",
                    "suggestion": "Verificar sintaxis de package.json"
                })
        
        # Verificar dependencias backend
        requirements_txt = Path("backend/requirements.txt")
        if requirements_txt.exists():
            dependency_report["backend"]["status"] = "ok"
        else:
            dependency_report["backend"]["issues"].append({
                "type": "missing_requirements",
                "severity": "high",
                "message": "requirements.txt no encontrado",
                "suggestion": "Crear requirements.txt con dependencias del proyecto"
            })
        
        return dependency_report
    
    def _generate_recommendations(self, analysis: Dict[str, Any]) -> List[str]:
        """Genera recomendaciones basadas en el análisis"""
        recommendations = []
        
        # Recomendaciones basadas en calidad de código
        if analysis["code_quality"]["score"] < 70:
            recommendations.append("Mejorar calidad del código: configurar ESLint y Prettier")
            recommendations.append("Refactorizar código con muchos issues de calidad")
        
        # Recomendaciones basadas en bugs potenciales
        if len(analysis["potential_bugs"]) > 5:
            recommendations.append("Revisar y corregir bugs potenciales identificados")
            recommendations.append("Implementar tests unitarios para prevenir regresiones")
        
        # Recomendaciones de rendimiento
        if len(analysis["performance_issues"]) > 0:
            recommendations.append("Optimizar imports para reducir tamaño de bundle")
            recommendations.append("Implementar code splitting para mejorar carga inicial")
        
        # Recomendaciones de seguridad
        if len(analysis["security_concerns"]) > 0:
            recommendations.append("Revisar y corregir problemas de seguridad identificados")
            recommendations.append("Implementar validación de entrada y sanitización")
        
        return recommendations
    
    def _evaluate_analysis_results(self, analysis: Dict[str, Any]) -> bool:
        """Evalúa si el análisis pasó las verificaciones"""
        # Criterios para pasar
        critical_issues = [
            issue for issue in analysis["code_quality"]["issues"] 
            if issue["severity"] == "critical"
        ]
        
        security_critical = [
            issue for issue in analysis["security_concerns"]
            if issue["severity"] == "critical"
        ]
        
        # No pasar si hay issues críticos
        if len(critical_issues) > 0 or len(security_critical) > 0:
            return False
        
        # No pasar si la calidad es muy baja
        if analysis["code_quality"]["score"] < 50:
            return False
        
        return True
    
    def _get_critical_issues(self, analysis: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Obtiene los issues críticos del análisis"""
        critical_issues = []
        
        # Issues críticos de calidad
        critical_issues.extend([
            issue for issue in analysis["code_quality"]["issues"]
            if issue["severity"] == "critical"
        ])
        
        # Issues críticos de seguridad
        critical_issues.extend([
            issue for issue in analysis["security_concerns"]
            if issue["severity"] == "critical"
        ])
        
        return critical_issues
    
    def _generate_debug_report(self, analysis: Dict[str, Any]):
        """Genera reporte de debugging"""
        reports_dir = Path("docs/reports/debug")
        reports_dir.mkdir(parents=True, exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        report_file = reports_dir / f"debug_analysis_{timestamp}.json"
        
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(analysis, f, indent=2, ensure_ascii=False)
        
        # Generar reporte en markdown
        md_report = f"""# 🐛 Reporte de Debug Analysis

**Fecha:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}  
**Tipo de Verificación:** {analysis['check_type']}  
**Estado:** {'✅ PASSED' if analysis['passed'] else '❌ FAILED'}

## 📊 Resumen

- **Score de Calidad:** {analysis['code_quality']['score']}/100
- **Issues de Calidad:** {len(analysis['code_quality']['issues'])}
- **Bugs Potenciales:** {len(analysis['potential_bugs'])}
- **Issues de Rendimiento:** {len(analysis['performance_issues'])}
- **Problemas de Seguridad:** {len(analysis['security_concerns'])}

## 🔍 Issues Críticos

"""
        
        critical_issues = self._get_critical_issues(analysis)
        if critical_issues:
            for issue in critical_issues:
                md_report += f"- **{issue['type']}** en `{issue['file']}`: {issue['message']}\n"
        else:
            md_report += "No se encontraron issues críticos.\n"
        
        md_report += f"""

## 💡 Recomendaciones

"""
        
        for i, rec in enumerate(analysis['recommendations'], 1):
            md_report += f"{i}. {rec}\n"
        
        md_report += f"""

---

*Reporte generado automáticamente por Debug Manager Agent*
"""
        
        md_file = reports_dir / f"debug_analysis_{timestamp}.md"
        with open(md_file, 'w', encoding='utf-8') as f:
            f.write(md_report)
        
        self.logger.info(f"Debug report generated: {md_file}")
    
    def _create_automated_issues(self, analysis: Dict[str, Any]):
        """Crea issues automáticamente para problemas críticos"""
        critical_issues = self._get_critical_issues(analysis)
        
        if not critical_issues:
            return
        
        issues_dir = Path("docs/issues")
        issues_dir.mkdir(parents=True, exist_ok=True)
        
        for issue in critical_issues:
            issue_data = {
                "title": f"[CRITICAL] {issue['type']}: {issue['message']}",
                "description": f"Issue detectado automáticamente por Debug Manager Agent",
                "file": issue['file'],
                "line": issue.get('line', 'N/A'),
                "severity": issue['severity'],
                "suggestion": issue.get('suggestion', 'No suggestion available'),
                "created_at": datetime.now().isoformat(),
                "status": "open"
            }
            
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            issue_file = issues_dir / f"critical_issue_{timestamp}_{issue['type']}.json"
            
            with open(issue_file, 'w', encoding='utf-8') as f:
                json.dump(issue_data, f, indent=2, ensure_ascii=False)
        
        self.logger.info(f"Created {len(critical_issues)} automated issues")
    
    def get_status(self) -> Dict[str, Any]:
        """Retorna el estado actual del agente"""
        return {
            "status": self.status,
            "last_execution": self.last_execution,
            "metrics": self.metrics,
            "capabilities": [
                "Code quality analysis",
                "Bug detection",
                "Performance monitoring",
                "Security scanning",
                "Dependency checking"
            ]
        }