'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface SurveyQuestion {
  id: string;
  question: string;
  type: 'stars' | 'radio' | 'textarea';
  options?: string[];
}

const questions: SurveyQuestion[] = [
  { id: 'q1', question: 'Comment évaluez-vous la qualité globale de votre consultation ?', type: 'stars' },
  { id: 'q2', question: 'Le médecin a-t-il bien répondu à vos questions ?', type: 'stars' },
  { id: 'q3', question: 'Comment était la qualité de la connexion vidéo/audio ?', type: 'stars' },
  {
    id: 'q4',
    question: 'Recommanderiez-vous la téléconsultation SHIFA à un proche ?',
    type: 'radio',
    options: ['Oui, certainement', 'Probablement oui', 'Probablement non', 'Non'],
  },
  {
    id: 'q5',
    question: 'Qu\'est-ce qui pourrait être amélioré ?',
    type: 'radio',
    options: ['Rien, tout était parfait', 'La qualité vidéo', 'Le temps d\'attente', 'L\'interface', 'La durée de consultation', 'Autre'],
  },
  { id: 'q6', question: 'Avez-vous des commentaires ou suggestions supplémentaires ?', type: 'textarea' },
];

export default function PatientPostcallSurveyContent() {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [hovered, setHovered] = useState<Record<string, number>>({});
  const [radioAnswers, setRadioAnswers] = useState<Record<string, string>>({});
  const [textAnswers, setTextAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const answeredCount = questions.filter(q => {
    if (q.type === 'stars') return ratings[q.id] !== undefined;
    if (q.type === 'radio') return radioAnswers[q.id] !== undefined;
    return true; // textarea optional
  }).length;

  const requiredCount = questions.filter(q => q.type !== 'textarea').length;

  if (submitted) {
    return (
      <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-md mx-auto">
        <div className="card-base p-10 text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: 'linear-gradient(135deg,rgba(0,102,255,0.12),rgba(0,180,216,0.12))', border: '2px solid rgba(0,102,255,0.2)' }}>
            <Icon name="HeartIcon" size={40} style={{ color: '#0066ff' }} />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Merci pour votre avis !</h2>
          <p className="text-sm mb-2" style={{ color: 'var(--muted-foreground)' }}>
            Votre évaluation a été transmise à l'équipe SHIFA et à {' '}
            <span className="font-semibold" style={{ color: 'var(--foreground)' }}>Dr. Mohamed Sy</span>.
          </p>
          <p className="text-sm mb-8" style={{ color: 'var(--muted-foreground)' }}>
            Votre retour nous aide à améliorer continuellement l'expérience de téléconsultation.
          </p>

          {/* Summary */}
          <div className="rounded-xl p-4 mb-8 text-left" style={{ backgroundColor: 'var(--muted)' }}>
            <p className="text-xs font-semibold mb-3 uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>Résumé de votre évaluation</p>
            <div className="space-y-2">
              {questions.filter(q => q.type === 'stars').map(q => (
                <div key={q.id} className="flex items-center justify-between">
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{q.question.replace('Comment évaluez-vous ', '').replace(' ?', '')}</p>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Icon key={s} name="StarIcon" size={14}
                        style={{ color: s <= (ratings[q.id] || 0) ? '#f59e0b' : 'var(--border)' }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/patient-home"
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: '#0066ff' }}>
              <Icon name="HomeIcon" size={16} />
              Retour à l'accueil
            </Link>
            <Link href="/patient-teleconsultation"
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium border transition-all hover:bg-muted"
              style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
              <Icon name="VideoCameraIcon" size={16} />
              Mes téléconsultations
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-md mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/patient-prescription-receipt" className="flex items-center gap-2 text-sm mb-4 transition-colors hover:opacity-80" style={{ color: 'var(--muted-foreground)' }}>
          <Icon name="ChevronLeftIcon" size={16} />
          Retour à l'ordonnance
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#f59e0b,#f97316)' }}>
            <Icon name="StarIcon" size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Évaluation de la consultation</h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Partagez votre expérience avec Dr. Mohamed Sy</p>
          </div>
        </div>
      </div>

      {/* Session recap */}
      <div className="rounded-xl p-4 mb-6 flex items-center gap-4" style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
          style={{ background: 'linear-gradient(135deg,#059669,#0d9488)' }}>MS</div>
        <div className="flex-1">
          <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Dr. Mohamed Sy — Médecin généraliste</p>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Téléconsultation · 10 août 2026 · 28 minutes</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'rgba(16,185,129,0.12)' }}>
          <Icon name="CheckCircleIcon" size={14} style={{ color: '#10b981' }} />
          <span className="text-xs font-semibold" style={{ color: '#10b981' }}>Terminée</span>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${(answeredCount / requiredCount) * 100}%`, background: 'linear-gradient(90deg,#0066ff,#00b4d8)' }} />
        </div>
        <span className="text-xs font-medium shrink-0" style={{ color: 'var(--muted-foreground)' }}>{answeredCount}/{requiredCount} réponses</span>
      </div>

      {/* Questions */}
      <div className="space-y-5">
        {questions.map((q, qi) => (
          <div key={q.id} className="card-base p-5">
            <p className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
              <span className="text-xs font-bold mr-2 px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: '#0066ff' }}>{qi + 1}</span>
              {q.question}
            </p>

            {q.type === 'stars' && (
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onMouseEnter={() => setHovered(prev => ({ ...prev, [q.id]: star }))}
                    onMouseLeave={() => setHovered(prev => ({ ...prev, [q.id]: 0 }))}
                    onClick={() => setRatings(prev => ({ ...prev, [q.id]: star }))}
                    className="transition-transform hover:scale-110">
                    <Icon name="StarIcon" size={32}
                      style={{ color: star <= (hovered[q.id] || ratings[q.id] || 0) ? '#f59e0b' : 'var(--border)' }} />
                  </button>
                ))}
                {ratings[q.id] && (
                  <span className="ml-2 text-sm font-medium self-center" style={{ color: '#f59e0b' }}>
                    {['', 'Très mauvais', 'Mauvais', 'Correct', 'Bien', 'Excellent'][ratings[q.id]]}
                  </span>
                )}
              </div>
            )}

            {q.type === 'radio' && q.options && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.options.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setRadioAnswers(prev => ({ ...prev, [q.id]: opt }))}
                    className="flex items-center gap-3 p-3 rounded-xl border text-left transition-all"
                    style={{
                      borderColor: radioAnswers[q.id] === opt ? '#0066ff' : 'var(--border)',
                      backgroundColor: radioAnswers[q.id] === opt ? 'rgba(0,102,255,0.08)' : 'transparent',
                    }}>
                    <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                      style={{ borderColor: radioAnswers[q.id] === opt ? '#0066ff' : 'var(--border)' }}>
                      {radioAnswers[q.id] === opt && (
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#0066ff' }} />
                      )}
                    </div>
                    <span className="text-sm" style={{ color: 'var(--foreground)' }}>{opt}</span>
                  </button>
                ))}
              </div>
            )}

            {q.type === 'textarea' && (
              <textarea
                value={textAnswers[q.id] || ''}
                onChange={e => setTextAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                rows={4}
                placeholder="Votre commentaire (optionnel)..."
                className="w-full px-4 py-3 rounded-xl text-sm border outline-none focus:ring-1 resize-none"
                style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Submit */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          {answeredCount < requiredCount ? `Encore ${requiredCount - answeredCount} question(s) obligatoire(s)` : 'Prêt à envoyer !'}
        </p>
        <button
          onClick={handleSubmit}
          disabled={answeredCount < requiredCount}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#0066ff' }}>
          <Icon name="PaperAirplaneIcon" size={16} />
          Envoyer mon évaluation
        </button>
      </div>
    </div>
  );
}
