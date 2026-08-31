'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

import PatientHeader from './PatientHeader';
import QuickActions from './QuickActions';
import VitalSignsAndPrescriptions from './VitalSignsAndPrescriptions';

// ── Types ─────────────────────────────────────────────────────────────────────
interface NewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
}

interface AppointmentStats {
  upcoming: number;
  completed: number;
  cancelled: number;
  documents: number;
}

interface LabResult {
  id: string;
  title: string;
  lab: string;
  date: string;
  status: 'Normal' | 'À surveiller' | 'Anomalie' | 'En attente';
}

interface DossierItem {
  key: string;
  label: string;
  sub: string;
  href: string;
  icon: React.ReactNode;
  filled: boolean;
}

// ── Static fallback news ──────────────────────────────────────────────────────
const staticNews: NewsItem[] = [
  { id: 'n1', title: 'Importance de la vaccination contre la grippe saisonnière', category: 'Prévention', date: '12 août 2026', readTime: '3 min' },
  { id: 'n2', title: 'Nouvelles recommandations sur l\'activité physique et la santé cardiaque', category: 'Cardiologie', date: '10 août 2026', readTime: '4 min' },
  { id: 'n3', title: 'Santé mentale : briser les tabous pour mieux se soigner', category: 'Santé mentale', date: '8 août 2026', readTime: '5 min' },
];

