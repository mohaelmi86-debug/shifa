# SHIFA HEALTH — audit applicatif approfondi (API, sessions et données financières)

Date : 2026-11-18  
Dépôt : `mohaelmi86-debug/shifa`  
Branche examinée : `main`  
Méthode : inspection statique des fichiers accessibles depuis GitHub. Aucun test d'exécution, appel API en production, test d'intrusion ou accès à des données patient n'a été effectué.

## Synthèse exécutive

Un risque applicatif prioritaire a été identifié sur l'API de génération IA :

- `src/app/api/ai/chat-completion/route.ts` expose un endpoint POST sans authentification applicative visible, sans limitation de débit ni plafond de taille/volume visible.
- Le client contrôle le fournisseur, le modèle, les messages, le streaming et un objet `parameters` transmis à la bibliothèque serveur.
- L'endpoint utilise des clés API serveur configurées dans l'environnement et peut donc devenir un relais de consommation de services IA aux frais de SHIFA.
- Les erreurs du fournisseur sont renvoyées avec leurs détails bruts.

Ce constat doit être traité avant ouverture publique de la fonctionnalité. La protection RLS de la base ne protège pas un endpoint serveur de génération IA.

## A-004 — Endpoint IA sans garde d'accès ni contrôle de consommation visible

Fichier : `src/app/api/ai/chat-completion/route.ts`

Éléments observés :
- aucune vérification de session Supabase ou de rôle avant l'appel à `completion()` ;
- aucune limitation de débit, quota par utilisateur/organisation ou plafond de coût visible ;
- absence de validation stricte des valeurs `provider`, `model`, `messages` et `parameters` ;
- les paramètres du client sont fusionnés après `api_key`, `model`, `messages` et `stream`, ce qui leur permet de remplacer ces propriétés dans l'objet passé au SDK ;
- les détails d'erreur fournisseur sont renvoyés dans la réponse HTTP et les logs ;
- la voie streaming renvoie également les détails d'erreur.

Risque :
- consommation non autorisée des clés IA configurées côté serveur et coûts imprévus ;
- déni de service économique ou saturation du quota ;
- appels à des modèles/fournisseurs non prévus si les identifiants de fournisseur et les modèles ne sont pas contraints ;
- fuite d'informations opérationnelles contenues dans les messages d'erreur du fournisseur.

Priorité proposée : P0 avant exposition publique, P1 si l'endpoint est strictement inaccessible depuis l'extérieur et protégé par une couche amont vérifiée.

Remédiations requises :
1. Exiger une session authentifiée côté serveur avec `supabase.auth.getUser()` ; ne pas faire confiance à un userId envoyé par le navigateur.
2. Vérifier le rôle, l'état actif du compte, l'organisation et le droit d'utiliser le module IA.
3. Définir une allowlist serveur de fournisseurs et de modèles ; ne jamais laisser le client choisir librement une clé ou un fournisseur.
4. Construire explicitement l'objet SDK à partir de champs validés ; ne jamais spreader un objet client arbitraire après les secrets serveur.
5. Définir une limite de taille de corps, un nombre maximal de messages, une longueur maximale par message et une liste de rôles autorisés.
6. Ajouter un rate limit robuste et des quotas atomiques par utilisateur et organisation, avec budget journalier/mensuel, limite de concurrence et coupe-circuit.
7. Pour le streaming, appliquer les mêmes contrôles avant d'ouvrir le flux et interrompre proprement les flux dépassant le budget ou la durée maximale.
8. Ne pas renvoyer les messages bruts des fournisseurs au client ; retourner un code d'erreur générique avec un identifiant de corrélation. Journaliser le détail côté serveur en supprimant clés, prompts sensibles et données de santé.
9. Journaliser l'usage (utilisateur, organisation, modèle autorisé, tokens/coût estimés, statut) sans conserver de contenu clinique non nécessaire.
10. Ajouter des tests négatifs : utilisateur anonyme, compte suspendu, rôle non autorisé, organisation sans quota, fournisseur inconnu, modèle non autorisé, body excessif, paramètres injectés, rafale de requêtes, streaming interrompu.

## A-005 — Le middleware ne protège pas le préfixe API

Fichier : `src/middleware.ts`

Le tableau `PROTECTED_PREFIXES` contient des routes d'interface, mais aucun préfixe `/api`. Le middleware n'exige donc pas de session pour la route `/api/ai/chat-completion`. Le middleware ne doit de toute façon pas être l'unique contrôle d'accès d'une API : chaque route sensible doit vérifier l'identité et l'autorisation côté serveur.

Priorité : P0 en lien avec A-004.

## A-006 — Jeton de session copié globalement dans les appels same-origin

Fichiers : `src/lib/supabase/client.tsx`, `src/middleware.ts`

Éléments observés :
- le client remplace globalement `window.fetch` ;
- pour les URL relatives ou same-origin, il ajoute `x-sb-token` avec le jeton de session trouvé dans les cookies ou le stockage local ;
- le middleware transforme ensuite cet en-tête en cookie Supabase si aucun cookie d'authentification n'existe.

Risque :
- le jeton est ajouté à des requêtes same-origin qui ne sont pas nécessairement des appels d'authentification ;
- risque de journalisation accidentelle de l'en-tête dans les proxies, observabilité ou services internes ;
- couplage global et difficile à tester entre toutes les requêtes fetch de l'application et l'authentification Supabase.

Recommandations :
- supprimer l'interception globale de `window.fetch` et le pont `x-sb-token` si aucun besoin d'architecture ne l'impose ;
- préférer le mécanisme standard `@supabase/ssr` et ses cookies de session ;
- si une intégration particulière l'exige, utiliser un client HTTP dédié, limité à un endpoint précis, sans propagation vers les autres routes ;
- ne jamais journaliser les jetons ni les en-têtes d'authentification.

