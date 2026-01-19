import { User, UserRole, PlanType, PaymentStatus, WAConnectionStatus } from "../types";

// Initial Mock Data
export const MOCK_ADMIN: User = {
  id: 'admin-001',
  email: 'admin@dolor.ai',
  businessName: 'Dolor HQ Admin',
  phone: '0000000000',
  role: UserRole.ADMIN,
  subscription: {
    plan: PlanType.ENTERPRISE,
    amount: 0,
    status: PaymentStatus.PAID,
  },
  waStatus: WAConnectionStatus.DISCONNECTED,
  aiConfig: {
    systemPrompt: '',
    temperature: 0.7,
    faqs: [],
    isActive: false
  },
  createdAt: new Date().toISOString()
};

const DEFAULT_AI_CONFIG = {
  systemPrompt: "You are a helpful customer support assistant. Your goal is to answer questions professionally and assist customers with their inquiries regarding our products and services.",
  temperature: 0.7,
  faqs: [
    { question: "What are your opening hours?", answer: "We are open from 9:00 AM to 5:00 PM, Monday to Friday." },
    { question: "How can I contact support?", answer: "You can call us at our business number or send an email to support@example.com." }
  ],
  isActive: false
};

export const createNewUser = (email: string, businessName: string, phone: string, plan: PlanType, amount: number): User => ({
  id: `user-${Date.now()}`,
  email,
  businessName,
  phone,
  role: UserRole.BUSINESS,
  subscription: {
    plan,
    amount,
    status: PaymentStatus.UNPAID
  },
  waStatus: WAConnectionStatus.DISCONNECTED,
  aiConfig: DEFAULT_AI_CONFIG,
  createdAt: new Date().toISOString()
});