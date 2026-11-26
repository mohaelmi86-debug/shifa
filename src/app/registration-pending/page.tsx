import Link from 'next/link';

export default function RegistrationPendingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12" style={{ backgroundColor: 'var(--background)' }}>
      <section className="w-full max-w-xl rounded-2xl border p-8 text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: 'rgba(0,184,154,0.1)', color: 'var(--shifa-green)' }}>
          <span className="text-2xl" aria-hidden="true">✓</span>
        </div>
        <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>Demande enregistrée</h1>
        <p className="text-sm leading-6 mb-4" style={{ color: 'var(--muted-foreground)' }}>
          Votre compte a été créé. Pour protéger les données de santé, les accès professionnels et institutionnels ne sont activés qu'après vérification des informations et validation par l'équipe habilitée de SHIFA.
        </p>
        <p className="text-sm leading-6 mb-7" style={{ color: 'var(--muted-foreground)' }}>
          Si la confirmation de votre adresse e-mail est demandée, veuillez d'abord utiliser le lien reçu par e-mail. Votre demande d'accès restera en attente jusqu'à la validation.
        </p>
        <Link href="/sign-up-login-screen" className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
          Retour à la connexion
        </Link>
      </section>
    </main>
  );
}
