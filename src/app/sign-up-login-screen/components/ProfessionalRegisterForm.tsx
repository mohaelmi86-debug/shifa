'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
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

const PRO_STRINGS: Record<string, Record<string, string>> = {
  fr: {
    title: 'Espace Professionnel',
    backToLogin: 'Retour à la connexion',
    liberal: 'Libéral',
    liberalSub: 'Inscription directe',
    salarie: 'Salarié / Rattaché',
    salarieSub: 'Sur invitation',
    firstName: 'Prénom',
    firstNamePlaceholder: 'Mohamed',
    lastName: 'Nom',
    lastNamePlaceholder: 'Sy',
    profession: 'Profession',
    professionSelect: 'Sélectionner',
    specialty: 'Spécialité',
    specialtyPlaceholder: 'Médecine générale, Cardiologie...',
    licenseNumber: "N° d'ordre / Licence professionnelle",
    licenseHint: 'Sera vérifié auprès de votre ordre professionnel national.',
    licensePlaceholder: 'ADELI / RPPS / N° d\'ordre',
    country: 'Pays',
    countrySelect: 'Pays',
    phone: 'Téléphone',
    phonePlaceholder: '+33 6...',
    email: 'E-mail professionnel',
    emailPlaceholder: 'dr.sy@cabinet.com',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer',
    acceptTerms: "J'accepte les",
    termsLink: "Conditions d'utilisation",
    andThe: 'et la',
    privacyLink: 'Politique de confidentialité',
    createAccount: 'Créer mon compte professionnel',
    required: 'Requis',
    minLength: 'Minimum 8 caractères',
    passwordMatch: 'Les mots de passe ne correspondent pas',
    licenseRequired: 'Le numéro professionnel est requis',
    termsRequired: 'Requis',
    errorAlreadyUsed: 'Cette adresse e-mail est déjà utilisée. Veuillez vous connecter.',
    errorGeneric: 'Une erreur est survenue lors de la création du compte. Veuillez réessayer.',
    profMedecin: 'Médecin',
    profInfirmier: 'Infirmier(ère)',
    profPharmacien: 'Pharmacien(ne)',
    profSageFemme: 'Sage-femme',
    profKine: 'Kinésithérapeute',
    profDentiste: 'Dentiste',
    profPsychologue: 'Psychologue',
    profLaborantin: 'Biologiste / Laborantin',
  },
  en: {
    title: 'Professional Space',
    backToLogin: 'Back to login',
    liberal: 'Independent',
    liberalSub: 'Direct registration',
    salarie: 'Employed / Affiliated',
    salarieSub: 'By invitation',
    firstName: 'First name',
    firstNamePlaceholder: 'Mohamed',
    lastName: 'Last name',
    lastNamePlaceholder: 'Sy',
    profession: 'Profession',
    professionSelect: 'Select',
    specialty: 'Specialty',
    specialtyPlaceholder: 'General medicine, Cardiology...',
    licenseNumber: 'License / Registration number',
    licenseHint: 'Will be verified with your national professional body.',
    licensePlaceholder: 'GMC / NMC / License number',
    country: 'Country',
    countrySelect: 'Country',
    phone: 'Phone',
    phonePlaceholder: '+44 7700...',
    email: 'Professional email',
    emailPlaceholder: 'dr.sy@practice.com',
    password: 'Password',
    confirmPassword: 'Confirm',
    acceptTerms: 'I accept the',
    termsLink: 'Terms of Use',
    andThe: 'and the',
    privacyLink: 'Privacy Policy',
    createAccount: 'Create my professional account',
    required: 'Required',
    minLength: 'Minimum 8 characters',
    passwordMatch: 'Passwords do not match',
    licenseRequired: 'Professional number is required',
    termsRequired: 'Required',
    errorAlreadyUsed: 'This email is already in use. Please sign in.',
    errorGeneric: 'An error occurred while creating the account. Please try again.',
    profMedecin: 'Doctor',
    profInfirmier: 'Nurse',
    profPharmacien: 'Pharmacist',
    profSageFemme: 'Midwife',
    profKine: 'Physiotherapist',
    profDentiste: 'Dentist',
    profPsychologue: 'Psychologist',
    profLaborantin: 'Biologist / Lab technician',
  },
  es: {
    title: 'Espacio Profesional',
    backToLogin: 'Volver al inicio de sesión',
    liberal: 'Independiente',
    liberalSub: 'Registro directo',
    salarie: 'Empleado / Afiliado',
    salarieSub: 'Por invitación',
    firstName: 'Nombre',
    firstNamePlaceholder: 'Mohamed',
    lastName: 'Apellido',
    lastNamePlaceholder: 'Sy',
    profession: 'Profesión',
    professionSelect: 'Seleccionar',
    specialty: 'Especialidad',
    specialtyPlaceholder: 'Medicina general, Cardiología...',
    licenseNumber: 'N° de colegiado / Licencia profesional',
    licenseHint: 'Será verificado con su colegio profesional nacional.',
    licensePlaceholder: 'N° de colegiado',
    country: 'País',
    countrySelect: 'País',
    phone: 'Teléfono',
    phonePlaceholder: '+34 600...',
    email: 'Correo profesional',
    emailPlaceholder: 'dr.sy@clinica.com',
    password: 'Contraseña',
    confirmPassword: 'Confirmar',
    acceptTerms: 'Acepto los',
    termsLink: 'Términos de uso',
    andThe: 'y la',
    privacyLink: 'Política de privacidad',
    createAccount: 'Crear mi cuenta profesional',
    required: 'Requerido',
    minLength: 'Mínimo 8 caracteres',
    passwordMatch: 'Las contraseñas no coinciden',
    licenseRequired: 'El número profesional es obligatorio',
    termsRequired: 'Requerido',
    errorAlreadyUsed: 'Este correo ya está en uso. Por favor inicia sesión.',
    errorGeneric: 'Ocurrió un error al crear la cuenta. Por favor, inténtalo de nuevo.',
    profMedecin: 'Médico',
    profInfirmier: 'Enfermero/a',
    profPharmacien: 'Farmacéutico/a',
    profSageFemme: 'Matrona',
    profKine: 'Fisioterapeuta',
    profDentiste: 'Dentista',
    profPsychologue: 'Psicólogo/a',
    profLaborantin: 'Biólogo / Técnico de laboratorio',
  },
  pt: {
    title: 'Espaço Profissional',
    backToLogin: 'Voltar ao login',
    liberal: 'Liberal',
    liberalSub: 'Cadastro direto',
    salarie: 'Empregado / Vinculado',
    salarieSub: 'Por convite',
    firstName: 'Nome',
    firstNamePlaceholder: 'Mohamed',
    lastName: 'Sobrenome',
    lastNamePlaceholder: 'Sy',
    profession: 'Profissão',
    professionSelect: 'Selecionar',
    specialty: 'Especialidade',
    specialtyPlaceholder: 'Medicina geral, Cardiologia...',
    licenseNumber: 'N° de registro / Licença profissional',
    licenseHint: 'Será verificado junto ao seu conselho profissional nacional.',
    licensePlaceholder: 'CRM / CRF / N° de registro',
    country: 'País',
    countrySelect: 'País',
    phone: 'Telefone',
    phonePlaceholder: '+55 11...',
    email: 'E-mail profissional',
    emailPlaceholder: 'dr.sy@clinica.com.br',
    password: 'Senha',
    confirmPassword: 'Confirmar',
    acceptTerms: 'Aceito os',
    termsLink: 'Termos de Uso',
    andThe: 'e a',
    privacyLink: 'Política de Privacidade',
    createAccount: 'Criar minha conta profissional',
    required: 'Obrigatório',
    minLength: 'Mínimo 8 caracteres',
    passwordMatch: 'As senhas não coincidem',
    licenseRequired: 'O número profissional é obrigatório',
    termsRequired: 'Obrigatório',
    errorAlreadyUsed: 'Este e-mail já está em uso. Por favor, faça login.',
    errorGeneric: 'Ocorreu um erro ao criar a conta. Por favor, tente novamente.',
    profMedecin: 'Médico',
    profInfirmier: 'Enfermeiro/a',
    profPharmacien: 'Farmacêutico/a',
    profSageFemme: 'Parteira',
    profKine: 'Fisioterapeuta',
    profDentiste: 'Dentista',
    profPsychologue: 'Psicólogo/a',
    profLaborantin: 'Biólogo / Técnico de laboratório',
  },
  ar: {
    title: 'الفضاء المهني',
    backToLogin: 'العودة إلى تسجيل الدخول',
    liberal: 'مستقل',
    liberalSub: 'تسجيل مباشر',
    salarie: 'موظف / تابع',
    salarieSub: 'بالدعوة',
    firstName: 'الاسم الأول',
    firstNamePlaceholder: 'محمد',
    lastName: 'اسم العائلة',
    lastNamePlaceholder: 'سي',
    profession: 'المهنة',
    professionSelect: 'اختر',
    specialty: 'التخصص',
    specialtyPlaceholder: 'الطب العام، أمراض القلب...',
    licenseNumber: 'رقم الترخيص المهني',
    licenseHint: 'سيتم التحقق منه مع هيئتك المهنية الوطنية.',
    licensePlaceholder: 'رقم الترخيص',
    country: 'البلد',
    countrySelect: 'البلد',
    phone: 'الهاتف',
    phonePlaceholder: '+966 50...',
    email: 'البريد الإلكتروني المهني',
    emailPlaceholder: 'dr.sy@clinic.com',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد',
    acceptTerms: 'أوافق على',
    termsLink: 'شروط الاستخدام',
    andThe: 'و',
    privacyLink: 'سياسة الخصوصية',
    createAccount: 'إنشاء حسابي المهني',
    required: 'مطلوب',
    minLength: 'الحد الأدنى 8 أحرف',
    passwordMatch: 'كلمتا المرور غير متطابقتين',
    licenseRequired: 'رقم الترخيص المهني مطلوب',
    termsRequired: 'مطلوب',
    errorAlreadyUsed: 'هذا البريد الإلكتروني مستخدم بالفعل. يرجى تسجيل الدخول.',
    errorGeneric: 'حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.',
    profMedecin: 'طبيب',
    profInfirmier: 'ممرض/ة',
    profPharmacien: 'صيدلاني/ة',
    profSageFemme: 'قابلة',
    profKine: 'معالج فيزيائي',
    profDentiste: 'طبيب أسنان',
    profPsychologue: 'طبيب نفسي',
    profLaborantin: 'بيولوجي / تقني مختبر',
  },
  zh: {
    title: '专业人员空间',
    backToLogin: '返回登录',
    liberal: '独立执业',
    liberalSub: '直接注册',
    salarie: '受雇 / 附属',
    salarieSub: '受邀注册',
    firstName: '名字',
    firstNamePlaceholder: '穆罕默德',
    lastName: '姓氏',
    lastNamePlaceholder: '斯',
    profession: '职业',
    professionSelect: '请选择',
    specialty: '专科',
    specialtyPlaceholder: '全科医学、心脏病学...',
    licenseNumber: '执照 / 职业注册号',
    licenseHint: '将向您的全国专业机构核实。',
    licensePlaceholder: '执照号码',
    country: '国家',
    countrySelect: '国家',
    phone: '电话',
    phonePlaceholder: '+86 138...',
    email: '专业电子邮件',
    emailPlaceholder: 'dr.sy@clinic.com',
    password: '密码',
    confirmPassword: '确认',
    acceptTerms: '我接受',
    termsLink: '使用条款',
    andThe: '和',
    privacyLink: '隐私政策',
    createAccount: '创建我的专业账户',
    required: '必填',
    minLength: '最少8个字符',
    passwordMatch: '两次密码不一致',
    licenseRequired: '职业编号为必填项',
    termsRequired: '必填',
    errorAlreadyUsed: '此电子邮件已被使用，请登录。',
    errorGeneric: '创建账户时发生错误，请重试。',
    profMedecin: '医生',
    profInfirmier: '护士',
    profPharmacien: '药剂师',
    profSageFemme: '助产士',
    profKine: '物理治疗师',
    profDentiste: '牙医',
    profPsychologue: '心理学家',
    profLaborantin: '生物学家 / 实验室技术员',
  },
};

