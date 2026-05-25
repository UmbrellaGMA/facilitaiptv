'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Tv, Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { supabase } from '../../../services/db';

const loginSchema = z.object({
  email: z.string().email('Por favor, insira um e-mail válido.'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!supabase) {
        // Fallback para quando o Supabase não está configurado localmente
        setTimeout(() => {
          if (data.email === 'admin@saas.com' && data.password === 'admin123') {
            if (typeof window !== 'undefined') {
              localStorage.setItem('iptv_saas_is_logged', 'true');
            }
            router.push('/admin/dashboard');
          } else {
            setError('E-mail ou senha incorretos. Dica: use admin@saas.com / admin123');
            setLoading(false);
          }
        }, 1200);
        return;
      }

      // Login real com Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        setError(authError.message === 'Invalid login credentials' 
          ? 'E-mail ou senha incorretos no Supabase.' 
          : authError.message);
        setLoading(false);
      } else {
        if (typeof window !== 'undefined') {
          localStorage.setItem('iptv_saas_is_logged', 'true');
        }
        router.push('/admin/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao fazer login.');
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-dark-bg flex items-center justify-center px-4 overflow-hidden">
      {/* Background Glow removed */}

      <div className="w-full max-w-md z-10">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-none bg-c6-gold/10 border border-c6-gold/20 items-center justify-center mb-4">
            <Tv className="w-6 h-6 text-c6-gold" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white uppercase tracking-wider">
            IPTV<span className="text-c6-gold font-extrabold">CARBON</span>
          </h1>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            Painel Administrativo Master • Gestão de Clientes e Recorrência
          </p>
        </div>
 
        {/* Login Card */}
        <Card className="border-dark-border/80 shadow-none rounded-none c6-card-hover">
          <CardHeader className="rounded-none pb-4 border-b border-dark-border/20">
            <CardTitle className="text-base font-bold text-slate-200 uppercase tracking-wider">Acessar Conta</CardTitle>
            <CardDescription className="text-xs">Insira suas credenciais para gerenciar a infraestrutura.</CardDescription>
          </CardHeader>
          <CardContent className="rounded-none">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {error && (
                <div className="flex items-center space-x-2 rounded-none border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Input
                {...register('email')}
                label="Endereço de E-mail"
                placeholder="admin@saas.com"
                type="email"
                error={errors.email?.message}
                disabled={loading}
                autoComplete="email"
              />

              <div className="relative">
                <Input
                  {...register('password')}
                  label="Senha"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  error={errors.password?.message}
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full mt-2 h-11"
                isLoading={loading}
              >
                Entrar no Sistema
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Dica de Acesso */}
        <div className="text-center mt-6 text-xs text-slate-500 border border-dark-border/40 bg-dark-surface/30 rounded-none p-3">
          <p className="text-[11px] text-slate-400 font-semibold mb-1">🔑 Contas Disponíveis para Login:</p>
          <p className="font-mono text-c6-gold text-[10px] mt-0.5">Master: gustavo.melo2802@gmail.com | Gu22057422</p>
          <p className="font-mono text-slate-500 text-[10px] mt-0.5">Simulação: admin@saas.com | admin123</p>
        </div>
      </div>
    </div>
  );
}
