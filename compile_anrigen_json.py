import openpyxl, json

wb = openpyxl.load_workbook("/mnt/user-data/outputs/RePSS_Analyse_Risques.xlsx", data_only=True)

def rows_of(sheet, headers):
    ws = wb[sheet]
    out = []
    for row in ws.iter_rows(min_row=2, values_only=True):
        if not any(row):
            continue
        out.append(dict(zip(headers, row)))
    return out

categories = rows_of("Categories", ["id", "code_origine", "fr", "corps_metier", "groupe"])
souscategories = rows_of("SousCategories", ["id", "code_origine", "fr", "parent"])
activites = rows_of("Activites", ["id", "code_origine", "fr", "parent", "granularite", "confiance", "notes"])

risque_headers = [
    "id", "parent", "sourceDanger", "risques",
    "eval_ini_probabilite_texte", "eval_ini_probabilite_valeur",
    "eval_ini_exposition_texte", "eval_ini_exposition_valeur",
    "eval_ini_gravite_texte", "eval_ini_gravite_valeur",
    "eval_ini_score", "eval_ini_niveau",
    "mesures_prevention",
    "eval_res_probabilite_texte", "eval_res_probabilite_valeur",
    "eval_res_exposition_texte", "eval_res_exposition_valeur",
    "eval_res_gravite_texte", "eval_res_gravite_valeur",
    "eval_res_score", "eval_res_niveau",
]
risques_raw = rows_of("LignesRisque", risque_headers)

risques = []
for r in risques_raw:
    risques.append({
        "id": r["id"], "parent": r["parent"],
        "sourceDanger": r["sourceDanger"], "risques": r["risques"],
        "evaluationInitiale": {
            "probabilite": {"texte": r["eval_ini_probabilite_texte"], "valeur": r["eval_ini_probabilite_valeur"]},
            "exposition": {"texte": r["eval_ini_exposition_texte"], "valeur": r["eval_ini_exposition_valeur"]},
            "gravite": {"texte": r["eval_ini_gravite_texte"], "valeur": r["eval_ini_gravite_valeur"]},
            "score": r["eval_ini_score"], "niveau": r["eval_ini_niveau"],
        },
        "mesuresPrevention": r["mesures_prevention"],
        "evaluationResiduelle": {
            "probabilite": {"texte": r["eval_res_probabilite_texte"], "valeur": r["eval_res_probabilite_valeur"]},
            "exposition": {"texte": r["eval_res_exposition_texte"], "valeur": r["eval_res_exposition_valeur"]},
            "gravite": {"texte": r["eval_res_gravite_texte"], "valeur": r["eval_res_gravite_valeur"]},
            "score": r["eval_res_score"], "niveau": r["eval_res_niveau"],
        },
    })

data = {
    "categories": categories,
    "sousCategories": souscategories,
    "activites": activites,
    "lignesRisque": risques,
}

with open("/mnt/user-data/outputs/catalogue_risques.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"OK — {len(categories)} catégories, {len(souscategories)} sous-cat, "
      f"{len(activites)} activités, {len(risques)} lignes de risque")
