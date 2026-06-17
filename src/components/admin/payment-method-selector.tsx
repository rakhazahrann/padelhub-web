'use client';

import { Banknote, CreditCard, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type WalkInPaymentMethod = 'CASH' | 'DEBIT' | 'TRANSFER';

const METHODS: { value: WalkInPaymentMethod; label: string; icon: typeof Banknote; desc: string }[] = [
  { value: 'CASH', label: 'Tunai', icon: Banknote, desc: 'Bayar langsung di tempat' },
  { value: 'DEBIT', label: 'Debit', icon: CreditCard, desc: 'Kartu debit / ATM' },
  { value: 'TRANSFER', label: 'Transfer', icon: Building2, desc: 'Mobile banking / QRIS' },
];

interface PaymentMethodSelectorProps {
  value: WalkInPaymentMethod;
  onChange: (method: WalkInPaymentMethod) => void;
  disabled?: boolean;
}

export function PaymentMethodSelector({ value, onChange, disabled }: PaymentMethodSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {METHODS.map((method) => {
        const Icon = method.icon;
        const isSelected = value === method.value;
        return (
          <button
            key={method.value}
            type="button"
            onClick={() => onChange(method.value)}
            disabled={disabled}
            className={cn(
              'flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all cursor-pointer',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/30',
              isSelected
                ? 'border-secondary bg-secondary/10 text-secondary'
                : 'border-border/60 bg-card text-muted-foreground hover:border-secondary/40 hover:text-foreground',
              disabled && 'opacity-50 cursor-not-allowed',
            )}
          >
            <Icon className={cn('h-6 w-6', isSelected ? 'text-secondary' : 'text-muted-foreground')} />
            <span className={cn('text-sm font-bold', isSelected && 'text-secondary')}>{method.label}</span>
            <span className="text-[10px] text-muted-foreground/70 leading-tight text-center">{method.desc}</span>
          </button>
        );
      })}
    </div>
  );
}

export function formatPaymentMethod(method: WalkInPaymentMethod): string {
  const map: Record<WalkInPaymentMethod, string> = {
    CASH: 'Tunai',
    DEBIT: 'Debit',
    TRANSFER: 'Transfer',
  };
  return map[method];
}
