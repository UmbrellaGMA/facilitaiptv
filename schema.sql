-- SCHEMA PARA CONFIGURAÇÃO NO SUPABASE SQL EDITOR
-- Execute estes comandos no editor SQL do seu painel Supabase para criar as tabelas, políticas e funções necessárias.

-- Habilitar extensão UUID caso não esteja ativa
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabela de Landing Pages (Configurações das páginas white-label)
CREATE TABLE IF NOT EXISTS public.landing_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL DEFAULT auth.uid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    banner_url TEXT,
    promo_image_url TEXT,
    primary_color TEXT DEFAULT '#e50914',
    secondary_color TEXT DEFAULT '#833ab4',
    whatsapp TEXT,
    telegram TEXT,
    instagram TEXT,
    presentation TEXT,
    trial_link TEXT,
    pix_key TEXT,
    pix_qr_url TEXT,
    benefits JSONB DEFAULT '[]'::jsonb,
    plans JSONB DEFAULT '[]'::jsonb,
    faqs JSONB DEFAULT '[]'::jsonb,
    testimonials JSONB DEFAULT '[]'::jsonb,
    custom_domain TEXT,
    views_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active',
    show_movies_catalog BOOLEAN DEFAULT true,
    featured_movies JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index para acelerar buscas por slug (URL) e domínio customizado
CREATE INDEX IF NOT EXISTS idx_landing_pages_slug ON public.landing_pages(slug);
CREATE INDEX IF NOT EXISTS idx_landing_pages_custom_domain ON public.landing_pages(custom_domain);

-- 2. Tabela de Pagamentos (Controle financeiro de mensalidades das LPs)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    landing_page_id UUID REFERENCES public.landing_pages(id) ON DELETE CASCADE,
    client_name TEXT,
    amount NUMERIC(10,2) NOT NULL,
    status TEXT DEFAULT 'pending',
    method TEXT DEFAULT 'pix',
    vencimento TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index para buscas rápidas de pagamentos vinculados a páginas
CREATE INDEX IF NOT EXISTS idx_payments_landing_page ON public.payments(landing_page_id);

-- 3. Políticas de Segurança (Row Level Security - RLS)
-- Habilita RLS nas tabelas
ALTER TABLE public.landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Políticas para landing_pages
CREATE POLICY "Permitir leitura pública de landing_pages" ON public.landing_pages
    FOR SELECT USING (true);

CREATE POLICY "Permitir inserção para usuários autenticados" ON public.landing_pages
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Permitir atualização do próprio proprietário" ON public.landing_pages
    FOR UPDATE TO authenticated
    USING (auth.uid() = client_id)
    WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Permitir exclusão do próprio proprietário" ON public.landing_pages
    FOR DELETE TO authenticated
    USING (auth.uid() = client_id);

-- Políticas para payments
CREATE POLICY "Permitir leitura de pagamentos vinculados" ON public.payments
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.landing_pages 
            WHERE landing_pages.id = payments.landing_page_id 
              AND landing_pages.client_id = auth.uid()
        )
    );

CREATE POLICY "Permitir inserção de pagamentos vinculados" ON public.payments
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.landing_pages 
            WHERE landing_pages.id = payments.landing_page_id 
              AND landing_pages.client_id = auth.uid()
        )
    );

CREATE POLICY "Permitir atualização de pagamentos vinculados" ON public.payments
    FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.landing_pages 
            WHERE landing_pages.id = payments.landing_page_id 
              AND landing_pages.client_id = auth.uid()
        )
    );

CREATE POLICY "Permitir exclusão de pagamentos vinculados" ON public.payments
    FOR DELETE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.landing_pages 
            WHERE landing_pages.id = payments.landing_page_id 
              AND landing_pages.client_id = auth.uid()
        )
    );

-- 4. Função para incrementar as visualizações de uma landing page de forma anônima e segura
-- Esta função possui SECURITY DEFINER, executando com privilégios do criador do banco para
-- permitir que visitantes não autenticados incrementem o contador de visualizações.
CREATE OR REPLACE FUNCTION increment_landing_page_views(page_slug TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.landing_pages
  SET views_count = COALESCE(views_count, 0) + 1
  WHERE slug = page_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Instruções adicionais para Storage (Upload de Mídia):
-- Vá no menu 'Storage' no painel do Supabase e crie um bucket chamado 'iptv-assets'
-- Certifique-se de configurar esse bucket como "Public" nas configurações do painel.
