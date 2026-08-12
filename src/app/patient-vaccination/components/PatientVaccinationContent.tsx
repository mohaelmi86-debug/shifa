'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Vaccine {
  id: string;
  name: string;
  date: string;
  nextDose?: string;
  lot: string;
  provider: string;
  status: 'done' | 'due' | 'overdue';
  doses: number;
  totalDoses: number;
}

interface VaccineFormData {
  name: string;
  customName: string;
  date: string;
  lot: string;
  provider: string;
  doses: string;
  totalDoses: string;
  nextDose: string;
  notes: string;
}

const VACCINE_LIST = [
  'COVID-19 (Pfizer-BioNTech)',
  'COVID-19 (Moderna)',
  'COVID-19 (AstraZeneca)',
  'COVID-19 (Johnson & Johnson)',
  'Grippe saisonnière',
  'Hépatite A',
  'Hépatite B',
  'Tétanos-Diphtérie-Coqueluche (DTP)',
  'Rougeole-Oreillons-Rubéole (ROR)',
  'Fièvre jaune',
  'Méningite A+C',
  'Méningite ACWY',
  'Pneumocoque',
  'Varicelle',
  'HPV (Papillomavirus)',
  'Rotavirus',
  'Poliomyélite',
  'BCG (Tuberculose)',
  'Rage',
  'Typhoïde',
  'Choléra',
  'Autre (préciser)',
];

const mockVaccines: Vaccine[] = [
  { id: '1', name: 'COVID-19 (Pfizer-BioNTech)', date: '15/03/2022', lot: 'EW0553', provider: 'CHU Saint-Louis', status: 'done', doses: 3, totalDoses: 3 },
  { id: '2', name: 'Grippe saisonnière', date: '10/10/2025', nextDose: '10/10/2026', lot: 'FL2025-44', provider: 'Dr. Mohamed Sy', status: 'due', doses: 1, totalDoses: 1 },
  { id: '3', name: 'Hépatite B', date: '05/01/2020', lot: 'HB-2020-12', provider: 'Centre de santé Médina', status: 'done', doses: 3, totalDoses: 3 },
  { id: '4', name: 'Tétanos-Diphtérie-Coqueluche', date: '20/06/2019', nextDose: '20/06/2029', lot: 'TDC-19-88', provider: 'Centre de santé Médina', status: 'done', doses: 1, totalDoses: 1 },
  { id: '5', name: 'Fièvre jaune', date: '12/04/2018', lot: 'FJ-2018-55', provider: 'Institut Pasteur Dakar', status: 'done', doses: 1, totalDoses: 1 },
  { id: '6', name: 'Méningite A+C', date: '—', nextDose: 'Recommandé', lot: '—', provider: '—', status: 'overdue', doses: 0, totalDoses: 1 },
];

