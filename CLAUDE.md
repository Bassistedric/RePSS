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
| `RePSS_Analyse_Risques.xlsx` / `_EN.xlsx` / `_NL.xlsx` | `catalogue_risques.json` / `_en.json` / `_nl.json` | `compile_anrigen_json.py` |
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
- **Analyse de risque (catalogue complet)** : traduit — `RePSS_Analyse_Risques_EN.xlsx`
  / `_NL.xlsx`, même structure/ids que le classeur français (source de vérité pour la
  structure et les valeurs Kinney numériques), compilés en `catalogue_risques_en.json`
  / `_nl.json`. Sélectionné par langue dès le wizard (Caractérisation, Analyse de
  risques), pas seulement à la génération du PDF — `analyseRisques.itemsCoches`
  référence des `risqueId` stables entre les 3 langues, donc l'encodage peut se faire
  dans une langue et le PDF se générer dans une autre. Le champ `risques` de
  `fr/en/nl.json` (UI_Textes) reste volontairement vide : ce n'est pas là que vit
  cette traduction. **Catalogue abrégé** : toujours fr uniquement, pas encore traduit.

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

#### Contenu détaillé de l'étape "Infos chantier & usine" (cahier des charges précis)

Repris champ par champ depuis le document de référence existant (`E_F_04_VMA_RePSS_abrégé`) :

- **Bloc "vma sud / Client"** : la colonne vma sud est **supprimée entièrement**
  (fixe, redondante avec `entreprise.json`, déjà connue). Ne garder que la colonne
  **Client**, réduite à 5 champs : Nom de l'entreprise, Représentant de l'employeur,
  Adresse, GSM, Email — pas de champ "Téléphone" fixe séparé, pas de "Fonction".
- **Renseignements du lieu d'exécution** :
  - `Présence de coactivité ?` (Oui/Non) — **nouveau critère bloquant** : répondre
    "Oui" doit forcer le passage en RePSS complet et verrouiller "Abrégé", exactement
    comme les 4 critères de l'aide au choix en Caractérisation (§ Caractérisation),
    mais déclenché plus tard dans le parcours puisque cette question n'apparaît
    qu'à cette étape-ci, après que le PM ait déjà choisi "Abrégé".
  - `SEVESO ?` et `Existe-t-il un accueil sécurité à devoir passer ?` : Oui/Non
    simple, aucune logique de verrouillage, restent tels quels.
- **Renseignements sur l'installation d'intervention (si usine)** : conservé tel
  quel, mais **sans valeur "NA" pré-remplie par défaut** — les champs (Matières
  premières mise en œuvre, Produits dangereux utilisés) restent vides, c'est au PM
  de taper "NA" lui-même si réellement non applicable, pas une valeur par défaut du
  système.
- **Renseignements généraux** : `Lieux spécifique de l'exécution du travail` devient
  `Lieux d'exécution spécifique chez le client` (libellé clarifié). Le champ
  `Mode opératoire abrégé (nature des travaux)` doit avoir une **grande zone de
  texte** (le PM y liste plusieurs opérations en puces, cf. exemple réel : 3 lignes
  minimum visibles sans scroll) — actuellement trop exigu dans le document de
  référence. Le reste des champs de ce bloc (dates début/fin, représentant vma sud
  sur site, régime de travail, effectif moyen, sous-traitants) reste inchangé.
- **Mesures générales de sécurité** (ouverture de chantier réalisée par le client,
  Oui/Non) : inchangé.
- **Habilitations** : reste une grille à cocher (Chariot élévateur, Nacelle, Pontier,
  Levage/Télescopique, BA4, BA5, Soudeur, Frigoriste), avec possibilité d'ajouter
  **plusieurs** lignes "Autre" libres (pas limité à une seule, contrairement au
  document de référence).
- **Locaux sociaux et engins mis à disposition** : inchangé, contrôle à 3 états
  (Interne/Client/N.A.) déjà spécifié §7.
