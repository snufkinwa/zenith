// Map company slugs to their primary domains for logo fetching
export const companyDomains: Record<string, string> = {
  'google': 'google.com',
  'amazon': 'amazon.com',
  'facebook': 'meta.com',
  'microsoft': 'microsoft.com',
  'bloomberg': 'bloomberg.com',
  'tcs': 'tcs.com',
  'apple': 'apple.com',
  'visa': 'visa.com',
  'infosys': 'infosys.com',
  'accenture': 'accenture.com',
  'spotify': 'spotify.com',
  'oracle': 'oracle.com',
  'walmart-labs': 'walmart.com',
  'ibm': 'ibm.com',
  'goldman-sachs': 'goldmansachs.com',
  'epam-systems': 'epam.com',
  'sap': 'sap.com',
  'salesforce': 'salesforce.com',
  'yandex': 'yandex.com',
  'zoho': 'zoho.com',
  'nvidia': 'nvidia.com',
  'intel': 'intel.com',
  'tiktok': 'tiktok.com',
  'hubspot': 'hubspot.com',
  'linkedin': 'linkedin.com',
  'wipro': 'wipro.com',
  'comcast': 'comcast.com',
  'western-digital': 'westerndigital.com',
  'doordash': 'doordash.com',
  'accolite': 'accolite.com',
  'american-express': 'americanexpress.com',
  'persistent-systems': 'persistent.com',
  'capgemini': 'capgemini.com',
  'snowflake': 'snowflake.com',
  'tekion': 'tekion.com',
  'pwc': 'pwc.com',
  'deloitte': 'deloitte.com',
  'adobe': 'adobe.com',
  'samsung': 'samsung.com',
  'yahoo': 'yahoo.com',
  'uber': 'uber.com',
  'ebay': 'ebay.com',
  'servicenow': 'servicenow.com',
  'paypal': 'paypal.com',
  'epic-systems': 'epic.com',
  'karat': 'karat.com',
  'hcl': 'hcltech.com',
  'tinkoff': 'tinkoff.ru',
  'kla': 'kla.com'
};

// Get company logo URL using Clearbit
export const getCompanyLogo = (companySlug: string, size: number = 64): string => {
  const domain = companyDomains[companySlug];
  if (domain) {
    return `https://logo.clearbit.com/${domain}?size=${size}&format=png`;
  }
  
  // Fallback for unknown companies - use a default icon or initials
  return getLogoFallback(companySlug, size);
};

// Fallback logo generation
export const getLogoFallback = (companySlug: string, size: number = 64): string => {
  // Convert slug to initials (e.g., "goldman-sachs" -> "GS")
  const initials = companySlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
  
  // Generate a simple SVG with initials
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#6B7280" rx="8"/>
      <text x="50%" y="50%" text-anchor="middle" dy="0.35em" 
            fill="white" font-family="Arial, sans-serif" 
            font-size="${size * 0.4}" font-weight="bold">
        ${initials}
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

// Check if logo exists (optional - for better UX)
export const checkLogoExists = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

// Get logo with fallback handling
export const getCompanyLogoWithFallback = async (
  companySlug: string, 
  size: number = 64
): Promise<string> => {
  const primaryUrl = getCompanyLogo(companySlug, size);
  
  const exists = await checkLogoExists(primaryUrl);
  
  if (exists) {
    return primaryUrl;
  }
  
  return getLogoFallback(companySlug, size);
};