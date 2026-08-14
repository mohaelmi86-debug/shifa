'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface NavTab {
  key: string;
  label: string;
  href: string;
  badge?: number;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
}

// ── Shared icon helpers ───────────────────────────────────────────────────────
const HomeOutline = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-[22px] h-[22px]"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>;
const HomeFill = <svg viewBox="0 0 24 24" fill="currentColor" className="w-[22px] h-[22px]"><path d="M11.47 3.841a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.061l-1.106-1.105V19.5a1.5 1.5 0 01-1.5 1.5h-3.75a1.5 1.5 0 01-1.5-1.5v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V19.5a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V10.465L2.53 11.57a.75.75 0 01-1.06-1.06l9.999-9.999z" /></svg>;
const CalOutline = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-[22px] h-[22px]"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>;
const CalFill = <svg viewBox="0 0 24 24" fill="currentColor" className="w-[22px] h-[22px]"><path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" /></svg>;
const HeartOutline = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-[22px] h-[22px]"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>;
const HeartFill = <svg viewBox="0 0 24 24" fill="currentColor" className="w-[22px] h-[22px]"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" /></svg>;
const ChatOutline = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-[22px] h-[22px]"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>;
const ChatFill = <svg viewBox="0 0 24 24" fill="currentColor" className="w-[22px] h-[22px]"><path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223 15.89 15.89 0 002.996-.186z" clipRule="evenodd" /></svg>;
const UserOutline = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-[22px] h-[22px]"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>;
const UserFill = <svg viewBox="0 0 24 24" fill="currentColor" className="w-[22px] h-[22px]"><path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" /></svg>;
const GridOutline = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-[22px] h-[22px]"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>;
const GridFill = <svg viewBox="0 0 24 24" fill="currentColor" className="w-[22px] h-[22px]"><path fillRule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z" clipRule="evenodd" /></svg>;
const UsersOutline = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-[22px] h-[22px]"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>;
const UsersFill = <svg viewBox="0 0 24 24" fill="currentColor" className="w-[22px] h-[22px]"><path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" /></svg>;
const ChartOutline = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-[22px] h-[22px]"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>;
const ChartFill = <svg viewBox="0 0 24 24" fill="currentColor" className="w-[22px] h-[22px]"><path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" /></svg>;
const ShieldOutline = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-[22px] h-[22px]"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>;
const ShieldFill = <svg viewBox="0 0 24 24" fill="currentColor" className="w-[22px] h-[22px]"><path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg>;
const BeakerOutline = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-[22px] h-[22px]"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15M14.25 3.104c.251.023.501.05.75.082M19.8 15a2.25 2.25 0 01.45 1.318 2.25 2.25 0 01-2.25 2.25H5.25a2.25 2.25 0 01-2.25-2.25 2.25 2.25 0 01.45-1.318L5 14.5m14.8.5l.45.318M5 14.5l-.45.318" /></svg>;
const BeakerFill = <svg viewBox="0 0 24 24" fill="currentColor" className="w-[22px] h-[22px]"><path fillRule="evenodd" d="M10.5 3.798v5.02a3 3 0 01-.879 2.121l-2.377 2.377a9.845 9.845 0 015.091 1.013 8.315 8.315 0 005.713.636l.285-.071-3.954-3.955a3 3 0 01-.879-2.121v-5.02a23.614 23.614 0 00-3 0zm4.5.138a.75.75 0 00.093-1.495A24.837 24.837 0 0012 2.25a25.048 25.048 0 00-3.093.191A.75.75 0 009 3.936v4.882a1.5 1.5 0 01-.44 1.06l-6.293 6.294c-1.62 1.621-.903 4.475 1.471 4.88 2.686.46 5.447.698 8.262.698 2.816 0 5.576-.239 8.262-.697 2.373-.406 3.092-3.26 1.47-4.881L15.44 9.879A1.5 1.5 0 0115 8.818V3.936z" clipRule="evenodd" /></svg>;
const ArchiveOutline = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-[22px] h-[22px]"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>;
const ArchiveFill = <svg viewBox="0 0 24 24" fill="currentColor" className="w-[22px] h-[22px]"><path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375z" /><path fillRule="evenodd" d="M3.087 9l.54 9.176A3 3 0 006.62 21h10.757a3 3 0 002.995-2.824L20.913 9H3.087zm6.163 3.75A.75.75 0 0110 12h4a.75.75 0 010 1.5h-4a.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>;
const StarOutline = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-[22px] h-[22px]"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>;
const StarFill = <svg viewBox="0 0 24 24" fill="currentColor" className="w-[22px] h-[22px]"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" /></svg>;

