'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
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

const INST_STRINGS: Record<string, Record<string, string>> = {
  fr: {
    title: 'Enregistrer un Établissement',
    subtitle: 'Hôpital, clinique, laboratoire, pharmacie, université, assurance, ONG…',
    backToLogin: 'Retour à la connexion',
    orgType: "Type d'établissement",
    orgTypeSelect: 'Sélectionner',
    orgName: "Nom de l'établissement",
    orgNamePlaceholder: 'CHU Saint-Louis',
    country: 'Pays',
    countrySelect: 'Pays',
    city: 'Ville',
    cityPlaceholder: 'Dakar',
    address: 'Adresse complète',
    addressPlaceholder: '123 Avenue de la République',
    registrationNumber: "N° d'enregistrement officiel",
    registrationHint: 'Numéro SIRET, FINESS, ou équivalent selon votre pays.',
    registrationPlaceholder: 'FINESS / SIRET / Enregistrement national',
    adminSection: 'Administrateur principal',
    adminFirstName: 'Prénom',
    adminFirstNamePlaceholder: 'Fatou',
    adminLastName: 'Nom',
    adminLastNamePlaceholder: 'Ndiaye',
    adminEmail: 'E-mail administrateur',
    adminEmailPlaceholder: 'admin@chu-saintlouis.sn',
    password: 'Mot de passe',
    acceptTerms: "J'accepte les",
    termsLink: "Conditions d'utilisation",
    andThe: 'et la',
    privacyLink: 'Politique de confidentialité',
    createAccount: "Enregistrer l'établissement",
    required: 'Requis',
    minLength: 'Minimum 8 caractères',
    errorAlreadyUsed: 'Cette adresse e-mail est déjà utilisée. Veuillez vous connecter.',
    errorGeneric: 'Une erreur est survenue lors de la création du compte. Veuillez réessayer.',
    typeHopital: 'Hôpital',
    typeClinique: 'Clinique',
    typeCentreSante: 'Centre de santé',
    typeCabinet: 'Cabinet médical',
    typeLaboratoire: 'Laboratoire',
    typePharmacie: 'Pharmacie',
    typeImagerie: "Centre d'imagerie",
    typeUniversite: 'Université / École de santé',
    typeMinistere: 'Ministère de la santé',
    typeAssurance: 'Assurance / Mutuelle',
    typeOng: 'ONG / Organisation humanitaire',
  },
  en: {
    title: 'Register an Institution',
    subtitle: 'Hospital, clinic, laboratory, pharmacy, university, insurance, NGO…',
    backToLogin: 'Back to login',
    orgType: 'Institution type',
    orgTypeSelect: 'Select',
    orgName: 'Institution name',
    orgNamePlaceholder: 'Saint-Louis University Hospital',
    country: 'Country',
    countrySelect: 'Country',
    city: 'City',
    cityPlaceholder: 'Dakar',
    address: 'Full address',
    addressPlaceholder: '123 Republic Avenue',
    registrationNumber: 'Official registration number',
    registrationHint: 'SIRET, FINESS, or equivalent for your country.',
    registrationPlaceholder: 'FINESS / SIRET / National registration',
    adminSection: 'Main administrator',
    adminFirstName: 'First name',
    adminFirstNamePlaceholder: 'Fatou',
    adminLastName: 'Last name',
    adminLastNamePlaceholder: 'Ndiaye',
    adminEmail: 'Administrator email',
    adminEmailPlaceholder: 'admin@hospital.com',
    password: 'Password',
    acceptTerms: 'I accept the',
    termsLink: 'Terms of Use',
    andThe: 'and the',
    privacyLink: 'Privacy Policy',
    createAccount: 'Register institution',
    required: 'Required',
    minLength: 'Minimum 8 characters',
    errorAlreadyUsed: 'This email is already in use. Please sign in.',
    errorGeneric: 'An error occurred while creating the account. Please try again.',
    typeHopital: 'Hospital',
    typeClinique: 'Clinic',
    typeCentreSante: 'Health center',
    typeCabinet: 'Medical practice',
    typeLaboratoire: 'Laboratory',
    typePharmacie: 'Pharmacy',
    typeImagerie: 'Imaging center',
    typeUniversite: 'University / Health school',
    typeMinistere: 'Ministry of health',
    typeAssurance: 'Insurance / Mutual fund',
    typeOng: 'NGO / Humanitarian organization',
  },
  es: {
    title: 'Registrar una Institución',
    subtitle: 'Hospital, clínica, laboratorio, farmacia, universidad, seguro, ONG…',
    backToLogin: 'Volver al inicio de sesión',
    orgType: 'Tipo de institución',
    orgTypeSelect: 'Seleccionar',
    orgName: 'Nombre de la institución',
    orgNamePlaceholder: 'Hospital Universitario San Luis',
    country: 'País',
    countrySelect: 'País',
    city: 'Ciudad',
    cityPlaceholder: 'Dakar',
    address: 'Dirección completa',
    addressPlaceholder: '123 Avenida de la República',
    registrationNumber: 'N° de registro oficial',
    registrationHint: 'SIRET, FINESS, o equivalente según su país.',
    registrationPlaceholder: 'N° de registro nacional',
    adminSection: 'Administrador principal',
    adminFirstName: 'Nombre',
    adminFirstNamePlaceholder: 'Fatou',
    adminLastName: 'Apellido',
    adminLastNamePlaceholder: 'Ndiaye',
    adminEmail: 'Correo del administrador',
    adminEmailPlaceholder: 'admin@hospital.com',
    password: 'Contraseña',
    acceptTerms: 'Acepto los',
    termsLink: 'Términos de uso',
    andThe: 'y la',
    privacyLink: 'Política de privacidad',
    createAccount: 'Registrar institución',
    required: 'Requerido',
    minLength: 'Mínimo 8 caracteres',
    errorAlreadyUsed: 'Este correo ya está en uso. Por favor inicia sesión.',
    errorGeneric: 'Ocurrió un error al crear la cuenta. Por favor, inténtalo de nuevo.',
    typeHopital: 'Hospital',
    typeClinique: 'Clínica',
    typeCentreSante: 'Centro de salud',
    typeCabinet: 'Consultorio médico',
    typeLaboratoire: 'Laboratorio',
    typePharmacie: 'Farmacia',
    typeImagerie: 'Centro de imagen',
    typeUniversite: 'Universidad / Escuela de salud',
    typeMinistere: 'Ministerio de salud',
    typeAssurance: 'Seguro / Mutua',
    typeOng: 'ONG / Organización humanitaria',
  },
  pt: {
    title: 'Registrar uma Instituição',
    subtitle: 'Hospital, clínica, laboratório, farmácia, universidade, seguro, ONG…',
    backToLogin: 'Voltar ao login',
    orgType: 'Tipo de instituição',
    orgTypeSelect: 'Selecionar',
    orgName: 'Nome da instituição',
    orgNamePlaceholder: 'Hospital Universitário São Luís',
    country: 'País',
    countrySelect: 'País',
    city: 'Cidade',
    cityPlaceholder: 'Dakar',
    address: 'Endereço completo',
    addressPlaceholder: '123 Avenida da República',
    registrationNumber: 'N° de registro oficial',
    registrationHint: 'CNPJ, CNES, ou equivalente para o seu país.',
    registrationPlaceholder: 'CNPJ / CNES / Registro nacional',
    adminSection: 'Administrador principal',
    adminFirstName: 'Nome',
    adminFirstNamePlaceholder: 'Fatou',
    adminLastName: 'Sobrenome',
    adminLastNamePlaceholder: 'Ndiaye',
    adminEmail: 'E-mail do administrador',
    adminEmailPlaceholder: 'admin@hospital.com.br',
    password: 'Senha',
    acceptTerms: 'Aceito os',
    termsLink: 'Termos de Uso',
    andThe: 'e a',
    privacyLink: 'Política de Privacidade',
    createAccount: 'Registrar instituição',
    required: 'Obrigatório',
    minLength: 'Mínimo 8 caracteres',
    errorAlreadyUsed: 'Este e-mail já está em uso. Por favor, faça login.',
    errorGeneric: 'Ocorreu um erro ao criar a conta. Por favor, tente novamente.',
    typeHopital: 'Hospital',
    typeClinique: 'Clínica',
    typeCentreSante: 'Centro de saúde',
    typeCabinet: 'Consultório médico',
    typeLaboratoire: 'Laboratório',
    typePharmacie: 'Farmácia',
    typeImagerie: 'Centro de imagem',
    typeUniversite: 'Universidade / Escola de saúde',
    typeMinistere: 'Ministério da saúde',
    typeAssurance: 'Seguro / Plano de saúde',
    typeOng: 'ONG / Organização humanitária',
  },
  ar: {
    title: 'تسجيل مؤسسة',
    subtitle: 'مستشفى، عيادة، مختبر، صيدلية، جامعة، تأمين، منظمة غير حكومية…',
    backToLogin: 'العودة إلى تسجيل الدخول',
    orgType: 'نوع المؤسسة',
    orgTypeSelect: 'اختر',
    orgName: 'اسم المؤسسة',
    orgNamePlaceholder: 'مستشفى سان لويس الجامعي',
    country: 'البلد',
    countrySelect: 'البلد',
    city: 'المدينة',
    cityPlaceholder: 'داكار',
    address: 'العنوان الكامل',
    addressPlaceholder: '123 شارع الجمهورية',
    registrationNumber: 'رقم التسجيل الرسمي',
    registrationHint: 'رقم SIRET أو FINESS أو ما يعادله في بلدك.',
    registrationPlaceholder: 'رقم التسجيل الوطني',
    adminSection: 'المسؤول الرئيسي',
    adminFirstName: 'الاسم الأول',
    adminFirstNamePlaceholder: 'فاطو',
    adminLastName: 'اسم العائلة',
    adminLastNamePlaceholder: 'نجاي',
    adminEmail: 'البريد الإلكتروني للمسؤول',
    adminEmailPlaceholder: 'admin@hospital.com',
    password: 'كلمة المرور',
    acceptTerms: 'أوافق على',
    termsLink: 'شروط الاستخدام',
    andThe: 'و',
    privacyLink: 'سياسة الخصوصية',
    createAccount: 'تسجيل المؤسسة',
    required: 'مطلوب',
    minLength: 'الحد الأدنى 8 أحرف',
    errorAlreadyUsed: 'هذا البريد الإلكتروني مستخدم بالفعل. يرجى تسجيل الدخول.',
    errorGeneric: 'حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.',
    typeHopital: 'مستشفى',
    typeClinique: 'عيادة',
    typeCentreSante: 'مركز صحي',
    typeCabinet: 'عيادة طبية',
    typeLaboratoire: 'مختبر',
    typePharmacie: 'صيدلية',
    typeImagerie: 'مركز تصوير',
    typeUniversite: 'جامعة / مدرسة صحة',
    typeMinistere: 'وزارة الصحة',
    typeAssurance: 'تأمين / صندوق تعاضد',
    typeOng: 'منظمة غير حكومية / إنسانية',
  },
  zh: {
    title: '注册机构',
    subtitle: '医院、诊所、实验室、药房、大学、保险、非政府组织…',
    backToLogin: '返回登录',
    orgType: '机构类型',
    orgTypeSelect: '请选择',
    orgName: '机构名称',
    orgNamePlaceholder: '圣路易斯大学医院',
    country: '国家',
    countrySelect: '国家',
    city: '城市',
    cityPlaceholder: '达喀尔',
    address: '完整地址',
    addressPlaceholder: '共和国大道123号',
    registrationNumber: '官方注册号',
    registrationHint: '根据您所在国家的SIRET、FINESS或同等编号。',
    registrationPlaceholder: '国家注册号',
    adminSection: '主要管理员',
    adminFirstName: '名字',
    adminFirstNamePlaceholder: '法图',
    adminLastName: '姓氏',
    adminLastNamePlaceholder: '恩贾伊',
    adminEmail: '管理员电子邮件',
    adminEmailPlaceholder: 'admin@hospital.com',
    password: '密码',
    acceptTerms: '我接受',
    termsLink: '使用条款',
    andThe: '和',
    privacyLink: '隐私政策',
    createAccount: '注册机构',
    required: '必填',
    minLength: '最少8个字符',
    errorAlreadyUsed: '此电子邮件已被使用，请登录。',
    errorGeneric: '创建账户时发生错误，请重试。',
    typeHopital: '医院',
    typeClinique: '诊所',
    typeCentreSante: '卫生中心',
    typeCabinet: '医疗诊所',
    typeLaboratoire: '实验室',
    typePharmacie: '药房',
    typeImagerie: '影像中心',
    typeUniversite: '大学 / 卫生学校',
    typeMinistere: '卫生部',
    typeAssurance: '保险 / 互助基金',
    typeOng: '非政府组织 / 人道主义组织',
  },
};

