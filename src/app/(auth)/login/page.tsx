'use client';

import { Suspense } from 'react';
import * as m from 'motion/react-m';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageTransition, StaggerItem } from '@/components/motion';
import { useAuth } from '@/hooks/use-auth';

const loginSchema = z.object({
  email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const { login, isLoggingIn } = useAuth(redirect);
  
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

  const onSubmit = (data: LoginFormValues) => {
    login(data);
  };

  return (
    <PageTransition>
      <m.div
        className="space-y-6"
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
        initial="hidden"
        animate="visible"
      >
        <StaggerItem>
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Masuk ke Akun Anda</h2>
            <p className="text-sm text-muted-foreground">
              Gunakan email dan password terdaftar Anda.
            </p>
          </div>
        </StaggerItem>

        <StaggerItem>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <StaggerItem>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  disabled={isLoggingIn}
                  aria-invalid={!!errors.email}
                  {...register('email')}
                />
                {errors.email && (
                  <m.p
                    className="text-xs font-medium text-destructive"
                    initial={{ x: 0 }}
                    animate={{ x: [-10, 10, -10, 10, 0] }}
                    transition={{ duration: 0.4 }}
                  >
                    {errors.email.message}
                  </m.p>
                )}
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  disabled={isLoggingIn}
                  aria-invalid={!!errors.password}
                  {...register('password')}
                />
                {errors.password && (
                  <m.p
                    className="text-xs font-medium text-destructive"
                    initial={{ x: 0 }}
                    animate={{ x: [-10, 10, -10, 10, 0] }}
                    transition={{ duration: 0.4 }}
                  >
                    {errors.password.message}
                  </m.p>
                )}
              </div>
            </StaggerItem>

            <StaggerItem>
              <m.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button type="submit" className="w-full gap-2 mt-2" disabled={isLoggingIn}>
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      Masuk
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </m.div>
            </StaggerItem>
          </form>
        </StaggerItem>

        <StaggerItem>
          <m.div
            className="text-center text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Belum punya akun?{' '}
            <Link href="/register" className="font-semibold text-secondary hover:underline">
              Daftar Sekarang
            </Link>
          </m.div>
        </StaggerItem>
      </m.div>
    </PageTransition>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
