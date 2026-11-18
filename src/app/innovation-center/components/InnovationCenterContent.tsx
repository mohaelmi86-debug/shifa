'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';

type Tab = 'overview' | 'projects' | 'partners' | 'ai_research' | 'marketplace' | 'calls';

interface InnovationProject {
  id: string;
  title: string;
  category: 'medical' | 'digital' | 'ai' | 'research' | 'device' | 'pilot';
  status: 'ideation' | 'prototype' | 'pilot' | 'scaling' | 'deployed';
  lead: string;
  partners: string[];
  startDate: string;
  description: string;
  tags: string[];
  progress: number;
}

interface Partner {
  id: string;
  name: string;
  type: 'university' | 'startup' | 'enterprise' | 'ngo' | 'government' | 'hospital';
  country: string;
  flag: string;
  focus: string[];
  status: 'active' | 'pending' | 'exploring';
}

const innovationProjects: InnovationProject[] = [
  { id: 'INN-001', title: 'SHIFA AI Diagnostic Assistant', category: 'ai', status: 'pilot', lead: 'Dr. Aminata Diallo', partners: ['UCAD', 'MIT Media Lab'], startDate: '2026-01', description: 'Assistant IA pour aide au diagnostic différentiel basé sur données cliniques, imagerie et historique patient.', tags: ['IA', 'Diagnostic', 'NLP', 'Vision'], progress: 65 },
  { id: 'INN-002', title: 'Téléconsultation Low-Bandwidth', category: 'digital', status: 'deployed', lead: 'Équipe SHIFA Tech', partners: ['Orange Sénégal', 'GSMA'], startDate: '2025-06', description: 'Protocole de téléconsultation optimisé pour connexions 2G/3G avec compression vidéo adaptative.', tags: ['Téléconsultation', 'Low-bandwidth', 'Offline'], progress: 100 },
  { id: 'INN-003', title: 'Wearable Santé Maternelle', category: 'device', status: 'prototype', lead: 'Dr. Fatou Seck', partners: ['ISED', 'Philips Innovation'], startDate: '2026-03', description: 'Bracelet connecté pour suivi grossesse en zone rurale : fréquence cardiaque fœtale, mouvements, alertes.', tags: ['Wearable', 'Maternité', 'IoT', 'Rural'], progress: 35 },
  { id: 'INN-004', title: 'Blockchain Traçabilité Médicaments', category: 'digital', status: 'pilot', lead: 'Équipe Pharmacie SHIFA', partners: ['UEMOA', 'Novartis'], startDate: '2026-02', description: 'Système blockchain pour traçabilité de la chaîne d\'approvisionnement pharmaceutique en Afrique de l\'Ouest.', tags: ['Blockchain', 'Pharmacie', 'Supply Chain'], progress: 55 },
  { id: 'INN-005', title: 'Prédiction Épidémies IA', category: 'ai', status: 'ideation', lead: 'Dr. Cheikh Mbaye', partners: ['OMS', 'Institut Pasteur', 'UCAD'], startDate: '2026-08', description: 'Modèle prédictif d\'épidémies basé sur données SHIFA, météo, mobilité et données environnementales.', tags: ['IA', 'Épidémiologie', 'Prédiction', 'Santé publique'], progress: 10 },
  { id: 'INN-006', title: 'Diagnostic Point-of-Care Paludisme', category: 'device', status: 'prototype', lead: 'Dr. Ibrahima Ba', partners: ['PATH', 'Fondation Gates'], startDate: '2026-04', description: 'Dispositif portable de diagnostic rapide paludisme avec lecture IA et intégration SHIFA automatique.', tags: ['Diagnostic', 'Paludisme', 'PoC', 'Afrique'], progress: 40 },
];

