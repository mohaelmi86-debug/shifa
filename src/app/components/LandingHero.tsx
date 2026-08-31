'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';


const paths = [
{
  key: 'patient',
  icon:
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>,

  label: 'Patient',
  desc: 'Suivre et organiser votre parcours de santé',
  color: '#0878EF',
  href: '/sign-up-login-screen'
},
{
  key: 'pro',
  icon:
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>,

  label: 'Professionnel',
  desc: 'Gérer votre activité et accompagner vos patients',
  color: '#0878EF',
  href: '/sign-up-login-screen'
},
{
  key: 'etab',
  icon:
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>,

  label: 'Établissement',
  desc: 'Piloter vos services et vos équipes',
  color: '#0878EF',
  href: '/sign-up-login-screen'
}];

interface NewsItem {
  key: string;
  date: string;
  title: string;
  tag: string;
  tagColor: string;
  tagBg: string;
  img: string;
  alt: string;
}

const fallbackNews: NewsItem[] = [
{
  key: 'n1',
  date: '17 Mai 2024',
  title: 'Hypertension : les bons réflexes au quotidien',
  tag: 'Prévention',
  tagColor: '#0878EF',
  tagBg: '#D8E8FB',
  img: "https://img.rocket.new/generatedImages/rocket_gen_img_1464d9c92-1766529742624.png",
  alt: 'Médecin mesurant la tension artérielle d\'un patient'
},
{
  key: 'n2',
  date: '15 Mai 2024',
  title: 'Vaccination : ce qu\'il faut savoir en 2024',
  tag: 'Conseils',
  tagColor: '#059669',
  tagBg: '#D1FAE5',
  img: "https://images.unsplash.com/photo-1649652214831-4c54e5b65252",
  alt: 'Infirmière préparant un vaccin pour un patient'
},
{
  key: 'n3',
  date: '12 Mai 2024',
  title: 'Sommeil : 7 conseils pour mieux vivre',
  tag: 'Bien-être',
  tagColor: '#7C3AED',
  tagBg: '#EDE9FE',
  img: "https://img.rocket.new/generatedImages/rocket_gen_img_1530ee71c-1773939742685.png",
  alt: 'Personne dormant paisiblement dans un lit confortable'
},
{
  key: 'n4',
  date: '10 Mai 2024',
  title: 'Diabète : comprendre et mieux vivre',
  tag: 'Maladies chroniques',
  tagColor: '#D97706',
  tagBg: '#FEF3C7',
  img: "https://images.unsplash.com/photo-1683727186226-910f31a9da45",
  alt: 'Patient vérifiant son taux de glycémie avec un glucomètre'
}];


