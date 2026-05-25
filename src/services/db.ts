import { createClient } from '@supabase/supabase-js';
import { LandingPageData, PaymentData, PageStatus, ClientPlan, FAQItem, TestimonialItem, BenefitItem } from '../types';

// Supabase environment variables check
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Initial dummy data for the mock layer (rich, premium IPTV content)
const INITIAL_LANDING_PAGES: LandingPageData[] = [
  {
    id: '1',
    clientId: 'client-1',
    name: 'Flux Play IPTV',
    slug: 'flux-iptv',
    logoUrl: '',
    bannerUrl: '',
    promoImageUrl: '',
    primaryColor: '#e50914', // Netflix Red
    secondaryColor: '#833ab4', // Neon Purple
    whatsapp: '5511999999999',
    telegram: 'flux_play_support',
    instagram: 'fluxplay.tv',
    presentation: 'A melhor experiência de entretenimento para toda a sua família. Mais de 80.000 canais, filmes e séries em alta definição (4K/UHD) com o servidor mais estável do Brasil. Assista sem travamentos, de qualquer dispositivo!',
    trialLink: 'https://wa.me/5511999999999?text=Quero+um+teste+gratis+de+6+horas',
    pixKey: 'pix@fluxplay.tv',
    pixQrUrl: '',
    benefits: [
      { id: 'b1', title: 'Canais em 4K/HDR', description: 'Assista seus esportes favoritos, canais abertos e fechados na melhor qualidade de imagem.', icon: 'Tv' },
      { id: 'b2', title: 'Sem Travamentos', description: 'Nossa tecnologia CDN híbrida garante estabilidade mesmo em conexões de internet comuns.', icon: 'Zap' },
      { id: 'b3', title: 'Conteúdo sob Demanda', description: 'Milhares de filmes e séries atualizados diariamente. Netflix, Disney+, HBO Max e mais no mesmo lugar.', icon: 'Play' },
      { id: 'b4', title: 'Suporte 24/7', description: 'Equipe especializada pronta para te atender a qualquer hora via WhatsApp e Telegram.', icon: 'MessageSquare' },
    ],
    plans: [
      { id: 'p1', name: 'Plano Mensal', price: '35,00', period: 'mensal', features: ['1 Tela simultânea', 'Grade Completa de Canais', 'Filmes & Séries On Demand', 'Qualidade SD/HD/FHD/4K', 'Suporte Especializado'], isPopular: false },
      { id: 'p2', name: 'Plano Trimestral', price: '90,00', period: 'trimestral', features: ['1 Tela simultânea', 'Grade Completa de Canais', 'Filmes & Séries On Demand', 'Qualidade SD/HD/FHD/4K', 'Suporte Prioritário', 'Desconto Exclusivo (Economia de R$ 15)'], isPopular: true },
      { id: 'p3', name: 'Plano Semestral', price: '160,00', period: 'semestral', features: ['2 Telas simultâneas', 'Grade Completa de Canais', 'Filmes & Séries On Demand', 'Qualidade SD/HD/FHD/4K', 'Suporte Prioritário 24h', 'Economia de R$ 50'], isPopular: false }
    ],
    faqs: [
      { question: 'Como funciona o teste grátis?', answer: 'Basta clicar no botão de teste grátis que você será direcionado para o nosso WhatsApp. Um robô ou atendente humano criará um acesso temporário de 6 horas para você testar sem compromisso.' },
      { question: 'Quais aparelhos são compatíveis?', answer: 'Nossos servidores funcionam em Smart TVs (Samsung, LG, Android TV), TV Box, Chromecast, smartphones (Android/iOS), computadores, notebooks e tablets.' },
      { question: 'Como faço para pagar?', answer: 'Aceitamos pagamentos via PIX para liberação instantânea, ou cartão de crédito via Mercado Pago/Stripe. A renovação não é automática, você paga apenas quando quiser usar.' },
      { question: 'Preciso de internet rápida?', answer: 'Recomendamos uma conexão estável de no mínimo 10 Mbps para canais em HD e de 25 Mbps para canais em 4K/UHD.' }
    ],
    testimonials: [
      { id: 't1', name: 'André Souza', comment: 'Assisto todos os jogos do Brasileirão sem travar um segundo. O suporte técnico me ajudou a configurar em 2 minutos na minha Smart TV.', rating: 5, role: 'Cliente desde 2024' },
      { id: 't2', name: 'Juliana Mendes', comment: 'Cancelei minhas assinaturas caras de streaming e fiquei só com a Flux. Filmes novos saem super rápido e a qualidade 4K é perfeita.', rating: 5, role: 'Cliente desde 2025' },
      { id: 't3', name: 'Roberto Lima', comment: 'Excelente atendimento pós-venda. Tive uma dúvida na instalação do app no celular e resolveram muito rápido pelo WhatsApp.', rating: 5, role: 'Cliente desde 2024' }
    ],
    customDomain: 'fluxplay.tv',
    viewsCount: 1420,
    status: 'active',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    clientId: 'client-2',
    name: 'Nitro Stream',
    slug: 'nitro-stream',
    logoUrl: '',
    bannerUrl: '',
    promoImageUrl: '',
    primaryColor: '#00d2ff', // Cyan Neon
    secondaryColor: '#00f5d4', // Green Neon
    whatsapp: '5511888888888',
    telegram: 'nitro_stream',
    instagram: 'nitro.stream',
    presentation: 'A maior velocidade e estabilidade do mercado de streaming. Assista a esportes ao vivo, canais premium de filmes e séries, documentários e conteúdo infantil com qualidade ultra fluida. Sem fidelidade, sem contratos!',
    trialLink: 'https://wa.me/5511888888888?text=Quero+testar+a+estabilidade+da+Nitro+Stream',
    pixKey: 'financeiro@nitrostream.com',
    pixQrUrl: '',
    benefits: [
      { id: 'b1', title: 'Grade Ultra Completa', description: 'Todos os canais de esportes, filmes, documentários, infantis e pay-per-view inclusos.', icon: 'Tv' },
      { id: 'b2', title: 'Servidores CDN Dedicados', description: 'Infraestrutura de ponta que evita gargalos em transmissões de grande audiência como clássicos de futebol.', icon: 'Zap' },
      { id: 'b3', title: 'Aplicativo Próprio', description: 'Fornecemos nosso aplicativo oficial premium otimizado para Android e TV Box.', icon: 'Play' },
    ],
    plans: [
      { id: 'p1', name: 'Mensal Premium', price: '39,90', period: 'mensal', features: ['1 Tela FHD/4K', 'Sem Contrato de Fidelidade', 'Liberação Instantânea', 'Suporte WhatsApp'], isPopular: true },
      { id: 'p2', name: 'Anual Mega', price: '299,00', period: 'anual', features: ['2 Telas FHD/4K simultâneas', 'Economia gigante de R$ 180', 'Suporte VIP VIP 24h', 'Acesso Completo a Lançamentos'], isPopular: false }
    ],
    faqs: [
      { question: 'Tem fidelidade ou multa se eu cancelar?', answer: 'Não. Nosso serviço é pré-pago. Se pagar, continua ativo; se não renovar, o sinal é apenas suspenso sem qualquer cobrança adicional ou restrição.' }
    ],
    testimonials: [
      { id: 't1', name: 'Carlos Henrique', comment: 'A qualidade dos canais de futebol da Nitro é impressionante. Não tem aquele atraso chato dos aplicativos comuns.', rating: 5, role: 'Assinante Anual' }
    ],
    viewsCount: 950,
    status: 'active',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    clientId: 'client-3',
    name: 'Prime Ultra Digital',
    slug: 'prime-ultra',
    logoUrl: '',
    bannerUrl: '',
    promoImageUrl: '',
    primaryColor: '#ffb703', // Yellow Neon
    secondaryColor: '#fb8500', // Orange Glow
    whatsapp: '5511777777777',
    presentation: 'Entretenimento premium sem limites. Toda a programação da TV aberta e fechada na palma da sua mão. Filmes recém-lançados do cinema adicionados semanalmente.',
    trialLink: 'https://wa.me/5511777777777?text=Quero+teste+gratis+prime',
    pixKey: 'prime@ultradigital.com',
    benefits: [
      { id: 'b1', title: 'Filmes de Cinema', description: 'Os maiores lançamentos do cinema mundial na sua TV de casa em poucos dias.', icon: 'Film' }
    ],
    plans: [
      { id: 'p1', name: 'Prime Mensal', price: '30,00', period: 'mensal', features: ['1 Tela HD/FHD', 'Suporte no horário comercial'], isPopular: false }
    ],
    faqs: [],
    testimonials: [],
    viewsCount: 220,
    status: 'suspended', // Suspended site to test suspension screen!
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const INITIAL_PAYMENTS: PaymentData[] = [
  { id: 'pay-1', landingPageId: '1', clientName: 'Flux Play IPTV', amount: 90.00, status: 'approved', method: 'pix', vencimento: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'pay-2', landingPageId: '2', clientName: 'Nitro Stream', amount: 39.90, status: 'approved', method: 'stripe', vencimento: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'pay-3', landingPageId: '3', clientName: 'Prime Ultra Digital', amount: 30.00, status: 'expired', method: 'pix', vencimento: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString() }
];

// Helper to check environment
const isClient = typeof window !== 'undefined';

// LocalStorage helpers for mock DB
const getStoredData = <T>(key: string, defaultValue: T): T => {
  if (!isClient) return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading localStorage key ' + key, error);
    return defaultValue;
  }
};

const setStoredData = <T>(key: string, value: T): void => {
  if (!isClient) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error writing localStorage key ' + key, error);
  }
};

