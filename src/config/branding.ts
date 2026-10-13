export interface BrandingConfig {
  appName: string;
  brandName: string;
  tagline: string;
  companyUrl: string;
  logoText: string;
  version: string;
  colors: {
    primary: string;
    primaryGradient: string;
    secondary: string;
    sidebarGradient: string;
  };
  fontFamily: string;
  supportEmail: string;
  demoNotice: string;
}

export const BRANDING: BrandingConfig = {
  appName: 'Hotel Management ERP',
  brandName: 'InfinexLoop',
  tagline: 'Enterprise Property Management & Guest Operations Platform',
  companyUrl: 'https://infinexloop.com',
  logoText: 'InfinexLoop PMS',
  version: 'v2.4.0 (Enterprise Demo)',
  colors: {
    primary: '#2563EB', // Blue 600
    primaryGradient: 'from-blue-600 to-indigo-700',
    secondary: '#7C3AED', // Purple 600
    sidebarGradient: 'from-blue-600 via-indigo-600 to-purple-700',
  },
  fontFamily: 'Inter, system-ui, sans-serif',
  supportEmail: 'contact@infinexloop.com',
  demoNotice: 'InfinexLoop Interactive Sales Demonstration',
};
