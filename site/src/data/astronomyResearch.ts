export type SchoolId =
  | 'arizona'
  | 'caltech'
  | 'berkeley'
  | 'mit'
  | 'princeton'
  | 'ut-austin'
  | 'harvard';

export type School = {
  id: SchoolId;
  name: string;
  location: string;
  objectiveRank?: number;
  objectiveScore?: number;
  strengths: {
    research: number;
    curriculum: number;
    affordability: number;
    observatory: number;
    merit: number;
    publicValue: number;
  };
  badges: string[];
  highlights: string[];
  caution: string;
};

export type StudentProfile = {
  id: string;
  label: string;
  summary: string;
  recommended: SchoolId[];
  rationale: string;
};

export const topObjectiveRankings = [
  { name: 'UC Berkeley', score: 90.9 },
  { name: 'University of Arizona', score: 63.7 },
  { name: 'Caltech', score: 49.4 },
  { name: 'MIT', score: 48.4 },
  { name: 'Princeton', score: 44.2 },
  { name: 'University of Maryland, College Park', score: 30.6 },
  { name: 'University of Colorado Boulder', score: 27.1 },
  { name: 'UT Austin', score: 17.7 },
  { name: 'University of Hawaii at Manoa', score: 15.6 },
  { name: 'Johns Hopkins', score: 15.6 },
];

export const schools: School[] = [
  {
    id: 'arizona',
    name: 'University of Arizona',
    location: 'Tucson, Arizona',
    objectiveRank: 2,
    objectiveScore: 63.7,
    strengths: {
      research: 4.5,
      curriculum: 5,
      affordability: 4,
      observatory: 5,
      merit: 5,
      publicValue: 5,
    },
    badges: ['Best overall balance', 'Observatory ecosystem', 'Merit optionality'],
    highlights: [
      'Strong integration of observational coursework and required research credit.',
      'Best public-university observatory ecosystem and recurring hands-on access in the synthesis.',
      'Strongest astronomy-relevant scholarship breadth and merit-route optionality in the report.',
    ],
    caution:
      'Net price still depends on residency, merit profile, and access to competitive research slots.',
  },
  {
    id: 'caltech',
    name: 'Caltech',
    location: 'Pasadena, California',
    objectiveRank: 3,
    objectiveScore: 49.4,
    strengths: {
      research: 5,
      curriculum: 5,
      affordability: 5,
      observatory: 4.5,
      merit: 2.5,
      publicValue: 2,
    },
    badges: ['Elite research intensity', 'Structured output pipeline', 'High-need aid strength'],
    highlights: [
      'Very high rigor with instrumentation lab and thesis-centered training.',
      'One of the clearest undergrad research-to-output pipelines in the dataset.',
      'Listed among the strongest high-need financial-aid outcomes.',
    ],
    caution: 'Admissions are ultra-selective and private-school sticker price is high before aid.',
  },
  {
    id: 'berkeley',
    name: 'UC Berkeley',
    location: 'Berkeley, California',
    objectiveRank: 1,
    objectiveScore: 90.9,
    strengths: {
      research: 5,
      curriculum: 4.5,
      affordability: 3.5,
      observatory: 4.5,
      merit: 4,
      publicValue: 4.5,
    },
    badges: ['Top objective rank', 'Research pipeline', 'Public value hedge'],
    highlights: [
      'Broad astrophysics curriculum with multiple undergraduate research entry points.',
      'Alongside Caltech, shows the clearest end-to-end path from undergrad research to technical output.',
      'Public sticker-price advantage makes it a strong value hedge, especially for in-state students.',
    ],
    caution:
      'Aid and value profile shift meaningfully with residency, and competitive labs may have uneven access.',
  },
  {
    id: 'mit',
    name: 'MIT',
    location: 'Cambridge, Massachusetts',
    objectiveRank: 4,
    objectiveScore: 48.4,
    strengths: {
      research: 4.8,
      curriculum: 4.2,
      affordability: 5,
      observatory: 3.2,
      merit: 2,
      publicValue: 2,
    },
    badges: ['Elite research intensity', 'High-need aid strength'],
    highlights: [
      'Remains elite on research quality and faculty indicators.',
      'Included in the strongest need-based aid group for high-need applicants.',
      'Recommended when maximizing research prestige and ecosystem depth is the top objective.',
    ],
    caution:
      'The report gives less direct evidence of observatory-linked undergraduate training than Arizona, Texas, Berkeley, or Caltech.',
  },
  {
    id: 'princeton',
    name: 'Princeton',
    location: 'Princeton, New Jersey',
    objectiveRank: 5,
    objectiveScore: 44.2,
    strengths: {
      research: 4.7,
      curriculum: 4.8,
      affordability: 5,
      observatory: 2.8,
      merit: 2,
      publicValue: 2,
    },
    badges: ['High-need aid strength', 'Independent work model'],
    highlights: [
      'Repeated independent work model with junior papers plus thesis drives strong research formation.',
      'Included in both the elite research-intensity and affordability-first recommendation sets.',
      'One of the strongest need-based aid options in the synthesis.',
    ],
    caution:
      'This report emphasizes research formation and aid more than observatory-linked access for Princeton.',
  },
  {
    id: 'ut-austin',
    name: 'UT Austin',
    location: 'Austin, Texas',
    objectiveRank: 8,
    objectiveScore: 17.7,
    strengths: {
      research: 4,
      curriculum: 4.2,
      affordability: 3.2,
      observatory: 4.8,
      merit: 3.2,
      publicValue: 4.2,
    },
    badges: ['Observatory-linked coursework', 'Hands-on training'],
    highlights: [
      'Robust observatory-linked coursework and supervised research options.',
      'Strong observatory-centered hands-on environment in the synthesis.',
      'Target-school option in the report shortlist with public-university value upside.',
    ],
    caution:
      'Objective composite score trails the top research powerhouses, so fit depends on how much you value observatory access.',
  },
  {
    id: 'harvard',
    name: 'Harvard',
    location: 'Cambridge, Massachusetts',
    strengths: {
      research: 4.6,
      curriculum: 4,
      affordability: 5,
      observatory: 2.8,
      merit: 2,
      publicValue: 2,
    },
    badges: ['High-need aid strength', 'Affordability-first wildcard'],
    highlights: [
      'Included in the strongest need-based aid cluster for high-need applicants.',
      'Recommended in the affordability-first profile despite not being a core observatory-led recommendation.',
      'Useful as a net-price outperformer when aid quality matters more than public sticker price.',
    ],
    caution:
      'This synthesis spends less time on curriculum and observatory specifics for Harvard than for the core astronomy shortlist.',
  },
];