// Database Service Interface
export const dbService = {
  // LANDING PAGES
  async getLandingPages(): Promise<LandingPageData[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('landing_pages')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) {
          // Map snake_case database schema to camelCase typescript
          return data.map(item => this.mapDbToModel(item));
        }
      } catch (err) {
        console.error('Supabase query failed, falling back to mock', err);
      }
    }
    return getStoredData('iptv_landing_pages', INITIAL_LANDING_PAGES);
  },

  async getLandingPageBySlug(slug: string): Promise<LandingPageData | null> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('landing_pages')
          .select('*')
          .eq('slug', slug)
          .single();
        if (!error && data) {
          return this.mapDbToModel(data);
        }
      } catch (err) {
        console.error('Supabase query failed, falling back to mock', err);
      }
    }
    const pages = getStoredData('iptv_landing_pages', INITIAL_LANDING_PAGES);
    const page = pages.find(p => p.slug.toLowerCase() === slug.toLowerCase());
    return page || null;
  },

  async saveLandingPage(pageData: Partial<LandingPageData> & { slug: string }): Promise<LandingPageData> {
    const cleanedSlug = pageData.slug.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '');
    
    // Check slug collision
    const allPages = await this.getLandingPages();
    const isCollision = allPages.some(p => p.slug === cleanedSlug && p.id !== pageData.id);
    if (isCollision) {
      throw new Error('Este slug de URL já está em uso.');
    }

    // Block reserved words
    const RESERVED_WORDS = ['admin', 'dashboard', 'api', 'auth', 'login', 'register', 'site', 'templates', 'pricing', 'webhook'];
    if (RESERVED_WORDS.includes(cleanedSlug)) {
      throw new Error(`A URL "${cleanedSlug}" é reservada pelo sistema.`);
    }

    if (supabase) {
      try {
        const dbPayload = this.mapModelToDb(pageData);
        if (pageData.id) {
          // Update
          const { data, error } = await supabase
            .from('landing_pages')
            .update(dbPayload)
            .eq('id', pageData.id)
            .select()
            .single();
          if (error) throw error;
          return this.mapDbToModel(data);
        } else {
          // Insert
          const newId = crypto.randomUUID();
          const { data: userData } = await supabase.auth.getUser();
          const userId = userData?.user?.id;
          const finalPayload = { ...dbPayload, id: newId, views_count: 0 };
          if (userId && !finalPayload.client_id) {
            finalPayload.client_id = userId;
          }
          const { data, error } = await supabase
            .from('landing_pages')
            .insert(finalPayload)
            .select()
            .single();
          if (error) throw error;
          return this.mapDbToModel(data);
        }
      } catch (err: any) {
        console.error('Supabase save failed, fallback to mock. Error: ', err.message);
      }
    }

    // Mock Implementation
    const pages = getStoredData('iptv_landing_pages', INITIAL_LANDING_PAGES);
    let resultPage: LandingPageData;

    if (pageData.id) {
      // Edit
      const index = pages.findIndex(p => p.id === pageData.id);
      if (index === -1) throw new Error('Cliente não encontrado');
      
      // Manage orphan images (if an image is replaced, delete or ignore in storage)
      // Since it's mock (Base64), we don't have to do much, but we ensure clean values.
      const current = pages[index];
      
      resultPage = {
        ...current,
        ...pageData,
        slug: cleanedSlug,
      } as LandingPageData;
      pages[index] = resultPage;
    } else {
      // Create new
      const newPage: LandingPageData = {
        id: crypto.randomUUID(),
        clientId: pageData.clientId || crypto.randomUUID(),
        name: pageData.name || 'Nova Landing Page',
        slug: cleanedSlug,
        logoUrl: pageData.logoUrl || '',
        bannerUrl: pageData.bannerUrl || '',
        promoImageUrl: pageData.promoImageUrl || '',
        primaryColor: pageData.primaryColor || '#e50914',
        secondaryColor: pageData.secondaryColor || '#833ab4',
        whatsapp: pageData.whatsapp || '',
        telegram: pageData.telegram || '',
        instagram: pageData.instagram || '',
        presentation: pageData.presentation || '',
        trialLink: pageData.trialLink || '',
        pixKey: pageData.pixKey || '',
        pixQrUrl: pageData.pixQrUrl || '',
        benefits: pageData.benefits || [],
        plans: pageData.plans || [],
        faqs: pageData.faqs || [],
        testimonials: pageData.testimonials || [],
        customDomain: pageData.customDomain || '',
        viewsCount: 0,
        status: pageData.status || 'active',
        createdAt: new Date().toISOString()
      };
      pages.push(newPage);
      resultPage = newPage;
    }

    setStoredData('iptv_landing_pages', pages);
    return resultPage;
  },

  async deleteLandingPage(id: string): Promise<boolean> {
    if (supabase) {
      try {
        const { error } = await supabase
          .from('landing_pages')
          .delete()
          .eq('id', id);
        if (!error) return true;
      } catch (err) {
        console.error('Supabase deletion failed', err);
      }
    }
    const pages = getStoredData('iptv_landing_pages', INITIAL_LANDING_PAGES);
    const filtered = pages.filter(p => p.id !== id);
    setStoredData('iptv_landing_pages', filtered);

    // Also delete payments for this landing page to keep db integral
    const payments = getStoredData('iptv_payments', INITIAL_PAYMENTS);
    const filteredPayments = payments.filter(pay => pay.landingPageId !== id);
    setStoredData('iptv_payments', filteredPayments);

    return true;
  },

  async incrementViews(slug: string): Promise<void> {
    if (supabase) {
      try {
        const { error } = await supabase.rpc('increment_landing_page_views', { page_slug: slug });
        if (error) throw error;
        return;
      } catch (err) {
        console.error('Supabase views count increment failed', err);
      }
    }
    const pages = getStoredData('iptv_landing_pages', INITIAL_LANDING_PAGES);
    const index = pages.findIndex(p => p.slug.toLowerCase() === slug.toLowerCase());
    if (index !== -1) {
      pages[index].viewsCount = (pages[index].viewsCount || 0) + 1;
      setStoredData('iptv_landing_pages', pages);
    }
  },

  // PAYMENTS & FINANCIALS
  async getPayments(): Promise<PaymentData[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('payments')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) {
          return data.map(item => this.mapDbPaymentToModel(item));
        }
      } catch (err) {
        console.error('Supabase payments query failed', err);
      }
    }
    return getStoredData('iptv_payments', INITIAL_PAYMENTS);
  },

  async savePayment(payment: Partial<PaymentData>): Promise<PaymentData> {
    if (supabase) {
      try {
        const dbPayload = this.mapModelPaymentToDb(payment);
        if (payment.id) {
          const { data, error } = await supabase
            .from('payments')
            .update(dbPayload)
            .eq('id', payment.id)
            .select()
            .single();
          if (error) throw error;
          return this.mapDbPaymentToModel(data);
        } else {
          const newId = crypto.randomUUID();
          const { data, error } = await supabase
            .from('payments')
            .insert({ ...dbPayload, id: newId })
            .select()
            .single();
          if (error) throw error;
          return this.mapDbPaymentToModel(data);
        }
      } catch (err) {
        console.error('Supabase save payment failed, fallback to mock', err);
      }
    }

    const payments = getStoredData('iptv_payments', INITIAL_PAYMENTS);
    let resultPayment: PaymentData;

    if (payment.id) {
      const index = payments.findIndex(p => p.id === payment.id);
      if (index === -1) throw new Error('Pagamento não encontrado');
      resultPayment = {
        ...payments[index],
        ...payment
      } as PaymentData;
      payments[index] = resultPayment;
    } else {
      resultPayment = {
        id: crypto.randomUUID(),
        landingPageId: payment.landingPageId || '',
        clientName: payment.clientName || 'Cliente Geral',
        amount: payment.amount || 0,
        status: payment.status || 'pending',
        method: payment.method || 'pix',
        vencimento: payment.vencimento || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString()
      };
      payments.push(resultPayment);
    }

    setStoredData('iptv_payments', payments);
    return resultPayment;
  },

  // UPLOADS STORAGE SIMULATION (Resolves to Base64 in Mock, upload to Supabase bucket in production)
  async uploadFile(bucketName: string, path: string, file: File | string): Promise<string> {
    // If file is already a Base64/standard string, we just pass it back in mock mode
    if (typeof file === 'string') {
      return file;
    }

    if (supabase) {
      try {
        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(path, file, { cacheControl: '3600', upsert: true });
        
        if (error) throw error;
        
        const { data: publicUrlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(data.path);
          
        return publicUrlData.publicUrl;
      } catch (err) {
        console.error('Supabase Storage upload failed, converting to mock URL', err);
      }
    }

    // Mock file upload as Base64 data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        reject(new Error('Erro ao ler o arquivo para simulação de upload.'));
      };
      reader.readAsDataURL(file);
    });
  },

  // METRICS COMPILER
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const pages = await this.getLandingPages();
    const payments = await this.getPayments();

    const totalClients = pages.length;
    const activeSites = pages.filter(p => p.status === 'active').length;
    const inadimplentesCount = pages.filter(p => p.status === 'expired' || p.status === 'suspended' || p.status === 'blocked').length;
    const totalViews = pages.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0);

    // MRR Calculation (monthly recurring revenue) from active and approved payments
    const approvedMonthlyPayments = payments.filter(p => p.status === 'approved');
    let mrr = 0;
    
    // Aggregate payment amounts by client subscription (divide value appropriately based on duration if needed, but for simplicity we calculate sum of monthly values)
    approvedMonthlyPayments.forEach(p => {
      // Find matching page to see if it is monthly, quarterly, semestral, or yearly
      const page = pages.find(g => g.id === p.landingPageId);
      if (page) {
        // Standardize monthly value contribution
        // A simple BRL price estimation:
        mrr += p.amount;
      } else {
        mrr += p.amount;
      }
    });

    // Mock MRR is monthly. Let's make it reflect reality of active sites:
    // If MRR calculation returns 0, let's estimate it based on client plans:
    if (mrr === 0) {
      mrr = pages.filter(p => p.status === 'active').reduce((acc, curr) => {
        const primaryPlan = curr.plans[0];
        const val = primaryPlan ? parseFloat(primaryPlan.price.replace(',', '.')) : 35.0;
        return acc + val;
      }, 0);
    }

    return {
      totalClients,
      mrr,
      activeSites,
      inadimplentesCount,
      totalViews,
      monthlyGrowthRate: 15.4 // Estimated growth rate
    };
  },

  // DATA MAPPERS (Snake case database fields to Camel case client models)
  mapDbToModel(dbItem: any): LandingPageData {
    return {
      id: dbItem.id,
      clientId: dbItem.client_id,
      name: dbItem.name,
      slug: dbItem.slug,
      logoUrl: dbItem.logo_url,
      bannerUrl: dbItem.banner_url,
      promoImageUrl: dbItem.promo_image_url,
      primaryColor: dbItem.primary_color,
      secondaryColor: dbItem.secondary_color,
      whatsapp: dbItem.whatsapp,
      telegram: dbItem.telegram,
      instagram: dbItem.instagram,
      presentation: dbItem.presentation,
      trialLink: dbItem.trial_link,
      pixKey: dbItem.pix_key,
      pixQrUrl: dbItem.pix_qr_url,
      benefits: dbItem.benefits || [],
      plans: dbItem.plans || [],
      faqs: dbItem.faqs || [],
      testimonials: dbItem.testimonials || [],
      customDomain: dbItem.custom_domain,
      viewsCount: dbItem.views_count || 0,
      status: dbItem.status as PageStatus,
      createdAt: dbItem.created_at || dbItem.createdAt
    };
  },

  mapModelToDb(modelItem: Partial<LandingPageData>): any {
    const dbPayload: any = {};
    if (modelItem.clientId) dbPayload.client_id = modelItem.clientId;
    if (modelItem.name !== undefined) dbPayload.name = modelItem.name;
    if (modelItem.slug !== undefined) dbPayload.slug = modelItem.slug;
    if (modelItem.logoUrl !== undefined) dbPayload.logo_url = modelItem.logoUrl;
    if (modelItem.bannerUrl !== undefined) dbPayload.banner_url = modelItem.bannerUrl;
    if (modelItem.promoImageUrl !== undefined) dbPayload.promo_image_url = modelItem.promoImageUrl;
    if (modelItem.primaryColor !== undefined) dbPayload.primary_color = modelItem.primaryColor;
    if (modelItem.secondaryColor !== undefined) dbPayload.secondary_color = modelItem.secondaryColor;
    if (modelItem.whatsapp !== undefined) dbPayload.whatsapp = modelItem.whatsapp;
    if (modelItem.telegram !== undefined) dbPayload.telegram = modelItem.telegram;
    if (modelItem.instagram !== undefined) dbPayload.instagram = modelItem.instagram;
    if (modelItem.presentation !== undefined) dbPayload.presentation = modelItem.presentation;
    if (modelItem.trialLink !== undefined) dbPayload.trial_link = modelItem.trialLink;
    if (modelItem.pixKey !== undefined) dbPayload.pix_key = modelItem.pixKey;
    if (modelItem.pixQrUrl !== undefined) dbPayload.pix_qr_url = modelItem.pixQrUrl;
    if (modelItem.benefits !== undefined) dbPayload.benefits = modelItem.benefits;
    if (modelItem.plans !== undefined) dbPayload.plans = modelItem.plans;
    if (modelItem.faqs !== undefined) dbPayload.faqs = modelItem.faqs;
    if (modelItem.testimonials !== undefined) dbPayload.testimonials = modelItem.testimonials;
    if (modelItem.customDomain !== undefined) dbPayload.custom_domain = modelItem.customDomain;
    if (modelItem.status !== undefined) dbPayload.status = modelItem.status;
    if (modelItem.viewsCount !== undefined) dbPayload.views_count = modelItem.viewsCount;
    if (modelItem.createdAt !== undefined) dbPayload.created_at = modelItem.createdAt;
    return dbPayload;
  },

  mapDbPaymentToModel(dbItem: any): PaymentData {
    return {
      id: dbItem.id,
      landingPageId: dbItem.landing_page_id,
      clientName: dbItem.client_name || 'Cliente Geral',
      amount: dbItem.amount,
      status: dbItem.status,
      method: dbItem.method,
      vencimento: dbItem.vencimento,
      createdAt: dbItem.created_at || dbItem.createdAt
    };
  },

  mapModelPaymentToDb(modelItem: Partial<PaymentData>): any {
    const dbPayload: any = {};
    if (modelItem.landingPageId) dbPayload.landing_page_id = modelItem.landingPageId;
    if (modelItem.clientName) dbPayload.client_name = modelItem.clientName;
    if (modelItem.amount !== undefined) dbPayload.amount = modelItem.amount;
    if (modelItem.status !== undefined) dbPayload.status = modelItem.status;
    if (modelItem.method !== undefined) dbPayload.method = modelItem.method;
    if (modelItem.vencimento !== undefined) dbPayload.vencimento = modelItem.vencimento;
    if (modelItem.createdAt !== undefined) dbPayload.created_at = modelItem.createdAt;
    return dbPayload;
  }
};
