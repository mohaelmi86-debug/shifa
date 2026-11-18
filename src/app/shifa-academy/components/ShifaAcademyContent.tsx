'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import Link from 'next/link';

type Tab = 'catalog' | 'mycourses' | 'viewer' | 'examens' | 'certificates' | 'instructor' | 'universite' | 'emploi' | 'workforce';

const courses = [
  { id: 1, title: 'Télémédecine en Afrique subsaharienne', category: 'Numérique', level: 'Débutant', duration: '4h 30min', enrolled: 1247, rating: 4.8, instructor: 'Dr. Aminata Koné', color: '#0ea5e9', bg: '#e0f2fe', progress: 0, certified: false, modules: 8, price: 'Gratuit' },
  { id: 2, title: 'Prise en charge du paludisme grave', category: 'Infectiologie', level: 'Avancé', duration: '6h 15min', enrolled: 892, rating: 4.9, instructor: 'Pr. Oumar Diallo', color: '#ef4444', bg: '#fee2e2', progress: 65, certified: false, modules: 12, price: '25 000 FCFA' },
  { id: 3, title: 'Échographie obstétricale de base', category: 'Gynécologie', level: 'Intermédiaire', duration: '8h', enrolled: 634, rating: 4.7, instructor: 'Dr. Mariama Sow', color: '#8b5cf6', bg: '#ede9fe', progress: 100, certified: true, modules: 15, price: '35 000 FCFA' },
  { id: 4, title: 'Urgences pédiatriques tropicales', category: 'Pédiatrie', level: 'Avancé', duration: '5h 45min', enrolled: 521, rating: 4.6, instructor: 'Dr. Ibrahima Ndiaye', color: '#f59e0b', bg: '#fef3c7', progress: 30, certified: false, modules: 10, price: '30 000 FCFA' },
  { id: 5, title: 'Diabète et maladies chroniques', category: 'Endocrinologie', level: 'Intermédiaire', duration: '3h 20min', enrolled: 1089, rating: 4.8, instructor: 'Dr. Fatou Traoré', color: '#10b981', bg: '#d1fae5', progress: 0, certified: false, modules: 7, price: 'Gratuit' },
  { id: 6, title: 'Santé mentale en contexte africain', category: 'Psychiatrie', level: 'Débutant', duration: '4h', enrolled: 743, rating: 4.5, instructor: 'Dr. Cheikh Ba', color: '#06b6d4', bg: '#cffafe', progress: 0, certified: false, modules: 9, price: '20 000 FCFA' },
];

const courseModules = [
  { id: 1, title: 'Introduction à la télémédecine', type: 'video', duration: '18 min', done: true },
  { id: 2, title: 'Cadre réglementaire en Afrique', type: 'document', duration: '12 min', done: true },
  { id: 3, title: 'Équipements et connectivité', type: 'video', duration: '25 min', done: true },
  { id: 4, title: 'Consultation à distance — pratique', type: 'video', duration: '32 min', done: false },
  { id: 5, title: 'Cas cliniques interactifs', type: 'interactive', duration: '20 min', done: false },
  { id: 6, title: 'Examen final — Module 1', type: 'quiz', duration: '45 min', done: false },
];

// Premium exam bank
const examBank = [
  {
    id: 'ex1',
    title: 'Examen final — Télémédecine en Afrique',
    course: 'Télémédecine en Afrique subsaharienne',
    type: 'QCM',
    duration: 45,
    questions: 30,
    passMark: 70,
    attempts: 2,
    maxAttempts: 3,
    lastScore: 78,
    status: 'passed',
    color: '#0ea5e9',
    bg: '#e0f2fe',
    certifiesOn: 'Médecin Téléconsultant Certifié SHIFA',
    university: null,
    availableUntil: '31 déc. 2026',
  },
  {
    id: 'ex2',
    title: 'Évaluation mi-parcours — Paludisme',
    course: 'Prise en charge du paludisme grave',
    type: 'Cas clinique',
    duration: 60,
    questions: 15,
    passMark: 75,
    attempts: 1,
    maxAttempts: 2,
    lastScore: null,
    status: 'available',
    color: '#ef4444',
    bg: '#fee2e2',
    certifiesOn: null,
    university: null,
    availableUntil: '15 sept. 2026',
  },
  {
    id: 'ex3',
    title: 'Examen universitaire — Pharmacologie clinique',
    course: 'Pharmacologie clinique avancée',
    type: 'QCM + Rédaction',
    duration: 90,
    questions: 40,
    passMark: 80,
    attempts: 0,
    maxAttempts: 1,
    lastScore: null,
    status: 'scheduled',
    color: '#7c3aed',
    bg: '#ede9fe',
    certifiesOn: 'Certificat Pharmacologie — Université Cheikh Anta Diop',
    university: 'Université Cheikh Anta Diop',
    availableUntil: '20 sept. 2026',
  },
  {
    id: 'ex4',
    title: 'Quiz de validation — Urgences pédiatriques',
    course: 'Urgences pédiatriques tropicales',
    type: 'QCM',
    duration: 30,
    questions: 20,
    passMark: 70,
    attempts: 1,
    maxAttempts: 3,
    lastScore: 58,
    status: 'failed',
    color: '#f59e0b',
    bg: '#fef3c7',
    certifiesOn: null,
    university: null,
    availableUntil: '30 sept. 2026',
  },
  {
    id: 'ex5',
    title: 'Examen final — Épidémiologie tropicale',
    course: 'Épidémiologie des maladies tropicales',
    type: 'QCM + Analyse de données',
    duration: 75,
    questions: 35,
    passMark: 70,
    attempts: 0,
    maxAttempts: 2,
    lastScore: null,
    status: 'locked',
    color: '#06b6d4',
    bg: '#cffafe',
    certifiesOn: 'Certificat Épidémiologie — Université de Bamako',
    university: 'Université de Bamako',
    availableUntil: '10 oct. 2026',
  },
];

