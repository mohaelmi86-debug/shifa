import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

const paths = [
  {
    key: 'path-etablissement',
    title: 'Je représente un',
    titleBold: 'ÉTABLISSEMENT',
    desc: 'Hôpital, clinique, laboratoire, pharmacie, université, ministère, assurance, ONG…',
    tags: ['Gestion', 'Organisation', 'Services'],
    icon: 'BuildingOffice2Icon',
    iconBg: 'linear-gradient(135deg, #0A1B3D, #0066FF)',
    iconColor: 'white',
    arrowBg: 'var(--shifa-blue)',
    border: 'var(--border)',
    href: '/sign-up-login-screen',
    tagColor: 'var(--shifa-blue)',
    tagBg: 'rgba(0, 102, 255, 0.08)',
  },
  {
    key: 'path-patient',
    title: 'Créer mon',
    titleBold: 'COMPTE',
    desc: 'Patient, citoyen, famille ou aidant. Accédez à vos services de santé et gérez vos informations.',
    tags: ['Dossier médical', 'Rendez-vous', 'Suivi'],
    icon: 'UserCircleIcon',
    iconBg: 'linear-gradient(135deg, #00B89A, #00F2C3)',
    iconColor: 'white',
    arrowBg: 'var(--shifa-green)',
    border: 'rgba(0, 242, 195, 0.3)',
    href: '/sign-up-login-screen',
    tagColor: '#00B89A',
    tagBg: 'rgba(0, 242, 195, 0.1)',
    note: 'Votre identité numérique SHIFA sera créée automatiquement lors de l\'inscription.',
    noteIcon: 'ShieldCheckIcon',
  },
  {
    key: 'path-professionnel',
    title: "Accéder à l\'ESPACE",
    titleBold: 'PROFESSIONNEL',
    desc: 'Médecin, soignant, pharmacien, kinésithérapeute, laboratoire…',
    tags: ['Soins', 'Collaboration', 'Outils'],
    icon: 'UserGroupIcon',
    iconBg: 'linear-gradient(135deg, #5B2D8E, #7B5EA7)',
    iconColor: 'white',
    arrowBg: 'var(--shifa-purple)',
    border: 'rgba(123, 94, 167, 0.25)',
    href: '/sign-up-login-screen',
    tagColor: 'var(--shifa-purple)',
    tagBg: 'rgba(123, 94, 167, 0.08)',
  },
];

export default function OnboardingPaths() {
  return (
    <div
      className="rounded-3xl p-6 lg:p-8 border shadow-shifa-lg"
      style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div
          className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}
        >
          <Icon name="UserGroupIcon" size={24} className="text-white" />
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--shifa-dark)' }}>
          Comment souhaitez-vous commencer ?
        </h2>
        <div className="w-10 h-0.5 mx-auto mb-3 rounded-full" style={{ backgroundColor: 'var(--shifa-blue)' }} />
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Chaque parcours est adapté à votre rôle.<br />
          Choisissez l'option qui vous correspond.
        </p>
      </div>

      {/* Path cards */}
      <div className="flex flex-col gap-4">
        {paths.map((path) => (
          <Link
            key={path.key}
            href={path.href}
            className="group block"
          >
            <div
              className="flex items-start gap-4 p-4 rounded-2xl border transition-all duration-200 hover:shadow-shifa hover:-translate-y-0.5"
              style={{ backgroundColor: 'var(--background)', borderColor: path.border }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: path.iconBg }}
              >
                <Icon name={path.icon as any} size={26} className="text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium mb-0.5" style={{ color: 'var(--muted-foreground)' }}>{path.title}</p>
                <p className="text-base font-extrabold mb-1.5" style={{ color: 'var(--shifa-dark)' }}>{path.titleBold}</p>
                <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--muted-foreground)' }}>{path.desc}</p>

                <div className="flex flex-wrap gap-1.5">
                  {path.tags.map((tag) => (
                    <span
                      key={`${path.key}-tag-${tag}`}
                      className="badge-base text-xs"
                      style={{ backgroundColor: path.tagBg, color: path.tagColor, border: `1px solid ${path.tagColor}20` }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {path.note && (
                  <div
                    className="flex items-start gap-2 mt-3 p-2.5 rounded-xl"
                    style={{ backgroundColor: 'rgba(0, 242, 195, 0.06)', border: '1px solid rgba(0, 242, 195, 0.2)' }}
                  >
                    <Icon name={path.noteIcon as any} size={14} style={{ color: 'var(--shifa-cyan)', flexShrink: 0, marginTop: '1px' } as any} className="" />
                    <p className="text-xs" style={{ color: '#00B89A' }}>
                      Votre identité numérique SHIFA sera <span className="font-semibold">créée automatiquement</span> lors de l'inscription.
                    </p>
                  </div>
                )}
              </div>

              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                style={{ backgroundColor: path.arrowBg }}
              >
                <Icon name="ChevronRightIcon" size={16} className="text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Login CTA */}
      <div className="mt-6 pt-5 border-t" style={{ borderColor: 'var(--border)' }}>
        <p className="text-center text-sm mb-3" style={{ color: 'var(--muted-foreground)' }}>
          Vous avez déjà un compte ?
        </p>
        <Link
          href="/sign-up-login-screen"
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 font-semibold text-sm transition-all duration-150 hover:bg-muted active:scale-95"
          style={{ borderColor: 'var(--shifa-blue)', color: 'var(--shifa-blue)' }}
        >
          <Icon name="LockClosedIcon" size={16} />
          Se connecter
        </Link>
        <p className="text-center text-xs mt-3" style={{ color: 'var(--muted-foreground)' }}>
          Besoin d'aide ?{' '}
          <a href="#" className="font-semibold transition-colors" style={{ color: 'var(--shifa-blue)' }}>
            Contactez le support
          </a>
        </p>
      </div>
    </div>
  );
}