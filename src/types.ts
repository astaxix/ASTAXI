
import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  image?: string;
}

export interface BookingDetails {
  id?: string;
  pickup: string;
  destination: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  passengers: number;
  vehicleType: string;
  price: number;
  status: 'confirmed' | 'cancelled';
  createdAt?: any;
  hasTrailer?: boolean;
  paymentMethod?: string;
}

export interface BookingServiceOption {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  pricePerKm: number;
  icon: LucideIcon;
  capacity: number;
  eta: number;
}

export type PaymentMethod = 'cash' | 'card' | 'invoice';

export interface Review {
  id: string;
  name: string;
  message: string;
  rating: number;
  date: string;
  source: 'local' | 'google';
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface NewsPost {
  id: string;
  title: string;
  content: string;
  date: string;
  image?: string;
}
