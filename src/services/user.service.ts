import { apiClient } from '@/services/api-client';

export const userService = {
  async uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiClient.patch('/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data.data as { url: string };
  },
};
