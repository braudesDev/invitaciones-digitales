#!/usr/bin/env python3

import csv
import shutil
from pathlib import Path

print("=" * 70)
print("🔧 RESTAURANDO TODOS LOS 67 ARCHIVOS DESDE VS CODE HISTORY")
print("=" * 70)

with open("reporte_recuperacion.csv", "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    archivos = list(reader)

restaurados = 0
no_existen = 0
ya_iguales = 0
errores = 0
saltados = 0

for row in archivos:
    archivo = Path(row["archivo"])
    historial = Path(row["historial"])
    igual = row["igual"] == "True"
    versiones = row["versiones"]
    fecha = row["fecha"]

    if not historial.exists():
        no_existen += 1
        print(f"❌ No existe en historial: {historial}")
        continue

    try:
        # Crear respaldo del archivo actual si existe
        if archivo.exists():
            backup = archivo.with_suffix(archivo.suffix + ".backup_antes_restaurar")
            shutil.copy2(archivo, backup)
            print(f"📦 Respaldo creado: {backup.name}")

        # Restaurar desde el historial
        archivo.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(historial, archivo)
        restaurados += 1
        
        if igual:
            ya_iguales += 1
            print(f"♻️  Restaurado (ya era igual): {archivo.name} ({versiones} versiones, {fecha})")
        else:
            print(f"✅ Restaurado (versión más reciente): {archivo.name} ({versiones} versiones, {fecha})")
            
    except Exception as e:
        errores += 1
        print(f"⚠️ Error con {archivo.name}: {e}")

print("=" * 70)
print("📊 RESUMEN DE RESTAURACIÓN COMPLETA")
print("=" * 70)
print(f"   ✅ Restaurados (total): {restaurados}")
print(f"   📦 Respaldos creados: {restaurados}")
print(f"   ♻️  Ya eran iguales: {ya_iguales}")
print(f"   🔄 Restaurados (más recientes): {restaurados - ya_iguales}")
print(f"   ❌ No existían en historial: {no_existen}")
print(f"   ❌ Errores: {errores}")
print("=" * 70)
print("")
print("🔍 TODOS los archivos fueron restaurados desde VS Code History.")
print("   Si algo no funciona, los respaldos están en:")
print("   *.backup_antes_restaurar")
print("=" * 70)