// ── Patient tabs ──────────────────────────────────────────────────────────────
const patientTabs: NavTab[] = [
  { key: 'accueil', label: 'Accueil', href: '/patient-home', icon: HomeOutline, activeIcon: HomeFill },
  { key: 'planifier', label: 'Planifier', href: '/appointment-booking', badge: 2, icon: CalOutline, activeIcon: CalFill },
  { key: 'masante', label: 'Ma santé', href: '/dossier-de-sant', icon: HeartOutline, activeIcon: HeartFill },
  { key: 'echanges', label: 'Échanges', href: '/patient-messages', badge: 3, icon: ChatOutline, activeIcon: ChatFill },
  { key: 'profil', label: 'Profil', href: '/patient-settings', icon: UserOutline, activeIcon: UserFill },
];

// ── Professional tabs ─────────────────────────────────────────────────────────
const professionalTabs: NavTab[] = [
  { key: 'dashboard', label: 'Tableau', href: '/workspace-professionnel', icon: GridOutline, activeIcon: GridFill },
  { key: 'agenda', label: 'Agenda', href: '/pro-agenda', icon: CalOutline, activeIcon: CalFill },
  { key: 'patients', label: 'Patients', href: '/pro-patients', badge: 5, icon: UsersOutline, activeIcon: UsersFill },
  { key: 'echanges', label: 'Échanges', href: '/pro-messages', badge: 7, icon: ChatOutline, activeIcon: ChatFill },
  { key: 'profil', label: 'Profil', href: '/pro-profile', icon: UserOutline, activeIcon: UserFill },
];

// ── Ministère tabs ────────────────────────────────────────────────────────────
const ministereTabs: NavTab[] = [
  { key: 'dashboard', label: 'Tableau', href: '/espace-ministere', icon: GridOutline, activeIcon: GridFill },
  { key: 'indicateurs', label: 'Indicateurs', href: '/espace-sante-publique', icon: ChartOutline, activeIcon: ChartFill },
  { key: 'oversight', label: 'Supervision', href: '/ministere-oversight', icon: ShieldOutline, activeIcon: ShieldFill },
  { key: 'epidemio', label: 'Épidémio', href: '/epidemio-surveillance', icon: BeakerOutline, activeIcon: BeakerFill },
  { key: 'profil', label: 'Profil', href: '/admin-parametres', icon: UserOutline, activeIcon: UserFill },
];

// ── Assurance tabs ────────────────────────────────────────────────────────────
const assuranceTabs: NavTab[] = [
  { key: 'dashboard', label: 'Tableau', href: '/espace-assurance', icon: GridOutline, activeIcon: GridFill },
  { key: 'adherents', label: 'Adhérents', href: '/assurance-workspace', icon: UsersOutline, activeIcon: UsersFill },
  { key: 'remboursements', label: 'Remboursements', href: '/espace-assurance', icon: ShieldOutline, activeIcon: ShieldFill },
  { key: 'echanges', label: 'Échanges', href: '/pro-messages', icon: ChatOutline, activeIcon: ChatFill },
  { key: 'profil', label: 'Profil', href: '/admin-parametres', icon: UserOutline, activeIcon: UserFill },
];

// ── Laboratoire tabs ──────────────────────────────────────────────────────────
const laboratoireTabs: NavTab[] = [
  { key: 'dashboard', label: 'Tableau', href: '/lab-dashboard', icon: GridOutline, activeIcon: GridFill },
  { key: 'analyses', label: 'Analyses', href: '/laboratory-lms', icon: BeakerOutline, activeIcon: BeakerFill },
  { key: 'resultats', label: 'Résultats', href: '/pro-resultats', icon: ChartOutline, activeIcon: ChartFill },
  { key: 'echanges', label: 'Échanges', href: '/pro-messages', icon: ChatOutline, activeIcon: ChatFill },
  { key: 'profil', label: 'Profil', href: '/pro-profile', icon: UserOutline, activeIcon: UserFill },
];

// ── Pharmacie tabs ────────────────────────────────────────────────────────────
const pharmacieTabs: NavTab[] = [
  { key: 'dashboard', label: 'Tableau', href: '/pharmacy-dashboard', icon: GridOutline, activeIcon: GridFill },
  { key: 'dispensation', label: 'Dispensation', href: '/pharmacy-pos', icon: ArchiveOutline, activeIcon: ArchiveFill },
  { key: 'stock', label: 'Stock', href: '/inventory-procurement', icon: BeakerOutline, activeIcon: BeakerFill },
  { key: 'echanges', label: 'Échanges', href: '/pro-messages', icon: ChatOutline, activeIcon: ChatFill },
  { key: 'profil', label: 'Profil', href: '/pro-profile', icon: UserOutline, activeIcon: UserFill },
];

