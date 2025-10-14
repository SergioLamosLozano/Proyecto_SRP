from django.db import connection
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'SRP.settings')
django.setup()

cursor = connection.cursor()

# Verificar estructura de la tabla ciudad
print("Estructura de la tabla ciudad:")
cursor.execute('DESCRIBE ciudad')
for row in cursor.fetchall():
    print(row)

print("\n" + "="*50 + "\n")

# Verificar estructura de la tabla departamento
print("Estructura de la tabla departamento:")
cursor.execute('DESCRIBE departamento')
for row in cursor.fetchall():
    print(row)

print("\n" + "="*50 + "\n")

# Verificar algunas ciudades
print("Primeras 5 ciudades:")
cursor.execute('SELECT * FROM ciudad LIMIT 5')
for row in cursor.fetchall():
    print(row)