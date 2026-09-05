'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
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

const PATIENT_STRINGS: Record<string, Record<string, string>> = {
  fr: {
    title: 'Créer mon compte Patient',
    subtitle: 'Votre identifiant SHIFA sera généré automatiquement après inscription.',
    backToLogin: 'Retour à la connexion',
    stepIdentity: 'Identité',
    stepSecurity: 'Sécurité',
    firstName: 'Prénom',
    firstNamePlaceholder: 'Aïcha',
    lastName: 'Nom',
    lastNamePlaceholder: 'Diallo',
    dateOfBirth: 'Date de naissance',
    gender: 'Sexe',
    genderSelect: 'Sélectionner',
    genderF: 'Féminin',
    genderM: 'Masculin',
    genderO: 'Autre / Non précisé',
    country: 'Pays',
    countrySelect: 'Sélectionner votre pays',
    phone: 'Téléphone',
    phonePlaceholder: '+33 6 12 34 56 78',
    continue: 'Continuer',
    email: 'Adresse e-mail',
    emailPlaceholder: 'aicha.diallo@email.com',
    password: 'Mot de passe',
    passwordHint: 'Minimum 8 caractères, une majuscule, un chiffre, un symbole.',
    confirmPassword: 'Confirmer le mot de passe',
    acceptTerms: "J'accepte les",
    termsLink: "Conditions d'utilisation",
    andThe: 'et la',
    privacyLink: 'Politique de confidentialité',
    ofShifa: 'de SHIFA Health OS.',
    shifaIdInfo: 'Votre identifiant SHIFA unique sera généré automatiquement (ex: SH-2-225-FR-2026-XXXX) et associé à votre dossier de santé.',
    back: 'Retour',
    createAccount: 'Créer mon compte',
    required: 'Requis',
    emailInvalid: 'E-mail invalide',
    minLength: 'Minimum 8 caractères',
    passwordStrength: 'Doit contenir majuscule, chiffre et symbole',
    passwordMatch: 'Les mots de passe ne correspondent pas',
    dobRequired: 'La date de naissance est requise',
    termsRequired: 'Vous devez accepter les conditions',
    errorAlreadyUsed: 'Cette adresse e-mail est déjà utilisée. Veuillez vous connecter.',
    errorGeneric: 'Une erreur est survenue lors de la création du compte. Veuillez réessayer.',
  },
  en: {
    title: 'Create my Patient account',
    subtitle: 'Your SHIFA ID will be generated automatically after registration.',
    backToLogin: 'Back to login',
    stepIdentity: 'Identity',
    stepSecurity: 'Security',
    firstName: 'First name',
    firstNamePlaceholder: 'Aisha',
    lastName: 'Last name',
    lastNamePlaceholder: 'Diallo',
    dateOfBirth: 'Date of birth',
    gender: 'Gender',
    genderSelect: 'Select',
    genderF: 'Female',
    genderM: 'Male',
    genderO: 'Other / Not specified',
    country: 'Country',
    countrySelect: 'Select your country',
    phone: 'Phone',
    phonePlaceholder: '+44 7700 000000',
    continue: 'Continue',
    email: 'Email address',
    emailPlaceholder: 'aisha.diallo@email.com',
    password: 'Password',
    passwordHint: 'Minimum 8 characters, one uppercase, one number, one symbol.',
    confirmPassword: 'Confirm password',
    acceptTerms: 'I accept the',
    termsLink: 'Terms of Use',
    andThe: 'and the',
    privacyLink: 'Privacy Policy',
    ofShifa: 'of SHIFA Health OS.',
    shifaIdInfo: 'Your unique SHIFA ID will be generated automatically (e.g. SH-2-225-GB-2026-XXXX) and linked to your health record.',
    back: 'Back',
    createAccount: 'Create my account',
    required: 'Required',
    emailInvalid: 'Invalid email',
    minLength: 'Minimum 8 characters',
    passwordStrength: 'Must contain uppercase, number and symbol',
    passwordMatch: 'Passwords do not match',
    dobRequired: 'Date of birth is required',
    termsRequired: 'You must accept the terms',
    errorAlreadyUsed: 'This email is already in use. Please sign in.',
    errorGeneric: 'An error occurred while creating the account. Please try again.',
  },
  es: {
    title: 'Crear mi cuenta Paciente',
    subtitle: 'Tu identificador SHIFA se generará automáticamente tras el registro.',
    backToLogin: 'Volver al inicio de sesión',
    stepIdentity: 'Identidad',
    stepSecurity: 'Seguridad',
    firstName: 'Nombre',
    firstNamePlaceholder: 'Aisha',
    lastName: 'Apellido',
    lastNamePlaceholder: 'Diallo',
    dateOfBirth: 'Fecha de nacimiento',
    gender: 'Sexo',
    genderSelect: 'Seleccionar',
    genderF: 'Femenino',
    genderM: 'Masculino',
    genderO: 'Otro / No especificado',
    country: 'País',
    countrySelect: 'Selecciona tu país',
    phone: 'Teléfono',
    phonePlaceholder: '+34 600 000 000',
    continue: 'Continuar',
    email: 'Correo electrónico',
    emailPlaceholder: 'aisha.diallo@email.com',
    password: 'Contraseña',
    passwordHint: 'Mínimo 8 caracteres, una mayúscula, un número, un símbolo.',
    confirmPassword: 'Confirmar contraseña',
    acceptTerms: 'Acepto los',
    termsLink: 'Términos de uso',
    andThe: 'y la',
    privacyLink: 'Política de privacidad',
    ofShifa: 'de SHIFA Health OS.',
    shifaIdInfo: 'Tu ID SHIFA único se generará automáticamente (ej: SH-2-225-ES-2026-XXXX) y se vinculará a tu historial de salud.',
    back: 'Atrás',
    createAccount: 'Crear mi cuenta',
    required: 'Requerido',
    emailInvalid: 'Correo inválido',
    minLength: 'Mínimo 8 caracteres',
    passwordStrength: 'Debe contener mayúscula, número y símbolo',
    passwordMatch: 'Las contraseñas no coinciden',
    dobRequired: 'La fecha de nacimiento es obligatoria',
    termsRequired: 'Debes aceptar los términos',
    errorAlreadyUsed: 'Este correo ya está en uso. Por favor inicia sesión.',
    errorGeneric: 'Ocurrió un error al crear la cuenta. Por favor, inténtalo de nuevo.',
  },
  pt: {
    title: 'Criar minha conta Paciente',
    subtitle: 'Seu ID SHIFA será gerado automaticamente após o cadastro.',
    backToLogin: 'Voltar ao login',
    stepIdentity: 'Identidade',
    stepSecurity: 'Segurança',
    firstName: 'Nome',
    firstNamePlaceholder: 'Aisha',
    lastName: 'Sobrenome',
    lastNamePlaceholder: 'Diallo',
    dateOfBirth: 'Data de nascimento',
    gender: 'Sexo',
    genderSelect: 'Selecionar',
    genderF: 'Feminino',
    genderM: 'Masculino',
    genderO: 'Outro / Não especificado',
    country: 'País',
    countrySelect: 'Selecione seu país',
    phone: 'Telefone',
    phonePlaceholder: '+55 11 90000-0000',
    continue: 'Continuar',
    email: 'Endereço de e-mail',
    emailPlaceholder: 'aisha.diallo@email.com',
    password: 'Senha',
    passwordHint: 'Mínimo 8 caracteres, uma maiúscula, um número, um símbolo.',
    confirmPassword: 'Confirmar senha',
    acceptTerms: 'Aceito os',
    termsLink: 'Termos de Uso',
    andThe: 'e a',
    privacyLink: 'Política de Privacidade',
    ofShifa: 'do SHIFA Health OS.',
    shifaIdInfo: 'Seu ID SHIFA único será gerado automaticamente (ex: SH-2-225-BR-2026-XXXX) e vinculado ao seu prontuário de saúde.',
    back: 'Voltar',
    createAccount: 'Criar minha conta',
    required: 'Obrigatório',
    emailInvalid: 'E-mail inválido',
    minLength: 'Mínimo 8 caracteres',
    passwordStrength: 'Deve conter maiúscula, número e símbolo',
    passwordMatch: 'As senhas não coincidem',
    dobRequired: 'A data de nascimento é obrigatória',
    termsRequired: 'Você deve aceitar os termos',
    errorAlreadyUsed: 'Este e-mail já está em uso. Por favor, faça login.',
    errorGeneric: 'Ocorreu um erro ao criar a conta. Por favor, tente novamente.',
  },
  ar: {
    title: 'إنشاء حساب مريض',
    subtitle: 'سيتم إنشاء معرف SHIFA الخاص بك تلقائياً بعد التسجيل.',
    backToLogin: 'العودة إلى تسجيل الدخول',
    stepIdentity: 'الهوية',
    stepSecurity: 'الأمان',
    firstName: 'الاسم الأول',
    firstNamePlaceholder: 'عائشة',
    lastName: 'اسم العائلة',
    lastNamePlaceholder: 'ديالو',
    dateOfBirth: 'تاريخ الميلاد',
    gender: 'الجنس',
    genderSelect: 'اختر',
    genderF: 'أنثى',
    genderM: 'ذكر',
    genderO: 'آخر / غير محدد',
    country: 'البلد',
    countrySelect: 'اختر بلدك',
    phone: 'الهاتف',
    phonePlaceholder: '+966 50 000 0000',
    continue: 'متابعة',
    email: 'البريد الإلكتروني',
    emailPlaceholder: 'aisha.diallo@email.com',
    password: 'كلمة المرور',
    passwordHint: 'الحد الأدنى 8 أحرف، حرف كبير، رقم، رمز.',
    confirmPassword: 'تأكيد كلمة المرور',
    acceptTerms: 'أوافق على',
    termsLink: 'شروط الاستخدام',
    andThe: 'و',
    privacyLink: 'سياسة الخصوصية',
    ofShifa: 'لـ SHIFA Health OS.',
    shifaIdInfo: 'سيتم إنشاء معرف SHIFA الفريد الخاص بك تلقائياً (مثال: SH-2-225-SA-2026-XXXX) وربطه بسجلك الصحي.',
    back: 'رجوع',
    createAccount: 'إنشاء حسابي',
    required: 'مطلوب',
    emailInvalid: 'بريد إلكتروني غير صالح',
    minLength: 'الحد الأدنى 8 أحرف',
    passwordStrength: 'يجب أن يحتوي على حرف كبير ورقم ورمز',
    passwordMatch: 'كلمتا المرور غير متطابقتين',
    dobRequired: 'تاريخ الميلاد مطلوب',
    termsRequired: 'يجب قبول الشروط',
    errorAlreadyUsed: 'هذا البريد الإلكتروني مستخدم بالفعل. يرجى تسجيل الدخول.',
    errorGeneric: 'حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.',
  },
  zh: {
    title: '创建患者账户',
    subtitle: '注册后将自动生成您的 SHIFA ID。',
    backToLogin: '返回登录',
    stepIdentity: '身份',
    stepSecurity: '安全',
    firstName: '名字',
    firstNamePlaceholder: '艾莎',
    lastName: '姓氏',
    lastNamePlaceholder: '迪亚洛',
    dateOfBirth: '出生日期',
    gender: '性别',
    genderSelect: '请选择',
    genderF: '女',
    genderM: '男',
    genderO: '其他 / 未指定',
    country: '国家',
    countrySelect: '选择您的国家',
    phone: '电话',
    phonePlaceholder: '+86 138 0000 0000',
    continue: '继续',
    email: '电子邮件地址',
    emailPlaceholder: 'aisha.diallo@email.com',
    password: '密码',
    passwordHint: '最少8个字符，一个大写字母，一个数字，一个符号。',
    confirmPassword: '确认密码',
    acceptTerms: '我接受',
    termsLink: '使用条款',
    andThe: '和',
    privacyLink: '隐私政策',
    ofShifa: '（SHIFA Health OS）。',
    shifaIdInfo: '您的唯一 SHIFA ID 将自动生成（例如：SH-2-225-CN-2026-XXXX）并与您的健康档案关联。',
    back: '返回',
    createAccount: '创建我的账户',
    required: '必填',
    emailInvalid: '无效的电子邮件',
    minLength: '最少8个字符',
    passwordStrength: '必须包含大写字母、数字和符号',
    passwordMatch: '两次密码不一致',
    dobRequired: '出生日期为必填项',
    termsRequired: '您必须接受条款',
    errorAlreadyUsed: '此电子邮件已被使用，请登录。',
    errorGeneric: '创建账户时发生错误，请重试。',
  },
};

