'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Tv, 
  Users, 
  DollarSign, 
  Activity, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Power, 
  ShieldAlert, 
  Clock, 
  CheckCircle,
  FileText,
  UserCheck,
  TrendingUp,
  CreditCard,
  Settings,
  LogOut,
  RefreshCw,
  Copy,
  Layout
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { Select } from '../../../components/ui/Select';
import { dbService, supabase } from '../../../services/db';
import { formatBRL, formatDate } from '../../../lib/utils';
import { LandingPageData, PaymentData, DashboardMetrics, PageStatus } from '../../../types';
import ClientForm from './client-form';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Layout navigation
  const [activeTab, setActiveTab] = useState<'overview' | 'clients' | 'billing'>('overview');

  // Database Data
  const [clients, setClients] = useState<LandingPageData[]>([]);
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalClients: 0,
    mrr: 0,
    activeSites: 0,
    inadimplentesCount: 0,
    totalViews: 0,
    monthlyGrowthRate: 0
  });

  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Sidebar controls
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Form Modal drawer state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<LandingPageData | null>(null);

  // Fetch all dashboard data
  const fetchData = async () => {
    try {
      const allClients = await dbService.getLandingPages();
      const allPayments = await dbService.getPayments();
      const calculatedMetrics = await dbService.getDashboardMetrics();

      setClients(allClients);
      setPayments(allPayments);
      setMetrics(calculatedMetrics);
    } catch (err) {
      console.error('Error fetching data', err);
    }
  };

  // Auth Guard & Mount
  useEffect(() => {
    setIsMounted(true);
    const checkAuth = async () => {
      if (typeof window !== 'undefined') {
        if (supabase) {
          const { data } = await supabase.auth.getSession();
          if (data.session) {
            localStorage.setItem('iptv_saas_is_logged', 'true');
            fetchData();
            return;
          }
        }
        
        const isLogged = localStorage.getItem('iptv_saas_is_logged');
        if (isLogged !== 'true') {
          router.push('/admin/login');
        } else {
          fetchData();
        }
      }
    };
    checkAuth();
  }, [router]);

  if (!isMounted) return null;

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('iptv_saas_is_logged');
    router.push('/admin/login');
  };

  // Handle Client Deletion
  const handleDeleteClient = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta landing page? Todos os dados associados serão perdidos.')) {
      try {
        await dbService.deleteLandingPage(id);
        fetchData();
      } catch (err) {
        alert('Erro ao excluir cliente.');
      }
    }
  };

  // Handle Client Status Toggle Quick Action (Suspend/Activate)
  const handleToggleStatus = async (client: LandingPageData) => {
    const newStatus: PageStatus = client.status === 'active' ? 'suspended' : 'active';
    try {
      await dbService.saveLandingPage({
        id: client.id,
        slug: client.slug,
        status: newStatus
      });
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Erro ao alterar status.');
    }
  };

  // Handle Client Movies Catalog Toggle Quick Action
  const handleToggleMoviesCatalog = async (client: LandingPageData) => {
    const newVal = client.showMoviesCatalog === false ? true : false;
    try {
      await dbService.saveLandingPage({
        id: client.id,
        slug: client.slug,
        showMoviesCatalog: newVal
      });
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Erro ao alterar catálogo.');
    }
  };

  // Handle Manual Payment Approval & Auto Site Liberation Flow
  const handleApprovePayment = async (payment: PaymentData) => {
    try {
      // 1. Approve payment
      await dbService.savePayment({
        id: payment.id,
        status: 'approved',
        vencimento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // Extend 30 days
      });

      // 2. Find matching client site and set to active
      const matchedClient = clients.find(c => c.id === payment.landingPageId);
      if (matchedClient) {
        await dbService.saveLandingPage({
          id: matchedClient.id,
          slug: matchedClient.slug,
          status: 'active'
        });
      }

      // 3. Reload data
      fetchData();
    } catch (err) {
      alert('Erro ao liberar pagamento.');
    }
  };

  // Handle Client Duplication
  const handleDuplicateClient = async (client: LandingPageData) => {
    try {
      const newSlug = `${client.slug}-copy-${Math.floor(100 + Math.random() * 900)}`;
      const duplicated: Partial<LandingPageData> = {
        ...client,
        id: undefined,
        name: `${client.name} (Cópia)`,
        slug: newSlug,
        customDomain: '',
        viewsCount: 0,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      await dbService.saveLandingPage(duplicated as any);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Erro ao duplicar.');
    }
  };

  // Filters search query
  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="relative min-h-screen bg-dark-bg text-foreground flex overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className={`sticky top-0 h-screen z-30 transition-all duration-300 bg-dark-surface border-r border-dark-border/60 flex flex-col justify-between ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div>
          {/* Sidebar Brand */}
          <div className="px-6 py-6 border-b border-dark-border/40 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 rounded-none bg-c6-gold/10 border border-c6-gold/20 flex items-center justify-center transition-all duration-300 group-hover:border-c6-gold">
                <Tv className="w-4 h-4 text-c6-gold" />
              </div>
              {isSidebarOpen && (
                <span className="font-bold text-base tracking-wider text-white">
                  IPTV<span className="text-c6-gold font-extrabold">CARBON</span>
                </span>
              )}
            </Link>
          </div>          {/* Navigation Links */}
          <nav className="mt-8 px-3 space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-[6px] text-sm font-medium transition-all duration-300 cursor-pointer ${
                activeTab === 'overview' 
                  ? 'bg-c6-gold/10 text-c6-gold font-semibold shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layout className="w-5 h-5 shrink-0" />
              {isSidebarOpen && <span>Visão Geral</span>}
            </button>

            <button
              onClick={() => setActiveTab('clients')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-[6px] text-sm font-medium transition-all duration-300 cursor-pointer ${
                activeTab === 'clients' 
                  ? 'bg-c6-gold/10 text-c6-gold font-semibold shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className="w-5 h-5 shrink-0" />
              {isSidebarOpen && <span>Clientes & Páginas</span>}
            </button>

            <button
              onClick={() => setActiveTab('billing')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-[6px] text-sm font-medium transition-all duration-300 cursor-pointer ${
                activeTab === 'billing' 
                  ? 'bg-c6-gold/10 text-c6-gold font-semibold shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <CreditCard className="w-5 h-5 shrink-0" />
              {isSidebarOpen && <span>Financeiro (SaaS)</span>}
            </button>
          </nav>
        </div>
 
        {/* Sidebar Footer */}
        <div className="px-3 py-6 border-t border-dark-border/40 space-y-2">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded-[6px] bg-dark-bg/60 border border-dark-border hover:border-c6-gold/40 hover:bg-dark-border/20 text-slate-400 hover:text-c6-gold transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 transition-transform duration-500 ${isSidebarOpen ? '' : 'rotate-180'}`} />
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-[6px] text-sm font-medium text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span>Sair do Sistema</span>}
          </button>
        </div>
      </aside>
 
      {/* MAIN CONTAINER */}
      <main className="flex-1 min-h-screen overflow-y-auto px-8 py-8 relative">
        {/* Glow lights removed */}
 
        {/* TOP BAR / HEADER */}
        <header className="flex items-center justify-between mb-8 pb-4 border-b border-dark-border/40">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              {activeTab === 'overview' && 'Painel Geral de Métricas'}
              {activeTab === 'clients' && 'Gestão de Clientes'}
              {activeTab === 'billing' && 'Financeiro & Recorrência'}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {activeTab === 'overview' && 'Acompanhe faturamento, acessos e novos registros.'}
              {activeTab === 'clients' && 'Crie, suspenda, edite e visualize landing pages white-label.'}
              {activeTab === 'billing' && 'Monitore vencimentos e aprove pagamentos de mensalidades.'}
            </p>
          </div>
 
          <div className="flex items-center space-x-4">
            <span className="text-xs font-semibold px-3 py-1 rounded-none bg-green-500/10 border border-green-500/20 text-green-500 flex items-center">
              <span className="w-1.5 h-1.5 bg-green-500 mr-2" />
              SaaS Online
            </span>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setEditingClient(null);
                setIsFormOpen(true);
              }}
            >
              Novo Cliente
            </Button>
          </div>
        </header>

        {/* METRIC CARDS HEADER SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="c6-card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Receita Recorrente (MRR)</CardTitle>
              <DollarSign className="w-4 h-4 text-c6-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold text-c6-gold">{formatBRL(metrics.mrr)}</div>
              <p className="text-xs text-green-500 mt-1 flex items-center font-medium">
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                +{metrics.monthlyGrowthRate}% este mês
              </p>
            </CardContent>
          </Card>
 
          <Card className="c6-card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total de Clientes</CardTitle>
              <Users className="w-4 h-4 text-c6-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold text-white">{metrics.totalClients}</div>
              <p className="text-xs text-slate-400 mt-1">
                Clientes ativos na plataforma
              </p>
            </CardContent>
          </Card>
 
          <Card className="c6-card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Sites Publicados (Ativos)</CardTitle>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold text-white">{metrics.activeSites}</div>
              <p className="text-xs text-green-500 mt-1 flex items-center font-medium">
                {Math.round((metrics.activeSites / (metrics.totalClients || 1)) * 100)}% de taxa de ativação
              </p>
            </CardContent>
          </Card>
 
          <Card className="c6-card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Vencidos / Suspensos</CardTitle>
              <Clock className="w-4 h-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold text-white">{metrics.inadimplentesCount}</div>
              <p className="text-xs text-red-500 mt-1 font-medium">
                Aguardando pagamento ou bloqueados
              </p>
            </CardContent>
          </Card>
        </div>
 
        {/* TAB CONTENT: 1. OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* SVG Graph for SaaS Growth */}
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-c6-gold" />
                  <span>Evolução de Faturamento Recorrente (MRR)</span>
                </CardTitle>
                <CardDescription>Crescimento financeiro consolidado nos últimos meses.</CardDescription>
              </CardHeader>
              <CardContent className="h-64 mt-4 relative">
                {/* Simulated High Quality SVG Area Chart */}
                <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="50" x2="600" y2="50" stroke="#1f1f23" strokeWidth="1" strokeDasharray="4" />
                  <line x1="0" y1="100" x2="600" y2="100" stroke="#1f1f23" strokeWidth="1" strokeDasharray="4" />
                  <line x1="0" y1="150" x2="600" y2="150" stroke="#1f1f23" strokeWidth="1" strokeDasharray="4" />
 
                  {/* Area fill - simplified transparent background */}
                  <path
                    d="M0,170 Q100,160 200,120 T400,90 T600,40 L600,200 L0,200 Z"
                    fill="rgba(212, 157, 43, 0.04)"
                  />
 
                  {/* Line */}
                  <path
                    d="M0,170 Q100,160 200,120 T400,90 T600,40"
                    fill="none"
                    stroke="#d49d2b"
                    strokeWidth="2.5"
                  />
 
                  {/* Line points & markers */}
                  <circle cx="200" cy="120" r="4" fill="#d49d2b" stroke="#060608" strokeWidth="1.5" />
                  <circle cx="400" cy="90" r="4" fill="#d49d2b" stroke="#060608" strokeWidth="1.5" />
                  <circle cx="600" cy="40" r="5" fill="#ffffff" stroke="#d49d2b" strokeWidth="2" />
                </svg>
 
                {/* Graph Labels */}
                <div className="flex justify-between text-xs text-slate-500 mt-2 font-semibold">
                  <span>Dez</span>
                  <span>Jan</span>
                  <span>Fev</span>
                  <span>Mar</span>
                  <span>Abr</span>
                  <span>Mai (Atual)</span>
                </div>
              </CardContent>
            </Card>

            {/* Bottom split: Recent payments & top views */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent client page updates */}
              <Card className="rounded-none">
                <CardHeader>
                  <CardTitle className="text-base text-slate-200">Últimos Clientes Cadastrados</CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <div className="divide-y divide-dark-border/40">
                    {clients.slice(0, 4).map((client) => (
                      <div key={client.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-white/5 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-3 h-3 rounded-none" 
                            style={{ backgroundColor: client.primaryColor }}
                          />
                          <div>
                            <p className="text-sm font-bold text-white">{client.name}</p>
                            <p className="text-xs text-slate-400">/{client.slug}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-none ${
                          client.status === 'active' ? 'bg-green-500/10 border border-green-500/20 text-green-500' :
                          client.status === 'suspended' ? 'bg-red-500/10 border border-red-500/20 text-red-500' :
                          'bg-yellow-500/10 border border-yellow-500/20 text-yellow-500'
                        }`}>
                          {client.status.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
 
              {/* Top View Counts */}
              <Card className="rounded-none">
                <CardHeader>
                  <CardTitle className="text-base text-slate-200">Mais Visualizados</CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <div className="divide-y divide-dark-border/40">
                    {clients.slice().sort((a, b) => b.viewsCount - a.viewsCount).slice(0, 4).map((client) => (
                      <div key={client.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-white/5 transition-colors">
                        <div className="flex items-center space-x-3">
                          <Layout className="w-4 h-4 text-slate-400" />
                          <div>
                            <p className="text-sm font-bold text-white">{client.name}</p>
                            <p className="text-xs text-slate-400">/{client.slug}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-white">{client.viewsCount}</p>
                          <p className="text-[10px] text-slate-500 font-medium">views totais</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
 
        {/* TAB CONTENT: 2. CLIENTS */}
        {activeTab === 'clients' && (
          <Card className="p-0 rounded-none">
            {/* Table Header Filter Search */}
            <div className="px-6 py-5 border-b border-dark-border/40 bg-black/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome ou subdomínio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 w-full rounded-none border border-dark-border bg-dark-bg/60 text-sm text-foreground focus:outline-none focus:border-c6-gold placeholder:text-slate-500"
                />
              </div>
 
              <div className="flex items-center space-x-3">
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={[
                    { value: 'all', label: 'Todos os Status' },
                    { value: 'active', label: 'Ativos' },
                    { value: 'pending', label: 'Pendentes' },
                    { value: 'suspended', label: 'Suspensos' },
                    { value: 'expired', label: 'Expirados' },
                    { value: 'blocked', label: 'Bloqueados' }
                  ]}
                  className="h-10 text-xs w-44 rounded-none"
                />
              </div>
            </div>
 
            {/* Clients Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-dark-border/40 text-slate-400 text-xs font-semibold uppercase bg-black/10">
                    <th className="px-6 py-4">Cliente / Identidade</th>
                    <th className="px-6 py-4">Subdomínio / URL</th>
                    <th className="px-6 py-4 text-center">Filmes Novidades</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Visualizações</th>
                    <th className="px-6 py-4">Planos</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-border/40 text-sm text-slate-300">
                  {filteredClients.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                        Nenhum cliente encontrado.
                      </td>
                    </tr>
                  ) : (
                    filteredClients.map((client) => (
                      <tr key={client.id} className="hover:bg-white/5 transition-all">
                        <td className="px-6 py-4 flex items-center space-x-3">
                          <div className="relative w-8 h-8 rounded-none bg-slate-900 border border-dark-border flex items-center justify-center overflow-hidden shrink-0">
                            {client.logoUrl ? (
                              <img src={client.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                            ) : (
                              <Tv className="w-4 h-4 text-slate-500" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-white">{client.name}</p>
                            <div className="flex items-center space-x-2 text-[10px] text-slate-500 mt-0.5">
                              <span 
                                className="inline-block w-2.5 h-2.5 rounded-none" 
                                style={{ backgroundColor: client.primaryColor }}
                                title="Cor Primária"
                              />
                              <span 
                                className="inline-block w-2.5 h-2.5 rounded-none" 
                                style={{ backgroundColor: client.secondaryColor }}
                                title="Cor Secundária"
                              />
                              <span>Criado em: {formatDate(client.createdAt)}</span>
                            </div>
                          </div>
                        </td>
 
                        <td className="px-6 py-4 font-mono text-xs">
                          <div className="text-c6-gold font-semibold">{client.slug}<span className="text-slate-500">.domínio</span></div>
                          <div className="text-slate-600 text-[10px] mt-0.5">/site/{client.slug}</div>
                        </td>
 
                        <td className="px-6 py-4 text-center">
                          <button
                            title="Alternar exibição do catálogo de filmes novos para este cliente"
                            onClick={() => handleToggleMoviesCatalog(client)}
                            className={`px-3 py-1 text-xs font-bold transition-all cursor-pointer rounded-none border ${
                              client.showMoviesCatalog !== false 
                                ? 'bg-c6-gold/15 border-c6-gold/30 text-c6-gold hover:bg-c6-gold/25' 
                                : 'bg-dark-border/45 border-dark-border text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            {client.showMoviesCatalog !== false ? 'Ativo' : 'Inativo'}
                          </button>
                        </td>
 
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-none text-xs font-semibold ${
                            client.status === 'active' ? 'bg-green-500/10 border border-green-500/20 text-green-500' :
                            client.status === 'pending' ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-500' :
                            client.status === 'suspended' ? 'bg-red-500/10 border border-red-500/20 text-red-500' :
                            'bg-red-800/10 border border-red-800/20 text-red-400'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-none mr-2 ${
                              client.status === 'active' ? 'bg-green-500' :
                              client.status === 'pending' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`} />
                            {client.status === 'active' && 'Ativo'}
                            {client.status === 'pending' && 'Pendente'}
                            {client.status === 'suspended' && 'Suspenso'}
                            {client.status === 'expired' && 'Expirado'}
                            {client.status === 'blocked' && 'Bloqueado'}
                          </span>
                        </td>
 
                        <td className="px-6 py-4 text-center font-bold text-white">
                          {client.viewsCount}
                        </td>
 
                        <td className="px-6 py-4 text-xs font-semibold text-slate-400">
                          {client.plans.length} cadastrados (R$ {client.plans[0]?.price || '0,00'}/m)
                        </td>
 
                        <td className="px-6 py-4 text-right space-x-1.5 shrink-0">
                          <button
                            title="Alterar Publicação (Ativar/Pausar)"
                            onClick={() => handleToggleStatus(client)}
                            className={`p-1.5 rounded-none border transition-all cursor-pointer ${
                              client.status === 'active' 
                                ? 'bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500/25' 
                                : 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/25'
                            }`}
                          >
                            <Power className="w-4 h-4" />
                          </button>
 
                          <button
                            title="Duplicar Template"
                            onClick={() => handleDuplicateClient(client)}
                            className="p-1.5 rounded-none bg-dark-border border border-dark-border hover:border-white/20 hover:text-white transition-all cursor-pointer text-slate-300"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
 
                          <button
                            title="Editar Dados"
                            onClick={() => {
                              setEditingClient(client);
                              setIsFormOpen(true);
                            }}
                            className="p-1.5 rounded-none bg-dark-border border border-dark-border hover:border-white/20 hover:text-white transition-all cursor-pointer text-slate-300"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
 
                          <Link href={`/site/${client.slug}`} target="_blank">
                            <button
                              title="Visualizar Site"
                              className="p-1.5 rounded-none bg-dark-border border border-dark-border hover:border-white/20 hover:text-white transition-all cursor-pointer text-slate-300"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </Link>
 
                          <button
                            title="Excluir Site"
                            onClick={() => handleDeleteClient(client.id)}
                            className="p-1.5 rounded-none bg-red-600/10 border border-red-600/20 text-red-500 hover:bg-red-600/20 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* TAB CONTENT: 3. BILLING / FINANCEIRO */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            <Card className="rounded-none">
              <CardHeader>
                <CardTitle className="text-base text-slate-200">Histórico de Cobrança & Controle de Vencimentos</CardTitle>
                <CardDescription>
                  Acompanhe vencimentos de mensalidades dos clientes e faturamento recorrente.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-dark-border/40 text-slate-400 text-xs font-semibold uppercase bg-black/10">
                        <th className="px-6 py-3">Cliente</th>
                        <th className="px-6 py-3">Valor Mensal</th>
                        <th className="px-6 py-3">Data de Vencimento</th>
                        <th className="px-6 py-3">Status do Pagamento</th>
                        <th className="px-6 py-3">Meio</th>
                        <th className="px-6 py-3 text-right">Ação Master</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-border/40 text-sm text-slate-300">
                      {payments.map((p) => (
                        <tr key={p.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 font-bold text-white">{p.clientName}</td>
                          <td className="px-6 py-4 font-mono font-semibold">{formatBRL(p.amount)}</td>
                          <td className="px-6 py-4 text-xs font-semibold text-slate-400">{formatDate(p.vencimento)}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-none text-xs font-semibold ${
                              p.status === 'approved' ? 'bg-green-500/10 border border-green-500/20 text-green-500' :
                              p.status === 'pending' ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-500' :
                              'bg-red-500/10 border border-red-500/20 text-red-500'
                            }`}>
                              {p.status === 'approved' && 'Pago'}
                              {p.status === 'pending' && 'Pendente'}
                              {p.status === 'expired' && 'Vencido'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs font-semibold uppercase text-slate-400">{p.method}</td>
                          <td className="px-6 py-4 text-right">
                            {p.status !== 'approved' ? (
                              <Button
                                size="sm"
                                variant="secondary"
                                leftIcon={<UserCheck className="w-3.5 h-3.5" />}
                                onClick={() => handleApprovePayment(p)}
                              >
                                Liberar Acesso (Aprovar PIX)
                              </Button>
                            ) : (
                              <span className="text-xs text-slate-500 flex items-center justify-end">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-1.5 shrink-0" />
                                Liberado
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
 
      {/* DRAWER FORM WRAPPER (Sliding Panel for Create/Edit) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="absolute inset-0" onClick={() => setIsFormOpen(false)} />
          <div className="relative w-full max-w-3xl h-full shadow-none border-l border-dark-border">
            <ClientForm
              clientToEdit={editingClient}
              onClose={() => setIsFormOpen(false)}
              onSuccess={() => {
                setIsFormOpen(false);
                fetchData();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
