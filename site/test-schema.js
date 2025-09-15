// Quick test to verify LocalBusinessSchema JSON-LD structure
const siteConfig = {
  name: 'ProWeb Studio',
  url: 'https://prowebstudio.nl',
  description: 'Professional website development',
  phone: '+31 123 456 789',
  email: 'contact@prowebstudio.nl',
  social: {
    linkedin: 'https://linkedin.com/company/prowebstudio',
    github: 'https://github.com/prowebstudio',
    twitter: 'https://twitter.com/prowebstudio'
  }
};

// Test with no address (our new logic)
function generateSchema({ kvkNumber, vatID, serviceArea, openingHours }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.url}#business`,
    name: siteConfig.name,
    url: siteConfig.url,
    telephone: siteConfig.phone,
    email: siteConfig.email,
  };

  if (vatID) {
    structuredData.vatID = vatID;
  }

  if (kvkNumber) {
    structuredData.identifier = {
      "@type": "PropertyValue",
      propertyID: "KVK",
      value: kvkNumber,
    };
    structuredData.kvkNumber = kvkNumber;
  }

  // No address mode - use serviceArea
  if (serviceArea?.length) {
    const mappedAreas = serviceArea.map((area) => ({
      "@type": "AdministrativeArea",
      name: area,
    }));
    structuredData.areaServed = mappedAreas;
    structuredData.serviceArea = mappedAreas;
  }

  if (openingHours?.length) {
    structuredData.openingHours = openingHours;
  }

  return structuredData;
}

// Test our implementation
const kvk = process.env.NEXT_PUBLIC_KVK || '93769865';
const btw = process.env.NEXT_PUBLIC_BTW || 'NL005041113B60';
const nlServiceArea = ['Netherlands', 'Amsterdam', 'Rotterdam', 'Utrecht', 'Den Haag', 'Eindhoven'];

const testSchema = generateSchema({
  kvkNumber: kvk,
  vatID: btw,
  serviceArea: nlServiceArea,
  openingHours: ['Mo-Fr 09:00-17:00']
});

console.log('Generated LocalBusiness Schema:');
console.log(JSON.stringify(testSchema, null, 2));

// Validate key requirements
console.log('\n✅ Validation:');
console.log('- vatID present:', !!testSchema.vatID);
console.log('- KVK identifier present:', !!testSchema.identifier);
console.log('- No address field:', !testSchema.address);
console.log('- ServiceArea present:', !!testSchema.serviceArea);
console.log('- AreaServed present:', !!testSchema.areaServed);
