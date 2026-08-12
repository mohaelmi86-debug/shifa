'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslations } from '@/lib/i18n';
import LanguageSelector from '@/components/ui/LanguageSelector';

type SettingsTab = 'profil' | 'securite' | 'notifications' | 'confidentialite' | 'accessibilite';

const tabLabels: Record<SettingsTab, string> = {
  profil: 'Profil',
  securite: 'Sécurité',
  notifications: 'Notifications',
  confidentialite: 'Confidentialité',
  accessibilite: 'Accessibilité',
};

const tabs: { key: SettingsTab; label: string; icon: string }[] = [
  { key: 'profil', label: tabLabels.profil, icon: 'UserCircleIcon' },
  { key: 'securite', label: tabLabels.securite, icon: 'LockClosedIcon' },
  { key: 'notifications', label: tabLabels.notifications, icon: 'BellIcon' },
  { key: 'confidentialite', label: tabLabels.confidentialite, icon: 'ShieldCheckIcon' },
  { key: 'accessibilite', label: tabLabels.accessibilite, icon: 'AdjustmentsHorizontalIcon' },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className="relative w-11 h-6 rounded-full transition-all duration-200 focus:outline-none shrink-0"
      style={{ backgroundColor: checked ? 'var(--shifa-blue)' : 'var(--border)' }}
    >
      <span
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200"
        style={{ left: checked ? '22px' : '4px' }}
      />
    </button>
  );
}