export default function ProfessionalRegisterForm({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [proType, setProType] = useState<'liberal' | 'salarie'>('liberal');
  const { signUp } = useAuth();
  const router = useRouter();
  const { language } = useLanguage();
  const s = PRO_STRINGS[language] || PRO_STRINGS['fr'];
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
        setRegisterError(s.errorAlreadyUsed);
      } else {
        setRegisterError(s.errorGeneric);
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

      <button
        onClick={onSwitchToLogin}
        className="flex items-center gap-1.5 text-sm font-medium mb-5 transition-colors"
        style={{ color: 'var(--muted-foreground)' }}
      >
        <Icon name="ArrowLeftIcon" size={15} />
        {s.backToLogin}
      </button>

      <div className="mb-5">
        <div className="flex items-center gap-2.5 mb-4">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #5B2D8E, #6D4FC2)' }}
          >
            <Icon name="UserGroupIcon" size={17} className="text-white" />
          </div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--shifa-dark)', letterSpacing: '-0.02em' }}>
            {s.title}
          </h1>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'liberal' as const, label: s.liberal, sub: s.liberalSub, color: '#0D9E6E' },
            { value: 'salarie' as const, label: s.salarie, sub: s.salarieSub, color: '#6D4FC2' },
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

      {registerError && (
        <div className="flex items-start gap-3 p-3.5 rounded-xl mb-4 border" style={{ backgroundColor: 'rgba(217,48,37,0.05)', borderColor: 'rgba(217,48,37,0.18)' }}>
          <Icon name="ExclamationCircleIcon" size={17} style={{ color: '#D93025', flexShrink: 0, marginTop: 1 } as any} />
          <p className="text-sm" style={{ color: '#D93025' }}>{registerError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>{s.firstName} *</label>
            <input type="text" className="input-premium" placeholder={s.firstNamePlaceholder} {...register('firstName', { required: s.required })} />
            {errors.firstName && <p className="mt-1 text-xs" style={{ color: '#D93025' }}>{errors.firstName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>{s.lastName} *</label>
            <input type="text" className="input-premium" placeholder={s.lastNamePlaceholder} {...register('lastName', { required: s.required })} />
            {errors.lastName && <p className="mt-1 text-xs" style={{ color: '#D93025' }}>{errors.lastName.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>{s.profession} *</label>
          <select className="input-premium" style={{ appearance: 'auto' }} {...register('profession', { required: s.required })}>
            <option value="">{s.professionSelect}</option>
            <option value="medecin">{s.profMedecin}</option>
            <option value="infirmier">{s.profInfirmier}</option>
            <option value="pharmacien">{s.profPharmacien}</option>
            <option value="sage-femme">{s.profSageFemme}</option>
            <option value="kinesitherapeute">{s.profKine}</option>
            <option value="dentiste">{s.profDentiste}</option>
            <option value="psychologue">{s.profPsychologue}</option>
            <option value="laborantin">{s.profLaborantin}</option>
          </select>
          {errors.profession && <p className="mt-1 text-xs" style={{ color: '#D93025' }}>{errors.profession.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>{s.specialty}</label>
          <input type="text" className="input-premium" placeholder={s.specialtyPlaceholder} {...register('specialty')} />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--foreground)' }}>
            {s.licenseNumber} *
          </label>
          <p className="text-xs mb-1.5" style={{ color: 'var(--muted-foreground)' }}>{s.licenseHint}</p>
          <input
            type="text"
            className="input-premium font-mono"
            placeholder={s.licensePlaceholder}
            {...register('licenseNumber', { required: s.licenseRequired })}
          />
          {errors.licenseNumber && <p className="mt-1 text-xs" style={{ color: '#D93025' }}>{errors.licenseNumber.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>{s.country} *</label>
            <select className="input-premium" style={{ appearance: 'auto' }} {...register('country', { required: s.required })}>
              <option value="">{s.countrySelect}</option>
              <option value="FR">France</option>
              <option value="SN">Sénégal</option>
              <option value="MA">Maroc</option>
              <option value="CI">Côte d'Ivoire</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>{s.phone} *</label>
            <input type="tel" className="input-premium" placeholder={s.phonePlaceholder} {...register('phone', { required: s.required })} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>{s.email} *</label>
          <input type="email" className="input-premium" placeholder={s.emailPlaceholder} {...register('email', { required: s.required })} />
          {errors.email && <p className="mt-1 text-xs" style={{ color: '#D93025' }}>{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>{s.password} *</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="input-premium"
              style={{ paddingRight: '2.75rem' }}
              placeholder="••••••••"
              {...register('password', { required: s.required, minLength: { value: 8, message: s.minLength } })}
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

        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>{s.confirmPassword} *</label>
          <input
            type="password"
            className="input-premium"
            placeholder="••••••••"
            {...register('confirmPassword', {
              required: s.required,
              validate: val => val === password || s.passwordMatch,
            })}
          />
          {errors.confirmPassword && <p className="mt-1 text-xs" style={{ color: '#D93025' }}>{errors.confirmPassword.message}</p>}
        </div>

        <div className="flex items-start gap-2.5">
          <input
            type="checkbox"
            id="proTerms"
            className="w-4 h-4 mt-0.5 accent-primary cursor-pointer"
            {...register('acceptTerms', { required: s.termsRequired })}
          />
          <label htmlFor="proTerms" className="text-xs cursor-pointer leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
            {s.acceptTerms}{' '}
            <a href="#" className="font-semibold" style={{ color: 'var(--shifa-blue)' }}>{s.termsLink}</a>{' '}
            {s.andThe}{' '}
            <a href="#" className="font-semibold" style={{ color: 'var(--shifa-blue)' }}>{s.privacyLink}</a>.
          </label>
        </div>
        {errors.acceptTerms && <p className="text-xs" style={{ color: '#D93025' }}>{errors.acceptTerms.message}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full py-3 mt-1 disabled:opacity-60 flex items-center justify-center gap-2"
          style={{ minHeight: '44px' }}
        >
          {isLoading ? (
            <Icon name="ArrowPathIcon" size={18} className="animate-spin" />
          ) : (
            <>
              <Icon name="UserGroupIcon" size={16} />
              {s.createAccount}
            </>
          )}
        </button>
      </form>
    </div>
  );
}