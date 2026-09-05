'use client';

import React from 'react';
import type { Language } from '@/lib/i18n';
import {
  getInvoiceLocaleConfig,
  formatInvoiceDate,
  formatInvoiceCurrency,
  type InvoiceLocaleConfig,
} from '@/lib/invoiceI18n';
import Icon from '@/components/ui/AppIcon';

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  issuedAt: Date | string;
  dueDate?: Date | string;
  billingName: string;
  billingAddress?: string;
  taxId?: string;
  subtotal: number;
  taxAmount: number;
  discountAmount?: number;
  total: number;
  currency: string;
  paymentMethod?: string;
  status: string;
  lineItems: InvoiceLineItem[];
  planName?: string;
}

interface DynamicInvoiceProps {
  invoice: InvoiceData;
  language: Language;
  countryCode: string;
  onDownload?: () => void;
  compact?: boolean;
}

export default function DynamicInvoice({
  invoice,
  language,
  countryCode,
  onDownload,
  compact = false,
}: DynamicInvoiceProps) {
  const locale: InvoiceLocaleConfig = getInvoiceLocaleConfig(language, countryCode);

  const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    paid: { bg: 'rgba(16,185,129,0.1)', text: '#10B981', label: locale.language === 'fr' ? 'Payée' : locale.language === 'ar' ? 'مدفوعة' : locale.language === 'zh' ? '已付款' : 'Paid' },
    draft: { bg: 'rgba(245,158,11,0.1)', text: '#F59E0B', label: locale.language === 'fr' ? 'Brouillon' : 'Draft' },
    sent: { bg: 'rgba(59,130,246,0.1)', text: '#3B82F6', label: locale.language === 'fr' ? 'Envoyée' : 'Sent' },
    overdue: { bg: 'rgba(239,68,68,0.1)', text: '#EF4444', label: locale.language === 'fr' ? 'En retard' : 'Overdue' },
    cancelled: { bg: 'rgba(107,114,128,0.1)', text: '#6B7280', label: locale.language === 'fr' ? 'Annulée' : 'Cancelled' },
  };

  const statusInfo = statusColors[invoice.status] || statusColors['draft'];

  return (
    <div
      dir={locale.rtl ? 'rtl' : 'ltr'}
      className={`rounded-2xl overflow-hidden ${compact ? '' : 'shadow-lg'}`}
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        fontFamily: locale.rtl
          ? "'Noto Sans Arabic', 'Cairo', Arial, sans-serif"
          : locale.language === 'zh' ? "'Noto Sans SC', 'PingFang SC', sans-serif"
          : "'Inter', Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div
        className="p-6"
        style={{ background: 'linear-gradient(135deg, var(--shifa-blue), #0044cc)' }}
      >
        <div className={`flex items-start justify-between gap-4 ${locale.rtl ? 'flex-row-reverse' : ''}`}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                <Icon name="DocumentTextIcon" className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-lg tracking-wide">{locale.invoiceLabel}</span>
            </div>
            <p className="text-blue-100 text-xs">SHIFA Health OS</p>
          </div>
          <div className={`text-${locale.rtl ? 'left' : 'right'}`}>
            <p className="text-white font-mono text-sm font-bold">{invoice.invoiceNumber}</p>
            <p className="text-blue-100 text-xs mt-1">
              {formatInvoiceDate(invoice.issuedAt, locale.dateFormat)}
            </p>
            <span
              className="inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-semibold"
              style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}
            >
              {statusInfo.label}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-5">
        {/* Billing info */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${locale.rtl ? 'text-right' : ''}`}>
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>
              {locale.issuedByLabel}
            </p>
            <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>SHIFA Health OS</p>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              {countryCode === 'KM' ? 'Moroni, Comores' :
               countryCode === 'MA' ? 'Casablanca, Maroc' :
               countryCode === 'SN' ? 'Dakar, Sénégal' :
               countryCode === 'FR' ? 'Paris, France' :
               countryCode === 'AE' ? 'Dubai, UAE' :
               countryCode === 'GB' ? 'London, UK' :
               countryCode === 'BR' ? 'São Paulo, Brasil' :
               countryCode === 'CN' ? '上海, 中国' : 'International'}
            </p>
          </div>
          <div className={locale.rtl ? 'text-right' : 'sm:text-right'}>
            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>
              {locale.language === 'fr' ? 'Facturé à' :
               locale.language === 'ar' ? 'فاتورة إلى' :
               locale.language === 'zh' ? '账单收件人' :
               locale.language === 'es' ? 'Facturado a' :
               locale.language === 'pt' ? 'Faturado a' : 'Bill To'}
            </p>
            <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{invoice.billingName || '—'}</p>
            {invoice.billingAddress && (
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{invoice.billingAddress}</p>
            )}
            {invoice.taxId && (
              <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
                <span className="font-medium">{locale.taxIdLabel}:</span> {invoice.taxId}
              </p>
            )}
          </div>
        </div>

        {/* Due date */}
        {invoice.dueDate && (
          <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <Icon name="CalendarIcon" className="w-4 h-4 flex-shrink-0" style={{ color: '#F59E0B' }} />
            <span className="text-xs" style={{ color: 'var(--foreground)' }}>
              <span className="font-semibold">{locale.dueDateLabel}:</span>{' '}
              {formatInvoiceDate(invoice.dueDate, locale.dateFormat)}
            </span>
          </div>
        )}

        {/* Line items */}
        {!compact && invoice.lineItems.length > 0 && (
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--muted-foreground)' }}>
              {locale.language === 'fr' ? 'Détail des prestations' :
               locale.language === 'ar' ? 'تفاصيل الخدمات' :
               locale.language === 'zh' ? '服务明细' :
               locale.language === 'es' ? 'Detalle de servicios' :
               locale.language === 'pt' ? 'Detalhes dos serviços' : 'Service Details'}
            </p>
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ background: 'var(--muted)' }}>
                    <th className={`p-2.5 font-semibold ${locale.rtl ? 'text-right' : 'text-left'}`} style={{ color: 'var(--muted-foreground)' }}>
                      {locale.language === 'fr' ? 'Description' : locale.language === 'ar' ? 'الوصف' : locale.language === 'zh' ? '描述' : 'Description'}
                    </th>
                    <th className="p-2.5 text-center font-semibold" style={{ color: 'var(--muted-foreground)' }}>
                      {locale.language === 'fr' ? 'Qté' : locale.language === 'ar' ? 'الكمية' : locale.language === 'zh' ? '数量' : 'Qty'}
                    </th>
                    <th className={`p-2.5 font-semibold ${locale.rtl ? 'text-left' : 'text-right'}`} style={{ color: 'var(--muted-foreground)' }}>
                      {locale.language === 'fr' ? 'Total' : locale.language === 'ar' ? 'المجموع' : locale.language === 'zh' ? '合计' : 'Total'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.lineItems.map((item, i) => (
                    <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                      <td className={`p-2.5 ${locale.rtl ? 'text-right' : ''}`} style={{ color: 'var(--foreground)' }}>{item.description}</td>
                      <td className="p-2.5 text-center" style={{ color: 'var(--muted-foreground)' }}>{item.quantity}</td>
                      <td className={`p-2.5 font-semibold ${locale.rtl ? 'text-left' : 'text-right'}`} style={{ color: 'var(--foreground)' }}>
                        {formatInvoiceCurrency(item.total, invoice.currency, language)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Totals */}
        <div className="space-y-2 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
          <div className={`flex items-center justify-between ${locale.rtl ? 'flex-row-reverse' : ''}`}>
            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{locale.subtotalLabel}</span>
            <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              {formatInvoiceCurrency(invoice.subtotal, invoice.currency, language)}
            </span>
          </div>
          {invoice.taxAmount > 0 && (
            <div className={`flex items-center justify-between ${locale.rtl ? 'flex-row-reverse' : ''}`}>
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                {locale.taxAmountLabel} ({Math.round(locale.taxRate * 100)}%)
              </span>
              <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                {formatInvoiceCurrency(invoice.taxAmount, invoice.currency, language)}
              </span>
            </div>
          )}
          {invoice.discountAmount && invoice.discountAmount > 0 && (
            <div className={`flex items-center justify-between ${locale.rtl ? 'flex-row-reverse' : ''}`}>
              <span className="text-xs" style={{ color: '#10B981' }}>
                {locale.language === 'fr' ? 'Remise' : locale.language === 'ar' ? 'خصم' : locale.language === 'zh' ? '折扣' : 'Discount'}
              </span>
              <span className="text-sm font-medium" style={{ color: '#10B981' }}>
                -{formatInvoiceCurrency(invoice.discountAmount, invoice.currency, language)}
              </span>
            </div>
          )}
          <div
            className={`flex items-center justify-between pt-2 ${locale.rtl ? 'flex-row-reverse' : ''}`}
            style={{ borderTop: '2px solid var(--border)' }}
          >
            <span className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>{locale.totalLabel}</span>
            <span className="text-lg font-bold" style={{ color: 'var(--shifa-blue)' }}>
              {formatInvoiceCurrency(invoice.total, invoice.currency, language)}
            </span>
          </div>
        </div>

        {/* Payment method */}
        {invoice.paymentMethod && (
          <div className={`flex items-center gap-2 ${locale.rtl ? 'flex-row-reverse' : ''}`}>
            <Icon name="CreditCardIcon" className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--muted-foreground)' }} />
            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              <span className="font-medium">{locale.paymentMethodLabel}:</span> {invoice.paymentMethod}
            </span>
          </div>
        )}

        {/* Legal disclaimer */}
        <div
          className="p-3 rounded-xl"
          style={{ background: 'rgba(0,102,255,0.04)', border: '1px solid rgba(0,102,255,0.1)' }}
        >
          <p className={`text-[11px] leading-relaxed ${locale.rtl ? 'text-right' : ''}`} style={{ color: 'var(--muted-foreground)' }}>
            {locale.legalDisclaimer}
          </p>
        </div>

        {/* Download button */}
        {onDownload && (
          <button
            onClick={onDownload}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90 ${locale.rtl ? 'flex-row-reverse' : ''}`}
            style={{ background: 'var(--shifa-blue)', color: 'white' }}
          >
            <Icon name="ArrowDownTrayIcon" className="w-4 h-4" />
            {locale.language === 'fr' ? 'Télécharger la facture' :
             locale.language === 'ar' ? 'تحميل الفاتورة' :
             locale.language === 'zh' ? '下载发票' :
             locale.language === 'es' ? 'Descargar factura' :
             locale.language === 'pt' ? 'Baixar fatura' : 'Download Invoice'}
          </button>
        )}
      </div>
    </div>
  );
}
