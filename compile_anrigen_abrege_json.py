import openpyxl, json

wb = openpyxl.load_workbook("/mnt/user-data/outputs/RePSS_Analyse_Risques_Abrege.xlsx", data_only=True)

def rows_of(sheet, headers):
    ws = wb[sheet]
    out = []
    for row in ws.iter_rows(min_row=2, values_only=True):
        if not any(row):
            continue
        out.append(dict(zip(headers, row)))
    return out

categories = rows_of("Categories", ["id", "fr"])
risques_raw = rows_of("Risques", ["id", "categorieId", "sourceDanger", "mesure", "risqueAggrave"])

risques = []
for r in risques_raw:
    risques.append({
        "id": r["id"], "categorieId": r["categorieId"],
        "sourceDanger": r["sourceDanger"], "mesure": r["mesure"],
        "risqueAggrave": bool(r["risqueAggrave"]) if r["risqueAggrave"] not in (None, "") else False,
    })

data = {"categories": categories, "risques": risques}

with open("/mnt/user-data/outputs/catalogue_risques_abrege.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"OK — {len(categories)} catégories, {len(risques)} items")