// ── i18n strings for patient-home (keys not in global TranslationKey) ─────────
const HOME_STRINGS: Record<string, Record<string, string>> = {
  fr: {
    nextAppt: 'Prochain rendez-vous',
    quickAccess: 'Accès rapide',
    myDocs: 'Mes documents',
    lastResults: 'Derniers résultats',
    myDossier: 'Mon dossier de santé',
    healthNews: 'Actualités santé',
    newsDisclaimer: 'Informations de santé publique — non liées à votre dossier personnel.',
    newsGeneral: 'Général',
    upcoming: 'À venir',
    completed: 'Terminés',
    cancelled: 'Annulés',
    documents: 'Documents',
    noAppt: 'Aucun rendez-vous à venir',
    noApptSub: 'Planifiez votre prochaine consultation',
    scheduleAppt: 'Planifier un rendez-vous',
    newAppt: 'Nouveau rendez-vous',
    teleconsult: 'Téléconsultation',
    teleconsultAvail: 'Téléconsultation disponible',
    noResults: 'Aucun résultat disponible',
    noResultsSub: 'Vos résultats d\'analyses apparaîtront ici',
    dossierCompleteness: 'Complétude du dossier',
    toComplete: 'À compléter',
    viewAll: 'Voir tout',
    ordonnances: 'Ordonnances',
    resultats: 'Résultats',
    antecedents: 'Antécédents médicaux',
    antecedentsAvail: 'Historique disponible',
    antecedentsEmpty: 'Aucun antécédent enregistré',
    allergies: 'Allergies & intolérances',
    allergiesAvail: 'Allergies enregistrées',
    allergiesEmpty: 'Aucune allergie renseignée',
    vaccinations: 'Vaccinations',
    vaccinationsAvail: 'Carnet de vaccination disponible',
    vaccinationsEmpty: 'Carnet non renseigné',
    treatments: 'Traitements en cours',
    treatmentsAvail: 'Traitements actifs',
    treatmentsEmpty: 'Aucun traitement actif',
    statusNormal: 'Normal',
    statusWatch: 'À surveiller',
    statusAnomaly: 'Anomalie',
    statusPending: 'En attente',
  },
  en: {
    nextAppt: 'Next appointment',
    quickAccess: 'Quick access',
    myDocs: 'My documents',
    lastResults: 'Latest results',
    myDossier: 'My health record',
    healthNews: 'Health news',
    newsDisclaimer: 'Public health information — not linked to your personal record.',
    newsGeneral: 'General',
    upcoming: 'Upcoming',
    completed: 'Completed',
    cancelled: 'Cancelled',
    documents: 'Documents',
    noAppt: 'No upcoming appointments',
    noApptSub: 'Schedule your next consultation',
    scheduleAppt: 'Schedule appointment',
    newAppt: 'New appointment',
    teleconsult: 'Teleconsultation',
    teleconsultAvail: 'Teleconsultation available',
    noResults: 'No results available',
    noResultsSub: 'Your test results will appear here',
    dossierCompleteness: 'Record completeness',
    toComplete: 'To complete',
    viewAll: 'View all',
    ordonnances: 'Prescriptions',
    resultats: 'Results',
    antecedents: 'Medical history',
    antecedentsAvail: 'History available',
    antecedentsEmpty: 'No history recorded',
    allergies: 'Allergies & intolerances',
    allergiesAvail: 'Allergies recorded',
    allergiesEmpty: 'No allergies recorded',
    vaccinations: 'Vaccinations',
    vaccinationsAvail: 'Vaccination record available',
    vaccinationsEmpty: 'Record not filled',
    treatments: 'Current treatments',
    treatmentsAvail: 'Active treatments',
    treatmentsEmpty: 'No active treatment',
    statusNormal: 'Normal',
    statusWatch: 'Watch',
    statusAnomaly: 'Anomaly',
    statusPending: 'Pending',
  },
  es: {
    nextAppt: 'Próxima cita',
    quickAccess: 'Acceso rápido',
    myDocs: 'Mis documentos',
    lastResults: 'Últimos resultados',
    myDossier: 'Mi historial de salud',
    healthNews: 'Noticias de salud',
    newsDisclaimer: 'Información de salud pública — no vinculada a su expediente personal.',
    newsGeneral: 'General',
    upcoming: 'Próximas',
    completed: 'Completadas',
    cancelled: 'Canceladas',
    documents: 'Documentos',
    noAppt: 'Sin citas próximas',
    noApptSub: 'Programe su próxima consulta',
    scheduleAppt: 'Programar cita',
    newAppt: 'Nueva cita',
    teleconsult: 'Teleconsulta',
    teleconsultAvail: 'Teleconsulta disponible',
    noResults: 'Sin resultados disponibles',
    noResultsSub: 'Sus resultados aparecerán aquí',
    dossierCompleteness: 'Completitud del expediente',
    toComplete: 'Por completar',
    viewAll: 'Ver todo',
    ordonnances: 'Recetas',
    resultats: 'Resultados',
    antecedents: 'Antecedentes médicos',
    antecedentsAvail: 'Historial disponible',
    antecedentsEmpty: 'Sin antecedentes registrados',
    allergies: 'Alergias e intolerancias',
    allergiesAvail: 'Alergias registradas',
    allergiesEmpty: 'Sin alergias registradas',
    vaccinations: 'Vacunaciones',
    vaccinationsAvail: 'Carnet de vacunación disponible',
    vaccinationsEmpty: 'Carnet no completado',
    treatments: 'Tratamientos actuales',
    treatmentsAvail: 'Tratamientos activos',
    treatmentsEmpty: 'Sin tratamiento activo',
    statusNormal: 'Normal',
    statusWatch: 'Vigilar',
    statusAnomaly: 'Anomalía',
    statusPending: 'Pendiente',
  },
  pt: {
    nextAppt: 'Próxima consulta',
    quickAccess: 'Acesso rápido',
    myDocs: 'Meus documentos',
    lastResults: 'Últimos resultados',
    myDossier: 'Meu prontuário',
    healthNews: 'Notícias de saúde',
    newsDisclaimer: 'Informações de saúde pública — não vinculadas ao seu prontuário pessoal.',
    newsGeneral: 'Geral',
    upcoming: 'Próximas',
    completed: 'Concluídas',
    cancelled: 'Canceladas',
    documents: 'Documentos',
    noAppt: 'Sem consultas próximas',
    noApptSub: 'Agende sua próxima consulta',
    scheduleAppt: 'Agendar consulta',
    newAppt: 'Nova consulta',
    teleconsult: 'Teleconsulta',
    teleconsultAvail: 'Teleconsulta disponível',
    noResults: 'Sem resultados disponíveis',
    noResultsSub: 'Seus resultados aparecerão aqui',
    dossierCompleteness: 'Completude do prontuário',
    toComplete: 'A completar',
    viewAll: 'Ver tudo',
    ordonnances: 'Receitas',
    resultats: 'Resultados',
    antecedents: 'Histórico médico',
    antecedentsAvail: 'Histórico disponível',
    antecedentsEmpty: 'Sem histórico registrado',
    allergies: 'Alergias e intolerâncias',
    allergiesAvail: 'Alergias registradas',
    allergiesEmpty: 'Sem alergias registradas',
    vaccinations: 'Vacinações',
    vaccinationsAvail: 'Carteira de vacinação disponível',
    vaccinationsEmpty: 'Carteira não preenchida',
    treatments: 'Tratamentos atuais',
    treatmentsAvail: 'Tratamentos ativos',
    treatmentsEmpty: 'Sem tratamento ativo',
    statusNormal: 'Normal',
    statusWatch: 'Monitorar',
    statusAnomaly: 'Anomalia',
    statusPending: 'Pendente',
  },
  ar: {
    nextAppt: 'الموعد القادم',
    quickAccess: 'وصول سريع',
    myDocs: 'وثائقي',
    lastResults: 'آخر النتائج',
    myDossier: 'ملفي الصحي',
    healthNews: 'أخبار الصحة',
    newsDisclaimer: 'معلومات الصحة العامة — غير مرتبطة بملفك الشخصي.',
    newsGeneral: 'عام',
    upcoming: 'القادمة',
    completed: 'المكتملة',
    cancelled: 'الملغاة',
    documents: 'الوثائق',
    noAppt: 'لا مواعيد قادمة',
    noApptSub: 'حدد موعد استشارتك القادمة',
    scheduleAppt: 'تحديد موعد',
    newAppt: 'موعد جديد',
    teleconsult: 'استشارة عن بُعد',
    teleconsultAvail: 'استشارة عن بُعد متاحة',
    noResults: 'لا نتائج متاحة',
    noResultsSub: 'ستظهر نتائج تحاليلك هنا',
    dossierCompleteness: 'اكتمال الملف',
    toComplete: 'للإكمال',
    viewAll: 'عرض الكل',
    ordonnances: 'الوصفات',
    resultats: 'النتائج',
    antecedents: 'السوابق الطبية',
    antecedentsAvail: 'السجل متاح',
    antecedentsEmpty: 'لا سوابق مسجلة',
    allergies: 'الحساسية وعدم التحمل',
    allergiesAvail: 'الحساسية مسجلة',
    allergiesEmpty: 'لا حساسية مسجلة',
    vaccinations: 'التطعيمات',
    vaccinationsAvail: 'دفتر التطعيم متاح',
    vaccinationsEmpty: 'الدفتر غير مكتمل',
    treatments: 'العلاجات الجارية',
    treatmentsAvail: 'علاجات نشطة',
    treatmentsEmpty: 'لا علاج نشط',
    statusNormal: 'طبيعي',
    statusWatch: 'للمراقبة',
    statusAnomaly: 'شذوذ',
    statusPending: 'في الانتظار',
  },
  zh: {
    nextAppt: '下次预约',
    quickAccess: '快速访问',
    myDocs: '我的文件',
    lastResults: '最新结果',
    myDossier: '我的健康档案',
    healthNews: '健康资讯',
    newsDisclaimer: '公共卫生信息——与您的个人档案无关。',
    newsGeneral: '综合',
    upcoming: '即将到来',
    completed: '已完成',
    cancelled: '已取消',
    documents: '文件',
    noAppt: '暂无预约',
    noApptSub: '安排您的下次就诊',
    scheduleAppt: '预约就诊',
    newAppt: '新预约',
    teleconsult: '远程问诊',
    teleconsultAvail: '远程问诊可用',
    noResults: '暂无结果',
    noResultsSub: '您的检查结果将显示在此处',
    dossierCompleteness: '档案完整度',
    toComplete: '待完善',
    viewAll: '查看全部',
    ordonnances: '处方',
    resultats: '结果',
    antecedents: '病史',
    antecedentsAvail: '病史可用',
    antecedentsEmpty: '未记录病史',
    allergies: '过敏与不耐受',
    allergiesAvail: '已记录过敏',
    allergiesEmpty: '未记录过敏',
    vaccinations: '疫苗接种',
    vaccinationsAvail: '疫苗接种记录可用',
    vaccinationsEmpty: '记录未填写',
    treatments: '当前治疗',
    treatmentsAvail: '活跃治疗',
    treatmentsEmpty: '无活跃治疗',
    statusNormal: '正常',
    statusWatch: '待观察',
    statusAnomaly: '异常',
    statusPending: '待处理',
  },
};

