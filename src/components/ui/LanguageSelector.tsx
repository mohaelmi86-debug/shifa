'use client';
import React, { useState, useRef, useEffect } from 'react';
import { SUPPORTED_LANGUAGES, Language } from '@/lib/i18n';
import { useLanguage } from '@/contexts/LanguageContext';
import Icon from '@/components/ui/AppIcon';

export default function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleToggle = () => {
    if (!open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      // Dropdown height ~280px; open upward only if not enough space below
      setOpenUpward(spaceBelow < 300);
    }
    setOpen(o => !o);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleToggle}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-muted transition-colors text-sm"
        style={{ color: 'var(--foreground)' }}
        title="Change language"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="text-base leading-none">{current.flag}</span>
        {!compact && <span className="font-medium">{current.nativeLabel}</span>}
        <Icon
          name="ChevronDownIcon"
          size={12}
          className="text-muted-foreground transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' } as React.CSSProperties}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 w-52 rounded-xl shadow-xl border py-1.5 z-[9999]"
          style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
            boxShadow: '0 8px 32px rgba(8,120,239,0.13), 0 2px 8px rgba(0,0,0,0.08)',
            ...(openUpward
              ? { bottom: 'calc(100% + 6px)', top: 'auto' }
              : { top: 'calc(100% + 6px)', bottom: 'auto' }),
          }}
        >
          {SUPPORTED_LANGUAGES.map(lang => (
            <button
              key={lang.code}
              role="option"
              aria-selected={language === lang.code}
              onClick={() => { setLanguage(lang.code as Language); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors text-left ${
                language === lang.code
                  ? 'font-semibold' :'hover:bg-muted'
              }`}
              style={{
                color: 'var(--foreground)',
                backgroundColor: language === lang.code ? 'rgba(8,120,239,0.07)' : undefined,
              }}
            >
              <span className="text-base w-5 text-center">{lang.flag}</span>
              <span className="flex-1">{lang.nativeLabel}</span>
              {lang.rtl && (
                <span className="text-xs px-1.5 py-0.5 rounded-md font-medium" style={{ backgroundColor: 'rgba(8,120,239,0.1)', color: 'var(--shifa-blue)' }}>RTL</span>
              )}
              {language === lang.code && (
                <Icon name="CheckIcon" size={14} style={{ color: 'var(--shifa-blue)' } as React.CSSProperties} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
