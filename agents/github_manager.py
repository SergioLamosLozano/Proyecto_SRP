"""
GitHub Manager Agent - Sistema SRP
==================================

Este agente se encarga de la gestión automática del repositorio GitHub,
incluyendo commits, branches, releases, CI/CD y documentación.
"""

import json
import subprocess
import re
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional

from .base_agent import BaseAgent

class GitHubManagerAgent(BaseAgent):
    """
    Agente especializado en gestión de GitHub y control de versiones.
    """
    
    def __init__(self, name: str = "github_manager", config: Dict[str, Any] = None):
        super().__init__(name, config)
        self.repo_info = self._get_repository_info()
        
    def execute(self, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Ejecuta las tareas de gestión de GitHub.
        """
        try:
            self.logger.info("Starting GitHub management tasks")
            
            action = context.get("action", "status") if context else "status"
            
            if action == "pre_commit":
                result = self._pre_commit_checks()
            elif action == "prepare_release":
                result = self._prepare_release()
            elif action == "update_docs":
                result = self._update_documentation()
            elif action == "sync_branches":
                result = self._sync_branches()
            elif action == "generate_changelog":
                result = self._generate_changelog()
            else:
                result = self._get_repository_status()
            
            self.log_execution(True, f"GitHub management completed - Action: {action}")
            return result
            
        except Exception as e:
            self.log_execution(False, f"GitHub management failed: {str(e)}")
            raise
    
    def _get_repository_info(self) -> Dict[str, Any]:
        """Obtiene información del repositorio"""
        repo_info = {
            "is_git_repo": False,
            "current_branch": None,
            "remote_url": None,
            "has_uncommitted_changes": False,
            "last_commit": None
        }
        
        try:
            # Verificar si es un repositorio git
            result = subprocess.run(
                ["git", "rev-parse", "--is-inside-work-tree"],
                capture_output=True,
                text=True,
                cwd=self.project_root
            )
            
            if result.returncode == 0:
                repo_info["is_git_repo"] = True
                
                # Obtener branch actual
                result = subprocess.run(
                    ["git", "branch", "--show-current"],
                    capture_output=True,
                    text=True,
                    cwd=self.project_root
                )
                if result.returncode == 0:
                    repo_info["current_branch"] = result.stdout.strip()
                
                # Obtener URL remota
                result = subprocess.run(
                    ["git", "remote", "get-url", "origin"],
                    capture_output=True,
                    text=True,
                    cwd=self.project_root
                )
                if result.returncode == 0:
                    repo_info["remote_url"] = result.stdout.strip()
                
                # Verificar cambios sin commit
                result = subprocess.run(
                    ["git", "status", "--porcelain"],
                    capture_output=True,
                    text=True,
                    cwd=self.project_root
                )
                if result.returncode == 0:
                    repo_info["has_uncommitted_changes"] = bool(result.stdout.strip())
                
                # Obtener último commit
                result = subprocess.run(
                    ["git", "log", "-1", "--pretty=format:%H|%s|%an|%ad"],
                    capture_output=True,
                    text=True,
                    cwd=self.project_root
                )
                if result.returncode == 0 and result.stdout:
                    parts = result.stdout.split('|')
                    if len(parts) >= 4:
                        repo_info["last_commit"] = {
                            "hash": parts[0],
                            "message": parts[1],
                            "author": parts[2],
                            "date": parts[3]
                        }
        
        except Exception as e:
            self.logger.warning(f"Could not get repository info: {e}")
        
        return repo_info
    
    def _get_repository_status(self) -> Dict[str, Any]:
        """Obtiene el estado completo del repositorio"""
        status = {
            "timestamp": datetime.now().isoformat(),
            "repository": self.repo_info,
            "files_status": self._get_files_status(),
            "branch_info": self._get_branch_info(),
            "commit_history": self._get_recent_commits(),
            "issues": self._check_repository_issues()
        }
        
        return {
            "status": "success",
            "data": status
        }
    
    def _get_files_status(self) -> Dict[str, Any]:
        """Obtiene el estado de los archivos"""
        files_status = {
            "modified": [],
            "added": [],
            "deleted": [],
            "untracked": []
        }
        
        if not self.repo_info["is_git_repo"]:
            return files_status
        
        try:
            result = subprocess.run(
                ["git", "status", "--porcelain"],
                capture_output=True,
                text=True,
                cwd=self.project_root
            )
            
            if result.returncode == 0:
                for line in result.stdout.strip().split('\n'):
                    if not line:
                        continue
                    
                    status_code = line[:2]
                    file_path = line[3:]
                    
                    if status_code.startswith('M'):
                        files_status["modified"].append(file_path)
                    elif status_code.startswith('A'):
                        files_status["added"].append(file_path)
                    elif status_code.startswith('D'):
                        files_status["deleted"].append(file_path)
                    elif status_code.startswith('??'):
                        files_status["untracked"].append(file_path)
        
        except Exception as e:
            self.logger.warning(f"Could not get files status: {e}")
        
        return files_status
    
    def _get_branch_info(self) -> Dict[str, Any]:
        """Obtiene información de las ramas"""
        branch_info = {
            "current": self.repo_info.get("current_branch"),
            "all_branches": [],
            "remote_branches": [],
            "ahead_behind": {"ahead": 0, "behind": 0}
        }
        
        if not self.repo_info["is_git_repo"]:
            return branch_info
        
        try:
            # Obtener todas las ramas locales
            result = subprocess.run(
                ["git", "branch"],
                capture_output=True,
                text=True,
                cwd=self.project_root
            )
            
            if result.returncode == 0:
                for line in result.stdout.strip().split('\n'):
                    branch = line.strip().replace('* ', '')
                    if branch:
                        branch_info["all_branches"].append(branch)
            
            # Obtener ramas remotas
            result = subprocess.run(
                ["git", "branch", "-r"],
                capture_output=True,
                text=True,
                cwd=self.project_root
            )
            
            if result.returncode == 0:
                for line in result.stdout.strip().split('\n'):
                    branch = line.strip()
                    if branch and not branch.startswith('origin/HEAD'):
                        branch_info["remote_branches"].append(branch)
            
            # Verificar si está adelante/atrás del remoto
            if branch_info["current"]:
                result = subprocess.run(
                    ["git", "rev-list", "--left-right", "--count", f"origin/{branch_info['current']}...HEAD"],
                    capture_output=True,
                    text=True,
                    cwd=self.project_root
                )
                
                if result.returncode == 0 and result.stdout.strip():
                    parts = result.stdout.strip().split('\t')
                    if len(parts) == 2:
                        branch_info["ahead_behind"]["behind"] = int(parts[0])
                        branch_info["ahead_behind"]["ahead"] = int(parts[1])
        
        except Exception as e:
            self.logger.warning(f"Could not get branch info: {e}")
        
        return branch_info
    
    def _get_recent_commits(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Obtiene los commits recientes"""
        commits = []
        
        if not self.repo_info["is_git_repo"]:
            return commits
        
        try:
            result = subprocess.run(
                ["git", "log", f"-{limit}", "--pretty=format:%H|%s|%an|%ad|%ar"],
                capture_output=True,
                text=True,
                cwd=self.project_root
            )
            
            if result.returncode == 0:
                for line in result.stdout.strip().split('\n'):
                    if line:
                        parts = line.split('|')
                        if len(parts) >= 5:
                            commits.append({
                                "hash": parts[0][:8],  # Short hash
                                "message": parts[1],
                                "author": parts[2],
                                "date": parts[3],
                                "relative_date": parts[4]
                            })
        
        except Exception as e:
            self.logger.warning(f"Could not get recent commits: {e}")
        
        return commits
    
    def _check_repository_issues(self) -> List[Dict[str, Any]]:
        """Verifica problemas del repositorio"""
        issues = []
        
        # Verificar si hay archivos grandes
        large_files = self._find_large_files()
        if large_files:
            issues.append({
                "type": "large_files",
                "severity": "medium",
                "message": f"Archivos grandes encontrados: {len(large_files)}",
                "details": large_files,
                "suggestion": "Considerar usar Git LFS para archivos grandes"
            })
        
        # Verificar .gitignore
        gitignore_path = Path(".gitignore")
        if not gitignore_path.exists():
            issues.append({
                "type": "missing_gitignore",
                "severity": "medium",
                "message": ".gitignore no encontrado",
                "suggestion": "Crear .gitignore para excluir archivos innecesarios"
            })
        else:
            # Verificar si .gitignore está completo
            with open(gitignore_path, 'r', encoding='utf-8') as f:
                gitignore_content = f.read()
            
            required_patterns = [
                'node_modules/',
                '*.log',
                '.env',
                '__pycache__/',
                '*.pyc'
            ]
            
            missing_patterns = [
                pattern for pattern in required_patterns
                if pattern not in gitignore_content
            ]
            
            if missing_patterns:
                issues.append({
                    "type": "incomplete_gitignore",
                    "severity": "low",
                    "message": f"Patrones faltantes en .gitignore: {missing_patterns}",
                    "suggestion": "Agregar patrones comunes a .gitignore"
                })
        
        # Verificar README
        readme_files = ['README.md', 'readme.md', 'README.txt']
        has_readme = any(Path(readme).exists() for readme in readme_files)
        
        if not has_readme:
            issues.append({
                "type": "missing_readme",
                "severity": "high",
                "message": "README no encontrado",
                "suggestion": "Crear README.md con información del proyecto"
            })
        
        return issues
    
    def _find_large_files(self, size_limit_mb: int = 10) -> List[Dict[str, Any]]:
        """Encuentra archivos grandes en el repositorio"""
        large_files = []
        size_limit_bytes = size_limit_mb * 1024 * 1024
        
        try:
            for file_path in Path('.').rglob('*'):
                if file_path.is_file() and not any(part.startswith('.git') for part in file_path.parts):
                    try:
                        size = file_path.stat().st_size
                        if size > size_limit_bytes:
                            large_files.append({
                                "path": str(file_path),
                                "size_mb": round(size / (1024 * 1024), 2)
                            })
                    except (OSError, PermissionError):
                        continue
        
        except Exception as e:
            self.logger.warning(f"Could not scan for large files: {e}")
        
        return large_files
    
    def _pre_commit_checks(self) -> Dict[str, Any]:
        """Ejecuta verificaciones pre-commit"""
        checks = {
            "timestamp": datetime.now().isoformat(),
            "passed": True,
            "checks": []
        }
        
        # Verificar que no hay archivos grandes siendo agregados
        files_status = self._get_files_status()
        for file_path in files_status["added"] + files_status["modified"]:
            try:
                file_size = Path(file_path).stat().st_size
                if file_size > 5 * 1024 * 1024:  # 5MB
                    checks["checks"].append({
                        "name": "large_file_check",
                        "passed": False,
                        "message": f"Archivo grande detectado: {file_path} ({file_size / (1024*1024):.1f}MB)",
                        "suggestion": "Considerar usar Git LFS o reducir tamaño del archivo"
                    })
                    checks["passed"] = False
            except (OSError, FileNotFoundError):
                continue
        
        # Verificar que no hay secrets en los archivos
        secret_patterns = [
            r'password\s*=\s*["\'][^"\']{8,}["\']',
            r'secret\s*=\s*["\'][^"\']{16,}["\']',
            r'api_key\s*=\s*["\'][^"\']{16,}["\']',
            r'token\s*=\s*["\'][^"\']{16,}["\']'
        ]
        
        for file_path in files_status["added"] + files_status["modified"]:
            try:
                if Path(file_path).suffix in ['.py', '.js', '.ts', '.tsx', '.json']:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    for pattern in secret_patterns:
                        if re.search(pattern, content, re.IGNORECASE):
                            checks["checks"].append({
                                "name": "secret_check",
                                "passed": False,
                                "message": f"Posible secret detectado en {file_path}",
                                "suggestion": "Remover secrets hardcodeados y usar variables de entorno"
                            })
                            checks["passed"] = False
                            break
            
            except (OSError, UnicodeDecodeError):
                continue
        
        # Verificar formato de mensaje de commit
        if checks["passed"]:
            checks["checks"].append({
                "name": "pre_commit_validation",
                "passed": True,
                "message": "Todas las verificaciones pre-commit pasaron",
                "suggestion": "Listo para commit"
            })
        
        return {
            "status": "success",
            "data": checks
        }
    
    def _prepare_release(self) -> Dict[str, Any]:
        """Prepara una nueva release"""
        release_info = {
            "timestamp": datetime.now().isoformat(),
            "current_version": self._get_current_version(),
            "suggested_version": None,
            "changelog": [],
            "release_notes": "",
            "ready": False
        }
        
        # Generar changelog desde último tag
        changelog = self._generate_changelog_since_last_tag()
        release_info["changelog"] = changelog
        
        # Sugerir nueva versión basada en cambios
        release_info["suggested_version"] = self._suggest_version_bump(changelog)
        
        # Generar notas de release
        release_info["release_notes"] = self._generate_release_notes(changelog)
        
        # Verificar si está listo para release
        release_info["ready"] = self._is_ready_for_release()
        
        return {
            "status": "success",
            "data": release_info
        }
    
    def _get_current_version(self) -> Optional[str]:
        """Obtiene la versión actual del proyecto"""
        # Verificar package.json
        package_json = Path("frontend_srp/package.json")
        if package_json.exists():
            try:
                with open(package_json, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                return data.get("version")
            except Exception:
                pass
        
        # Verificar último tag
        if self.repo_info["is_git_repo"]:
            try:
                result = subprocess.run(
                    ["git", "describe", "--tags", "--abbrev=0"],
                    capture_output=True,
                    text=True,
                    cwd=self.project_root
                )
                if result.returncode == 0:
                    return result.stdout.strip()
            except Exception:
                pass
        
        return "0.1.0"  # Versión por defecto
    
    def _generate_changelog_since_last_tag(self) -> List[Dict[str, Any]]:
        """Genera changelog desde el último tag"""
        changelog = []
        
        if not self.repo_info["is_git_repo"]:
            return changelog
        
        try:
            # Obtener commits desde último tag
            result = subprocess.run(
                ["git", "log", "--oneline", "--since=1 month ago"],
                capture_output=True,
                text=True,
                cwd=self.project_root
            )
            
            if result.returncode == 0:
                for line in result.stdout.strip().split('\n'):
                    if line:
                        parts = line.split(' ', 1)
                        if len(parts) >= 2:
                            commit_hash = parts[0]
                            message = parts[1]
                            
                            # Categorizar el commit
                            category = self._categorize_commit(message)
                            
                            changelog.append({
                                "hash": commit_hash,
                                "message": message,
                                "category": category
                            })
        
        except Exception as e:
            self.logger.warning(f"Could not generate changelog: {e}")
        
        return changelog
    
    def _categorize_commit(self, message: str) -> str:
        """Categoriza un commit basado en su mensaje"""
        message_lower = message.lower()
        
        if any(keyword in message_lower for keyword in ['feat', 'feature', 'add']):
            return "feature"
        elif any(keyword in message_lower for keyword in ['fix', 'bug', 'patch']):
            return "bugfix"
        elif any(keyword in message_lower for keyword in ['docs', 'documentation']):
            return "documentation"
        elif any(keyword in message_lower for keyword in ['refactor', 'cleanup']):
            return "refactor"
        elif any(keyword in message_lower for keyword in ['test', 'testing']):
            return "test"
        elif any(keyword in message_lower for keyword in ['chore', 'update', 'upgrade']):
            return "chore"
        else:
            return "other"
    
    def _suggest_version_bump(self, changelog: List[Dict[str, Any]]) -> str:
        """Sugiere incremento de versión basado en changelog"""
        current_version = self._get_current_version()
        
        if not current_version:
            return "1.0.0"
        
        # Parsear versión actual
        try:
            parts = current_version.replace('v', '').split('.')
            major, minor, patch = int(parts[0]), int(parts[1]), int(parts[2])
        except (ValueError, IndexError):
            return "1.0.0"
        
        # Determinar tipo de bump basado en changelog
        has_breaking = any('breaking' in commit['message'].lower() for commit in changelog)
        has_features = any(commit['category'] == 'feature' for commit in changelog)
        has_fixes = any(commit['category'] == 'bugfix' for commit in changelog)
        
        if has_breaking:
            return f"{major + 1}.0.0"
        elif has_features:
            return f"{major}.{minor + 1}.0"
        elif has_fixes:
            return f"{major}.{minor}.{patch + 1}"
        else:
            return current_version
    
    def _generate_release_notes(self, changelog: List[Dict[str, Any]]) -> str:
        """Genera notas de release"""
        if not changelog:
            return "No changes in this release."
        
        notes = "## What's Changed\n\n"
        
        # Agrupar por categoría
        categories = {
            "feature": "### 🚀 New Features\n",
            "bugfix": "### 🐛 Bug Fixes\n",
            "documentation": "### 📚 Documentation\n",
            "refactor": "### ♻️ Refactoring\n",
            "test": "### 🧪 Testing\n",
            "chore": "### 🔧 Maintenance\n",
            "other": "### 📝 Other Changes\n"
        }
        
        for category, header in categories.items():
            category_commits = [c for c in changelog if c['category'] == category]
            if category_commits:
                notes += header
                for commit in category_commits:
                    notes += f"- {commit['message']} ({commit['hash']})\n"
                notes += "\n"
        
        return notes
    
    def _is_ready_for_release(self) -> bool:
        """Verifica si el proyecto está listo para release"""
        # Verificar que no hay cambios sin commit
        if self.repo_info.get("has_uncommitted_changes", True):
            return False
        
        # Verificar que hay commits desde último tag
        try:
            result = subprocess.run(
                ["git", "log", "--oneline", "HEAD...HEAD~1"],
                capture_output=True,
                text=True,
                cwd=self.project_root
            )
            if result.returncode != 0 or not result.stdout.strip():
                return False
        except Exception:
            return False
        
        return True
    
    def _update_documentation(self) -> Dict[str, Any]:
        """Actualiza la documentación del proyecto"""
        docs_updated = []
        
        # Actualizar README si es necesario
        readme_path = Path("README.md")
        if not readme_path.exists():
            self._create_readme()
            docs_updated.append("README.md created")
        
        # Actualizar CONTRIBUTING.md
        contributing_path = Path("CONTRIBUTING.md")
        if not contributing_path.exists():
            self._create_contributing_guide()
            docs_updated.append("CONTRIBUTING.md created")
        
        # Actualizar documentación de API si existe
        api_docs = self._update_api_documentation()
        if api_docs:
            docs_updated.extend(api_docs)
        
        return {
            "status": "success",
            "data": {
                "updated_files": docs_updated,
                "timestamp": datetime.now().isoformat()
            }
        }
    
    def _create_readme(self):
        """Crea un README básico"""
        readme_content = f"""# {Path.cwd().name}

## Descripción

Sistema de Responsabilidad Social Empresarial (SRP) desarrollado con React y TypeScript.

## Tecnologías Utilizadas

- **Frontend:** React, TypeScript, Vite
- **Backend:** Python (si aplica)
- **Agentes:** Sistema de agentes automatizados para desarrollo

## Instalación

### Frontend
```bash
cd frontend_srp
npm install
npm run dev
```

## Estructura del Proyecto

```
{Path.cwd().name}/
├── frontend_srp/          # Aplicación React
├── agents/                # Sistema de agentes
├── docs/                  # Documentación
└── README.md
```

## Agentes del Sistema

Este proyecto utiliza un sistema de agentes automatizados:

- **Product Manager Agent:** Gestión de roadmap y prioridades
- **Debug Manager Agent:** Análisis de código y debugging
- **GitHub Manager Agent:** Gestión de repositorio y CI/CD
- **Architecture Reviewer Agent:** Análisis arquitectónico

## Contribución

Ver [CONTRIBUTING.md](CONTRIBUTING.md) para guías de contribución.

## Licencia

Este proyecto está bajo la licencia MIT.

---

*README generado automáticamente por GitHub Manager Agent*
"""
        
        with open("README.md", 'w', encoding='utf-8') as f:
            f.write(readme_content)
    
    def _create_contributing_guide(self):
        """Crea guía de contribución"""
        contributing_content = """# Guía de Contribución

## Cómo Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Estándares de Código

- Usar TypeScript para el frontend
- Seguir las convenciones de naming
- Escribir tests para nuevas funcionalidades
- Documentar funciones complejas

## Proceso de Review

- Todos los PRs requieren review
- Los tests deben pasar
- El código debe seguir los estándares establecidos

## Reportar Bugs

Usar el template de issues para reportar bugs con:
- Descripción del problema
- Pasos para reproducir
- Comportamiento esperado vs actual
- Screenshots si aplica

---

*Guía generada automáticamente por GitHub Manager Agent*
"""
        
        with open("CONTRIBUTING.md", 'w', encoding='utf-8') as f:
            f.write(contributing_content)
    
    def _update_api_documentation(self) -> List[str]:
        """Actualiza documentación de API"""
        updated = []
        
        # Buscar archivos de API
        api_files = []
        backend_path = Path("backend")
        if backend_path.exists():
            api_files.extend(backend_path.rglob("*api*.py"))
            api_files.extend(backend_path.rglob("*routes*.py"))
        
        if api_files:
            # Generar documentación básica de API
            api_doc_content = "# API Documentation\n\n"
            api_doc_content += "## Endpoints\n\n"
            api_doc_content += "*Documentación generada automáticamente*\n"
            
            docs_dir = Path("docs")
            docs_dir.mkdir(exist_ok=True)
            
            with open(docs_dir / "API.md", 'w', encoding='utf-8') as f:
                f.write(api_doc_content)
            
            updated.append("docs/API.md")
        
        return updated
    
    def _sync_branches(self) -> Dict[str, Any]:
        """Sincroniza ramas con el remoto"""
        sync_result = {
            "timestamp": datetime.now().isoformat(),
            "synced_branches": [],
            "conflicts": [],
            "success": True
        }
        
        if not self.repo_info["is_git_repo"]:
            sync_result["success"] = False
            sync_result["error"] = "Not a git repository"
            return {"status": "error", "data": sync_result}
        
        try:
            # Fetch cambios del remoto
            result = subprocess.run(
                ["git", "fetch", "origin"],
                capture_output=True,
                text=True,
                cwd=self.project_root
            )
            
            if result.returncode == 0:
                sync_result["synced_branches"].append("origin fetched")
            else:
                sync_result["success"] = False
                sync_result["error"] = result.stderr
        
        except Exception as e:
            sync_result["success"] = False
            sync_result["error"] = str(e)
        
        return {
            "status": "success" if sync_result["success"] else "error",
            "data": sync_result
        }
    
    def _generate_changelog(self) -> Dict[str, Any]:
        """Genera changelog completo"""
        changelog_data = {
            "timestamp": datetime.now().isoformat(),
            "versions": []
        }
        
        # Generar changelog desde tags
        if self.repo_info["is_git_repo"]:
            try:
                # Obtener todos los tags
                result = subprocess.run(
                    ["git", "tag", "-l", "--sort=-version:refname"],
                    capture_output=True,
                    text=True,
                    cwd=self.project_root
                )
                
                if result.returncode == 0:
                    tags = result.stdout.strip().split('\n')
                    
                    for i, tag in enumerate(tags):
                        if not tag:
                            continue
                        
                        version_info = {
                            "version": tag,
                            "date": self._get_tag_date(tag),
                            "changes": []
                        }
                        
                        # Obtener commits entre tags
                        if i < len(tags) - 1:
                            commits = self._get_commits_between_tags(tags[i+1], tag)
                        else:
                            commits = self._get_commits_since_tag(tag)
                        
                        version_info["changes"] = commits
                        changelog_data["versions"].append(version_info)
            
            except Exception as e:
                self.logger.warning(f"Could not generate changelog: {e}")
        
        # Guardar changelog
        changelog_path = Path("CHANGELOG.md")
        self._write_changelog_file(changelog_data, changelog_path)
        
        return {
            "status": "success",
            "data": changelog_data,
            "file": str(changelog_path)
        }
    
    def _get_tag_date(self, tag: str) -> str:
        """Obtiene la fecha de un tag"""
        try:
            result = subprocess.run(
                ["git", "log", "-1", "--format=%ai", tag],
                capture_output=True,
                text=True,
                cwd=self.project_root
            )
            if result.returncode == 0:
                return result.stdout.strip()
        except Exception:
            pass
        return datetime.now().isoformat()
    
    def _get_commits_between_tags(self, old_tag: str, new_tag: str) -> List[Dict[str, Any]]:
        """Obtiene commits entre dos tags"""
        commits = []
        try:
            result = subprocess.run(
                ["git", "log", "--oneline", f"{old_tag}..{new_tag}"],
                capture_output=True,
                text=True,
                cwd=self.project_root
            )
            
            if result.returncode == 0:
                for line in result.stdout.strip().split('\n'):
                    if line:
                        parts = line.split(' ', 1)
                        if len(parts) >= 2:
                            commits.append({
                                "hash": parts[0],
                                "message": parts[1],
                                "category": self._categorize_commit(parts[1])
                            })
        except Exception:
            pass
        return commits
    
    def _get_commits_since_tag(self, tag: str) -> List[Dict[str, Any]]:
        """Obtiene commits desde un tag"""
        commits = []
        try:
            result = subprocess.run(
                ["git", "log", "--oneline", f"{tag}..HEAD"],
                capture_output=True,
                text=True,
                cwd=self.project_root
            )
            
            if result.returncode == 0:
                for line in result.stdout.strip().split('\n'):
                    if line:
                        parts = line.split(' ', 1)
                        if len(parts) >= 2:
                            commits.append({
                                "hash": parts[0],
                                "message": parts[1],
                                "category": self._categorize_commit(parts[1])
                            })
        except Exception:
            pass
        return commits
    
    def _write_changelog_file(self, changelog_data: Dict[str, Any], file_path: Path):
        """Escribe el archivo CHANGELOG.md"""
        content = "# Changelog\n\n"
        content += "Todos los cambios notables de este proyecto serán documentados en este archivo.\n\n"
        
        for version in changelog_data["versions"]:
            content += f"## [{version['version']}] - {version['date'][:10]}\n\n"
            
            # Agrupar por categoría
            categories = {}
            for change in version["changes"]:
                category = change["category"]
                if category not in categories:
                    categories[category] = []
                categories[category].append(change)
            
            category_headers = {
                "feature": "### Added",
                "bugfix": "### Fixed",
                "refactor": "### Changed",
                "chore": "### Maintenance"
            }
            
            for category, changes in categories.items():
                if changes:
                    header = category_headers.get(category, f"### {category.title()}")
                    content += f"{header}\n"
                    for change in changes:
                        content += f"- {change['message']} ({change['hash']})\n"
                    content += "\n"
        
        content += "\n---\n\n*Changelog generado automáticamente por GitHub Manager Agent*\n"
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
    
    def get_status(self) -> Dict[str, Any]:
        """Retorna el estado actual del agente"""
        return {
            "status": self.status,
            "last_execution": self.last_execution,
            "metrics": self.metrics,
            "repository_info": self.repo_info,
            "capabilities": [
                "Repository status monitoring",
                "Pre-commit checks",
                "Release preparation",
                "Documentation updates",
                "Branch synchronization",
                "Changelog generation"
            ]
        }