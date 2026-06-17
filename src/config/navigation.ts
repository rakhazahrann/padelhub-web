import {
  CalendarDays,
  ClipboardList,
  CreditCard,
  FileText,
  Home,
  Info,
  LayoutDashboard,
  MapPin,
  MessageCircle,
  Percent,
  ScrollText,
  Settings,
  Shield,
  Star,
  Users,
  BarChart3,
  HelpCircle,
  UserPlus,
} from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const customerNav: NavItem[] = [
  { label: 'Jadwal Lapangan', href: '/venues', icon: CalendarDays },
  { label: 'Pemesanan Saya', href: '/bookings', icon: ClipboardList },
];

export const landingNav: { label: string; href: string; icon: LucideIcon; isAnchor?: boolean }[] = [
  { label: 'Beranda', href: '/', icon: Home },
  { label: 'Jadwal', href: '/#jadwal', icon: CalendarDays, isAnchor: true },
  { label: 'Cara Booking', href: '/#cara-booking', icon: Info, isAnchor: true },
  { label: 'Promo', href: '/#promo', icon: Percent, isAnchor: true },
  { label: 'Testimonial', href: '/#testimonial', icon: Star, isAnchor: true },
  { label: 'FAQ', href: '/#faq', icon: HelpCircle, isAnchor: true },
  { label: 'Hubungi Kami', href: '/#kontak', icon: MessageCircle, isAnchor: true },
];

export const adminNav: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Kalender', href: '/admin/calendar', icon: CalendarDays },
  { label: 'Booking', href: '/admin/bookings', icon: ClipboardList },
  { label: 'Walk-In', href: '/admin/walkin', icon: UserPlus },
  { label: 'Pelanggan', href: '/admin/customers', icon: Users },
  { label: 'Harga', href: '/admin/pricing', icon: CreditCard },
  { label: 'Laporan', href: '/admin/reports', icon: BarChart3 },
  { label: 'Pengaturan', href: '/admin/settings', icon: Settings },
];

export const superAdminNav: NavItem[] = [
  { label: 'Dashboard', href: '/super-admin/dashboard', icon: LayoutDashboard },
  { label: 'Venue', href: '/super-admin/venues', icon: MapPin },
  { label: 'Admin', href: '/super-admin/admins', icon: Shield },
  { label: 'Laporan', href: '/super-admin/reports', icon: BarChart3 },
  { label: 'Konfigurasi', href: '/super-admin/config', icon: Settings },
  { label: 'Audit Log', href: '/super-admin/audit-log', icon: ScrollText },
];
