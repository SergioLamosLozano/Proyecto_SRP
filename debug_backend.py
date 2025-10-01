#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import logging
from pathlib import Path

# Configurar logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def test_backend_detection():
    backend_path = Path("backend")
    requirements_file = backend_path / "requirements.txt"
    
    technologies = {
        "core_frameworks": [],
        "state_management": [],
        "build_tools": [],
        "backend_technologies": [],
        "databases": [],
        "testing": [],
        "deployment": []
    }
    
    logger.info(f"Checking backend path: {backend_path}")
    if backend_path.exists():
        logger.info("Backend directory found")
        
        logger.info(f"Checking requirements file: {requirements_file}")
        if requirements_file.exists():
            logger.info("Requirements.txt found, reading...")
            try:
                # Leer el archivo como binario primero para detectar BOM
                with open(requirements_file, 'rb') as f:
                    raw_content = f.read()
                
                # Detectar y manejar BOM
                if raw_content.startswith(b'\xff\xfe'):
                    # UTF-16 LE BOM
                    content = raw_content[2:].decode('utf-16le')
                    logger.info("Detected UTF-16 LE BOM, decoded successfully")
                elif raw_content.startswith(b'\xfe\xff'):
                    # UTF-16 BE BOM
                    content = raw_content[2:].decode('utf-16be')
                    logger.info("Detected UTF-16 BE BOM, decoded successfully")
                elif raw_content.startswith(b'\xef\xbb\xbf'):
                    # UTF-8 BOM
                    content = raw_content[3:].decode('utf-8')
                    logger.info("Detected UTF-8 BOM, decoded successfully")
                else:
                    # Sin BOM, intentar UTF-8
                    try:
                        content = raw_content.decode('utf-8')
                        logger.info("Decoded as UTF-8 without BOM")
                    except UnicodeDecodeError:
                        # Fallback a latin-1
                        content = raw_content.decode('latin-1')
                        logger.info("Decoded as latin-1")
                
                requirements = content.splitlines()
                logger.info(f"Requirements read: {len(requirements)} lines")
                
                for i, req in enumerate(requirements):
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
                        
                        logger.info(f"Line {i+1}: Processing package: '{package}' version: '{version}'")
                        
                        if package.lower() == "django":
                            technologies["backend_technologies"].append({
                                "name": "Django",
                                "version": version,
                                "purpose": "Framework web Python con ORM integrado"
                            })
                            logger.info("✓ Django detected and added")
                        elif package.lower() == "djangorestframework":
                            technologies["backend_technologies"].append({
                                "name": "Django REST Framework",
                                "version": version,
                                "purpose": "API RESTful y serialización"
                            })
                            logger.info("✓ Django REST Framework detected and added")
                        elif package.lower() == "mysqlclient":
                            technologies["databases"].append({
                                "name": "MySQL",
                                "version": version,
                                "purpose": "Base de datos relacional principal"
                            })
                            logger.info("✓ MySQL detected and added")
                        elif package.lower() == "django-cors-headers":
                            technologies["backend_technologies"].append({
                                "name": "Django CORS Headers",
                                "version": version,
                                "purpose": "Manejo de CORS para APIs"
                            })
                            logger.info("✓ Django CORS Headers detected and added")
                        elif package.lower() == "djangorestframework_simplejwt":
                            technologies["backend_technologies"].append({
                                "name": "Simple JWT",
                                "version": version,
                                "purpose": "Autenticación JWT para Django REST"
                            })
                            logger.info("✓ Simple JWT detected and added")
                        elif package.lower() == "drf-yasg":
                            technologies["backend_technologies"].append({
                                "name": "DRF-YASG",
                                "version": version,
                                "purpose": "Documentación automática de API (Swagger)"
                            })
                            logger.info("✓ DRF-YASG detected and added")
                        elif package.lower() == "python-decouple":
                            technologies["backend_technologies"].append({
                                "name": "Python Decouple",
                                "version": version,
                                "purpose": "Gestión de variables de entorno"
                            })
                            logger.info("✓ Python Decouple detected and added")
                        elif package.lower() == "pandas":
                            technologies["backend_technologies"].append({
                                "name": "Pandas",
                                "version": version,
                                "purpose": "Análisis y manipulación de datos"
                            })
                            logger.info("✓ Pandas detected and added")
                        elif package.lower() == "pillow":
                            technologies["backend_technologies"].append({
                                "name": "Pillow",
                                "version": version,
                                "purpose": "Procesamiento de imágenes"
                            })
                            logger.info("✓ Pillow detected and added")
                        else:
                            logger.info(f"  Package '{package}' not in detection list")
                            
            except Exception as e:
                logger.error(f"Error reading requirements.txt: {e}")
        else:
            logger.error("Requirements.txt not found")
    else:
        logger.error("Backend directory not found")
    
    logger.info(f"Final backend technologies: {len(technologies['backend_technologies'])}")
    logger.info(f"Final databases: {len(technologies['databases'])}")
    
    for tech in technologies['backend_technologies']:
        logger.info(f"  - {tech['name']} {tech['version']}")
    
    for db in technologies['databases']:
        logger.info(f"  - {db['name']} {db['version']}")

if __name__ == "__main__":
    test_backend_detection()