// ── Ambassadeur tabs ──────────────────────────────────────────────────────────
const ambassadeurTabs: NavTab[] = [
  { key: 'dashboard', label: 'Tableau', href: '/ambassador-workspace', icon: GridOutline, activeIcon: GridFill },
  { key: 'reseau', label: 'Réseau', href: '/ambassador-network', icon: UsersOutline, activeIcon: UsersFill },
  { key: 'recompenses', label: 'Récompenses', href: '/ambassador-rewards', icon: StarOutline, activeIcon: StarFill },
  { key: 'echanges', label: 'Échanges', href: '/pro-messages', icon: ChatOutline, activeIcon: ChatFill },
  { key: 'profil', label: 'Profil', href: '/patient-settings', icon: UserOutline, activeIcon: UserFill },
];

// ── Admin / Org tabs ──────────────────────────────────────────────────────────
const adminTabs: NavTab[] = [
  { key: 'dashboard', label: 'Tableau', href: '/administration-tablissement', icon: GridOutline, activeIcon: GridFill },
  { key: 'hopital', label: 'Hôpital', href: '/hopital-dashboard', icon: HomeOutline, activeIcon: HomeFill },
  { key: 'equipes', label: 'Équipes', href: '/org-staff-directory', icon: UsersOutline, activeIcon: UsersFill },
  { key: 'echanges', label: 'Échanges', href: '/pro-messages', icon: ChatOutline, activeIcon: ChatFill },
  { key: 'profil', label: 'Profil', href: '/admin-parametres', icon: UserOutline, activeIcon: UserFill },
];

function getTabsForRole(role: string | undefined): NavTab[] {
  switch (role) {
    case 'professional': return professionalTabs;
    case 'ministry': return ministereTabs;
    case 'public_health': return ministereTabs;
    case 'insurance': return assuranceTabs;
    case 'lab': return laboratoireTabs;
    case 'pharmacy': return pharmacieTabs;
    case 'ambassador': return ambassadeurTabs;
    case 'org_admin': return adminTabs;
    default: return patientTabs;
  }
}

function getActiveKey(pathname: string, tabs: NavTab[]): string {
  const exact = tabs.find(t => t.href === pathname);
  if (exact) return exact.key;
  let best = '';
  let bestLen = 0;
  for (const tab of tabs) {
    if (tab.href !== '/' && pathname.startsWith(tab.href) && tab.href.length > bestLen) {
      best = tab.key;
      bestLen = tab.href.length;
    }
  }
  return best;
}

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { user, role } = useAuth();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const tabs = getTabsForRole(role || (user as any)?.user_metadata?.role);
  const activeKey = getActiveKey(pathname, tabs);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
      style={{
        backgroundColor: 'var(--shifa-surface-2)',
        borderTop: '1px solid var(--border)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        boxShadow: '0 -2px 16px rgba(21,88,214,0.08)',
      }}
      aria-label="Navigation principale"
    >
      <div className="flex items-stretch justify-around" style={{ height: '64px' }}>
        {tabs.map((tab) => {
          const isActive = activeKey === tab.key;
          return (
            <Link
              key={tab.key}
              href={tab.href}
              className="relative flex flex-col items-center justify-center flex-1 gap-1 min-w-0 px-1 transition-all duration-150 active:scale-95"
              style={{
                color: isActive ? 'var(--shifa-blue)' : 'var(--shifa-gray)',
                textDecoration: 'none',
              }}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active indicator pill at top */}
              {isActive && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full"
                  style={{ width: '28px', height: '3px', backgroundColor: 'var(--shifa-blue)', borderRadius: '0 0 4px 4px' }}
                  aria-hidden="true"
                />
              )}

              {/* Active background pill */}
              {isActive && (
                <span
                  className="absolute inset-x-1 rounded-xl"
                  style={{ top: '6px', bottom: '6px', backgroundColor: 'var(--shifa-light)', opacity: 0.7 }}
                  aria-hidden="true"
                />
              )}

              {/* Icon */}
              <span className="relative z-10" aria-hidden="true">
                {isActive ? tab.activeIcon : tab.icon}
              </span>

              {/* Badge */}
              {tab.badge && tab.badge > 0 && (
                <span
                  className="absolute top-2 right-[calc(50%-14px)] min-w-[16px] h-4 rounded-full flex items-center justify-center text-white font-bold z-20"
                  style={{ backgroundColor: 'var(--shifa-red)', fontSize: '9px', padding: '0 3px' }}
                  aria-label={`${tab.badge} notifications`}
                >
                  {tab.badge > 9 ? '9+' : tab.badge}
                </span>
              )}

              {/* Label */}
              <span
                className="relative z-10 text-center font-medium leading-none truncate w-full px-0.5"
                style={{ fontSize: '10px', color: isActive ? 'var(--shifa-blue)' : 'var(--shifa-gray)' }}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
