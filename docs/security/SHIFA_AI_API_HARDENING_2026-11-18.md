# SHIFA HEALTH — remédiation API SHIFA AI (lot 1)

Date : 2026-11-18  
Branche : `security/shifa-ai-api-hardening`  
Base : `main`  
Nature : durcissement applicatif incrémental ; aucun changement Supabase ni déploiement.

## 1. Changements réalisés

- L'endpoint `POST /api/ai/chat-completion` exige désormais une session Supabase validée côté serveur avec `auth.getUser()`.
- Le profil est relu depuis `user_profiles` côté serveur ; le compte doit exister et avoir `is_active = true`.
- Le module est limité à `patient`, `professional` ou `organization`.
- Matrice d'accès appliquée dans le handler :
  - `patient` → rôle `patient`
  - `professional` → rôle `professional`
  - `organization` → rôle `org_admin`
- Le prompt système est défini côté serveur ; les messages système fournis par le navigateur sont rejetés.
- Le navigateur ne choisit plus le fournisseur, le modèle, les clés, le streaming ni les paramètres arbitraires du SDK.
- Les limites de requête sont contrôlées : 32 Ko sur les octets réels du corps HTTP (indépendamment de l'en-tête Content-Length), 20 messages maximum, 8 000 caractères par message et 24 000 caractères cumulés.
- Les erreurs publiques sont normalisées et ne renvoient plus les détails bruts du fournisseur.
- Les trois écrans patient, professionnel et organisation utilisent le nouveau contrat `{ module, messages }` et lisent `output`. Ils vérifient `response.ok` avant d'afficher la réponse.
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
| `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` / `GEMINI_API_KEY` / `PERPLEXITY_API_KEY` | Clé serveur du fournisseur choisi |

Le handler renvoie `503 AI_SERVICE_NOT_CONFIGURED` si la configuration requise manque. Il ne bascule pas silencieusement sur un fournisseur ou un modèle de secours.

## 3. Bloqueurs avant exposition publique

**Ce lot n'est pas une autorisation de mise en production.**

1. **Rate limit et quotas atomiques absents** : le dépôt ne fournit pas encore de mécanisme distribué démontré par utilisateur et organisation. Il faut ajouter un stockage atomique partagé, des plafonds journaliers/mensuels, une limite de concurrence, un budget/coût maximum et un coupe-circuit avant exposition publique.
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

Critères de sortie : tests négatifs et positifs réussis, rate limiting distribué opérationnel, revue du mapping des rôles, test de build/type-check, et validation explicite avant déploiement.

## 5. Limites de vérification

- Changements committés sur une branche dédiée GitHub.
- Aucun build, lint, test automatisé, test navigateur ou appel fournisseur n'a été exécuté depuis cet environnement.
- Aucun secret, fichier `.env`, dossier patient, compte réel ou donnée Supabase n'a été consulté ou modifié.
- Aucun déploiement ni changement de production n'a été effectué.