const partners: Partner[] = [
  { id: 'PAR-001', name: 'Université Cheikh Anta Diop', type: 'university', country: 'Sénégal', flag: '🇸🇳', focus: ['Recherche médicale', 'Formation', 'IA santé'], status: 'active' },
  { id: 'PAR-002', name: 'MIT Media Lab', type: 'university', country: 'États-Unis', flag: '🇺🇸', focus: ['IA', 'Technologies émergentes', 'Design santé'], status: 'active' },
  { id: 'PAR-003', name: 'Institut Pasteur', type: 'hospital', country: 'France/Sénégal', flag: '🇫🇷', focus: ['Virologie', 'Maladies infectieuses', 'Recherche'], status: 'active' },
  { id: 'PAR-004', name: 'Fondation Bill & Melinda Gates', type: 'ngo', country: 'Global', flag: '🌍', focus: ['Santé mondiale', 'Innovation', 'Accès aux soins'], status: 'active' },
  { id: 'PAR-005', name: 'Orange Sénégal', type: 'enterprise', country: 'Sénégal', flag: '🇸🇳', focus: ['Connectivité', 'Mobile Health', 'Infrastructure'], status: 'active' },
  { id: 'PAR-006', name: 'Ministère de la Santé', type: 'government', country: 'Sénégal', flag: '🇸🇳', focus: ['Politique de santé', 'Déploiement national', 'Réglementation'], status: 'active' },
  { id: 'PAR-007', name: 'Philips Innovation', type: 'enterprise', country: 'Pays-Bas', flag: '🇳🇱', focus: ['Dispositifs médicaux', 'Imagerie', 'IA clinique'], status: 'exploring' },
  { id: 'PAR-008', name: 'HealthTech Africa Hub', type: 'startup', country: 'Kenya', flag: '🇰🇪', focus: ['Startups santé', 'Accélération', 'Marché africain'], status: 'active' },
];

const openCalls = [
  { id: 'CALL-001', title: 'Appel à projets — IA & Diagnostic', deadline: '2026-10-01', budget: '50 000 EUR', slots: 3, category: 'ai', description: 'Projets d\'intelligence artificielle appliquée au diagnostic médical en contexte de ressources limitées.' },
  { id: 'CALL-002', title: 'Programme Startups Santé Afrique', deadline: '2026-09-15', budget: '25 000 EUR', slots: 5, category: 'startup', description: 'Accompagnement de startups healthtech africaines pour intégration dans l\'écosystème SHIFA.' },
  { id: 'CALL-003', title: 'Recherche — Maladies Tropicales Négligées', deadline: '2026-11-30', budget: '100 000 EUR', slots: 2, category: 'research', description: 'Projets de recherche sur les maladies tropicales négligées avec accès aux données anonymisées SHIFA.' },
];

const statusConfig: Record<InnovationProject['status'], { label: string; color: string; bg: string }> = {
  ideation: { label: 'Idéation', color: '#64748b', bg: '#f1f5f9' },
  prototype: { label: 'Prototype', color: '#d97706', bg: '#fef3c7' },
  pilot: { label: 'Pilote', color: '#2563eb', bg: '#dbeafe' },
  scaling: { label: 'Déploiement', color: '#7c3aed', bg: '#ede9fe' },
  deployed: { label: 'Déployé', color: '#16a34a', bg: '#dcfce7' },
};

const categoryConfig: Record<InnovationProject['category'], { label: string; color: string; icon: string }> = {
  medical: { label: 'Innovation médicale', color: '#dc2626', icon: 'HeartIcon' },
  digital: { label: 'Innovation numérique', color: '#2563eb', icon: 'ComputerDesktopIcon' },
  ai: { label: 'Intelligence artificielle', color: '#7c3aed', icon: 'CpuChipIcon' },
  research: { label: 'Recherche appliquée', color: '#0891b2', icon: 'MagnifyingGlassIcon' },
  device: { label: 'Dispositif médical', color: '#d97706', icon: 'CpuChipIcon' },
  pilot: { label: 'Projet pilote', color: '#16a34a', icon: 'BeakerIcon' },
};

const partnerTypeConfig: Record<Partner['type'], { label: string; color: string }> = {
  university: { label: 'Université', color: '#2563eb' },
  startup: { label: 'Startup', color: '#7c3aed' },
  enterprise: { label: 'Entreprise', color: '#0891b2' },
  ngo: { label: 'ONG', color: '#16a34a' },
  government: { label: 'Gouvernement', color: '#d97706' },
  hospital: { label: 'Hôpital/Institut', color: '#dc2626' },
};