- **Équipements de protection individuelle** : liste inchangée, mais **ajouter les
  pictogrammes** (casque, chaussures, lunettes, gants/combinaison — pictogrammes
  d'obligation bleus ronds, style ISO 7010, absents de la version web actuelle bien
  que présents dans le document de référence).
- **Protection pour l'environnement** (évacuation déchets / gaz frigorifiques) :
  inchangé, garde le choix vma sud/Client (contrairement à la section Risques
  ci-dessous, où ce choix disparaît).
- **Mesures générales de sécurité** (permis de travail, consignation, permis espace
  restreint, permis de fouille, permis de feu, mode opératoire d'exécution) :
  inchangé, garde le choix vma sud/Client.

#### Identification des risques (changement de comportement)

- **Supprimer le choix "vma sud" / "Client"** par ligne — chaque item reste une
  simple case à cocher (`sourceDanger` + `mesure`), cohérent avec
  `catalogue_risques_abrege.json` tel qu'il existe déjà (pas de champ responsable
  dans ce catalogue).
- **Ajouter une case "Tout cocher" au niveau du titre de chaque catégorie** (ex.
  "Travaux en hauteur") : la cocher sélectionne d'un coup tous les items de cette
  catégorie en dessous (Chute échelle/échafaudage<5m, Chute d'objets, Chute endroits
  non protégés — sans l'item aggravé, qui reste désactivé). Décocher le titre
  décoche tout le groupe. **Si le PM décoche ensuite un seul item individuellement,
  la case "Tout cocher" du titre redevient simplement décochée** (pas d'état
  intermédiaire/indéterminé — comportement binaire simple, tranché en conversation).

#### Le reste

**Organisation des secours** (numéro d'urgence, contacts internes) et
**Approbation** (signatures vma sud/Client) : inchangés. **Émargement** : ne fait
plus partie du flux principal du wizard, devient une annexe automatique
(`documentsAccompagnants.emargement.genereAutomatiquement: true`), comme pour la
branche complète.

#### Génération PDF de la branche abrégée

Comme pour la branche complète (§12), la génération PDF de l'abrégé n'a jamais été
spécifiée en détail — à traiter comme un chantier à part, en réutilisant la même
mise en page de référence (bandeaux de titre bleu marine, tableaux à deux colonnes)
que le document `E_F_04_VMA_RePSS_abrégé` existant, mais avec toutes les
simplifications ci-dessus déjà appliquées (pas de colonne vma sud sur
l'identification client, pas de "NA" pré-rempli, etc.).

## 6. Analyse de risques — granularité et affichage (corrections importantes)

**La case à cocher correspond à un `sourceDanger` unique, pas systématiquement à une
ligne de risque individuelle.** Plusieurs lignes de `catalogue_risques.json` peuvent
partager exactement le même texte `sourceDanger` sous une même activité (ex. "Portance
du sol insuffisant" avec 5 `risques` différents : versement du camion, renversement de
la charge, rupture d'élingues, coincement en cours du guidage, écrasement du
personnel — chacune avec sa propre évaluation Kinney, d'où des lignes séparées dans le
classeur source). Ces lignes doivent être **groupées à l'affichage** :

- Regrouper les lignes de risque d'une même activité par `sourceDanger` identique
  (clé de groupement : `parent` + `sourceDanger`).
- Si un groupe ne contient qu'une seule ligne (cas le plus fréquent), rien ne change :
  une case à cocher, le texte de `risques` affiché comme libellé (pas `sourceDanger`,
  qui souvent répète juste le libellé de l'activité — un cas observé affichait
  "Produits dangereux (bonbonnes, acides…)" 4 fois identiques car `sourceDanger`
  était affiché au lieu de `risques`).
- Si un groupe contient plusieurs lignes, afficher **une seule case à cocher** avec le
  `sourceDanger` comme libellé, et lister les `risques` de chaque ligne du groupe comme
  puces informatives en dessous (non cochables individuellement). Cocher la case
  ajoute **tous** les `risqueId` du groupe à `analyseRisques.itemsCoches` d'un coup ;
  décocher les retire tous ensemble. Pas besoin d'un nouvel identifiant de groupe côté
  schéma — `itemsCoches` continue de référencer des `risqueId` individuels, juste
  plusieurs à la fois.

**Bundle au niveau de l'activité entière (nouveau mécanisme, distinct du regroupement
par `sourceDanger`)** : certaines activités décrivent une **action/opération précise**
(ex. "Travaux de soudure", "Introduction dans bâtiment de cabine HT…") dont tous les
risques associés sont **automatiques** — dès que cette action a lieu, tous ses risques
s'appliquent sans exception, même s'ils ont chacun un `sourceDanger` distinct (ex.
"Travaux de soudure" a 4 `sourceDanger` différents : accidents divers, retour de
flamme, électrocution, brûlure — tous présents dès qu'il y a soudure, aucun choix).
D'autres activités décrivent une **catégorie/condition** avec plusieurs scénarios
réellement indépendants et optionnels (ex. "Accès au chantier", "Stockage",
"Utilisation de certains produits") — celles-là gardent une case par groupe de
`sourceDanger`, comme décrit ci-dessus.

Cette distinction est un jugement métier, pas déductible automatiquement des données.
Nouveau champ sur l'onglet `Activites` de `RePSS_Analyse_Risques.xlsx`, remonté dans
`catalogue_risques.json` (`activites[].granularite`) :
- `"activite"` : une seule case à cocher sur l'activité elle-même (libellé = le texte
  de l'activité) ; cocher ajoute **tous** les `risqueId` de cette activité à
  `itemsCoches` d'un coup ; les `risques` de chaque ligne s'affichent comme puces
  informatives sous la case, jamais individuellement cochables, et le `sourceDanger`
  ne doit **pas** être ré-affiché en double sur une ligne à part (c'était le bug
  visible en conversation : le titre de l'activité et le `sourceDanger` identique
  apparaissaient deux fois côte à côte).
- `"risque"` : comportement par défaut déjà décrit (groupement par `sourceDanger`).

Chaque activité a aussi `confiance` (`"Oui"` = validé par Ced, `"À vérifier"` =
premier classement automatique par Claude, à corriger) et `notes`. **Seules les
lignes `confiance = "Oui"` doivent être considérées fiables** ; les autres sont un
brouillon de départ, la classification peut changer à mesure que Ced relit le
catalogue. Ne pas figer de logique métier sur les valeurs `"À vérifier"`.

**Structure réelle du catalogue, irrégulière** : la profondeur n'est pas fixe à 4
niveaux partout. Certaines catégories vont jusqu'à catégorie > sous-catégorie >
activité > risque (ex. "Mesures générales"), d'autres sautent la sous-catégorie
(catégorie > activité > risque, ex. "Manutention et levage"), d'autres sautent aussi
l'activité (catégorie > risque directement, ex. "Travaux de percements"). Le composant
d'affichage doit être générique : à chaque niveau, chercher d'abord des enfants de
type sous-catégorie ; s'il n'y en a pas, chercher des enfants de type activité
directement rattachés ; s'il n'y en a pas non plus, chercher des lignes de risque
directement rattachées. `repss_prototype.jsx` ne montrait que le cas à 4 niveaux
pleins (Mesures générales, HVAC-Froid), donc cette variation n'était pas visible dans
l'exemple fourni au départ.

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

**Typographie en cascade** (déjà dans `repss_prototype.jsx`, à reprendre, plus le
niveau de regroupement `groupe` à ajouter au-dessus — voir §12 palette) :
sous-catégorie en gras bleu marine avec bordure basse, activité en poids moyen
indentée sous une bordure gauche, ligne/groupe de risque encore indentée sous une
deuxième bordure plus discrète — la hiérarchie doit se lire visuellement sans lire le
texte. Ligne cochée = fond vert clair + case à accent vert (signal positif).

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
se limiter à remplacer ces fichiers, jamais toucher au code. Couleurs VMA Sud :
`#0B3040` (marine, primaire) / `#156082` (bleu, secondaire).

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

## 11. Palette de couleurs

Le premier jet (tout en bleu-gris clair dégradé) manque de hiérarchie et de vie.
Système à appliquer :
- **Navy `#0B3040`** réservé à l'identité : boutons principaux, en-têtes de catégorie,
  navigation active. Jamais comme fond général/par défaut.
- **Bleu `#156082`** pour les éléments interactifs (liens, accents secondaires).
- **Gris neutre chaud** (pas teinté bleu) pour tous les fonds/bordures structurels
  (cartes, séparateurs, fonds de page).
- **Turquoise `#1D9E75`** (dans l'esprit du dégradé du logo VMA) comme accent de
  « vie », un seul usage précis et cohérent dans toute l'app (ex. bordure gauche des
  sous-catégories, voir §6) — jamais mélangé aux couleurs sémantiques ci-dessous.
- **Sémantique, jamais utilisée pour autre chose** : vert clair = coché/positif (déjà
  en place) ; ambre = attention (bannière MOADR, item `risqueAggrave`) ; rouge =
  erreur bloquante uniquement.
- Éviter les dégradés en dehors d'un éventuel écran d'accueil ; aplats francs ailleurs.

## 12. Génération du document PDF (jamais spécifié jusqu'ici — cahier des charges)

Le PDF généré doit reprendre la structure du document de référence existant
(`E_F_04_VMA_RePSS`), pas être improvisé. Ordre des pages, mis à jour avec toutes
les décisions prises dans ce document :

1. **Couverture** : logo entreprise, nom du chantier et numéro de chantier en
   encadrés de couleur, photo/illustration si fournie. Pas de case
   Soumission/Exécution (notion pas retenue dans le nouveau système).
2. **Page d'explication** : texte fixe court sur la portée du document (dans
   `UI_Textes`, à compléter si absent).
3. **Table des matières** avec numéros de page.
4. **Renseignements Généraux** : tables Client/Maître d'ouvrage/Maître d'œuvre,
   Bureau d'architecture, Coordinateur Sécurité (variables), puis les contacts de
   référence (Assureur Loi, CNAC-Constructiv, Volta, CESI-SEPP, Service Externe de
   Contrôle Technique, DG Bien-être) lus depuis `entreprise.json`, **avec leur logo**
   (`contactsReference.*.logo`), pas juste le texte.
5. **Administration du chantier** : table Responsable d'approbation (colonnes
   Fonction/Nom/Email/Tel — pas de Paraphe/Date, supprimées §7), dates début/fin
   travaux, historique de versions (`historiqueVersions`, pas de table
   Révision/Modification séparée), liste des sous-traitants — titre **toujours
   affiché même sans sous-traitant** (`Néant.` sinon), même principe que les
   titres de catégorie de l'analyse de risques (§6).
6. **Caractéristiques du chantier** : **correction remontée par un PM** — affiche
   en plus des 2 mentions fixes (plan général d'installation à joindre, point de
   rassemblement identifié) le détail des contrôles à 3 états de `caracteristiques`
   (Réfectoire/W.C./Stockage/Zone de circulation/Zone de travail/Électricité/Eau/
   Garde-corps/Ligne de vie/Filet de rétention), **même forme que le web** (case
   colorée pour la valeur choisie parmi Interne/Client/N.A., pas juste du texte) —
   et `particularitesAcces` (`/` si vide). Décision initiale (réduire à un simple
   rappel textuel, sans détail) abandonnée : l'app collecte déjà cette donnée dans
   le wizard, elle doit apparaître dans le document généré.
7. **Règles spécifiques au chantier** : texte complet "Rappel des règles en cas
   d'accident" + "Lors de l'appel aux services de secours" (dans `UI_Textes`,
   19 lignes ajoutées), table contacts d'urgence avec logos (`iconesUrgence`),
   Dérogations au PSS (sans signature).
