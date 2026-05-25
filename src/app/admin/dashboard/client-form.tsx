'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  X, 
  Upload, 
  Plus, 
  Trash2, 
  Palette, 
  Settings, 
  Globe, 
  HelpCircle, 
  Users, 
  CheckCircle2, 
  Sparkles,
  Tv,
  Link as LinkIcon,
  Star,
  MessageSquare,
  ImagePlus
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Select } from '../../../components/ui/Select';
import { dbService } from '../../../services/db';
import { LandingPageData, ClientPlan, BenefitItem, FAQItem, TestimonialItem, PageStatus, MovieItem, PaymentData } from '../../../types';

// Zod schema for client landing page builder form
const clientFormSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  slug: z.string().min(2, 'O slug da URL deve ter pelo menos 2 caracteres.')
    .regex(/^[a-z0-9-_]+$/, 'O slug só pode conter letras minúsculas, números, hifens e underlines.'),
  whatsapp: z.string().min(10, 'Insira o WhatsApp com DDD (apenas números).'),
  telegram: z.string().optional(),
  instagram: z.string().optional(),
  presentation: z.string().min(10, 'Insira uma apresentação atraente.'),
  trialLink: z.string().optional(),
  pixKey: z.string().optional(),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Cor inválida.'),
  secondaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Cor inválida.'),
  customDomain: z.string().optional(),
  status: z.enum(['active', 'pending', 'suspended', 'blocked', 'expired']),
  showMoviesCatalog: z.boolean().optional(),
  // Add payment/billing fields
  billingAmount: z.union([z.string(), z.number()]).optional(),
  billingStatus: z.enum(['approved', 'pending', 'expired']).optional(),
  billingDueDate: z.string().optional(),
  billingMethod: z.enum(['pix', 'stripe', 'card', 'mercado_pago']).optional(),
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

interface ClientFormProps {
  clientToEdit?: LandingPageData | null;
  paymentToEdit?: PaymentData | null;
  onClose: () => void;
  onSuccess: (updatedClient: LandingPageData) => void;
}

