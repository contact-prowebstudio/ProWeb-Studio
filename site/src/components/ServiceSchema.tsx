import Script from 'next/script';

// Helper function to build absolute URLs safely
const SITE_URL =
  process.env.SITE_URL ??
  process.env.NEXT_PUBLIC_SITE_URL ??
  'https://prowebstudio.nl';

interface Service {
  name: string;
  description: string;
  serviceType?: string;
}

interface ServiceSchemaProps {
  services: Service[];
}

export default function ServiceSchema({ services }: ServiceSchemaProps) {
  const serviceSchemas = services.map((service) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.name,
    "description": service.description,
    ...(service.serviceType && { "serviceType": service.serviceType }),
    "provider": {
      "@id": `${SITE_URL.replace(/\/$/, '')}#organization`
    },
    "areaServed": "NL",
    "inLanguage": "nl-NL"
  }));

  return (
    <>
      {serviceSchemas.map((schema, index) => (
        <Script
          key={index}
          id={`service-schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 0)
          }}
        />
      ))}
    </>
  );
}