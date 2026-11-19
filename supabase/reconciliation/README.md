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
