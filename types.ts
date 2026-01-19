export enum UserRole {
  ADMIN = 'ADMIN',
  BUSINESS = 'BUSINESS'
}

export enum PlanType {
  STARTER = 'STARTER',
  GROWTH = 'GROWTH',
  ENTERPRISE = 'ENTERPRISE'
}

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  PAID = 'PAID',
  REJECTED = 'REJECTED'
}

export enum WAConnectionStatus {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED'
}

export interface AIConfig {
  systemPrompt: string;
  temperature: number;
  faqs: { question: string; answer: string }[];
  isActive: boolean;
}

export interface Subscription {
  plan: PlanType;
  amount: number; // In Naira
  status: PaymentStatus;
  validUntil?: string;
  paymentProofUrl?: string; // Mock URL or base64
}

export interface User {
  id: string;
  email: string;
  businessName: string;
  phone: string;
  role: UserRole;
  subscription: Subscription;
  waStatus: WAConnectionStatus;
  waPhoneNumber?: string;
  aiConfig: AIConfig;
  createdAt: string;
}

export interface DashboardStats {
  totalMessages: number;
  aiReplies: number;
  savedHours: number;
}