# RePSS — Assistant

Réponse au PSS : environnement de travail en ligne (PC) pour générer le RePSS
(abrégé ou complet) d'un chantier, à partir d'un catalogue de risques fixe et
des données de référence de l'entreprise.

## Structure du repo

```
app/                          application web (Vite + React), le "moteur"
  public/content-pack/        toutes les données spécifiques à l'entreprise
    entreprise.json           identité, branding, contacts, règles Annexe 4
    catalogue_risques.json    catalogue complet (catégories > sous-catégories > activités > risques)
    catalogue_risques_abrege.json
    liste_hopitaux.json       référentiel hôpitaux (matching auto par code postal)
    i18n/{fr,nl,en}.json      textes de l'interface et du document
    logos/*.png
  src/                        code de l'application (aucune donnée en dur)
repss_prototype.jsx           prototype d'origine, conservé pour référence
```

**Portabilité** : le code dans `app/src` ne contient aucune référence à
"VMA Sud" — tout ce qui est spécifique à l'entreprise vit dans
`app/public/content-pack/`. Pour réutiliser l'app pour une autre entreprise,
il suffit de remplacer ce dossier (mêmes noms de fichiers, même structure) et
de redéployer. Aucune modification de code n'est nécessaire.

## Développement local

```bash
cd app
npm install
npm run dev
```

## Build / déploiement

L'app est un site statique (aucun backend). Le workflow
`.github/workflows/deploy.yml` build `app/` et déploie sur GitHub Pages à
chaque push sur `main`.

Build manuel :

```bash
cd app
npm run build   # sortie dans app/dist
```

## Mise à jour des données d'entreprise

Le classeur `RePSS_Entreprise_Reference.xlsx` est la source de référence, mais
l'application ne le lit pas directement. Après chaque modification du classeur,
il faut régénérer le fichier JSON consommé par l'application :

```bash
python -m pip install openpyxl
python compile_entreprise_json.py
```

Il faut ensuite versionner et pousser à la fois le classeur et
`app/public/content-pack/entreprise.json`. Un push sur `main` qui modifie le JSON
déclenche automatiquement le redéploiement GitHub Pages.

## Sauvegarde / reprise d'un dossier

Comme dans le prototype : le bouton "Enregistrer" télécharge l'état complet
du dossier chantier dans un fichier `.json`, à déposer manuellement dans le
dossier SharePoint du chantier (pas de synchronisation automatique). Ce
fichier peut être réimporté depuis l'écran d'identification pour reprendre un
RePSS déjà commencé.

## Génération du document final

Le PDF est généré côté client (`@react-pdf/renderer`, sans backend), à partir
de l'ensemble du dossier + du catalogue de risques + des données de
l'entreprise.

## Point d'attention

`entreprise.json` référence un logo `hopitaux_logo.png` pour l'icône
"Hôpital" (bloc `iconesUrgence`) qui n'a pas été fourni avec les autres logos
— à ajouter dans `app/public/content-pack/logos/` si ce bloc doit être
affiché.
