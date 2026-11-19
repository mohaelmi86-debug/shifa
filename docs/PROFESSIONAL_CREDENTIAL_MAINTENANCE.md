# SHIFA — maintenance des justificatifs professionnels

Ce workflow prépare l'exécution quotidienne des deux RPC de maintenance, mais reste **désactivé par défaut**.

## Prérequis avant activation

1. Créer et valider une base de staging isolée.
2. Appliquer sur staging les migrations `20261119005000`, `20261119006000` et `20261119007000`, puis exécuter `supabase/tests/registration_applications_security.sql` et des scénarios de données synthétiques.
3. Vérifier les résultats métier : justificatif valide, expiration à J-30/J-15/J-7, expiration effective, plusieurs rattachements d'un même professionnel et absence de doublons.
4. Après validation et décision explicite de mise en service, configurer les secrets GitHub du dépôt :
   - `SUPABASE_URL` : URL HTTPS du projet ciblé.
   - `SUPABASE_SERVICE_ROLE_KEY` : clé service role du projet ciblé. Ne jamais la placer dans le code, les logs ou les variables publiques.
5. Définir la variable de dépôt `SHIFA_CREDENTIAL_MAINTENANCE_ENABLED=true` uniquement lorsque les trois migrations sont réellement présentes dans la base ciblée et que les secrets pointent vers ce même projet.

## Exécution

- Planification préparée : tous les jours à 06:17 UTC.
- Déclenchement manuel disponible via `workflow_dispatch`.
- Le job appelle d'abord `process_expired_professional_credentials`, puis `queue_professional_credential_expiry_reminders`.
- Les deux RPC sont appelées via HTTPS avec la clé service role, conservée dans les secrets GitHub et masquée par la plateforme.
- Si la variable d'activation n'est pas égale à `true`, le job est ignoré.
- Une erreur HTTP fait échouer le job ; aucune relance métier non contrôlée n'est effectuée.

## Limites

Ce workflow n'envoie aucun e-mail, SMS ou push. Il ne fait que suspendre les rattachements expirés et créer des notifications internes. Le workflow planifié ne s'exécutera sur la branche par défaut qu'après intégration de ce fichier à celle-ci. Il ne faut pas activer la variable avant validation staging et déploiement contrôlé des migrations.

## Destinataires des rappels

La file de rappels crée des notifications internes à J-30, J-15 et J-7 :

- pour le professionnel concerné, afin qu'il renouvelle son justificatif ;
- pour les administrateurs actifs (`user_profiles.role = org_admin`) rattachés au même `organization_id`, afin qu'ils puissent anticiper la vérification au sein de leur établissement.

Les notifications administratives sont isolées par établissement et possèdent une clé de déduplication propre à chaque destinataire. Le centre `/notifications-center` et le menu latéral des administrateurs d'établissement exposent ces alertes. Aucun administrateur d'un autre établissement n'est destinataire.
