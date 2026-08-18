# RePSS — Assistant web de réponse au PSS (VMA Sud)

Ce document résume toutes les décisions de conception prises avant le début du code.
Lis-le en entier avant de modifier quoi que ce soit. Il fait autorité sur les choix
déjà tranchés — ne les remets pas en question sans le signaler explicitement.

## 1. Contexte

Remplacement d'un classeur Excel/VBA (~300 checkbox ActiveX, mapping en dur, très
fragile) par une app web sans dépendance Excel. Aucun accès SharePoint (pas d'accès
IT) : le PM télécharge JSON + PDF et les dépose lui-même dans le dossier SharePoint
du chantier. Portable vers d'autres entreprises : séparer strictement le **moteur**
(code) du **contenu** (fichiers de données ci-dessous + `entreprise.json` + logos).

## 2. Architecture du contenu

Principe constant : toute donnée (labels, risques, contacts) vit dans un classeur
Excel maître, compilé en JSON par un script Python (`openpyxl`). Ne jamais coder du
contenu en dur dans l'app — ajouter un item de catalogue doit être « ajouter une
ligne Excel », jamais toucher au code.

Fichiers déjà livrés (classeur maître → JSON compilé → script de compilation) :

| Classeur maître | JSON | Script |
|---|---|---|
| `RePSS_UI_Textes_maitre.xlsx` | `fr.json` / `en.json` / `nl.json` | `compile_ui_textes.py` |
| `RePSS_Entreprise_Reference.xlsx` | `entreprise.json` | `compile_entreprise_json.py` |
| `RePSS_Analyse_Risques.xlsx` | `catalogue_risques.json` | `compile_anrigen_json.py` |
| `RePSS_Analyse_Risques_Abrege.xlsx` | `catalogue_risques_abrege.json` | `compile_anrigen_abrege_json.py` |
| `RePSS_Liste_Hopitaux.xlsx` | `liste_hopitaux.json` | `compile_hopitaux_json.py` |

Plus : 12 logos (`/logos`, convention `nom_logo.png`), et `repss_prototype.jsx`
(prototype interactif déjà construit et validé — écrans Accueil / Identification /
Caractérisation / Analyse de risques, données réelles du catalogue en dur pour la
démo). **Repars de ce fichier, ne recommence pas les écrans qu'il couvre déjà.**

### i18n

Deux catégories bien séparées :
- **Données de base** (`UI_Textes`) : labels fixes, traduits FR/EN/NL, réutilisés par
  id stable partout où c'est identique (ex. `nom`, `adresse`, `contact`).
- **Analyse de risque** : traduction **volontairement pas encore faite** — le champ
  `risques` de `fr/en/nl.json` est vide, à compléter plus tard. Ne pas bloquer dessus.

Le document généré est **mono-langue par génération** (le PM choisit la langue avant
de générer), jamais bilingue dans le même PDF.

## 3. Schéma JSON d'un dossier chantier

```json
{
  "meta": {
    "repssNumero": "REPSS-2026-014",
    "version": 1,
    "statut": "brouillon",
    "dateCreation": "2026-08-13",
    "dateDerniereModif": "2026-08-13",
    "moadrEnAttente": true
  },
  "identification": {
    "numeroChantier": "12345",
    "nomChantier": "Rénovation site Gembloux",
    "chantierId": "12345 - Rénovation site Gembloux",
    "pmLead": "",
    "pmSecondaire": ""
  },
  "triage": {
    "modeChoisi": "complet",
    "aideAuChoix": { "heuresInf1000": null, "hauteur5mPlus": null, "hauteTension": null, "espaceConfine": null }
  },
  "caracterisation": { "corpsMetier": ["hvac_froid"] },
  "administratif": { "dateDebutTravaux": "", "dateFinTravauxEstimee": "" },
  "analyseRisques": {
    "itemsCoches": [{ "risqueId": "cat10_mesures_generales_sub1_act2_risque1", "remarques": "" }]
  },
  "documentsAccompagnants": {
    "emargement": { "genereAutomatiquement": true },
    "grilleKinney": { "genereAutomatiquement": true },
    "reglesGeneralesAnnexe4": { "genereAutomatiquement": true },
    "sousTraitants": [],
    "planParticulier": { "fichier": null },
    "listeEnginsSpeciaux": []
  },
  "demandesMoadr": [
    {
      "id": "moadr_2026_003",
      "descriptionSituation": "",
      "dateAjout": "2026-08-13",
      "statut": "demande",
      "mentionDocument": "Ce point sera traité à part et joint en annexe.",
      "fichierAnnexe": null
    }
  ],
  "historiqueVersions": [{ "version": 1, "date": "2026-08-13", "motif": "Création initiale" }]
}
```