const ecosystemLinks = [
  { from: 'SHIFA AI', to: 'Research', icon: 'CpuChipIcon', color: '#7c3aed' },
  { from: 'Research', to: 'Academy', icon: 'AcademicCapIcon', color: '#2563eb' },
  { from: 'Academy', to: 'Workforce', icon: 'UsersIcon', color: '#16a34a' },
  { from: 'Innovation', to: 'Marketplace', icon: 'ShoppingBagIcon', color: '#d97706' },
  { from: 'Marketplace', to: 'API/Integrations', icon: 'PuzzlePieceIcon', color: '#0891b2' },
  { from: 'API/Integrations', to: 'Healthcare Orgs', icon: 'BuildingOffice2Icon', color: '#dc2626' },
];

export default function InnovationCenterContent() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'overview', label: 'Vue d\'ensemble', icon: 'LightBulbIcon' },
    { key: 'projects', label: 'Projets', icon: 'RocketLaunchIcon' },
    { key: 'partners', label: 'Partenaires', icon: 'BuildingOffice2Icon' },
    { key: 'ai_research', label: 'IA & Recherche', icon: 'CpuChipIcon' },
    { key: 'marketplace', label: 'Marketplace', icon: 'ShoppingBagIcon' },
    { key: 'calls', label: 'Appels à projets', icon: 'MegaphoneIcon' },
  ];

  const kpis = [
    { label: 'Projets actifs', value: String(innovationProjects.filter(p => p.status !== 'deployed').length), icon: 'RocketLaunchIcon', color: 'var(--shifa-purple)', bg: 'rgba(123,94,167,0.08)' },
    { label: 'Projets déployés', value: String(innovationProjects.filter(p => p.status === 'deployed').length), icon: 'CheckCircleIcon', color: 'var(--shifa-green)', bg: 'rgba(16,185,129,0.08)' },
    { label: 'Partenaires actifs', value: String(partners.filter(p => p.status === 'active').length), icon: 'BuildingOfficeIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)' },
    { label: 'Appels ouverts', value: String(openCalls.length), icon: 'MegaphoneIcon', color: 'var(--shifa-amber)', bg: 'rgba(245,158,11,0.08)' },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(123,94,167,0.15), rgba(0,102,255,0.15))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="LightBulbIcon" size={24} color="var(--shifa-purple)" />
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>SHIFA Innovation Center</h1>
            <p style={{ fontSize: '13px', color: 'var(--muted-foreground)', margin: 0 }}>Innovation médicale · IA · Recherche appliquée · Partenariats · Startups · Dispositifs médicaux</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
            <Link href="/shifa-ai-research" style={{ padding: '8px 14px', borderRadius: '8px', background: 'rgba(123,94,167,0.08)', color: 'var(--shifa-purple)', fontSize: '13px', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Icon name="CpuChipIcon" size={14} color="var(--shifa-purple)" /> SHIFA AI Research
            </Link>
            <Link href="/research-workspace" style={{ padding: '8px 14px', borderRadius: '8px', background: 'rgba(0,102,255,0.08)', color: 'var(--shifa-blue)', fontSize: '13px', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Icon name="MagnifyingGlassIcon" size={14} color="var(--shifa-blue)" /> Research
            </Link>
            <button style={{ padding: '8px 16px', borderRadius: '8px', background: 'var(--shifa-purple)', color: '#fff', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Icon name="PlusIcon" size={14} color="#fff" /> Soumettre un projet
            </button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {kpis.map((kpi, i) => (
          <div key={i} style={{ background: 'var(--card)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name={kpi.icon} size={20} color={kpi.color} />
            </div>
            <div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--foreground)' }}>{kpi.value}</div>
              <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{kpi.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'var(--card)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border)', overflowX: 'auto' }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ padding: '8px 14px', borderRadius: '7px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', background: activeTab === tab.key ? 'var(--shifa-purple)' : 'transparent', color: activeTab === tab.key ? '#fff' : 'var(--muted-foreground)', transition: 'all 0.15s' }}>
            <Icon name={tab.icon} size={14} color={activeTab === tab.key ? '#fff' : 'var(--muted-foreground)'} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div>
          {/* Ecosystem map */}
          <div style={{ background: 'var(--card)', borderRadius: '12px', padding: '24px', border: '1px solid var(--border)', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '20px' }}>Écosystème Innovation SHIFA</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
              {[
                { name: 'SHIFA AI', icon: 'CpuChipIcon', color: '#7c3aed', bg: 'rgba(123,94,167,0.08)', href: '/shifa-ai-workspace', desc: 'Intelligence artificielle clinique' },
                { name: 'SHIFA Academy', icon: 'AcademicCapIcon', color: '#2563eb', bg: 'rgba(0,102,255,0.08)', href: '/academy-dashboard', desc: 'Formation & certifications' },
                { name: 'Research', icon: 'MagnifyingGlassIcon', color: '#0891b2', bg: 'rgba(8,145,178,0.08)', href: '/research-workspace', desc: 'Projets de recherche' },
                { name: 'Universités', icon: 'BuildingLibraryIcon', color: '#d97706', bg: 'rgba(245,158,11,0.08)', href: '/espace-universite', desc: 'Partenariats académiques' },
                { name: 'Marketplace', icon: 'ShoppingBagIcon', color: '#16a34a', bg: 'rgba(16,185,129,0.08)', href: '/health-marketplace', desc: 'Fournisseurs & équipements' },
                { name: 'API & Intégrations', icon: 'PuzzlePieceIcon', color: '#dc2626', bg: 'rgba(239,68,68,0.08)', href: '/interoperability-hub', desc: 'Connecteurs externes' },
              ].map(item => (
                <Link key={item.name} href={item.href} style={{ padding: '16px', borderRadius: '10px', background: item.bg, border: `1px solid ${item.color}22`, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.15s' }}>
                  <Icon name={item.icon} size={20} color={item.color} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--foreground)' }}>{item.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>{item.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
            <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(123,94,167,0.04)', border: '1px solid rgba(123,94,167,0.15)' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--shifa-purple)', marginBottom: '8px' }}>Flux d'interconnexion</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {ecosystemLinks.map((link, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '20px', background: 'var(--card)', border: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: link.color }}>{link.from}</span>
                    <Icon name="ArrowRightIcon" size={12} color="var(--muted-foreground)" />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)' }}>{link.to}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Domain cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[
              { icon: 'HeartIcon', title: 'Innovation médicale', color: '#dc2626', items: ['Protocoles cliniques innovants', 'Nouvelles thérapeutiques', 'Chirurgie mini-invasive', 'Médecine personnalisée'] },
              { icon: 'CpuChipIcon', title: 'Intelligence artificielle', color: '#7c3aed', items: ['Aide au diagnostic', 'Prédiction épidémies', 'NLP médical', 'Vision par ordinateur'] },
              { icon: 'ComputerDesktopIcon', title: 'Innovation numérique', color: '#2563eb', items: ['Télémédecine avancée', 'Dossier patient intelligent', 'Interopérabilité', 'Low-bandwidth solutions'] },
              { icon: 'CpuChipIcon', title: 'Dispositifs médicaux', color: '#d97706', items: ['Wearables santé', 'Diagnostic point-of-care', 'Monitoring à distance', 'Robotique chirurgicale'] },
              { icon: 'BeakerIcon', title: 'Recherche appliquée', color: '#0891b2', items: ['Essais cliniques', 'Études épidémiologiques', 'Cohortes longitudinales', 'Publications scientifiques'] },
              { icon: 'RocketLaunchIcon', title: 'Projets pilotes', color: '#16a34a', items: ['Expérimentations terrain', 'Validation en conditions réelles', 'Déploiement progressif', 'Mesure d\'impact'] },
            ].map((domain, i) => (
              <div key={i} style={{ background: 'var(--card)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Icon name={domain.icon} size={18} color={domain.color} />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--foreground)' }}>{domain.title}</span>
                </div>
                <ul style={{ margin: 0, paddingLeft: '16px' }}>
                  {domain.items.map((item, j) => (
                    <li key={j} style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginBottom: '4px' }}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {activeTab === 'projects' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {innovationProjects.map(project => {
            const sc = statusConfig[project.status];
            const cc = categoryConfig[project.category];
            return (
              <div key={project.id} style={{ background: 'var(--card)', borderRadius: '12px', padding: '20px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icon name={cc.icon} size={18} color={cc.color} />
                    <span style={{ fontSize: '11px', fontWeight: 600, color: cc.color }}>{cc.label}</span>
                  </div>
                  <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: sc.bg, color: sc.color }}>{sc.label}</span>
                </div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '8px' }}>{project.title}</h3>
                <p style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginBottom: '12px', lineHeight: '1.5' }}>{project.description}</p>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>Progression</span>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--foreground)' }}>{project.progress}%</span>
                  </div>
                  <div style={{ height: '6px', borderRadius: '3px', background: 'var(--border)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${project.progress}%`, background: project.progress === 100 ? 'var(--shifa-green)' : 'var(--shifa-blue)', borderRadius: '3px' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '10px' }}>
                  {project.tags.map(tag => (
                    <span key={tag} style={{ padding: '2px 7px', borderRadius: '20px', fontSize: '10px', background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}>{tag}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>Lead : <strong style={{ color: 'var(--foreground)' }}>{project.lead}</strong></div>
                  <div style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>Depuis {project.startDate}</div>
                </div>
                {project.partners.length > 0 && (
                  <div style={{ marginTop: '8px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {project.partners.map(p => (
                      <span key={p} style={{ padding: '2px 7px', borderRadius: '20px', fontSize: '10px', background: 'rgba(0,102,255,0.06)', color: 'var(--shifa-blue)', border: '1px solid rgba(0,102,255,0.15)' }}>{p}</span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Partners */}
      {activeTab === 'partners' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {partners.map(partner => {
            const tc = partnerTypeConfig[partner.type];
            return (
              <div key={partner.id} style={{ background: 'var(--card)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '28px' }}>{partner.flag}</span>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)' }}>{partner.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{partner.country}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: 600, color: tc.color, background: `${tc.color}18` }}>{tc.label}</span>
                    <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: 600, background: partner.status === 'active' ? '#dcfce7' : partner.status === 'pending' ? '#fef3c7' : '#f1f5f9', color: partner.status === 'active' ? '#16a34a' : partner.status === 'pending' ? '#d97706' : '#64748b' }}>
                      {partner.status === 'active' ? 'Actif' : partner.status === 'pending' ? 'En cours' : 'Exploration'}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {partner.focus.map(f => (
                    <span key={f} style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '11px', background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}>{f}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AI & Research */}
      {activeTab === 'ai_research' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ background: 'var(--card)', borderRadius: '12px', padding: '20px', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '16px' }}>SHIFA AI — Modules actifs</h3>
            {[
              { name: 'SHIFA AI Pro', href: '/shifa-ai-pro', desc: 'Assistant IA pour professionnels de santé', status: 'active' },
              { name: 'SHIFA AI Patient', href: '/shifa-ai-patient', desc: 'Assistant santé personnalisé patient', status: 'active' },
              { name: 'SHIFA AI Research', href: '/shifa-ai-research', desc: 'IA pour la recherche médicale', status: 'active' },
              { name: 'SHIFA AI Institution', href: '/shifa-ai-institution', desc: 'IA pour les établissements', status: 'active' },
              { name: 'SHIFA AI Org', href: '/shifa-ai-org', desc: 'IA organisationnelle', status: 'active' },
              { name: 'SHIFA AI Pharmacy', href: '/shifa-ai-pharmacy', desc: 'IA pour la pharmacie', status: 'active' },
            ].map(item => (
              <Link key={item.name} href={item.href} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '8px', background: 'var(--background)', border: '1px solid var(--border)', marginBottom: '8px', textDecoration: 'none' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>{item.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>{item.desc}</div>
                </div>
                <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: 600, background: '#dcfce7', color: '#16a34a' }}>Actif</span>
              </Link>
            ))}
          </div>
          <div style={{ background: 'var(--card)', borderRadius: '12px', padding: '20px', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '16px' }}>Modules Recherche</h3>
            {[
              { name: 'Research Workspace', href: '/research-workspace', desc: 'Espace de travail chercheurs' },
              { name: 'Research Datasets', href: '/research-datasets', desc: 'Jeux de données anonymisées' },
              { name: 'Research Ethics Board', href: '/research-ethics-board', desc: 'Comité d\'éthique' },
              { name: 'Epidemio Surveillance', href: '/epidemio-surveillance', desc: 'Surveillance épidémiologique' },
              { name: 'Espace Université', href: '/espace-universite', desc: 'Portail universitaire' },
            ].map(item => (
              <Link key={item.name} href={item.href} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '8px', background: 'var(--background)', border: '1px solid var(--border)', marginBottom: '8px', textDecoration: 'none' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>{item.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>{item.desc}</div>
                </div>
                <Icon name="ArrowRightIcon" size={14} color="var(--muted-foreground)" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Marketplace */}
      {activeTab === 'marketplace' && (
        <div>
          <div style={{ background: 'rgba(16,185,129,0.04)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(16,185,129,0.2)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Icon name="ArrowsRightLeftIcon" size={20} color="var(--shifa-green)" />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--shifa-green)' }}>Connecté à SHIFA Marketplace</div>
              <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>Les innovations validées peuvent être proposées sur la marketplace. Workflow : Besoin → Fournisseur → Devis → Commande → Paiement → Livraison → Stock → Facturation.</div>
            </div>
            <Link href="/health-marketplace" style={{ marginLeft: 'auto', padding: '6px 12px', borderRadius: '8px', background: 'rgba(16,185,129,0.1)', color: 'var(--shifa-green)', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>Marketplace →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[
              { icon: 'CpuChipIcon', title: 'Dispositifs médicaux', count: 24, color: '#7c3aed', desc: 'Équipements innovants certifiés' },
              { icon: 'ComputerDesktopIcon', title: 'Logiciels de santé', count: 18, color: '#2563eb', desc: 'Solutions numériques intégrables' },
              { icon: 'BeakerIcon', title: 'Consommables innovants', count: 42, color: '#0891b2', desc: 'Réactifs et consommables de pointe' },
              { icon: 'UsersIcon', title: 'Services de santé', count: 31, color: '#16a34a', desc: 'Prestataires et services spécialisés' },
              { icon: 'AcademicCapIcon', title: 'Formations spécialisées', count: 15, color: '#d97706', desc: 'Programmes de formation innovants' },
              { icon: 'RocketLaunchIcon', title: 'Startups partenaires', count: 8, color: '#dc2626', desc: 'Startups healthtech intégrées' },
            ].map((cat, i) => (
              <div key={i} style={{ background: 'var(--card)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: `${cat.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={cat.icon} size={22} color={cat.color} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--foreground)' }}>{cat.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>{cat.desc}</div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: cat.color, marginTop: '4px' }}>{cat.count}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Open Calls */}
      {activeTab === 'calls' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {openCalls.map(call => (
            <div key={call.id} style={{ background: 'var(--card)', borderRadius: '12px', padding: '20px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>{call.title}</h3>
                <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: '#dcfce7', color: '#16a34a' }}>Ouvert</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--muted-foreground)', marginBottom: '16px' }}>{call.description}</p>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ padding: '8px 12px', borderRadius: '8px', background: 'var(--background)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>Budget</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--shifa-green)' }}>{call.budget}</div>
                </div>
                <div style={{ padding: '8px 12px', borderRadius: '8px', background: 'var(--background)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>Places disponibles</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--shifa-blue)' }}>{call.slots} projets</div>
                </div>
                <div style={{ padding: '8px 12px', borderRadius: '8px', background: 'var(--background)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>Date limite</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--shifa-amber)' }}>{call.deadline}</div>
                </div>
                <button style={{ marginLeft: 'auto', padding: '8px 16px', borderRadius: '8px', background: 'var(--shifa-purple)', color: '#fff', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Soumettre un projet</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
