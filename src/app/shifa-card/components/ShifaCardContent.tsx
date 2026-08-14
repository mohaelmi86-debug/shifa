'use client';
import React, { useState, useEffect, useCallback } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import ShifaBrand from '@/components/ui/ShifaBrand';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

type CardTab = 'digital' | 'physical';

interface PatientData {
  id: string;
  first_name: string;
  last_name: string;
  shifa_id: string;
  country_code: string;
  blood_type: string | null;
  date_of_birth: string | null;
}

interface ShifaCardData {
  id: string;
  shifa_id: string;
  card_number: string | null;
  card_type: string;
  status: string;
  qr_code_data: string | null;
  issued_at: string | null;
  expires_at: string | null;
  delivery_status: string;
  metadata: Record<string, any>;
}

interface DeliveryOrder {
  id: string;
  card_type: string;
  status: string;
  tracking_number: string | null;
  estimated_delivery: string | null;
  delivered_at: string | null;
  delivery_address: Record<string, any>;
  created_at: string;
}

export default function ShifaCardContent() {
  const { user } = useAuth();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<CardTab>('digital');
  const [cardFlipped, setCardFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const [patient, setPatient] = useState<PatientData | null>(null);
  const [cardData, setCardData] = useState<ShifaCardData | null>(null);
  const [deliveryOrders, setDeliveryOrders] = useState<DeliveryOrder[]>([]);

  // Order form state
  const [orderForm, setOrderForm] = useState({
    cardType: 'standard',
    reason: 'first_issue',
    street: '',
    city: '',
    country: 'Sénégal',
  });

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const { data: patientData, error: pErr } = await supabase
        .from('patients')
        .select('id, first_name, last_name, shifa_id, country_code, blood_type, date_of_birth')
        .eq('user_id', user.id)
        .maybeSingle();

      if (pErr) throw pErr;
      if (!patientData) {
        setError('Profil patient introuvable.');
        setLoading(false);
        return;
      }
      setPatient(patientData);

      // Fetch shifa_card
      const { data: card, error: cErr } = await supabase
        .from('shifa_cards')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!cErr && card) setCardData(card);

      // Fetch delivery orders
      const { data: orders, error: oErr } = await supabase
        .from('card_delivery_orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!oErr && orders) setDeliveryOrders(orders);
    } catch (err: any) {
      setError(err.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOrderSubmit = async () => {
    if (!user) return;
    setOrderLoading(true);
    try {
      const { error: insertErr } = await supabase
        .from('card_delivery_orders')
        .insert({
          user_id: user.id,
          card_type: orderForm.cardType,
          delivery_address: {
            street: orderForm.street,
            city: orderForm.city,
            country: orderForm.country,
            reason: orderForm.reason,
          },
          delivery_fee: orderForm.cardType === 'premium' ? 7500 : 5000,
          currency: 'XOF',
          status: 'pending',
          estimated_delivery: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        });

      if (insertErr) throw insertErr;
      setOrderSuccess(true);
      await fetchData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setOrderLoading(false);
    }
  };

  const firstName = patient?.first_name || '—';
  const lastName = patient?.last_name?.toUpperCase() || '—';
  const shifaId = cardData?.shifa_id || patient?.shifa_id || '—';
  const bloodType = patient?.blood_type || '—';
  const countryCode = patient?.country_code || 'SN';
  const avatarLetters = patient ? `${patient.first_name[0] || ''}${patient.last_name[0] || ''}` : '??';
  const expiresAt = cardData?.expires_at
    ? new Date(cardData.expires_at).toLocaleDateString('fr-FR', { month: '2-digit', year: 'numeric' })
    : '—';
  const issuedYear = cardData?.issued_at
    ? new Date(cardData.issued_at).getFullYear().toString()
    : new Date().getFullYear().toString();

  const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: '#fef9c3', text: '#ca8a04', label: 'En attente' },
    processing: { bg: '#dbeafe', text: '#1d4ed8', label: 'En traitement' },
    shipped: { bg: '#fef3c7', text: '#d97706', label: 'Expédié' },
    delivered: { bg: '#dcfce7', text: '#16a34a', label: 'Livré' },
    cancelled: { bg: '#fee2e2', text: '#dc2626', label: 'Annulé' },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--shifa-blue)', borderTopColor: 'transparent' }} />
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Chargement de votre carte SHIFA...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Carte SHIFA</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Votre identité de santé numérique sécurisée</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl text-sm" style={{ backgroundColor: 'rgba(239,68,68,0.08)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.2)' }}>
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl mb-6 w-fit" style={{ backgroundColor: 'var(--muted)' }}>
        {[
          { key: 'digital', label: 'Carte numérique', icon: 'DevicePhoneMobileIcon' },
          { key: 'physical', label: 'Carte physique', icon: 'CreditCardIcon' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as CardTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.key ? 'shadow-sm' : ''}`}
            style={{
              backgroundColor: activeTab === tab.key ? 'var(--card)' : 'transparent',
              color: activeTab === tab.key ? 'var(--shifa-blue)' : 'var(--muted-foreground)',
            }}
          >
            <Icon name={tab.icon as any} size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'digital' && (
        <div className="flex flex-col gap-6">
          {/* Card Front */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--muted-foreground)' }}>Recto</p>
            <div
              className="relative rounded-3xl overflow-hidden p-6 sm:p-8 cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #0A1B3D 0%, #0A4B9A 55%, #0066FF 100%)', minHeight: '200px', boxShadow: '0 20px 60px rgba(0,102,255,0.3)' }}
              onClick={() => setCardFlipped(!cardFlipped)}
            >
              <div className="absolute right-4 bottom-4 opacity-10 w-36 h-16">
                <AppImage src="/assets/images/file_00000000594071f4b27d19b03582b884-1786375501710.png" alt="SHIFA watermark" width={144} height={64} className="object-contain w-full h-full" />
              </div>
              {!cardFlipped ? (
                <>
                  <div className="flex items-start justify-between mb-6">
                    <ShifaBrand variant="card" theme="dark" symbolSize={32} />
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(0,242,195,0.15)', border: '1px solid rgba(0,242,195,0.3)' }}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--shifa-cyan)' }} />
                      <span className="text-xs font-semibold" style={{ color: 'var(--shifa-cyan)' }}>{cardData?.status === 'active' ? 'Actif' : cardData?.status || 'Actif'}</span>
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold text-white border-2" style={{ background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.3)' }}>
                        {avatarLetters}
                      </div>
                      <div>
                        <p className="text-white font-extrabold text-lg leading-tight">{lastName}</p>
                        <p className="text-white/80 font-medium">{firstName}</p>
                        <p className="text-xs mt-1 font-mono" style={{ color: 'rgba(0,242,195,0.9)' }}>{shifaId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Pays</p>
                      <p className="text-sm font-semibold text-white">{countryCode}</p>
                      <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Depuis {issuedYear}</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>Code de vérification sécurisé</p>
                      <div className="w-28 h-28 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}>
                        <div className="grid grid-cols-6 gap-0.5 p-2">
                          {Array.from({ length: 36 }).map((_, i) => {
                            const seed = (shifaId.charCodeAt(i % shifaId.length) + i * 5) % 3;
                            return <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: seed === 0 ? '#0A1B3D' : 'transparent' }} />;
                          })}
                        </div>
                      </div>
                      <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.5)' }}>Scanner pour vérifier</p>
                    </div>
                    <div className="text-right flex flex-col gap-2">
                      <ShifaBrand variant="card" theme="dark" symbolSize={28} />
                      <div className="mt-4">
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>SHIFA ID</p>
                        <p className="text-sm font-mono font-bold text-white">{shifaId}</p>
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Groupe sanguin</p>
                        <p className="text-sm font-bold" style={{ color: 'var(--shifa-cyan)' }}>{bloodType}</p>
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Expire</p>
                        <p className="text-sm font-bold text-white">{expiresAt}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
              <p className="text-xs opacity-40 mt-3 text-center text-white">Cliquer pour {cardFlipped ? 'recto' : 'verso'}</p>
            </div>
          </div>

          {/* Card details */}
          <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Informations de la carte</h3>
            <div className="space-y-3">
              {[
                { label: 'SHIFA ID', value: shifaId, mono: true },
                { label: 'Titulaire', value: `${firstName} ${lastName}` },
                { label: 'Type de carte', value: cardData?.card_type ? cardData.card_type.charAt(0).toUpperCase() + cardData.card_type.slice(1) : '—' },
                { label: 'Statut', value: cardData?.status === 'active' ? 'Active' : cardData?.status || '—' },
                { label: "Date d'expiration", value: expiresAt },
                { label: 'Groupe sanguin', value: bloodType },
                { label: 'Livraison physique', value: cardData?.delivery_status === 'delivered' ? 'Livrée' : cardData?.delivery_status || 'Non demandée' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-1.5 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.label}</span>
                  <span className={`text-xs font-medium ${item.mono ? 'font-mono' : ''}`} style={{ color: 'var(--foreground)' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Wallet */}
          <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <p className="text-sm font-bold mb-4" style={{ color: 'var(--foreground)' }}>Ajouter à un portefeuille numérique</p>
            <div className="flex flex-wrap gap-3">
              {['Google Wallet', 'Apple Wallet', 'Samsung Pay'].map(wallet => (
                <button key={wallet} disabled className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium opacity-50 cursor-not-allowed" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                  <Icon name="WalletIcon" size={16} />
                  {wallet}
                  <span className="text-xs px-1.5 py-0.5 rounded-full ml-1" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>Bientôt</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'physical' && (
        <div className="flex flex-col gap-6">
          {/* Existing orders */}
          {deliveryOrders.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Commandes en cours</h3>
              <div className="space-y-3">
                {deliveryOrders.map(order => {
                  const sc = statusColors[order.status] || { bg: 'var(--muted)', text: 'var(--foreground)', label: order.status };
                  return (
                    <div key={order.id} className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
                          Carte {order.card_type.charAt(0).toUpperCase() + order.card_type.slice(1)}
                        </p>
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: sc.bg, color: sc.text }}>{sc.label}</span>
                      </div>
                      <div className="text-xs space-y-1" style={{ color: 'var(--muted-foreground)' }}>
                        <p>Commandé le {new Date(order.created_at).toLocaleDateString('fr-FR')}</p>
                        {order.tracking_number && <p>Suivi : <span className="font-mono">{order.tracking_number}</span></p>}
                        {order.estimated_delivery && <p>Livraison estimée : {new Date(order.estimated_delivery).toLocaleDateString('fr-FR')}</p>}
                        {order.delivery_address?.city && <p>Adresse : {order.delivery_address.city}, {order.delivery_address.country}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* New order form */}
          {orderSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#dcfce7' }}>
                <Icon name="CheckCircleIcon" size={32} style={{ color: '#16a34a' } as any} />
              </div>
              <p className="font-bold text-lg" style={{ color: '#16a34a' }}>Commande enregistrée !</p>
              <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Votre carte physique sera livrée sous 7 à 14 jours.</p>
              <button onClick={() => setOrderSuccess(false)} className="mt-4 text-sm px-4 py-2 rounded-lg text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                Nouvelle commande
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="font-bold text-base mb-4" style={{ color: 'var(--foreground)' }}>Commander une carte physique</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: 'var(--muted-foreground)' }}>Type de carte</label>
                  <select className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                    value={orderForm.cardType} onChange={e => setOrderForm(f => ({ ...f, cardType: e.target.value }))}>
                    <option value="standard">Standard — 5 000 FCFA</option>
                    <option value="premium">Premium — 7 500 FCFA</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: 'var(--muted-foreground)' }}>Motif</label>
                  <select className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                    value={orderForm.reason} onChange={e => setOrderForm(f => ({ ...f, reason: e.target.value }))}>
                    <option value="first_issue">Première émission</option>
                    <option value="replacement_loss">Remplacement (perte)</option>
                    <option value="replacement_theft">Remplacement (vol)</option>
                    <option value="renewal">Renouvellement</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: 'var(--muted-foreground)' }}>Rue / Adresse</label>
                  <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                    placeholder="12 Rue Carnot" value={orderForm.street} onChange={e => setOrderForm(f => ({ ...f, street: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: 'var(--muted-foreground)' }}>Ville</label>
                  <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                    placeholder="Dakar" value={orderForm.city} onChange={e => setOrderForm(f => ({ ...f, city: e.target.value }))} />
                </div>
              </div>
              <button
                onClick={handleOrderSubmit}
                disabled={orderLoading || !orderForm.street || !orderForm.city}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ backgroundColor: 'var(--shifa-blue)' }}
              >
                {orderLoading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Commande en cours...</>
                ) : (
                  <><Icon name="CreditCardIcon" size={16} /> Commander ma carte physique</>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
