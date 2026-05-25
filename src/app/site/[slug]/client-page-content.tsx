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
  Copy,
  Send,
  X,
  Instagram,
  CheckCircle2
} from 'lucide-react';
import { LandingPageData, ClientPlan, BenefitItem } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface ClientPageContentProps {
  data: LandingPageData;
}

export default function ClientPageContent({ data }: ClientPageContentProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<ClientPlan | null>(null);
  const [copied, setCopied] = useState(false);

  // Movie posters sample URLs for cinematic background collage (Unsplash)
  const posterUrls = [
    'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=300&q=80',
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&q=80',
    'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=300&q=80',
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&q=80',
    'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=300&q=80',
    'https://images.unsplash.com/photo-1542204111-3745b39a9111?w=300&q=80',
    'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&q=80',
    'https://images.unsplash.com/photo-1524712245354-2c4e5e7134cd?w=300&q=80',
    'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=300&q=80',
    'https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=300&q=80',
    'https://images.unsplash.com/photo-1574375927938-d5a98e8fed85?w=300&q=80',
    'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&q=80'
  ];

  // Dynamic Lucide Icon Mapper for client benefits
  const renderBenefitIcon = (iconName: string) => {
    const iconClass = "w-7 h-7";
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

  const handleCopyPix = () => {
    if (data.pixKey) {
      navigator.clipboard.writeText(data.pixKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openCheckout = (plan: ClientPlan) => {
    setSelectedPlan(plan);
    setIsCheckoutOpen(true);
  };

  // WhatsApp click text helper
  const getWhatsappLink = (text: string) => {
    return `https://wa.me/${data.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  const defaultTrialText = `Olá! Vi o site da ${data.name} e gostaria de solicitar um teste grátis de 6 horas para conhecer a grade de canais.`;

  return (
    <div className="min-h-screen bg-[#030303] text-foreground font-sans relative overflow-x-hidden">
      
      {/* Dynamic Background Gradients */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[800px] pointer-events-none opacity-25 filter blur-[150px] z-0"
        style={{
          background: `radial-gradient(ellipse at center, ${data.primaryColor} 0%, ${data.secondaryColor} 50%, transparent 100%)`
        }}
      />

      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative w-9 h-9 rounded-none bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden">
              {data.logoUrl ? (
                <img src={data.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
              ) : (
                <Tv className="w-5 h-5" style={{ color: data.primaryColor }} />
              )}
            </div>
            <span className="font-extrabold text-lg text-white tracking-tight">{data.name}</span>
          </div>
  
          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Início</a>
            <a href="#sobre-nos" className="hover:text-white transition-colors">Sobre Nós</a>
            <a href="#planos" className="hover:text-white transition-colors">Planos</a>
            <a 
              href={data.trialLink || getWhatsappLink(defaultTrialText)} 
              target="_blank" 
              className="hover:text-white transition-colors"
            >
              Teste Grátis
            </a>
            <a href="#contato" className="hover:text-white transition-colors">Contato</a>
          </nav>
  
          <a 
            href={data.trialLink || getWhatsappLink(defaultTrialText)} 
            target="_blank"
          >
            <Button 
              size="sm" 
              className="text-xs font-bold text-white px-5 rounded-full uppercase tracking-wider cursor-pointer"
              style={{
                backgroundColor: data.primaryColor
              }}
            >
              Assine Agora
            </Button>
          </a>
        </div>
      </header>
 
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-6 py-20 border-b border-white/10 overflow-hidden">
        {/* Cinematic Movie Posters Collage Background */}
        <div className="absolute inset-0 z-0 select-none overflow-hidden">
          <div className="absolute inset-0 bg-[#030303]/85 z-10" />
          <div 
            className="absolute inset-0 z-10 pointer-events-none" 
            style={{ 
              background: 'radial-gradient(circle at center, transparent 20%, #030303 90%)' 
            }} 
          />
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 transform -skew-y-12 scale-125 origin-top-left opacity-30 w-full h-full p-8">
            {posterUrls.concat(posterUrls).map((url, idx) => (
              <div key={idx} className="aspect-[2/3] bg-neutral-900 border border-white/5 overflow-hidden shadow-2xl">
                <img src={url} alt="Filme" className="w-full h-full object-cover grayscale opacity-60" />
              </div>
            ))}
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
          {/* Left Text Column */}
          <div className="lg:col-span-8 space-y-6 text-left">
            <span 
              className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-white/10 bg-black/50"
              style={{ color: data.primaryColor, borderColor: `${data.primaryColor}30` }}
            >
              <Play className="w-3.5 h-3.5 mr-2 fill-current" />
              Acesso imediato no seu aparelho
            </span>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase leading-none">
              A Melhor Lista de <br />
              <span className="text-white">Canais Filmes e Séries</span> <br />
              <span className="inline-block mt-2 font-black" style={{ color: data.primaryColor }}>
                Disponíveis em uma única plataforma.
              </span>
            </h1>

            <p className="text-slate-300 text-lg max-w-2xl leading-relaxed">
              {data.presentation || "Assista a futebol ao vivo, novelas, canais fechados, documentários, infantis e mais de 10.000 lançamentos de cinema diretamente da sua internet."}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-4">
              <a 
                href={data.trialLink || getWhatsappLink(defaultTrialText)} 
                target="_blank"
              >
                <Button 
                  size="lg" 
                  className="text-white font-bold h-14 px-8 rounded-full uppercase tracking-wider shadow-xl shadow-black/40 cursor-pointer"
                  style={{
                    backgroundColor: data.primaryColor
                  }}
                >
                  Assine Agora
                </Button>
              </a>

              {/* Interactive Play Indicator */}
              <a 
                href="#planos"
                className="flex items-center space-x-3 cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <Play className="w-5 h-5 fill-current ml-1" style={{ color: data.primaryColor }} />
                </div>
                <span className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-white uppercase tracking-wider group-hover:bg-white/10 transition-colors">
                  Aperte o Play
                </span>
              </a>
            </div>
          </div>

          {/* Right Image/Vibe Column (Collage representation) */}
          <div className="hidden lg:col-span-4 relative flex justify-end">
            {data.logoUrl && (
              <div className="w-48 h-48 bg-black/60 border border-white/15 p-6 flex items-center justify-center shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#030303] to-transparent opacity-60" />
                <img src={data.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain relative z-10" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Assista Onde Quiser Section */}
      <section id="sobre-nos" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight uppercase">
              Assista Onde Quiser
            </h2>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              A <span className="font-extrabold" style={{ color: data.primaryColor }}>{data.name}</span> oferece um aplicativo totalmente exclusivo para você. Basta baixá-lo e assistir tudo o que quiser e quando quiser.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${data.primaryColor}20`, border: `1px solid ${data.primaryColor}` }}>
                  <Smartphone className="w-6 h-6" style={{ color: data.primaryColor }} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">+12 Mil Conteúdos</h4>
                  <p className="text-sm text-slate-400">Em nosso Aplicativo você pode assistir todos os filmes que deseja.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${data.primaryColor}20`, border: `1px solid ${data.primaryColor}` }}>
                  <Play className="w-6 h-6 fill-current ml-0.5" style={{ color: data.primaryColor }} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1 font-sans">Canais Abertos e Fechados</h4>
                  <p className="text-sm text-slate-400 leading-normal">Oferecemos todos os Canais Abertos e Fechados, sem travamentos.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Mockup Layout Grid (HBO, Disney+, Premiere icons look) */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            <div className="relative w-full max-w-md aspect-square bg-gradient-to-tr from-white/5 to-white/0 border border-white/10 rounded-none p-6 overflow-visible">
              
              {/* Channel provider boxes grid backdrop */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-3 w-full h-full opacity-20 p-4">
                  {['Netflix', 'HBO Max', 'Disney+', 'Prime', 'Telecine', 'Premiere', 'ESPN', 'Canais HD', '4K Ultra'].map((c, i) => (
                    <div key={i} className="border border-white/10 bg-black/40 flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase tracking-widest p-2">
                      {c}
                    </div>
                  ))}
                </div>
              </div>

              {/* Devices mockup visuals representation */}
              <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                {/* Simulated TV Frame */}
                <div className="w-72 h-44 border-4 border-slate-800 bg-black shadow-2xl relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-slate-900 opacity-80" />
                  <Tv className="w-16 h-16 text-slate-700 relative z-10" />
                  
                  {/* Floating channel badge overlay */}
                  <div 
                    className="absolute bottom-2 right-2 px-2 py-0.5 text-[8px] font-bold text-white"
                    style={{ backgroundColor: data.primaryColor }}
                  >
                    4K STREAMING
                  </div>
                </div>

                {/* Overlap Info badges for premium feels */}
                <div className="absolute -bottom-4 right-2 w-32 h-44 bg-dark-surface border border-white/10 p-4 shadow-xl flex flex-col justify-end">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Assista em</span>
                  <span className="text-sm font-black text-white" style={{ color: data.primaryColor }}>Qualquer Aparelho</span>
                </div>

                <div className="absolute -top-4 -left-2 w-28 h-28 bg-dark-surface border border-white/10 p-3 shadow-xl flex flex-col justify-center items-center">
                  <Zap className="w-8 h-8 text-yellow-500 mb-2 animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-200 uppercase tracking-wider text-center">100% Anti-Travar</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/10 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-4 uppercase">
            Vantagens Exclusivas
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Oferecemos uma infraestrutura de ponta focada em estabilidade e qualidade de imagem.
          </p>
        </div>
 
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.benefits.map((b) => (
            <Card key={b.id} className="bg-black/40 border border-white/10 h-full p-6 transition-all rounded-none">
              <div className="w-12 h-12 rounded-none bg-white/5 flex items-center justify-center mb-5 border border-white/10">
                {renderBenefitIcon(b.icon)}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{b.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{b.description}</p>
            </Card>
          ))}
        </div>
      </section>
 
      {/* Plans Section */}
      <section id="planos" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/10 relative z-10">
        <div className="text-center mb-16">
          <span 
            className="px-4 py-1.5 rounded-full border border-white/20 text-xs font-bold uppercase tracking-widest bg-white/10"
            style={{ color: data.primaryColor }}
          >
            Escolha o seu plano
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white mt-4 mb-4 uppercase">
            Nossos Planos de Assinatura
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Sem fidelidade ou contratos. Cancele quando quiser e assista onde preferir.
          </p>
        </div>
 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch justify-center max-w-6xl mx-auto">
          {data.plans.map((plan) => (
            <Card 
              key={plan.id}
              className="flex flex-col justify-between p-6 bg-black/40 border h-full relative rounded-none animate-none"
              style={{
                borderColor: plan.isPopular ? data.primaryColor : 'rgba(255,255,255,0.1)'
              }}
            >
              {plan.isPopular && (
                <div 
                  className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-black uppercase tracking-wider"
                  style={{
                    backgroundColor: data.primaryColor
                  }}
                >
                  Mais Popular ⭐
                </div>
              )}
 
              <div className="p-2">
                <h3 className="text-lg font-bold text-slate-200">{plan.name}</h3>
                
                <div className="mt-4 flex items-baseline text-white">
                  <span className="text-xs text-slate-400 font-semibold mr-1">R$</span>
                  <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                  <span className="ml-1.5 text-xs font-semibold text-slate-400">/{plan.period}</span>
                </div>
 
                <ul className="mt-6 space-y-4 text-sm text-slate-300 border-t border-white/10 pt-6">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center">
                      <Check className="w-4 h-4 mr-3 shrink-0" style={{ color: data.primaryColor }} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
 
              <div className="mt-8 pt-4">
                <Button 
                  onClick={() => openCheckout(plan)}
                  className="w-full text-white font-bold h-12 rounded-full cursor-pointer"
                  style={{
                    backgroundColor: plan.isPopular ? data.primaryColor : 'rgba(255,255,255,0.05)',
                    border: plan.isPopular ? 'none' : '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  Assinar Agora
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
 
      {/* Testimonials Section */}
      {data.testimonials && data.testimonials.length > 0 && (
        <section id="depoimentos" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/10 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-4 uppercase">
              O que dizem os nossos clientes
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Nossa prioridade é a sua satisfação. Veja depoimentos reais de quem já usa o nosso servidor.
            </p>
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.testimonials.map((t) => (
              <Card key={t.id} className="bg-black/30 border border-white/10 p-6 transition-colors rounded-none">
                <div className="flex items-center space-x-1.5 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-4 h-4 fill-current ${star <= t.rating ? 'text-yellow-500' : 'text-slate-700'}`} 
                    />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">
                  "{t.comment}"
                </p>
                <div className="border-t border-white/10 pt-4">
                  <p className="font-bold text-white text-sm">{t.name}</p>
                  <p className="text-[10px] text-slate-500 font-semibold">{t.role || 'Cliente Ativo'}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {data.faqs && data.faqs.length > 0 && (
        <section id="faq" className="py-24 px-6 max-w-4xl mx-auto border-t border-white/10 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-4 uppercase">
              Dúvidas Frequentes
            </h2>
            <p className="text-slate-400">
              Tudo o que você precisa saber sobre o nosso sistema de transmissão.
            </p>
          </div>
 
          <div className="space-y-4">
            {data.faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="rounded-none border border-white/10 bg-black/20 overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-semibold text-white focus:outline-none cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown 
                    className="w-5 h-5 text-slate-400 transition-transform duration-300"
                    style={{ transform: activeFaq === idx ? 'rotate(180deg)' : undefined }}
                  />
                </button>
                
                {activeFaq === idx && (
                  <div className="px-6 pb-5 text-sm text-slate-300 leading-relaxed border-t border-white/10 pt-4 bg-black/30">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
 
      {/* Footer */}
      <footer id="contato" className="border-t border-white/10 bg-black/80 py-12 px-6 relative z-10 text-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500">
          <div className="flex items-center space-x-2">
            <Tv className="w-5 h-5" style={{ color: data.primaryColor }} />
            <span className="font-bold text-white text-base">{data.name}</span>
          </div>
 
          <p>© 2026 {data.name}. Todos os direitos reservados. Landing page criada em IPTVSaaS.</p>
 
          <div className="flex space-x-6">
            {data.instagram && (
              <a href={`https://instagram.com/${data.instagram}`} target="_blank" className="hover:text-white transition-colors">
                Instagram
              </a>
            )}
            {data.telegram && (
              <a href={`https://t.me/${data.telegram}`} target="_blank" className="hover:text-white transition-colors">
                Telegram
              </a>
            )}
          </div>
        </div>
      </footer>
 
      {/* WHATSAPP & TELEGRAM FLOATING CHAT BUBBLES */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3">
        {data.telegram && (
          <a 
            href={`https://t.me/${data.telegram}`} 
            target="_blank"
            className="w-12 h-12 rounded-full bg-[#0088cc] flex items-center justify-center text-white shadow-lg hover:bg-[#0077b3] transition-colors"
            title="Suporte no Telegram"
          >
            <Send className="w-5 h-5 fill-current" />
          </a>
        )}
        <a 
          href={getWhatsappLink(defaultTrialText)} 
          target="_blank"
          className="w-14 h-14 rounded-full bg-[#25d366] flex items-center justify-center text-white shadow-lg hover:bg-[#20ba56] transition-colors"
          title="Fale Conosco no WhatsApp"
        >
          <MessageSquare className="w-6 h-6 fill-current" />
        </a>
      </div>
 
      {/* PIX CHECKOUT MODAL */}
      {isCheckoutOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="absolute inset-0" onClick={() => setIsCheckoutOpen(false)} />
          
          <div className="relative w-full max-w-md bg-dark-surface border border-white/10 rounded-none p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-4 right-4 p-1 text-slate-500 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
 
            <div className="text-center">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 uppercase">
                Checkout PIX Automático
              </span>
              <h3 className="text-lg font-bold text-white mt-3">Você escolheu o {selectedPlan.name}</h3>
              <p className="text-slate-400 text-sm mt-1">
                Valor a pagar: <span className="text-white font-bold">R$ {selectedPlan.price}</span>
              </p>
 
              {/* QR Code image API generator */}
              {data.pixKey ? (
                <div className="my-6 p-4 rounded-none bg-white flex flex-col items-center justify-center w-52 h-52 mx-auto border border-white/10">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(data.pixKey)}`} 
                    alt="Pix QR Code" 
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <div className="my-6 p-4 rounded-none bg-dark-bg flex items-center justify-center w-52 h-52 mx-auto border border-white/5 text-slate-500 text-center text-xs">
                  Chave Pix não configurada pelo administrador.
                </div>
              )}
 
              {data.pixKey && (
                <div className="space-y-3">
                  <div className="p-3 bg-black/40 border border-white/10 rounded-none flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-300 truncate max-w-[260px]">{data.pixKey}</span>
                    <button 
                      onClick={handleCopyPix}
                      className="p-1 rounded-none hover:bg-white/5 text-white transition-colors cursor-pointer"
                      title="Copiar Chave Pix"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  {copied && <p className="text-xs text-green-500 font-semibold">Chave Pix copiada com sucesso!</p>}
 
                  <p className="text-[10px] text-slate-500 max-w-xs mx-auto leading-relaxed mt-2">
                    Aponte o celular para o QR Code acima ou utilize a chave Copia e Cola. Após concluir o pagamento, envie o comprovante abaixo para liberação imediata.
                  </p>
 
                  <a 
                    href={getWhatsappLink(`Olá! Fiz o pagamento via PIX no valor de R$ ${selectedPlan.price} correspondente ao plano "${selectedPlan.name}" na ${data.name}. Segue o comprovante em anexo para ativação.`)}
                    target="_blank"
                    className="block w-full mt-4"
                  >
                    <Button 
                      className="w-full text-white font-bold h-12 bg-green-600 hover:bg-green-700 cursor-pointer rounded-full"
                      leftIcon={<MessageSquare className="w-4 h-4 fill-current" />}
                    >
                      Confirmar Pagamento
                    </Button>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
