'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

const tabs = ['Vue d\'ensemble', 'Diagnostic IA', 'Analyse d\'images', 'Synthèse clinique', 'Historique IA'];

const aiTools = [
  {
    id: 1,
    name: 'Aide au diagnostic',
    description: 'Analyse des symptômes et suggestion de diagnostics différentiels basée sur les données cliniques du patient.',
    icon: 'MagnifyingGlassCircleIcon',
    color: '#0ea5e9',
    bg: '#e0f2fe',
    status: 'Actif',
    accuracy: '94.2%',
    uses: 1847,
  },
  {
    id: 2,
    name: 'Analyse d\'imagerie',
    description: 'Détection automatique d\'anomalies sur radiographies, IRM, et scanners avec rapport structuré.',
    icon: 'PhotoIcon',
    color: '#8b5cf6',
    bg: '#ede9fe',
    status: 'Actif',
    accuracy: '91.7%',
    uses: 632,
  },
  {
    id: 3,
    name: 'Synthèse de dossier',
    description: 'Résumé automatique du dossier patient avec mise en évidence des points critiques et tendances.',
    icon: 'DocumentTextIcon',
    color: '#10b981',
    bg: '#d1fae5',
    status: 'Actif',
    accuracy: '97.1%',
    uses: 3201,
  },
  {
    id: 4,
    name: 'Prédiction de risques',
    description: 'Évaluation du risque de complications, réhospitalisation, et détérioration clinique.',
    icon: 'ChartBarIcon',
    color: '#f59e0b',
    bg: '#fef3c7',
    status: 'Bêta',
    accuracy: '88.4%',
    uses: 289,
  },
  {
    id: 5,
    name: 'Prescription intelligente',
    description: 'Vérification des interactions médicamenteuses et suggestions posologiques adaptées au profil patient.',
    icon: 'ClipboardDocumentCheckIcon',
    color: '#ef4444',
    bg: '#fee2e2',
    status: 'Actif',
    accuracy: '99.1%',
    uses: 5412,
  },
  {
    id: 6,
    name: 'Traduction médicale',
    description: 'Traduction et simplification des termes médicaux pour la communication patient.',
    icon: 'LanguageIcon',
    color: '#06b6d4',
    bg: '#cffafe',
    status: 'Bêta',
    accuracy: '95.8%',
    uses: 741,
  },
];

const recentAnalyses = [
  { id: 1, patient: 'Aïcha Diallo', type: 'Diagnostic IA', result: 'Pneumonie bactérienne probable (87%)', time: 'Il y a 12 min', status: 'Validé', statusColor: '#16a34a', statusBg: '#dcfce7' },
  { id: 2, patient: 'Moussa Traoré', type: 'Analyse imagerie', result: 'Opacité pulmonaire droite détectée', time: 'Il y a 34 min', status: 'En attente', statusColor: '#ca8a04', statusBg: '#fef9c3' },
  { id: 3, patient: 'Fatou Ndiaye', type: 'Synthèse dossier', result: 'Diabète type 2 mal équilibré — HbA1c ↑', time: 'Il y a 1h', status: 'Validé', statusColor: '#16a34a', statusBg: '#dcfce7' },
  { id: 4, patient: 'Ibrahima Sow', type: 'Prédiction risques', result: 'Risque réhospitalisation 30j: 23%', time: 'Il y a 2h', status: 'Revu', statusColor: '#64748b', statusBg: '#f1f5f9' },
  { id: 5, patient: 'Mariama Bah', type: 'Prescription IA', result: 'Interaction détectée: Warfarine + AINS', time: 'Il y a 3h', status: 'Alerte', statusColor: '#dc2626', statusBg: '#fee2e2' },
];

const kpis = [
  { label: 'Analyses aujourd\'hui', value: '47', icon: 'CpuChipIcon', color: '#0ea5e9' },
  { label: 'Précision moyenne', value: '94.6%', icon: 'CheckCircleIcon', color: '#10b981' },
  { label: 'Alertes critiques', value: '3', icon: 'ExclamationTriangleIcon', color: '#ef4444' },
  { label: 'Temps économisé', value: '2h 18m', icon: 'ClockIcon', color: '#8b5cf6' },
];

const chatMessages = [
  { role: 'user', text: 'Patient de 58 ans, diabétique, se plaint de douleurs thoraciques irradiant vers le bras gauche depuis 2h.' },
  { role: 'ai', text: 'Sur la base des symptômes décrits, les diagnostics différentiels prioritaires sont :\n\n1. **Syndrome coronarien aigu (SCA)** — probabilité élevée (78%)\n   - Douleur typique angineuse avec irradiation\n   - Facteur de risque: diabète\n   - Action immédiate: ECG 12 dérivations, troponines, aspirine 300mg\n\n2. **Dissection aortique** — à exclure (12%)\n   - Douleur thoracique aiguë\n   - Recommandation: angio-TDM si ECG normal\n\n3. **Péricardite aiguë** — moins probable (6%)\n\n⚠️ Recommandation: Orientation urgences cardiologiques immédiate.' },
];

