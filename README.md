# Exposé N° 14 : La Dé-récursivation

> **Algorithmique Avancée & Complexité** — Master 1 Intelligence Artificielle (Semestre 7)  
> *Département de Mathématiques et Informatique*

---

### Informations Académiques

| Champ | Détails |
| :--- | :--- |
| **Module** | Algorithmique Avancée et Complexité |
| **Niveau** | Master 1 Intelligence Artificielle (M1 IA) — Semestre 7 |
| **Encadrant** | Dr. HAMEURLAINE Messaoud |
| **Binôme / Équipe** | • Saoula Youcef Abderrazak<br>• Azzedine Hallali<br>• Boughana Samir |
| **Sujet** | Exposé N° 14 : La Dé-récursivation des algorithmes |

---

## 1. Problématique & Fondements Théoriques

La récursivité est un paradigme d'expression algorithmique élégant qui s'appuie sur la pile d'exécution du système d'exploitation (*Call Stack*). Toutefois, chaque appel récursif alloue un enregistrement d'activation (*Stack Frame*) contenant :
- Les paramètres formels de la fonction.
- Les variables locales et calculs intermédiaires.
- L'adresse de retour vers l'instruction appelante.

Dans les architectures standard, la taille allouée à la pile système est strictement contrainte par l'OS (typiquement de 1 Mo à 8 Mo). Une profondeur d'appels récursifs $O(n)$ sur des instances volumineuses conduit inévitablement à un dépassement de capacité critique (**Stack Overflow** / `Segmentation fault`), même lorsque la mémoire vive dynamique (*Heap*) demeure largement disponible.

La **dé-récursivation** désigne l'ensemble des transformations formelles permettant de convertir un algorithme récursif en un algorithme itératif équivalent, éliminant tout risque de saturation de la pile système.

---

## 2. Taxonomie des Formes Récursives & Transformations

### A. Récursion Terminale (*Tail Recursion*)
Une fonction est récursive terminale si l'appel récursif constitue la dernière action exécutée avant le retour de la fonction (aucune opération en attente sur la valeur de retour).

* **Transformation :** Remplacement direct par une structure de boucle (`while` / `for`) et réaffectation des paramètres (technique du *Tail Call Optimization* / TCO).
* **Empreinte mémoire :** Réduction de $O(n)$ frames actifs à $O(1)$ cadre d'exécution unique réutilisé.

### B. Récursion Non-Terminale (*Non-Tail Recursion*)
Des opérations (ex. multiplications, additions, parcours multiples) restent en attente du résultat de l'appel récursif. Le système doit mémoriser l'état local avant chaque plongée récursive.

* **Transformation :** Émulation logicielle de la pile au niveau utilisateur (dans le tas ou la mémoire statique) via une structure de données LIFO (*Last In, First Out*).
* **Avantage :** Déplacement de la charge mémoire depuis la pile d'exécution OS (étroite) vers le Heap (accessible à l'échelle de la RAM totale).

---

## 3. Études de Cas & Analyse de Complexité

### Cas 1 — Suite de Fibonacci (Arbre vs Accumulateurs glissants)
$$\text{fib}(n) = \text{fib}(n-1) + \text{fib}(n-2)$$

| Métrique | Double Récursion Naïve | Version Dé-récursivée (Boucle) |
| :--- | :--- | :--- |
| **Complexité Temporelle** | $\mathcal{O}(2^n)$ (Arbre exponentiel) | $\mathcal{O}(n)$ (Linéaire) |
| **Complexité Spatiale (Stack)** | $\mathcal{O}(n)$ blocs d'activation actifs | $\mathcal{O}(1)$ (Deux registres scalaires $a, b$) |
| **Nombre d'opérations ($n=30$)** | $2\,692\,537$ appels récursifs | $29$ itérations de boucle |

### Cas 2 — Parcours en Profondeur d'Arbre Binaire (DFS Préfixe)
Conversion du parcours récursif d'un arbre binaire vers une implémentation C ANSI avec pile manuelle :
* **Récursif :** $h$ stack frames empilés automatiquement dans la call stack OS ($h \in [\log_2(n), n]$).
* **Dé-récursivé :** 1 seul frame dans la call stack OS ; empilement explicite des pointeurs de nœuds (`Noeud*`) dans un tableau/pile applicatif avec inversion de l'ordre d'empilement (fils droit puis fils gauche) pour garantir l'ordre de traitement préfixe.

```c
void parcours_iteratif(Noeud* racine) {
    if (!racine) return;
    Pile p = { .sommet = -1 };
    push(&p, racine);

    while (p.sommet != -1) {
        Noeud* curr = pop(&p);
        printf("%d ", curr->val);
        if (curr->droit)  push(&p, curr->droit);
        if (curr->gauche) push(&p, curr->gauche);
    }
}
```

---

## 4. Plateforme de Présentation & Simulateur Interactif

Le présent dépôt intègre une application web interactive conçue pour le support de soutenance en amphithéâtre :

* **Simulateur de Call Stack :** Visualisation dynamique des zones mémoire (Stack, Heap, Segment Statique) avec déclenchement visuel du seuil de Stack Overflow.
* **Comparateur TCO synchrone :** Déroulement pas-à-pas démontrant l'accumulation de frames en non-terminal face à la réutilisation d'un frame unique en terminal.
* **Générateur d'arbres & Métriques Fibonacci :** Curseurs interactifs avec calcul instantané du ratio d'efficacité mémoire.
* **Visualiseur DFS interactif :** Arbre binaire avec mode pas-à-pas, exécution automatique et recherche de clé avec arrêt anticipé.
* **Internationalisation trilingue complète :** Français (FR), Arabe (AR - RTL avec typographie Cairo), Anglais (EN).
* **Mode Amphithéâtre & Sombre :** Thème haute lisibilité pour vidéoprojecteur et mode contraste sombre.
* **Moteur d'exportation PDF / Impression :** Découpage CSS vectoriel strict en 6 planches paysage 16:9 (`@media print` avec calibration colorimétrique exacte).

---

## 5. Environnement Technique & Déploiement

### Stack Logicielle
* **Runtime :** Node.js 20+ / 24+
* **Framework :** React 19
* **Bundler & Outillage :** Vite 8
* **Styles :** Tailwind CSS v4 (`@tailwindcss/vite`)
* **Icônes :** Lucide React
* **Typographies :** Plus Jakarta Sans, Cairo, JetBrains Mono

### Commandes de Développement

```bash
# Installation des dépendances
npm install

# Lancement du serveur de développement local
npm run dev

# Compilation de production
npm run build

# Prévisualisation du bundle de production
npm run preview
```

### Déploiement Vercel
Le fichier `vercel.json` est configuré avec un garde-fou de déploiement manuel et la réécriture SPA (`rewrites` vers `/index.html`).

---

## 6. Références Académiques

1. Aho, A. V., Lam, M. S., Sethi, R., & Ullman, J. D. (2006). *Compilers: Principles, Techniques, and Tools* (2nd ed.). Addison-Wesley.
2. Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press.
3. Knuth, D. E. (1997). *The Art of Computer Programming, Volume 1: Fundamental Algorithms* (3rd ed.). Addison-Wesley.
4. Steele, G. L. (1977). *Debunking the "Expensive Procedure Call" Myth, or, Procedure Call Implementations Considered Harmful*. ACM SIGPLAN Notices.
