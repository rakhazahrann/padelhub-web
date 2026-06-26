'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { userService } from '@/services/user.service';
import { useAuthStore } from '@/stores/use-auth-store';

export function useUploadAvatar() {
  const { setUser, user } = useAuthStore();

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      const result = await userService.uploadAvatar(file);
      return result;
    },
    onSuccess: (result) => {
      if (user) {
        setUser({ ...user, avatarUrl: result.url });
      }
      toast.success('Foto profil berhasil diperbarui');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal mengupload foto');
    },
  });

  return {
    uploadAvatar: mutation.mutate,
    isUploading: mutation.isPending,
  };
}
