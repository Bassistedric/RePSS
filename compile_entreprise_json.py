import json
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "RePSS_Entreprise_Reference.xlsx"
OUTPUT = ROOT / "app" / "public" / "content-pack" / "entreprise.json"

wb = openpyxl.load_workbook(SOURCE, data_only=True)

def rows_of(sheet, headers):
    ws = wb[sheet]
    out = []
    for row in ws.iter_rows(min_row=2, values_only=True):
        if not any(row):
            continue
        out.append(dict(zip(headers, row)))
    return out

identite_rows = rows_of("Identite_Entreprise", ["cle", "valeur", "notes"])
identite = {r["cle"]: (r["valeur"] or "") for r in identite_rows}

aide = rows_of("Aide_Contact_QHSE", ["nom", "role", "email", "tel"])

contacts_rows = rows_of("Contacts_Reference", ["id", "nom", "contact", "adresse", "email", "tel", "site_web", "logo", "notes"])
contacts = {r["id"]: {k: (v or "") for k, v in r.items() if k != "id"} for r in contacts_rows}

sepp_medecins = rows_of("SEPP_Medecins", ["nom", "site", "tel"])

annexe4_rows = rows_of("Annexe4_Statut", ["cle", "valeur"])
annexe4 = {r["cle"]: (r["valeur"] or "") for r in annexe4_rows}

icones_urgence_rows = rows_of("IconesUrgence", ["id", "label", "logo"])
icones_urgence = {r["id"]: {"label": r["label"], "logo": r["logo"]} for r in icones_urgence_rows}

roles_rows = rows_of("Roles_Approbation", ["fonction", "type", "nom", "email", "tel"])
roles_fixes = [
    {"fonction": r["fonction"], "type": r["type"], "nom": r["nom"], "email": r["email"], "tel": r["tel"]}
    for r in roles_rows if r["type"] == "fixe"
]
roles_variables = [r["fonction"] for r in roles_rows if r["type"] == "variable"]

data = {
    "identite": {
        "nomAffichage": identite.get("nomAffichage", ""),
        "nomFournisseurParDefaut": identite.get("nomFournisseurParDefaut", ""),
    },
    "branding": {
        "logo": identite.get("logo", ""),
        "photoCouverture": identite.get("photoCouverture", ""),
        "couleurPrincipale": identite.get("couleurPrincipale", ""),
        "couleurSecondaire": identite.get("couleurSecondaire", ""),
    },
    "aideContact": {
        "personnes": [
            {"nom": p["nom"], "role": p["role"], "email": p["email"], "tel": p["tel"]}
            for p in aide
        ]
    },
    "contactsReference": {
        "assureurLoi": contacts.get("assureurLoi", {}),
        "cnacConstructiv": contacts.get("cnacConstructiv", {}),
        "volta": contacts.get("volta", {}),
        "sepp": {
            **contacts.get("sepp", {}),
            "medecins": sepp_medecins,
        },
        "controleTechnique": {
            "vincotte": contacts.get("controleTechniqueVincotte", {}),
            "atk": contacts.get("controleTechniqueAtk", {}),
        },
        "dgBienEtre": {
            "bruxellesCapitale": contacts.get("dgBienEtreBruxelles", {}),
            "hainaut": contacts.get("dgBienEtreHainaut", {}),
            "liege": contacts.get("dgBienEtreLiege", {}),
            "namurLiegeLuxBW": contacts.get("dgBienEtreNamurLiegeLuxBW", {}),
        },
        "police": contacts.get("policeRecherche", {}),
    },
    "rolesApprobation": {
        "fixes": roles_fixes,
        "variables": roles_variables,
    },
    "reglesGeneralesAnnexe4": annexe4,
    "iconesUrgence": icones_urgence,
}

with OUTPUT.open("w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("OK")
