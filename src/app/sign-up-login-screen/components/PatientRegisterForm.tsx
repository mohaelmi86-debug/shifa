'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/contexts/AuthContext';
import EmailVerificationModal from './EmailVerificationModal';

interface PatientFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  country: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export default function PatientRegisterForm({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [step, setStep] = useState(1);
  const [pendingEmail, setPendingEmail] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<PatientFormData>();
  const password = watch('password');

  const onSubmit = async (data: PatientFormData) => {
    setIsLoading(true);
    setRegisterError('');
    try {
      const result = await signUp(data.email, data.password, {
        fullName: `${data.firstName} ${data.lastName}`,
      });
      if (result.needsVerification) {
        setPendingEmail(result.email);
        setShowVerification(true);
      } else {
        router.push('/patient-home');
      }
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('already registered') || msg.includes('User already registered')) {
        setRegisterError('Cette adresse e-mail est déjà utilisée. Veuillez vous connecter.');
      } else {
        setRegisterError('Une erreur est survenue lors de la création du compte. Veuillez réessayer.');
      }
      setIsLoading(false);
    }
  };

  const handleVerified = () => {
    router.push('/patient-home');
  };

  return (
    <div className="animate-fade-in">
      {showVerification && (
        <EmailVerificationModal
          email={pendingEmail}
          onVerified={handleVerified}
          onCancel={() => setShowVerification(false)}
        />
      )}
      <button onClick={onSwitchToLogin} className="flex items-center gap-1.5 text-sm font-medium mb-6 transition-colors hover:text-primary" style={{ color: 'var(--muted-foreground)' }}>
        <Icon name="ArrowLeftIcon" size={15} />
        Retour à la connexion
      </button>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00B89A, #00F2C3)' }}>
            <Icon name="UserCircleIcon" size={16} className="text-white" />
          </div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Créer mon compte Patient</h1>
        </div>
        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Votre identifiant SHIFA sera généré automatiquement après inscription.</p>
      </div>

      {registerError && (
        <div className="flex items-start gap-3 p-4 rounded-xl mb-4 border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.06)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
          <Icon name="ExclamationCircleIcon" size={18} style={{ color: 'var(--shifa-red)', flexShrink: 0 } as any} className="" />
          <p className="text-sm" style={{ color: 'var(--shifa-red)' }}>{registerError}</p>
        </div>
      )}

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2].map((s) => (
          <React.Fragment key={`step-${s}`}>
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
              style={{
                backgroundColor: step >= s ? 'var(--shifa-blue)' : 'var(--muted)',
                color: step >= s ? 'white' : 'var(--muted-foreground)',
              }}
            >
              {step > s ? <Icon name="CheckIcon" size={12} className="text-white" /> : s}
            </div>
            {s < 2 && <div className="flex-1 h-0.5 rounded-full" style={{ backgroundColor: step > s ? 'var(--shifa-blue)' : 'var(--border)' }} />}
          </React.Fragment>
        ))}
        <span className="text-xs ml-2" style={{ color: 'var(--muted-foreground)' }}>
          {step === 1 ? 'Identité' : 'Sécurité'}
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {step === 1 && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Prénom *</label>
                <input type="text" className="input-field" placeholder="Aïcha" {...register('firstName', { required: 'Requis' })} />
                {errors.firstName && <p className="mt-1 text-xs" style={{ color: 'var(--shifa-red)' }}>{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Nom *</label>
                <input type="text" className="input-field" placeholder="Diallo" {...register('lastName', { required: 'Requis' })} />
                {errors.lastName && <p className="mt-1 text-xs" style={{ color: 'var(--shifa-red)' }}>{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Date de naissance *</label>
              <input type="date" className="input-field" {...register('dateOfBirth', { required: 'La date de naissance est requise' })} />
              {errors.dateOfBirth && <p className="mt-1 text-xs" style={{ color: 'var(--shifa-red)' }}>{errors.dateOfBirth.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Sexe *</label>
              <select className="input-field" {...register('gender', { required: 'Requis' })}>
                <option value="">Sélectionner</option>
                <option value="F">Féminin</option>
                <option value="M">Masculin</option>
                <option value="O">Autre / Non précisé</option>
              </select>
              {errors.gender && <p className="mt-1 text-xs" style={{ color: 'var(--shifa-red)' }}>{errors.gender.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Pays *</label>
              <select className="input-field" {...register('country', { required: 'Requis' })}>
                <option value="">Sélectionner votre pays</option>
                <option value="FR">France</option>
                <option value="SN">Sénégal</option>
                <option value="CI">Côte d'Ivoire</option>
                <option value="MA">Maroc</option>
                <option value="DZ">Algérie</option>
                <option value="TN">Tunisie</option>
                <option value="CM">Cameroun</option>
                <option value="CD">RD Congo</option>
                <option value="ML">Mali</option>
                <option value="BJ">Bénin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Téléphone *</label>
              <input type="tel" className="input-field" placeholder="+33 6 12 34 56 78" {...register('phone', { required: 'Requis' })} />
            </div>

            <button type="button" onClick={() => setStep(2)} className="btn-primary w-full py-3 mt-2">
              Continuer
              <Icon name="ArrowRightIcon" size={16} />
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Adresse e-mail *</label>
              <input type="email" className="input-field" placeholder="aicha.diallo@email.com" {...register('email', { required: 'Requis', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'E-mail invalide' } })} />
              {errors.email && <p className="mt-1 text-xs" style={{ color: 'var(--shifa-red)' }}>{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Mot de passe *</label>
              <p className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>Minimum 8 caractères, une majuscule, un chiffre, un symbole.</p>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} className="input-field pr-11" placeholder="••••••••" {...register('password', {
                  required: 'Requis',
                  minLength: { value: 8, message: 'Minimum 8 caractères' },
                  pattern: { value: /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])/, message: 'Doit contenir majuscule, chiffre et symbole' },
                })} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Icon name={showPassword ? 'EyeSlashIcon' : 'EyeIcon'} size={16} className="text-muted-foreground" />
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs" style={{ color: 'var(--shifa-red)' }}>{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Confirmer le mot de passe *</label>
              <input type="password" className="input-field" placeholder="••••••••" {...register('confirmPassword', {
                required: 'Requis',
                validate: val => val === password || 'Les mots de passe ne correspondent pas',
              })} />
              {errors.confirmPassword && <p className="mt-1 text-xs" style={{ color: 'var(--shifa-red)' }}>{errors.confirmPassword.message}</p>}
            </div>

            <div className="flex items-start gap-2.5">
              <input type="checkbox" id="acceptTerms" className="w-4 h-4 mt-0.5 rounded accent-primary cursor-pointer" {...register('acceptTerms', { required: 'Vous devez accepter les conditions' })} />
              <label htmlFor="acceptTerms" className="text-xs cursor-pointer leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                J'accepte les{' '}
                <a href="#" className="font-semibold" style={{ color: 'var(--shifa-blue)' }}>Conditions d'utilisation</a>{' '}
                et la{' '}
                <a href="#" className="font-semibold" style={{ color: 'var(--shifa-blue)' }}>Politique de confidentialité</a>{' '}
                de SHIFA Health OS.
              </label>
            </div>
            {errors.acceptTerms && <p className="text-xs" style={{ color: 'var(--shifa-red)' }}>{errors.acceptTerms.message}</p>}

            {/* SHIFA ID info */}
            <div className="flex items-start gap-3 p-3 rounded-xl border" style={{ backgroundColor: 'rgba(0, 242, 195, 0.06)', borderColor: 'rgba(0, 242, 195, 0.25)' }}>
              <Icon name="FingerPrintIcon" size={16} style={{ color: 'var(--shifa-cyan)', flexShrink: 0, marginTop: '1px' } as any} className="" />
              <p className="text-xs" style={{ color: '#00B89A' }}>
                Votre identifiant SHIFA unique sera généré automatiquement (ex: <span className="font-mono font-semibold">SH-2-225-FR-2026-XXXX</span>) et associé à votre dossier de santé.
              </p>
            </div>

            <div className="flex gap-3 mt-2">
              <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 py-3">
                <Icon name="ArrowLeftIcon" size={15} />
                Retour
              </button>
              <button type="submit" disabled={isLoading} className="btn-primary flex-1 py-3 disabled:opacity-60" style={{ minHeight: '44px' }}>
                {isLoading ? <Icon name="ArrowPathIcon" size={18} className="animate-spin" /> : (
                  <>
                    <Icon name="CheckCircleIcon" size={16} />
                    Créer mon compte
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}