export default function ClientForm({ clientToEdit, paymentToEdit, onClose, onSuccess }: ClientFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // File Upload State
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [bannerPreview, setBannerPreview] = useState<string>('');
  const [promoPreview, setPromoPreview] = useState<string>('');

  // Dynamic Lists State
  const [plans, setPlans] = useState<ClientPlan[]>([]);
  const [benefits, setBenefits] = useState<BenefitItem[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [featuredMovies, setFeaturedMovies] = useState<MovieItem[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: '',
      slug: '',
      whatsapp: '',
      telegram: '',
      instagram: '',
      presentation: '',
      trialLink: '',
      pixKey: '',
      primaryColor: '#e50914',
      secondaryColor: '#833ab4',
      customDomain: '',
      status: 'active',
      showMoviesCatalog: true,
      billingAmount: 35,
      billingStatus: 'pending',
      billingDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      billingMethod: 'pix',
    },
  });

  const slugWatch = watch('slug');
  const primaryColorWatch = watch('primaryColor');
  const secondaryColorWatch = watch('secondaryColor');

  const sanitizeHexColor = (color: string | undefined, fallback: string = '#000000') => {
    if (!color) return fallback;
    const hexPattern = /^#[0-9A-F]{6}$/i;
    return hexPattern.test(color) ? color : fallback;
  };

  // Load editing client data if provided
  useEffect(() => {
    if (clientToEdit) {
      setValue('name', clientToEdit.name);
      setValue('slug', clientToEdit.slug);
      setValue('whatsapp', clientToEdit.whatsapp);
      setValue('telegram', clientToEdit.telegram || '');
      setValue('instagram', clientToEdit.instagram || '');
      setValue('presentation', clientToEdit.presentation);
      setValue('trialLink', clientToEdit.trialLink || '');
      setValue('pixKey', clientToEdit.pixKey || '');
      setValue('primaryColor', clientToEdit.primaryColor);
      setValue('secondaryColor', clientToEdit.secondaryColor);
      setValue('customDomain', clientToEdit.customDomain || '');
      setValue('status', clientToEdit.status);
      setValue('showMoviesCatalog', clientToEdit.showMoviesCatalog !== undefined ? clientToEdit.showMoviesCatalog : true);

      // Previews
      setLogoPreview(clientToEdit.logoUrl || '');
      setBannerPreview(clientToEdit.bannerUrl || '');
      setPromoPreview(clientToEdit.promoImageUrl || '');

      // Sub-lists
      setPlans(clientToEdit.plans || []);
      setBenefits(clientToEdit.benefits || []);
      setFaqs(clientToEdit.faqs || []);
      setTestimonials(clientToEdit.testimonials || []);
      setFeaturedMovies(clientToEdit.featuredMovies || []);

      // Load payment values
      if (paymentToEdit) {
        setValue('billingAmount', paymentToEdit.amount);
        setValue('billingStatus', paymentToEdit.status);
        setValue('billingDueDate', paymentToEdit.vencimento ? paymentToEdit.vencimento.split('T')[0] : '');
        setValue('billingMethod', paymentToEdit.method);
      } else {
        setValue('billingAmount', 35);
        setValue('billingStatus', 'pending');
        setValue('billingDueDate', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
        setValue('billingMethod', 'pix');
      }
    } else {
      // Default lists for a new client to make page builder fast
      setValue('name', '');
      setValue('slug', '');
      setValue('whatsapp', '');
      setValue('telegram', '');
      setValue('instagram', '');
      setValue('presentation', '');
      setValue('trialLink', '');
      setValue('pixKey', '');
      setValue('primaryColor', '#e50914');
      setValue('secondaryColor', '#833ab4');
      setValue('customDomain', '');
      setValue('status', 'active');
      setValue('showMoviesCatalog', true);
      setValue('billingAmount', 35);
      setValue('billingStatus', 'pending');
      setValue('billingDueDate', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
      setValue('billingMethod', 'pix');

      setPlans([
        { id: 'p1', name: 'Plano Mensal', price: '35,00', period: 'mensal', features: ['1 Tela', 'Grade Completa', 'Suporte WhatsApp'] },
        { id: 'p2', name: 'Plano Trimestral', price: '90,00', period: 'trimestral', features: ['1 Tela', 'Grade Completa', 'Suporte Prioritário'], isPopular: true }
      ]);
      setBenefits([
        { id: 'b1', title: 'Canais em 4K', description: 'Assista seus esportes e filmes na melhor qualidade.', icon: 'Tv' },
        { id: 'b2', title: 'Sem Travamentos', description: 'Servidores rápidos e estáveis.', icon: 'Zap' }
      ]);
      setFaqs([
        { question: 'Como testar?', answer: 'Entre em contato pelo WhatsApp para liberação imediata do seu login.' }
      ]);
      setTestimonials([
        { id: 't1', name: 'Paulo Santos', comment: 'Serviço excelente, canais perfeitos e suporte ágil.', rating: 5, role: 'Cliente' }
      ]);
      setFeaturedMovies([
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
        }
      ]);
    }
  }, [clientToEdit, paymentToEdit, setValue]);

  // Dynamic Slug auto-generation from Name (only for new client creation)
  const nameWatch = watch('name');
  useEffect(() => {
    if (!clientToEdit && nameWatch) {
      const generatedSlug = nameWatch
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // remove special chars
        .replace(/[\s_]+/g, '-') // replace space/underscore with hyphen
        .replace(/^-+|-+$/g, ''); // trim hyphens
      setValue('slug', generatedSlug);
    }
  }, [nameWatch, clientToEdit, setValue]);

  // Image Upload Handle
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner' | 'promo') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('A imagem excede o limite de 2MB. Por favor, otimize a imagem.');
      return;
    }

    try {
      const uploadPath = `uploads/${Date.now()}_${file.name}`;
      const fileUrl = await dbService.uploadFile('iptv-assets', uploadPath, file);
      
      if (type === 'logo') setLogoPreview(fileUrl);
      if (type === 'banner') setBannerPreview(fileUrl);
      if (type === 'promo') setPromoPreview(fileUrl);
    } catch (err) {
      console.error('Upload error', err);
      alert('Erro ao fazer upload da imagem.');
    }
  };

  // Plan Management Helpers
  const addPlan = () => {
    const newPlan: ClientPlan = {
      id: crypto.randomUUID(),
      name: 'Novo Plano',
      price: '30,00',
      period: 'mensal',
      features: ['Acesso completo', 'Suporte WhatsApp'],
      isPopular: false
    };
    setPlans([...plans, newPlan]);
  };

  const updatePlan = (id: string, field: keyof ClientPlan, value: any) => {
    setPlans(plans.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const removePlan = (id: string) => {
    setPlans(plans.filter(p => p.id !== id));
  };

  // Features inside Plan Helpers
  const addFeatureToPlan = (planId: string) => {
    setPlans(plans.map(p => {
      if (p.id === planId) {
        return { ...p, features: [...p.features, 'Novo recurso'] };
      }
      return p;
    }));
  };

  const updateFeatureInPlan = (planId: string, featureIndex: number, value: string) => {
    setPlans(plans.map(p => {
      if (p.id === planId) {
        const updatedFeatures = [...p.features];
        updatedFeatures[featureIndex] = value;
        return { ...p, features: updatedFeatures };
      }
      return p;
    }));
  };

  const removeFeatureFromPlan = (planId: string, featureIndex: number) => {
    setPlans(plans.map(p => {
      if (p.id === planId) {
        return { ...p, features: p.features.filter((_, idx) => idx !== featureIndex) };
      }
      return p;
    }));
  };

  // Benefits Helpers
  const addBenefit = () => {
    const newBenefit: BenefitItem = {
      id: crypto.randomUUID(),
      title: 'Novo Benefício',
      description: 'Descrição rápida do benefício.',
      icon: 'Tv'
    };
    setBenefits([...benefits, newBenefit]);
  };

  const updateBenefit = (id: string, field: keyof BenefitItem, value: string) => {
    setBenefits(benefits.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const removeBenefit = (id: string) => {
    setBenefits(benefits.filter(b => b.id !== id));
  };

  // FAQ Helpers
  const addFaq = () => {
    setFaqs([...faqs, { question: 'Nova pergunta?', answer: 'Resposta aqui.' }]);
  };

  const updateFaq = (index: number, field: keyof FAQItem, value: string) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: value };
    setFaqs(updated);
  };

  const removeFaq = (index: number) => {
    setFaqs(faqs.filter((_, idx) => idx !== index));
  };

  // Testimonial Helpers
  const addTestimonial = () => {
    const newTestimonial: TestimonialItem = {
      id: crypto.randomUUID(),
      name: 'Nome do Cliente',
      comment: 'Depoimento estilizado do cliente sobre a estabilidade do servidor.',
      rating: 5,
      role: 'Cliente satisfeito'
    };
    setTestimonials([...testimonials, newTestimonial]);
  };

  const updateTestimonial = (id: string, field: keyof TestimonialItem, value: any) => {
    setTestimonials(testimonials.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const removeTestimonial = (id: string) => {
    setTestimonials(testimonials.filter(t => t.id !== id));
  };

  // Testimonial Screenshot Upload
  const handleTestimonialScreenshot = async (e: React.ChangeEvent<HTMLInputElement>, testimonialId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('A imagem excede o limite de 2MB.');
      return;
    }

    try {
      const uploadPath = `testimonials/${Date.now()}_${file.name}`;
      const fileUrl = await dbService.uploadFile('iptv-assets', uploadPath, file);
      updateTestimonial(testimonialId, 'screenshotUrl', fileUrl);
    } catch (err) {
      console.error('Upload error', err);
      alert('Erro ao fazer upload do print.');
    }
  };

  // Featured Movies Helpers
  const addFeaturedMovie = () => {
    const newMovie: MovieItem = {
      title: 'Novo Filme',
      genre: 'Ação / Aventura',
      year: new Date().getFullYear().toString(),
      rating: '4.8',
      badge: 'Lançamento',
      quality: '4K Ultra HD',
      image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&q=80'
    };
    setFeaturedMovies([...featuredMovies, newMovie]);
  };

  const updateFeaturedMovie = (index: number, field: keyof MovieItem, value: string) => {
    const updated = [...featuredMovies];
    updated[index] = { ...updated[index], [field]: value };
    setFeaturedMovies(updated);
  };

  const removeFeaturedMovie = (index: number) => {
    setFeaturedMovies(featuredMovies.filter((_, idx) => idx !== index));
  };

  // Submit Handler
  const onSubmit = async (values: ClientFormValues) => {
    setLoading(true);
    setError(null);
    try {
      const { billingAmount, billingStatus, billingDueDate, billingMethod, ...landingPageValues } = values;

      const payload: Partial<LandingPageData> = {
        ...clientToEdit,
        ...landingPageValues,
        logoUrl: logoPreview,
        bannerUrl: bannerPreview,
        promoImageUrl: promoPreview,
        plans,
        benefits,
        faqs,
        testimonials,
        featuredMovies,
      };

      const result = await dbService.saveLandingPage(payload as any);

      // Save or update payment details
      await dbService.savePayment({
        id: paymentToEdit?.id,
        landingPageId: result.id,
        clientName: result.name,
        amount: Number(billingAmount) || 0,
        status: billingStatus || 'pending',
        method: billingMethod || 'pix',
        vencimento: billingDueDate ? new Date(billingDueDate + 'T12:00:00').toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });

      onSuccess(result);
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar os dados da landing page.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-dark-surface border-l border-dark-border text-foreground">
      {/* Form Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-dark-border bg-dark-bg/60">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Tv className="w-5 h-5 text-c6-gold animate-pulse" />
            <span className="tracking-tight">{clientToEdit ? 'Editar Landing Page' : 'Criar Landing Page'}</span>
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Configuração white-label dinâmica e responsiva do cliente.
          </p>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 rounded-[6px] bg-dark-border/45 hover:bg-dark-border text-slate-400 hover:text-c6-gold transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
 
      {/* Form Scroll Area */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto px-6 py-6 space-y-8 pb-20">
        {error && (
          <div className="flex items-center space-x-2 rounded-[6px] border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-500">
            <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}
 
        {/* SECTION 1: DADOS BÁSICOS */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-c6-gold uppercase tracking-widest border-b border-c6-gold/20 pb-2 flex items-center">
            <span className="w-1.5 h-1.5 bg-c6-gold mr-2" />
            1. Dados do Cliente
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              {...register('name')}
              label="Nome do Painel / IPTV"
              placeholder="ex: Flux IPTV, Elite Stream"
              error={errors.name?.message}
              disabled={loading}
            />
            <Input
              {...register('slug')}
              label="URL Personalizada (Slug)"
              placeholder="ex: flux-iptv"
              error={errors.slug?.message}
              disabled={loading}
            />
          </div>
          <div className="space-y-1 mt-1">
            <div className="text-xs text-slate-500 font-mono flex items-center space-x-1">
              <span className="text-c6-gold font-semibold">★</span>
              <span>Subdomínio:</span>
              <span className="text-c6-gold font-medium">{slugWatch || '...'}.seudominio.com</span>
            </div>
            <div className="text-xs text-slate-500 font-mono flex items-center space-x-1">
              <span className="text-slate-600">↳</span>
              <span>Alternativo:</span>
              <span className="text-slate-400">seudominio.com/site/{slugWatch || '...'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              {...register('whatsapp')}
              label="WhatsApp (com DDI + DDD)"
              placeholder="ex: 5511999999999"
              error={errors.whatsapp?.message}
              disabled={loading}
            />
            <Input
              {...register('telegram')}
              label="Telegram (Usuário sem @)"
              placeholder="ex: elite_support"
              error={errors.telegram?.message}
              disabled={loading}
            />
            <Input
              {...register('instagram')}
              label="Instagram (Usuário sem @)"
              placeholder="ex: elite.iptv"
              error={errors.instagram?.message}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              {...register('trialLink')}
              label="Link Direto de Teste Grátis (Opcional)"
              placeholder="ex: https://wa.me/... ou link externo"
              error={errors.trialLink?.message}
              disabled={loading}
            />
            <Input
              {...register('customDomain')}
              label="Domínio Próprio (Opcional)"
              placeholder="ex: eliteiptv.com"
              error={errors.customDomain?.message}
              disabled={loading}
            />
          </div>

          <Textarea
            {...register('presentation')}
            label="Texto de Apresentação (Hero Copy)"
            placeholder="A melhor experiência de entretenimento..."
            error={errors.presentation?.message}
            disabled={loading}
            rows={4}
          />

          <div className="flex items-center space-x-3 p-3 bg-black/20 border border-dark-border/30 rounded-[6px]">
            <input
              type="checkbox"
              id="showMoviesCatalog"
              {...register('showMoviesCatalog')}
              className="w-4 h-4 rounded-[3px] border-dark-border/40 bg-dark-bg text-c6-gold focus:ring-c6-gold cursor-pointer"
            />
            <label htmlFor="showMoviesCatalog" className="text-sm font-semibold text-slate-200 cursor-pointer">
              Exibir Catálogo de Filmes Novos (Novidades)
            </label>
          </div>
        </div>

        {/* SECTION: STATUS E FINANCEIRO */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-c6-gold uppercase tracking-widest border-b border-c6-gold/20 pb-2 flex items-center">
            <span className="w-1.5 h-1.5 bg-c6-gold mr-2" />
            1.1. Status & Informações Financeiras
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              {...register('status')}
              label="Status da Landing Page"
              error={errors.status?.message}
              options={[
                { value: 'active', label: 'Ativo (Publicado)' },
                { value: 'pending', label: 'Pendente (Aguardando Configuração)' },
                { value: 'suspended', label: 'Suspenso (Inativo)' },
                { value: 'blocked', label: 'Bloqueado (Bloqueio Admin)' },
                { value: 'expired', label: 'Expirado (Vencido)' },
              ]}
              disabled={loading}
            />

            <Select
              {...register('billingStatus')}
              label="Status de Pagamento (Mensalidade)"
              error={errors.billingStatus?.message}
              options={[
                { value: 'approved', label: 'Pago (Confirmado)' },
                { value: 'pending', label: 'Pendente (Aguardando)' },
                { value: 'expired', label: 'Atrasado / Vencido' },
              ]}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              {...register('billingAmount')}
              type="number"
              step="0.01"
              label="Valor da Cobrança (R$)"
              placeholder="Ex: 35.00"
              error={errors.billingAmount?.message}
              disabled={loading}
            />

            <div>
              <label className="text-sm font-medium text-slate-300 mb-1.5 block">
                Data de Vencimento
              </label>
              <input
                type="date"
                {...register('billingDueDate')}
                className="flex h-11 w-full rounded-[6px] border border-dark-border bg-dark-bg/60 px-4 py-2 text-sm text-foreground focus:outline-none focus:border-c6-gold focus:shadow-[0_0_0_1px_rgba(212,157,43,0.15)] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer text-white"
                disabled={loading}
              />
            </div>

            <Select
              {...register('billingMethod')}
              label="Meio de Cobrança"
              error={errors.billingMethod?.message}
              options={[
                { value: 'pix', label: 'PIX' },
                { value: 'stripe', label: 'Stripe' },
                { value: 'card', label: 'Cartão de Crédito' },
                { value: 'mercado_pago', label: 'Mercado Pago' },
              ]}
              disabled={loading}
            />
          </div>
        </div>

        {/* SECTION 2: IDENTIDADE VISUAL */}
        <div className="space-y-5">
          <h3 className="text-xs font-bold text-c6-gold uppercase tracking-widest border-b border-c6-gold/20 pb-2 flex items-center">
            <span className="w-1.5 h-1.5 bg-c6-gold mr-2" />
            2. Identidade Visual e Imagens
          </h3>
 
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-300 flex items-center mb-1">
                <Palette className="w-4 h-4 mr-2 text-white" />
                Cor Primária
              </label>
              <div className="flex space-x-2">
                <input
                  type="color"
                  value={sanitizeHexColor(primaryColorWatch, '#e50914')}
                  onChange={(e) => setValue('primaryColor', e.target.value, { shouldDirty: true, shouldValidate: true })}
                  className="w-11 h-11 rounded-[6px] border border-dark-border/40 cursor-pointer bg-transparent"
                />
                <Input
                  {...register('primaryColor')}
                  placeholder="#ffffff"
                  error={errors.primaryColor?.message}
                  disabled={loading}
                />
              </div>
            </div>
 
            <div>
              <label className="text-sm font-medium text-slate-300 flex items-center mb-1">
                <Palette className="w-4 h-4 mr-2 text-white" />
                Cor Secundária
              </label>
              <div className="flex space-x-2">
                <input
                  type="color"
                  value={sanitizeHexColor(secondaryColorWatch, '#833ab4')}
                  onChange={(e) => setValue('secondaryColor', e.target.value, { shouldDirty: true, shouldValidate: true })}
                  className="w-11 h-11 rounded-[6px] border border-dark-border/40 cursor-pointer bg-transparent"
                />
                <Input
                  {...register('secondaryColor')}
                  placeholder="#ffffff"
                  error={errors.secondaryColor?.message}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Uploads Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Logo Upload */}
            <div className="flex flex-col items-center p-4 border border-dashed border-dark-border/30 rounded-[6px] bg-black/20">
              <span className="text-xs font-semibold text-slate-300 mb-3">Logo do Cliente</span>
              {logoPreview ? (
                <div className="relative w-20 h-20 rounded-[6px] bg-slate-900 border border-dark-border/30 flex items-center justify-center overflow-hidden mb-3">
                  <img src={logoPreview} alt="Logo" className="max-w-full max-h-full object-contain" />
                  <button
                    type="button"
                    onClick={() => setLogoPreview('')}
                    className="absolute top-1 right-1 p-0.5 rounded-[4px] bg-red-600 text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-[6px] border border-dark-border/30 flex flex-col items-center justify-center bg-dark-bg/60 text-slate-500 mb-3">
                  <Upload className="w-6 h-6 mb-1" />
                  <span className="text-[10px]">Sem Logo</span>
                </div>
              )}
              <label className="px-3 py-1.5 rounded-[6px] bg-dark-border text-xs text-white hover:bg-dark-border/80 cursor-pointer font-medium">
                Escolher Arquivo
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'logo')}
                  className="hidden"
                />
              </label>
            </div>
 
            {/* Banner Upload */}
            <div className="flex flex-col items-center p-4 border border-dashed border-dark-border/30 rounded-[6px] bg-black/20">
              <span className="text-xs font-semibold text-slate-300 mb-3">Banner Principal (Fundo)</span>
              {bannerPreview ? (
                <div className="relative w-full aspect-video rounded-[6px] bg-slate-900 border border-dark-border/30 flex items-center justify-center overflow-hidden mb-3">
                  <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setBannerPreview('')}
                    className="absolute top-1 right-1 p-0.5 rounded-[4px] bg-red-600 text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="w-full aspect-video rounded-[6px] border border-dark-border/30 flex flex-col items-center justify-center bg-dark-bg/60 text-slate-500 mb-3">
                  <Upload className="w-6 h-6 mb-1" />
                  <span className="text-[10px]">Sem Banner</span>
                </div>
              )}
              <label className="px-3 py-1.5 rounded-[6px] bg-dark-border text-xs text-white hover:bg-dark-border/80 cursor-pointer font-medium">
                Escolher Arquivo
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'banner')}
                  className="hidden"
                />
              </label>
            </div>
 
            {/* Promo Upload */}
            <div className="flex flex-col items-center p-4 border border-dashed border-dark-border/30 rounded-[6px] bg-black/20">
              <span className="text-xs font-semibold text-slate-300 mb-3">Imagem Promocional (Dispositivos)</span>
              {promoPreview ? (
                <div className="relative w-full aspect-video rounded-[6px] bg-slate-900 border border-dark-border/30 flex items-center justify-center overflow-hidden mb-3">
                  <img src={promoPreview} alt="Promocional" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPromoPreview('')}
                    className="absolute top-1 right-1 p-0.5 rounded-[4px] bg-red-600 text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="w-full aspect-video rounded-[6px] border border-dark-border/30 flex flex-col items-center justify-center bg-dark-bg/60 text-slate-500 mb-3">
                  <Upload className="w-6 h-6 mb-1" />
                  <span className="text-[10px]">Sem Imagem</span>
                </div>
              )}
              <label className="px-3 py-1.5 rounded-[6px] bg-dark-border text-xs text-white hover:bg-dark-border/80 cursor-pointer font-medium">
                Escolher Arquivo
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'promo')}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
 
        {/* SECTION 3: PLANOS E VALORES */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-c6-gold/20 pb-2">
            <h3 className="text-xs font-bold text-c6-gold uppercase tracking-widest flex items-center">
              <span className="w-1.5 h-1.5 bg-c6-gold mr-2" />
              3. Tabela de Planos
            </h3>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={addPlan}
            >
              Adicionar Plano
            </Button>
          </div>
 
          <div className="space-y-4">
            {plans.map((plan, pIdx) => (
              <div key={plan.id} className="p-4 border border-dark-border/30 rounded-[6px] bg-black/30 relative shadow-sm">
                <button
                  type="button"
                  onClick={() => removePlan(plan.id)}
                  className="absolute top-4 right-4 p-1 text-slate-500 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
                  <div className="sm:col-span-2">
                    <Input
                      label="Nome do Plano"
                      value={plan.name}
                      onChange={(e) => updatePlan(plan.id, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Input
                      label="Preço (R$)"
                      value={plan.price}
                      onChange={(e) => updatePlan(plan.id, 'price', e.target.value)}
                    />
                  </div>
                  <div>
                    <Select
                      label="Período"
                      value={plan.period}
                      onChange={(e) => updatePlan(plan.id, 'period', e.target.value)}
                      options={[
                        { value: 'mensal', label: 'Mensal' },
                        { value: 'trimestral', label: 'Trimestral' },
                        { value: 'semestral', label: 'Semestral' },
                        { value: 'anual', label: 'Anual' }
                      ]}
                    />
                  </div>
                </div>

                {/* Features Inside Plan */}
                <div className="mt-4 border-t border-dark-border/45 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400">Recursos inclusos neste plano:</span>
                    <button
                      type="button"
                      onClick={() => addFeatureToPlan(plan.id)}
                      className="text-xs font-semibold text-white flex items-center hover:underline cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Adicionar Recurso
                    </button>
                  </div>
 
                  <div className="space-y-2">
                    {plan.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-center space-x-2">
                        <Input
                          placeholder="ex: Canais em Full HD"
                          value={feature}
                          onChange={(e) => updateFeatureInPlan(plan.id, fIdx, e.target.value)}
                          className="h-9"
                        />
                        <button
                          type="button"
                          onClick={() => removeFeatureFromPlan(plan.id, fIdx)}
                          className="text-slate-500 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
 
                <div className="mt-4 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`popular-${plan.id}`}
                    checked={plan.isPopular}
                    onChange={(e) => updatePlan(plan.id, 'isPopular', e.target.checked)}
                    className="rounded-[3px] border-dark-border bg-dark-bg/60 text-white focus:ring-white"
                  />
                  <label htmlFor={`popular-${plan.id}`} className="text-xs font-semibold text-slate-300 cursor-pointer">
                    Destacar como "Mais Popular" (Borda destacada e tag na landing page)
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: GESTÃO FINANCEIRA E STATUS DE ASSINATURA */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-c6-gold uppercase tracking-widest border-b border-c6-gold/20 pb-2 flex items-center">
            <span className="w-1.5 h-1.5 bg-c6-gold mr-2" />
            4. Informações de Pagamento & Cobrança (PIX)
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              {...register('pixKey')}
              label="Chave PIX (Para o checkout automático do cliente)"
              placeholder="ex: Celular, CNPJ, E-mail ou Aleatória"
              error={errors.pixKey?.message}
              disabled={loading}
            />
            <Select
              {...register('status')}
              label="Status da Assinatura"
              error={errors.status?.message}
              disabled={loading}
              options={[
                { value: 'active', label: 'Ativo (Publicado)' },
                { value: 'pending', label: 'Pendente (Aguardando liberação)' },
                { value: 'suspended', label: 'Suspenso (Plano vencido)' },
                { value: 'blocked', label: 'Bloqueado (Violação de regras)' },
                { value: 'expired', label: 'Expirado (Exibir tela de renovação)' }
              ]}
            />
          </div>
        </div>

        {/* SECTION 5: BENEFÍCIOS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-c6-gold/20 pb-2">
            <h3 className="text-xs font-bold text-c6-gold uppercase tracking-widest flex items-center">
              <span className="w-1.5 h-1.5 bg-c6-gold mr-2" />
              5. Grid de Benefícios
            </h3>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={addBenefit}
            >
              Adicionar Benefício
            </Button>
          </div>
 
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((b) => (
              <div key={b.id} className="p-4 border border-dark-border/30 rounded-[6px] bg-black/30 relative shadow-sm">
                <button
                  type="button"
                  onClick={() => removeBenefit(b.id)}
                  className="absolute top-2 right-2 p-1 text-slate-500 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
 
                <div className="space-y-3 flex flex-col">
                  <Select
                    label="Ícone Lucide"
                    value={b.icon}
                    onChange={(e) => updateBenefit(b.id, 'icon', e.target.value)}
                    options={[
                      { value: 'Tv', label: 'Televisão (Tv)' },
                      { value: 'Zap', label: 'Raio (Zap)' },
                      { value: 'Play', label: 'Player (Play)' },
                      { value: 'MessageSquare', label: 'Suporte (MessageSquare)' },
                      { value: 'Shield', label: 'Escudo (Shield)' },
                      { value: 'Globe', label: 'Internet (Globe)' },
                      { value: 'Smartphone', label: 'Celular (Smartphone)' }
                    ]}
                  />
                  <Input
                    label="Título"
                    value={b.title}
                    onChange={(e) => updateBenefit(b.id, 'title', e.target.value)}
                  />
                  <Textarea
                    label="Descrição"
                    value={b.description}
                    onChange={(e) => updateBenefit(b.id, 'description', e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 6: PERGUNTAS FREQUENTES */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-c6-gold/20 pb-2">
            <h3 className="text-xs font-bold text-c6-gold uppercase tracking-widest flex items-center">
              <span className="w-1.5 h-1.5 bg-c6-gold mr-2" />
              6. Perguntas Frequentes (FAQ)
            </h3>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={addFaq}
            >
              Adicionar FAQ
            </Button>
          </div>
 
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="p-4 border border-dark-border/30 rounded-[6px] bg-black/30 relative shadow-sm">
                <button
                  type="button"
                  onClick={() => removeFaq(index)}
                  className="absolute top-2 right-2 p-1 text-slate-500 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="space-y-3">
                  <Input
                    label={`Pergunta #${index + 1}`}
                    value={faq.question}
                    onChange={(e) => updateFaq(index, 'question', e.target.value)}
                  />
                  <Textarea
                    label="Resposta"
                    value={faq.answer}
                    onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 7: FILMES EM DESTAQUE */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-c6-gold/20 pb-2">
            <h3 className="text-xs font-bold text-c6-gold uppercase tracking-widest flex items-center">
              <span className="w-1.5 h-1.5 bg-c6-gold mr-2" />
              7. Filmes em Destaque (Catálogo de Novidades)
            </h3>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={addFeaturedMovie}
            >
              Adicionar Filme
            </Button>
          </div>

          <div className="space-y-4">
            {featuredMovies.map((movie, index) => (
              <div key={index} className="p-4 border border-dark-border/40 rounded-[6px] bg-black/30 relative">
                <button
                  type="button"
                  onClick={() => removeFeaturedMovie(index)}
                  className="absolute top-4 right-4 p-1 text-slate-500 hover:text-red-500 transition-colors cursor-pointer animate-pulse"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Poster Preview */}
                  <div className="flex flex-col items-center justify-center border border-dark-border/30 rounded-[6px] bg-zinc-950 p-2 h-full min-h-[160px]">
                    {movie.image ? (
                      <img 
                        src={movie.image} 
                        alt={movie.title} 
                        className="h-32 w-24 object-cover rounded-[6px] shadow-md mb-2"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&q=80';
                        }}
                      />
                    ) : (
                      <Tv className="w-8 h-8 text-slate-600 mb-2" />
                    )}
                    <span className="text-[10px] text-slate-500 font-medium">Prévia do Pôster</span>
                  </div>

                  {/* Fields Grid */}
                  <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Título do Filme"
                      value={movie.title}
                      onChange={(e) => updateFeaturedMovie(index, 'title', e.target.value)}
                    />
                    <Input
                      label="Gênero(s)"
                      value={movie.genre}
                      onChange={(e) => updateFeaturedMovie(index, 'genre', e.target.value)}
                    />
                    <Input
                      label="Ano"
                      value={movie.year}
                      onChange={(e) => updateFeaturedMovie(index, 'year', e.target.value)}
                    />
                    <Input
                      label="Avaliação / Nota (ex: 4.9)"
                      value={movie.rating}
                      onChange={(e) => updateFeaturedMovie(index, 'rating', e.target.value)}
                    />
                    <Input
                      label="Etiqueta / Badge (ex: Lançamento, Em Alta)"
                      value={movie.badge}
                      onChange={(e) => updateFeaturedMovie(index, 'badge', e.target.value)}
                    />
                    <Input
                      label="Qualidade (ex: 4K Ultra HD)"
                      value={movie.quality}
                      onChange={(e) => updateFeaturedMovie(index, 'quality', e.target.value)}
                    />
                    <div className="sm:col-span-2">
                      <Input
                        label="URL do Pôster do Filme"
                        value={movie.image}
                        onChange={(e) => updateFeaturedMovie(index, 'image', e.target.value)}
                        placeholder="https://images.unsplash.com/... ou link de imagem"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {featuredMovies.length === 0 && (
              <div className="text-center py-6 text-sm text-slate-500 border border-dashed border-dark-border/40 rounded-[6px]">
                Nenhum filme cadastrado. Clique em "Adicionar Filme" para começar.
              </div>
            )}
          </div>
        </div>

        {/* SECTION 8: DEPOIMENTOS / FEEDBACKS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-c6-gold/20 pb-2">
            <h3 className="text-xs font-bold text-c6-gold uppercase tracking-widest flex items-center">
              <span className="w-1.5 h-1.5 bg-c6-gold mr-2" />
              8. Depoimentos / Feedbacks de Clientes
            </h3>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={addTestimonial}
            >
              Adicionar Depoimento
            </Button>
          </div>

          <div className="space-y-4">
            {testimonials.map((t) => (
              <div key={t.id} className="p-4 border border-dark-border/40 rounded-[6px] bg-black/30 relative">
                <button
                  type="button"
                  onClick={() => removeTestimonial(t.id)}
                  className="absolute top-4 right-4 p-1 text-slate-500 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Screenshot Preview */}
                  <div className="md:col-span-4 flex flex-col items-center justify-center border border-dark-border/30 rounded-[6px] bg-zinc-950 p-3 min-h-[180px]">
                    {t.screenshotUrl ? (
                      <div className="relative w-full">
                        <img 
                          src={t.screenshotUrl} 
                          alt="Print do feedback" 
                          className="w-full h-auto max-h-[200px] object-contain rounded-[6px] shadow-md"
                        />
                        <button
                          type="button"
                          onClick={() => updateTestimonial(t.id, 'screenshotUrl', '')}
                          className="absolute top-1 right-1 p-1 bg-red-500/80 rounded-full text-white hover:bg-red-600 transition-colors cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center cursor-pointer hover:opacity-80 transition-opacity w-full h-full">
                        <ImagePlus className="w-10 h-10 text-slate-600 mb-2" />
                        <span className="text-[11px] text-slate-400 font-semibold text-center">Subir Print / Screenshot</span>
                        <span className="text-[9px] text-slate-600 mt-1">PNG, JPG, WEBP (máx. 2MB)</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleTestimonialScreenshot(e, t.id)}
                        />
                      </label>
                    )}
                  </div>

                  {/* Text Fields */}
                  <div className="md:col-span-8 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        label="Nome do Cliente"
                        value={t.name}
                        onChange={(e) => updateTestimonial(t.id, 'name', e.target.value)}
                        placeholder="ex: Paulo Santos"
                      />
                      <Input
                        label="Função / Rótulo"
                        value={t.role || ''}
                        onChange={(e) => updateTestimonial(t.id, 'role', e.target.value)}
                        placeholder="ex: Cliente há 2 anos"
                      />
                    </div>

                    <Textarea
                      label="Comentário / Depoimento"
                      value={t.comment}
                      onChange={(e) => updateTestimonial(t.id, 'comment', e.target.value)}
                      placeholder="Depoimento do cliente sobre a qualidade do serviço..."
                      rows={3}
                    />

                    <div className="flex items-center space-x-3">
                      <span className="text-xs text-slate-400 font-semibold">Avaliação:</span>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => updateTestimonial(t.id, 'rating', star)}
                            className="cursor-pointer transition-transform hover:scale-110"
                          >
                            <Star
                              className={`w-5 h-5 ${star <= t.rating ? 'text-yellow-500 fill-yellow-500' : 'text-zinc-700'}`}
                            />
                          </button>
                        ))}
                      </div>
                      <span className="text-xs text-slate-500 font-mono">{t.rating}/5</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {testimonials.length === 0 && (
              <div className="text-center py-8 text-sm text-slate-500 border border-dashed border-dark-border/40 rounded-[6px]">
                <MessageSquare className="w-8 h-8 mx-auto text-slate-600 mb-3" />
                <p>Nenhum depoimento cadastrado.</p>
                <p className="text-xs text-slate-600 mt-1">Adicione feedbacks ou suba prints de clientes satisfeitos.</p>
              </div>
            )}
          </div>
        </div>

        {/* Form Actions Footer */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-dark-border bg-dark-surface">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={loading}
          >
            {clientToEdit ? 'Salvar Alterações' : 'Criar Landing Page'}
          </Button>
        </div>
      </form>
    </div>
  );
}
