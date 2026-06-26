'use client';

import { useRef } from 'react';
import * as m from 'motion/react-m';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Camera, Loader2, Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { PageTransition } from '@/components/motion/page-transition';
import { useAuth } from '@/hooks/use-auth';
import { useUploadAvatar } from '@/hooks/use-upload-avatar';

const profileSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  phone: z
    .string()
    .min(10, 'Nomor telepon minimal 10 digit')
    .regex(/^[0-9+-\s]+$/, 'Format nomor telepon tidak valid'),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Password lama wajib diisi'),
    newPassword: z.string().min(6, 'Password baru minimal 6 karakter'),
    confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Password baru tidak cocok',
    path: ['confirmPassword'],
  });

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { user, updateProfile, isUpdatingProfile, changePassword, isChangingPassword } = useAuth();
  const { uploadAvatar, isUploading } = useUploadAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? '',
      phone: user?.phone ?? '',
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onProfileSubmit = (data: ProfileFormValues) => {
    updateProfile(data);
  };

  const onPasswordSubmit = (data: PasswordFormValues) => {
    changePassword(
      { currentPassword: data.currentPassword, newPassword: data.newPassword },
      {
        onSuccess: () => passwordForm.reset(),
      },
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadAvatar(file);
    }
    if (e.target) {
      e.target.value = '';
    }
  };

  return (
    <PageTransition className="mx-auto max-w-3xl px-6 py-10">
      <div className="space-y-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Profil Saya</h1>
          <p className="text-muted-foreground">Kelola informasi akun Anda</p>
        </div>

        {/* Avatar Section */}
        <Card>
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <div className="relative">
              <Avatar className="h-24 w-24 ring-4 ring-border">
                {user?.avatarUrl ? (
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                ) : null}
                <AvatarFallback className="bg-secondary text-secondary-foreground text-2xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            <p className="text-sm text-muted-foreground">Klik ikon kamera untuk mengganti foto profil</p>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle>Data Diri</CardTitle>
            <CardDescription>Perbarui nama dan nomor telepon Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nama Lengkap Anda"
                  disabled={isUpdatingProfile}
                  aria-invalid={!!profileForm.formState.errors.name}
                  {...profileForm.register('name')}
                />
                {profileForm.formState.errors.name && (
                  <m.p
                    className="text-xs font-medium text-destructive"
                    initial={{ x: 0 }}
                    animate={{ x: [-10, 10, -10, 10, 0] }}
                    transition={{ duration: 0.4 }}
                  >
                    {profileForm.formState.errors.name.message}
                  </m.p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email ?? ''}
                  disabled
                  className="cursor-not-allowed opacity-60"
                />
                <p className="text-xs text-muted-foreground">Email tidak dapat diubah</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Nomor Telepon</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="081234567890"
                  disabled={isUpdatingProfile}
                  aria-invalid={!!profileForm.formState.errors.phone}
                  {...profileForm.register('phone')}
                />
                {profileForm.formState.errors.phone && (
                  <m.p
                    className="text-xs font-medium text-destructive"
                    initial={{ x: 0 }}
                    animate={{ x: [-10, 10, -10, 10, 0] }}
                    transition={{ duration: 0.4 }}
                  >
                    {profileForm.formState.errors.phone.message}
                  </m.p>
                )}
              </div>

              <m.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button type="submit" className="gap-2" disabled={isUpdatingProfile}>
                  {isUpdatingProfile ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Simpan Perubahan
                    </>
                  )}
                </Button>
              </m.div>
            </form>
          </CardContent>
        </Card>

        <Separator />

        {/* Change Password Form */}
        <Card>
          <CardHeader>
            <CardTitle>Ganti Password</CardTitle>
            <CardDescription>Gunakan password yang kuat dan mudah diingat</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="currentPassword">Password Lama</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Password saat ini"
                  disabled={isChangingPassword}
                  aria-invalid={!!passwordForm.formState.errors.currentPassword}
                  {...passwordForm.register('currentPassword')}
                />
                {passwordForm.formState.errors.currentPassword && (
                  <m.p
                    className="text-xs font-medium text-destructive"
                    initial={{ x: 0 }}
                    animate={{ x: [-10, 10, -10, 10, 0] }}
                    transition={{ duration: 0.4 }}
                  >
                    {passwordForm.formState.errors.currentPassword.message}
                  </m.p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="newPassword">Password Baru</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Minimal 6 karakter"
                  disabled={isChangingPassword}
                  aria-invalid={!!passwordForm.formState.errors.newPassword}
                  {...passwordForm.register('newPassword')}
                />
                {passwordForm.formState.errors.newPassword && (
                  <m.p
                    className="text-xs font-medium text-destructive"
                    initial={{ x: 0 }}
                    animate={{ x: [-10, 10, -10, 10, 0] }}
                    transition={{ duration: 0.4 }}
                  >
                    {passwordForm.formState.errors.newPassword.message}
                  </m.p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Ulangi password baru"
                  disabled={isChangingPassword}
                  aria-invalid={!!passwordForm.formState.errors.confirmPassword}
                  {...passwordForm.register('confirmPassword')}
                />
                {passwordForm.formState.errors.confirmPassword && (
                  <m.p
                    className="text-xs font-medium text-destructive"
                    initial={{ x: 0 }}
                    animate={{ x: [-10, 10, -10, 10, 0] }}
                    transition={{ duration: 0.4 }}
                  >
                    {passwordForm.formState.errors.confirmPassword.message}
                  </m.p>
                )}
              </div>

              <m.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button type="submit" className="gap-2" disabled={isChangingPassword}>
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Mengubah...
                    </>
                  ) : (
                    'Ganti Password'
                  )}
                </Button>
              </m.div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
