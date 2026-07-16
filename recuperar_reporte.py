#!/usr/bin/env python3

import json
import csv
import hashlib
from pathlib import Path
from datetime import datetime

history = Path.home() / ".config/Code/User/History"

resultados = []

for entries in history.rglob("entries.json"):

    try:
        data = json.loads(entries.read_text())
    except Exception:
        continue

    recurso = data.get("resource", "")

    if "invitaciones-app" not in recurso:
        continue

    versiones = data.get("entries", [])

    if not versiones:
        continue

    ultima = max(versiones, key=lambda x: x["timestamp"])

    archivo_historial = entries.parent / ultima["id"]

    archivo_real = Path(recurso.replace("file://", ""))

    existe = archivo_real.exists()

    iguales = False

    if existe and archivo_historial.exists():
        try:
            h1 = hashlib.sha256(archivo_real.read_bytes()).hexdigest()
            h2 = hashlib.sha256(archivo_historial.read_bytes()).hexdigest()
            iguales = h1 == h2
        except Exception:
            iguales = False

    resultados.append({
        "archivo": str(archivo_real),
        "versiones": len(versiones),
        "fecha": datetime.fromtimestamp(
            ultima["timestamp"] / 1000
        ).strftime("%Y-%m-%d %H:%M:%S"),
        "igual": iguales,
        "historial": str(archivo_historial)
    })

resultados.sort(key=lambda x: x["archivo"])

with open("reporte_recuperacion.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(
        f,
        fieldnames=[
            "archivo",
            "versiones",
            "fecha",
            "igual",
            "historial"
        ]
    )

    writer.writeheader()
    writer.writerows(resultados)

print("=" * 70)
print("Archivos encontrados:", len(resultados))
print("Reporte generado:")
print("reporte_recuperacion.csv")
print("=" * 70)