export default function LandingHero() {
  const [news, setNews] = useState<NewsItem[]>(fallbackNews);
  const [newsLoading, setNewsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchNews() {
      try {
        const res = await fetch('/api/health-news');
        if (!res.ok) throw new Error('fetch failed');
        const data = await res.json();
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setNews(data);
        }
      } catch {







        // Keep fallback news on error
      } finally {if (!cancelled) setNewsLoading(false);}}fetchNews();return () => {cancelled = true;};}, []);
  return (
    <>
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10 xl:px-16">
          {/* Mobile hero */}
          <div className="lg:hidden pt-8 pb-6">
            <div className="flex flex-col gap-6">
              {/* Headline + image row */}
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h1 className="font-bold leading-tight mb-3" style={{ fontSize: '28px', color: '#0F2A5E', letterSpacing: '-0.02em' }}>
                    Votre santé,{' '}
                    <span style={{ color: '#0878EF' }}>au même endroit.</span>
                  </h1>
                  <p className="text-sm leading-relaxed" style={{ color: '#4A6080' }}>
                    Dossier médical, rendez-vous, téléconsultation, échanges sécurisés et bien plus encore.
                  </p>
                </div>
                <div className="w-28 h-28 rounded-2xl overflow-hidden shrink-0" style={{ boxShadow: '0 8px 24px rgba(8,120,239,0.15)' }}>
                  <img
                    src="https://img.rocket.new/generatedImages/rocket_gen_img_1e400d46f-1780212343912.png"
                    alt="Médecin souriant tenant un smartphone affichant l'application SHIFA Health OS"
                    className="w-full h-full object-cover" />
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-3">
                <Link
                  href="/sign-up-login-screen"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm text-white"
                  style={{ backgroundColor: '#0878EF', boxShadow: '0 4px 16px rgba(8,120,239,0.35)' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                    <path strokeLinecap="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  Se connecter
                </Link>
                <Link
                  href="/sign-up-login-screen"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm border-2"
                  style={{ borderColor: '#0878EF', color: '#0878EF', backgroundColor: 'transparent' }}>
                  Créer un compte
                </Link>
              </div>
            </div>
          </div>

          {/* Desktop hero */}
          <div className="hidden lg:flex items-center gap-16 py-16">
            <div className="flex-1 max-w-xl">
              <h1 className="font-bold leading-tight mb-5" style={{ fontSize: '48px', color: '#0F2A5E', letterSpacing: '-0.03em' }}>
                Votre santé,{' '}
                <span style={{ color: '#0878EF' }}>au même endroit.</span>
              </h1>
              <p className="text-lg leading-relaxed mb-8" style={{ color: '#4A6080' }}>
                SHIFA Health OS connecte tous les acteurs de la santé pour vous offrir une expérience simple, sécurisée et humaine.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/sign-up-login-screen"
                  className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white"
                  style={{ backgroundColor: '#0878EF', boxShadow: '0 4px 20px rgba(8,120,239,0.35)' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                    <path strokeLinecap="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  Se connecter
                </Link>
                <Link
                  href="/sign-up-login-screen"
                  className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold border-2"
                  style={{ borderColor: '#0878EF', color: '#0878EF' }}>
                  Créer un compte
                </Link>
              </div>
            </div>
            <div className="flex-1 max-w-lg">
              <div className="rounded-3xl overflow-hidden" style={{ boxShadow: '0 24px 64px rgba(8,120,239,0.15)' }}>
                <img
                  src="https://img.rocket.new/generatedImages/rocket_gen_img_134368439-1788188159039.png"
                  alt="Médecin souriant utilisant l'application SHIFA Health OS sur son smartphone"
                  className="w-full h-80 object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vous êtes... section */}
      <section className="py-8 lg:py-12" style={{ backgroundColor: '#EDF1F9' }}>
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10 xl:px-16">
          <p className="text-sm font-semibold mb-5" style={{ color: '#4A6080' }}>Vous êtes...</p>
          <div className="flex flex-col gap-3 max-w-lg">
            {paths?.map((p) =>
            <Link key={p?.key} href={p?.href} className="block group">
                <div
                className="flex items-center gap-4 p-4 rounded-2xl border transition-all active:scale-[0.98]"
                style={{ backgroundColor: '#F7F9FE', borderColor: '#D4DFEF', boxShadow: '0 1px 6px rgba(8,120,239,0.06)' }}>
                  <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: '#D8E8FB', color: '#0878EF' }}>
                    {p?.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm" style={{ color: '#0F2A5E' }}>{p?.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#4A6080' }}>{p?.desc}</p>
                  </div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 shrink-0" style={{ color: '#0878EF' }}>
                    <path strokeLinecap="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Actualités santé — dynamic */}
      <section className="py-8 lg:py-12" style={{ backgroundColor: '#F7F9FE' }}>
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10 xl:px-16">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-base" style={{ color: '#0F2A5E' }}>Actualités santé</h2>
            <button className="text-sm font-semibold" style={{ color: '#0878EF' }}>Voir tout</button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {newsLoading ?
            Array.from({ length: 4 }).map((_, i) =>
            <div key={i} className="rounded-2xl overflow-hidden border animate-pulse" style={{ borderColor: '#D4DFEF', backgroundColor: '#EDF1F9' }}>
                    <div className="h-28" style={{ backgroundColor: '#D4DFEF' }} />
                    <div className="p-3 space-y-2">
                      <div className="h-2 rounded" style={{ backgroundColor: '#D4DFEF', width: '60%' }} />
                      <div className="h-3 rounded" style={{ backgroundColor: '#D4DFEF' }} />
                      <div className="h-3 rounded" style={{ backgroundColor: '#D4DFEF', width: '80%' }} />
                    </div>
                  </div>
            ) :
            news?.map((item) =>
            <div key={item?.key} className="rounded-2xl overflow-hidden border" style={{ borderColor: '#D4DFEF', backgroundColor: '#F7F9FE', boxShadow: '0 1px 6px rgba(8,120,239,0.05)' }}>
                    <div className="h-28 overflow-hidden">
                      <img src={item?.img} alt={item?.alt} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3">
                      <p className="text-xs mb-1.5" style={{ color: '#7A90A8' }}>{item?.date}</p>
                      <p className="text-xs font-semibold leading-snug mb-2" style={{ color: '#0F2A5E' }}>{item?.title}</p>
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: item?.tagBg, color: item?.tagColor }}>
                        {item?.tag}
                      </span>
                    </div>
                  </div>
            )
            }
          </div>
        </div>
      </section>
    </>);

}