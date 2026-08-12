'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

const DEPLOYMENT_OPTIONS = [
  { id: 'national', label: 'Déploiement National', icon: 'GlobeAltIcon', color: '#2563eb', desc: 'Couverture nationale complète avec intégration systèmes de santé publique' },
  { id: 'regional', label: 'Déploiement Régional', icon: 'MapIcon', color: '#7c3aed', desc: 'Couverture d\'une ou plusieurs régions avec configuration locale' },
  { id: 'network', label: 'Réseau de Santé', icon: 'BuildingOffice2Icon', color: '#16a34a', desc: 'Réseau multi-établissements avec gouvernance centralisée' },
  { id: 'custom', label: 'Contrat Sur Mesure', icon: 'DocumentTextIcon', color: '#d97706', desc: 'Architecture et conditions entièrement personnalisées' },
];

const SLA_OPTIONS = [
  { level: 'Standard', uptime: '99.5%', support: 'Jours ouvrés', response: '48h', color: '#6b7280' },
  { level: 'Premium', uptime: '99.9%', support: '24/7', response: '4h', color: '#2563eb' },
  { level: 'Enterprise', uptime: '99.95%', support: '24/7 dédié', response: '1h', color: '#7c3aed' },
  { level: 'Mission Critical', uptime: '99.99%', support: 'Équipe dédiée', response: '15min', color: '#d97706' },
];

const SERVICES = [
  { name: 'Implémentation & déploiement', icon: 'RocketLaunchIcon' },
  { name: 'Migration de données', icon: 'ArrowsRightLeftIcon' },
  { name: 'Intégration systèmes existants', icon: 'PuzzlePieceIcon' },
  { name: 'Formation équipes', icon: 'AcademicCapIcon' },
  { name: 'Support technique dédié', icon: 'LifebuoyIcon' },
  { name: 'Audit & conformité réglementaire', icon: 'ShieldCheckIcon' },
  { name: 'Personnalisation modules', icon: 'Cog6ToothIcon' },
  { name: 'Reporting & analytics avancés', icon: 'ChartBarIcon' },
];

const ACTORS = [
  { label: 'Ministère / Autorité de santé', icon: 'BuildingLibraryIcon' },
  { label: 'Réseau hospitalier national', icon: 'BuildingOffice2Icon' },
  { label: 'Assurance nationale / Mutuelle', icon: 'ShieldCheckIcon' },
  { label: 'Université / École de médecine', icon: 'AcademicCapIcon' },
  { label: 'ONG / Organisation humanitaire', icon: 'HeartIcon' },
  { label: 'Entreprise santé au travail', icon: 'BriefcaseIcon' },
];