export default function PatientRegisterForm({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [step, setStep] = useState(1);
  const [pendingEmail, setPendingEmail] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();
  const { language } = useLanguage();
  const s = PATIENT_STRINGS[language] || PATIENT_STRINGS['fr'];

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
        setRegisterError(s.errorAlreadyUsed);
      } else {
        setRegisterError(s.errorGeneric);
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
        {s.backToLogin}
      </button>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00B89A, #00F2C3)' }}>
            <Icon name="UserCircleIcon" size={16} className="text-white" />
          </div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--shifa-dark)' }}>{s.title}</h1>
        </div>
        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{s.subtitle}</p>
      </div>

      {registerError && (
        <div className="flex items-start gap-3 p-4 rounded-xl mb-4 border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.06)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
          <Icon name="ExclamationCircleIcon" size={18} style={{ color: 'var(--shifa-red)', flexShrink: 0 } as any} className="" />
          <p className="text-sm" style={{ color: 'var(--shifa-red)' }}>{registerError}</p>
        </div>
      )}

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2].map((stepNum) => (
          <React.Fragment key={`step-${stepNum}`}>
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
              style={{
                backgroundColor: step >= stepNum ? 'var(--shifa-blue)' : 'var(--muted)',
                color: step >= stepNum ? 'white' : 'var(--muted-foreground)',
              }}
            >
              {step > stepNum ? <Icon name="CheckIcon" size={12} className="text-white" /> : stepNum}
            </div>
            {stepNum < 2 && <div className="flex-1 h-0.5 rounded-full" style={{ backgroundColor: step > stepNum ? 'var(--shifa-blue)' : 'var(--border)' }} />}
          </React.Fragment>
        ))}
        <span className="text-xs ml-2" style={{ color: 'var(--muted-foreground)' }}>
          {step === 1 ? s.stepIdentity : s.stepSecurity}
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {step === 1 && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>{s.firstName} *</label>
                <input type="text" className="input-field" placeholder={s.firstNamePlaceholder} {...register('firstName', { required: s.required })} />
                {errors.firstName && <p className="mt-1 text-xs" style={{ color: 'var(--shifa-red)' }}>{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>{s.lastName} *</label>
                <input type="text" className="input-field" placeholder={s.lastNamePlaceholder} {...register('lastName', { required: s.required })} />
                {errors.lastName && <p className="mt-1 text-xs" style={{ color: 'var(--shifa-red)' }}>{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>{s.dateOfBirth} *</label>
              <input type="date" className="input-field" {...register('dateOfBirth', { required: s.dobRequired })} />
              {errors.dateOfBirth && <p className="mt-1 text-xs" style={{ color: 'var(--shifa-red)' }}>{errors.dateOfBirth.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>{s.gender} *</label>
              <select className="input-field" {...register('gender', { required: s.required })}>
                <option value="">{s.genderSelect}</option>
                <option value="F">{s.genderF}</option>
                <option value="M">{s.genderM}</option>
                <option value="O">{s.genderO}</option>
              </select>
              {errors.gender && <p className="mt-1 text-xs" style={{ color: 'var(--shifa-red)' }}>{errors.gender.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>{s.country} *</label>
              <select className="input-field" {...register('country', { required: s.required })}>
                <option value="">{s.countrySelect}</option>
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
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>{s.phone} *</label>
              <input type="tel" className="input-field" placeholder={s.phonePlaceholder} {...register('phone', { required: s.required })} />
            </div>

            <button type="button" onClick={() => setStep(2)} className="btn-primary w-full py-3 mt-2 flex items-center justify-center gap-2">
              {s.continue}
              <Icon name="ArrowRightIcon" size={16} />
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>{s.email} *</label>
              <input type="email" className="input-field" placeholder={s.emailPlaceholder} {...register('email', { required: s.required, pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: s.emailInvalid } })} />
              {errors.email && <p className="mt-1 text-xs" style={{ color: 'var(--shifa-red)' }}>{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>{s.password} *</label>
              <p className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>{s.passwordHint}</p>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} className="input-field pr-11" placeholder="••••••••" {...register('password', {
                  required: s.required,
                  minLength: { value: 8, message: s.minLength },
                  pattern: { value: /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])/, message: s.passwordStrength },
                })} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Icon name={showPassword ? 'EyeSlashIcon' : 'EyeIcon'} size={16} className="text-muted-foreground" />
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs" style={{ color: 'var(--shifa-red)' }}>{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>{s.confirmPassword} *</label>
              <input type="password" className="input-field" placeholder="••••••••" {...register('confirmPassword', {
                required: s.required,
                validate: val => val === password || s.passwordMatch,
              })} />
              {errors.confirmPassword && <p className="mt-1 text-xs" style={{ color: 'var(--shifa-red)' }}>{errors.confirmPassword.message}</p>}
            </div>

            <div className="flex items-start gap-2.5">
              <input type="checkbox" id="acceptTerms" className="w-4 h-4 mt-0.5 rounded accent-primary cursor-pointer" {...register('acceptTerms', { required: s.termsRequired })} />
              <label htmlFor="acceptTerms" className="text-xs cursor-pointer leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                {s.acceptTerms}{' '}
                <a href="#" className="font-semibold" style={{ color: 'var(--shifa-blue)' }}>{s.termsLink}</a>{' '}
                {s.andThe}{' '}
                <a href="#" className="font-semibold" style={{ color: 'var(--shifa-blue)' }}>{s.privacyLink}</a>{' '}
                {s.ofShifa}
              </label>
            </div>
            {errors.acceptTerms && <p className="text-xs" style={{ color: 'var(--shifa-red)' }}>{errors.acceptTerms.message}</p>}

            {/* SHIFA ID info */}
            <div className="flex items-start gap-3 p-3 rounded-xl border" style={{ backgroundColor: 'rgba(0, 242, 195, 0.06)', borderColor: 'rgba(0, 242, 195, 0.25)' }}>
              <Icon name="FingerPrintIcon" size={16} style={{ color: 'var(--shifa-cyan)', flexShrink: 0, marginTop: '1px' } as any} className="" />
              <p className="text-xs" style={{ color: '#00B89A' }}>{s.shifaIdInfo}</p>
            </div>

            <div className="flex gap-3 mt-2">
              <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 py-3 flex items-center justify-center gap-2">
                <Icon name="ArrowLeftIcon" size={15} />
                {s.back}
              </button>
              <button type="submit" disabled={isLoading} className="btn-primary flex-1 py-3 disabled:opacity-60 flex items-center justify-center gap-2" style={{ minHeight: '44px' }}>
                {isLoading ? <Icon name="ArrowPathIcon" size={18} className="animate-spin" /> : (
                  <>
                    <Icon name="CheckCircleIcon" size={16} />
                    {s.createAccount}
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