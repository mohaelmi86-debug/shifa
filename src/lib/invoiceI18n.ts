'use client';

import type { Language } from '@/lib/i18n';

// ─── Invoice Locale Config ────────────────────────────────────────────────────

export interface InvoiceLocaleConfig {
  language: Language;
  countryCode: string;
  currencyCode: string;
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD' | 'DD-MM-YYYY';
  taxLabel: string;
  taxIdLabel: string;
  taxRate: number;
  legalDisclaimer: string;
  invoiceLabel: string;
  dueDateLabel: string;
  totalLabel: string;
  subtotalLabel: string;
  taxAmountLabel: string;
  issuedByLabel: string;
  paymentMethodLabel: string;
  rtl: boolean;
}

const INVOICE_LOCALE_MAP: Record<string, InvoiceLocaleConfig> = {
  'fr-FR': {
    language: 'fr', countryCode: 'FR', currencyCode: 'EUR',
    dateFormat: 'DD/MM/YYYY', taxLabel: 'TVA', taxIdLabel: 'N° TVA Intracommunautaire',
    taxRate: 0.20, rtl: false,
    legalDisclaimer: 'Facture conforme à la réglementation française. TVA applicable selon l\'article 283 du CGI. En cas de retard de paiement, des pénalités seront appliquées.',
    invoiceLabel: 'FACTURE', dueDateLabel: 'Date d\'échéance', totalLabel: 'Total TTC',
    subtotalLabel: 'Sous-total HT', taxAmountLabel: 'TVA', issuedByLabel: 'Émis par',
    paymentMethodLabel: 'Mode de paiement',
  },
  'fr-MA': {
    language: 'fr', countryCode: 'MA', currencyCode: 'MAD',
    dateFormat: 'DD/MM/YYYY', taxLabel: 'TVA', taxIdLabel: 'ICE / IF',
    taxRate: 0.20, rtl: false,
    legalDisclaimer: 'Facture conforme à la réglementation marocaine. TVA applicable selon le Code Général des Impôts du Maroc.',
    invoiceLabel: 'FACTURE', dueDateLabel: 'Date d\'échéance', totalLabel: 'Total TTC',
    subtotalLabel: 'Sous-total HT', taxAmountLabel: 'TVA', issuedByLabel: 'Émis par',
    paymentMethodLabel: 'Mode de paiement',
  },
  'fr-SN': {
    language: 'fr', countryCode: 'SN', currencyCode: 'XOF',
    dateFormat: 'DD/MM/YYYY', taxLabel: 'TVA', taxIdLabel: 'NINEA',
    taxRate: 0.18, rtl: false,
    legalDisclaimer: 'Facture conforme à la réglementation sénégalaise. TVA 18% applicable selon le Code Général des Impôts.',
    invoiceLabel: 'FACTURE', dueDateLabel: 'Date d\'échéance', totalLabel: 'Total TTC',
    subtotalLabel: 'Sous-total HT', taxAmountLabel: 'TVA', issuedByLabel: 'Émis par',
    paymentMethodLabel: 'Mode de paiement',
  },
  'fr-KM': {
    language: 'fr', countryCode: 'KM', currencyCode: 'KMF',
    dateFormat: 'DD/MM/YYYY', taxLabel: 'TVA', taxIdLabel: 'NIF',
    taxRate: 0.10, rtl: false,
    legalDisclaimer: 'Facture conforme à la réglementation comorienne. SHIFA Health OS — Moroni, Comores.',
    invoiceLabel: 'FACTURE', dueDateLabel: 'Date d\'échéance', totalLabel: 'Total TTC',
    subtotalLabel: 'Sous-total HT', taxAmountLabel: 'TVA', issuedByLabel: 'Émis par',
    paymentMethodLabel: 'Mode de paiement',
  },
  'en-GB': {
    language: 'en', countryCode: 'GB', currencyCode: 'GBP',
    dateFormat: 'DD/MM/YYYY', taxLabel: 'VAT', taxIdLabel: 'VAT Registration Number',
    taxRate: 0.20, rtl: false,
    legalDisclaimer: 'Invoice compliant with UK regulations. VAT applicable under HMRC guidelines. Late payment charges may apply under the Late Payment of Commercial Debts Act.',
    invoiceLabel: 'INVOICE', dueDateLabel: 'Due Date', totalLabel: 'Total (incl. VAT)',
    subtotalLabel: 'Subtotal (excl. VAT)', taxAmountLabel: 'VAT', issuedByLabel: 'Issued by',
    paymentMethodLabel: 'Payment Method',
  },
  'en-AE': {
    language: 'en', countryCode: 'AE', currencyCode: 'AED',
    dateFormat: 'DD/MM/YYYY', taxLabel: 'VAT', taxIdLabel: 'TRN (Tax Registration Number)',
    taxRate: 0.05, rtl: false,
    legalDisclaimer: 'Tax Invoice compliant with UAE VAT regulations (Federal Decree-Law No. 8 of 2017). TRN required for B2B transactions.',
    invoiceLabel: 'TAX INVOICE', dueDateLabel: 'Due Date', totalLabel: 'Total (incl. VAT)',
    subtotalLabel: 'Subtotal (excl. VAT)', taxAmountLabel: 'VAT (5%)', issuedByLabel: 'Issued by',
    paymentMethodLabel: 'Payment Method',
  },
  'ar-AE': {
    language: 'ar', countryCode: 'AE', currencyCode: 'AED',
    dateFormat: 'DD/MM/YYYY', taxLabel: 'ضريبة القيمة المضافة', taxIdLabel: 'رقم التسجيل الضريبي',
    taxRate: 0.05, rtl: true,
    legalDisclaimer: 'فاتورة ضريبية متوافقة مع لوائح ضريبة القيمة المضافة الإماراتية (المرسوم بقانون اتحادي رقم 8 لسنة 2017).',
    invoiceLabel: 'فاتورة ضريبية', dueDateLabel: 'تاريخ الاستحقاق', totalLabel: 'الإجمالي شامل الضريبة',
    subtotalLabel: 'المجموع قبل الضريبة', taxAmountLabel: 'ضريبة القيمة المضافة', issuedByLabel: 'صادرة عن',
    paymentMethodLabel: 'طريقة الدفع',
  },
  'ar-MA': {
    language: 'ar', countryCode: 'MA', currencyCode: 'MAD',
    dateFormat: 'DD/MM/YYYY', taxLabel: 'TVA / ضريبة', taxIdLabel: 'رقم الضريبة',
    taxRate: 0.20, rtl: true,
    legalDisclaimer: 'فاتورة متوافقة مع اللوائح المغربية. ضريبة القيمة المضافة مطبقة وفق المدونة العامة للضرائب.',
    invoiceLabel: 'فاتورة', dueDateLabel: 'تاريخ الاستحقاق', totalLabel: 'المجموع شامل الضريبة',
    subtotalLabel: 'المجموع قبل الضريبة', taxAmountLabel: 'الضريبة', issuedByLabel: 'صادرة عن',
    paymentMethodLabel: 'طريقة الدفع',
  },
  'es-ES': {
    language: 'es', countryCode: 'ES', currencyCode: 'EUR',
    dateFormat: 'DD/MM/YYYY', taxLabel: 'IVA', taxIdLabel: 'NIF / CIF',
    taxRate: 0.21, rtl: false,
    legalDisclaimer: 'Factura conforme a la normativa española. IVA aplicable según la Ley 37/1992 del Impuesto sobre el Valor Añadido.',
    invoiceLabel: 'FACTURA', dueDateLabel: 'Fecha de vencimiento', totalLabel: 'Total (IVA incluido)',
    subtotalLabel: 'Base imponible', taxAmountLabel: 'IVA', issuedByLabel: 'Emitido por',
    paymentMethodLabel: 'Método de pago',
  },
  'pt-BR': {
    language: 'pt', countryCode: 'BR', currencyCode: 'BRL',
    dateFormat: 'DD/MM/YYYY', taxLabel: 'Impostos', taxIdLabel: 'CNPJ / CPF',
    taxRate: 0.12, rtl: false,
    legalDisclaimer: 'Nota fiscal emitida em conformidade com a legislação brasileira. Documento auxiliar da Nota Fiscal Eletrônica (DANFE).',
    invoiceLabel: 'NOTA FISCAL', dueDateLabel: 'Data de vencimento', totalLabel: 'Total',
    subtotalLabel: 'Subtotal', taxAmountLabel: 'Impostos', issuedByLabel: 'Emitido por',
    paymentMethodLabel: 'Forma de pagamento',
  },
  'pt-PT': {
    language: 'pt', countryCode: 'PT', currencyCode: 'EUR',
    dateFormat: 'DD/MM/YYYY', taxLabel: 'IVA', taxIdLabel: 'NIF',
    taxRate: 0.23, rtl: false,
    legalDisclaimer: 'Fatura conforme a legislação portuguesa. IVA aplicável nos termos do Código do IVA (CIVA).',
    invoiceLabel: 'FATURA', dueDateLabel: 'Data de vencimento', totalLabel: 'Total (IVA incluído)',
    subtotalLabel: 'Subtotal (sem IVA)', taxAmountLabel: 'IVA', issuedByLabel: 'Emitido por',
    paymentMethodLabel: 'Método de pagamento',
  },
  'zh-CN': {
    language: 'zh', countryCode: 'CN', currencyCode: 'CNY',
    dateFormat: 'YYYY-MM-DD', taxLabel: '增值税', taxIdLabel: '纳税人识别号',
    taxRate: 0.13, rtl: false,
    legalDisclaimer: '本发票符合中国税务法规。增值税适用，税率13%。请妥善保管本发票以备税务核查。',
    invoiceLabel: '发票', dueDateLabel: '到期日', totalLabel: '含税总额',
    subtotalLabel: '不含税金额', taxAmountLabel: '增值税', issuedByLabel: '开票方',
    paymentMethodLabel: '付款方式',
  },
};

