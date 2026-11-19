# SHIFA HEALTH — remédiation API SHIFA AI (lot 1)

Date : 2026-11-18  
Branche : `security/shifa-ai-api-hardening`  
Base : `main`  
Nature : durcissement applicatif incrémental ; aucun changement Supabase ni déploiement.

## 1. Changements réalisés

- L'endpoint `POST /api/ai/chat-completion` exige désormais une session Supabase validée côté serveur avec `auth.getUser()`.
- Le profil est relu depuis `user_profiles` côté serveur ; le compte doit exister et avoir `is_active = true`.
- Le module est limité à `patient`, `professional`, `organization` ou `institution`.
- Matrice d'accès appliquée dans le handler :
  - `patient` → rôle `patient`
  - `professional` → rôle `professional`
  - `organization` → rôle `org_admin`
  - `institution` → rôles `ministry` ou `insurance` (données agrégées uniquement)
- Le prompt système est défini côté serveur ; les messages système fournis par le navigateur sont rejetés.
- Le navigateur ne choisit plus le fournisseur, le modèle, les clés, le streaming ni les paramètres arbitraires du SDK.
- Les limites de requête sont contrôlées : 32 Ko sur les octets réels du corps HTTP (indépendamment de l'en-tête Content-Length), 20 messages maximum, 8 000 caractères par message et 24 000 caractères cumulés.
- Un limiteur PostgreSQL atomique est ajouté dans une migration séparée : 10 requêtes/minute et 200/jour par utilisateur authentifié, avec réponse HTTP 429 et en-tête `Retry-After`. Le limiteur échoue en mode fermé si le RPC est indisponible ; les compteurs agrégés anciens sont nettoyés à chaque appel actif et aucun prompt n'est stocké.
- Les erreurs publiques sont normalisées et ne renvoient plus les détails bruts du fournisseur.
- Les écrans patient, professionnel, pharmacie et organisation utilisent le contrat `{ module, messages }` et lisent `output`. L'écran institution utilise également ce contrat depuis le correctif du 19 novembre. Les appels vérifient `response.ok` avant d'afficher la réponse.
- Le mode professionnel sélectionné est conservé comme contexte de la question, mais ne confère aucun droit d'accès aux données patient.

## 2. Configuration serveur requise

Aucune valeur secrète ni aucun nom de modèle n'a été inventé ou ajouté au dépôt.

Variables à configurer dans l'environnement serveur de déploiement (jamais dans le navigateur) :

| Variable | Rôle |
|---|---|
| `SHIFA_AI_PROVIDER` | Fournisseur parmi `OPEN_AI`, `ANTHROPIC`, `GEMINI`, `PERPLEXITY` |
| `SHIFA_AI_MODEL_PATIENT` | Identifiant de modèle choisi pour le module patient |
| `SHIFA_AI_MODEL_PROFESSIONAL` | Identifiant de modèle choisi pour le module professionnel |
| `SHIFA_AI_MODEL_ORGANIZATION` | Identifiant de modèle choisi pour le module organisation |
| `SHIFA_AI_MODEL_INSTITUTION` | Identifiant de modèle choisi pour le module institution (ministères/assureurs) |
| `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` / `GEMINI_API_KEY` / `PERPLEXITY_API_KEY` | Clé serveur du fournisseur choisi |

Le handler renvoie `503 AI_SERVICE_NOT_CONFIGURED` si la configuration requise manque. Il ne bascule pas silencieusement sur un fournisseur ou un modèle de secours.

## 3. Bloqueurs avant exposition publique

**Ce lot n'est pas une autorisation de mise en production.**

1. **Quotas organisation et budget financier** : le limiteur de ce lot applique des plafonds atomiques par utilisateur (10/minute, 200/jour), pas encore par organisation. Ajouter les plafonds organisation, le suivi des coûts réels par fournisseur/modèle, les budgets mensuels et un coupe-circuit avant exposition publique.
2. **Configuration modèle à valider** : les noms exacts des modèles et leur compatibilité avec `@rocketnew/llm-sdk` doivent être confirmés dans l'environnement cible. Aucun appel fournisseur n'a été effectué.
3. **Rôle organisation** : le contrôle serveur autorise actuellement uniquement `org_admin`. Vérifier que les administrateurs d'établissement légitimes utilisent bien ce rôle dans les profils réels ; ne pas élargir par défaut à `platform_admin`.
4. **Autres consommateurs** : les wrappers génériques historiques `src/lib/ai/chatCompletion.ts` et `src/lib/hooks/useChat.ts` ont encore leur ancien contrat fournisseur/modèle/streaming. Les recherches GitHub n'ont pas fourni de résultats d'usage fiables ; leur usage doit être cartographié et migré avant suppression ou réactivation.
5. **Données cliniques** : aucun accès aux dossiers patients n'est intégré à ce endpoint. Ne pas ajouter de contexte clinique avant une autorisation patient-professionnel explicite, une minimisation, une journalisation et une revue conformité dédiées.

## 4. Tests de staging à réaliser

Utiliser exclusivement des comptes et données synthétiques dans un environnement isolé.

| Cas | Résultat attendu |
|---|---|
| Sans session | HTTP 401 |
| Session sans profil | HTTP 403 |
| Profil inactif | HTTP 403 |
| Patient appelant `patient` | autorisé si configuration IA valide |
| Patient appelant `professional` ou `organization` | HTTP 403 |
| Professionnel appelant `professional` | autorisé si configuration IA valide |
| Professionnel appelant `organization` | HTTP 403 |
| `org_admin` appelant `organization` | autorisé si configuration IA valide |
| `platform_admin` appelant un module clinique | HTTP 403 |
| Fournisseur/modèle non configuré | HTTP 503, sans détail secret |
| Rôle `system` envoyé par le client | HTTP 400 |
| Message trop long ou trop nombreux | HTTP 400/413 |
| Objet `parameters`, clé ou modèle injecté dans le JSON | ignoré et non transmis au SDK |
| Erreur fournisseur | HTTP 502 générique, détail conservé uniquement côté serveur |
| Réponse fournisseur vide/non reconnue | HTTP 502 générique |

Critères de sortie : migration appliquée sur un staging isolé après réconciliation du ledger, tests négatifs et positifs réussis, rate limiting distribué opérationnel, revue du mapping des rôles, test de build/type-check, puis validation explicite avant déploiement.

## 5. Limites de vérification

- Changements committés sur une branche dédiée GitHub.
- Les workflows GitHub Actions exécutent les contrôles de dépendances, TypeScript, ESLint, build de production et tests SQL isolés. Les tests SQL synthétiques de sécurité clinique et de quotas IA ont réussi sur le commit `003adfa`; les contrôles du commit de correction institutionnelle sont en cours de validation CI.
- Aucun test navigateur ni appel réel au fournisseur IA n'a été exécuté. Aucun résultat de réponse réelle du modèle n'est donc revendiqué.
- La migration `20261118220000_shifa_ai_rate_limits.sql` est uniquement préparée dans GitHub ; elle n'a pas été appliquée à Supabase. Le ledger de production doit d'abord être réconcilié (15 migrations présentes côté Supabase contre 3 sources sur `main`).
- Aucun secret, fichier `.env`, dossier patient, compte réel ou donnée Supabase n'a été consulté ou modifié.
- Aucun déploiement ni changement de production n'a été effectué.


## 6. Corrections CI et déploiement — 18 novembre 2026

- Le premier workflow a confirmé : installation npm réussie, audit initial à 0 vulnérabilité, TypeScript réussi, ESLint en échec (25 erreurs, 40 avertissements).
- Les 25 erreurs ESLint relevées dans les fichiers modifiés ont été corrigées sur cette branche : apostrophes JSX, échappements inutiles et gestion explicite du fallback de stockage.
- Le workflow a été renforcé : Node.js 22, audit bloquant à partir du niveau élevé et étape de build de production Next.js.
- Le script `npm start` a été corrigé : il lance désormais `next start -p 4028` au lieu du serveur de développement. `npm run dev` reste réservé au développement.
- La règle qui ignorait `package-lock.json` a été retirée de `.gitignore`. **Le lockfile n'est toutefois pas encore présent dans le dépôt** ; une installation reproductible via `npm ci` reste à finaliser.
- Les résultats CI doivent être lus sur le dernier commit de la branche, car les exécutions intermédiaires sont automatiquement annulées lors de nouveaux commits. Le statut courant est consultable dans GitHub Actions.

## 7. Bloqueur de sécurité transversal à réconcilier

La branche `main` contient toujours le mécanisme historique `x-sb-token` : le client navigateur ajoute ce jeton aux requêtes same-origin et le middleware le réinjecte dans les cookies. La PR #2 (`audit/shifa-security-hardening-2026-11`) annonce la suppression de ce mécanisme, mais elle est toujours ouverte en brouillon et ses corrections ne sont pas intégrées à `main`.

La PR #5 ne doit donc pas être considérée comme ayant déjà supprimé ce transport. Avant toute mise en production, il faut réconcilier les deux branches et décider d'une migration de session qui ne casse pas les sessions existantes. Ne pas supprimer ce mécanisme à l'aveugle : le fallback localStorage actuel peut en dépendre dans les navigateurs où le test de cookie partitionné échoue.


- Le middleware a également été renforcé sur les portails protégés : contrôle du rôle et du statut actif depuis `user_profiles`, avec correspondance des routes par segment complet (pas de simple préfixe). Les pages patient, professionnel, administration et partenaires sont séparées par rôle.
- Le transport transitoire `x-sb-token` a été conservé pour ne pas casser le fallback localStorage, mais son ajout global à `fetch` vérifie désormais l'origine exacte via `new URL(...).origin`. Un appel vers une origine externe, y compris une URL protocol-relative (`//...`), ne reçoit plus le jeton.


## 8. Contrôle Supabase distant en lecture seule — 18 novembre 2026

Projet vérifié : `shifa health` (`dxngxejuxeghsdafkkjp`, région `eu-west-3`).

- Le ledger distant contient 15 migrations ; ni le durcissement tenant de la PR #2 ni la migration de quotas IA de cette PR ne sont appliqués.
- Toutes les tables du schéma `public` ont RLS activé.
- Six politiques ont été relevées avec `USING (true)`. Deux sont dangereuses pour l'isolation tenant : `departments_org_read` et `org_modules_read`. Elles sont couvertes par la correction de la PR #2, désormais simplifiée pour supprimer ces politiques redondantes et conserver les policies SELECT déjà scoped.
- Les quatre policies `USING (true)` restantes concernent `funding_campaigns`, `health_services` et `marketplace_products` (rôle `public`), ainsi que `modules` (rôle `authenticated`). Elles doivent rester explicitement classées comme données de catalogue/publication approuvées ; ne pas y placer de données personnelles ou médicales.
- Les policies de `org_roles`, `subscriptions`, `tax_records` et `settlements` consultées utilisent des prédicats d'accès ; elles nécessitent tout de même des tests négatifs multi-tenant.
- Les Security Advisors signalent la protection contre les mots de passe compromis désactivée (avertissement à corriger dans les paramètres Auth). Le linter Performance remonte 214 index inutilisés et de nombreuses policies permissives redondantes ; ne pas supprimer les index sans mesures de charge, et consolider les policies après tests.
- Aucun SQL de modification n'a été exécuté sur le projet distant.

## 9. Lockfile CI

Le workflow génère désormais un `package-lock.json` à partir de `package.json`, publie ce fichier comme artefact GitHub Actions (rétention 7 jours), puis installe les dépendances avec `npm ci` avant audit, type-check, lint et build. Le lockfile n'est pas encore committé au dépôt : il devra être récupéré depuis l'artefact et relu avant ajout à la branche.


## 10. Correctif du module institutionnel — 19 novembre 2026

- Ajout du module serveur `institution` avec le modèle configuré par `SHIFA_AI_MODEL_INSTITUTION` et une autorisation limitée aux rôles `ministry` et `insurance`.
- Le prompt serveur impose l'analyse de données agrégées/anonymisées et interdit les dossiers médicaux individuels.
- L'écran institution transmet désormais `{ module: 'institution', messages }`, n'envoie plus de message `system` depuis le navigateur et lit le champ `output` renvoyé par l'API.
- Le middleware protège les écrans IA patient, professionnel, pharmacie, organisation, institution et workspace selon les rôles du profil serveur. L'accès institutionnel est limité à `ministry` et `insurance`.
- La validation TypeScript, ESLint, build et tests SQL doit être confirmée sur le dernier commit avant de considérer ce correctif terminé.
