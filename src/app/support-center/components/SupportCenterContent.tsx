'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

const tabs = ['Aide & FAQ', 'Tickets', 'Documentation', 'Tutoriels', 'Contact'];

const faqs = [
  { q: 'Comment démarrer une téléconsultation ?', a: 'Accédez au Lobby Téléconsultation depuis votre tableau de bord professionnel. Vérifiez votre caméra et microphone, puis cliquez sur "Démarrer la session" lorsque le patient est prêt.', category: 'Téléconsultation' },
  { q: 'Comment accéder au dossier patient pendant une consultation ?', a: 'Dans la session de consultation, cliquez sur l\'onglet "Dossier" dans le panneau latéral droit. Vous pouvez consulter l\'historique, les résultats et les prescriptions en temps réel.', category: 'Dossier patient' },
  { q: 'Comment générer une ordonnance électronique ?', a: 'Depuis l\'espace Prescriptions, cliquez sur "Nouvelle ordonnance", sélectionnez le patient, ajoutez les médicaments avec posologie, puis signez électroniquement avec votre code PIN.', category: 'Prescriptions' },
  { q: 'Comment configurer mes disponibilités ?', a: 'Accédez à Paramètres > Agenda > Disponibilités. Définissez vos plages horaires par jour de la semaine et activez/désactivez les créneaux selon vos besoins.', category: 'Agenda' },
  { q: 'Comment contacter le support technique ?', a: 'Vous pouvez ouvrir un ticket depuis cet espace Support, ou nous contacter directement par email à support@shifa.health ou par téléphone au +221 33 XXX XX XX.', category: 'Support' },
  { q: 'Comment exporter mes données patients ?', a: 'Dans Administration > Exports, sélectionnez la période et le format (PDF, CSV, HL7). Les exports sont chiffrés et conformes aux réglementations locales.', category: 'Données' },
];

const tickets = [
  { id: 'TKT-1847', subject: 'Problème de connexion vidéo en téléconsultation', status: 'Résolu', priority: 'Haute', date: '05/08/2026', statusColor: '#16a34a', statusBg: '#dcfce7' },
  { id: 'TKT-1831', subject: 'Ordonnance non reçue par la pharmacie', status: 'En cours', priority: 'Haute', date: '08/08/2026', statusColor: '#ca8a04', statusBg: '#fef9c3' },
  { id: 'TKT-1819', subject: 'Demande d\'ajout d\'un module spécialisé', status: 'Ouvert', priority: 'Normale', date: '09/08/2026', statusColor: '#0ea5e9', statusBg: '#e0f2fe' },
];

const docs = [
  { title: 'Guide de démarrage rapide', desc: 'Premiers pas avec SHIFA — configuration et prise en main', icon: 'RocketLaunchIcon', color: '#0ea5e9', pages: '24 pages' },
  { title: 'Manuel téléconsultation', desc: 'Guide complet pour les consultations vidéo et la gestion des sessions', icon: 'VideoCameraIcon', color: '#8b5cf6', pages: '38 pages' },
  { title: 'Gestion des dossiers patients', desc: 'Création, mise à jour et partage des dossiers médicaux électroniques', icon: 'FolderOpenIcon', color: '#10b981', pages: '52 pages' },
  { title: 'Prescriptions électroniques', desc: 'Rédaction, signature et transmission des ordonnances numériques', icon: 'DocumentCheckIcon', color: '#f59e0b', pages: '18 pages' },
  { title: 'Sécurité et confidentialité', desc: 'Protection des données patients, RGPD et conformité réglementaire', icon: 'ShieldCheckIcon', color: '#ef4444', pages: '30 pages' },
  { title: 'Interopérabilité HL7/FHIR', desc: 'Intégration avec les systèmes d\'information hospitaliers existants', icon: 'ArrowsRightLeftIcon', color: '#06b6d4', pages: '44 pages' },
];

const tutorials = [
  { title: 'Démarrer votre première téléconsultation', duration: '4:32', views: '2 847', icon: 'PlayCircleIcon', color: '#0ea5e9' },
  { title: 'Créer et signer une ordonnance électronique', duration: '3:15', views: '1 923', icon: 'PlayCircleIcon', color: '#10b981' },
  { title: 'Naviguer dans le dossier patient', duration: '6:48', views: '3 412', icon: 'PlayCircleIcon', color: '#8b5cf6' },
  { title: 'Configurer votre agenda et disponibilités', duration: '5:20', views: '1 247', icon: 'PlayCircleIcon', color: '#f59e0b' },
];