export default function InstitutionRegisterForm({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();
  const { language } = useLanguage();
  const s = INST_STRINGS[language] || INST_STRINGS['fr'];
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
        setRegisterError(s.errorAlreadyUsed);
      } else {
        setRegisterError(s.errorGeneric);
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
        {s.backToLogin}
      </button>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0A1B3D, #0066FF)' }}>
            <Icon name="BuildingOffice2Icon" size={16} className="text-white" />
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

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>{s.orgType} *</label>
          <select className="input-field" {...register('orgType', { required: s.required })}>
            <option value="">{s.orgTypeSelect}</option>
            <option value="hopital">{s.typeHopital}</option>
            <option value="clinique">{s.typeClinique}</option>
            <option value="centre-sante">{s.typeCentreSante}</option>
            <option value="cabinet">{s.typeCabinet}</option>
            <option value="laboratoire">{s.typeLaboratoire}</option>
            <option value="pharmacie">{s.typePharmacie}</option>
            <option value="imagerie">{s.typeImagerie}</option>
            <option value="universite">{s.typeUniversite}</option>
            <option value="ministere">{s.typeMinistere}</option>
            <option value="assurance">{s.typeAssurance}</option>
            <option value="ong">{s.typeOng}</option>
          </select>
          {errors.orgType && <p className="mt-1 text-xs" style={{ color: 'var(--shifa-red)' }}>{errors.orgType.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>{s.orgName} *</label>
          <input type="text" className="input-field" placeholder={s.orgNamePlaceholder} {...register('orgName', { required: s.required })} />
          {errors.orgName && <p className="mt-1 text-xs" style={{ color: 'var(--shifa-red)' }}>{errors.orgName.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>{s.country} *</label>
            <select className="input-field" {...register('country', { required: s.required })}>
              <option value="">{s.countrySelect}</option>
              <option value="FR">France</option>
              <option value="SN">Sénégal</option>
              <option value="MA">Maroc</option>
              <option value="CI">Côte d'Ivoire</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>{s.city} *</label>
            <input type="text" className="input-field" placeholder={s.cityPlaceholder} {...register('city', { required: s.required })} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>{s.address} *</label>
          <input type="text" className="input-field" placeholder={s.addressPlaceholder} {...register('address', { required: s.required })} />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>{s.registrationNumber}</label>
          <p className="text-xs mb-1.5" style={{ color: 'var(--muted-foreground)' }}>{s.registrationHint}</p>
          <input type="text" className="input-field font-mono" placeholder={s.registrationPlaceholder} {...register('registrationNumber')} />
        </div>

        <div className="border-t pt-4" style={{ borderColor: 'var(--border)' }}>
          <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--muted-foreground)' }}>{s.adminSection}</p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>{s.adminFirstName} *</label>
              <input type="text" className="input-field" placeholder={s.adminFirstNamePlaceholder} {...register('adminFirstName', { required: s.required })} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>{s.adminLastName} *</label>
              <input type="text" className="input-field" placeholder={s.adminLastNamePlaceholder} {...register('adminLastName', { required: s.required })} />
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>{s.adminEmail} *</label>
            <input type="email" className="input-field" placeholder={s.adminEmailPlaceholder} {...register('adminEmail', { required: s.required })} />
            {errors.adminEmail && <p className="mt-1 text-xs" style={{ color: 'var(--shifa-red)' }}>{errors.adminEmail.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>{s.password} *</label>
            <input type="password" className="input-field" placeholder="••••••••" {...register('password', { required: s.required, minLength: { value: 8, message: s.minLength } })} />
            {errors.password && <p className="mt-1 text-xs" style={{ color: 'var(--shifa-red)' }}>{errors.password.message}</p>}
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <input type="checkbox" id="instTerms" className="w-4 h-4 mt-0.5 accent-primary cursor-pointer" {...register('acceptTerms', { required: s.required })} />
          <label htmlFor="instTerms" className="text-xs cursor-pointer" style={{ color: 'var(--muted-foreground)' }}>
            {s.acceptTerms}{' '}
            <a href="#" className="font-semibold" style={{ color: 'var(--shifa-blue)' }}>{s.termsLink}</a>{' '}
            {s.andThe}{' '}
            <a href="#" className="font-semibold" style={{ color: 'var(--shifa-blue)' }}>{s.privacyLink}</a>.
          </label>
        </div>

        <button type="submit" disabled={isLoading} className="btn-primary w-full py-3 disabled:opacity-60 flex items-center justify-center gap-2" style={{ minHeight: '44px' }}>
          {isLoading ? <Icon name="ArrowPathIcon" size={18} className="animate-spin" /> : (
            <>
              <Icon name="BuildingOffice2Icon" size={16} />
              {s.createAccount}
            </>
          )}
        </button>
      </form>
    </div>
  );
}