// ── Inline SVG icons ──────────────────────────────────────────────────────────
function CalendarIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} style={style} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  );
}
function VideoIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} style={style} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );
}
function BeakerIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} style={style} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15M14.25 3.104c.251.023.501.05.75.082M19.8 15a2.25 2.25 0 01.45 1.318 2.25 2.25 0 01-2.25 2.25H5.25a2.25 2.25 0 01-2.25-2.25 2.25 2.25 0 01.45-1.318L5 14.5m14.8.5l.45.318M5 14.5l-.45.318" />
    </svg>
  );
}
function FolderIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} style={style} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
    </svg>
  );
}
function ChevronRightIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} style={style} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  );
}
function NewsIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} style={style} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
    </svg>
  );
}
function ClipboardIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} style={style} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  );
}
function AlertIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} style={style} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  );
}
function ShieldIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} style={style} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}
function PillIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} style={style} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
    </svg>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl ${className}`} style={{ backgroundColor: 'var(--muted)' }} aria-hidden="true" />;
}

// ── Section Header ────────────────────────────────────────────────────────────
function SectionHeader({ title, href, linkLabel }: { title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)', fontFamily: 'var(--font-heading)' }}>
        {title}
      </h2>
      {href && linkLabel && (
        <Link href={href} className="text-xs font-semibold transition-colors hover:underline" style={{ color: 'var(--shifa-blue)' }}>
          {linkLabel}
        </Link>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function PatientHomeContent() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const t = HOME_STRINGS[language] || HOME_STRINGS['fr'];

  // Status config uses translated labels
  const resultStatusConfig: Record<string, { label: string; bg: string; color: string; dot: string }> = {
    Normal: { label: t.statusNormal, bg: '#D1FAE5', color: '#065F46', dot: '#059669' },
    'À surveiller': { label: t.statusWatch, bg: '#FEF3C7', color: '#92400E', dot: '#D97706' },
    Anomalie: { label: t.statusAnomaly, bg: '#FEE2E2', color: '#991B1B', dot: '#DC2626' },
    'En attente': { label: t.statusPending, bg: '#E8EFF8', color: '#4A6080', dot: '#8FA8C8' },
  };

  // ── State ──────────────────────────────────────────────────────────────────
  const [stats, setStats] = useState<AppointmentStats>({ upcoming: 0, completed: 0, cancelled: 0, documents: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  const [nextAppointment, setNextAppointment] = useState<any>(null);
  const [apptLoading, setApptLoading] = useState(true);

  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [resultsLoading, setResultsLoading] = useState(true);

  const [dossierItems, setDossierItems] = useState<DossierItem[]>([]);
  const [dossierLoading, setDossierLoading] = useState(true);
  const [dossierCompleteness, setDossierCompleteness] = useState(0);

  const [docCounts, setDocCounts] = useState({ ordonnances: 0, resultats: 0, documents: 0 });
  const [docsLoading, setDocsLoading] = useState(true);

  const [news, setNews] = useState<NewsItem[]>(staticNews);
  const [newsLoading, setNewsLoading] = useState(true);

  // ── Data fetching ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    const supabase = createClient();

    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const now = new Date().toISOString();
        const [upcomingRes, completedRes, cancelledRes, docsRes] = await Promise.all([
          supabase.from('appointments').select('id', { count: 'exact', head: true })
            .eq('patient_id', user.id).gte('scheduled_at', now).not('status', 'in', '("cancelled","completed","no_show")'),
          supabase.from('appointments').select('id', { count: 'exact', head: true })
            .eq('patient_id', user.id).eq('status', 'completed'),
          supabase.from('appointments').select('id', { count: 'exact', head: true })
            .eq('patient_id', user.id).eq('status', 'cancelled'),
          supabase.from('patient_documents').select('id', { count: 'exact', head: true })
            .eq('patient_id', user.id),
        ]);
        setStats({
          upcoming: upcomingRes.count ?? 0,
          completed: completedRes.count ?? 0,
          cancelled: cancelledRes.count ?? 0,
          documents: docsRes.count ?? 0,
        });
      } catch {
        // keep defaults
      } finally {
        setStatsLoading(false);
      }
    };

    const fetchNextAppointment = async () => {
      setApptLoading(true);
      try {
        const now = new Date().toISOString();
        const { data } = await supabase
          .from('appointments')
          .select('*, professionals(first_name, last_name, specialty), organizations(name)')
          .eq('patient_id', user.id)
          .gte('scheduled_at', now)
          .not('status', 'in', '("cancelled","completed","no_show")')
          .order('scheduled_at', { ascending: true })
          .limit(1)
          .maybeSingle();
        setNextAppointment(data);
      } catch {
        setNextAppointment(null);
      } finally {
        setApptLoading(false);
      }
    };

    const fetchResults = async () => {
      setResultsLoading(true);
      try {
        const { data } = await supabase
          .from('lab_results')
          .select('id, title, lab_name, result_date, status')
          .eq('patient_id', user.id)
          .order('result_date', { ascending: false })
          .limit(3);
        if (data && data.length > 0) {
          setLabResults(data.map((r: any) => ({
            id: r.id,
            title: r.title || 'Résultat',
            lab: r.lab_name || 'Laboratoire',
            date: r.result_date ? new Date(r.result_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '',
            status: r.status || 'En attente',
          })));
        }
      } catch {
        // keep empty
      } finally {
        setResultsLoading(false);
      }
    };

    const fetchDossier = async () => {
      setDossierLoading(true);
      try {
        const { data } = await supabase
          .from('health_records')
          .select('record_type, title, created_at')
          .eq('patient_id', user.id)
          .order('created_at', { ascending: false });

        const types = data ? data.map((r: any) => r.record_type) : [];
        const hasAntecedents = types.includes('medical_history') || types.includes('antecedent');
        const hasAllergies = types.includes('allergy');
        const hasVaccinations = types.includes('vaccination');
        const hasTreatments = types.includes('prescription') || types.includes('treatment');

        const items: DossierItem[] = [
          {
            key: 'd1', label: t.antecedents,
            sub: hasAntecedents ? t.antecedentsAvail : t.antecedentsEmpty,
            href: '/dossier-de-sant', filled: hasAntecedents,
            icon: <ClipboardIcon className="w-4 h-4" style={{ color: 'var(--shifa-blue)' }} />,
          },
          {
            key: 'd2', label: t.allergies,
            sub: hasAllergies ? t.allergiesAvail : t.allergiesEmpty,
            href: '/dossier-de-sant', filled: hasAllergies,
            icon: <AlertIcon className="w-4 h-4" style={{ color: '#D97706' }} />,
          },
          {
            key: 'd3', label: t.vaccinations,
            sub: hasVaccinations ? t.vaccinationsAvail : t.vaccinationsEmpty,
            href: '/patient-vaccination', filled: hasVaccinations,
            icon: <ShieldIcon className="w-4 h-4" style={{ color: '#059669' }} />,
          },
          {
            key: 'd4', label: t.treatments,
            sub: hasTreatments ? t.treatmentsAvail : t.treatmentsEmpty,
            href: '/dossier-de-sant', filled: hasTreatments,
            icon: <PillIcon className="w-4 h-4" style={{ color: 'var(--shifa-purple)' }} />,
          },
        ];
        setDossierItems(items);
        const filledCount = items.filter(i => i.filled).length;
        setDossierCompleteness(Math.round((filledCount / items.length) * 100));
      } catch {
        // keep empty
      } finally {
        setDossierLoading(false);
      }
    };

    const fetchDocCounts = async () => {
      setDocsLoading(true);
      try {
        const [ordRes, resRes, docRes] = await Promise.all([
          supabase.from('patient_documents').select('id', { count: 'exact', head: true })
            .eq('patient_id', user.id).eq('document_type', 'prescription'),
          supabase.from('patient_documents').select('id', { count: 'exact', head: true })
            .eq('patient_id', user.id).eq('document_type', 'lab_result'),
          supabase.from('patient_documents').select('id', { count: 'exact', head: true })
            .eq('patient_id', user.id),
        ]);
        setDocCounts({
          ordonnances: ordRes.count ?? 0,
          resultats: resRes.count ?? 0,
          documents: docRes.count ?? 0,
        });
      } catch {
        // keep defaults
      } finally {
        setDocsLoading(false);
      }
    };

    fetchStats();
    fetchNextAppointment();
    fetchResults();
    fetchDossier();
    fetchDocCounts();
  }, [user]);

  useEffect(() => {
    fetch('/api/health-news')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setNews(data.slice(0, 3).map((item: any, idx: number) => ({
            id: item.id || item.key || String(idx),
            title: item.title || '',
            category: item.category || item.tag || 'Santé',
            date: item.date || '',
            readTime: item.readTime || item.read_time || '3 min',
          })));
        }
      })
      .catch(() => {})
      .finally(() => setNewsLoading(false));
  }, []);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
  };
  const formatMonth = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase();
  };
  const formatDay = (iso: string) => new Date(iso).getDate();
  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2, '0')}h${String(d.getMinutes()).padStart(2, '0')}`;
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <PatientHeader />

      <main className="px-4 pt-5 pb-28 max-w-2xl mx-auto lg:max-w-3xl" id="main-content">

        {/* ── Stats Strip ──────────────────────────────────────────── */}
        <section aria-label="Statistiques de santé" className="mb-6">
          <div className="grid grid-cols-4 gap-2">
            {statsLoading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20" />)
            ) : (
              <>
                {[
                  { value: stats.upcoming, label: t.upcoming, color: 'var(--shifa-blue)', bg: 'var(--shifa-light)' },
                  { value: stats.completed, label: t.completed, color: '#059669', bg: '#D1FAE5' },
                  { value: stats.cancelled, label: t.cancelled, color: 'var(--shifa-red)', bg: 'var(--shifa-red-light)' },
                  { value: stats.documents, label: t.documents, color: 'var(--shifa-purple)', bg: '#EDE9FE' },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-1 p-3 rounded-2xl"
                    style={{ backgroundColor: 'var(--shifa-surface-2)', border: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(21,88,214,0.05)' }}
                    aria-label={`${s.value} ${s.label}`}
                  >
                    <p className="text-xl font-bold leading-none" style={{ color: s.color, fontFamily: 'var(--font-heading)' }}>{s.value}</p>
                    <p className="text-xs text-center leading-tight mt-1" style={{ color: 'var(--shifa-gray)' }}>{s.label}</p>
                  </div>
                ))}
              </>
            )}
          </div>
        </section>

        {/* ── Prochain rendez-vous ──────────────────────────────────── */}
        <section className="mb-6" aria-labelledby="next-appt-title">
          <SectionHeader title={t.nextAppt} href="/appointment-history" linkLabel={t.viewAll} />
          <div
            className="rounded-2xl p-4"
            style={{ backgroundColor: 'var(--shifa-surface-2)', border: '1px solid var(--border)', boxShadow: '0 2px 12px rgba(21,88,214,0.07)' }}
          >
            {apptLoading ? (
              <div className="flex items-start gap-4">
                <Skeleton className="w-14 h-16 shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ) : nextAppointment ? (
              <>
                <div className="flex items-start gap-4">
                  <div
                    className="flex flex-col items-center justify-center rounded-xl px-3 py-2 shrink-0 min-w-[52px]"
                    style={{ backgroundColor: 'var(--shifa-light)' }}
                    aria-hidden="true"
                  >
                    <p className="text-lg font-bold leading-none" style={{ color: 'var(--shifa-blue)', fontFamily: 'var(--font-heading)' }}>
                      {formatDay(nextAppointment.scheduled_at)}
                    </p>
                    <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--shifa-blue)' }}>
                      {formatMonth(nextAppointment.scheduled_at)}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm" style={{ color: 'var(--shifa-dark)', fontFamily: 'var(--font-heading)' }}>
                      {nextAppointment.professionals
                        ? `Dr. ${nextAppointment.professionals.first_name} ${nextAppointment.professionals.last_name}`
                        : 'Professionnel de santé'}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--shifa-gray)' }}>
                      {nextAppointment.professionals?.specialty || nextAppointment.appointment_type || 'Consultation'}
                    </p>
                    {nextAppointment.organizations?.name && (
                      <div className="flex items-center gap-1 mt-1.5">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--shifa-gray)' }} aria-hidden="true">
                          <path strokeLinecap="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        <p className="text-xs truncate" style={{ color: 'var(--shifa-gray)' }}>{nextAppointment.organizations.name}</p>
                      </div>
                    )}
                  </div>
                  <span
                    className="px-2.5 py-1 rounded-lg text-xs font-bold shrink-0"
                    style={{ backgroundColor: 'var(--shifa-light)', color: 'var(--shifa-blue)' }}
                    aria-label={`Heure : ${formatTime(nextAppointment.scheduled_at)}`}
                  >
                    {formatTime(nextAppointment.scheduled_at)}
                  </span>
                </div>
                {nextAppointment.teleconsultation && (
                  <div
                    className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl"
                    style={{ backgroundColor: '#D1FAE5', border: '1px solid #A7F3D0' }}
                  >
                    <VideoIcon className="w-4 h-4 shrink-0" style={{ color: '#059669' }} />
                    <p className="text-xs font-semibold" style={{ color: '#065F46' }}>{t.teleconsultAvail}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <Link
                    href="/appointment-booking"
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-95"
                    style={{ backgroundColor: 'var(--shifa-blue)', boxShadow: '0 2px 8px rgba(21,101,216,0.25)' }}
                  >
                    <CalendarIcon className="w-4 h-4" />
                    {t.newAppt}
                  </Link>
                  <Link
                    href="/patient-teleconsultation"
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border transition-all active:scale-95"
                    style={{ borderColor: 'var(--border)', color: 'var(--shifa-dark)', backgroundColor: 'var(--shifa-surface)' }}
                  >
                    <VideoIcon className="w-4 h-4" />
                    {t.teleconsult}
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: 'var(--shifa-light)' }}
                  aria-hidden="true"
                >
                  <CalendarIcon className="w-7 h-7" style={{ color: 'var(--shifa-blue)' }} />
                </div>
                <p className="text-sm font-semibold mb-1" style={{ color: 'var(--shifa-dark)' }}>{t.noAppt}</p>
                <p className="text-xs mb-4" style={{ color: 'var(--shifa-gray)' }}>{t.noApptSub}</p>
                <Link
                  href="/appointment-booking"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-95"
                  style={{ backgroundColor: 'var(--shifa-blue)', boxShadow: '0 2px 8px rgba(21,101,216,0.25)' }}
                >
                  <CalendarIcon className="w-4 h-4" />
                  {t.scheduleAppt}
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ── Accès rapide ──────────────────────────────────────────── */}
        <div className="mb-6">
          <QuickActions language={language} />
        </div>

        {/* ── Constantes vitales & Ordonnances (Real-time) ──────────── */}
        <section className="mb-6" aria-labelledby="vitals-rx-title">
          <VitalSignsAndPrescriptions />
        </section>

        {/* ── Mes documents ─────────────────────────────────────────── */}
        <section className="mb-6" aria-labelledby="docs-title">
          <SectionHeader title={t.myDocs} href="/patient-documents" linkLabel={t.viewAll} />
          <div className="grid grid-cols-3 gap-2 mb-4">
            {docsLoading ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)
            ) : (
              [
                { key: 'ord', label: t.ordonnances, count: docCounts.ordonnances, color: 'var(--shifa-blue)', bg: 'var(--shifa-light)', href: '/patient-documents' },
                { key: 'res', label: t.resultats, count: docCounts.resultats, color: 'var(--shifa-purple)', bg: '#EDE9FE', href: '/patient-results' },
                { key: 'docs', label: t.documents, count: docCounts.documents, color: '#059669', bg: '#D1FAE5', href: '/patient-documents' },
              ].map((d) => (
                <Link
                  key={d.key}
                  href={d.href}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all active:scale-95 hover:shadow-shifa"
                  style={{ backgroundColor: 'var(--shifa-surface-2)', border: '1px solid var(--border)' }}
                  aria-label={`${d.count} ${d.label}`}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: d.bg }} aria-hidden="true">
                    <FolderIcon className="w-4 h-4" style={{ color: d.color }} />
                  </div>
                  <p className="text-base font-bold" style={{ color: d.color, fontFamily: 'var(--font-heading)' }}>{d.count}</p>
                  <p className="text-xs text-center leading-tight" style={{ color: 'var(--shifa-gray)' }}>{d.label}</p>
                </Link>
              ))
            )}
          </div>

          {/* Derniers résultats */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--shifa-gray)' }}>{t.lastResults}</p>
            <Link href="/patient-results" className="text-xs font-semibold" style={{ color: 'var(--shifa-blue)' }}>{t.viewAll}</Link>
          </div>

          {resultsLoading ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
            </div>
          ) : labResults.length === 0 ? (
            <div
              className="flex items-center gap-3 p-4 rounded-2xl"
              style={{ backgroundColor: 'var(--shifa-surface-2)', border: '1px solid var(--border)' }}
            >
              <BeakerIcon className="w-8 h-8 shrink-0" style={{ color: 'var(--shifa-gray)', opacity: 0.4 }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--shifa-dark)' }}>{t.noResults}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--shifa-gray)' }}>{t.noResultsSub}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {labResults.map((r) => {
                const sc = resultStatusConfig[r.status] || resultStatusConfig['En attente'];
                return (
                  <Link
                    key={r.id}
                    href="/patient-results"
                    className="flex items-center gap-3 p-3.5 rounded-2xl transition-all active:scale-[0.98] hover:shadow-shifa"
                    style={{ backgroundColor: 'var(--shifa-surface-2)', border: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(21,88,214,0.04)' }}
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--shifa-light)' }} aria-hidden="true">
                      <BeakerIcon className="w-4 h-4" style={{ color: 'var(--shifa-blue)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--shifa-dark)' }}>{r.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--shifa-gray)' }}>{r.lab}{r.date ? ` · ${r.date}` : ''}</p>
                    </div>
                    <span
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0"
                      style={{ backgroundColor: sc.bg, color: sc.color }}
                      aria-label={`Statut : ${sc.label}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: sc.dot }} aria-hidden="true" />
                      {sc.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Mon dossier de santé ──────────────────────────────────── */}
        <section className="mb-6" aria-labelledby="dossier-title">
          <div className="flex items-center justify-between mb-3">
            <h2 id="dossier-title" className="text-sm font-bold" style={{ color: 'var(--shifa-dark)', fontFamily: 'var(--font-heading)' }}>
              {t.myDossier}
            </h2>
            <Link href="/dossier-de-sant" className="text-xs font-semibold" style={{ color: 'var(--shifa-blue)' }}>{t.viewAll}</Link>
          </div>

          {!dossierLoading && (
            <div
              className="flex items-center gap-3 p-3 rounded-xl mb-3"
              style={{ backgroundColor: dossierCompleteness >= 75 ? '#D1FAE5' : dossierCompleteness >= 50 ? '#FEF3C7' : 'var(--shifa-light)', border: `1px solid ${dossierCompleteness >= 75 ? '#A7F3D0' : dossierCompleteness >= 50 ? '#FDE68A' : 'var(--border)'}` }}
              aria-label={`${t.dossierCompleteness} ${dossierCompleteness}%`}
            >
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-semibold" style={{ color: dossierCompleteness >= 75 ? '#065F46' : dossierCompleteness >= 50 ? '#92400E' : 'var(--shifa-blue)' }}>
                    {t.dossierCompleteness}
                  </p>
                  <span className="text-xs font-bold" style={{ color: dossierCompleteness >= 75 ? '#065F46' : dossierCompleteness >= 50 ? '#92400E' : 'var(--shifa-blue)' }}>
                    {dossierCompleteness}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.08)' }} role="progressbar" aria-valuenow={dossierCompleteness} aria-valuemin={0} aria-valuemax={100}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${dossierCompleteness}%`,
                      backgroundColor: dossierCompleteness >= 75 ? '#059669' : dossierCompleteness >= 50 ? '#D97706' : 'var(--shifa-blue)',
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {dossierLoading ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {dossierItems.map((d) => (
                <Link
                  key={d.key}
                  href={d.href}
                  className="flex items-center gap-3 p-3.5 rounded-2xl transition-all active:scale-[0.98] hover:shadow-shifa"
                  style={{ backgroundColor: 'var(--shifa-surface-2)', border: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(21,88,214,0.04)' }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: d.filled ? 'var(--shifa-light)' : '#F3F4F6' }}
                    aria-hidden="true"
                  >
                    {d.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{ color: 'var(--shifa-dark)' }}>{d.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--shifa-gray)' }}>{d.sub}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!d.filled && (
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{ backgroundColor: 'var(--shifa-amber-light)', color: '#92400E' }}
                        aria-label={t.toComplete}
                      >
                        {t.toComplete}
                      </span>
                    )}
                    <ChevronRightIcon className="w-4 h-4" style={{ color: 'var(--shifa-gray)' }} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* ── Actualités santé ──────────────────────────────────────── */}
        <section className="mb-6" aria-labelledby="news-title">
          <div className="flex items-center gap-2 mb-1">
            <h2 id="news-title" className="text-sm font-bold" style={{ color: 'var(--shifa-dark)', fontFamily: 'var(--font-heading)' }}>
              {t.healthNews}
            </h2>
            <span
              className="px-2 py-0.5 rounded-full text-xs font-semibold"
              style={{ backgroundColor: 'var(--shifa-light)', color: 'var(--shifa-blue)' }}
            >
              {t.newsGeneral}
            </span>
          </div>
          <p className="text-xs mb-3" style={{ color: 'var(--shifa-gray)' }}>
            {t.newsDisclaimer}
          </p>

          {newsLoading ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {news.map((n) => (
                <article
                  key={n.id}
                  className="flex items-start gap-3 p-3.5 rounded-2xl"
                  style={{ backgroundColor: 'var(--shifa-surface-2)', border: '1px solid var(--border)' }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: 'var(--shifa-light)' }}
                    aria-hidden="true"
                  >
                    <NewsIcon className="w-4 h-4" style={{ color: 'var(--shifa-blue)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-snug" style={{ color: 'var(--shifa-dark)' }}>{n.title}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span
                        className="px-1.5 py-0.5 rounded text-xs font-semibold"
                        style={{ backgroundColor: 'var(--shifa-light)', color: 'var(--shifa-blue)', fontSize: '10px' }}
                      >
                        {n.category}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--shifa-gray)', fontSize: '11px' }}>{n.date}</span>
                      <span className="text-xs" style={{ color: 'var(--shifa-gray)', fontSize: '11px' }}>· {n.readTime}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}