'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/contexts/AuthContext';
import EmailVerificationModal from './EmailVerificationModal';

interface ProFormData {
  firstName: string;
  lastName: string;
  profession: string;
  specialty: string;
  licenseNumber: string;
  country: string;
  phone: string;
  email: string;
  professionalType: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export default function ProfessionalRegisterForm({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [proType, setProType] = useState<'liberal' | 'salarie'>('liberal');
  const { signUp } = useAuth();
  const router = useRouter();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ProFormData>();
  const password = watch('password');

  const onSubmit = async (data: ProFormData) => {
    setIsLoading(true);
    setRegisterError('');
    try {
      const result = await signUp(data.email, data.password, {
        fullName: `${data.firstName} ${data.lastName}`,
        role: 'professional',
      });
      if (result.needsVerification) {
        setPendingEmail(result.email);
        setShowVerification(true);
      } else {
        router.push('/workspace-professionnel');
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

  const handleVerified = () => { router.push('/workspace-professionnel'); };

  return (
    <div className="animate-slide-up">
      {showVerification && (
        <EmailVerificationModal
          email={pendingEmail}
          onVerified={handleVerified}
          onCancel={() => setShowVerification(false)}
        />
      )}

      {/* Back button */}
      <button
        onClick={onSwitchToLogin}
        className="flex items-center gap-1.5 text-sm font-medium mb-5 transition-colors"
        style={{ color: 'var(--muted-foreground)' }}
      >
        <Icon name="ArrowLeftIcon" size={15} />
        Retour à la connexion
      </button>

      {/* Title */}
      <div className="mb-5">
        <div className="flex items-center gap-2.5 mb-4">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #5B2D8E, #6D4FC2)' }}
          >
            <Icon name="UserGroupIcon" size={17} className="text-white" />
          </div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--shifa-dark)', letterSpacing: '-0.02em' }}>
            Espace Professionnel
          </h1>
        </div>

        {/* Professional type toggle */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'liberal' as const, label: 'Libéral', sub: 'Inscription directe', color: '#0D9E6E' },
            { value: 'salarie' as const, label: 'Salarié / Rattaché', sub: 'Sur invitation', color: '#6D4FC2' },
          ].map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setProType(type.value)}
              className="p-3 rounded-xl border-2 text-left transition-all"
              style={{
                borderColor: proType === type.value ? type.color : 'var(--border)',
                backgroundColor: proType === type.value ? type.color + '08' : '#FFFFFF',
              }}
            >
              <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{type.label}</p>
              <p className="text-xs mt-0.5 font-medium" style={{ color: type.color }}>{type.sub}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {registerError && (
        <div className="flex items-start gap-3 p-3.5 rounded-xl mb-4 border" style={{ backgroundColor: 'rgba(217,48,37,0.05)', borderColor: 'rgba(217,48,37,0.18)' }}>
          <Icon name="ExclamationCircleIcon" size={17} style={{ color: '#D93025', flexShrink: 0, marginTop: 1 } as any} />
          <p className="text-sm" style={{ color: '#D93025' }}>{registerError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
        {/* Name row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Prénom *</label>
            <input type="text" className="input-premium" placeholder="Mohamed" {...register('firstName', { required: 'Requis' })} />
            {errors.firstName && <p className="mt-1 text-xs" style={{ color: '#D93025' }}>{errors.firstName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Nom *</label>
            <input type="text" className="input-premium" placeholder="Sy" {...register('lastName', { required: 'Requis' })} />
            {errors.lastName && <p className="mt-1 text-xs" style={{ color: '#D93025' }}>{errors.lastName.message}</p>}
          </div>
        </div>

        {/* Profession */}
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Profession *</label>
          <select className="input-premium" style={{ appearance: 'auto' }} {...register('profession', { required: 'Requis' })}>
            <option value="">Sélectionner</option>
            <option value="medecin">Médecin</option>
            <option value="infirmier">Infirmier(ère)</option>
            <option value="pharmacien">Pharmacien(ne)</option>
            <option value="sage-femme">Sage-femme</option>
            <option value="kinesitherapeute">Kinésithérapeute</option>
            <option value="dentiste">Dentiste</option>
            <option value="psychologue">Psychologue</option>
            <option value="laborantin">Biologiste / Laborantin</option>
          </select>
          {errors.profession && <p className="mt-1 text-xs" style={{ color: '#D93025' }}>{errors.profession.message}</p>}
        </div>

        {/* Specialty */}
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Spécialité</label>
          <input type="text" className="input-premium" placeholder="Médecine générale, Cardiologie..." {...register('specialty')} />
        </div>

        {/* License */}
        <div>
          <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--foreground)' }}>
            N° d'ordre / Licence professionnelle *
          </label>
          <p className="text-xs mb-1.5" style={{ color: 'var(--muted-foreground)' }}>
            Sera vérifié auprès de votre ordre professionnel national.
          </p>
          <input
            type="text"
            className="input-premium font-mono"
            placeholder="ADELI / RPPS / N° d'ordre"
            {...register('licenseNumber', { required: 'Le numéro professionnel est requis' })}
          />
          {errors.licenseNumber && <p className="mt-1 text-xs" style={{ color: '#D93025' }}>{errors.licenseNumber.message}</p>}
        </div>

        {/* Country + Phone */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Pays *</label>
            <select className="input-premium" style={{ appearance: 'auto' }} {...register('country', { required: 'Requis' })}>
              <option value="">Pays</option>
              <option value="FR">France</option>
              <option value="SN">Sénégal</option>
              <option value="MA">Maroc</option>
              <option value="CI">Côte d'Ivoire</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Téléphone *</label>
            <input type="tel" className="input-premium" placeholder="+33 6..." {...register('phone', { required: 'Requis' })} />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>E-mail professionnel *</label>
          <input type="email" className="input-premium" placeholder="dr.sy@cabinet.com" {...register('email', { required: 'Requis' })} />
          {errors.email && <p className="mt-1 text-xs" style={{ color: '#D93025' }}>{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Mot de passe *</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="input-premium"
              style={{ paddingRight: '2.75rem' }}
              placeholder="••••••••"
              {...register('password', { required: 'Requis', minLength: { value: 8, message: 'Minimum 8 caractères' } })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--muted-foreground)' }}
            >
              <Icon name={showPassword ? 'EyeSlashIcon' : 'EyeIcon'} size={17} />
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs" style={{ color: '#D93025' }}>{errors.password.message}</p>}
        </div>

        {/* Confirm password */}
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Confirmer *</label>
          <input
            type="password"
            className="input-premium"
            placeholder="••••••••"
            {...register('confirmPassword', {
              required: 'Requis',
              validate: val => val === password || 'Les mots de passe ne correspondent pas',
            })}
          />
          {errors.confirmPassword && <p className="mt-1 text-xs" style={{ color: '#D93025' }}>{errors.confirmPassword.message}</p>}
        </div>

        {/* Terms */}
        <div className="flex items-start gap-2.5">
          <input
            type="checkbox"
            id="proTerms"
            className="w-4 h-4 mt-0.5 rounded cursor-pointer"
            style={{ accentColor: 'var(--primary)' }}
            {...register('acceptTerms', { required: 'Requis' })}
          />
          <label htmlFor="proTerms" className="text-xs cursor-pointer select-none" style={{ color: 'var(--muted-foreground)' }}>
            J'accepte les{' '}
            <a href="#" className="font-semibold" style={{ color: 'var(--shifa-blue)' }}>Conditions</a>
            {' '}et la{' '}
            <a href="#" className="font-semibold" style={{ color: 'var(--shifa-blue)' }}>Politique de confidentialité</a>.
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Icon name="ArrowPathIcon" size={18} className="animate-spin" />
          ) : (
            <>
              <Icon name="CheckCircleIcon" size={16} />
              Créer mon espace professionnel
            </>
          )}
        </button>
      </form>
    </div>
  );
}