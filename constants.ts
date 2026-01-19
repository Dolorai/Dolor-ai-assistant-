import { PlanType } from "./types";

export const PLANS = {
  [PlanType.STARTER]: {
    name: 'Starter',
    price: 5000,
    features: ['1 WhatsApp Number', '1,000 AI Replies/mo', 'Basic Support', 'Standard Response Speed']
  },
  [PlanType.GROWTH]: {
    name: 'Growth',
    price: 10000,
    features: ['3 WhatsApp Numbers', '10,000 AI Replies/mo', 'Priority Support', 'Advanced Logic']
  },
  [PlanType.ENTERPRISE]: {
    name: 'Enterprise',
    price: 25000,
    features: ['Unlimited Numbers', 'Unlimited AI Replies', 'Dedicated Account Manager', 'Custom API Integrations']
  }
};

export const BANK_DETAILS = {
  bankName: "Zenith Bank",
  accountNumber: "1234567890",
  accountName: "Dolor SaaS Ltd"
};