**Important** : `analyseRisques.itemsCoches` référence l'id d'une **ligne de risque**
(la feuille de l'arbre), jamais une activité — voir §6.

## 4. Convention de nommage des fichiers

- Fichier chantier (JSON + PDF) : `RePSS_{numeroChantier}_{nomChantier}.json` (nom
  sanitisé : accents retirés, caractères non alphanumériques → `_`). **Jamais** le
  numéro `REPSS-2026-XXX`, qui reste une référence interne QHSE dans `meta.repssNumero`
  uniquement, attribué **seulement à la génération finale** (jamais sur un brouillon,
  pour ne pas gaspiller de numéros).
- Logos : `nom_logo.png`, minuscules.

## 5. Parcours du wizard

**Écran d'accueil** (avant le wizard) : explication courte du fonctionnement, logo
VMA Sud (image, pas texte), sélecteur de langue, crédits (« Conçu par Cédric Comblé,
CP1 - Ergonome » visible + « By Cco » discret en bas à droite — jamais dans le PDF,
qui est généré depuis les données, pas une capture d'écran).

**Ordre des étapes, tel que corrigé en cours de conception :**

1. **Identification** — DEUX champs séparés : N° chantier / Nom du chantier (jamais
   une liste déroulante, saisie libre assumée). Pas de détection automatique d'un
   RePSS existant (aucun backend, aucun accès SharePoint) : uniquement un bouton
   « Reprendre un RePSS existant » qui importe un fichier `.json` côté navigateur.
2. **Caractérisation** — DOIT venir juste après l'identification, avant tout le
   reste, car elle conditionne toute la suite :
   - Triage abrégé/complet : choix radio assumé par le PM.
   - Aide au choix (4 critères légaux : heures <1000, hauteur ≥5m, HT, espace
     confiné) : **contraignant**, pas juste informatif — cocher un seul de ces
     critères force `modeChoisi = "complet"` et désactive le radio "Abrégé".
   - Corps de métier (multi-select : électricité, HVAC-Froid, photovoltaïque) —
     peut en cumuler plusieurs, filtre les catégories de l'étape Analyse de risques.
3. Puis bifurcation selon le mode choisi.

### Branche COMPLET (5 étapes)

3. **Infos admin.** — 3 sous-onglets :
   - *Renseignements généraux* : client, adresse, Bureau d'architecture et
     Coordinateur Sécurité (variables par chantier — **point non confirmé
     formellement, à valider avec Ced**), contacts de référence (Assureur/CNAC-
     Constructiv/Volta/SEPP) affichés en lecture seule depuis `entreprise.json`,
     jamais un champ à remplir.
   - *Administration du chantier* : réduit à `dateDebutTravaux` +
     `dateFinTravauxEstimee` uniquement. **Supprimé** : cautionnement, garantie,
     réceptions provisoire/définitive, dossier As built, dates commande/transfert,
     déclarations ONSS/CNAC (hors sujet sécurité). Table « Révision/Modification
     PPSS » supprimée, remplacée par `meta.version`/`dateDerniereModif` calculés
     automatiquement + `historiqueVersions[].motif` optionnel à la génération d'une
     nouvelle version. Liste des sous-traitants traitée comme l'émargement : liste
     ouverte dans `documentsAccompagnants.sousTraitants`, jamais un champ obligatoire
     du wizard. Tableau « Responsable d'approbation » : mélange fixe (BU Site
     Manager, Administrative Officer, CP Niv.1, Membre SIPPT — depuis
     `entreprise.json`) et variable par chantier (Tender Engineer, Operations
     Manager, Project Manager, Assistant PM, Project Engineer, Site Supervisor) —
     colonnes Paraphe/Date **supprimées**, aucun mécanisme de signature électronique.
   - *Règles spécifiques* : intro fixe (rappel accident 10 points + consignes appel
     secours 7 points, dans `UI_Textes`). Contacts d'urgence : Service incendie
     (112 fixe + champ libre n° interne type GSK), **Hôpital le plus proche
     auto-rempli depuis `liste_hopitaux.json` selon le code postal du chantier**
     (algorithme : code postal le plus proche numériquement, puis un deuxième —
     porté depuis l'ancien VBA `Recherche_Hopital.frm` — résultat éditable),
     Centre antipoison (`070/245.245` fixe), Police (`101` fixe + lien externe vers
     la recherche officielle par code postal — **pas de liste de commissariats
     compilée**, jugé disproportionné vu ~176 zones sans dataset propre). Dérogations
     au PSS conservées (Objet/Zone d'application/Motivation/Autorisation donnée par,
     signature supprimée). Tableau Questions/Réponses de la coordination
     **supprimé**. « Accords et obligations » **déplacé dans l'Annexe 4** (texte
     légal complet déjà dans `entreprise.json` → `reglesGeneralesAnnexe4.texte`,
     statut `brouillon_partiel`, à valider formellement par QHSE avant `valide`).
4. **Analyse de risques** — voir §6, correction importante sur la granularité.
5. **Annexes & génération** — Annexes automatiques (Grille Kinney = doublon de
   l'Annexe 1, Règles générales VMA Sud = Annexe 4, Émargement, Sous-traitants) vs
   action PM requise (Plan particulier = upload fichier, Liste des engins spéciaux =
   ajout de lignes). Bannière MOADR si `demandesMoadr` non vide — **non bloquante**,
   affiche `mentionDocument`. Sélecteur de langue. **Numéro RePSS attribué à cette
   étape seulement**, jamais avant — c'est cet événement qui écrit dans le registre
   QHSE (Google Sheet, voir §8).

### Branche ABRÉGÉ

**Ce n'est pas un sous-ensemble filtré du catalogue complet** — un catalogue séparé
et distinct (`catalogue_risques_abrege.json` : 6 catégories, 20 items, chaque item =
`sourceDanger` + `mesure` déjà rédigée + `risqueAggrave`). Pas d'évaluation Kinney
(non pertinente pour ce format). Un seul item a `risqueAggrave: true` (« Chute
échafaudage >5m ») — dans le wizard, il apparaît **barré, case désactivée**, avec un
message renvoyant vers le complet (même principe que l'italique/barré de l'Excel
d'origine). Champs admin propres, orientés intervention en usine client (SEVESO,
coactivité, accueil sécurité, matières premières/produits dangereux,
pressions/températures, présence gaz) — absents du complet.

Étapes : Identification → Caractérisation → Infos chantier & usine → Risques &
mesures → Génération (plus court que le complet).

## 6. Analyse de risques — granularité et affichage (correction importante)

**La case à cocher, c'est la ligne de risque, jamais l'activité.** L'activité est un
simple sous-titre visuel qui regroupe ses lignes de risque (toujours affichées en
liste, sans repli supplémentaire — médiane 2 lignes/activité, max 8, donc pas besoin
de les cacher). Seuls catégorie et sous-catégorie sont pliables/dépliables (accordéon).

**Filtrage par corps de métier** : catégories universelles (Mesures générales +
Exécution générale, codes 10 et 21-27) toujours affichées ; catégories 31/32/33
(Électricité/HVAC-Froid/Photovoltaïque) affichées seulement si sélectionnées en
Caractérisation — peuvent être plusieurs à la fois.

**Règle de génération du PDF** (règle de rendu, pas une donnée stockée) : le document
final affiche **tous** les titres de catégorie/sous-catégorie/activité applicables au
corps de métier, **même sans aucune ligne cochée dessous** — ça prouve une revue
délibérée plutôt qu'un copier-coller. Reconstruire cette hiérarchie à la génération en
parcourant `catalogue_risques.json` filtré par `corpsMetier`, en ne détaillant
(source/risques/Kinney/mesures) que les lignes présentes dans `itemsCoches`.

**Typographie en cascade** (déjà dans `repss_prototype.jsx`, à reprendre) :
sous-catégorie en gras bleu marine avec bordure basse, activité en poids moyen
indentée sous une bordure gauche, ligne de risque encore indentée sous une deuxième
bordure plus discrète — la hiérarchie doit se lire visuellement sans lire le texte.
Ligne cochée = fond vert clair + case à accent vert (signal positif).

## 7. Contrôle à 3 états (correction remontée par un PM)

Tout champ binaire « qui est responsable » (`vma sud`/`Autre`, ou `vma sud`/`Client`)
doit devenir un **contrôle à 3 états explicite : Interne / Client / N.A.**, jamais une
case à cocher + texte libre. Une case décochée est ambiguë (oublié ? ou vraiment
absent du chantier ?) — N.A. lève l'ambiguïté. S'applique à : les items de
Caractérisation (Réfectoire, W.C., Stockage, Zone de circulation/travail,
Électricité, Eau, Garde-corps, Ligne de vie, Filet de rétention…) et aux locaux
sociaux + tableau permis de travail de l'abrégé (Réfectoire/Sanitaires/Vestiaires/
Douches). **Ne s'applique PAS à l'analyse de risque** : là, une case décochée
signifie sans ambiguïté « non applicable » (confirmé explicitement par Ced).

## 8. Enregistrement / reprise

Pas de backend, pas de synchronisation SharePoint. Mécanisme entièrement
côté-navigateur, déjà implémenté dans `repss_prototype.jsx` :
- Bouton **« Enregistrer »** disponible en permanence (pas seulement à la fin),
  visible sur toutes les étapes du wizard dans la barre latérale. Télécharge l'état
  actuel en `.json` (`Blob` + `URL.createObjectURL`), nom de fichier selon §4.
- **Import** : sur l'écran Identification, bouton « Reprendre un RePSS existant »,
  `FileReader` lit le `.json` choisi et pré-remplit les champs.
- Petit texte explicatif repliable (« Comment ça marche ? ») à côté du bouton
  Enregistrer plutôt qu'imposé en permanence à l'écran.

**Registre QHSE (optionnel, séparé)** : si construit, un Google Sheet + Apps Script
qui journalise uniquement les métadonnées à la génération finale (numéro, chantier,
PM, date, version, `moadrEnAttente`) — jamais le contenu du JSON lui-même. Sert de
« listing historique » pour Ced (garant ISO), pas de stockage de fichier.

## 9. Portabilité et branding

Séparer strictement le moteur (code, jamais de contenu VMA-spécifique en dur) du
contenu (`entreprise.json`, classeurs de contenu, logos) — changer d'entreprise doit
se limiter à remplacer ces fichiers, jamais toucher au code.

**Palette VMA Sud** (`app/src/lib/colors.js`, seul point de vérité, réutilisé tel
quel dans le wizard et dans le PDF `RepssDocument.jsx`) : chaque couleur a un rôle
unique, jamais interchangeable.

- `navy` `#0B3040` : identité — boutons principaux, en-têtes de catégorie,
  navigation active. Jamais un fond général.
- `blue` `#156082` : interactif — liens, accents secondaires, contrôles.
- `turquoise` `#1D9E75` : accent de vie (dans l'esprit du dégradé du logo),
  usage unique et volontairement restreint : la bordure des sous-catégories de
  l'analyse de risques. Jamais mélangé aux couleurs sémantiques.
- Neutres chauds (`neutralBg*`, `neutralBorder*`, `neutralText*`) : non teintés
  bleu, portent tous les fonds/bordures structurels et le texte non sémantique.
- Sémantiques réservées, jamais réutilisées pour autre chose : `success` (vert,
  ligne de risque cochée), `warning` (ambre, bannière MOADR + item aggravé de
  l'abrégé), `error` (rouge, uniquement les erreurs bloquantes, ex. import de
  fichier invalide).

Aplats francs partout, pas de dégradé (sauf éventuellement l'écran d'accueil).

## 10. Décisions UX/visuelles à respecter

- **Desktop-first**, pas mobile-first — cet outil se remplit au bureau, pas sur
  chantier sous pression (contrairement au TBM/FMRA de Ced).
- **Jamais de tiret cadratin (—)** dans les textes d'interface. Utiliser des flèches
  `→` (avec un peu d'espace autour, on a la place en desktop) ou des deux-points pour
  une tournure « action → conséquence ».
- **Contraste** : les gris clairs type `#A7AFB6`/`#C6CCD1` utilisés dans le prototype
  sont sous le seuil WCAG AA (4.5:1) — à foncer (`#5A646C` ou plus sombre) dans la
  vraie passe de style, ne pas les reprendre tels quels.
- Barre latérale de navigation : les étapes déjà complétées sont cliquables pour y
  retourner directement (pas seulement via le bouton Retour) ; les étapes pas encore
  atteintes restent désactivées.

## 11. Points encore ouverts (à trancher, pas encore décidés)

- Bureau d'architecture / B.E. Tech. Spéciales / Coordinateur Sécurité : traités
  comme variables par chantier par hypothèse, jamais confirmés formellement par Ced.
- Source de mise à jour de `liste_hopitaux.json` introuvable dans le classeur
  d'origine — à vérifier/rafraîchir si Ced retrouve la source.
- Adresse ATK dans `entreprise.json` : divergence avec le registre public FOD
  Economie, gardée telle que fournie par Ced, à vérifier.
- Statut `brouillon_partiel` du texte Annexe 4 : nécessite une relecture QHSE
  formelle avant de passer à `valide`.
- Recherche de commissariat de police : volontairement non construite (lien externe
  à la place) — à revisiter si une vraie source de données apparaît.
- Traduction EN/NL du catalogue d'analyse de risque : reportée, `risques: []` dans
  les packs de langue en attendant.
