'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Result {
  id: string;
  patient: string;
  avatar: string;
  date: string;
  type: string;
  category: string;
  status: 'normal' | 'abnormal' | 'critical' | 'pending';
  values: { label: string; value: string; unit: string; ref: string; flag?: 'high' | 'low' }[];
}

const results: Result[] = [
  {
    id: 'r1', patient: 'Aïcha Diallo', avatar: 'AD', date: '08/08/2026', type: 'Bilan glycémique', category: 'Biologie',
    status: 'normal',
    values: [
      { label: 'Glycémie à jeun', value: '5.8', unit: 'mmol/L', ref: '3.9–6.1' },
      { label: 'HbA1c', value: '6.2', unit: '%', ref: '< 7.0' },
    ],
  },
  {
    id: 'r2', patient: 'Kwame Asante', avatar: 'KA', date: '05/08/2026', type: 'Bilan cardiaque', category: 'Biologie',
    status: 'abnormal',
    values: [
      { label: 'BNP', value: '450', unit: 'pg/mL', ref: '< 100', flag: 'high' },
      { label: 'Troponine', value: '0.04', unit: 'ng/mL', ref: '< 0.04' },
      { label: 'Créatinine', value: '142', unit: 'µmol/L', ref: '62–106', flag: 'high' },
    ],
  },
  {
    id: 'r3', patient: 'Pierre Dubois', avatar: 'PD', date: '10/08/2026', type: 'Spirométrie', category: 'Fonctionnel',
    status: 'critical',
    values: [
      { label: 'VEMS', value: '42', unit: '%', ref: '> 80', flag: 'low' },
      { label: 'CVF', value: '68', unit: '%', ref: '> 80', flag: 'low' },
      { label: 'VEMS/CVF', value: '0.58', unit: '', ref: '> 0.70', flag: 'low' },
    ],
  },
  {
    id: 'r4', patient: 'Fatima Ouédraogo', avatar: 'FO', date: '09/08/2026', type: 'NFS complète', category: 'Biologie',
    status: 'abnormal',
    values: [
      { label: 'Hémoglobine', value: '8.2', unit: 'g/dL', ref: '12–16', flag: 'low' },
      { label: 'VGM', value: '68', unit: 'fL', ref: '80–100', flag: 'low' },
      { label: 'Ferritine', value: '4', unit: 'µg/L', ref: '12–150', flag: 'low' },
    ],
  },
  {
    id: 'r5', patient: 'Alioune Badara Cissé', avatar: 'AC', date: '06/08/2026', type: 'Bilan lipidique', category: 'Biologie',
    status: 'pending',
    values: [],
  },
];

const statusConfig = {
  normal: { label: 'Normal', color: 'var(--shifa-green)', bg: 'rgba(16, 185, 129, 0.1)' },
  abnormal: { label: 'Anormal', color: 'var(--shifa-amber)', bg: 'rgba(245, 158, 11, 0.1)' },
  critical: { label: 'Critique', color: 'var(--shifa-red)', bg: 'rgba(239, 68, 68, 0.1)' },
  pending: { label: 'En attente', color: 'var(--muted-foreground)', bg: 'var(--muted)' },
};

export default function ProResultatsContent() {
  const [selected, setSelected] = useState<string>('r1');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = ['all', ...new Set(results.map(r => r.category))];
  const filtered = results.filter(r => categoryFilter === 'all' || r.category === categoryFilter);
  const activeResult = results.find(r => r.id === selected);

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Résultats & Biologie</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            <span className="font-semibold" style={{ color: 'var(--shifa-red)' }}>{results.filter(r => r.status === 'critical').length}</span> résultat(s) critique(s) à traiter
          </p>
        </div>
        <div className="flex items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className="px-3 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{
                backgroundColor: categoryFilter === cat ? 'var(--shifa-blue)' : 'var(--card)',
                color: categoryFilter === cat ? 'white' : 'var(--muted-foreground)',
                border: `1px solid ${categoryFilter === cat ? 'var(--shifa-blue)' : 'var(--border)'}`,
              }}
            >
              {cat === 'all' ? 'Tous' : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* List */}
        <div className="xl:col-span-1 flex flex-col gap-3">
          {filtered.map((result) => {
            const st = statusConfig[result.status];
            return (
              <button
                key={result.id}
                onClick={() => setSelected(result.id)}
                className="card-base text-left transition-all w-full"
                style={{ border: `2px solid ${selected === result.id ? 'var(--shifa-blue)' : 'var(--border)'}` }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}
                  >
                    {result.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold truncate" style={{ color: 'var(--foreground)' }}>{result.patient}</p>
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold shrink-0" style={{ backgroundColor: st.bg, color: st.color }}>
                        {st.label}
                      </span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{result.type}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{result.date} — {result.category}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail */}
        <div className="xl:col-span-2">
          {activeResult ? (
            <div className="card-base">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2 className="text-base font-bold" style={{ color: 'var(--shifa-dark)' }}>{activeResult.type}</h2>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{activeResult.patient} — {activeResult.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="btn-secondary text-xs px-3 py-2">
                    <Icon name="PrinterIcon" size={13} />
                    Imprimer
                  </button>
                  <button className="btn-secondary text-xs px-3 py-2">
                    <Icon name="ShareIcon" size={13} />
                    Partager
                  </button>
                </div>
              </div>

              {activeResult.values.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        {['Paramètre', 'Valeur', 'Unité', 'Référence', 'Interprétation'].map((h) => (
                          <th key={h} className="text-left pb-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {activeResult.values.map((val, i) => (
                        <tr key={i} className="border-b" style={{ borderColor: 'var(--border)' }}>
                          <td className="py-3 text-sm font-medium" style={{ color: 'var(--foreground)' }}>{val.label}</td>
                          <td className="py-3 text-sm font-bold" style={{ color: val.flag === 'high' ? 'var(--shifa-red)' : val.flag === 'low' ? 'var(--shifa-amber)' : 'var(--shifa-green)' }}>
                            {val.value}
                          </td>
                          <td className="py-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>{val.unit}</td>
                          <td className="py-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>{val.ref}</td>
                          <td className="py-3">
                            {val.flag ? (
                              <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: val.flag === 'high' ? 'var(--shifa-red)' : 'var(--shifa-amber)' }}>
                                <Icon name={val.flag === 'high' ? 'ArrowUpIcon' : 'ArrowDownIcon'} size={12} />
                                {val.flag === 'high' ? 'Élevé' : 'Bas'}
                              </span>
                            ) : (
                              <span className="text-xs font-semibold" style={{ color: 'var(--shifa-green)' }}>Normal</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12" style={{ color: 'var(--muted-foreground)' }}>
                  <Icon name="ClockIcon" size={32} className="mb-3 opacity-40" />
                  <p className="text-sm font-medium">Résultats en attente de réception</p>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
