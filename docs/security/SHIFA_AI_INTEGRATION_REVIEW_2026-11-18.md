# SHIFA HEALTH — audit d'intégration SHIFA AI (contrat frontend/API)

Date : 2026-11-18  
Dépôt : `mohaelmi86-debug/shifa`  
Branche examinée : `main`  
Méthode : inspection statique ciblée du handler IA, du client IA partagé et des écrans patient/pro/organisation. Aucun appel au fournisseur IA n'a été effectué.

## Résumé exécutif

La revue a trouvé une incohérence fonctionnelle directe entre le contrat de l'API et plusieurs écrans SHIFA AI.

Le handler `src/app/api/ai/chat-completion/route.ts` exige `provider`, `model` et `messages`. Or les écrans patient, professionnel et organisation inspectés envoient uniquement `messages`. Ils ne transmettent ni `provider` ni `model`.

Conséquence prévisible : le handler répond HTTP 400 `Missing required fields` pour ces requêtes. Cela doit être confirmé par un test local, mais le défaut découle directement des champs lus et des corps JSON construits dans le code.

## A-011 — Contrat API incompatible avec les écrans SHIFA AI

Fichiers :
- `src/app/api/ai/chat-completion/route.ts`
- `src/app/shifa-ai-patient/components/ShifaAIPatientContent.tsx`
- `src/app/shifa-ai-pro/components/ShifaAIProContent.tsx`
- `src/app/shifa-ai-org/components/ShifaAIOrgContent.tsx`

Comportement serveur :
- déstructure `provider`, `model`, `messages` ;
- renvoie 400 si `provider` ou `model` manque, ou si `messages` est vide.

Comportement frontend observé :
- les écrans patient, professionnel et organisation envoient un objet JSON contenant `messages` seulement ;
- aucun fournisseur ou modèle n'est transmis dans ces trois appels examinés.

Impact :
- les trois parcours ne satisfont pas le contrat serveur et devraient recevoir 400 ;
- les écrans patient et professionnel ne vérifient pas `response.ok` avant de traiter le JSON, ce qui peut transformer une erreur serveur en réponse conversationnelle vide ou trompeuse ;
- les formats de réponse sont traités différemment selon les écrans : certains attendent `data.content`, tandis que l'écran organisation cherche aussi `choices[0].message.content`.

Priorité : P1 fonctionnelle, à traiter conjointement avec les contrôles P0 de sécurité de l'API.

Remédiation :
1. Définir un contrat unique, typé et versionné pour les requêtes et réponses IA.
2. Ne pas laisser les écrans patients choisir le fournisseur ou le modèle. Le serveur doit sélectionner le modèle autorisé selon le module et les droits.
3. Définir des profils serveur distincts (patient, professionnel, organisation) et une allowlist de modèles/fonctionnalités.
4. Normaliser toutes les réponses vers un format interne stable, par exemple `{ requestId, output, usage, status }`, sans exposer les détails du fournisseur.
5. Les écrans doivent vérifier `response.ok`, afficher un message d'erreur générique et ne pas traiter un HTTP 400 comme une réponse IA valide.
6. Ajouter des tests de contrat pour chacun des écrans et du streaming.

## A-012 — Risque de mélange des contextes IA

Les écrans patient, professionnel et organisation utilisent le même endpoint et transmettent un prompt système différent depuis le navigateur.

Analyse :
- le prompt système envoyé par le client n'est pas une frontière de sécurité ;
- un client peut modifier ce prompt ou choisir une autre instruction ;
- le rôle réel, l'organisation, le niveau d'accès et les capacités autorisées doivent être déterminés côté serveur à partir de la session et des autorisations ;
- un écran organisation ne doit pas pouvoir obtenir des fonctions professionnelles ou des informations cliniques en changeant le JSON.

Remédiation :
- supprimer la confiance dans les prompts système envoyés par le client ;
- associer chaque module à un profil de prompt serveur non modifiable par le navigateur ;
- déterminer le module autorisé par route ou paramètre enum validé, puis vérifier côté serveur que le rôle possède ce module ;
- ne jamais joindre automatiquement des dossiers médicaux ou données personnelles au prompt ; toute donnée clinique doit passer par une vérification de relation de soins, minimisation, journalisation et politique de conservation dédiée ;
- traiter les réponses IA comme non fiables et exiger validation humaine pour toute action clinique ou opérationnelle.

Priorité : P0/P1 selon les données que l'IA pourra recevoir.

## A-013 — Contrat de réponse et gestion d'erreur incohérents

Fichiers :
- `src/app/api/ai/chat-completion/route.ts`
- `src/app/shifa-ai-patient/components/ShifaAIPatientContent.tsx`
- `src/app/shifa-ai-pro/components/ShifaAIProContent.tsx`
- `src/app/shifa-ai-org/components/ShifaAIOrgContent.tsx`
- `src/lib/ai/aiClient.ts`
- `src/lib/ai/chatCompletion.ts`

Constats :
- la route renvoie directement le résultat brut du SDK en mode non-streaming ;
- les écrans patient/professionnel cherchent principalement `data.content` ;
- l'écran organisation sait aussi lire `choices[0].message.content` ;
- les clients streaming traitent des erreurs SSE et journalisent leurs détails.

Risque :
- comportement utilisateur incohérent selon le module ;
- erreurs de fournisseur potentiellement exposées dans l'interface ou les logs ;
- absence de contrat unique qui rende difficile l'audit des quotas, de l'usage et de la traçabilité.

Remédiation :
- introduire une couche d'adaptation fournisseur -> réponse interne ;
- retourner un identifiant de requête et un code d'erreur public stable ;
- garder les détails techniques exclusivement côté serveur, avec filtrage des données sensibles ;
- tester les réponses non-streaming et streaming pour tous les modules.

Priorité : P1.

## Décision technique recommandée

Ne pas ajouter de valeur par défaut arbitraire dans le navigateur. Le fournisseur, le modèle, le prompt système et les quotas doivent être contrôlés par le serveur.

Avant une correction exécutable, confirmer les fournisseurs/modèles effectivement configurés et les quotas métier attendus. Les secrets ne doivent pas être demandés dans une conversation ni committés dans GitHub. Ils doivent être configurés dans l'environnement de déploiement.

## Limites

- Les appels réseau IA n'ont pas été exécutés.
- Aucun test de navigateur ou de build n'a été lancé.
- Les variables d'environnement et secrets n'ont pas été consultés.
- Aucun changement de code, de base, de configuration ou de déploiement n'a été effectué.
