'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreditCard, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const bookingFormSchema = z.object({
  customerName: z.string().min(2, 'Nama minimal 2 karakter'),
  customerPhone: z
    .string()
    .min(10, 'Nomor telepon minimal 10 digit')
    .regex(/^[0-9+-\s]+$/, 'Format nomor telepon tidak valid'),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;

interface BookingFormProps {
  defaultValues: BookingFormValues;
  onSubmit: (values: BookingFormValues) => void;
  isLoading: boolean;
}

export function BookingForm({ defaultValues, onSubmit, isLoading }: BookingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="customerName">Nama Lengkap Pemain</Label>
        <Input
          id="customerName"
          type="text"
          placeholder="Nama Pemain Utama"
          disabled={isLoading}
          aria-invalid={!!errors.customerName}
          {...register('customerName')}
        />
        {errors.customerName && (
          <p className="text-xs font-medium text-destructive">{errors.customerName.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="customerPhone">Nomor Telepon WhatsApp</Label>
        <Input
          id="customerPhone"
          type="tel"
          placeholder="Contoh: 081234567890"
          disabled={isLoading}
          aria-invalid={!!errors.customerPhone}
          {...register('customerPhone')}
        />
        {errors.customerPhone && (
          <p className="text-xs font-medium text-destructive">{errors.customerPhone.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full gap-2 py-5" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="h-4.5 w-4.5 animate-spin" />
            Memproses Pemesanan...
          </>
        ) : (
          <>
            <CreditCard className="h-4.5 w-4.5" />
            Lanjutkan Ke Pembayaran
          </>
        )}
      </Button>
    </form>
  );
}
