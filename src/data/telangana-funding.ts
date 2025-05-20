export interface FundingOpportunity {
  id: string;
  title: string;
  provider: string;
  description: string;
  fundingType: 'Grant' | 'Loan' | 'Equity' | 'Subsidy' | 'Mixed';
  amount: string;
  eligibility: string[];
  applicationProcess: string;
  contactInfo: string;
  website: string;
  category: 'Government' | 'Private' | 'Bank' | 'NGO' | 'International';
}

export const telanganaFundingOpportunities: FundingOpportunity[] = [
  {
    id: "wehub-pre-incubation",
    title: "WE-HUB Pre-Incubation Program",
    provider: "WE-HUB, Government of Telangana",
    description: "8-week program offering mentorship, networking, and business development support for women entrepreneurs with innovative ideas in early stages.",
    fundingType: "Grant",
    amount: "Up to ₹5 lakhs for selected businesses",
    eligibility: [
      "Women entrepreneurs with innovative business ideas",
      "Idea or early prototype stage",
      "Registered in Telangana"
    ],
    applicationProcess: "Online application through the WE-HUB website, quarterly selection cycles",
    contactInfo: "preincubation@wehub.telangana.gov.in",
    website: "https://wehub.telangana.gov.in/",
    category: "Government"
  },
  {
    id: "wehub-incubation",
    title: "WE-HUB Incubation Program",
    provider: "WE-HUB, Government of Telangana",
    description: "12-month program for established women-led startups seeking to scale with access to funding, mentorship, and market connections.",
    fundingType: "Mixed",
    amount: "Access to funding of up to ₹25 lakhs through partner investors/grants",
    eligibility: [
      "Women-owned businesses with established product/service",
      "Some market traction",
      "Scalable business model",
      "Registered in Telangana"
    ],
    applicationProcess: "Competitive selection through online application and pitch presentations",
    contactInfo: "incubation@wehub.telangana.gov.in",
    website: "https://wehub.telangana.gov.in/",
    category: "Government"
  },
  {
    id: "wehub-acceleration",
    title: "WE-HUB Acceleration Program",
    provider: "WE-HUB, Government of Telangana",
    description: "6-month program focused on scaling women-led businesses with established revenue streams and connecting them with growth funding.",
    fundingType: "Equity",
    amount: "Connects entrepreneurs with growth funding of ₹25 lakhs to ₹2 crores",
    eligibility: [
      "Women-owned businesses in growth phase",
      "Established revenue stream",
      "Scalable business model",
      "Registered in Telangana"
    ],
    applicationProcess: "Application, screening, and selection by investment committee",
    contactInfo: "acceleration@wehub.telangana.gov.in",
    website: "https://wehub.telangana.gov.in/",
    category: "Government"
  },
  {
    id: "tswdc-edp",
    title: "TSWDC Entrepreneurship Development Program",
    provider: "Telangana State Women's Development Corporation",
    description: "Comprehensive support program for women starting small businesses including training, financial assistance, and ongoing mentorship.",
    fundingType: "Loan",
    amount: "Loans up to ₹20 lakhs with 35% subsidy component at 4% interest rate",
    eligibility: [
      "Women in Telangana between 18-55 years",
      "Viable business plan",
      "Preference to economically disadvantaged women"
    ],
    applicationProcess: "Submit application to TSWDC through local office",
    contactInfo: "ed@tswdc.telangana.gov.in",
    website: "https://www.tgwdcw.telangana.gov.in/",
    category: "Government"
  },
  {
    id: "tswdc-stree-shakti",
    title: "TSWDC Stree Shakti Package",
    provider: "Telangana State Women's Development Corporation",
    description: "Special program for women entrepreneurs in small enterprises with simplified loan procedures and business development support.",
    fundingType: "Loan",
    amount: "Loans up to ₹10 lakhs with simplified procedures",
    eligibility: [
      "Women entrepreneurs in Telangana",
      "Small-scale enterprises",
      "Viable business plan"
    ],
    applicationProcess: "Apply through TSWDC district offices",
    contactInfo: "streesakti@tswdc.telangana.gov.in",
    website: "https://www.tgwdcw.telangana.gov.in/",
    category: "Government"
  },
  {
    id: "stree-nidhi-business-loan",
    title: "Stree Nidhi Business Loan",
    provider: "Stree Nidhi Credit Cooperative Federation",
    description: "Quick-disbursing loans for women entrepreneurs who are members of Self-Help Groups (SHGs) in Telangana.",
    fundingType: "Loan",
    amount: "₹50,000 to ₹5 lakhs with flexible repayment options",
    eligibility: [
      "Active member of a registered SHG for at least 2 years",
      "Resident of Telangana",
      "Valid business proposal"
    ],
    applicationProcess: "Apply through local SHG/VO/Mandal Samakhya",
    contactInfo: "info@streenidhicoop.in",
    website: "https://tgstreenidhicreditcoop.telangana.gov.in/",
    category: "Government"
  },
  {
    id: "t-fund-women",
    title: "T-Fund Women Entrepreneur Grant",
    provider: "Government of Telangana",
    description: "Government of Telangana fund specifically for women in technology and innovation sectors to promote cutting-edge solutions.",
    fundingType: "Grant",
    amount: "Grants up to ₹25 lakhs for technology ventures",
    eligibility: [
      "Women-owned tech startups (51% or more ownership)",
      "Registered in Telangana",
      "Innovative technology solution",
      "Market-ready product"
    ],
    applicationProcess: "Online application through T-Hub website, quarterly selection cycles",
    contactInfo: "women@t-hub.co",
    website: "https://t-hub.co/",
    category: "Government"
  },
  {
    id: "sidbi-mahila-udyam-nidhi",
    title: "Mahila Udyam Nidhi Scheme",
    provider: "Small Industries Development Bank of India (SIDBI)",
    description: "Financial assistance for women entrepreneurs starting small-scale ventures or upgrading existing projects.",
    fundingType: "Loan",
    amount: "Up to ₹10 lakhs with repayment period of 10 years",
    eligibility: [
      "Women entrepreneurs starting new ventures or upgrading existing ones",
      "Small-scale industries as defined by MSME guidelines",
      "Viable business proposal"
    ],
    applicationProcess: "Apply through SIDBI Hyderabad branch or partner financial institutions",
    contactInfo: "hyderabad@sidbi.in",
    website: "https://www.sidbi.in/",
    category: "Bank"
  },
  {
    id: "mudra-yojana",
    title: "Mudra Yojana Scheme for Women",
    provider: "Micro Units Development & Refinance Agency (MUDRA)",
    description: "Loans for women starting small enterprises like beauty parlors, tuition centers, tailoring units, with special focus on Telangana applicants.",
    fundingType: "Loan",
    amount: "₹50,000 to ₹10 lakhs across three categories: Shishu, Kishor, and Tarun",
    eligibility: [
      "Women entrepreneurs starting or expanding small businesses",
      "No collateral required for loans up to ₹10 lakhs",
      "Viable business plan"
    ],
    applicationProcess: "Apply through any nationalized bank, regional bank, or MFI in Telangana",
    contactInfo: "Contact your nearest bank branch",
    website: "https://www.mudra.org.in/",
    category: "Government"
  },
  {
    id: "wehub-challenge",
    title: "Telangana WE Hub X WomenIn Challenge",
    provider: "WE-HUB, Government of Telangana",
    description: "Annual competition for women entrepreneurs in Telangana with cash grants and incubation support for winners.",
    fundingType: "Grant",
    amount: "Grants of ₹5 lakhs for winners plus incubation support",
    eligibility: [
      "Women-led startups registered in Telangana",
      "Innovative business concept",
      "Potential for social impact"
    ],
    applicationProcess: "Online application during annual call for proposals",
    contactInfo: "challenge@wehub.telangana.gov.in",
    website: "https://wehub.telangana.gov.in/",
    category: "Government"
  },
  {
    id: "tsic-challenge",
    title: "Telangana Social Innovation Challenge",
    provider: "Telangana State Innovation Cell",
    description: "Competition for social impact ventures with a special track for women entrepreneurs addressing challenges in Telangana.",
    fundingType: "Grant",
    amount: "Grants up to ₹10 lakhs plus incubation support",
    eligibility: [
      "Women-led social enterprises addressing challenges in Telangana",
      "Innovative solution with social impact",
      "Scalable model"
    ],
    applicationProcess: "Online application during challenge period (usually announced in January)",
    contactInfo: "socialchallenge@telangana.gov.in",
    website: "https://tsic.telangana.gov.in/",
    category: "Government"
  },
  {
    id: "she-capital-investment",
    title: "She Capital Investment",
    provider: "She Capital",
    description: "Fund exclusively for women entrepreneurs focusing on consumer products, healthcare, and education sectors in India with specific interest in Telangana ventures.",
    fundingType: "Equity",
    amount: "Investments between ₹1 crore and ₹3 crores",
    eligibility: [
      "Women-founded businesses (51% or more ownership)",
      "Product-market fit and revenue traction",
      "Scalable business in consumer, healthcare, or education sectors"
    ],
    applicationProcess: "Online application followed by screening",
    contactInfo: "apply@shecapital.in",
    website: "https://shecapital.in/",
    category: "Private"
  },
  {
    id: "sbi-cent-stree-shakti",
    title: "SBI Stree Shakti Package",
    provider: "State Bank of India",
    description: "Specialized loan package for women entrepreneurs running production or service enterprises with concessions on interest rates.",
    fundingType: "Loan",
    amount: "Up to ₹25 lakhs with 0.5% concession on interest rate",
    eligibility: [
      "Women entrepreneurs (majority ownership)",
      "Established business or viable new proposal",
      "Good credit history"
    ],
    applicationProcess: "Apply through any SBI branch in Telangana",
    contactInfo: "Nearest SBI branch in Telangana",
    website: "https://sbi.co.in/",
    category: "Bank"
  },
  {
    id: "telangana-csr-fund",
    title: "Telangana CSR Fund for Women Entrepreneurs",
    provider: "Telangana CSR Authority",
    description: "Matches women entrepreneurs with corporate CSR initiatives for funding, particularly in rural areas and traditional craft sectors.",
    fundingType: "Grant",
    amount: "₹2 lakhs to ₹10 lakhs based on project requirements",
    eligibility: [
      "Women entrepreneurs from rural Telangana",
      "Businesses with social impact",
      "Traditional crafts and cultural enterprises preferred"
    ],
    applicationProcess: "Online application through Telangana CSR portal with project proposal",
    contactInfo: "csrfund@telangana.gov.in",
    website: "https://tgcsr.telangana.gov.in/",
    category: "Government"
  },
  {
    id: "tie-women-fund",
    title: "TiE Women Entrepreneur Fund - Hyderabad",
    provider: "TiE Hyderabad",
    description: "Seed funding and mentorship program specifically for women entrepreneurs in Telangana through the TiE Network.",
    fundingType: "Mixed",
    amount: "Initial funding of ₹5-10 lakhs with potential follow-on investment",
    eligibility: [
      "Women entrepreneurs in Telangana",
      "Innovative business concept",
      "Technology-enabled solution preferred"
    ],
    applicationProcess: "Application, screening, and pitch to TiE investor panel",
    contactInfo: "women@tie-hyderabad.org",
    website: "https://hyderabad.tie.org/",
    category: "Private"
  }
];