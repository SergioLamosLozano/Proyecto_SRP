# 🔧 Solución de Problemas - Login

## Problema: No puedo iniciar sesión

### ✅ Checklist de Diagnóstico

#### 1. **Verificar que el backend Django esté corriendo**

```bash
cd backend
python manage.py runserver
```

Deberías ver algo como:
```
Starting development server at http://127.0.0.1:8000/
```

#### 2. **Verificar la URL de la API**

**Si estás usando Expo Go en dispositivo físico:**
- `localhost` NO funcionará
- Necesitas usar la IP de tu computadora

**Encontrar tu IP:**

Windows (CMD):
```bash
ipconfig
```
Busca "IPv4" (ejemplo: 192.168.1.100)

Mac/Linux:
```bash
ifconfig
```
Busca "inet" (ejemplo: 192.168.1.100)

**Actualizar la URL:**

Edita: `mobile/src/config/api.js`

```javascript
export const API_BASE_URL = __DEV__ 
  ? 'http://192.168.1.100:8000/api'  // ⬅️ CAMBIA ESTO con tu IP
  : 'https://tu-dominio.com/api';
```

#### 3. **Verificar que el endpoint existe**

Abre en tu navegador:
```
http://localhost:8000/api/token/
```

O con tu IP:
```
http://192.168.1.100:8000/api/token/
```

Deberías ver un mensaje de Django REST Framework.

#### 4. **Probar el login manualmente**

Usa Postman o curl:

```bash
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"tu_usuario","password":"tu_contraseña"}'
```

Respuesta esperada:
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### 5. **Ver los logs en la app móvil**

Cuando intentes hacer login, revisa la consola de Expo:

```
🔐 Intentando login con: usuario
🌐 Petición: POST http://localhost:8000/api/token/
📡 Respuesta: 200 {...}
✅ Login exitoso
```

O si hay error:
```
❌ Error en request: Network request failed
```

### 🔍 Errores Comunes

#### Error: "Network request failed"

**Causa:** No se puede conectar al servidor

**Soluciones:**
1. Verifica que el backend esté corriendo
2. Si usas dispositivo físico, cambia `localhost` por tu IP
3. Verifica que estés en la misma red WiFi
4. Desactiva VPN o firewall

#### Error: "401 Unauthorized"

**Causa:** Credenciales incorrectas

**Soluciones:**
1. Verifica usuario y contraseña
2. Verifica que el usuario exista en Django admin
3. Prueba el login con curl/Postman

#### Error: "Timeout"

**Causa:** El servidor tarda mucho en responder

**Soluciones:**
1. Verifica que el backend no esté sobrecargado
2. Aumenta el timeout en `src/config/api.js`:
   ```javascript
   export const REQUEST_TIMEOUT = 30000; // 30 segundos
   ```

#### Error: "CORS"

**Causa:** El backend no permite peticiones desde la app

**Solución:** Verifica `settings.py` en Django:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:19006",  # Expo web
    "http://localhost:19000",  # Expo
]

# O permite todo en desarrollo:
CORS_ALLOW_ALL_ORIGINS = True  # Solo en desarrollo
```

### 📱 Configuración según dispositivo

#### Emulador Android (Android Studio)
```javascript
API_BASE_URL: 'http://10.0.2.2:8000/api'
```

#### Emulador iOS (Xcode)
```javascript
API_BASE_URL: 'http://localhost:8000/api'
```

#### Dispositivo Físico (Expo Go)
```javascript
API_BASE_URL: 'http://TU_IP:8000/api'  // Ejemplo: http://192.168.1.100:8000/api
```

#### Navegador Web
```javascript
API_BASE_URL: 'http://localhost:8000/api'
```

### 🧪 Prueba Rápida

1. **Backend corriendo:**
   ```bash
   cd backend
   python manage.py runserver
   ```

2. **Verificar endpoint:**
   Abre: http://localhost:8000/api/token/

3. **Actualizar IP en la app:**
   Edita `mobile/src/config/api.js`

4. **Reiniciar Expo:**
   ```bash
   cd mobile
   npm start -- --clear
   ```

5. **Intentar login**

### 📞 ¿Aún no funciona?

Revisa los logs en la consola de Expo y busca:
- 🌐 URL de la petición
- 📡 Código de respuesta
- ❌ Mensaje de error

Comparte esos logs para ayudarte mejor.
