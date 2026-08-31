import { NextResponse } from 'next/server';

// Static health news data — rotated based on current week for "dynamic" feel
// In production, this could be replaced with a real health news API
const healthNewsPool = [
{
  key: 'n1',
  date: '13 Août 2026',
  title: 'Hypertension : les bons réflexes au quotidien',
  tag: 'Prévention',
  tagColor: '#0878EF',
  tagBg: '#D8E8FB',
  img: "https://img.rocket.new/generatedImages/rocket_gen_img_1464d9c92-1766529742624.png",
  alt: 'Médecin mesurant la tension artérielle d\'un patient'
},
{
  key: 'n2',
  date: '12 Août 2026',
  title: 'Vaccination : ce qu\'il faut savoir en 2026',
  tag: 'Conseils',
  tagColor: '#059669',
  tagBg: '#D1FAE5',
  img: 'https://images.unsplash.com/photo-1649652214831-4c54e5b65252',
  alt: 'Infirmière préparant un vaccin pour un patient'
},
{
  key: 'n3',
  date: '11 Août 2026',
  title: 'Sommeil : 7 conseils pour mieux récupérer',
  tag: 'Bien-être',
  tagColor: '#7C3AED',
  tagBg: '#EDE9FE',
  img: 'https://img.rocket.new/generatedImages/rocket_gen_img_1530ee71c-1773939742685.png',
  alt: 'Personne dormant paisiblement dans un lit confortable'
},
{
  key: 'n4',
  date: '10 Août 2026',
  title: 'Diabète : comprendre et mieux vivre au quotidien',
  tag: 'Maladies chroniques',
  tagColor: '#D97706',
  tagBg: '#FEF3C7',
  img: 'https://images.unsplash.com/photo-1683727186226-910f31a9da45',
  alt: 'Patient vérifiant son taux de glycémie avec un glucomètre'
},
{
  key: 'n5',
  date: '9 Août 2026',
  title: 'Santé mentale : briser les tabous en milieu professionnel',
  tag: 'Santé mentale',
  tagColor: '#0878EF',
  tagBg: '#D8E8FB',
  img: "https://img.rocket.new/generatedImages/rocket_gen_img_1327bb355-1788189500409.png",
  alt: 'Professionnel de santé en consultation de soutien psychologique'
},
{
  key: 'n6',
  date: '8 Août 2026',
  title: 'Alimentation équilibrée : les clés d\'une bonne nutrition',
  tag: 'Nutrition',
  tagColor: '#059669',
  tagBg: '#D1FAE5',
  img: "https://images.unsplash.com/photo-1697894467480-900fc55182e9",
  alt: 'Assiette colorée avec des légumes frais et des fruits variés'
},
{
  key: 'n7',
  date: '7 Août 2026',
  title: 'Activité physique : 30 minutes par jour suffisent',
  tag: 'Sport & Santé',
  tagColor: '#D97706',
  tagBg: '#FEF3C7',
  img: "https://images.unsplash.com/photo-1643419505374-f5c349c30035",
  alt: 'Personne faisant du jogging dans un parc verdoyant'
},
{
  key: 'n8',
  date: '6 Août 2026',
  title: 'Téléconsultation : comment bien préparer sa séance',
  tag: 'Numérique',
  tagColor: '#7C3AED',
  tagBg: '#EDE9FE',
  img: "https://img.rocket.new/generatedImages/rocket_gen_img_19179e4f8-1773374403441.png",
  alt: 'Patient en téléconsultation avec son médecin via tablette'
}];


export async function GET() {
  // Rotate news based on current day to give a "fresh" feel
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)?.getTime()) / 86400000);
  const offset = dayOfYear % healthNewsPool?.length;
  const rotated = [
  ...healthNewsPool?.slice(offset),
  ...healthNewsPool?.slice(0, offset)]?.
  slice(0, 4);

  return NextResponse?.json(rotated, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    }
  });
}