export default function ShifaAIWorkspaceContent() {
  const [activeTab, setActiveTab] = useState(0);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState(chatMessages);
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    if (!chatInput.trim()) return;
    const userMsg = { role: 'user', text: chatInput };
    setMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setLoading(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'ai',
        text: 'Analyse en cours... Sur la base des informations fournies, voici mon évaluation clinique structurée avec les recommandations diagnostiques et thérapeutiques adaptées au contexte africain.',
      }]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center justify-between" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)' }}>
            <Icon name="CpuChipIcon" size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>SHIFA AI Workspace</h1>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Intelligence artificielle médicale — Aide à la décision clinique</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            IA opérationnelle
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b px-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex gap-0">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className="px-4 py-3 text-sm font-medium border-b-2 transition-colors"
              style={{
                borderColor: activeTab === i ? 'var(--shifa-blue)' : 'transparent',
                color: activeTab === i ? 'var(--shifa-blue)' : 'var(--muted-foreground)',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Tab 0: Vue d'ensemble */}
        {activeTab === 0 && (
          <div className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {kpis.map((k, i) => (
                <div key={i} className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: k.color + '20' }}>
                      <Icon name={k.icon as any} size={16} style={{ color: k.color }} />
                    </div>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{k.label}</span>
                  </div>
                  <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{k.value}</p>
                </div>
              ))}
            </div>

            {/* AI Tools Grid */}
            <div>
              <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Outils IA disponibles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {aiTools.map(tool => (
                  <div key={tool.id} className="rounded-xl p-4 border hover:shadow-md transition-shadow cursor-pointer" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: tool.bg }}>
                        <Icon name={tool.icon as any} size={20} style={{ color: tool.color }} />
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{
                        backgroundColor: tool.status === 'Actif' ? '#dcfce7' : '#fef9c3',
                        color: tool.status === 'Actif' ? '#16a34a' : '#ca8a04',
                      }}>{tool.status}</span>
                    </div>
                    <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--foreground)' }}>{tool.name}</h3>
                    <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{tool.description}</p>
                    <div className="flex items-center justify-between text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      <span>Précision: <strong style={{ color: tool.color }}>{tool.accuracy}</strong></span>
                      <span>{tool.uses.toLocaleString()} utilisations</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent analyses */}
            <div>
              <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Analyses récentes</h2>
              <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--muted)' }}>
                      <th className="text-left px-4 py-2.5 text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Patient</th>
                      <th className="text-left px-4 py-2.5 text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Type</th>
                      <th className="text-left px-4 py-2.5 text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Résultat</th>
                      <th className="text-left px-4 py-2.5 text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Heure</th>
                      <th className="text-left px-4 py-2.5 text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAnalyses.map((a, i) => (
                      <tr key={a.id} style={{ borderBottom: i < recentAnalyses.length - 1 ? '1px solid var(--border)' : 'none' }}>
                        <td className="px-4 py-3 font-medium text-xs" style={{ color: 'var(--foreground)' }}>{a.patient}</td>
                        <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{a.type}</td>
                        <td className="px-4 py-3 text-xs max-w-xs truncate" style={{ color: 'var(--foreground)' }}>{a.result}</td>
                        <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{a.time}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: a.statusBg, color: a.statusColor }}>{a.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Diagnostic IA — Chat interface */}
        {activeTab === 1 && (
          <div className="flex flex-col h-full max-w-3xl mx-auto" style={{ minHeight: '500px' }}>
            <div className="rounded-xl border overflow-hidden flex flex-col" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', height: '520px' }}>
              <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)' }}>
                  <Icon name="CpuChipIcon" size={14} className="text-white" />
                </div>
                <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Assistant diagnostic SHIFA AI</span>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>GPT-4 Medical</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {m.role === 'ai' && (
                      <div className="w-7 h-7 rounded-full flex items-center justify-center mr-2 shrink-0 mt-1" style={{ background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)' }}>
                        <Icon name="CpuChipIcon" size={13} className="text-white" />
                      </div>
                    )}
                    <div
                      className="max-w-lg rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line"
                      style={{
                        backgroundColor: m.role === 'user' ? 'var(--shifa-blue)' : 'var(--muted)',
                        color: m.role === 'user' ? '#fff' : 'var(--foreground)',
                        borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      }}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center mr-2 shrink-0" style={{ background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)' }}>
                      <Icon name="CpuChipIcon" size={13} className="text-white" />
                    </div>
                    <div className="rounded-xl px-4 py-3" style={{ backgroundColor: 'var(--muted)' }}>
                      <div className="flex gap-1">
                        {[0, 1, 2].map(d => (
                          <div key={d} className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--muted-foreground)', animationDelay: `${d * 0.15}s` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-3 border-t flex gap-2" style={{ borderColor: 'var(--border)' }}>
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Décrivez les symptômes, antécédents, résultats d'examens..."
                  className="flex-1 text-sm px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                />
                <button
                  onClick={handleSend}
                  disabled={!chatInput.trim() || loading}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity disabled:opacity-50"
                  style={{ backgroundColor: 'var(--shifa-blue)' }}
                >
                  <Icon name="PaperAirplaneIcon" size={16} className="text-white" />
                </button>
              </div>
            </div>
            <p className="text-xs text-center mt-3" style={{ color: 'var(--muted-foreground)' }}>
              ⚠️ L'IA est un outil d'aide à la décision. Le diagnostic final reste sous la responsabilité du médecin.
            </p>
          </div>
        )}

        {/* Tab 2: Analyse d'images */}
        {activeTab === 2 && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="rounded-xl border p-6 text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderStyle: 'dashed' }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#ede9fe' }}>
                <Icon name="PhotoIcon" size={32} style={{ color: '#8b5cf6' }} />
              </div>
              <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Déposer une image médicale</h3>
              <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>Radiographie, IRM, scanner, échographie — formats DICOM, JPEG, PNG</p>
              <button className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#8b5cf6' }}>
                Sélectionner un fichier
              </button>
            </div>
            <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Dernière analyse — Radiographie thoracique</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg overflow-hidden" style={{ backgroundColor: '#0f172a', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="text-center">
                    <Icon name="PhotoIcon" size={40} className="text-slate-600 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">Image DICOM</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#fee2e2' }}>
                    <p className="text-xs font-semibold mb-1" style={{ color: '#dc2626' }}>⚠️ Anomalie détectée</p>
                    <p className="text-xs" style={{ color: '#7f1d1d' }}>Opacité lobaire supérieure droite — compatible avec pneumonie ou néoplasie</p>
                  </div>
                  <div className="space-y-1.5">
                    {[['Confiance IA', '91.7%'], ['Modèle', 'ChestNet-v3'], ['Temps d\'analyse', '2.3s']].map(([k, v]) => (
                      <div key={k} className="flex justify-between text-xs">
                        <span style={{ color: 'var(--muted-foreground)' }}>{k}</span>
                        <span className="font-medium" style={{ color: 'var(--foreground)' }}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-2 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                    Générer rapport complet
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Synthèse clinique */}
        {activeTab === 3 && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Sélectionner un patient</h3>
              <div className="flex gap-2">
                <input
                  placeholder="Rechercher par nom ou ID patient..."
                  className="flex-1 text-sm px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                />
                <button className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                  Analyser
                </button>
              </div>
            </div>
            <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>Synthèse — Fatou Ndiaye</h3>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Générée le 10/08/2026 à 14h32 • Confiance: 97.1%</p>
                </div>
                <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                  <Icon name="ArrowDownTrayIcon" size={13} />
                  Exporter
                </button>
              </div>
              {[
                { title: '🔴 Points critiques', content: 'HbA1c à 9.2% (objectif < 7%) — déséquilibre glycémique persistant depuis 6 mois. Microalbuminurie positive (42 mg/24h) — début de néphropathie diabétique.', bg: '#fee2e2', color: '#7f1d1d' },
                { title: '📋 Résumé clinique', content: 'Patiente de 52 ans, diabétique type 2 depuis 8 ans, sous metformine 1g×2/j + glibenclamide 5mg. Hypertension artérielle associée (traitée). Dernière consultation: 15/07/2026.', bg: 'var(--muted)', color: 'var(--foreground)' },
                { title: '💊 Recommandations thérapeutiques', content: '1. Intensification du traitement antidiabétique — envisager insulinothérapie basale\n2. Contrôle tensionnel renforcé (cible < 130/80 mmHg)\n3. Bilan rénal complet dans 1 mois\n4. Consultation ophtalmologique (fond d\'œil)', bg: '#e0f2fe', color: '#0c4a6e' },
              ].map((s, i) => (
                <div key={i} className="rounded-lg p-3 mb-3 text-xs leading-relaxed whitespace-pre-line" style={{ backgroundColor: s.bg, color: s.color }}>
                  <p className="font-semibold mb-1">{s.title}</p>
                  <p>{s.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Historique IA */}
        {activeTab === 4 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Historique des analyses IA</h2>
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>12 847 analyses ce mois</span>
            </div>
            {recentAnalyses.concat(recentAnalyses).map((a, i) => (
              <div key={i} className="rounded-xl border p-4 flex items-center justify-between" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--muted)' }}>
                    <Icon name="CpuChipIcon" size={16} style={{ color: 'var(--shifa-blue)' }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{a.patient}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{a.type} • {a.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-xs max-w-xs truncate hidden md:block" style={{ color: 'var(--muted-foreground)' }}>{a.result}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: a.statusBg, color: a.statusColor }}>{a.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
