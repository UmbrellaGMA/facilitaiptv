'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Tv, Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';

const loginSchema = z.object({
  email: z.string().email('Por favor, insira um e-mail válido.'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function SaaSMarketingPage() {
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
    
    // Simulate API Auth Request
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
  };

  return (
    <div className="relative min-h-screen bg-dark-bg flex items-center justify-center px-4 overflow-hidden">
      {/* Background Glow removed */}

      <div className="w-full max-w-md z-10">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-none bg-white/10 border border-white/20 items-center justify-center mb-4">
            <Tv className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Painel Administrativo Master
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Entre para gerenciar seus clientes e assinaturas
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-dark-border/80 shadow-none rounded-none">
          <CardHeader className="rounded-none">
            <CardTitle className="text-lg text-slate-200">Faça seu Login</CardTitle>
            <CardDescription>Insira as credenciais de administrador master.</CardDescription>
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
          <p>🔑 Acesso de Teste:</p>
          <p className="font-mono text-slate-400 mt-1">E-mail: admin@saas.com | Senha: admin123</p>
        </div>
      </div>
    </div>
  );
}
