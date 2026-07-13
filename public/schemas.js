// Static schemas for Menajul Hoque Portfolio
// Externalized to allow strict CSP without 'unsafe-inline' on scripts

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://menajul.com/#person",
  "name": "Menajul Hoque",
  "url": "https://menajul.com",
  "image": "https://menajul.com/profile-picture-png.png",
  "description": "Data Engineer and Applied AI developer specializing in enterprise data architectures (SAP Datasphere, BTP) and custom AI agents/automation pipelines.",
  "jobTitle": "Data & Applied AI Engineer",
  "worksFor": {
    "@type": "Organization",
    "name": "Capgemini"
  },
  "alumniOf": {
    "@type": "EducationalOrganization",
    "name": "Jadavpur University"
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Kolkata",
    "addressCountry": "India"
  },
  "sameAs": [
    "https://github.com/MinHackerz",
    "https://www.linkedin.com/in/menajul-hoque/",
    "https://x.com/MenajulM",
    "https://peerlist.io/menajul"
  ],
  "knowsAbout": [
    "AI Engineering", "RAG", "Vector Search", "LLMs", "AI Agents", "AI Automation", "MCP Server",
    "Data Engineering", "SAP Datasphere", "SAP Business Data Cloud", "SAP BODS", "SQL", "Python",
    "Web Development", "React", "Next.js", "WordPress", "Tailwind CSS",
    "Mobile App Development", "Dart", "Flutter", "Firestore",
    "Growth & SEO", "GEO", "Digital Marketing", "Search Console", "Google Analytics", "Microsoft Clarity",
    "AdTech", "Google AdSense", "Google Ads", "Meta Ads", "Google AdMob"
  ],
  "creativeWorkStatus": "Active",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Personal Projects",
    "itemListElement": [
      {
        "@type": "CreativeWork",
        "name": "Rasid",
        "description": "Advanced verification-protected invoicing platform.",
        "url": "https://rasid.in"
      },
      {
        "@type": "CreativeWork",
        "name": "SEOBoostr",
        "description": "Enterprise-grade SEO audit and monitoring system.",
        "url": "https://github.com/MinHackerz/seoboostr"
      },
      {
        "@type": "CreativeWork",
        "name": "Govt Procurement Intelligence",
        "description": "Data analytics pipeline for central procurement contracts.",
        "url": "https://github.com/MinHackerz/govt_procurement"
      },
      {
        "@type": "CreativeWork",
        "name": "Tadabbur",
        "description": "Premium Quranic workspace companion built on Quran Foundation SDK.",
        "url": "https://tadabbur-iota.vercel.app/"
      },
      {
        "@type": "CreativeWork",
        "name": "PDF Signature Validator",
        "description": "Cryptographic PDF digital signature checker.",
        "url": "https://pdfsigncheck.com"
      },
      {
        "@type": "CreativeWork",
        "name": "VidStats",
        "description": "AI-powered YouTube analytics platform.",
        "url": "https://vidstats.pro"
      },
      {
        "@type": "CreativeWork",
        "name": "NotifyVault",
        "description": "Secure SQLite & Flutter notification manager.",
        "url": "https://github.com/MinHackerz/notifyvault"
      }
    ]
  }
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Menajul Hoque Portfolio",
  "url": "https://menajul.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://menajul.com/?s={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Menajul Hoque Consulting",
  "url": "https://menajul.com",
  "logo": "https://menajul.com/profile-picture-png.png",
  "sameAs": [
    "https://github.com/MinHackerz",
    "https://www.linkedin.com/in/menajul-hoque/",
    "https://x.com/MenajulM"
  ]
};

const profilePageSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "mainEntity": {
    "@id": "https://menajul.com/#person"
  },
  "datePublished": "2025-01-01T08:00:00+05:30",
  "dateModified": "2026-07-14T01:45:37+05:30"
};

function injectSchema(schema) {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(schema);
  document.head.appendChild(script);
}

// Inject all schemas programmatically
injectSchema(personSchema);
injectSchema(websiteSchema);
injectSchema(orgSchema);
injectSchema(profilePageSchema);
