'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';

interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

interface LoginFormProps {
  onSwitchToRegister: (role: 'patient' | 'professional' | 'institution') => void;
}

function getRoleRedirect(role: string): string {
  switch (role) {
    case 'platform_admin':
      return '/platform-admin';
    case 'org_admin':
      return '/administration-tablissement';
    case 'professional':
      return '/workspace-professionnel';
    case 'ambassador':
      return '/ambassador-workspace';
    case 'ministry':
      return '/espace-ministere';
    case 'public_health':
      return '/espace-sante-publique';
    case 'insurance':
      return '/espace-assurance';
    case 'university':
      return '/espace-universite';
    case 'ngo':
      return '/espace-ong';
    case 'researcher':
      return '/research-workspace';
    case 'developer':
      return '/api-developer-dashboard';
    case 'vendor':
      return '/marketplace-vendor';
    case 'patient':
    default:
      return '/patient-home';
  }
}

export default function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const { signIn } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    defaultValues: { remember: false },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setLoginError('');
    try {
      // Step 1: Sign in — this sets the session cookie
      await signIn(data.email, data.password);

      // Step 2: Fetch profile using a fresh client call (session is now active)
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      let redirectPath = '/patient-home';

      if (user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        const role = profile?.role || 'patient';
        redirectPath = getRoleRedirect(role);
      }

      // Step 3: Hard navigation — forces full page reload so middleware
      // reads the freshly-set session cookie correctly
      window.location.href = redirectPath;
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('Invalid login credentials') || msg.includes('invalid_credentials')) {
        setLoginError('Identifiants invalides. Vérifiez votre adresse e-mail et votre mot de passe.');
      } else if (msg.includes('Email not confirmed')) {
        setLoginError('Veuillez confirmer votre adresse e-mail avant de vous connecter.');
      } else {
        setLoginError('Une erreur est survenue. Veuillez réessayer.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1.5" style={{ color: 'var(--shifa-dark)' }}>Se connecter</h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Bienvenue sur SHIFA Health OS</p>
      </div>

      {loginError && (
        <div className="flex items-start gap-3 p-4 rounded-xl mb-6 border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.06)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
          <Icon name="ExclamationCircleIcon" size={18} style={{ color: 'var(--shifa-red)', flexShrink: 0 } as any} className="" />
          <p className="text-sm" style={{ color: 'var(--shifa-red)' }}>{loginError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>
            Adresse e-mail ou numéro de téléphone
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="votre@email.com ou +33 6 00 00 00 00"
            {...register('email', {
              required: "L'adresse e-mail ou numéro de téléphone est requis",
            })}
          />
          {errors.email && <p className="mt-1.5 text-xs font-medium" style={{ color: 'var(--shifa-red)' }}>{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Mot de passe</label>
            <a href="/forgot-password" className="text-xs font-medium transition-colors hover:underline" style={{ color: 'var(--shifa-blue)' }}>
              Mot de passe oublié ?
            </a>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="input-field pr-11"
              placeholder="••••••••"
              {...register('password', { required: 'Le mot de passe est requis' })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors hover:bg-muted"
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            >
              <Icon name={showPassword ? 'EyeSlashIcon' : 'EyeIcon'} size={16} className="text-muted-foreground" />
            </button>
          </div>
          {errors.password && <p className="mt-1.5 text-xs font-medium" style={{ color: 'var(--shifa-red)' }}>{errors.password.message}</p>}
        </div>

        <div className="flex items-center gap-2.5">
          <input
            type="checkbox"
            id="remember"
            className="w-4 h-4 rounded accent-primary cursor-pointer"
            {...register('remember')}
          />
          <label htmlFor="remember" className="text-sm cursor-pointer" style={{ color: 'var(--muted-foreground)' }}>
            Se souvenir de moi pendant 30 jours
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full py-3 text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ minHeight: '44px' }}
        >
          {isLoading ? (
            <Icon name="ArrowPathIcon" size={18} className="animate-spin" />
          ) : (
            <>
              <Icon name="LockClosedIcon" size={16} />
              Se connecter
            </>
          )}
        </button>

        {/* Social login options */}
        <div className="relative flex items-center gap-3">
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }} />
          <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>ou continuer avec</span>
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-medium transition-all hover:shadow-sm active:scale-95"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-medium transition-all hover:shadow-sm active:scale-95"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Apple
          </button>
        </div>
      </form>

      {/* Register links */}
      <div className="mt-6 pt-5 border-t" style={{ borderColor: 'var(--border)' }}>
        <p className="text-center text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>Pas encore de compte ?</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { key: 'reg-patient', label: 'Patient', icon: 'UserCircleIcon', role: 'patient' as const },
            { key: 'reg-pro', label: 'Professionnel', icon: 'UserGroupIcon', role: 'professional' as const },
            { key: 'reg-etab', label: 'Établissement', icon: 'BuildingOffice2Icon', role: 'institution' as const },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => onSwitchToRegister(item.role)}
              className="flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-semibold transition-all duration-150 hover:shadow-shifa hover:border-primary active:scale-95"
              style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
            >
              <Icon name={item.icon as any} size={18} className="text-primary" />
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}