// Active exam questions
const activeExamQuestions = [
  {
    id: 1,
    question: 'Quelle est la principale contrainte de la télémédecine en Afrique subsaharienne ?',
    options: ['Le coût des équipements', 'La connectivité Internet', 'La formation des médecins', 'La réglementation'],
    correct: 1,
    explanation: 'La connectivité Internet reste le principal obstacle, avec moins de 40% de couverture haut débit dans les zones rurales.',
  },
  {
    id: 2,
    question: 'Quel équipement est indispensable pour une téléconsultation de qualité ?',
    options: ['Scanner IRM', 'Caméra HD + microphone', 'Tensiomètre connecté', 'Stéthoscope numérique'],
    correct: 1,
    explanation: 'Une caméra HD et un microphone de qualité sont les équipements de base pour toute téléconsultation.',
  },
  {
    id: 3,
    question: 'La télémédecine peut-elle remplacer totalement la consultation en présentiel ?',
    options: ['Oui, dans tous les cas', 'Non, jamais', 'Partiellement, selon le contexte clinique', 'Uniquement pour les urgences'],
    correct: 2,
    explanation: 'La télémédecine complète mais ne remplace pas la consultation physique, notamment pour les examens cliniques.',
  },
  {
    id: 4,
    question: 'Quel cadre réglementaire encadre la télémédecine au Sénégal ?',
    options: ['Loi 2019-14', 'Décret 2020-1234', 'Arrêté ministériel 2021', 'Aucun cadre spécifique'],
    correct: 0,
    explanation: 'La loi 2019-14 relative à la santé numérique encadre la pratique de la télémédecine au Sénégal.',
  },
  {
    id: 5,
    question: 'Quelle est la durée maximale recommandée pour une téléconsultation standard ?',
    options: ['10 minutes', '20 minutes', '30 minutes', '60 minutes'],
    correct: 2,
    explanation: 'Une durée de 30 minutes est recommandée pour permettre un entretien complet tout en maintenant la concentration.',
  },
];

const certifications = [
  { id: 1, name: 'Médecin Téléconsultant Certifié SHIFA', course: 'Télémédecine en Afrique', date: '15/03/2026', expires: '15/03/2028', status: 'valide', color: '#16a34a', bg: '#dcfce7', icon: 'VideoCameraIcon', score: 92 },
  { id: 2, name: 'Praticien Urgences Tropicales', course: 'Urgences pédiatriques tropicales', date: '20/01/2026', expires: '20/01/2027', status: 'valide', color: '#16a34a', bg: '#dcfce7', icon: 'BoltIcon', score: 88 },
  { id: 3, name: 'Échographie Obstétricale Niveau 1', course: 'Échographie obstétricale de base', date: '05/06/2025', expires: '05/06/2026', status: 'expire_bientot', color: '#ca8a04', bg: '#fef9c3', icon: 'HeartIcon', score: 95 },
];

const instructorCourses = [
  { id: 1, title: 'Télémédecine en Afrique subsaharienne', enrolled: 1247, rating: 4.8, revenue: '0 FCFA', status: 'publié', completions: 892 },
  { id: 2, title: 'Urgences pédiatriques tropicales', enrolled: 521, rating: 4.6, revenue: '15 630 000 FCFA', status: 'publié', completions: 312 },
];

const progressData = [
  { semaine: 'S1', heures: 2.5 },
  { semaine: 'S2', heures: 4 },
  { semaine: 'S3', heures: 1.5 },
  { semaine: 'S4', heures: 3 },
  { semaine: 'S5', heures: 5 },
  { semaine: 'S6', heures: 3.5 },
];

const examScoreHistory = [
  { date: 'Jan', score: 72 },
  { date: 'Fév', score: 78 },
  { date: 'Mar', score: 85 },
  { date: 'Avr', score: 82 },
  { date: 'Mai', score: 88 },
  { date: 'Juin', score: 92 },
];

const levelColors: Record<string, { bg: string; text: string }> = {
  'Débutant': { bg: '#dcfce7', text: '#16a34a' },
  'Intermédiaire': { bg: '#fef9c3', text: '#ca8a04' },
  'Avancé': { bg: '#fee2e2', text: '#dc2626' },
};

const universityCourses = [
  { id: 'u1', title: 'Pharmacologie clinique avancée', university: 'Université Cheikh Anta Diop', category: 'Pharmacologie', level: 'Avancé', duration: '12h', credits: 2, price: '45 000 FCFA', enrolled: 234, rating: 4.9, color: '#7c3aed', bg: '#ede9fe', openTo: 'Professionnels de santé', startDate: '15 Sep 2026', seats: 30, seatsLeft: 8 },
  { id: 'u2', title: 'Épidémiologie des maladies tropicales', university: 'Université de Bamako', category: 'Santé publique', level: 'Intermédiaire', duration: '8h', credits: 1, price: 'Gratuit', enrolled: 892, rating: 4.7, color: '#0ea5e9', bg: '#e0f2fe', openTo: 'Tous professionnels', startDate: '01 Oct 2026', seats: 100, seatsLeft: 42 },
  { id: 'u3', title: 'Chirurgie laparoscopique — bases', university: 'Université de Lomé', category: 'Chirurgie', level: 'Avancé', duration: '20h', credits: 3, price: '80 000 FCFA', enrolled: 78, rating: 4.8, color: '#ef4444', bg: '#fee2e2', openTo: 'Chirurgiens, internes', startDate: '20 Sep 2026', seats: 20, seatsLeft: 5 },
  { id: 'u4', title: 'Santé mentale et psychiatrie communautaire', university: 'Université de Ouagadougou', category: 'Psychiatrie', level: 'Intermédiaire', duration: '6h', credits: 1, price: '20 000 FCFA', enrolled: 445, rating: 4.6, color: '#06b6d4', bg: '#cffafe', openTo: 'Tous professionnels', startDate: '10 Oct 2026', seats: 60, seatsLeft: 22 },
  { id: 'u5', title: 'Gestion des urgences obstétricales', university: 'Université de Conakry', category: 'Gynécologie', level: 'Avancé', duration: '10h', credits: 2, price: '35 000 FCFA', enrolled: 167, rating: 4.9, color: '#ec4899', bg: '#fce7f3', openTo: 'Gynécologues, sages-femmes', startDate: '05 Oct 2026', seats: 25, seatsLeft: 11 },
  { id: 'u6', title: 'Intelligence artificielle en médecine', university: 'Université Virtuelle du Sénégal', category: 'Numérique', level: 'Débutant', duration: '5h', credits: 1, price: 'Gratuit', enrolled: 1340, rating: 4.5, color: '#10b981', bg: '#d1fae5', openTo: 'Tous professionnels', startDate: '01 Sep 2026', seats: 500, seatsLeft: 187 },
];

