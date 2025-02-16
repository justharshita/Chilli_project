import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Company authentication utilities
export function getCompanyInfo() {
  if (typeof window === 'undefined') return null;
  
  const info = localStorage.getItem('companyInfo');
  if (!info) return null;
  
  try {
    return JSON.parse(info);
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return !!getCompanyInfo();
}

// API request utilities
export async function fetchWithCompanyInfo(url: string, options: RequestInit = {}) {
  const companyInfo = getCompanyInfo();
  
  if (!companyInfo) {
    throw new Error('No company authentication found');
  }

  const headers = {
    ...options.headers,
    'x-company-info': JSON.stringify(companyInfo)
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (response.status === 401) {
    // Clear invalid authentication
    localStorage.removeItem('companyInfo');
    throw new Error('Authentication expired');
  }

  return response;
}
