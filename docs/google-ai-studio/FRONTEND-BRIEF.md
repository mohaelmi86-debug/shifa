# SHIFA Health — brief frontend Google AI Studio

## Objectif
Produire et intégrer le frontend de SHIFA Health dans le dépôt existant `mohaelmi86-debug/shifa`. Il ne faut surtout pas créer une deuxième application indépendante ni remplacer le backend existant.

## Contexte technique à respecter
- Next.js 15.5.29, App Router
- React 19, TypeScript 5, Tailwind CSS
- Supabase existant pour Auth, PostgreSQL, Storage et Edge Functions
- Le projet possède déjà de nombreuses routes métier dans `src/app`, des composants et des services. Les inspecter avant toute modification.
- Le serveur de développement écoute sur le port 4028 (`npm run dev`).

## Consigne principale à Google AI Studio
Agis comme un architecte frontend senior et un designer produit spécialisé dans les logiciels de santé. Commence par analyser intégralement l'arborescence et les écrans existants. Construis une interface professionnelle, cohérente, accessible et responsive en réutilisant les routes, composants, types, hooks, services et appels Supabase déjà présents.

Ne réécris pas les fonctionnalités métier qui existent déjà. Ne supprime aucune route. Ne remplace pas Supabase par Firebase, une API fictive ou un stockage local. Ne crée pas de données médicales réelles ou de faux dossiers présentés comme réels.

## Direction visuelle
- Produit : SHIFA Health, plateforme numérique de gestion de santé.
- Style : moderne, rassurant, institutionnel, sobre et premium.
- Palette : bleu médical profond, turquoise/vert d'eau, fonds clairs, contrastes accessibles.
- Typographie lisible, hiérarchie nette, espacements réguliers, composants homogènes.
- Navigation latérale sur ordinateur, navigation mobile compacte, en-tête avec contexte établissement et profil.
- Tableaux lisibles, filtres explicites, états vides utiles, chargements, erreurs et confirmations.
- Éviter les onglets redondants, les menus dupliqués et les cartes décoratives sans fonction.
- Prévoir les vues desktop, tablette et mobile.

## Architecture fonctionnelle à harmoniser
Organiser l'expérience autour des espaces réellement présents dans le dépôt :
1. Accueil et tableau de bord.
2. Dossier patient et parcours de soins.
3. Rendez-vous, consultations et téléconsultation.
4. Professionnels, équipes et habilitations.
5. Établissements, services et organisation.
6. Facturation, paiements et gestion financière.
7. Administration, utilisateurs, rôles et permissions.
8. Shifa Academy et formation.
9. Modules complémentaires déjà implémentés.
10. Paramètres, notifications, audit et support.

Cette liste sert à organiser l'expérience ; ne pas créer de pages fictives si aucune route ou fonctionnalité backend correspondante n'existe.

## Sécurité et données de santé — règles impératives
- Respecter les contrôles d'accès existants côté serveur et les rôles existants.
- Ne jamais considérer le masquage d'un bouton comme une autorisation.
- Ne jamais exposer la clé Supabase service_role dans le navigateur.
- Ne jamais placer de secret dans les variables `NEXT_PUBLIC_*`.
- Conserver les accès aux données via les clients/services existants et les politiques RLS.
- Ne pas contourner les middlewares, vérifications de session, contrôles d'organisation ou validations.
- Ne pas afficher des données d'un autre établissement/tenant.
- Ne pas ajouter de tables, migrations, politiques RLS ou Edge Functions sans demande distincte et revue.
- Utiliser uniquement des données de démonstration clairement identifiées dans les aperçus.

## Qualité d'implémentation
- TypeScript strict ; pas de `any` injustifié.
- Composants réutilisables et petites responsabilités.
- Formulaires avec validation, messages d'erreur compréhensibles et états de soumission.
- Accessibilité clavier, labels, focus visible et contrastes corrects.
- Pas de liens morts, boutons sans action ou chiffres de démonstration présentés comme réels.
- Ne pas ajouter de dépendance sans justification.
- Ne pas modifier les fichiers de configuration, les migrations ou les workflows CI sans justification technique.
- Préserver les conventions et alias d'import déjà utilisés dans le dépôt.

## Livrables attendus
1. Audit succinct des routes et composants existants avant intervention.
2. Proposition d'un système de design commun.
3. Frontend harmonisé, livré sous forme de modifications compatibles avec le dépôt actuel.
4. Liste précise des fichiers modifiés et des routes impactées.
5. Vérifications : `npm run type-check`, `npm run lint`, `npm run build`.
6. Liste des points non terminés et des dépendances nécessaires.

## Méthode de travail obligatoire
Procéder par lots limités et vérifiables. Commencer par le shell applicatif partagé (layout, navigation, header, responsive, tokens de design), puis traiter les écrans prioritaires sans casser les pages métier. Après chaque lot, vérifier les imports, les routes, les permissions et les tests. Ne pas fusionner directement dans `main`. Proposer les changements sur une branche de travail liée au dépôt existant et laisser la revue CI décider de la suite.

## Critère d'acceptation
Le résultat doit être le frontend de l'application SHIFA existante, connecté à son architecture actuelle, et non une maquette autonome ou une nouvelle application déconnectée.