const statusConfig = {
  done: { label: 'Complété', color: 'var(--shifa-cyan)', bg: 'rgba(0,242,195,0.1)', icon: 'CheckCircleIcon' },
  due: { label: 'Rappel prévu', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: 'ClockIcon' },
  overdue: { label: 'Recommandé', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', icon: 'ExclamationCircleIcon' },
};

export default function PatientVaccinationContent() {
  const [activeTab, setActiveTab] = useState<'history' | 'schedule' | 'certificates' | 'add'>('history');
  const [vaccines, setVaccines] = useState<Vaccine[]>(mockVaccines);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formData, setFormData] = useState<VaccineFormData>({
    name: '',
    customName: '',
    date: '',
    lot: '',
    provider: '',
    doses: '1',
    totalDoses: '1',
    nextDose: '',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<VaccineFormData>>({});

  const done = vaccines.filter(v => v.status === 'done').length;
  const due = vaccines.filter(v => v.status === 'due').length;
  const overdue = vaccines.filter(v => v.status === 'overdue').length;

  const validateForm = () => {
    const errors: Partial<VaccineFormData> = {};
    const vaccineName = formData.name === 'Autre (préciser)' ? formData.customName : formData.name;
    if (!vaccineName) errors.name = 'Le nom du vaccin est requis';
    if (!formData.date) errors.date = 'La date d\'administration est requise';
    if (!formData.provider) errors.provider = 'Le prestataire est requis';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    const vaccineName = formData.name === 'Autre (préciser)' ? formData.customName : formData.name;
    const dosesNum = parseInt(formData.doses) || 1;
    const totalDosesNum = parseInt(formData.totalDoses) || 1;
    const newVaccine: Vaccine = {
      id: Date.now().toString(),
      name: vaccineName,
      date: formData.date,
      lot: formData.lot || '—',
      provider: formData.provider,
      status: dosesNum >= totalDosesNum ? 'done' : 'due',
      doses: dosesNum,
      totalDoses: totalDosesNum,
      nextDose: formData.nextDose || undefined,
    };
    setVaccines(prev => [newVaccine, ...prev]);
    setFormSuccess(true);
    setFormData({ name: '', customName: '', date: '', lot: '', provider: '', doses: '1', totalDoses: '1', nextDose: '', notes: '' });
    setTimeout(() => {
      setFormSuccess(false);
      setActiveTab('history');
    }, 2000);
  };

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Vaccination</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Historique vaccinal, calendrier et certificats</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('add')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:shadow-sm"
            style={{ borderColor: 'var(--shifa-blue)', color: 'var(--shifa-blue)', backgroundColor: 'rgba(0,102,255,0.05)' }}
          >
            <Icon name="PlusIcon" size={16} />
            Saisir un vaccin
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}
          >
            <Icon name="DocumentArrowDownIcon" size={16} />
            Télécharger le carnet
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Vaccins complétés', value: done, icon: 'CheckCircleIcon', color: 'var(--shifa-cyan)' },
          { label: 'Rappels à venir', value: due, icon: 'ClockIcon', color: '#f59e0b' },
          { label: 'Recommandés', value: overdue, icon: 'ExclamationCircleIcon', color: '#ef4444' },
        ].map(stat => (
          <div key={stat.label} className="card-base p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${stat.color}18` }}>
              <Icon name={stat.icon as any} size={20} style={{ color: stat.color } as any} className="" />
            </div>
            <div>
              <p className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>{stat.value}</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl mb-6 w-fit" style={{ backgroundColor: 'var(--muted)' }}>
        {[
          { key: 'history', label: 'Historique', icon: 'ClockIcon' },
          { key: 'schedule', label: 'Calendrier', icon: 'CalendarDaysIcon' },
          { key: 'certificates', label: 'Certificats', icon: 'DocumentCheckIcon' },
          { key: 'add', label: 'Saisir un vaccin', icon: 'PlusCircleIcon' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              backgroundColor: activeTab === tab.key ? 'var(--card)' : 'transparent',
              color: activeTab === tab.key ? 'var(--shifa-blue)' : 'var(--muted-foreground)',
            }}
          >
            <Icon name={tab.icon as any} size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'history' && (
        <div className="flex flex-col gap-3">
          {vaccines.map(vaccine => {
            const st = statusConfig[vaccine.status];
            return (
              <div key={vaccine.id} className="card-base p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${st.color}18` }}>
                  <Icon name={st.icon as any} size={20} style={{ color: st.color } as any} className="" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{vaccine.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                        {vaccine.provider !== '—' ? `${vaccine.provider} · ` : ''}
                        {vaccine.date !== '—' ? `Administré le ${vaccine.date}` : 'Non administré'}
                        {vaccine.lot !== '—' ? ` · Lot : ${vaccine.lot}` : ''}
                      </p>
                    </div>
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
                      style={{ color: st.color, backgroundColor: st.bg }}
                    >
                      {st.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Doses :</p>
                      <div className="flex gap-1">
                        {Array.from({ length: vaccine.totalDoses }).map((_, i) => (
                          <div
                            key={i}
                            className="w-5 h-2 rounded-full"
                            style={{ backgroundColor: i < vaccine.doses ? 'var(--shifa-cyan)' : 'var(--border)' }}
                          />
                        ))}
                      </div>
                      <p className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>{vaccine.doses}/{vaccine.totalDoses}</p>
                    </div>
                    {vaccine.nextDose && (
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        Prochain rappel : <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{vaccine.nextDose}</span>
                      </p>
                    )}
                  </div>
                </div>
                {vaccine.status === 'done' && (
                  <button className="p-1.5 rounded-lg hover:bg-muted transition-colors shrink-0" title="Télécharger certificat">
                    <Icon name="ArrowDownTrayIcon" size={15} className="text-muted-foreground" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'schedule' && (
        <div className="card-base p-6">
          <h2 className="font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Calendrier vaccinal recommandé</h2>
          <div className="flex flex-col gap-3">
            {[
              { month: 'Octobre 2026', vaccine: 'Grippe saisonnière', type: 'Rappel annuel', urgent: true },
              { month: 'Juin 2029', vaccine: 'Tétanos-Diphtérie-Coqueluche', type: 'Rappel décennal', urgent: false },
              { month: 'Dès que possible', vaccine: 'Méningite A+C', type: 'Recommandé', urgent: true },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.urgent ? '#f59e0b' : 'var(--shifa-cyan)' }} />
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{item.vaccine}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.type}</p>
                </div>
                <span className="text-xs font-semibold" style={{ color: item.urgent ? '#f59e0b' : 'var(--shifa-cyan)' }}>{item.month}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'certificates' && (
        <div className="flex flex-col gap-3">
          {vaccines.filter(v => v.status === 'done').map(vaccine => (
            <div key={vaccine.id} className="card-base p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(0,102,255,0.08)' }}>
                <Icon name="DocumentCheckIcon" size={20} style={{ color: 'var(--shifa-blue)' } as any} className="" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Certificat — {vaccine.name}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Administré le {vaccine.date} · {vaccine.provider}</p>
              </div>
              <button
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:shadow-sm"
                style={{ borderColor: 'var(--shifa-blue)', color: 'var(--shifa-blue)', backgroundColor: 'rgba(0,102,255,0.05)' }}
              >
                <Icon name="ArrowDownTrayIcon" size={13} />
                Télécharger
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'add' && (
        <div className="max-w-2xl">
          <div className="card-base p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(0,102,255,0.08)' }}>
                <Icon name="PlusCircleIcon" size={20} style={{ color: 'var(--shifa-blue)' } as any} className="" />
              </div>
              <div>
                <h2 className="font-bold" style={{ color: 'var(--shifa-dark)' }}>Saisir un vaccin</h2>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Enregistrez un vaccin reçu dans votre carnet de santé</p>
              </div>
            </div>

            {formSuccess && (
              <div className="flex items-center gap-3 p-4 rounded-xl mb-5 border" style={{ backgroundColor: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.3)' }}>
                <Icon name="CheckCircleIcon" size={18} style={{ color: 'var(--shifa-green)' } as any} className="" />
                <p className="text-sm font-semibold" style={{ color: 'var(--shifa-green)' }}>Vaccin enregistré avec succès !</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Vaccine name */}
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>
                  Nom du vaccin <span style={{ color: 'var(--shifa-red)' }}>*</span>
                </label>
                <select
                  className="input-field w-full"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                >
                  <option value="">Sélectionner un vaccin...</option>
                  {VACCINE_LIST.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
                {formErrors.name && <p className="mt-1 text-xs font-medium" style={{ color: 'var(--shifa-red)' }}>{formErrors.name}</p>}
              </div>

              {formData.name === 'Autre (préciser)' && (
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>
                    Nom du vaccin (préciser) <span style={{ color: 'var(--shifa-red)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="input-field w-full"
                    placeholder="Ex: Vaccin contre la dengue"
                    value={formData.customName}
                    onChange={e => setFormData(prev => ({ ...prev, customName: e.target.value }))}
                  />
                </div>
              )}

              {/* Date + Provider */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>
                    Date d'administration <span style={{ color: 'var(--shifa-red)' }}>*</span>
                  </label>
                  <input
                    type="date"
                    className="input-field w-full"
                    value={formData.date}
                    onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  />
                  {formErrors.date && <p className="mt-1 text-xs font-medium" style={{ color: 'var(--shifa-red)' }}>{formErrors.date}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>
                    Prestataire / Centre de santé <span style={{ color: 'var(--shifa-red)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="input-field w-full"
                    placeholder="Ex: CHU de Dakar, Dr. Sy..."
                    value={formData.provider}
                    onChange={e => setFormData(prev => ({ ...prev, provider: e.target.value }))}
                  />
                  {formErrors.provider && <p className="mt-1 text-xs font-medium" style={{ color: 'var(--shifa-red)' }}>{formErrors.provider}</p>}
                </div>
              </div>

              {/* Lot + Doses */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Numéro de lot</label>
                  <input
                    type="text"
                    className="input-field w-full"
                    placeholder="Ex: EW0553"
                    value={formData.lot}
                    onChange={e => setFormData(prev => ({ ...prev, lot: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Dose reçue</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    className="input-field w-full"
                    value={formData.doses}
                    onChange={e => setFormData(prev => ({ ...prev, doses: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Total doses</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    className="input-field w-full"
                    value={formData.totalDoses}
                    onChange={e => setFormData(prev => ({ ...prev, totalDoses: e.target.value }))}
                  />
                </div>
              </div>

              {/* Next dose */}
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Date du prochain rappel (optionnel)</label>
                <input
                  type="date"
                  className="input-field w-full"
                  value={formData.nextDose}
                  onChange={e => setFormData(prev => ({ ...prev, nextDose: e.target.value }))}
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Notes / Observations (optionnel)</label>
                <textarea
                  className="input-field w-full resize-none"
                  rows={3}
                  placeholder="Réactions, remarques du médecin..."
                  value={formData.notes}
                  onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('history')}
                  className="flex-1 py-3 rounded-xl border text-sm font-semibold transition-all hover:bg-muted"
                  style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}
                >
                  <Icon name="CheckIcon" size={16} />
                  Enregistrer le vaccin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
