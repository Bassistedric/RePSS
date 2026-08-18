import openpyxl, json

wb = openpyxl.load_workbook("/mnt/user-data/outputs/RePSS_Liste_Hopitaux.xlsx", data_only=True)
ws = wb["Hopitaux"]
headers = ["id", "numero_agrement", "numero_site", "nom_hopital", "nom_site", "adresse", "code_postal", "commune"]

hopitaux = []
for row in ws.iter_rows(min_row=2, values_only=True):
    if not any(row):
        continue
    d = dict(zip(headers, row))
    hopitaux.append(d)

with open("/mnt/user-data/outputs/liste_hopitaux.json", "w", encoding="utf-8") as f:
    json.dump({"hopitaux": hopitaux}, f, ensure_ascii=False, indent=2)

print(f"OK — {len(hopitaux)} hôpitaux")