8. **Annexe 1 — Légende Kinney** : reproduire la grille de référence (probabilité/
   exposition/gravité, formule R = P×E×G, seuils de criticité colorés) — contenu
   fixe, déjà dans `UI_Textes` (grille Kinney) mais jamais mis en page.
9. **Analyse de risques spécifique au chantier** : voir structure de tableau
   ci-dessous — **la partie la plus visible actuellement absente**.
10. **Émargement** : table Nom/Prénom/Entreprise/Date/Signature.
11. **Annexe 2 — Plan particulier** : zone d'insertion du fichier uploadé par le PM.
12. **Annexe 3 — Liste des engins spéciaux** : table Type/Phase/Nombre.
13. **Annexe 4 — Règles générales VMA Sud** : texte complet depuis
    `entreprise.json.reglesGeneralesAnnexe4.texte`, suivi d'un bloc **Signature**
    (remplace l'intitulé "Avis" du document de référence) — Operations Manager /
    Project Manager / Responsable SIPPT, chacun avec un espace pour signer à la
    main. Le n° et le nom du chantier sont rappelés dans cet encadré (anti-fraude :
    empêche qu'une page signée serve pour un autre chantier).

### Structure du tableau d'analyse de risques (point le plus critique)

Ce n'est **pas une liste de titres à plat** (ce que produit la version actuelle) —
c'est un **vrai tableau, en orientation paysage**, avec ces colonnes, dans cet
ordre : `Réf.` | `Sources de danger ou déviation` | `Risques` | `Probabilité` /
`Exposition` / `Gravité` / `Évaluation` (initiale) | `Mesures de prévention` |
`Probabilité` / `Exposition` / `Gravité` / `Évaluation` (résiduelle, après mesures).

- Lignes de catégorie/sous-catégorie/activité : bandeau plein largeur, texte
  centré, pas de contenu dans les autres colonnes (comme aujourd'hui, mais dans un
  vrai tableau plutôt qu'à plat).
- Lignes de risque (ou groupe, voir §6) : chaque colonne remplie depuis
  `catalogue_risques.json` (`sourceDanger`, `risques`, `evaluationInitiale.*`,
  `mesuresPrevention`, `evaluationResiduelle.*`).
- **Couleur de la cellule `Évaluation`** dérivée de `eval_ini_niveau` /
  `eval_res_niveau`, déjà présents dans les données — pas besoin de recalculer :
  - contient "arrêt" → rouge foncé
  - contient "immédiate" → rouge
  - contient "correction" → orange
  - contient "attention" → jaune
  - contient "acceptable" → vert
- Respecter les règles déjà posées ailleurs : titres toujours visibles même sans
  ligne cochée dessous (§6), granularité activité/risque selon `granularite` (§6).

Cette section est un vrai chantier à part entière, probablement à traiter comme
une tâche dédiée plutôt qu'un ajustement — le template de rendu PDF n'existe pas
encore vraiment, il est à construire depuis cette spec.

## 13. MOADR (Mode Opératoire avec Analyse de Risque)

Troisième type de document de l'app, distinct du RePSS complet/abrégé — en cours de
conception, à construire depuis le classeur Word existant (`F_0X_VMA_MOADR_Blanco.dotm`),
qui est un squelette quasiment vide (section 5.2 "Tableau d'Analyse de Risques"
totalement vide dans le fichier source, aucun tableau à en reprendre).

**Architecture** : outil autonome, accessible depuis deux entrées — directement
depuis l'écran d'accueil ("Créer un MOADR", à côté de "Créer un RePSS"), ou depuis
une demande MOADR faite au sein d'un RePSS (`demandesMoadr`, §3) — les deux mènent
au même outil, un seul MOADR à maintenir. Quand il est lancé depuis un RePSS, le
PDF généré est joint en annexe de ce RePSS (`fichierAnnexe` de la demande
correspondante) plutôt que de rester un document isolé.

**Pré-remplissage automatique** : quand le MOADR est ouvert depuis une demande
faite dans un RePSS, les champs déjà connus à ce moment (chantier, date, contexte)
doivent se pré-remplir automatiquement plutôt que d'être retapés — uniquement
saisis manuellement quand le MOADR est créé de façon autonome depuis l'accueil.

**Échelle Kinney** : la même que le reste du RePSS (Gravité 1/3/7/15/40/100,
Probabilité 0,1-10, Exposition 0,2-10, niveaux Acceptable/Attention requise/
Correction nécessaire/Mesure immédiate/Envisager l'arrêt, couleurs déjà définies
§12) — **pas** l'échelle simplifiée du document Word d'origine (Gravité/Probabilité
1-5, Exposition 1-4), jugée incohérente avec le reste des documents VMA Sud.

**Construction de l'analyse de risque en direct** (pas de catalogue préexistant,
chaque MOADR décrit une situation propre au chantier) — inspirée d'un autre outil
de Ced, principes à reprendre :
- Un formulaire d'ajout de ligne, pas une liste pré-cochée : Tâche/étape, Danger,
  Situation dangereuse, Mesures existantes — **tous en texte libre**, à remplir
  par le PM (pas de liste fixe de catégories de danger, contrairement à l'outil de
  référence qui n'a servi que d'exemple pour la mise en page/couleurs).
- **Risque initial et risque résiduel affichés côte à côte dans le formulaire
  lui-même**, avant l'enregistrement de la ligne — fond teinté rouge pour le
  risque initial, fond teinté vert pour le résiduel, calcul Kinney en direct à
  mesure que Probabilité/Exposition/Gravité sont choisis (menus déroulants sur
  le vocabulaire fixe, pas de saisie libre des scores).
- Une fois la ligne ajoutée, elle apparaît dans un tableau récapitulatif : chaque
  risque affiché comme badge coloré avec le niveau, les 3 facteurs en rappel
  court, et une mention d'action ("Action nécessaire" / "Acceptable"...) — légende
  des 4-5 niveaux avec pastille de couleur en bas du tableau.
- Actions globales : vider le tableau, enregistrer l'analyse complète, annuler.
- Référence auto-générée par ligne d'analyse (même logique que `REPSS-2026-XXX`).

## 14. Points encore ouverts (à trancher, pas encore décidés)

- Bureau d'architecture / B.E. Tech. Spéciales / Coordinateur Sécurité : traités
  comme variables par chantier par hypothèse, jamais confirmés formellement par Ced.
- Source de mise à jour de `liste_hopitaux.json` introuvable dans le classeur
  d'origine — à vérifier/rafraîchir si Ced retrouve la source.
- Adresse ATK dans `entreprise.json` : divergence avec le registre public FOD
  Economie, gardée telle que fournie par Ced, à vérifier.
- Statut `brouillon_partiel` du texte Annexe 4 : nécessite une relecture QHSE
  formelle avant de passer à `valide`. Traduit EN/NL (`texte_en`/`texte_nl` dans
  `RePSS_Entreprise_Reference.xlsx` > `Annexe4_Statut`, même mécanisme clé/valeur
  que `texte`) — traduction à faire relire en même temps que le texte français,
  pas encore validée non plus.
- Recherche de commissariat de police : volontairement non construite (lien externe
  à la place) — à revisiter si une vraie source de données apparaît.
- Traduction EN/NL du catalogue d'analyse de risque **abrégé** (`RePSS_Analyse_Risques_Abrege.xlsx`) :
  pas encore faite (le catalogue **complet** l'est, cf. §2) — reste fr uniquement pour
  l'instant, à traiter si le format abrégé est utilisé à l'international.
- Traduction EN/NL du catalogue complet : première traduction retraduite proprement
  par Claude (ids/structure identiques au classeur fr, texte relu pour éviter le
  mélange de langues et les troncatures observés dans un premier essai d'outil externe) —
  à faire relire par un locuteur natif technique (électricité/HVAC/PV) côté QHSE avant
  validation formelle, notamment les choix de terminologie signalés lors de la
  traduction (ex. traductions de "MO"/"CSS", "TGBT", "nacelle", "consignation").