const universityPartners = [
  { name: 'Université Cheikh Anta Diop', country: 'Sénégal', courses: 12, students: 890, color: '#7c3aed' },
  { name: 'Université de Bamako', country: 'Mali', courses: 8, students: 654, color: '#0ea5e9' },
  { name: 'Université de Lomé', country: 'Togo', courses: 6, students: 312, color: '#ef4444' },
  { name: 'Université de Ouagadougou', country: 'Burkina Faso', courses: 9, students: 445, color: '#06b6d4' },
  { name: 'Université de Conakry', country: 'Guinée', courses: 5, students: 234, color: '#ec4899' },
  { name: 'Université Virtuelle du Sénégal', country: 'Sénégal', courses: 15, students: 2100, color: '#10b981' },
];

const examStatusConfig: Record<string, { label: string; bg: string; text: string; icon: string }> = {
  passed: { label: 'Réussi', bg: '#dcfce7', text: '#16a34a', icon: 'CheckCircleIcon' },
  failed: { label: 'Échoué', bg: '#fee2e2', text: '#dc2626', icon: 'XCircleIcon' },
  available: { label: 'Disponible', bg: '#dbeafe', text: '#2563eb', icon: 'PlayCircleIcon' },
  scheduled: { label: 'Planifié', bg: '#fef3c7', text: '#d97706', icon: 'CalendarIcon' },
  locked: { label: 'Verrouillé', bg: '#f1f5f9', text: '#64748b', icon: 'LockClosedIcon' },
};

