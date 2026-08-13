'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/contexts/AuthContext';
import EmailVerificationModal from './EmailVerificationModal';

interface InstitutionFormData {
  orgName: string;
  orgType: string;
  country: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  registrationNumber: string;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  password: string;
  acceptTerms: boolean;
}

export default function InstitutionRegisterForm({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<InstitutionFormData>();

  const onSubmit = async (data: InstitutionFormData) => {
    setIsLoading(true);
    setRegisterError('');
    try {
      const result = await signUp(data.adminEmail, data.password, {
        fullName: `${data.adminFirstName} ${data.adminLastName}`,
        role: 'org_admin',
      });
      if (result.needsVerification) {
        setPendingEmail(result.email);
        setShowVerification(true);
      } else {
        router.push('/administration-tablissement');
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
    router.push('/administration-tablissement');
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
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0A1B3D, #0066FF)' }}>
            <Icon name="BuildingOffice2Icon" size={16} className="text-white" />
          </div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Enregistrer un Établissement</h1>
        </div>
        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Hôpital, clinique, laboratoire, pharmacie, université, assurance, ONG…</p>
      </div>

      {registerError && (
        <div className="flex items-start gap-3 p-4 rounded-xl mb-4 border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.06)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
          <Icon name="ExclamationCircleIcon" size={18} style={{ color: 'var(--shifa-red)', flexShrink: 0 } as any} className="" />
          <p className="text-sm" style={{ color: 'var(--shifa-red)' }}>{registerError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Type d'établissement *</label>
          <select className="input-field" {...register('orgType', { required: 'Requis' })}>
            <option value="">Sélectionner</option>
            <option value="hopital">Hôpital</option>
            <option value="clinique">Clinique</option>
            <option value="centre-sante">Centre de santé</option>
            <option value="cabinet">Cabinet médical</option>
            <option value="laboratoire">Laboratoire</option>
            <option value="pharmacie">Pharmacie</option>
            <option value="imagerie">Centre d'imagerie</option>
            <option value="universite">Université / École de santé</option>
            <option value="ministere">Ministère de la santé</option>
            <option value="assurance">Assurance / Mutuelle</option>
            <option value="ong">ONG / Organisation humanitaire</option>
          </select>
          {errors.orgType && <p className="mt-1 text-xs" style={{ color: 'var(--shifa-red)' }}>{errors.orgType.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Nom de l'établissement *</label>
          <input type="text" className="input-field" placeholder="CHU Saint-Louis" {...register('orgName', { required: 'Requis' })} />
          {errors.orgName && <p className="mt-1 text-xs" style={{ color: 'var(--shifa-red)' }}>{errors.orgName.message}</p>}
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
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Ville *</label>
            <input type="text" className="input-field" placeholder="Dakar" {...register('city', { required: 'Requis' })} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Adresse complète *</label>
          <input type="text" className="input-field" placeholder="123 Avenue de la République" {...register('address', { required: 'Requis' })} />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>N° d'enregistrement officiel</label>
          <p className="text-xs mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Numéro SIRET, FINESS, ou équivalent selon votre pays.</p>
          <input type="text" className="input-field font-mono" placeholder="FINESS / SIRET / Enregistrement national" {...register('registrationNumber')} />
        </div>

        <div className="border-t pt-4" style={{ borderColor: 'var(--border)' }}>
          <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--muted-foreground)' }}>Administrateur principal</p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Prénom *</label>
              <input type="text" className="input-field" placeholder="Fatou" {...register('adminFirstName', { required: 'Requis' })} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Nom *</label>
              <input type="text" className="input-field" placeholder="Ndiaye" {...register('adminLastName', { required: 'Requis' })} />
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>E-mail administrateur *</label>
            <input type="email" className="input-field" placeholder="admin@chu-saintlouis.sn" {...register('adminEmail', { required: 'Requis' })} />
            {errors.adminEmail && <p className="mt-1 text-xs" style={{ color: 'var(--shifa-red)' }}>{errors.adminEmail.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Mot de passe *</label>
            <input type="password" className="input-field" placeholder="••••••••" {...register('password', { required: 'Requis', minLength: { value: 8, message: 'Minimum 8 caractères' } })} />
            {errors.password && <p className="mt-1 text-xs" style={{ color: 'var(--shifa-red)' }}>{errors.password.message}</p>}
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <input type="checkbox" id="instTerms" className="w-4 h-4 mt-0.5 accent-primary cursor-pointer" {...register('acceptTerms', { required: 'Requis' })} />
          <label htmlFor="instTerms" className="text-xs cursor-pointer" style={{ color: 'var(--muted-foreground)' }}>
            J'accepte les <a href="#" className="font-semibold" style={{ color: 'var(--shifa-blue)' }}>Conditions d'utilisation</a> et la <a href="#" className="font-semibold" style={{ color: 'var(--shifa-blue)' }}>Politique de confidentialité</a>.
          </label>
        </div>

        <button type="submit" disabled={isLoading} className="btn-primary w-full py-3 disabled:opacity-60" style={{ minHeight: '44px' }}>
          {isLoading ? <Icon name="ArrowPathIcon" size={18} className="animate-spin" /> : (
            <>
              <Icon name="BuildingOffice2Icon" size={16} />
              Enregistrer l'établissement
            </>
          )}
        </button>
      </form>
    </div>
  );
}