export default function PatientSettingsContent() {
  const { language } = useLanguage();
  const tr = getTranslations(language);
  const [activeTab, setActiveTab] = useState<SettingsTab>('profil');
  const [notifications, setNotifications] = useState({
    rdvEmail: true, rdvSms: true, resultats: true, messages: true, rappels: false, newsletter: false,
  });
  const [privacy, setPrivacy] = useState({
    partageAnonymise: false, statistiques: true, historique: true,
  });

  const toggleNotif = (key: keyof typeof notifications) =>
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  const togglePrivacy = (key: keyof typeof privacy) =>
    setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));

  const headerTitles: Record<string, string> = {
    fr: 'Paramètres du compte', en: 'Account Settings', es: 'Configuración de cuenta',
    pt: 'Configurações da conta', ar: 'إعدادات الحساب', zh: '账户设置',
  };
  const headerSubs: Record<string, string> = {
    fr: 'Gérez vos préférences et informations personnelles',
    en: 'Manage your preferences and personal information',
    es: 'Gestione sus preferencias e información personal',
    pt: 'Gerencie suas preferências e informações pessoais',
    ar: 'إدارة تفضيلاتك ومعلوماتك الشخصية',
    zh: '管理您的偏好和个人信息',
  };

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>{headerTitles[language] || headerTitles.fr}</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>{headerSubs[language] || headerSubs.fr}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{tr.language}:</span>
          <LanguageSelector compact={false} />
        </div>
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Sidebar tabs */}
        <div className="lg:w-56 shrink-0">
          <div className="card-base p-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 mb-0.5"
                style={{
                  backgroundColor: activeTab === tab.key ? 'var(--shifa-blue)' : 'transparent',
                  color: activeTab === tab.key ? 'white' : 'var(--foreground)',
                }}
              >
                <Icon name={tab.icon as any} size={17} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeTab === 'profil' && (
            <div className="card-base">
              <h2 className="text-base font-bold mb-5" style={{ color: 'var(--shifa-dark)' }}>Informations personnelles</h2>
              <div className="flex items-center gap-4 mb-6 pb-6 border-b" style={{ borderColor: 'var(--border)' }}>
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white shrink-0"
                  style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}
                >
                  AD
                </div>
                <div>
                  <p className="font-semibold" style={{ color: 'var(--foreground)' }}>Aïcha Diallo</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>SH-2-SN-2025-7K4D</p>
                  <button className="text-xs mt-1 font-semibold" style={{ color: 'var(--shifa-blue)' }}>Changer la photo</button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Prénom', value: 'Aïcha', type: 'text' },
                  { label: 'Nom', value: 'Diallo', type: 'text' },
                  { label: 'Date de naissance', value: '1990-03-15', type: 'date' },
                  { label: 'Téléphone', value: '+221 77 123 45 67', type: 'tel' },
                  { label: 'Email', value: 'aicha.diallo@email.com', type: 'email' },
                  { label: 'Ville', value: 'Dakar', type: 'text' },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--muted-foreground)' }}>{field.label}</label>
                    <input
                      type={field.type}
                      defaultValue={field.value}
                      className="w-full px-3 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2"
                      style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-5 flex justify-end">
                <button className="btn-primary px-6 py-2.5 text-sm">Enregistrer les modifications</button>
              </div>
            </div>
          )}

          {activeTab === 'securite' && (
            <div className="flex flex-col gap-4">
              <div className="card-base">
                <h2 className="text-base font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Changer le mot de passe</h2>
                <div className="flex flex-col gap-3 max-w-sm">
                  {['Mot de passe actuel', 'Nouveau mot de passe', 'Confirmer le nouveau mot de passe'].map((label) => (
                    <div key={label}>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--muted-foreground)' }}>{label}</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2.5 rounded-xl text-sm border focus:outline-none"
                        style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                      />
                    </div>
                  ))}
                  <button className="btn-primary px-6 py-2.5 text-sm mt-1 self-start">Mettre à jour</button>
                </div>
              </div>
              <div className="card-base">
                <h2 className="text-base font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Authentification à deux facteurs</h2>
                <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>2FA par SMS</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Recevez un code de vérification par SMS</p>
                  </div>
                  <Toggle checked onChange={() => {}} />
                </div>
              </div>
              <div className="card-base">
                <h2 className="text-base font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Sessions actives</h2>
                {[
                  { device: 'Chrome — Dakar, Sénégal', time: 'Actuellement actif', current: true },
                  { device: 'Safari — iPhone 14', time: 'Il y a 2 heures', current: false },
                ].map((session, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--muted)' }}>
                        <Icon name="ComputerDesktopIcon" size={17} className="text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{session.device}</p>
                        <p className="text-xs" style={{ color: session.current ? 'var(--shifa-green)' : 'var(--muted-foreground)' }}>{session.time}</p>
                      </div>
                    </div>
                    {!session.current && (
                      <button className="text-xs font-semibold" style={{ color: 'var(--shifa-red)' }}>Déconnecter</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card-base">
              <h2 className="text-base font-bold mb-5" style={{ color: 'var(--shifa-dark)' }}>Préférences de notifications</h2>
              <div className="flex flex-col gap-1">
                {[
                  { key: 'rdvEmail' as const, label: 'Rappels de rendez-vous (Email)', desc: 'Recevez un email 24h avant chaque RDV' },
                  { key: 'rdvSms' as const, label: 'Rappels de rendez-vous (SMS)', desc: 'Recevez un SMS 2h avant chaque RDV' },
                  { key: 'resultats' as const, label: 'Nouveaux résultats disponibles', desc: 'Soyez notifié quand vos résultats sont prêts' },
                  { key: 'messages' as const, label: 'Nouveaux messages', desc: 'Notifications pour les messages de vos médecins' },
                  { key: 'rappels' as const, label: 'Rappels de traitement', desc: 'Rappels pour la prise de médicaments' },
                  { key: 'newsletter' as const, label: 'Newsletter SHIFA', desc: 'Actualités santé et nouvelles fonctionnalités' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-3.5 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{item.label}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{item.desc}</p>
                    </div>
                    <Toggle checked={notifications[item.key]} onChange={() => toggleNotif(item.key)} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'confidentialite' && (
            <div className="card-base">
              <h2 className="text-base font-bold mb-5" style={{ color: 'var(--shifa-dark)' }}>Confidentialité & Données</h2>
              <div className="flex flex-col gap-1">
                {[
                  { key: 'partageAnonymise' as const, label: 'Partage de données anonymisées', desc: 'Contribuer à la recherche médicale de manière anonyme' },
                  { key: 'statistiques' as const, label: 'Statistiques d\'utilisation', desc: 'Aider à améliorer SHIFA en partageant votre usage' },
                  { key: 'historique' as const, label: 'Historique de navigation', desc: 'Conserver l\'historique de vos consultations de dossiers' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-3.5 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{item.label}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{item.desc}</p>
                    </div>
                    <Toggle checked={privacy[item.key]} onChange={() => togglePrivacy(item.key)} />
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-5 border-t" style={{ borderColor: 'var(--border)' }}>
                <p className="text-sm font-semibold mb-3" style={{ color: 'var(--shifa-dark)' }}>Gestion des données</p>
                <div className="flex flex-wrap gap-3">
                  <button className="btn-secondary text-sm px-4 py-2">
                    <Icon name="ArrowDownTrayIcon" size={15} />
                    Exporter mes données
                  </button>
                  <button className="text-sm px-4 py-2 rounded-xl font-semibold border transition-colors hover:bg-red-50" style={{ color: 'var(--shifa-red)', borderColor: 'var(--shifa-red)' }}>
                    Supprimer mon compte
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'accessibilite' && (
            <div className="card-base">
              <h2 className="text-base font-bold mb-5" style={{ color: 'var(--shifa-dark)' }}>Accessibilité</h2>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--muted-foreground)' }}>Taille du texte</label>
                  <div className="flex gap-2">
                    {['Petit', 'Normal', 'Grand', 'Très grand'].map((size, i) => (
                      <button
                        key={size}
                        className="px-3 py-2 rounded-xl text-sm font-medium border transition-all"
                        style={{
                          backgroundColor: i === 1 ? 'var(--shifa-blue)' : 'var(--background)',
                          color: i === 1 ? 'white' : 'var(--foreground)',
                          borderColor: i === 1 ? 'var(--shifa-blue)' : 'var(--border)',
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--muted-foreground)' }}>Langue de l'interface</label>
                  <select
                    className="px-3 py-2.5 rounded-xl text-sm border focus:outline-none"
                    style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  >
                    <option>Français</option>
                    <option>English</option>
                    <option>Wolof</option>
                    <option>Arabe</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