export default function ShifaAcademyContent() {
  const [activeTab, setActiveTab] = useState<Tab>('catalog');
  const [search, setSearch] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('Tous');
  const [uniFilter, setUniFilter] = useState('Tous');
  const [enrolledUni, setEnrolledUni] = useState<string[]>([]);
  const [activeExam, setActiveExam] = useState<string | null>(null);
  const [examAnswers, setExamAnswers] = useState<Record<number, number>>({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examTimeLeft, setExamTimeLeft] = useState(45 * 60);
  const [examStarted, setExamStarted] = useState(false);
  const [showExamReview, setShowExamReview] = useState(false);

  const categories = ['Tous', ...Array.from(new Set(courses.map(c => c.category)))];

  const filtered = courses.filter(c =>
    (categoryFilter === 'Tous' || c.category === categoryFilter) &&
    (c.title.toLowerCase().includes(search.toLowerCase()) || c.category.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredUni = universityCourses.filter(c =>
    (uniFilter === 'Tous' || c.university === uniFilter) &&
    (c.title.toLowerCase().includes(search.toLowerCase()) || c.category.toLowerCase().includes(search.toLowerCase()))
  );

  const quizScore = quizSubmitted
    ? activeExamQuestions.filter(q => quizAnswers[q.id] === q.correct).length
    : 0;

  const examScore = examSubmitted
    ? Math.round((activeExamQuestions.filter(q => examAnswers[q.id] === q.correct).length / activeExamQuestions.length) * 100)
    : 0;

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'catalog', label: 'Catalogue', icon: 'BookOpenIcon' },
    { key: 'mycourses', label: 'Mes formations', icon: 'AcademicCapIcon' },
    { key: 'universite', label: 'Universités', icon: 'BuildingLibraryIcon' },
    { key: 'viewer', label: 'Lecteur de cours', icon: 'PlayCircleIcon' },
    { key: 'examens', label: 'Examens & Évaluations', icon: 'ClipboardDocumentCheckIcon' },
    { key: 'certificates', label: 'Certificats', icon: 'StarIcon' },
    { key: 'instructor', label: 'Espace Formateur', icon: 'UserGroupIcon' },
    { key: 'workforce', label: 'Workforce & Habilitations', icon: 'ShieldCheckIcon' },
  ];

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center justify-between" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)' }}>
            <Icon name="AcademicCapIcon" size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-heading)' }}>SHIFA Academy</h1>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Formation médicale continue · Universités partenaires · Certifications</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold" style={{ color: 'var(--foreground)' }}>28h de formation</p>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>3 certifications obtenues</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b px-6 overflow-x-auto" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex gap-0">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
              style={{ borderColor: activeTab === tab.key ? '#8b5cf6' : 'transparent', color: activeTab === tab.key ? '#8b5cf6' : 'var(--muted-foreground)' }}>
              <Icon name={tab.icon as any} size={15} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">

        {/* ── CATALOG ── */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Formations disponibles', value: '124', icon: 'BookOpenIcon', color: '#0ea5e9' },
                { label: 'Mes formations', value: '4', icon: 'AcademicCapIcon', color: '#8b5cf6' },
                { label: 'Certifications obtenues', value: '3', icon: 'StarIcon', color: '#f59e0b' },
                { label: 'Heures de formation', value: '28h', icon: 'ClockIcon', color: '#10b981' },
              ].map((k, i) => (
                <div key={i} className="rounded-2xl p-4 border relative overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: k.color }} />
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: k.color + '20' }}>
                      <Icon name={k.icon as any} size={16} style={{ color: k.color }} />
                    </div>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{k.label}</span>
                  </div>
                  <p className="text-2xl font-bold" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-heading)' }}>{k.value}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3 flex-wrap">
              <div className="relative flex-1 min-w-48">
                <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Rechercher une formation..."
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border outline-none"
                  style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map(cat => (
                  <button key={cat} onClick={() => setCategoryFilter(cat)}
                    className="px-3 py-2 rounded-xl text-xs font-medium border transition-colors"
                    style={{ backgroundColor: categoryFilter === cat ? '#8b5cf6' : 'var(--card)', color: categoryFilter === cat ? '#fff' : 'var(--muted-foreground)', borderColor: 'var(--border)' }}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(course => (
                <div key={course.id} className="rounded-2xl border overflow-hidden hover:shadow-md transition-shadow cursor-pointer" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="h-3" style={{ backgroundColor: course.color }} />
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: course.bg, color: course.color }}>{course.category}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: levelColors[course.level]?.bg, color: levelColors[course.level]?.text }}>{course.level}</span>
                    </div>
                    <h3 className="text-sm font-semibold mb-1 leading-snug" style={{ color: 'var(--foreground)' }}>{course.title}</h3>
                    <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>{course.instructor}</p>
                    <div className="flex items-center justify-between text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>
                      <span className="flex items-center gap-1"><Icon name="ClockIcon" size={12} />{course.duration}</span>
                      <span className="flex items-center gap-1"><Icon name="RectangleStackIcon" size={12} />{course.modules} modules</span>
                      <span className="flex items-center gap-1"><Icon name="StarIcon" size={12} style={{ color: '#f59e0b' }} />{course.rating}</span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold" style={{ color: course.price === 'Gratuit' ? '#16a34a' : course.color }}>{course.price}</span>
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{course.enrolled.toLocaleString()} inscrits</span>
                    </div>
                    {course.progress > 0 && (
                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>
                          <span>Progression</span><span>{course.progress}%</span>
                        </div>
                        <div className="h-1.5 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                          <div className="h-1.5 rounded-full transition-all" style={{ width: `${course.progress}%`, backgroundColor: course.color }} />
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => { setSelectedCourse(course.id); setActiveTab('viewer'); }}
                      className="w-full py-2 rounded-xl text-xs font-medium text-white"
                      style={{ backgroundColor: course.progress === 100 ? '#16a34a' : course.color }}>
                      {course.progress === 100 ? '✓ Terminé — Voir certificat' : course.progress > 0 ? 'Continuer' : 'Commencer'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── MY COURSES ── */}
        {activeTab === 'mycourses' && (
          <div className="space-y-6">
            <div className="rounded-2xl p-5 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Heures de formation par semaine</h3>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="semaine" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
                  <Bar dataKey="heures" name="Heures" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {courses.filter(c => c.progress > 0).map(course => (
                <div key={course.id} className="rounded-2xl border p-4 flex items-center gap-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: course.bg }}>
                    <Icon name="BookOpenIcon" size={22} style={{ color: course.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold mb-0.5" style={{ color: 'var(--foreground)' }}>{course.title}</h3>
                    <p className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>{course.instructor} · {course.duration} · {course.modules} modules</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                        <div className="h-1.5 rounded-full" style={{ width: `${course.progress}%`, backgroundColor: course.color }} />
                      </div>
                      <span className="text-xs font-medium shrink-0" style={{ color: course.color }}>{course.progress}%</span>
                    </div>
                  </div>
                  <button
                    onClick={() => { setSelectedCourse(course.id); setActiveTab('viewer'); }}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium text-white shrink-0"
                    style={{ backgroundColor: course.color }}>
                    {course.progress === 100 ? 'Revoir' : 'Continuer'}
                  </button>
                </div>
              ))}
              {enrolledUni.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-3 mt-4" style={{ color: 'var(--foreground)' }}>Formations universitaires inscrites</h3>
                  {universityCourses.filter(c => enrolledUni.includes(c.id)).map(course => (
                    <div key={course.id} className="rounded-2xl border p-4 flex items-center gap-4 mb-3" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: course.bg }}>
                        <Icon name="BuildingLibraryIcon" size={22} style={{ color: course.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold mb-0.5" style={{ color: 'var(--foreground)' }}>{course.title}</h3>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{course.university} · {course.duration} · {course.credits} crédit(s)</p>
                        <p className="text-xs mt-0.5" style={{ color: '#8b5cf6' }}>Début : {course.startDate}</p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>Inscrit</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── UNIVERSITÉS ── */}
        {activeTab === 'universite' && (
          <div className="space-y-6">
            <div className="rounded-2xl p-5 border" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(6,182,212,0.1))', borderColor: 'var(--border)' }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)' }}>
                  <Icon name="BuildingLibraryIcon" size={22} className="text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold mb-1" style={{ color: 'var(--foreground)' }}>Formations continues universitaires</h2>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    Les universités partenaires de SHIFA Academy proposent leurs cours de formation continue aux professionnels de santé.
                  </p>
                  <div className="flex gap-4 mt-3 flex-wrap">
                    {[
                      { label: '6 universités partenaires', icon: 'BuildingLibraryIcon', color: '#8b5cf6' },
                      { label: '55 cours disponibles', icon: 'BookOpenIcon', color: '#0ea5e9' },
                      { label: 'Crédits reconnus', icon: 'AcademicCapIcon', color: '#10b981' },
                      { label: 'Accès hybride', icon: 'ComputerDesktopIcon', color: '#f59e0b' },
                    ].map((b, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs font-medium" style={{ color: b.color }}>
                        <Icon name={b.icon as any} size={13} />
                        {b.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Universités partenaires</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {universityPartners.map(uni => (
                  <button
                    key={uni.name}
                    onClick={() => setUniFilter(uniFilter === uni.name ? 'Tous' : uni.name)}
                    className="rounded-xl border p-3 text-left transition-all hover:shadow-sm"
                    style={{ backgroundColor: uniFilter === uni.name ? uni.color + '15' : 'var(--card)', borderColor: uniFilter === uni.name ? uni.color : 'var(--border)' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: uni.color + '20' }}>
                      <Icon name="BuildingLibraryIcon" size={16} style={{ color: uni.color }} />
                    </div>
                    <p className="text-xs font-semibold leading-tight mb-0.5" style={{ color: 'var(--foreground)' }}>{uni.name}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{uni.country}</p>
                    <p className="text-xs mt-1" style={{ color: uni.color }}>{uni.courses} cours · {uni.students} inscrits</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher une formation universitaire..."
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border outline-none"
                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUni.map(course => (
                <div key={course.id} className="rounded-2xl border overflow-hidden hover:shadow-md transition-shadow" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="h-2" style={{ backgroundColor: course.color }} />
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: course.bg, color: course.color }}>{course.category}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: levelColors[course.level]?.bg, color: levelColors[course.level]?.text }}>{course.level}</span>
                    </div>
                    <h3 className="text-sm font-semibold mb-1 leading-snug" style={{ color: 'var(--foreground)' }}>{course.title}</h3>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon name="BuildingLibraryIcon" size={12} style={{ color: course.color }} />
                      <p className="text-xs font-medium" style={{ color: course.color }}>{course.university}</p>
                    </div>
                    <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>Ouvert à : {course.openTo}</p>
                    <div className="grid grid-cols-2 gap-2 mb-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      <span className="flex items-center gap-1"><Icon name="ClockIcon" size={11} />{course.duration}</span>
                      <span className="flex items-center gap-1"><Icon name="AcademicCapIcon" size={11} />{course.credits} crédit(s)</span>
                      <span className="flex items-center gap-1"><Icon name="CalendarIcon" size={11} />Début {course.startDate}</span>
                      <span className="flex items-center gap-1"><Icon name="UserGroupIcon" size={11} />{course.seatsLeft} places restantes</span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold" style={{ color: course.price === 'Gratuit' ? '#16a34a' : course.color }}>{course.price}</span>
                      <div className="flex items-center gap-1 text-xs" style={{ color: '#f59e0b' }}>
                        <Icon name="StarIcon" size={11} />
                        <span>{course.rating}</span>
                        <span style={{ color: 'var(--muted-foreground)' }}>({course.enrolled})</span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>
                        <span>Places disponibles</span>
                        <span>{course.seatsLeft}/{course.seats}</span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                        <div className="h-1.5 rounded-full" style={{ width: `${((course.seats - course.seatsLeft) / course.seats) * 100}%`, backgroundColor: course.color }} />
                      </div>
                    </div>
                    <button
                      onClick={() => setEnrolledUni(prev => prev.includes(course.id) ? prev.filter(id => id !== course.id) : [...prev, course.id])}
                      className="w-full py-2 rounded-xl text-xs font-medium text-white transition-all"
                      style={{ backgroundColor: enrolledUni.includes(course.id) ? '#16a34a' : course.color }}>
                      {enrolledUni.includes(course.id) ? '✓ Inscrit — Voir dans Mes formations' : "S'inscrire à cette formation"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(139,92,246,0.1)' }}>
                  <Icon name="PlusCircleIcon" size={20} style={{ color: '#8b5cf6' }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--foreground)' }}>Vous êtes une université ou école de santé ?</h3>
                  <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>
                    Proposez vos formations continues sur SHIFA Academy et touchez des milliers de professionnels de santé en Afrique.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <a href="/espace-universite" className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-white" style={{ backgroundColor: '#8b5cf6' }}>
                      <Icon name="BuildingLibraryIcon" size={13} /> Accéder à l'espace université
                    </a>
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                      <Icon name="EnvelopeIcon" size={13} /> Demander un partenariat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── VIEWER ── */}
        {activeTab === 'viewer' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="aspect-video flex items-center justify-center" style={{ backgroundColor: '#0f172a' }}>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                      <Icon name="PlayIcon" size={32} className="text-white" />
                    </div>
                    <p className="text-white text-sm font-medium">Consultation à distance — pratique</p>
                    <p className="text-white/60 text-xs mt-1">32 min · Module 4/8</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Consultation à distance — pratique</h3>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>32 min</span>
                  </div>
                  <div className="h-1.5 rounded-full mb-3" style={{ backgroundColor: 'var(--muted)' }}>
                    <div className="h-1.5 rounded-full" style={{ width: '45%', backgroundColor: '#8b5cf6' }} />
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: '#8b5cf6' }}>
                      <Icon name="PlayIcon" size={14} /> Reprendre
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                      <Icon name="ArrowDownTrayIcon" size={14} /> Ressources
                    </button>
                    <button onClick={() => setActiveTab('examens')} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border" style={{ borderColor: '#8b5cf6', color: '#8b5cf6' }}>
                      <Icon name="ClipboardDocumentCheckIcon" size={14} /> Passer l'examen
                    </button>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Notes du cours</h4>
                <textarea
                  placeholder="Prenez vos notes ici..."
                  rows={4}
                  className="w-full px-3 py-2 text-sm rounded-xl border outline-none resize-none"
                  style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                />
                <button className="mt-2 px-3 py-1.5 rounded-xl text-xs font-medium text-white" style={{ backgroundColor: '#8b5cf6' }}>Sauvegarder</button>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Modules du cours</h3>
              {courseModules.map(mod => (
                <div key={mod.id} className="rounded-xl border p-3 flex items-center gap-3 cursor-pointer hover:bg-muted/40 transition-colors" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: mod.done ? '#dcfce7' : 'var(--muted)' }}>
                    <Icon name={mod.done ? 'CheckIcon' : mod.type === 'video' ? 'PlayIcon' : mod.type === 'quiz' ? 'ClipboardDocumentCheckIcon' : 'DocumentTextIcon'} size={14} style={{ color: mod.done ? '#16a34a' : 'var(--muted-foreground)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: 'var(--foreground)' }}>{mod.title}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{mod.type} · {mod.duration}</p>
                  </div>
                  {mod.type === 'quiz' && !mod.done && (
                    <button onClick={() => setActiveTab('examens')} className="text-xs px-2 py-1 rounded-lg text-white shrink-0" style={{ backgroundColor: '#8b5cf6' }}>Examen</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── EXAMENS & ÉVALUATIONS (PREMIUM) ── */}
        {activeTab === 'examens' && (
          <div className="space-y-6">
            {/* Active exam session */}
            {activeExam && !examSubmitted ? (
              <div className="space-y-4">
                {/* Exam header with timer */}
                <div className="rounded-2xl p-4 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #0f172a, #1e1b4b)', border: '1px solid rgba(139,92,246,0.3)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(139,92,246,0.2)' }}>
                      <Icon name="ClipboardDocumentCheckIcon" size={20} style={{ color: '#8b5cf6' }} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-white">Examen en cours</p>
                      <p className="text-xs text-white/60">{activeExamQuestions.length} questions · Score minimum : 70%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold font-mono" style={{ color: examTimeLeft < 300 ? '#ef4444' : '#8b5cf6' }}>
                        {formatTime(examTimeLeft)}
                      </p>
                      <p className="text-xs text-white/60">Temps restant</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-white">{Object.keys(examAnswers).length}/{activeExamQuestions.length}</p>
                      <p className="text-xs text-white/60">Répondues</p>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${(Object.keys(examAnswers).length / activeExamQuestions.length) * 100}%`, backgroundColor: '#8b5cf6' }}
                  />
                </div>

                {/* Questions */}
                <div className="space-y-6">
                  {activeExamQuestions.map((q, qi) => (
                    <div key={q.id} className="card-base">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold text-white" style={{ backgroundColor: examAnswers[q.id] !== undefined ? '#8b5cf6' : 'var(--muted-foreground)' }}>
                          {qi + 1}
                        </div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{q.question}</p>
                      </div>
                      <div className="space-y-2 ml-10">
                        {q.options.map((opt, oi) => (
                          <button
                            key={oi}
                            onClick={() => setExamAnswers(prev => ({ ...prev, [q.id]: oi }))}
                            className="w-full text-left px-4 py-3 rounded-xl border text-sm transition-all"
                            style={{
                              backgroundColor: examAnswers[q.id] === oi ? 'rgba(139,92,246,0.1)' : 'var(--background)',
                              borderColor: examAnswers[q.id] === oi ? '#8b5cf6' : 'var(--border)',
                              color: examAnswers[q.id] === oi ? '#8b5cf6' : 'var(--foreground)',
                            }}>
                            <span className="font-medium mr-2">{String.fromCharCode(65 + oi)}.</span>{opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={() => { setActiveExam(null); setExamAnswers({}); }} className="btn-secondary flex-1 py-3 text-sm">
                    Abandonner l'examen
                  </button>
                  <button
                    onClick={() => setExamSubmitted(true)}
                    disabled={Object.keys(examAnswers).length < activeExamQuestions.length}
                    className="btn-primary flex-1 py-3 text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Icon name="CheckIcon" size={16} />
                    Soumettre ({Object.keys(examAnswers).length}/{activeExamQuestions.length})
                  </button>
                </div>
              </div>
            ) : examSubmitted ? (
              /* Exam results */
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="card-base text-center py-8">
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: examScore >= 70 ? '#dcfce7' : '#fee2e2' }}
                  >
                    <span className="text-3xl font-extrabold" style={{ color: examScore >= 70 ? '#16a34a' : '#dc2626', fontFamily: 'var(--font-heading)' }}>
                      {examScore}%
                    </span>
                  </div>
                  <h3 className="font-bold text-xl mb-2" style={{ color: 'var(--foreground)' }}>
                    {examScore >= 70 ? '🎉 Examen réussi !' : 'Examen non validé'}
                  </h3>
                  <p className="text-sm mb-1" style={{ color: 'var(--muted-foreground)' }}>
                    {activeExamQuestions.filter(q => examAnswers[q.id] === q.correct).length}/{activeExamQuestions.length} bonnes réponses
                  </p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Score minimum requis : 70%</p>

                  {examScore >= 70 && (
                    <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)' }}>
                      <p className="text-sm font-semibold" style={{ color: '#16a34a' }}>
                        🏆 Certificat débloqué : Médecin Téléconsultant Certifié SHIFA
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3 mt-6 justify-center">
                    {examScore >= 70 ? (
                      <button onClick={() => setActiveTab('certificates')} className="btn-primary px-6 py-2 flex items-center gap-2">
                        <Icon name="StarIcon" size={16} />
                        Voir mon certificat
                      </button>
                    ) : (
                      <button onClick={() => { setExamSubmitted(false); setExamAnswers({}); }} className="btn-primary px-6 py-2">
                        Réessayer
                      </button>
                    )}
                    <button onClick={() => setShowExamReview(!showExamReview)} className="btn-secondary px-6 py-2 flex items-center gap-2">
                      <Icon name="EyeIcon" size={16} />
                      {showExamReview ? 'Masquer' : 'Voir les corrections'}
                    </button>
                  </div>
                </div>

                {/* Corrections */}
                {showExamReview && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Corrections détaillées</h3>
                    {activeExamQuestions.map((q, qi) => {
                      const isCorrect = examAnswers[q.id] === q.correct;
                      return (
                        <div key={q.id} className="card-base" style={{ borderColor: isCorrect ? 'rgba(22,163,74,0.3)' : 'rgba(239,68,68,0.3)' }}>
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold text-white" style={{ backgroundColor: isCorrect ? '#16a34a' : '#dc2626' }}>
                              {qi + 1}
                            </div>
                            <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{q.question}</p>
                          </div>
                          <div className="space-y-1.5 ml-10 mb-3">
                            {q.options.map((opt, oi) => (
                              <div
                                key={oi}
                                className="px-3 py-2 rounded-lg text-xs"
                                style={{
                                  backgroundColor: oi === q.correct ? 'rgba(22,163,74,0.1)' : (examAnswers[q.id] === oi && oi !== q.correct) ? 'rgba(239,68,68,0.1)' : 'var(--background)',
                                  border: `1px solid ${oi === q.correct ? 'rgba(22,163,74,0.3)' : (examAnswers[q.id] === oi && oi !== q.correct) ? 'rgba(239,68,68,0.3)' : 'var(--border)'}`,
                                  color: oi === q.correct ? '#16a34a' : (examAnswers[q.id] === oi && oi !== q.correct) ? '#dc2626' : 'var(--foreground)',
                                }}
                              >
                                <span className="font-medium mr-2">{String.fromCharCode(65 + oi)}.</span>{opt}
                                {oi === q.correct && <span className="ml-2 font-bold">✓ Bonne réponse</span>}
                              </div>
                            ))}
                          </div>
                          <div className="ml-10 p-3 rounded-xl text-xs" style={{ backgroundColor: 'rgba(8,120,239,0.06)', borderLeft: '3px solid var(--shifa-blue)' }}>
                            <span className="font-semibold" style={{ color: 'var(--shifa-blue)' }}>Explication : </span>
                            <span style={{ color: 'var(--foreground)' }}>{q.explanation}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <button onClick={() => { setActiveExam(null); setExamSubmitted(false); setExamAnswers({}); setShowExamReview(false); }} className="btn-secondary w-full py-3">
                  Retour aux examens
                </button>
              </div>
            ) : (
              /* Exam list */
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold" style={{ color: 'var(--shifa-dark)' }}>Examens & Évaluations</h2>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                      Validez vos compétences et obtenez vos certifications SHIFA Academy
                    </p>
                  </div>
                </div>

                {/* Score evolution chart */}
                <div className="card-base">
                  <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Évolution de vos scores</h3>
                  <ResponsiveContainer width="100%" height={120}>
                    <LineChart data={examScoreHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                      <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Exam cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {examBank.map(exam => {
                    const sc = examStatusConfig[exam.status];
                    return (
                      <div key={exam.id} className="card-base relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: exam.color }} />
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: exam.bg }}>
                              <Icon name={sc.icon as any} size={18} style={{ color: exam.color }} />
                            </div>
                            <div>
                              <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{exam.title}</p>
                              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{exam.course}</p>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium shrink-0" style={{ backgroundColor: sc.bg, color: sc.text }}>
                            {sc.label}
                          </span>
                        </div>

                        {exam.university && (
                          <div className="flex items-center gap-1.5 mb-2">
                            <Icon name="BuildingLibraryIcon" size={12} style={{ color: '#7c3aed' }} />
                            <span className="text-xs font-medium" style={{ color: '#7c3aed' }}>{exam.university}</span>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-2 mb-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                          <span className="flex items-center gap-1"><Icon name="ClockIcon" size={11} />{exam.duration} min</span>
                          <span className="flex items-center gap-1"><Icon name="QuestionMarkCircleIcon" size={11} />{exam.questions} questions</span>
                          <span className="flex items-center gap-1"><Icon name="TrophyIcon" size={11} />Seuil : {exam.passMark}%</span>
                          <span className="flex items-center gap-1"><Icon name="ArrowPathIcon" size={11} />{exam.attempts}/{exam.maxAttempts} tentatives</span>
                        </div>

                        {exam.lastScore !== null && (
                          <div className="mb-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Dernier score</span>
                              <span className="text-sm font-bold" style={{ color: exam.lastScore >= exam.passMark ? '#16a34a' : '#dc2626' }}>
                                {exam.lastScore}%
                              </span>
                            </div>
                            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}>
                              <div className="h-full rounded-full" style={{ width: `${exam.lastScore}%`, backgroundColor: exam.lastScore >= exam.passMark ? '#16a34a' : '#dc2626' }} />
                            </div>
                          </div>
                        )}

                        {exam.certifiesOn && (
                          <div className="flex items-center gap-1.5 mb-3 p-2 rounded-lg" style={{ backgroundColor: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                            <Icon name="StarIcon" size={12} style={{ color: '#f59e0b' }} />
                            <span className="text-xs" style={{ color: '#d97706' }}>Certifie : {exam.certifiesOn}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Disponible jusqu'au {exam.availableUntil}</span>
                          {(exam.status === 'available' || exam.status === 'failed') && exam.attempts < exam.maxAttempts && (
                            <button
                              onClick={() => { setActiveExam(exam.id); setExamAnswers({}); setExamTimeLeft(exam.duration * 60); }}
                              className="px-4 py-2 rounded-xl text-xs font-medium text-white flex items-center gap-1.5"
                              style={{ backgroundColor: exam.color }}
                            >
                              <Icon name="PlayIcon" size={12} />
                              {exam.status === 'failed' ? 'Réessayer' : 'Commencer'}
                            </button>
                          )}
                          {exam.status === 'passed' && (
                            <button onClick={() => setActiveTab('certificates')} className="px-4 py-2 rounded-xl text-xs font-medium" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
                              Voir certificat
                            </button>
                          )}
                          {exam.status === 'locked' && (
                            <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                              <Icon name="LockClosedIcon" size={12} />
                              Terminer le cours d'abord
                            </span>
                          )}
                          {exam.status === 'scheduled' && (
                            <span className="flex items-center gap-1 text-xs" style={{ color: '#d97706' }}>
                              <Icon name="CalendarIcon" size={12} />
                              Planifié
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── CERTIFICATES ── */}
        {activeTab === 'certificates' && (
          <div className="space-y-4 max-w-2xl">
            {certifications.map(cert => (
              <div key={cert.id} className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="h-2" style={{ backgroundColor: cert.color }} />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: cert.bg }}>
                        <Icon name={cert.icon as any} size={22} style={{ color: cert.color }} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{cert.name}</h3>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{cert.course}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Obtenu le {cert.date} · Expire le {cert.expires}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: cert.bg, color: cert.color }}>{cert.status === 'valide' ? 'Valide' : 'Expire bientôt'}</span>
                      <span className="text-lg font-bold" style={{ color: cert.color }}>{cert.score}/100</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl mb-4 border" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>CERTIFICAT SHIFA ACADEMY</span>
                      <Icon name="ShieldCheckIcon" size={16} style={{ color: cert.color }} />
                    </div>
                    <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{cert.name}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Délivré à : Dr. Kofi Diallo · Score : {cert.score}/100</p>
                    <p className="text-xs font-mono mt-1" style={{ color: 'var(--muted-foreground)' }}>ID : SHIFA-CERT-{cert.id}-2026-{cert.score}X</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                      <Icon name="ArrowDownTrayIcon" size={13} /> Télécharger PDF
                    </button>
                    <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                      <Icon name="ShareIcon" size={13} /> Partager
                    </button>
                    <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                      <Icon name="LinkIcon" size={13} /> Lien de vérification
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── INSTRUCTOR ── */}
        {activeTab === 'instructor' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Mes cours publiés', value: '2', icon: 'BookOpenIcon', color: '#8b5cf6' },
                { label: 'Apprenants inscrits', value: '1 768', icon: 'UsersIcon', color: '#0ea5e9' },
                { label: 'Revenus générés', value: '15,6M FCFA', icon: 'BanknotesIcon', color: '#10b981' },
                { label: 'Note moyenne', value: '4.7/5', icon: 'StarIcon', color: '#f59e0b' },
              ].map((k, i) => (
                <div key={i} className="rounded-2xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: k.color + '20' }}>
                    <Icon name={k.icon as any} size={16} style={{ color: k.color }} />
                  </div>
                  <p className="text-xl font-bold" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-heading)' }}>{k.value}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{k.label}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Mes cours</h3>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-white" style={{ backgroundColor: '#8b5cf6' }}>
                  <Icon name="PlusIcon" size={13} /> Créer un cours
                </button>
              </div>
              <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {instructorCourses.map(c => (
                  <div key={c.id} className="p-4 flex items-center gap-4 flex-wrap">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(139,92,246,0.1)' }}>
                      <Icon name="BookOpenIcon" size={18} style={{ color: '#8b5cf6' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{c.title}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.enrolled} inscrits · {c.completions} complétions · Note : {c.rating}/5</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-bold" style={{ color: '#10b981' }}>{c.revenue}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>{c.status}</span>
                      <button className="p-1.5 rounded-lg border" style={{ borderColor: 'var(--border)' }}>
                        <Icon name="PencilIcon" size={13} style={{ color: 'var(--muted-foreground)' }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── WORKFORCE & HABILITATIONS ── */}
        {activeTab === 'workforce' && (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 rounded-2xl border" style={{ backgroundColor: 'rgba(139,92,246,0.06)', borderColor: 'rgba(139,92,246,0.2)' }}>
              <Icon name="ArrowsRightLeftIcon" size={20} style={{ color: '#8b5cf6' }} className="shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold mb-1" style={{ color: 'var(--foreground)' }}>SHIFA Academy ↔ Workforce — Connexion habilitations</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  Les certifications obtenues dans SHIFA Academy alimentent automatiquement les habilitations dans Workforce Admin.
                </p>
              </div>
              <Link href="/workforce-admin" className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white shrink-0" style={{ backgroundColor: '#8b5cf6' }}>
                Workforce Admin →
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Formations obligatoires', value: '5', icon: 'ExclamationCircleIcon', color: '#dc2626', bg: '#fee2e2' },
                { label: 'Habilitations actives', value: '3', icon: 'ShieldCheckIcon', color: '#16a34a', bg: '#dcfce7' },
                { label: 'Expirent dans 30j', value: '1', icon: 'ClockIcon', color: '#d97706', bg: '#fef3c7' },
                { label: 'Renouvellements requis', value: '2', icon: 'ArrowPathIcon', color: '#2563eb', bg: '#dbeafe' },
              ].map(kpi => (
                <div key={kpi.label} className="rounded-2xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: kpi.bg }}>
                    <Icon name={kpi.icon as any} size={18} style={{ color: kpi.color }} />
                  </div>
                  <p className="text-2xl font-bold mb-0.5" style={{ color: 'var(--shifa-dark)', fontFamily: 'var(--font-heading)' }}>{kpi.value}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
