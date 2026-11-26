import Link from 'next/link';

export default function AccessDeniedPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12" style={{ backgroundColor: 'var(--background)' }}>
      <section className="w-full max-w-lg rounded-2xl border p-8 text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>Accès non autorisé</h1>
        <p className="text-sm leading-6 mb-7" style={{ color: 'var(--muted-foreground)' }}>
          Votre compte ne dispose pas actuellement des autorisations nécessaires pour accéder à cet espace. Si vous pensez qu'il s'agit d'une erreur, contactez l'administrateur SHIFA de votre établissement.
        </p>
        <Link href="/" className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
          Retour à l'accueil
        </Link>
      </section>
    </main>
  );
}