Priorité : P1.

## A-007 — Repli du stockage de session dans localStorage

Fichier : `src/lib/supabase/client.tsx`

Éléments observés :
- si le test de disponibilité des cookies échoue, les données de session sont stockées dans `localStorage` ;
- les valeurs de cookies sont également écrites en cookie lorsque possible ;
- le jeton est ensuite relu depuis le stockage et injecté dans les appels same-origin.

Risque :
- les jetons accessibles depuis JavaScript sont exposés en cas de XSS ;
- complexité accrue de la synchronisation, de l'expiration et de la révocation entre cookies et stockage local ;
- comportement particulier lié aux cookies partitionnés qui doit être testé sur tous les navigateurs pris en charge.

Recommandations :
- privilégier une session gérée côté serveur par cookies sécurisés et HttpOnly lorsque l'architecture le permet ;
- éviter le stockage persistant du jeton de session dans localStorage ;
- réaliser des tests multi-navigateurs des parcours de connexion, rafraîchissement, expiration et déconnexion avant de retirer le mécanisme de repli.

Priorité : P1.

## A-008 — Contexte d'authentification client et profil utilisateur

Fichier : `src/contexts/AuthContext.tsx`

Éléments observés :
- l'état initial de session est chargé avec `supabase.auth.getSession()` côté navigateur ;
- le profil est ensuite récupéré via `user_profiles.select('*')` ;
- le contexte expose les objets `user` et `session` à l'ensemble des composants consommateurs.

Analyse :
- `getSession()` côté navigateur est acceptable pour initialiser l'interface, mais ne constitue jamais une preuve d'autorisation serveur ;
- `select('*')` expose au navigateur tous les champs autorisés par RLS de `user_profiles`, y compris ceux qui ne seraient pas nécessaires à l'interface ;
- le middleware et les API doivent vérifier le JWT côté serveur et réévaluer les droits depuis des données fiables.

Recommandations :
- remplacer le profil générique par une projection minimale des champs nécessaires à l'interface ;
- ne jamais utiliser le rôle issu de l'état React comme décision d'autorisation ;
- vérifier côté serveur le compte actif, l'appartenance organisationnelle et les permissions à chaque opération sensible ;
- gérer les erreurs et l'état de chargement de façon à éviter les affichages transitoires de données privées lors d'un changement de session.

Priorité : P1.

## A-009 — Service financier : fonctions globales sans filtre de portée explicite

Fichier : `src/lib/supabase/financialService.ts`

Éléments observés :
- plusieurs fonctions de lecture globale interrogent `payments`, `subscriptions`, `commissions`, `settlements`, `tax_records`, `revenue_reconciliation`, `ambassador_payouts` et `marketplace_settlements` sans filtre explicite d'utilisateur ou d'organisation ;
- des fonctions d'agrégat chargent les données côté navigateur et calculent les totaux dans le client ;
- certaines fonctions utilisent des filtres par identifiant transmis en argument.

Analyse :
- le filtre côté client ne constitue pas une frontière de sécurité ;
- la sécurité réelle dépend des politiques RLS de chaque table, non auditées ici ligne par ligne pour tous les domaines financiers ;
- les agrégats globaux dans le navigateur augmentent le volume de données exposées et ne sont pas adaptés à un tableau de bord multi-tenant à grande échelle.

Recommandations :
- auditer les policies RLS de toutes les tables financières et tester les accès inter-organisations ;
- limiter les colonnes sélectionnées et imposer des filtres de tenant quand ils sont nécessaires ;
- déplacer les agrégats globaux vers des vues/RPC ou endpoints serveur avec contrôle RBAC et scope organisationnel ;
- vérifier la cohérence des devises, des statuts et des périodes avant toute consolidation financière ;
- ne jamais supposer qu'un identifiant fourni par le client est autorisé.

Priorité : P1, sous réserve de l'état exact des policies.

## A-010 — Hook Realtime générique

Fichier : `src/lib/hooks/useSupabaseRealtime.ts`

Éléments observés :
- le nom de table, le schéma, les colonnes de sélection, les filtres et la limite sont des paramètres dynamiques ;
- la fonction exécute `from(table).select(select)` et s'abonne aux changements Postgres pour cette table ;
- les filtres sont des filtres de requête et non des contrôles d'autorisation.

Analyse :
- RLS reste la frontière principale des lectures et des événements autorisés ;
- un composant peut demander une table/colonnes non prévues pour son écran si le rôle dispose déjà de droits plus larges ;
- le hook générique facilite les usages incohérents et peut augmenter les abonnements et requêtes inutiles.

Recommandations :
- remplacer les appels directs aux tables sensibles par des hooks spécialisés avec tables/colonnes autorisées en dur ;
- ne jamais inclure de données médicales dans Realtime sans policy de lecture et publication vérifiées ;
- tester l'isolation tenant et la révocation de relation de soins sur les événements Realtime ;
- limiter le nombre de canaux, nettoyer les abonnements et surveiller les erreurs de souscription.

Priorité : P1/P2 selon les tables consommées.

## Contrôles non réalisés / limites

- Revue statique uniquement ; aucune requête n'a été envoyée à l'API IA.
- Aucun build, lint, test automatisé, test de charge ou test navigateur n'a été exécuté.
- Les politiques RLS financières doivent être rapprochées du schéma Supabase courant.
- Aucun fichier `.env`, secret ou valeur de clé n'a été ouvert.
- Aucune donnée utilisateur, financière ou médicale n'a été lue.
- Aucun code applicatif ni paramètre Supabase n'a été modifié.
- Aucun déploiement, merge ou changement de production n'a été effectué.
