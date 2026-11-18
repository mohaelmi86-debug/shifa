import Link from 'next/link';

export default function RegistrationPendingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-5 py-12" style={{ background: 'var(--background)' }}>
      <section className="w-full max-w-xl rounded-2xl border p-8 text-center shadow-sm" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full" style={{ background: 'rgba(13, 148, 136, 0.12)', color: 'var(--shifa-green)' }}>
          <span aria-hidden="true" className="text-3xl">✓</span>
        </div>
        <p className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--shifa-blue)' }}>SHIFA Health OS</p>
        <h1 className="mb-3 text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Demande d’inscription enregistrée</h1>
        <p className="mb-4 text-sm leading-6" style={{ color: 'var(--muted-foreground)' }}>
          Votre dossier est transmis à l’équipe SHIFA pour vérification. Votre compte conserve un accès patient limité tant que votre identité professionnelle ou votre établissement n’a pas été validé.
        </p>
        <p className="mb-7 text-sm leading-6" style={{ color: 'var(--muted-foreground)' }}>
          Si la confirmation de votre adresse e-mail est demandée, veuillez consulter votre boîte de réception. Vous pourrez ensuite vous connecter pour suivre les prochaines étapes.
        </p>
        <Link href="/sign-up-login-screen" className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white" style={{ background: 'var(--shifa-blue)' }}>
          Retour à la connexion
        </Link>
      </section>
    </main>
  );
}
