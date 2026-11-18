'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import EmailVerificationModal from './EmailVerificationModal';
import { useLanguage } from '@/contexts/LanguageContext';


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
    case 'platform_admin': return '/platform-admin';
    case 'org_admin': return '/administration-tablissement';
    case 'professional': return '/workspace-professionnel';
    case 'ambassador': return '/ambassador-workspace';
    case 'ministry': return '/espace-ministere';
    case 'public_health': return '/espace-sante-publique';
    case 'insurance': return '/espace-assurance';
    case 'university': return '/espace-universite';
    case 'ngo': return '/espace-ong';
    case 'researcher': return '/research-workspace';
    case 'developer': return '/api-developer-dashboard';
    case 'vendor': return '/marketplace-vendor';
    case 'patient':
    default: return '/patient-home';
  }
}

// Per-language auth strings not covered by the global i18n keys
const AUTH_STRINGS: Record<string, Record<string, string>> = {
  fr: {
    title: 'Se connecter',
    subtitle: 'Bienvenue sur SHIFA Health OS',
    emailLabel: 'Adresse e-mail ou numéro de téléphone',
    emailPlaceholder: 'votre@email.com ou +33 6 00 00 00 00',
    passwordLabel: 'Mot de passe',
    passwordPlaceholder: '••••••••',
    forgotPassword: 'Mot de passe oublié ?',
    rememberMe: 'Se souvenir de moi pendant 30 jours',
    signIn: 'Se connecter',
    orContinueWith: 'ou continuer avec',
    noAccount: 'Pas encore de compte ?',
    rolePatient: 'Patient',
    rolePro: 'Professionnel',
    roleEtab: 'Établissement',
    errorInvalidCredentials: 'Identifiants invalides. Vérifiez votre adresse e-mail et votre mot de passe.',
    errorGeneric: 'Une erreur est survenue. Veuillez réessayer.',
    emailRequired: "L'adresse e-mail est requise",
    passwordRequired: 'Le mot de passe est requis',
    hidePassword: 'Masquer',
    showPassword: 'Afficher',
  },
  en: {
    title: 'Sign in',
    subtitle: 'Welcome to SHIFA Health OS',
    emailLabel: 'Email address or phone number',
    emailPlaceholder: 'your@email.com or +44 7700 000000',
    passwordLabel: 'Password',
    passwordPlaceholder: '••••••••',
    forgotPassword: 'Forgot password?',
    rememberMe: 'Remember me for 30 days',
    signIn: 'Sign in',
    orContinueWith: 'or continue with',
    noAccount: 'No account yet?',
    rolePatient: 'Patient',
    rolePro: 'Professional',
    roleEtab: 'Institution',
    errorInvalidCredentials: 'Invalid credentials. Please check your email and password.',
    errorGeneric: 'An error occurred. Please try again.',
    emailRequired: 'Email address is required',
    passwordRequired: 'Password is required',
    hidePassword: 'Hide',
    showPassword: 'Show',
  },
  es: {
    title: 'Iniciar sesión',
    subtitle: 'Bienvenido a SHIFA Health OS',
    emailLabel: 'Correo electrónico o número de teléfono',
    emailPlaceholder: 'tu@email.com o +34 600 000 000',
    passwordLabel: 'Contraseña',
    passwordPlaceholder: '••••••••',
    forgotPassword: '¿Olvidaste tu contraseña?',
    rememberMe: 'Recordarme durante 30 días',
    signIn: 'Iniciar sesión',
    orContinueWith: 'o continuar con',
    noAccount: '¿Aún no tienes cuenta?',
    rolePatient: 'Paciente',
    rolePro: 'Profesional',
    roleEtab: 'Institución',
    errorInvalidCredentials: 'Credenciales inválidas. Verifica tu correo y contraseña.',
    errorGeneric: 'Ocurrió un error. Por favor, inténtalo de nuevo.',
    emailRequired: 'El correo electrónico es obligatorio',
    passwordRequired: 'La contraseña es obligatoria',
    hidePassword: 'Ocultar',
    showPassword: 'Mostrar',
  },
  pt: {
    title: 'Entrar',
    subtitle: 'Bem-vindo ao SHIFA Health OS',
    emailLabel: 'E-mail ou número de telefone',
    emailPlaceholder: 'seu@email.com ou +55 11 90000-0000',
    passwordLabel: 'Senha',
    passwordPlaceholder: '••••••••',
    forgotPassword: 'Esqueceu a senha?',
    rememberMe: 'Lembrar por 30 dias',
    signIn: 'Entrar',
    orContinueWith: 'ou continuar com',
    noAccount: 'Ainda não tem conta?',
    rolePatient: 'Paciente',
    rolePro: 'Profissional',
    roleEtab: 'Instituição',
    errorInvalidCredentials: 'Credenciais inválidas. Verifique seu e-mail e senha.',
    errorGeneric: 'Ocorreu um erro. Por favor, tente novamente.',
    emailRequired: 'O e-mail é obrigatório',
    passwordRequired: 'A senha é obrigatória',
    hidePassword: 'Ocultar',
    showPassword: 'Mostrar',
  },
  ar: {
    title: 'تسجيل الدخول',
    subtitle: 'مرحباً بك في SHIFA Health OS',
    emailLabel: 'البريد الإلكتروني أو رقم الهاتف',
    emailPlaceholder: 'بريدك@email.com أو +966 50 000 0000',
    passwordLabel: 'كلمة المرور',
    passwordPlaceholder: '••••••••',
    forgotPassword: 'نسيت كلمة المرور؟',
    rememberMe: 'تذكرني لمدة 30 يوماً',
    signIn: 'تسجيل الدخول',
    orContinueWith: 'أو المتابعة باستخدام',
    noAccount: 'ليس لديك حساب بعد؟',
    rolePatient: 'مريض',
    rolePro: 'محترف',
    roleEtab: 'مؤسسة',
    errorInvalidCredentials: 'بيانات الاعتماد غير صالحة. تحقق من بريدك الإلكتروني وكلمة المرور.',
    errorGeneric: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
    emailRequired: 'البريد الإلكتروني مطلوب',
    passwordRequired: 'كلمة المرور مطلوبة',
    hidePassword: 'إخفاء',
    showPassword: 'إظهار',
  },
  zh: {
    title: '登录',
    subtitle: '欢迎使用 SHIFA Health OS',
    emailLabel: '电子邮件或手机号码',
    emailPlaceholder: 'your@email.com 或 +86 138 0000 0000',
    passwordLabel: '密码',
    passwordPlaceholder: '••••••••',
    forgotPassword: '忘记密码？',
    rememberMe: '记住我 30 天',
    signIn: '登录',
    orContinueWith: '或使用以下方式继续',
    noAccount: '还没有账号？',
    rolePatient: '患者',
    rolePro: '专业人员',
    roleEtab: '机构',
    errorInvalidCredentials: '凭据无效。请检查您的电子邮件和密码。',
    errorGeneric: '发生错误，请重试。',
    emailRequired: '电子邮件地址为必填项',
    passwordRequired: '密码为必填项',
    hidePassword: '隐藏',
    showPassword: '显示',
  },
};

