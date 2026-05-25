'use client';

import React, { useState } from 'react';
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
  Send,
  Monitor,
  Laptop,
  CheckCircle2
} from 'lucide-react';
import { LandingPageData, ClientPlan, BenefitItem } from '../../../types';
import { Button } from '../../../components/ui/Button';

interface ClientPageContentProps {
  data: LandingPageData;
}

export default function ClientPageContent({ data }: ClientPageContentProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Load dynamically configured movies from client dashboard or fallback to high-quality defaults
  const featuredMovies = data.featuredMovies && data.featuredMovies.length > 0
    ? data.featuredMovies
    : [
        {
          title: 'Gladiador II',
          genre: 'Ação / Épico',
          year: '2026',
          rating: '4.9',
          badge: 'Lançamento 2026',
          quality: '4K Ultra HD',
          image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&q=80'
        },
        {
          title: 'Duna: Parte Dois',
          genre: 'Ficção Científica',
          year: '2024',
          rating: '4.9',
          badge: 'Destaque',
          quality: '4K Ultra HD',
          image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80'
        },
        {
          title: 'Deadpool & Wolverine',
          genre: 'Ação / Comédia',
          year: '2024',
          rating: '4.8',
          badge: 'Mais Visto',
          quality: '1080p Dual',
          image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80'
        },
        {
          title: 'Divertida Mente 2',
          genre: 'Animação / Família',
          year: '2024',
          rating: '4.9',
          badge: 'Família',
          quality: '1080p Dual',
          image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&q=80'
        },
        {
          title: 'Batman: O Cavaleiro das Trevas',
          genre: 'Ação / Policial',
          year: 'Clássico',
          rating: '5.0',
          badge: 'Imperdível',
          quality: '4K Ultra HD',
          image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80'
        },
        {
          title: 'Coringa: Delírio a Dois',
          genre: 'Drama / Suspense',
          year: '2024',
          rating: '4.5',
          badge: 'Adicionado',
          quality: '1080p Dual',
          image: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7134cd?w=400&q=80'
        }
      ];

  // Dynamic Lucide Icon Mapper for client benefits
  const renderBenefitIcon = (iconName: string) => {
    const iconClass = "w-6 h-6";
    const styles = { color: data.primaryColor };

    switch (iconName) {
      case 'Tv': return <Tv className={iconClass} style={styles} />;
      case 'Zap': return <Zap className={iconClass} style={styles} />;
      case 'Play': return <Play className={iconClass} style={styles} />;
      case 'MessageSquare': return <MessageSquare className={iconClass} style={styles} />;
      case 'Shield': return <Shield className={iconClass} style={styles} />;
      case 'Globe': return <Globe className={iconClass} style={styles} />;
      case 'Smartphone': return <Smartphone className={iconClass} style={styles} />;
      case 'Film': return <Film className={iconClass} style={styles} />;
      default: return <Tv className={iconClass} style={styles} />;
    }
  };

  // WhatsApp click text helper
  const getWhatsappLink = (text: string) => {
    return `https://wa.me/${data.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  const defaultTrialText = `Olá! Gostaria de solicitar um teste grátis de 6 horas na *${data.name}* para conhecer o catálogo e a grade de canais.`;

  // Default banner images from Unsplash if client does not have one
  const defaultBannerUrl = 'https://images.unsplash.com/photo-1574375927938-d5a98e8fed85?q=80&w=1920&auto=format&fit=crop';

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] font-sans relative overflow-x-hidden">
      
      {/* Subtle Background Glow at the top */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none opacity-20 filter blur-[120px] z-0"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${data.primaryColor} 0%, ${data.secondaryColor || data.primaryColor} 100%)`
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            {data.logoUrl ? (
              <img src={data.logoUrl} alt={data.name} className="h-10 w-auto object-contain" />
            ) : (
              <div className="flex items-center space-x-3">
                <div className="relative w-9 h-9 rounded-[6px] bg-zinc-900 border border-zinc-800/60 flex items-center justify-center overflow-hidden">
                  <Tv className="w-5 h-5" style={{ color: data.primaryColor }} />
                </div>
                <span className="font-extrabold text-lg text-white tracking-tight">{data.name}</span>
              </div>
            )}
          </div>
  
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-zinc-400">
            <a href="#" className="hover:text-white transition-colors">Início</a>
            <a href="#sobre-nos" className="hover:text-white transition-colors">Sobre Nós</a>
            {data.showMoviesCatalog !== false && (
              <a href="#catalog" className="hover:text-white transition-colors">Lançamentos</a>
            )}
            <a href="#planos" className="hover:text-white transition-colors">Planos</a>
            <a href="#faq" className="hover:text-white transition-colors">Dúvidas</a>
          </nav>
  
          <a 
            href={data.trialLink || getWhatsappLink(defaultTrialText)} 
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button 
              size="sm" 
              className="text-xs font-bold text-white px-5 rounded-[6px] uppercase tracking-wider cursor-pointer transition-transform duration-300 hover:scale-105"
              style={{
                backgroundColor: data.primaryColor
              }}
            >
              Teste Grátis
            </Button>
          </a>
        </div>
      </header>
 
      {/* Hero Section */}
      <section 
        className="relative min-h-[80vh] flex items-center justify-center px-6 py-24 border-b border-zinc-900 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(9, 9, 11, 0.4) 0%, rgba(9, 9, 11, 0.95) 100%), url(${data.bannerUrl || defaultBannerUrl})`
        }}
      >
        <div className="relative max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
          {/* Left Text Column */}
          <div className="lg:col-span-8 space-y-6 text-left">
            <span 
              className="inline-flex items-center px-3.5 py-1.5 rounded-[6px] text-xs font-bold uppercase tracking-widest border border-zinc-800/80 bg-zinc-950/80 backdrop-blur-sm"
              style={{ color: data.primaryColor }}
            >
              <Play className="w-3.5 h-3.5 mr-2 fill-current" />
              Ultra HD 4K & Anti-Travamento
            </span>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-none uppercase">
              Cinema em Casa <br />
              <span className="text-white">Sem Limites e Sem Contratos</span> <br />
              <span className="inline-block mt-2 font-black" style={{ color: data.primaryColor }}>
                A melhor programação IPTV.
              </span>
            </h1>

            <p className="text-zinc-300 text-lg max-w-2xl leading-relaxed font-normal">
              {data.presentation || "Assista futebol ao vivo, canais fechados de esportes, filmes de cinema recém-lançados, novelas completas e desenhos infantis em qualquer aparelho conectado à internet."}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a 
                href={data.trialLink || getWhatsappLink(defaultTrialText)} 
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button 
                  size="lg" 
                  className="text-white font-bold h-14 px-8 rounded-[6px] uppercase tracking-wider cursor-pointer transition-transform duration-300 hover:scale-105"
                  style={{
                    backgroundColor: data.primaryColor
                  }}
                >
                  Solicitar Teste Grátis
                </Button>
              </a>

              <a 
                href="#planos"
                className="px-6 py-4 border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/60 transition-colors uppercase font-bold text-xs tracking-wider text-white rounded-[6px]"
              >
                Ver Planos Disponíveis
              </a>
            </div>
          </div>

          {/* Right Image/Logo Feature box */}
          <div className="hidden lg:col-span-4 relative flex justify-end">
            <div className="w-64 h-64 bg-zinc-950/90 border border-zinc-800/60 p-8 flex flex-col items-center justify-center shadow-2xl relative rounded-[6px]">
              <div className="absolute inset-0 bg-gradient-to-tr from-black to-transparent opacity-60 pointer-events-none rounded-[6px]" />
              
              {data.logoUrl ? (
                <img src={data.logoUrl} alt="Logo" className="max-w-[70%] max-h-[70%] object-contain relative z-10 mb-4" />
              ) : (
                <Tv className="w-16 h-16 text-zinc-700 relative z-10 mb-4" style={{ color: data.primaryColor }} />
              )}
              
              <span className="text-xs uppercase font-extrabold tracking-widest text-zinc-400">Plataforma Oficial</span>
              <span className="text-[10px] text-zinc-500 font-mono mt-1">100% Configurada</span>
            </div>
          </div>
        </div>
      </section>

      {/* Novidades no Catálogo (Featured Movies Section) */}
      {data.showMoviesCatalog !== false && (
        <section id="catalog" className="py-24 px-6 max-w-7xl mx-auto relative z-10 border-b border-zinc-900">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: data.primaryColor }}>
                Catálogo Atualizado Diariamente
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white mt-2 uppercase">
                Lançamentos no Cinema 🍿
              </h2>
            </div>
            <p className="text-zinc-400 text-sm max-w-sm mt-3 md:mt-0">
              Assista a esses e milhares de outros títulos no nosso catálogo on-demand imediatamente após assinar.
            </p>
          </div>

          <div className="flex overflow-x-auto md:grid md:grid-cols-3 lg:grid-cols-6 gap-4 pb-4 md:pb-0 scrollbar-none snap-x snap-mandatory">
            {featuredMovies.map((movie, idx) => (
              <div 
                key={idx} 
                className="group relative bg-zinc-950 border border-zinc-900/60 overflow-hidden transition-all duration-300 hover:border-zinc-700 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] cursor-pointer rounded-[6px] shrink-0 w-[70vw] sm:w-[45vw] md:w-auto snap-start"
              >
                {/* Poster Container */}
                <div className="aspect-[2/3] w-full overflow-hidden relative rounded-t-[6px]">
                  <img 
                    src={movie.image} 
                    alt={movie.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                  {/* Quality Pill */}
                  <span className="absolute top-2 left-2 bg-black/80 border border-zinc-800 text-[9px] font-bold text-zinc-200 px-2 py-0.5 uppercase tracking-wider rounded-[3px]">
                    {movie.quality}
                  </span>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 rounded-t-[6px]" />
                </div>

                {/* Text Content */}
                <div className="p-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{movie.genre}</span>
                  <h4 className="font-bold text-sm text-white truncate mt-0.5">{movie.title}</h4>
                  
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-900/60">
                    <span className="text-[9px] font-bold text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded-[3px]">
                      {movie.badge}
                    </span>
                    <div className="flex items-center space-x-1 text-xs text-yellow-500 font-bold">
                      <Star className="w-3 h-3 fill-current shrink-0" />
                      <span>{movie.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Assista Onde Quiser / Dispositivos Suportados */}
      <section id="sobre-nos" className="py-24 px-6 max-w-7xl mx-auto relative z-10 border-b border-zinc-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Description Column */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: data.primaryColor }}>
              Compatibilidade Total
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase leading-tight">
              Assista em Qualquer Dispositivo
            </h2>
            <p className="text-zinc-400 text-base leading-relaxed">
              O sistema da <span className="font-extrabold text-white">{data.name}</span> funciona diretamente nos principais aplicativos do mercado. Configuramos tudo para você assistir na TV, celular, computador ou tablet.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-start space-x-3.5">
                <div className="w-5 h-5 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 mt-1">
                  <Check className="w-3.5 h-3.5" style={{ color: data.primaryColor }} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wide">Sem necessidade de aparelhos caros</h4>
                  <p className="text-xs text-zinc-500 mt-0.5">Assista direto pelo aplicativo da sua própria Smart TV.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3.5">
                <div className="w-5 h-5 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 mt-1">
                  <Check className="w-3.5 h-3.5" style={{ color: data.primaryColor }} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wide">Qualidade de Transmissão Inteligente</h4>
                  <p className="text-xs text-zinc-500 mt-0.5">O sinal adapta-se automaticamente à velocidade da sua conexão.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Platforms Grid */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="p-6 bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition-colors">
              <Tv className="w-8 h-8 text-zinc-400 mb-4" />
              <h3 className="font-bold text-sm text-white uppercase tracking-wide">Smart TVs</h3>
              <p className="text-xs text-zinc-500 mt-1">Samsung, LG, TCL, Philco e TVs com sistema Android.</p>
            </div>
            
            <div className="p-6 bg-zinc-950 border border-zinc-900/60 hover:border-zinc-800 transition-colors rounded-[6px]">
              <Smartphone className="w-8 h-8 text-zinc-400 mb-4" />
              <h3 className="font-bold text-sm text-white uppercase tracking-wide">Celular & Tablet</h3>
              <p className="text-xs text-zinc-500 mt-1">Aplicativos rápidos para sistemas Android e iOS Apple.</p>
            </div>

            <div className="p-6 bg-zinc-950 border border-zinc-900/60 hover:border-zinc-800 transition-colors rounded-[6px]">
              <Monitor className="w-8 h-8 text-zinc-400 mb-4" />
              <h3 className="font-bold text-sm text-white uppercase tracking-wide">TV Box & Fire Stick</h3>
              <p className="text-xs text-zinc-500 mt-1">Compatibilidade nativa com Xiaomi, Firestick e conversores.</p>
            </div>

            <div className="p-6 bg-zinc-950 border border-zinc-900/60 hover:border-zinc-800 transition-colors rounded-[6px]">
              <Laptop className="w-8 h-8 text-zinc-400 mb-4" />
              <h3 className="font-bold text-sm text-white uppercase tracking-wide">Computadores</h3>
              <p className="text-xs text-zinc-500 mt-1">Acesso direto pelo navegador web sem instalar nada.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vantagens Exclusivas (Benefits) */}
      <section className="py-24 px-6 max-w-7xl mx-auto relative z-10 border-b border-zinc-900">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: data.primaryColor }}>
            Tecnologia de Ponta
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white mt-2 uppercase">
            Vantagens Exclusivas ⚡
          </h2>
          <p className="text-zinc-500 max-w-xl mx-auto text-sm mt-3">
            Garantimos servidores de alta velocidade localizados no Brasil, focados em estabilidade para que sua transmissão não trave nos momentos cruciais.
          </p>
        </div>
 
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.benefits.map((b) => (
            <Card key={b.id} className="bg-zinc-950/80 border border-zinc-900/60 h-full p-6 transition-all rounded-[6px] hover:border-zinc-800">
              <div className="w-12 h-12 bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-center mb-5 rounded-[6px]">
                {renderBenefitIcon(b.icon)}
              </div>
              <h3 className="text-base font-bold text-white uppercase tracking-wide mb-1.5">{b.title}</h3>
              <p className="text-zinc-500 text-xs leading-relaxed">{b.description}</p>
            </Card>
          ))}
        </div>
      </section>
 
      {/* Plans Section */}
      <section id="planos" className="py-24 px-6 max-w-7xl mx-auto relative z-10 border-b border-zinc-900">
        <div className="text-center mb-16">
          <span 
            className="px-3.5 py-1.5 border border-zinc-800 text-[10px] font-bold uppercase tracking-widest bg-zinc-900/40"
            style={{ color: data.primaryColor }}
          >
            Grade Completa Sem Fidelidade
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white mt-4 mb-4 uppercase">
            Nossos Planos de Assinatura
          </h2>
          <p className="text-zinc-500 max-w-xl mx-auto text-sm">
            Ativação imediata sem taxas ocultas. Escolha o plano ideal para a sua casa e comece a assistir agora mesmo.
          </p>
        </div>
 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch justify-center max-w-5xl mx-auto">
          {data.plans.map((plan) => (
            <div 
              key={plan.id}
              className="bg-zinc-950 border h-full p-8 transition-all flex flex-col justify-between rounded-[6px] relative shadow-lg overflow-visible"
              style={{
                borderColor: plan.isPopular ? data.primaryColor : 'rgb(24, 24, 27)'
              }}
            >
              {plan.isPopular && (
                <span 
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-[10px] font-extrabold text-white uppercase tracking-widest rounded-full whitespace-nowrap z-10"
                  style={{ backgroundColor: data.primaryColor }}
                >
                  Mais Vendido
                </span>
              )}
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wide">{plan.name}</h3>
                  <div className="flex items-baseline mt-4">
                    <span className="text-zinc-500 text-xs font-bold uppercase">R$</span>
                    <span className="text-4xl font-extrabold text-white ml-1">{plan.price}</span>
                    <span className="text-zinc-500 text-[10px] font-bold uppercase ml-1">/ {plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 border-t border-zinc-900 pt-6 text-xs text-zinc-400">
                  {plan.features.map((f, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 shrink-0" style={{ color: data.primaryColor }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8 mt-auto">
                <Button 
                  onClick={() => {
                    const message = `Olá! Gostaria de assinar o *${plan.name}* (R$ ${plan.price}/${plan.period}) na *${data.name}*. Como posso proceder com o pagamento e ativação?`;
                    window.open(getWhatsappLink(message), '_blank', 'noopener,noreferrer');
                  }}
                  className="w-full text-white font-bold h-12 rounded-[6px] cursor-pointer uppercase text-xs tracking-wider transition-colors duration-200"
                  style={{
                    backgroundColor: plan.isPopular ? data.primaryColor : 'transparent',
                    border: plan.isPopular ? 'none' : '1px solid rgb(39, 39, 42)'
                  }}
                >
                  Assinar Agora via WhatsApp
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
 
      {/* Testimonials Section */}
      {data.testimonials && data.testimonials.length > 0 && (
        <section id="depoimentos" className="py-24 px-6 max-w-7xl mx-auto relative z-10 border-b border-zinc-900">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-4 uppercase">
              Opinião dos Clientes 💬
            </h2>
            <p className="text-zinc-500 max-w-xl mx-auto text-sm">
              Veja o depoimento de quem já utiliza o nosso sinal de transmissão em casa diariamente.
            </p>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.testimonials.map((t) => (
              <Card key={t.id} className="bg-zinc-950 border border-zinc-900/60 p-6 rounded-[6px]">
                <div className="flex items-center space-x-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-3.5 h-3.5 fill-current ${star <= t.rating ? 'text-yellow-500' : 'text-zinc-800'}`} 
                    />
                  ))}
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed mb-6 italic">
                  "{t.comment}"
                </p>
                <div className="border-t border-zinc-900 pt-4">
                  <p className="font-bold text-white text-xs uppercase tracking-wide">{t.name}</p>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{t.role || 'Cliente Ativo'}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {data.faqs && data.faqs.length > 0 && (
        <section id="faq" className="py-24 px-6 max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-4 uppercase">
              Perguntas Frequentes
            </h2>
            <p className="text-zinc-500 text-sm">
              Esclareça suas dúvidas principais sobre o funcionamento e ativação do sistema.
            </p>
          </div>
  
          <div className="space-y-3">
            {data.faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="rounded-[6px] border border-zinc-900/60 bg-zinc-950 overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-white uppercase text-xs tracking-wider focus:outline-none cursor-pointer hover:bg-zinc-900/40 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown 
                    className="w-4 h-4 text-zinc-500 transition-transform duration-300"
                    style={{ transform: activeFaq === idx ? 'rotate(180deg)' : undefined }}
                  />
                </button>
                
                {activeFaq === idx && (
                  <div className="px-6 pb-5 text-xs text-zinc-400 leading-relaxed border-t border-zinc-900 pt-4 bg-zinc-950/60">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
 
      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950/80 py-12 px-6 relative z-10 text-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-zinc-500">
          <div className="flex items-center">
            {data.logoUrl ? (
              <img src={data.logoUrl} alt="Logo" className="h-8 w-auto object-contain" />
            ) : (
              <div className="flex items-center space-x-2">
                <Tv className="w-5 h-5" style={{ color: data.primaryColor }} />
                <span className="font-bold text-white text-sm uppercase tracking-wider">{data.name}</span>
              </div>
            )}
          </div>
  
          <p>
            © 2026 {data.name}. Todos os direitos reservados. -{' '}
            <a 
              href={`https://wa.me/5513997341034?text=Ol%C3%A1%2C%20gostaria%20de%20criar%20um%20site%20IPTV%20como%20o%20da%20${encodeURIComponent(data.name)}`}
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:underline transition-colors font-bold"
              style={{ color: data.primaryColor }}
            >
              crie seu site agora
            </a>
          </p>
  
          <div className="flex space-x-6 font-semibold">
            {data.instagram && (
              <a 
                href={`https://instagram.com/${data.instagram}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-white transition-colors"
              >
                Instagram
              </a>
            )}
            {data.telegram && (
              <a 
                href={`https://t.me/${data.telegram}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-white transition-colors"
              >
                Telegram
              </a>
            )}
          </div>
        </div>
      </footer>
 
      {/* FLOATING CHAT BUBBLES */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3">
        {data.telegram && (
          <a 
            href={`https://t.me/${data.telegram}`} 
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-[#0088cc] flex items-center justify-center text-white shadow-lg hover:bg-[#0077b3] transition-colors"
            title="Suporte no Telegram"
          >
            <Send className="w-5 h-5 fill-current" />
          </a>
        )}
        <a 
          href={getWhatsappLink(defaultTrialText)} 
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full bg-[#25d366] flex items-center justify-center text-white shadow-lg hover:bg-[#20ba56] transition-colors"
          title="Fale Conosco no WhatsApp"
        >
          <MessageSquare className="w-6 h-6 fill-current" />
        </a>
      </div>
    </div>
  );
}
