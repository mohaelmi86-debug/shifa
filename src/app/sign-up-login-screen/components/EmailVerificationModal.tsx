'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/contexts/AuthContext';

interface EmailVerificationModalProps {
  email: string;
  onVerified: () => void;
  onCancel?: () => void;
}

export default function EmailVerificationModal({ email, onVerified, onCancel }: EmailVerificationModalProps) {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { verifyEmailOtp, resendVerificationOtp } = useAuth();

  // Start cooldown timer on mount (OTP just sent)
  useEffect(() => {
    setResendCooldown(60);
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Accept only digits
    const digit = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setError('');

    // Auto-advance to next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are filled
    if (digit && index === 5) {
      const fullOtp = [...newOtp].join('');
      if (fullOtp.length === 6) {
        handleVerify(fullOtp);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const newOtp = [...otp];
    pasted.split('').forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    const lastFilledIndex = Math.min(pasted.length - 1, 5);
    inputRefs.current[lastFilledIndex]?.focus();
    if (pasted.length === 6) {
      handleVerify(pasted);
    }
  };

  const handleVerify = useCallback(async (code?: string) => {
    const token = code || otp.join('');
    if (token.length < 6) {
      setError('Veuillez saisir le code à 6 chiffres complet.');
      return;
    }
    setIsVerifying(true);
    setError('');
    try {
      await verifyEmailOtp(email, token);
      onVerified();
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('expired') || msg.includes('Token has expired')) {
        setError('Le code a expiré. Veuillez en demander un nouveau.');
      } else if (msg.includes('invalid') || msg.includes('Invalid')) {
        setError('Code incorrect. Vérifiez et réessayez.');
      } else {
        setError('Erreur de vérification. Veuillez réessayer.');
      }
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  }, [otp, email, verifyEmailOtp, onVerified]);

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setIsResending(true);
    setError('');
    try {
      await resendVerificationOtp(email);
      setResendCooldown(60);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setError('Impossible de renvoyer le code. Veuillez réessayer.');
    } finally {
      setIsResending(false);
    }
  };

  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + '*'.repeat(Math.min(b.length, 4)) + c);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
      <div
        className="w-full max-w-md rounded-2xl p-8 shadow-2xl animate-fade-in"
        style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-teal))' }}
            >
              <Icon name="EnvelopeIcon" size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: 'var(--shifa-dark)' }}>Vérification de l'email</h2>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Confirmez votre adresse e-mail</p>
            </div>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="p-2 rounded-lg transition-colors hover:bg-muted"
              aria-label="Fermer"
            >
              <Icon name="XMarkIcon" size={18} className="text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Description */}
        <div
          className="rounded-xl p-4 mb-6"
          style={{ backgroundColor: 'rgba(0, 184, 154, 0.06)', border: '1px solid rgba(0, 184, 154, 0.2)' }}
        >
          <p className="text-sm" style={{ color: 'var(--foreground)' }}>
            Un code de vérification à 6 chiffres a été envoyé à{' '}
            <span className="font-semibold" style={{ color: 'var(--shifa-blue)' }}>{maskedEmail}</span>.
            Saisissez-le ci-dessous pour activer votre compte.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="flex items-start gap-3 p-3 rounded-xl mb-5 border"
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.06)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
          >
            <Icon name="ExclamationCircleIcon" size={16} style={{ color: 'var(--shifa-red)', flexShrink: 0 } as any} className="" />
            <p className="text-xs font-medium" style={{ color: 'var(--shifa-red)' }}>{error}</p>
          </div>
        )}

        {/* OTP Inputs */}
        <div className="flex gap-3 justify-center mb-6" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={`otp-${index}`}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={isVerifying}
              className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all outline-none disabled:opacity-50"
              style={{
                backgroundColor: 'var(--background)',
                borderColor: digit ? 'var(--shifa-blue)' : 'var(--border)',
                color: 'var(--foreground)',
                boxShadow: digit ? '0 0 0 3px rgba(0, 122, 255, 0.1)' : 'none',
              }}
              aria-label={`Chiffre ${index + 1} du code`}
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          onClick={() => handleVerify()}
          disabled={isVerifying || otp.join('').length < 6}
          className="btn-primary w-full py-3 text-sm font-semibold mb-4 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ minHeight: '44px' }}
        >
          {isVerifying ? (
            <Icon name="ArrowPathIcon" size={18} className="animate-spin" />
          ) : (
            <>
              <Icon name="CheckCircleIcon" size={16} />
              Vérifier mon email
            </>
          )}
        </button>

        {/* Resend */}
        <div className="text-center">
          <p className="text-sm mb-2" style={{ color: 'var(--muted-foreground)' }}>
            Vous n'avez pas reçu le code ?
          </p>
          <button
            onClick={handleResend}
            disabled={resendCooldown > 0 || isResending}
            className="text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ color: resendCooldown > 0 ? 'var(--muted-foreground)' : 'var(--shifa-blue)' }}
          >
            {isResending ? (
              <span className="flex items-center gap-1.5 justify-center">
                <Icon name="ArrowPathIcon" size={14} className="animate-spin" />
                Envoi en cours...
              </span>
            ) : resendCooldown > 0 ? (
              `Renvoyer dans ${resendCooldown}s`
            ) : (
              'Renvoyer le code'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
