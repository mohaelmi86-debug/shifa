'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Department {
  id: string;
  name: string;
  code: string;
  head: string;
  floor: string;
  phone: string;
  status: 'actif' | 'inactif' | 'maintenance';
  staffCount: number;
  bedCount: number;
  color: string;
}

interface Service {
  id: string;
  name: string;
  department: string;
  type: 'consultation' | 'chirurgie' | 'diagnostic' | 'urgence' | 'soins';
  duration: number;
  price: number;
  available: boolean;
  description: string;
}

interface Bed {
  id: string;
  number: string;
  department: string;
  room: string;
  type: 'standard' | 'soins_intensifs' | 'isolement' | 'maternite' | 'pediatrie';
  status: 'disponible' | 'occupe' | 'maintenance' | 'reserve';
  patient?: string;
  equipment: string[];
  lastCleaned: string;
}

interface StaffAllocation {
  id: string;
  name: string;
  role: string;
  department: string;
  shift: 'matin' | 'apres-midi' | 'nuit' | 'garde';
  days: string[];
  status: 'present' | 'absent' | 'conge';
  phone: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const initialDepartments: Department[] = [
  { id: 'd1', name: 'Médecine interne', code: 'MED', head: 'Dr. Ibrahima Diallo', floor: 'Niveau 2', phone: '+221 33 820 01 01', status: 'actif', staffCount: 18, bedCount: 40, color: 'var(--shifa-blue)' },
  { id: 'd2', name: 'Chirurgie générale', code: 'CHI', head: 'Dr. Moussa Ndiaye', floor: 'Niveau 3', phone: '+221 33 820 01 02', status: 'actif', staffCount: 14, bedCount: 30, color: 'var(--shifa-purple)' },
  { id: 'd3', name: 'Pédiatrie', code: 'PED', head: 'Dr. Aminata Sow', floor: 'Niveau 1', phone: '+221 33 820 01 03', status: 'actif', staffCount: 12, bedCount: 25, color: 'var(--shifa-green)' },
  { id: 'd4', name: 'Maternité', code: 'MAT', head: 'Dr. Rokhaya Faye', floor: 'Niveau 1', phone: '+221 33 820 01 04', status: 'actif', staffCount: 10, bedCount: 20, color: 'var(--shifa-cyan)' },
  { id: 'd5', name: 'Réanimation', code: 'REA', head: 'Dr. Cheikh Ba', floor: 'Niveau 2', phone: '+221 33 820 01 05', status: 'actif', staffCount: 16, bedCount: 12, color: 'var(--shifa-red)' },
  { id: 'd6', name: 'Urgences', code: 'URG', head: 'Dr. Fatou Mbaye', floor: 'RDC', phone: '+221 33 820 01 06', status: 'actif', staffCount: 20, bedCount: 18, color: 'var(--shifa-amber)' },
  { id: 'd7', name: 'Cardiologie', code: 'CAR', head: 'Dr. Oumar Sarr', floor: 'Niveau 3', phone: '+221 33 820 01 07', status: 'maintenance', staffCount: 8, bedCount: 15, color: 'var(--shifa-blue)' },
];

const initialServices: Service[] = [
  { id: 's1', name: 'Consultation générale', department: 'Médecine interne', type: 'consultation', duration: 30, price: 5000, available: true, description: 'Consultation médicale standard' },
  { id: 's2', name: 'Consultation spécialisée', department: 'Cardiologie', type: 'consultation', duration: 45, price: 15000, available: true, description: 'Consultation cardiologique avec ECG' },
  { id: 's3', name: 'Appendicectomie', department: 'Chirurgie générale', type: 'chirurgie', duration: 90, price: 250000, available: true, description: 'Ablation chirurgicale de l\'appendice' },
  { id: 's4', name: 'Échographie abdominale', department: 'Médecine interne', type: 'diagnostic', duration: 20, price: 25000, available: true, description: 'Imagerie par ultrasons abdominale' },
  { id: 's5', name: 'Prise en charge urgence P1', department: 'Urgences', type: 'urgence', duration: 60, price: 0, available: true, description: 'Urgence vitale — prise en charge immédiate' },
  { id: 's6', name: 'Accouchement normal', department: 'Maternité', type: 'soins', duration: 240, price: 50000, available: true, description: 'Accouchement par voie basse assisté' },
  { id: 's7', name: 'Consultation pédiatrique', department: 'Pédiatrie', type: 'consultation', duration: 25, price: 5000, available: false, description: 'Consultation enfant 0–15 ans' },
];

const initialBeds: Bed[] = [
  { id: 'b1', number: 'MED-01', department: 'Médecine interne', room: 'Chambre 101', type: 'standard', status: 'occupe', patient: 'Oumar Diallo', equipment: ['Tensiomètre', 'Oxymètre'], lastCleaned: '2026-08-10' },
  { id: 'b2', number: 'MED-02', department: 'Médecine interne', room: 'Chambre 101', type: 'standard', status: 'disponible', equipment: ['Tensiomètre'], lastCleaned: '2026-08-10' },
  { id: 'b3', number: 'REA-01', department: 'Réanimation', room: 'Réa A', type: 'soins_intensifs', status: 'occupe', patient: 'Fatou Seck', equipment: ['Ventilateur', 'Moniteur cardiaque', 'Pompe à perfusion', 'Défibrillateur'], lastCleaned: '2026-08-10' },
  { id: 'b4', number: 'REA-02', department: 'Réanimation', room: 'Réa A', type: 'soins_intensifs', status: 'occupe', patient: 'Ibrahima Koné', equipment: ['Ventilateur', 'Moniteur cardiaque', 'Pompe à perfusion'], lastCleaned: '2026-08-09' },
  { id: 'b5', number: 'REA-03', department: 'Réanimation', room: 'Réa B', type: 'isolement', status: 'maintenance', equipment: ['Ventilateur', 'Moniteur cardiaque'], lastCleaned: '2026-08-08' },
  { id: 'b6', number: 'MAT-01', department: 'Maternité', room: 'Salle accouchement 1', type: 'maternite', status: 'disponible', equipment: ['Monitoring fœtal', 'Table d\'accouchement'], lastCleaned: '2026-08-10' },
  { id: 'b7', number: 'PED-01', department: 'Pédiatrie', room: 'Chambre P1', type: 'pediatrie', status: 'occupe', patient: 'Aïcha Diop (3 ans)', equipment: ['Oxymètre pédiatrique', 'Pompe à perfusion'], lastCleaned: '2026-08-10' },
  { id: 'b8', number: 'URG-01', department: 'Urgences', room: 'Box 1', type: 'standard', status: 'reserve', equipment: ['Défibrillateur', 'Moniteur', 'Chariot urgence'], lastCleaned: '2026-08-10' },
];

const initialStaff: StaffAllocation[] = [
  { id: 'st1', name: 'Dr. Ibrahima Diallo', role: 'Médecin chef', department: 'Médecine interne', shift: 'matin', days: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'], status: 'present', phone: '+221 77 100 01 01' },
  { id: 'st2', name: 'Infirmière Mariama Ba', role: 'Infirmière principale', department: 'Médecine interne', shift: 'matin', days: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'], status: 'present', phone: '+221 77 100 01 02' },
  { id: 'st3', name: 'Dr. Cheikh Ba', role: 'Réanimateur', department: 'Réanimation', shift: 'garde', days: ['Lun', 'Mer', 'Ven'], status: 'present', phone: '+221 77 100 01 03' },
  { id: 'st4', name: 'Infirmier Boubacar Sarr', role: 'Infirmier réa', department: 'Réanimation', shift: 'nuit', days: ['Mar', 'Jeu', 'Sam', 'Dim'], status: 'present', phone: '+221 77 100 01 04' },
  { id: 'st5', name: 'Dr. Fatou Mbaye', role: 'Urgentiste', department: 'Urgences', shift: 'apres-midi', days: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'], status: 'absent', phone: '+221 77 100 01 05' },
  { id: 'st6', name: 'Sage-femme Aïssatou Ndiaye', role: 'Sage-femme', department: 'Maternité', shift: 'matin', days: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'], status: 'present', phone: '+221 77 100 01 06' },
  { id: 'st7', name: 'Dr. Aminata Sow', role: 'Pédiatre', department: 'Pédiatrie', shift: 'matin', days: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'], status: 'conge', phone: '+221 77 100 01 07' },
  { id: 'st8', name: 'Infirmière Rokhaya Fall', role: 'Infirmière urgences', department: 'Urgences', shift: 'nuit', days: ['Sam', 'Dim', 'Lun'], status: 'present', phone: '+221 77 100 01 08' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const deptStatusConfig = {
  actif: { label: 'Actif', bg: 'rgba(16,185,129,0.10)', color: 'var(--shifa-green)' },
  inactif: { label: 'Inactif', bg: 'rgba(107,114,128,0.10)', color: 'var(--muted-foreground)' },
  maintenance: { label: 'Maintenance', bg: 'rgba(245,158,11,0.10)', color: 'var(--shifa-amber)' },
};

const bedStatusConfig = {
  disponible: { label: 'Disponible', bg: 'rgba(16,185,129,0.10)', color: 'var(--shifa-green)', dot: '#10b981' },
  occupe: { label: 'Occupé', bg: 'rgba(239,68,68,0.10)', color: 'var(--shifa-red)', dot: '#ef4444' },
  maintenance: { label: 'Maintenance', bg: 'rgba(245,158,11,0.10)', color: 'var(--shifa-amber)', dot: '#f59e0b' },
  reserve: { label: 'Réservé', bg: 'rgba(0,102,255,0.10)', color: 'var(--shifa-blue)', dot: '#0066ff' },
};

const bedTypeLabels: Record<string, string> = {
  standard: 'Standard',
  soins_intensifs: 'Soins intensifs',
  isolement: 'Isolement',
  maternite: 'Maternité',
  pediatrie: 'Pédiatrie',
};

const shiftConfig = {
  matin: { label: 'Matin (6h–14h)', bg: 'rgba(0,102,255,0.10)', color: 'var(--shifa-blue)' },
  'apres-midi': { label: 'Après-midi (14h–22h)', bg: 'rgba(123,94,167,0.10)', color: 'var(--shifa-purple)' },
  nuit: { label: 'Nuit (22h–6h)', bg: 'rgba(245,158,11,0.10)', color: 'var(--shifa-amber)' },
  garde: { label: 'Garde (24h)', bg: 'rgba(16,185,129,0.10)', color: 'var(--shifa-green)' },
};

const staffStatusConfig = {
  present: { label: 'Présent', bg: 'rgba(16,185,129,0.10)', color: 'var(--shifa-green)' },
  absent: { label: 'Absent', bg: 'rgba(239,68,68,0.10)', color: 'var(--shifa-red)' },
  conge: { label: 'En congé', bg: 'rgba(245,158,11,0.10)', color: 'var(--shifa-amber)' },
};

const serviceTypeConfig = {
  consultation: { label: 'Consultation', bg: 'rgba(0,102,255,0.10)', color: 'var(--shifa-blue)' },
  chirurgie: { label: 'Chirurgie', bg: 'rgba(239,68,68,0.10)', color: 'var(--shifa-red)' },
  diagnostic: { label: 'Diagnostic', bg: 'rgba(123,94,167,0.10)', color: 'var(--shifa-purple)' },
  urgence: { label: 'Urgence', bg: 'rgba(245,158,11,0.10)', color: 'var(--shifa-amber)' },
  soins: { label: 'Soins', bg: 'rgba(16,185,129,0.10)', color: 'var(--shifa-green)' },
};

// ─── Department Form Modal ────────────────────────────────────────────────────
function DepartmentModal({ dept, onClose, onSave }: { dept: Department | null; onClose: () => void; onSave: (d: Department) => void }) {
  const blank: Department = { id: `d${Date.now()}`, name: '', code: '', head: '', floor: '', phone: '', status: 'actif', staffCount: 0, bedCount: 0, color: 'var(--shifa-blue)' };
  const [form, setForm] = useState<Department>(dept ?? blank);
  const set = (k: keyof Department, v: string | number) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="rounded-2xl border w-full max-w-lg shadow-2xl" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h3 className="font-semibold text-base" style={{ color: 'var(--foreground)' }}>{dept ? 'Modifier le département' : 'Nouveau département'}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted"><Icon name="XMarkIcon" size={18} className="text-muted-foreground" /></button>
        </div>
        <div className="p-6 grid grid-cols-2 gap-4">
          {([
            ['name', 'Nom du département', 'text', 2],
            ['code', 'Code', 'text', 1],
            ['head', 'Médecin chef', 'text', 1],
            ['floor', 'Étage / Localisation', 'text', 1],
            ['phone', 'Téléphone', 'text', 1],
            ['bedCount', 'Nombre de lits', 'number', 1],
            ['staffCount', 'Effectif', 'number', 1],
          ] as [keyof Department, string, string, number][]).map(([key, label, type, span]) => (
            <div key={key} className={span === 2 ? 'col-span-2' : ''}>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>{label}</label>
              <input
                type={type}
                value={form[key] as string | number}
                onChange={e => set(key, type === 'number' ? Number(e.target.value) : e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2"
                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)', focusRingColor: 'var(--shifa-blue)' }}
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Statut</label>
            <select
              value={form.status}
              onChange={e => set('status', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
              style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
            >
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 pb-5">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-muted" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>Annuler</button>
          <button onClick={() => onSave(form)} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>Enregistrer</button>
        </div>
      </div>
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'departments', label: 'Départements', icon: 'BuildingOffice2Icon' },
  { id: 'services', label: 'Services', icon: 'ClipboardDocumentListIcon' },
  { id: 'beds', label: 'Inventaire des lits', icon: 'HomeModernIcon' },
  { id: 'staff', label: 'Allocation du personnel', icon: 'UserGroupIcon' },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HopitalConfigurationContent() {
  const [activeTab, setActiveTab] = useState('departments');
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [services] = useState<Service[]>(initialServices);
  const [beds] = useState<Bed[]>(initialBeds);
  const [staff] = useState<StaffAllocation[]>(initialStaff);

  // Department modal state
  const [deptModal, setDeptModal] = useState<{ open: boolean; dept: Department | null }>({ open: false, dept: null });
  const [deptSearch, setDeptSearch] = useState('');

  // Bed filters
  const [bedDeptFilter, setBedDeptFilter] = useState('all');
  const [bedStatusFilter, setBedStatusFilter] = useState('all');

  // Staff filters
  const [staffDeptFilter, setStaffDeptFilter] = useState('all');
  const [staffShiftFilter, setStaffShiftFilter] = useState('all');

  // Service filter
  const [serviceTypeFilter, setServiceTypeFilter] = useState('all');

  const saveDept = (d: Department) => {
    setDepartments(prev => prev.find(x => x.id === d.id) ? prev.map(x => x.id === d.id ? d : x) : [...prev, d]);
    setDeptModal({ open: false, dept: null });
  };

  const deleteDept = (id: string) => setDepartments(prev => prev.filter(d => d.id !== id));

  // KPIs
  const totalBeds = beds.length;
  const availableBeds = beds.filter(b => b.status === 'disponible').length;
  const occupiedBeds = beds.filter(b => b.status === 'occupe').length;
  const maintenanceBeds = beds.filter(b => b.status === 'maintenance').length;
  const occupancyPct = Math.round((occupiedBeds / totalBeds) * 100);
  const presentStaff = staff.filter(s => s.status === 'present').length;

  const filteredDepts = departments.filter(d => d.name.toLowerCase().includes(deptSearch.toLowerCase()) || d.code.toLowerCase().includes(deptSearch.toLowerCase()));
  const filteredBeds = beds.filter(b => (bedDeptFilter === 'all' || b.department === bedDeptFilter) && (bedStatusFilter === 'all' || b.status === bedStatusFilter));
  const filteredStaff = staff.filter(s => (staffDeptFilter === 'all' || s.department === staffDeptFilter) && (staffShiftFilter === 'all' || s.shift === staffShiftFilter));
  const filteredServices = services.filter(s => serviceTypeFilter === 'all' || s.type === serviceTypeFilter);

  const uniqueDepts = [...new Set(beds.map(b => b.department))];
  const uniqueStaffDepts = [...new Set(staff.map(s => s.department))];

  return (
    <div className="flex flex-col h-full min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Configuration de l'hôpital</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Gérez les départements, services, lits et personnel</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium hover:bg-muted" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
              <Icon name="ArrowDownTrayIcon" size={16} />
              Exporter
            </button>
            {activeTab === 'departments' && (
              <button onClick={() => setDeptModal({ open: true, dept: null })} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                <Icon name="PlusIcon" size={16} />
                Nouveau département
              </button>
            )}
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-5">
          {[
            { label: 'Départements', value: departments.filter(d => d.status === 'actif').length, sub: 'actifs', icon: 'BuildingOffice2Icon', color: 'var(--shifa-blue)' },
            { label: 'Services', value: services.filter(s => s.available).length, sub: 'disponibles', icon: 'ClipboardDocumentListIcon', color: 'var(--shifa-purple)' },
            { label: 'Lits totaux', value: totalBeds, sub: 'configurés', icon: 'HomeModernIcon', color: 'var(--shifa-cyan)' },
            { label: 'Disponibles', value: availableBeds, sub: 'lits libres', icon: 'CheckCircleIcon', color: 'var(--shifa-green)' },
            { label: 'Taux d\'occupation', value: `${occupancyPct}%`, sub: `${occupiedBeds} occupés`, icon: 'ChartBarIcon', color: occupancyPct >= 90 ? 'var(--shifa-red)' : occupancyPct >= 75 ? 'var(--shifa-amber)' : 'var(--shifa-green)' },
            { label: 'Personnel présent', value: presentStaff, sub: `sur ${staff.length}`, icon: 'UserGroupIcon', color: 'var(--shifa-blue)' },
          ].map((kpi, i) => (
            <div key={i} className="rounded-xl border p-3 flex items-center gap-3" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${kpi.color}18` }}>
                <Icon name={kpi.icon as any} size={18} style={{ color: kpi.color }} />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold leading-tight" style={{ color: 'var(--foreground)' }}>{kpi.value}</p>
                <p className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{kpi.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-5 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id ? 'text-white' : 'hover:bg-muted'}`}
              style={activeTab === tab.id ? { backgroundColor: 'var(--shifa-blue)', color: '#fff' } : { color: 'var(--muted-foreground)' }}
            >
              <Icon name={tab.icon as any} size={15} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">

        {/* ── DEPARTMENTS TAB ── */}
        {activeTab === 'departments' && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="relative flex-1 max-w-sm">
                <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher un département..."
                  value={deptSearch}
                  onChange={e => setDeptSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border text-sm outline-none"
                  style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                />
              </div>
              <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{filteredDepts.length} département(s)</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredDepts.map(dept => {
                const occ = Math.round((dept.bedCount > 0 ? (initialBeds.filter(b => b.department === dept.name && b.status === 'occupe').length / dept.bedCount) : 0) * 100);
                const sc = deptStatusConfig[dept.status];
                return (
                  <div key={dept.id} className="rounded-2xl border p-5 flex flex-col gap-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white" style={{ backgroundColor: dept.color }}>
                          {dept.code}
                        </div>
                        <div>
                          <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{dept.name}</p>
                          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{dept.floor}</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: sc.bg, color: sc.color }}>{sc.label}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      {[
                        { label: 'Lits', value: dept.bedCount },
                        { label: 'Personnel', value: dept.staffCount },
                        { label: 'Occupation', value: `${occ}%` },
                      ].map((stat, i) => (
                        <div key={i} className="rounded-lg p-2" style={{ backgroundColor: 'var(--background)' }}>
                          <p className="text-base font-bold" style={{ color: 'var(--foreground)' }}>{stat.value}</p>
                          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{stat.label}</p>
                        </div>
                      ))}
                    </div>

                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-2">
                        <Icon name="UserIcon" size={13} className="text-muted-foreground shrink-0" />
                        <span style={{ color: 'var(--muted-foreground)' }}>{dept.head}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="PhoneIcon" size={13} className="text-muted-foreground shrink-0" />
                        <span style={{ color: 'var(--muted-foreground)' }}>{dept.phone}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1 border-t" style={{ borderColor: 'var(--border)' }}>
                      <button onClick={() => setDeptModal({ open: true, dept })} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium hover:bg-muted" style={{ color: 'var(--shifa-blue)' }}>
                        <Icon name="PencilSquareIcon" size={13} />
                        Modifier
                      </button>
                      <button onClick={() => deleteDept(dept.id)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium hover:bg-muted" style={{ color: 'var(--shifa-red)' }}>
                        <Icon name="TrashIcon" size={13} />
                        Supprimer
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── SERVICES TAB ── */}
        {activeTab === 'services' && (
          <div>
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <div className="flex gap-2 flex-wrap">
                {(['all', 'consultation', 'chirurgie', 'diagnostic', 'urgence', 'soins'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setServiceTypeFilter(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${serviceTypeFilter === t ? 'text-white' : 'hover:bg-muted'}`}
                    style={serviceTypeFilter === t ? { backgroundColor: 'var(--shifa-blue)' } : { backgroundColor: 'var(--card)', color: 'var(--muted-foreground)', border: '1px solid var(--border)' }}
                  >
                    {t === 'all' ? 'Tous' : serviceTypeConfig[t].label}
                  </button>
                ))}
              </div>
              <span className="text-sm ml-auto" style={{ color: 'var(--muted-foreground)' }}>{filteredServices.length} service(s)</span>
            </div>

            <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
                    {['Service', 'Département', 'Type', 'Durée', 'Tarif', 'Disponibilité'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.map((svc, i) => {
                    const tc = serviceTypeConfig[svc.type];
                    return (
                      <tr key={svc.id} className="border-b hover:bg-muted/30 transition-colors" style={{ borderColor: i < filteredServices.length - 1 ? 'var(--border)' : 'transparent' }}>
                        <td className="px-4 py-3">
                          <p className="font-medium" style={{ color: 'var(--foreground)' }}>{svc.name}</p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{svc.description}</p>
                        </td>
                        <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{svc.department}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: tc.bg, color: tc.color }}>{tc.label}</span>
                        </td>
                        <td className="px-4 py-3 text-xs" style={{ color: 'var(--foreground)' }}>{svc.duration} min</td>
                        <td className="px-4 py-3 text-xs font-medium" style={{ color: 'var(--foreground)' }}>
                          {svc.price === 0 ? <span style={{ color: 'var(--shifa-green)' }}>Gratuit</span> : `${svc.price.toLocaleString()} FCFA`}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium`}
                            style={svc.available ? { backgroundColor: 'rgba(16,185,129,0.10)', color: 'var(--shifa-green)' } : { backgroundColor: 'rgba(239,68,68,0.10)', color: 'var(--shifa-red)' }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: svc.available ? '#10b981' : '#ef4444' }} />
                            {svc.available ? 'Disponible' : 'Indisponible'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── BEDS TAB ── */}
        {activeTab === 'beds' && (
          <div>
            {/* Bed status summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {Object.entries(bedStatusConfig).map(([status, cfg]) => {
                const count = beds.filter(b => b.status === status).length;
                return (
                  <div key={status} className="rounded-xl border p-4 flex items-center gap-3" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cfg.dot }} />
                    <div>
                      <p className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>{count}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{cfg.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <select
                value={bedDeptFilter}
                onChange={e => setBedDeptFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border text-sm outline-none"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                <option value="all">Tous les départements</option>
                {uniqueDepts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select
                value={bedStatusFilter}
                onChange={e => setBedStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border text-sm outline-none"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                <option value="all">Tous les statuts</option>
                {Object.entries(bedStatusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <span className="text-sm ml-auto" style={{ color: 'var(--muted-foreground)' }}>{filteredBeds.length} lit(s)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredBeds.map(bed => {
                const sc = bedStatusConfig[bed.status];
                return (
                  <div key={bed.id} className="rounded-2xl border p-4 flex flex-col gap-3" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base" style={{ color: 'var(--foreground)' }}>{bed.number}</span>
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: sc.bg, color: sc.color }}>
                            <span className="inline-block w-1.5 h-1.5 rounded-full mr-1" style={{ backgroundColor: sc.dot }} />
                            {sc.label}
                          </span>
                        </div>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{bed.room} · {bed.department}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-lg text-xs font-medium" style={{ backgroundColor: 'var(--background)', color: 'var(--muted-foreground)' }}>
                        {bedTypeLabels[bed.type]}
                      </span>
                    </div>

                    {bed.patient && (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: 'rgba(239,68,68,0.06)' }}>
                        <Icon name="UserIcon" size={14} style={{ color: 'var(--shifa-red)' }} />
                        <span className="text-xs font-medium" style={{ color: 'var(--shifa-red)' }}>{bed.patient}</span>
                      </div>
                    )}

                    <div>
                      <p className="text-xs font-medium mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Équipements</p>
                      <div className="flex flex-wrap gap-1.5">
                        {bed.equipment.map((eq, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md text-xs" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>
                            {eq}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t text-xs" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                      <span>Dernière désinfection : {bed.lastCleaned}</span>
                      <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                        <Icon name="PencilSquareIcon" size={13} />
                        Modifier
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── STAFF ALLOCATION TAB ── */}
        {activeTab === 'staff' && (
          <div>
            {/* Shift summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {Object.entries(shiftConfig).map(([shift, cfg]) => {
                const count = staff.filter(s => s.shift === shift).length;
                return (
                  <div key={shift} className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <p className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>{count}</p>
                    <p className="text-xs mt-0.5" style={{ color: cfg.color }}>{cfg.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <select
                value={staffDeptFilter}
                onChange={e => setStaffDeptFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border text-sm outline-none"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                <option value="all">Tous les départements</option>
                {uniqueStaffDepts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select
                value={staffShiftFilter}
                onChange={e => setStaffShiftFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border text-sm outline-none"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                <option value="all">Tous les quarts</option>
                {Object.entries(shiftConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <span className="text-sm ml-auto" style={{ color: 'var(--muted-foreground)' }}>{filteredStaff.length} membre(s)</span>
            </div>

            <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
                    {['Personnel', 'Département', 'Quart', 'Jours', 'Statut', 'Contact'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.map((member, i) => {
                    const sc = staffStatusConfig[member.status];
                    const shiftC = shiftConfig[member.shift];
                    return (
                      <tr key={member.id} className="border-b hover:bg-muted/30 transition-colors" style={{ borderColor: i < filteredStaff.length - 1 ? 'var(--border)' : 'transparent' }}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                              style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
                              {member.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                            </div>
                            <div>
                              <p className="font-medium" style={{ color: 'var(--foreground)' }}>{member.name}</p>
                              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{member.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{member.department}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: shiftC.bg, color: shiftC.color }}>{shiftC.label.split(' ')[0]}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1 flex-wrap">
                            {member.days.map(d => (
                              <span key={d} className="px-1.5 py-0.5 rounded text-xs" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>{d}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: sc.bg, color: sc.color }}>{sc.label}</span>
                        </td>
                        <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{member.phone}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Department Modal */}
      {deptModal.open && (
        <DepartmentModal dept={deptModal.dept} onClose={() => setDeptModal({ open: false, dept: null })} onSave={saveDept} />
      )}
    </div>
  );
}
