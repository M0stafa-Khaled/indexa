export function generateWebsiteSchema(url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Indexa',
    description: 'A hierarchical, authenticated information indexing platform',
    url: url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateOrganizationSchema(url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Indexa',
    url: url,
    logo: `${url}/logo.svg`,
    description: 'Organize Your Digital World with hierarchical information indexing',
    sameAs: [
      // Add your social media profiles here
      // 'https://twitter.com/indexa',
      // 'https://github.com/indexa',
    ],
  };
}

export function generateWebApplicationSchema(url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Indexa',
    description: 'A hierarchical, authenticated information indexing platform',
    url: url,
    applicationCategory: 'ProductivityApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
    },
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
