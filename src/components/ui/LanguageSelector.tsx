'use client';
import React, { useState, useRef, useEffect } from 'react';
import { SUPPORTED_LANGUAGES, Language } from '@/lib/i18n';
import { useLanguage } from '@/contexts/LanguageContext';
import Icon from '@/components/ui/AppIcon';

export default function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-muted transition-colors text-sm"
        style={{ color: 'var(--foreground)' }}
        title="Change language"
      >
        <span className="text-base leading-none">{current.flag}</span>
        {!compact && <span className="font-medium">{current.nativeLabel}</span>}
        <Icon name="ChevronDownIcon" size={12} className="text-muted-foreground" />
      </button>

      {open && (
        <div
          className="absolute bottom-full mb-1 right-0 w-48 rounded-xl shadow-lg border py-1 z-50"
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
        >
          {SUPPORTED_LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => { setLanguage(lang.code as Language); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted transition-colors text-left ${language === lang.code ? 'font-semibold' : ''}`}
              style={{ color: 'var(--foreground)' }}
            >
              <span className="text-base">{lang.flag}</span>
              <span className="flex-1">{lang.nativeLabel}</span>
              {lang.rtl && (
                <span className="text-xs px-1 rounded" style={{ backgroundColor: 'rgba(0,102,255,0.1)', color: 'var(--shifa-blue)' }}>RTL</span>
              )}
              {language === lang.code && (
                <Icon name="CheckIcon" size={14} style={{ color: 'var(--shifa-blue)' }} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