export function getInvoiceLocaleConfig(language: Language, countryCode: string): InvoiceLocaleConfig {
  const key = `${language}-${countryCode}`;
  if (INVOICE_LOCALE_MAP[key]) return INVOICE_LOCALE_MAP[key];

  // Fallback: find by language
  const langFallback = Object.values(INVOICE_LOCALE_MAP).find(c => c.language === language);
  if (langFallback) return langFallback;

  // Ultimate fallback: French
  return INVOICE_LOCALE_MAP['fr-FR'];
}

export function formatInvoiceDate(date: Date | string, format: InvoiceLocaleConfig['dateFormat']): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  switch (format) {
    case 'DD/MM/YYYY': return `${day}/${month}/${year}`;
    case 'MM/DD/YYYY': return `${month}/${day}/${year}`;
    case 'YYYY-MM-DD': return `${year}-${month}-${day}`;
    case 'DD-MM-YYYY': return `${day}-${month}-${year}`;
    default: return `${day}/${month}/${year}`;
  }
}

export function formatInvoiceCurrency(amount: number, currencyCode: string, language: Language): string {
  const localeMap: Record<Language, string> = {
    fr: 'fr-FR', en: 'en-US', es: 'es-ES', pt: 'pt-BR', ar: 'ar-SA', zh: 'zh-CN',
  };
  try {
    return new Intl.NumberFormat(localeMap[language] || 'fr-FR', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: ['KMF', 'XOF', 'XAF', 'JPY'].includes(currencyCode) ? 0 : 2,
      maximumFractionDigits: ['KMF', 'XOF', 'XAF', 'JPY'].includes(currencyCode) ? 0 : 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currencyCode}`;
  }
}

export function getAvailableLocales(): Array<{ key: string; label: string; flag: string }> {
  return [
    { key: 'fr-FR', label: 'Français (France)', flag: '🇫🇷' },
    { key: 'fr-MA', label: 'Français (Maroc)', flag: '🇲🇦' },
    { key: 'fr-SN', label: 'Français (Sénégal)', flag: '🇸🇳' },
    { key: 'fr-KM', label: 'Français (Comores)', flag: '🇰🇲' },
    { key: 'en-GB', label: 'English (UK)', flag: '🇬🇧' },
    { key: 'en-AE', label: 'English (UAE)', flag: '🇦🇪' },
    { key: 'ar-AE', label: 'العربية (الإمارات)', flag: '🇦🇪' },
    { key: 'ar-MA', label: 'العربية (المغرب)', flag: '🇲🇦' },
    { key: 'es-ES', label: 'Español (España)', flag: '🇪🇸' },
    { key: 'pt-BR', label: 'Português (Brasil)', flag: '🇧🇷' },
    { key: 'pt-PT', label: 'Português (Portugal)', flag: '🇵🇹' },
    { key: 'zh-CN', label: '中文 (中国)', flag: '🇨🇳' },
  ];
}