export default function EnterpriseContactContent() {
  const [formData, setFormData] = useState({
    orgName: '', orgType: '', country: '', population: '', facilities: '', users: '',
    modules: [] as string[], deployment: '', sla: '', message: '', contact: '', email: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-6 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-96 text-center space-y-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#dcfce7' }}>
          <Icon name="CheckCircleIcon" size={32} style={{ color: '#16a34a' }} />
        </div>
        <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Demande envoyée</h2>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>L'équipe SHIFA Enterprise vous contactera sous 48h ouvrées pour discuter de votre projet.</p>
        <button onClick={() => setSubmitted(false)} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: 'var(--muted)', color: 'var(--foreground)' }}>
          Nouvelle demande
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Enterprise & B2G — Contact</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Demande de devis, déploiement national, contrat personnalisé, SLA et services d'implémentation</p>
        </div>
        <span className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm" style={{ background: '#eff6ff', color: '#2563eb' }}>
          <Icon name="BuildingOffice2Icon" size={14} />
          Tarification sur devis uniquement
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="rounded-xl border p-6 space-y-5" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <h2 className="font-semibold text-base" style={{ color: 'var(--foreground)' }}>Demande de devis Enterprise</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--foreground)' }}>Organisation *</label>
                <input value={formData.orgName} onChange={e => setFormData(p => ({ ...p, orgName: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  placeholder="Nom de l'organisation" required />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--foreground)' }}>Type d'organisation *</label>
                <select value={formData.orgType} onChange={e => setFormData(p => ({ ...p, orgType: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} required>
                  <option value="">Sélectionner...</option>
                  {ACTORS.map(a => <option key={a.label} value={a.label}>{a.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--foreground)' }}>Pays *</label>
                <input value={formData.country} onChange={e => setFormData(p => ({ ...p, country: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  placeholder="Pays de déploiement" required />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--foreground)' }}>Population cible estimée</label>
                <input value={formData.population} onChange={e => setFormData(p => ({ ...p, population: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  placeholder="ex. 500 000 patients" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--foreground)' }}>Nombre d'établissements</label>
                <input value={formData.facilities} onChange={e => setFormData(p => ({ ...p, facilities: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  placeholder="ex. 120 hôpitaux" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--foreground)' }}>Utilisateurs professionnels</label>
                <input value={formData.users} onChange={e => setFormData(p => ({ ...p, users: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  placeholder="ex. 5 000 professionnels" />
              </div>
            </div>

            {/* Deployment */}
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--foreground)' }}>Type de déploiement</label>
              <div className="grid grid-cols-2 gap-2">
                {DEPLOYMENT_OPTIONS.map(d => (
                  <button type="button" key={d.id} onClick={() => setFormData(p => ({ ...p, deployment: d.id }))}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border text-left text-xs transition-colors"
                    style={{ background: formData.deployment === d.id ? d.color + '18' : 'var(--background)', borderColor: formData.deployment === d.id ? d.color : 'var(--border)', color: 'var(--foreground)' }}>
                    <Icon name={d.icon as any} size={14} style={{ color: d.color }} />
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* SLA */}
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--foreground)' }}>Niveau SLA requis</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {SLA_OPTIONS.map(s => (
                  <button type="button" key={s.level} onClick={() => setFormData(p => ({ ...p, sla: s.level }))}
                    className="flex flex-col items-center px-2 py-3 rounded-lg border text-center transition-colors"
                    style={{ background: formData.sla === s.level ? s.color + '18' : 'var(--background)', borderColor: formData.sla === s.level ? s.color : 'var(--border)' }}>
                    <p className="text-xs font-semibold" style={{ color: s.color }}>{s.level}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{s.uptime}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Réponse {s.response}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--foreground)' }}>Nom du contact *</label>
                <input value={formData.contact} onChange={e => setFormData(p => ({ ...p, contact: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  placeholder="Prénom Nom" required />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--foreground)' }}>Email professionnel *</label>
                <input type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  placeholder="contact@organisation.gov" required />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--foreground)' }}>Description du projet</label>
              <textarea value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                rows={4} className="w-full px-3 py-2 rounded-lg border text-sm resize-none"
                style={{ background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                placeholder="Décrivez votre projet, vos besoins spécifiques, le calendrier envisagé..." />
            </div>

            <button type="submit" className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ background: 'var(--shifa-blue)' }}>
              Envoyer la demande de devis
            </button>
          </form>
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          <div className="rounded-xl border p-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--foreground)' }}>Services inclus</h3>
            <ul className="space-y-2">
              {SERVICES.map(s => (
                <li key={s.name} className="flex items-center gap-2 text-xs" style={{ color: 'var(--foreground)' }}>
                  <Icon name={s.icon as any} size={13} style={{ color: 'var(--shifa-blue)' }} />
                  {s.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border p-4" style={{ background: '#eff6ff', borderColor: '#bfdbfe' }}>
            <h3 className="font-semibold text-sm mb-2" style={{ color: '#1e40af' }}>Facteurs de tarification</h3>
            <ul className="space-y-1">
              {['Population couverte', 'Nombre d\'établissements', 'Modules activés', 'Intégrations requises', 'Niveau SLA', 'Pays & réglementation', 'Durée du contrat'].map(f => (
                <li key={f} className="text-xs flex items-center gap-1.5" style={{ color: '#1e40af' }}>
                  <div className="w-1 h-1 rounded-full bg-blue-400" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border p-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--foreground)' }}>Acteurs éligibles</h3>
            <ul className="space-y-1.5">
              {ACTORS.map(a => (
                <li key={a.label} className="flex items-center gap-2 text-xs" style={{ color: 'var(--foreground)' }}>
                  <Icon name={a.icon as any} size={12} style={{ color: 'var(--muted-foreground)' }} />
                  {a.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
