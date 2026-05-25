export type PageStatus = 'active' | 'pending' | 'suspended' | 'blocked' | 'expired';

export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface ClientPlan {
  id: string;
  name: string;
  price: string;
  period: 'mensal' | 'trimestral' | 'semestral' | 'anual';
  features: string[];
  checkoutUrl?: string;
  isPopular?: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  comment: string;
  rating: number;
  avatarUrl?: string;
  role?: string;
}

export interface BenefitItem {
  id: string;
  title: string;
  description: string;
  icon: string; // lucide icon name
}

export interface LandingPageData {
  id: string;
  clientId: string;
  name: string; // e.g. "Flux Play IPTV"
  slug: string; // unique URL part: "flux-play"
  logoUrl?: string;
  bannerUrl?: string;
  promoImageUrl?: string;
  primaryColor: string; // hex color e.g. "#e50914" (Netflix red)
  secondaryColor: string; // hex color e.g. "#833ab4" (purple)
  whatsapp: string;
  telegram?: string;
  instagram?: string;
  presentation: string;
  trialLink?: string;
  pixKey?: string;
  pixQrUrl?: string;
  benefits: BenefitItem[];
  plans: ClientPlan[];
  faqs: FAQItem[];
  testimonials: TestimonialItem[];
  customDomain?: string;
  viewsCount: number;
  status: PageStatus;
  createdAt: string;
  showMoviesCatalog?: boolean;
  featuredMovies?: MovieItem[];
}

export interface MovieItem {
  title: string;
  genre: string;
  year: string;
  rating: string;
  badge: string;
  quality: string;
  image: string;
}

export interface PaymentData {
  id: string;
  landingPageId: string;
  clientName: string;
  amount: number;
  status: 'approved' | 'pending' | 'expired';
  method: 'stripe' | 'pix' | 'card' | 'mercado_pago';
  vencimento: string;
  createdAt: string;
}

export interface DashboardMetrics {
  totalClients: number;
  mrr: number;
  activeSites: number;
  inadimplentesCount: number;
  totalViews: number;
  monthlyGrowthRate: number; // percentage
}
