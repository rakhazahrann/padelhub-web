'use client';

import * as m from 'motion/react-m';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageTransition, StaggerItem } from '@/components/motion';
import { useAuth } from '@/hooks/use-auth';

const registerSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
  phone: z.string().min(10, 'Nomor telepon minimal 10 digit').regex(/^[0-9+-\s]+$/, 'Format nomor telepon tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerUser, isRegistering } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    registerUser(data);
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
            <h2 className="text-xl font-bold tracking-tight text-foreground">Daftar Akun Baru</h2>
            <p className="text-sm text-muted-foreground">
              Lengkapi data diri Anda untuk mulai memesan lapangan.
            </p>
          </div>
        </StaggerItem>

        <StaggerItem>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <StaggerItem>
              <div className="space-y-1.5">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nama Lengkap Anda"
                  disabled={isRegistering}
                  aria-invalid={!!errors.name}
                  {...register('name')}
                />
                {errors.name && (
                  <m.p
                    className="text-xs font-medium text-destructive"
                    initial={{ x: 0 }}
                    animate={{ x: [-10, 10, -10, 10, 0] }}
                    transition={{ duration: 0.4 }}
                  >
                    {errors.name.message}
                  </m.p>
                )}
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  disabled={isRegistering}
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
                <Label htmlFor="phone">Nomor Telepon</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="081234567890"
                  disabled={isRegistering}
                  aria-invalid={!!errors.phone}
                  {...register('phone')}
                />
                {errors.phone && (
                  <m.p
                    className="text-xs font-medium text-destructive"
                    initial={{ x: 0 }}
                    animate={{ x: [-10, 10, -10, 10, 0] }}
                    transition={{ duration: 0.4 }}
                  >
                    {errors.phone.message}
                  </m.p>
                )}
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  disabled={isRegistering}
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
                <Button type="submit" className="w-full gap-2 mt-2" disabled={isRegistering}>
                  {isRegistering ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Mendaftar...
                    </>
                  ) : (
                    <>
                      Daftar
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
            Sudah punya akun?{' '}
            <Link href="/login" className="font-semibold text-secondary hover:underline">
              Masuk
            </Link>
          </m.div>
        </StaggerItem>
      </m.div>
    </PageTransition>
  );
}