export const studentProfiles: StudentProfile[] = [
  {
    id: 'broad-fit',
    label: 'Best overall balance',
    summary: 'For astronomy-focused students balancing rigor, access, and affordability risk.',
    recommended: ['arizona', 'caltech', 'berkeley'],
    rationale:
      'The report names Arizona, Caltech, and Berkeley as the strongest overall blend of astronomy-specific strength, curriculum depth, observatory access, research pipeline quality, and realistic affordability paths.',
  },
  {
    id: 'elite-research',
    label: 'Elite research intensity',
    summary: 'For students optimizing for research prestige, output, and top-tier faculty ecosystems.',
    recommended: ['caltech', 'berkeley', 'mit', 'princeton'],
    rationale:
      'Caltech and Berkeley lead the dataset on undergrad pipeline evidence, while MIT and Princeton remain elite by research quality, reputation, and faculty indicators.',
  },
  {
    id: 'affordability-first',
    label: 'Affordability first',
    summary: 'For high-need applicants or students minimizing net-price risk.',
    recommended: ['princeton', 'harvard', 'mit', 'caltech', 'berkeley', 'arizona'],
    rationale:
      'Princeton, Harvard, MIT, and Caltech lead on need-based aid quality, while Berkeley and Arizona remain important public value hedges depending on residency and scholarship outcomes.',
  },
  {
    id: 'observatory',
    label: 'Hands-on observing',
    summary: 'For students who want recurring observatory-linked training and practical access.',
    recommended: ['arizona', 'ut-austin', 'caltech', 'berkeley'],
    rationale:
      'Arizona and UT Austin stand out for observatory-centered environments, with Caltech and Berkeley also showing strong direct research and technical infrastructure.',
  },
];

export const actionableShortlist = {
  reach: ['Caltech', 'MIT', 'Princeton'],
  target: ['UC Berkeley', 'University of Arizona', 'UT Austin'],
  hedge: ['University of Arizona', 'UC Berkeley'],
};

export const risks = [
  'Public pages do not always reveal how competitive funded research slots, advisors, or labs really are.',
  'Cost outcomes depend heavily on individual aid packages, residency, and merit profile.',
  'Institutional pages update annually, so aid and program details should be rechecked during application season.',
];

export const sourceGroups = [
  {
    label: 'Objective program strength',
    items: ['NSF HERD FY2023 survey and tables', 'ShanghaiRanking GRAS 2024 Physics', 'QS Physics & Astronomy 2026'],
  },
  {
    label: 'Curriculum quality',
    items: [
      'Arizona official curriculum and undergraduate research pages',
      'Caltech official curriculum and undergraduate research pages',
      'Princeton official curriculum and undergraduate research pages',
      'UT Austin official curriculum and undergraduate research pages',
      'UC Berkeley official curriculum and undergraduate research pages',
    ],
  },
  {
    label: 'Affordability and aid',
    items: [
      'MIT official financial-aid and cost pages',
      'Caltech official financial-aid and cost pages',
      'Princeton official financial-aid and cost pages',
      'Harvard official financial-aid and cost pages',
      'UC Berkeley official financial-aid and cost pages',
      'University of Arizona official financial-aid and cost pages',
    ],
  },
  {
    label: 'Observatory and research pipeline',
    items: [
      'Caltech SURF and Palomar access pages',
      'UC Berkeley facilities and student research pages',
      'UT Austin McDonald Observatory pages and internship posting',
      'University of Arizona observatory access and TIMESTEP program pages',
    ],
  },
];
