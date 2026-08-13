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

  const handleVerified = () => {
    router.push('/workspace-professionnel');
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
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #5B2D8E, #7B5EA7)' }}>
            <Icon name="UserGroupIcon" size={16} className="text-white" />
          </div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Espace Professionnel</h1>
        </div>

        {/* Professional type selector */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          {[
            { key: 'type-liberal', value: 'liberal', label: 'Libéral', sub: 'Inscription directe', color: 'var(--shifa-green)' },
            { key: 'type-salarie', value: 'salarie', label: 'Salarié / Rattaché', sub: 'Sur invitation', color: 'var(--shifa-purple)' },
          ].map((type) => (
            <label key={type.key} className="cursor-pointer">
              <input type="radio" value={type.value} className="sr-only" {...register('professionalType', { required: true })} defaultChecked={type.value === 'liberal'} />
              <div className="p-3 rounded-xl border-2 transition-all" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
                <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{type.label}</p>
                <span className="badge-base text-xs mt-1" style={{ backgroundColor: `${type.color}15`, color: type.color, border: `1px solid ${type.color}30` }}>
                  {type.sub}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {registerError && (
        <div className="flex items-start gap-3 p-4 rounded-xl mb-4 border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.06)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
          <Icon name="ExclamationCircleIcon" size={18} style={{ color: 'var(--shifa-red)', flexShrink: 0 } as any} className="" />
          <p className="text-sm" style={{ color: 'var(--shifa-red)' }}>{registerError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Prénom *</label>
            <input type="text" className="input-field" placeholder="Mohamed" {...register('firstName', { required: 'Requis' })} />
            {errors.firstName && <p className="mt-1 text-xs" style={{ color: 'var(--shifa-red)' }}>{errors.firstName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Nom *</label>
            <input type="text" className="input-field" placeholder="Sy" {...register('lastName', { required: 'Requis' })} />
            {errors.lastName && <p className="mt-1 text-xs" style={{ color: 'var(--shifa-red)' }}>{errors.lastName.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Profession *</label>
          <select className="input-field" {...register('profession', { required: 'Requis' })}>
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
          {errors.profession && <p className="mt-1 text-xs" style={{ color: 'var(--shifa-red)' }}>{errors.profession.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Spécialité</label>
          <input type="text" className="input-field" placeholder="Médecine générale, Cardiologie..." {...register('specialty')} />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>N° d'ordre / Licence professionnelle *</label>
          <p className="text-xs mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Sera vérifié auprès de votre ordre professionnel national.</p>
          <input type="text" className="input-field font-mono" placeholder="ADELI / RPPS / N° d'ordre" {...register('licenseNumber', { required: 'Le numéro professionnel est requis' })} />
          {errors.licenseNumber && <p className="mt-1 text-xs" style={{ color: 'var(--shifa-red)' }}>{errors.licenseNumber.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Pays *</label>
            <select className="input-field" {...register('country', { required: 'Requis' })}>
              <option value="">Pays</option>
              <option value="FR">France</option>
              <option value="SN">Sénégal</option>
              <option value="MA">Maroc</option>
              <option value="CI">Côte d'Ivoire</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Téléphone *</label>
            <input type="tel" className="input-field" placeholder="+33 6..." {...register('phone', { required: 'Requis' })} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>E-mail professionnel *</label>
          <input type="email" className="input-field" placeholder="dr.sy@cabinet.com" {...register('email', { required: 'Requis' })} />
          {errors.email && <p className="mt-1 text-xs" style={{ color: 'var(--shifa-red)' }}>{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Mot de passe *</label>
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} className="input-field pr-11" placeholder="••••••••" {...register('password', {
              required: 'Requis',
              minLength: { value: 8, message: 'Minimum 8 caractères' },
            })} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
              <Icon name={showPassword ? 'EyeSlashIcon' : 'EyeIcon'} size={16} className="text-muted-foreground" />
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs" style={{ color: 'var(--shifa-red)' }}>{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Confirmer *</label>
          <input type="password" className="input-field" placeholder="••••••••" {...register('confirmPassword', {
            required: 'Requis',
            validate: val => val === password || 'Les mots de passe ne correspondent pas',
          })} />
          {errors.confirmPassword && <p className="mt-1 text-xs" style={{ color: 'var(--shifa-red)' }}>{errors.confirmPassword.message}</p>}
        </div>

        <div className="flex items-start gap-2.5">
          <input type="checkbox" id="proTerms" className="w-4 h-4 mt-0.5 rounded accent-primary cursor-pointer" {...register('acceptTerms', { required: 'Requis' })} />
          <label htmlFor="proTerms" className="text-xs cursor-pointer" style={{ color: 'var(--muted-foreground)' }}>
            J'accepte les <a href="#" className="font-semibold" style={{ color: 'var(--shifa-blue)' }}>Conditions</a> et la <a href="#" className="font-semibold" style={{ color: 'var(--shifa-blue)' }}>Politique de confidentialité</a>.
          </label>
        </div>

        <button type="submit" disabled={isLoading} className="btn-primary w-full py-3 mt-2 disabled:opacity-60" style={{ minHeight: '44px' }}>
          {isLoading ? <Icon name="ArrowPathIcon" size={18} className="animate-spin" /> : (
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