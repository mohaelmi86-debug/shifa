# SHIFA HEALTH — revue applicative ciblée (lecture seule)

Date : 2026-11-18  
Périmètre : dépôt `mohaelmi86-debug/shifa`, branche `main`.  
Nature : revue statique de fichiers ciblés via GitHub. Aucun test d'exécution, aucun test d'intrusion et aucune modification Supabase.

## Résumé

La revue a identifié trois points à vérifier avant une mise en production ou une validation de sécurité :

1. Le middleware accepte un jeton de session via l'en-tête `x-sb-token` et le copie dans le cookie Supabase si aucun cookie dont le nom contient `auth-token` n'est présent.
2. Le callback OAuth lit le paramètre `next` depuis l'URL et l'utilise dans la construction des redirections. Le comportement doit être borné à une liste de chemins internes autorisés.
3. Le client Supabase serveur force `sameSite: 'none'` et `secure: true` lors de l'écriture des cookies. La nécessité de `SameSite=None` doit être démontrée par les flux cross-site réels ; sinon préférer `Lax`.

Ces éléments sont des constats statiques et des risques à valider, pas la preuve d'une exploitation.

## A-001 — Jeton d'authentification accepté dans un en-tête custom

Fichier : `src/middleware.ts`

Comportement observé :
- lit `x-sb-token` ;
- si présent et qu'aucun cookie dont le nom contient `auth-token` n'est trouvé, écrit sa valeur dans `sb-<project-ref>-auth-token` ;
- appelle ensuite `supabase.auth.getUser()` pour les routes protégées.

Risque :
- multiplication des voies de transport du jeton de session ;
- risque de confusion entre sessions si les clients, proxies ou intégrations injectent cet en-tête ;
- exposition potentielle du jeton dans les journaux de reverse proxy/APM si les en-têtes sont journalisés.

Recommandations :
- supprimer cette voie si elle n'est pas strictement nécessaire ;
- si elle est nécessaire, documenter son origine et son usage, refuser les valeurs malformées, ne jamais journaliser cet en-tête et vérifier le comportement lorsqu'un cookie existe déjà ;
- ajouter des tests middleware couvrant cookie valide + header différent, cookie absent + header valide, header invalide, routes publiques et routes protégées ;
- ne jamais considérer la présence de cet en-tête comme une autorisation : conserver la validation serveur Supabase.

Priorité proposée : P1 à confirmer selon les clients qui utilisent réellement ce mécanisme.

## A-002 — Paramètre de redirection OAuth `next`

Fichier : `src/app/auth/callback/route.ts`

Comportement observé :
- récupère `next` depuis les paramètres de l'URL, avec `/patient-home` par défaut ;
- après échange du code OAuth, redirige vers `${origin}${redirectPath}` ;
- les rôles connus remplacent `next` par un tableau de bord prédéfini ; pour les autres rôles, `next` peut être conservé.

Risque :
- la destination n'est pas validée explicitement par une liste de chemins internes ;
- les rôles non traités peuvent suivre une destination fournie par l'appelant ;
- les redirections construites par concaténation sont difficiles à auditer et peuvent produire des chemins ambigus.

Recommandations :
- créer une fonction unique `safeInternalRedirect` ;
- accepter uniquement des chemins relatifs commençant par un seul `/`, rejeter `//`, les schémas, les antislashs et les caractères de contrôle ;
- utiliser une allowlist de routes autorisées par rôle ;
- construire la destination avec `new URL(validatedPath, request.url)` et vérifier que son origin reste celle de l'application ;
- tester les rôles patient, professionnel, org_admin, platform_admin et rôles sans dashboard, ainsi que les entrées malveillantes.

Priorité proposée : P1.

## A-003 — Politique SameSite des cookies serveur

Fichier : `src/lib/supabase/server.ts`

Comportement observé :
- les cookies sont écrits avec les options Supabase puis `sameSite: 'none'` et `secure: true`.

Risque :
- `SameSite=None` permet l'envoi du cookie dans davantage de contextes cross-site que `Lax` ;
- cela peut accroître l'exposition aux scénarios CSRF si les mutations applicatives ne vérifient pas également l'origine, le contexte et les autorisations.

Recommandations :
- établir si un flux cross-site nécessite réellement `SameSite=None` ;
- préférer `Lax` si les parcours OAuth et l'architecture le permettent ;
- si `None` est indispensable, vérifier les protections CSRF sur toutes les routes mutantes (POST/PUT/PATCH/DELETE), contrôler Origin/Referer lorsque pertinent et exiger des protections applicatives explicites ;
- vérifier que les options `HttpOnly`, `Secure`, `Path` et `SameSite` sont cohérentes pour l'ensemble des cookies de session.

Priorité proposée : P1 à confirmer par test des parcours OAuth et cross-site.

## Contrôles non réalisés / limites

- Aucun build, lint, test automatisé ni test navigateur n'a été exécuté.
- Aucun test de redirection ou de session n'a été réalisé.
- Les fichiers de configuration secrets et tout fichier `.env` n'ont pas été ouverts.
- Les composants frontend et toutes les routes API n'ont pas encore été audités.
- Aucun secret, compte utilisateur, dossier patient ou fixture n'a été créé ou manipulé.
- Aucune configuration Supabase, politique RLS, permission, donnée ou migration n'a été modifiée.

## Blocage migrations

Le compte GitHub connecté expose les dépôts `shifa`, `shifaasso`, `Archivagelims`, `stockflow`, `EducoachIA`, `KAZI-AFRICA` et `portfolio-elmi`. Les recherches effectuées sur les dépôts accessibles et les branches connues n'ont pas permis de retrouver les 12 fichiers SQL historiques manquants. Cela ne prouve pas qu'ils n'existent pas dans une archive locale, un autre compte, un projet Google AI Studio ou une sauvegarde.

Ne pas fabriquer les migrations historiques à partir des seuls noms de l'historique Supabase. Avant toute migration exécutable, récupérer les sources exactes ou approuver une stratégie de baseline/reconciliation indépendante, avec sauvegarde et staging isolé.
