export const siteConfig = {
  name: process.env.SITE_NAME || 'ProWeb Studio',
  tagline: 'Digitale innovatie met kosmische impact',
  description:
    'Wij ontwerpen en bouwen snelle, veilige en schaalbare 3D‑websites die scoren in Google en converteren.',
  url: process.env.SITE_URL || 'https://prowebstudio.nl',
  email: process.env.CONTACT_INBOX || 'contact@prowebstudio.nl',
  phone: '+31686412430',
  social: {
    linkedin: 'https://linkedin.com/company/proweb-studio',
    github: 'https://github.com/proweb-studio',
    twitter: 'https://twitter.com/prowebstudio_nl',
  },
  navigation: [
    { name: 'Home', href: '/' },
    { name: 'Diensten', href: '/diensten' },
    { name: 'Over Ons', href: '/over-ons' },
    { name: 'Speeltuin', href: '/speeltuin' },
    { name: 'Werkwijze', href: '/werkwijze' },
    { name: 'Contact', href: '/contact' },
  ],
  links: {
    calcom: process.env.NEXT_PUBLIC_CALCOM_URL || 'https://cal.com/your-handle',
  },
  analytics: {
    plausibleDomain:
      process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || 'prowebstudio.nl',
  },
  contact: {
    inbox: process.env.CONTACT_INBOX || 'contact@prowebstudio.nl',
  },
};

export type SiteConfig = typeof siteConfig;
