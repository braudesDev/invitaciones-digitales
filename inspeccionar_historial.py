import json
from pathlib import Path
from datetime import datetime

history = Path.home() / ".config/Code/User/History"

for entries in history.rglob("entries.json"):
    try:
        data = json.loads(entries.read_text())
    except Exception:
        continue

    resource = data.get("resource", "")
    if "invitaciones-app" not in resource:
        continue

    versiones = data.get("entries", [])
    if not versiones:
        continue

    ultima = max(versiones, key=lambda x: x["timestamp"])

    fecha = datetime.fromtimestamp(ultima["timestamp"] / 1000)

    print("=" * 80)
    print(resource.replace("file://", ""))
    print(f"Versiones: {len(versiones)}")
    print(f"Última: {ultima['id']}")
    print(f"Fecha: {fecha}")
