# SHIFA — réconciliation du schéma Supabase

**État : préparation uniquement — aucune migration appliquée à la base distante.**

Ce dossier décrit les écarts observés lors du contrôle metadata-only du projet Supabase `dxngxejuxeghsdafkkjp` le 19 novembre 2026. Aucun contenu clinique n'a été consulté.

## Résultats observés

- PostgreSQL distant : 17.11.0.003.
- Ledger distant relevé : 16 entrées.
- Tables `public` : 64 ; RLS activé sur 64 ; RLS forcé sur 0.
- Policies `public` : 257 (249 permissives, 191 ciblant le rôle `PUBLIC`).
- Droits visibles sur 64 relations pour `authenticated` : SELECT/INSERT/UPDATE/DELETE ; pour `service_role` : privilèges étendus. Ces chiffres décrivent les ACL SQL, pas l'accès effectif après RLS.
- `anon` conserve SELECT sur quatre tables : `availability_slots`, `funding_campaigns`, `health_services`, `marketplace_products`. Le maintien de ces droits doit être justifié par la publication volontaire des données et les policies associées.
- Les fonctions `SECURITY DEFINER`, leurs ACL, `search_path`, triggers et policies ont été inventoriés. Voir `../tests/schema_reconciliation_metadata.sql`.

## Écart de ledger bloquant

Le ledger distant contient la version :

`20261118225231_shifa_revoke_excess_table_privileges`

Le fichier SQL correspondant n'est pas présent dans la branche de travail ni dans `main` au moment de l'audit. Les recherches GitHub de nom, timestamp et expression REVOKE n'ont pas permis de retrouver le contenu original.

**Ne pas créer un fichier vide ou supposé équivalent sous ce timestamp. Ne pas exécuter `supabase migration repair` et ne pas lancer `supabase db push` tant que le contenu d'origine n'est pas retrouvé ou remplacé par une procédure de réconciliation approuvée et vérifiée.**

Un état actuel d'ACL peut être observé, mais il ne permet pas de prouver quel SQL exact a été exécuté dans le passé. Le présent document ne prétend donc pas reconstituer le contenu de cette migration.

## Autres limites de la source

- La CI PostgreSQL du dépôt utilise un socle synthétique pour certaines structures historiques. Elle valide les migrations et assertions contre ce socle, mais ne constitue pas une copie fidèle du schéma de production.
- La migration `20261119006500_notifications_foundation.sql` rencontre une table `notifications` déjà existante en production selon l'inspection précédente ; son origine historique doit être documentée dans le schéma de référence.
- Les contrôles locaux/CI ne remplacent pas une comparaison complète des colonnes, types, defaults, contraintes, index, fonctions, triggers, ACL, policies et objets Storage du projet distant.

## Procédure avant toute migration de production

1. Exporter un snapshot de schéma sans données cliniques et le conserver comme artefact de revue.
2. Comparer ce snapshot aux migrations historiques versionnées et aux versions du ledger.
3. Récupérer la migration manquante depuis une sauvegarde fiable, un artefact CI, un poste développeur ou un historique externe. Vérifier son hash et son contenu.
4. Si elle est irrécupérable, écrire une migration corrective nouvelle, idempotente et explicite, fondée sur les ACL cibles revues objet par objet. Ne pas réutiliser le timestamp historique pour un SQL reconstruit.
5. Vérifier les droits minimaux nécessaires à chaque rôle et les parcours fonctionnels avec tests négatifs/positifs.
6. Valider toutes les migrations sur une instance PostgreSQL jetable et un staging représentatif avant toute opération de production.
7. Préparer sauvegarde, fenêtre de maintenance, observabilité et plan de retour arrière. Les changements de permissions doivent avoir un plan de restauration documenté.
8. Seulement après revue et autorisation explicite, appliquer les migrations dans l'ordre validé.

## Décisions de sécurité

- Ne pas supprimer les 214 index signalés comme inutilisés sans mesure d'usage et analyse des requêtes.
- Ne pas convertir globalement les 249 policies permissives ni supprimer les policies `PUBLIC` sans analyser leurs rôles, commandes et expressions.
- RLS activé n'est pas équivalent à RLS forcé. Étudier les cas où `FORCE ROW LEVEL SECURITY` est pertinent, en tenant compte des propriétaires, fonctions privilégiées et chemins d'administration.
- Ne jamais exposer de dossiers patients ni pièces médicales pendant les contrôles de schéma.
- Maintenir cette PR en brouillon jusqu'à la validation du schéma réel et de la CI complète.


## Inventaire complémentaire du schéma distant — 19/11/2026

Un second relevé metadata-only a confirmé les volumes suivants :

| Objet | Nombre |
|---|---:|
| Colonnes dans les tables publiques | 994 |
| Contraintes | 585 |
| Index | 295 |
| Triggers | 25 |
| Fonctions dans `public` et `private` | 35 |
| Policies RLS | 257 |

Les inventaires détaillés des colonnes, contraintes, index, fonctions, triggers, politiques et ACL sont disponibles dans les requêtes de `../tests/schema_reconciliation_metadata.sql` et `acl-review.sql`. Les résultats complets doivent être exportés en artefacts de comparaison lors de l'exécution sur une base de référence et un staging.

## Problème d'ordre des migrations

Le fichier de branche `20261118220000_shifa_ai_rate_limits.sql` porte un timestamp antérieur à la version distante déjà enregistrée `20261118225231`. Il est donc potentiellement considéré comme une migration locale en retard par rapport au ledger distant. Les migrations suivantes `20261118233000` et `20261119...` sont postérieures.

**Ne pas supposer que la migration antérieure peut être poussée sans impact.** Il faut d'abord déterminer si son contenu est entièrement absent du projet distant, si des objets équivalents existent déjà et si son application est sûre/idempotente. Aucun réordonnancement de fichier ni réparation de ledger ne doit être effectué sans cette preuve.


## Vérification de présence des objets des migrations en attente — 19/11/2026

Contrôle metadata-only ciblé du schéma distant :

| Objet | Présent |
|---|---|
| `private.shifa_ai_rate_limits` | Non |
| `public.consume_shifa_ai_rate_limit()` | Non |
| `public.notifications` | Oui |
| `public.registration_applications` | Non |
| `public.professional_invitations` | Non |

Interprétation limitée : l'absence des deux objets de quota confirme que la migration de quota n'est pas déjà matérialisée sous ces noms dans le schéma interrogé. Les tables de candidatures et d'invitations sont également absentes. La table `notifications` existe déjà, ce qui confirme le risque de collision de la migration de fondation correspondante. Il faut comparer les définitions complètes avant de conclure à une équivalence ou à une incompatibilité.

Ce contrôle ne prouve pas qu'aucune fonction ou table alternative ne fournit une logique équivalente. Il ne constitue pas une autorisation d'exécution.
