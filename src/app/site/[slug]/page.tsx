import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Tv, 
  Zap, 
  Play, 
  MessageSquare, 
  Shield, 
  Globe, 
  Smartphone, 
  Film,
  Check,
  ChevronDown,
  Star,
  Copy,
  AlertTriangle,
  Send,
  HelpCircle
} from 'lucide-react';
import { dbService } from '../../../services/db';
import { LandingPageData, ClientPlan, PageStatus } from '../../../types';
import ClientPageContent from './client-page-content';

interface Props {
  params: Promise<{ slug: string }>;
}

// Next.js 15 Dynamic Metadata generation for SEO optimization
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pageData = await dbService.getLandingPageBySlug(slug);

  if (!pageData) {
    return {
      title: 'Página Não Encontrada',
      description: 'Esta landing page não foi encontrada no nosso sistema.'
    };
  }

  const title = `${pageData.name} | Canais, Filmes e Séries Premium em HD e 4K`;
  const description = pageData.presentation || `Assista a melhor grade de canais abertos e fechados, filmes e séries on-demand com a ${pageData.name}. Solicite seu teste grátis!`;

  return {
    title,
    description,
    icons: {
      icon: pageData.logoUrl || '/favicon.ico',
      shortcut: pageData.logoUrl || '/favicon.ico',
      apple: pageData.logoUrl || '/favicon.ico',
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://${slug}.meudominio.com`,
      siteName: pageData.name,
      images: [
        {
          url: pageData.promoImageUrl || 'https://images.unsplash.com/photo-1593789198777-f29bc259780e?q=80&w=1200&auto=format&fit=crop',
          width: 1200,
          height: 630,
          alt: `${pageData.name} Promo`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [pageData.promoImageUrl || '']
    }
  };
}

export default async function DynamicClientSitePage({ params }: Props) {
  const { slug } = await params;
  const pageData = await dbService.getLandingPageBySlug(slug);

  if (!pageData) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center">
        <Tv className="w-16 h-16 text-red-600 mb-6" />
        <h1 className="text-3xl font-extrabold mb-2">404 - Página Não Encontrada</h1>
        <p className="text-slate-400 max-w-md mb-8">
          A landing page com a URL "/site/{slug}" não foi cadastrada ou foi removida pelo administrador.
        </p>
        <Link href="/">
          <button className="px-6 py-3 rounded-none bg-red-600 font-bold hover:bg-red-700 transition-colors cursor-pointer">
            Voltar para o Início
          </button>
        </Link>
      </div>
    );
  }

  // Increment view counts on load
  try {
    await dbService.incrementViews(slug);
  } catch (err) {
    console.error('Failed to increment views', err);
  }

  // Check Page Status restrictions
  const isBlocked = pageData.status === 'suspended' || pageData.status === 'blocked' || pageData.status === 'expired';

  if (isBlocked) {
    return (
      <div className="min-h-screen bg-[#030303] text-white flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background glow overlay removed */}
        
        <div className="max-w-md w-full border border-red-500/20 rounded-none p-8 text-center shadow-none z-10">
          <AlertTriangle className="w-14 h-14 text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-extrabold mb-3">Acesso Temporariamente Suspenso</h1>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            A página de <span className="font-semibold text-white">{pageData.name}</span> está indisponível no momento. Se você é o proprietário, entre em contato com o suporte master para renovação da assinatura.
          </p>
          <div className="border-t border-dark-border/40 pt-6 mt-6">
            <a 
              href={`https://wa.me/${pageData.whatsapp}?text=Ola%20vi%20que%20minha%20pagina%20esta%20suspensa%20gostaria%20de%20renovar`}
              target="_blank" 
              className="inline-flex items-center justify-center w-full px-5 py-3 rounded-none bg-red-600 font-bold text-sm text-white hover:bg-red-700 transition-colors"
            >
              Falar com o Administrador
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Render the page using client-side interactivity wrapper
  return <ClientPageContent data={pageData} />;
}
