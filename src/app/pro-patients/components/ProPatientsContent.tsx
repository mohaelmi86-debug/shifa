'use client';
import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { createClient } from '@/lib/supabase/client';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  lastVisit: string;
  nextRdv: string | null;
  condition: string;
  status: 'stable' | 'suivi' | 'urgent';
  avatar: string;
  phone: string;
}

const statusConfig = {
  stable: { label: 'Stable', color: 'var(--shifa-green)', bg: 'rgba(16, 185, 129, 0.1)' },
  suivi: { label: 'Suivi actif', color: 'var(--shifa-amber)', bg: 'rgba(245, 158, 11, 0.1)' },
  urgent: { label: 'Urgent', color: 'var(--shifa-red)', bg: 'rgba(239, 68, 68, 0.1)' },
};

function calcAge(dob: string | null): number {
  if (!dob) return 0;
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function ProPatientsContent() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'stable' | 'suivi' | 'urgent'>('all');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const supabase = createClient();

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      setError('');
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setError('Non authentifié'); setLoading(false); return; }

        // Get professional record for current user
        const { data: proData } = await supabase
          .from('professionals')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!proData) {
          setError('Profil professionnel introuvable.');
          setLoading(false);
          return;
        }

        // Get appointments for this professional with patient info
        const { data: appts, error: apptError } = await supabase
          .from('appointments')
          .select(`
            id,
            scheduled_at,
            status,
            reason,
            patient_id,
            patients (
              id,
              first_name,
              last_name,
              date_of_birth,
              gender,
              phone,
              blood_type
            )
          `)
          .eq('professional_id', proData.id)
          .order('scheduled_at', { ascending: false });

        if (apptError) {
          console.log('Appointments fetch error:', apptError.message);
          setError('Erreur lors du chargement des patients.');
          setLoading(false);
          return;
        }

        // Deduplicate by patient_id and build patient list
        const seen = new Set<string>();
        const patientMap: Record<string, { lastVisit: string; nextRdv: string | null }> = {};

        (appts || []).forEach((appt: any) => {
          const pid = appt.patient_id;
          if (!pid) return;
          const isUpcoming = new Date(appt.scheduled_at) > new Date() && appt.status === 'scheduled';
          const isPast = new Date(appt.scheduled_at) <= new Date();

          if (!patientMap[pid]) {
            patientMap[pid] = { lastVisit: '—', nextRdv: null };
          }
          if (isPast && appt.status !== 'cancelled') {
            const d = formatDate(appt.scheduled_at);
            if (patientMap[pid].lastVisit === '—') patientMap[pid].lastVisit = d;
          }
          if (isUpcoming && !patientMap[pid].nextRdv) {
            patientMap[pid].nextRdv = formatDate(appt.scheduled_at);
          }
        });

        const uniquePatients: Patient[] = [];
        (appts || []).forEach((appt: any) => {
          const p = appt.patients;
          if (!p || seen.has(p.id)) return;
          seen.add(p.id);

          let age = calcAge(p.date_of_birth);
          const meta = patientMap[p.id] || { lastVisit: '—', nextRdv: null };

          uniquePatients.push({
            id: p.id,
            name: `${p.first_name} ${p.last_name}`,
            age,
            gender: p.gender === 'female' ? 'F' : p.gender === 'male' ? 'M' : '?',
            lastVisit: meta.lastVisit,
            nextRdv: meta.nextRdv,
            condition: p.blood_type ? `Groupe ${p.blood_type}` : 'Suivi général',
            status: 'stable',
            avatar: `${p.first_name?.[0] || ''}${p.last_name?.[0] || ''}`,
            phone: p.phone || '—',
          });
        });

        setPatients(uniquePatients);
      } catch (err: any) {
        setError(err.message || 'Erreur inattendue.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const filtered = patients.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.condition.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Mes Patients</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            {loading ? 'Chargement...' : `${patients.length} patient${patients.length !== 1 ? 's' : ''} enregistré${patients.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button className="btn-primary text-sm px-4 py-2.5">
          <Icon name="UserPlusIcon" size={16} />
          Nouveau patient
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total patients', value: patients.length, icon: 'UsersIcon', color: 'var(--shifa-blue)' },
          { label: 'Stables', value: patients.filter(p => p.status === 'stable').length, icon: 'CheckCircleIcon', color: 'var(--shifa-green)' },
          { label: 'Suivi actif', value: patients.filter(p => p.status === 'suivi').length, icon: 'ClockIcon', color: 'var(--shifa-amber)' },
          { label: 'Urgents', value: patients.filter(p => p.status === 'urgent').length, icon: 'ExclamationCircleIcon', color: 'var(--shifa-red)' },
        ].map((kpi) => (
          <div key={kpi.label} className="card-base flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${kpi.color}15` }}>
              <Icon name={kpi.icon as any} size={20} style={{ color: kpi.color } as React.CSSProperties} className="" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: kpi.color }}>{loading ? '—' : kpi.value}</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-48">
          <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher un patient..."
            className="input-field pl-9 w-full text-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'stable', 'suivi', 'urgent'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
              style={{
                backgroundColor: statusFilter === s ? 'var(--shifa-blue)' : 'var(--card)',
                borderColor: statusFilter === s ? 'var(--shifa-blue)' : 'var(--border)',
                color: statusFilter === s ? 'white' : 'var(--muted-foreground)',
              }}
            >
              {s === 'all' ? 'Tous' : statusConfig[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl p-4 mb-4 border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
          <p className="text-sm" style={{ color: 'var(--shifa-red)' }}>{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="ml-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>Chargement des patients...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Icon name="UsersIcon" size={40} className="text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold" style={{ color: 'var(--foreground)' }}>Aucun patient trouvé</p>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            {patients.length === 0 ? 'Vous n\'avez pas encore de patients enregistrés.' : 'Essayez une autre recherche.'}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: 'var(--muted)' }}>
                {['Patient', 'Âge', 'Dernière visite', 'Prochain RDV', 'Condition', 'Statut', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, idx) => {
                const st = statusConfig[p.status];
                return (
                  <tr
                    key={p.id}
                    className="border-t transition-colors hover:bg-muted/30 cursor-pointer"
                    style={{ borderColor: 'var(--border)', backgroundColor: idx % 2 === 0 ? 'var(--card)' : 'transparent' }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
                          {p.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{p.name}</p>
                          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--foreground)' }}>{p.age > 0 ? `${p.age} ans` : '—'} <span style={{ color: 'var(--muted-foreground)' }}>({p.gender})</span></td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>{p.lastVisit}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: p.nextRdv ? 'var(--shifa-blue)' : 'var(--muted-foreground)' }}>{p.nextRdv || '—'}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--foreground)' }}>{p.condition}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: st.bg, color: st.color }}>{st.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                        <Icon name="ChevronRightIcon" size={14} className="text-muted-foreground" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