export default function SupportCenterContent() {
  const [activeTab, setActiveTab] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketBody, setTicketBody] = useState('');

  const filteredFaqs = faqs.filter(f =>
    f.q.toLowerCase().includes(search.toLowerCase()) ||
    f.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center justify-between" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #06b6d4, #0ea5e9)' }}>
            <Icon name="LifebuoyIcon" size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>Centre d'aide & Support</h1>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Documentation, tutoriels, tickets et assistance SHIFA</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Support disponible
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b px-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex gap-0">
          {tabs.map((tab, i) => (
            <button key={i} onClick={() => setActiveTab(i)}
              className="px-4 py-3 text-sm font-medium border-b-2 transition-colors"
              style={{ borderColor: activeTab === i ? '#06b6d4' : 'transparent', color: activeTab === i ? '#06b6d4' : 'var(--muted-foreground)' }}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Tab 0: FAQ */}
        {activeTab === 0 && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="relative">
              <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher dans l'aide..."
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border outline-none"
                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
            </div>
            <div className="space-y-2">
              {filteredFaqs.map((faq, i) => (
                <div key={i} className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-4 py-3.5 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#e0f2fe', color: '#0ea5e9' }}>{faq.category}</span>
                      <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{faq.q}</span>
                    </div>
                    <Icon name={openFaq === i ? 'ChevronUpIcon' : 'ChevronDownIcon'} size={16} className="text-muted-foreground shrink-0 ml-2" />
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4 text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)', borderTop: '1px solid var(--border)' }}>
                      <p className="pt-3">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 1: Tickets */}
        {activeTab === 1 && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Mes tickets de support</h2>
              <button onClick={() => setShowTicketForm(!showTicketForm)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#06b6d4' }}>
                <Icon name="PlusIcon" size={16} className="text-white" />
                Nouveau ticket
              </button>
            </div>
            {showTicketForm && (
              <div className="rounded-xl border p-4 space-y-3" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Ouvrir un ticket</h3>
                <input value={ticketSubject} onChange={e => setTicketSubject(e.target.value)}
                  placeholder="Sujet du problème..."
                  className="w-full text-sm px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
                <textarea value={ticketBody} onChange={e => setTicketBody(e.target.value)}
                  placeholder="Décrivez votre problème en détail..."
                  rows={4}
                  className="w-full text-sm px-3 py-2 rounded-lg border outline-none resize-none"
                  style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
                <div className="flex gap-2">
                  <button className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#06b6d4' }}>Envoyer</button>
                  <button onClick={() => setShowTicketForm(false)} className="px-4 py-2 rounded-lg text-sm font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>Annuler</button>
                </div>
              </div>
            )}
            {tickets.map(t => (
              <div key={t.id} className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold" style={{ color: '#06b6d4' }}>{t.id}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: t.statusBg, color: t.statusColor }}>{t.status}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: t.priority === 'Haute' ? '#fee2e2' : 'var(--muted)', color: t.priority === 'Haute' ? '#dc2626' : 'var(--muted-foreground)' }}>{t.priority}</span>
                    </div>
                    <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{t.subject}</p>
                  </div>
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{t.date}</span>
                </div>
                <button className="text-xs" style={{ color: '#06b6d4' }}>Voir les détails →</button>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Documentation */}
        {activeTab === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {docs.map((doc, i) => (
              <div key={i} className="rounded-xl border p-4 hover:shadow-md transition-shadow cursor-pointer" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: doc.color + '20' }}>
                  <Icon name={doc.icon as any} size={22} style={{ color: doc.color }} />
                </div>
                <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--foreground)' }}>{doc.title}</h3>
                <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{doc.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{doc.pages}</span>
                  <button className="flex items-center gap-1.5 text-xs font-medium" style={{ color: doc.color }}>
                    <Icon name="ArrowDownTrayIcon" size={13} />Télécharger
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Tutoriels */}
        {activeTab === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tutorials.map((t, i) => (
              <div key={i} className="rounded-xl border overflow-hidden hover:shadow-md transition-shadow cursor-pointer" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="h-32 flex items-center justify-center" style={{ backgroundColor: t.color + '15' }}>
                  <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: t.color }}>
                    <Icon name="PlayIcon" size={24} className="text-white" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>{t.title}</h3>
                  <div className="flex items-center justify-between text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    <span className="flex items-center gap-1"><Icon name="ClockIcon" size={12} />{t.duration}</span>
                    <span className="flex items-center gap-1"><Icon name="EyeIcon" size={12} />{t.views} vues</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Contact */}
        {activeTab === 4 && (
          <div className="max-w-xl mx-auto space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Email support', value: 'support@shifa.health', icon: 'EnvelopeIcon', color: '#0ea5e9' },
                { label: 'Téléphone', value: '+221 33 XXX XX XX', icon: 'PhoneIcon', color: '#10b981' },
                { label: 'Chat en direct', value: 'Disponible 8h–20h', icon: 'ChatBubbleLeftRightIcon', color: '#8b5cf6' },
              ].map((c, i) => (
                <div key={i} className="rounded-xl border p-4 text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: c.color + '20' }}>
                    <Icon name={c.icon as any} size={18} style={{ color: c.color }} />
                  </div>
                  <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--foreground)' }}>{c.label}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border p-5 space-y-3" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Envoyer un message</h3>
              <input placeholder="Votre nom" className="w-full text-sm px-3 py-2 rounded-lg border outline-none" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
              <input placeholder="Sujet" className="w-full text-sm px-3 py-2 rounded-lg border outline-none" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
              <textarea placeholder="Votre message..." rows={4} className="w-full text-sm px-3 py-2 rounded-lg border outline-none resize-none" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
              <button className="w-full py-2.5 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#06b6d4' }}>Envoyer le message</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