export default function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<'google' | 'apple' | null>(null);
  const [loginError, setLoginError] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const { signIn } = useAuth();
  const { language } = useLanguage();

  const s = AUTH_STRINGS[language] || AUTH_STRINGS['fr'];

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    defaultValues: { remember: false },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setLoginError('');
    try {
      const result = await signIn(data.email, data.password);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      // Check for redirectTo param first (preserves original destination)
      const params = new URLSearchParams(window.location.search);
      const redirectTo = params.get('redirectTo');

      let redirectPath = '/patient-home';
      if (user) {
        // Use metadata role first (always reliable), fallback to DB
        const metaRole = user.user_metadata?.role || user.app_metadata?.role;
        let role = metaRole;
        if (!role) {
          const { data: profile } = await supabase
            .from('user_profiles').select('role').eq('id', user.id).maybeSingle();
          role = profile?.role || 'patient';
        }
        redirectPath = getRoleRedirect(role);

        // If there's a valid redirectTo and the user's role can access it, use it
        if (redirectTo && redirectTo.startsWith('/') && !redirectTo.startsWith('/sign-up-login-screen')) {
          redirectPath = redirectTo;
        }
      }
      window.location.href = redirectPath;
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('Invalid login credentials') || msg.includes('invalid_credentials')) {
        setLoginError(s.errorInvalidCredentials);
      } else if (msg.includes('Email not confirmed')) {
        setPendingEmail(data.email);
        setShowVerification(true);
      } else {
        setLoginError(s.errorGeneric);
      }
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'apple') => {
    setOauthLoading(provider);
    setLoginError('');
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback` },
      });
      if (error) throw error;
    } catch (err: any) {
      setLoginError(err?.message || s.errorGeneric);
      setOauthLoading(null);
    }
  };

  const handleVerified = () => { window.location.href = '/sign-up-login-screen'; };

  return (
    <div className="animate-slide-up">
      {showVerification && (
        <EmailVerificationModal
          email={pendingEmail}
          onVerified={handleVerified}
          onCancel={() => setShowVerification(false)}
        />
      )}

      {/* Title */}
      <div className="mb-7">
        <h1 className="text-[1.625rem] font-bold mb-1" style={{ color: 'var(--shifa-dark)', letterSpacing: '-0.02em' }}>
          {s.title}
        </h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{s.subtitle}</p>
      </div>

      {/* Error */}
      {loginError && (
        <div className="flex items-start gap-3 p-3.5 rounded-xl mb-5 border" style={{ backgroundColor: 'rgba(217,48,37,0.05)', borderColor: 'rgba(217,48,37,0.18)' }}>
          <Icon name="ExclamationCircleIcon" size={17} style={{ color: '#D93025', flexShrink: 0, marginTop: 1 } as any} />
          <p className="text-sm" style={{ color: '#D93025' }}>{loginError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>
            {s.emailLabel}
          </label>
          <input
            type="text"
            className="input-premium"
            placeholder={s.emailPlaceholder}
            {...register('email', { required: s.emailRequired })}
          />
          {errors.email && <p className="mt-1.5 text-xs font-medium" style={{ color: '#D93025' }}>{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{s.passwordLabel}</label>
            <a href="/forgot-password" className="text-xs font-semibold transition-colors" style={{ color: '#0550A8' }}>
              {s.forgotPassword}
            </a>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="input-premium"
              style={{ paddingRight: '2.75rem' }}
              placeholder={s.passwordPlaceholder}
              {...register('password', { required: s.passwordRequired })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors"
              style={{ color: 'var(--muted-foreground)' }}
              aria-label={showPassword ? s.hidePassword : s.showPassword}
            >
              <Icon name={showPassword ? 'EyeSlashIcon' : 'EyeIcon'} size={17} />
            </button>
          </div>
          {errors.password && <p className="mt-1.5 text-xs font-medium" style={{ color: '#D93025' }}>{errors.password.message}</p>}
        </div>

        {/* Remember me */}
        <div className="flex items-center gap-2.5">
          <input
            type="checkbox"
            id="remember"
            className="w-4 h-4 rounded cursor-pointer"
            style={{ accentColor: 'var(--primary)' }}
            {...register('remember')}
          />
          <label htmlFor="remember" className="text-sm cursor-pointer select-none" style={{ color: 'var(--muted-foreground)' }}>
            {s.rememberMe}
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Icon name="ArrowPathIcon" size={18} className="animate-spin" />
          ) : (
            <>
              <Icon name="LockClosedIcon" size={16} />
              {s.signIn}
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative flex items-center gap-3 my-1">
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }} />
          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{s.orContinueWith}</span>
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }} />
        </div>

        {/* OAuth */}
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              key: 'google', label: 'Google', provider: 'google' as const,
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              ),
            },
            {
              key: 'apple', label: 'Apple', provider: 'apple' as const,
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              ),
            },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => handleOAuthSignIn(item.provider)}
              disabled={oauthLoading !== null}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all hover:shadow-card active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
            >
              {oauthLoading === item.provider ? <Icon name="ArrowPathIcon" size={16} className="animate-spin" /> : item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </form>

      {/* Register section */}
      <div className="mt-6 pt-5 border-t" style={{ borderColor: 'var(--border)' }}>
        <p className="text-center text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>{s.noAccount}</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { key: 'reg-patient', label: s.rolePatient, icon: 'UserCircleIcon', role: 'patient' as const },
            { key: 'reg-pro', label: s.rolePro, icon: 'UserGroupIcon', role: 'professional' as const },
            { key: 'reg-etab', label: s.roleEtab, icon: 'BuildingOffice2Icon', role: 'institution' as const },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => onSwitchToRegister(item.role)}
              className="flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-semibold transition-all duration-150 hover:shadow-shifa active:scale-95"
              style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
            >
              <Icon name={item.icon as any} size={18} style={{ color: 'var(--shifa-blue)' }} />
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}