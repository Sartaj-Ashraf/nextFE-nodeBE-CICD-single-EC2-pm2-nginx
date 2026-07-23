import { Zap, Monitor, Settings, Database, Server, Layout } from 'lucide-react';
import { Code, Brain, Users, Briefcase, ChartBar, Shield, PenTool, Lightbulb } from 'lucide-react';

// Frontend, Backend, and Design Technologies
export const technologies = {
  frontend: [
    "React", 
    "Next.js", 
    "Vue.js", 
    "Angular", 
    "Svelte",
    "TypeScript",
    "JavaScript",
    "Redux",
    "Zustand",
    "Tailwind CSS",
    "SASS/SCSS",
    "CSS3",
    "HTML5",
    "Vite",
    "Webpack",
    "Three.js",
    "D3.js",
    "Framer Motion"
  ],
  backend: [
    "Node.js",
    "Express",
    "NestJS",
    "Django",
    "Flask",
    "Ruby on Rails",
    "Spring Boot",
    "PHP",
    "Laravel",
    "ASP.NET",
    "GraphQL",
    "RESTful API",
    "Go",
    "Rust",
    "Elixir/Phoenix"
  ],
  database: [
    "PostgreSQL",
    "MongoDB",
    "MySQL",
    "Redis",
    "Cassandra",
    "DynamoDB",
    "Supabase",
    "Firebase",
    "Elasticsearch",
    "SQLite"
  ],
  cloud: [
    "AWS",
    "Google Cloud",
    "Azure",
    "Vercel",
    "Netlify",
    "Docker",
    "Kubernetes",
    "Terraform",
    "CloudFlare",
    "Digital Ocean"
  ],
  design: [
    "Figma",
    "Adobe XD",
    "Sketch",
    "Photoshop",
    "Illustrator",
    "InVision",
    "Webflow",
    "Framer",
    "Storybook",
    "Canva"
  ],
  testing: [
    "Jest",
    "React Testing Library",
    "Cypress",
    "Selenium",
    "Playwright",
    "Vitest",
    "Mocha",
    "Chai",
    "Karma",
    "Postman"
  ],
  tools: [
    "GitHub",
    "GitLab",
    "GitHub Actions",
    "Jenkins",
    "CircleCI",
    "JIRA",
    "Confluence",
    "Notion",
    "Slack",
    "VS Code"
  ]
};

// Color mapping for different tech categories
export const getTechColor = (tech) => {
  const techLower = tech.toLowerCase();
  if (techLower.includes('react') || techLower.includes('next') || techLower.includes('vue') || 
      techLower.includes('angular') || techLower.includes('svelte') || techLower.includes('redux') ||
      techLower.includes('zustand') || techLower.includes('three.js') || techLower.includes('d3') ||
      techLower.includes('framer') || techLower.includes('motion')) {
    return "bg-blue-100 text-blue-800 border-blue-200";
  } else if (techLower.includes('script') || techLower.includes('java') || techLower.includes('python') ||
             techLower.includes('typescript') || techLower.includes('go') || techLower.includes('rust') ||
             techLower.includes('elixir') || techLower.includes('phoenix') || techLower.includes('php')) {
    return "bg-yellow-100 text-yellow-800 border-yellow-200";
  } else if (techLower.includes('css') || techLower.includes('tailwind') || techLower.includes('sass') ||
             techLower.includes('scss') || techLower.includes('html') || techLower.includes('figma') ||
             techLower.includes('xd') || techLower.includes('sketch') || techLower.includes('photoshop') ||
             techLower.includes('illustrator') || techLower.includes('canva') || techLower.includes('webflow') ||
             techLower.includes('storybook')) {
    return "bg-pink-100 text-pink-800 border-pink-200";
  } else if (techLower.includes('node') || techLower.includes('express') || techLower.includes('nest') ||
             techLower.includes('django') || techLower.includes('flask') || techLower.includes('rails') ||
             techLower.includes('spring') || techLower.includes('laravel') || techLower.includes('asp.net') ||
             techLower.includes('graphql') || techLower.includes('rest')) {
    return "bg-green-100 text-green-800 border-green-200";
  } else if (techLower.includes('sql') || techLower.includes('mongo') || techLower.includes('data') ||
             techLower.includes('redis') || techLower.includes('cassandra') || techLower.includes('dynamo') ||
             techLower.includes('supabase') || techLower.includes('firebase') || techLower.includes('elastic')) {
    return "bg-purple-100 text-purple-800 border-purple-200";
  } else if (techLower.includes('aws') || techLower.includes('azure') || techLower.includes('cloud') ||
             techLower.includes('vercel') || techLower.includes('netlify') || techLower.includes('docker') ||
             techLower.includes('kubernetes') || techLower.includes('terraform') || techLower.includes('cloudflare') ||
             techLower.includes('digital ocean')) {
    return "bg-orange-100 text-orange-800 border-orange-200";
  } else if (techLower.includes('jest') || techLower.includes('testing') || techLower.includes('cypress') ||
             techLower.includes('selenium') || techLower.includes('playwright') || techLower.includes('vitest') ||
             techLower.includes('mocha') || techLower.includes('chai') || techLower.includes('karma') ||
             techLower.includes('postman')) {
    return "bg-red-100 text-red-800 border-red-200";
  } else if (techLower.includes('git') || techLower.includes('actions') || techLower.includes('jenkins') ||
             techLower.includes('circleci') || techLower.includes('jira') || techLower.includes('confluence') ||
             techLower.includes('notion') || techLower.includes('slack') || techLower.includes('code')) {
    return "bg-indigo-100 text-indigo-800 border-indigo-200";
  }
  return "bg-gray-100 text-gray-800 border-gray-200";
};

// Tech icon mapping
export const getTechIcon = (tech) => {
  const techLower = tech.toLowerCase();
  if (techLower.includes('react') || techLower.includes('next') || techLower.includes('vue') || 
      techLower.includes('angular') || techLower.includes('svelte') || techLower.includes('html') ||
      techLower.includes('three.js') || techLower.includes('d3') || techLower.includes('framer')) {
    return <Monitor className="text-blue-500" size={16} />;
  } else if (techLower.includes('script') || techLower.includes('java') || techLower.includes('python') ||
             techLower.includes('go') || techLower.includes('rust') || techLower.includes('elixir') ||
             techLower.includes('php') || techLower.includes('typescript')) {
    return <Monitor className="text-yellow-500" size={16} />;
  } else if (techLower.includes('css') || techLower.includes('tailwind') || techLower.includes('sass') ||
             techLower.includes('scss') || techLower.includes('figma') || techLower.includes('xd') ||
             techLower.includes('sketch') || techLower.includes('photoshop') || techLower.includes('illustrator') ||
             techLower.includes('canva') || techLower.includes('webflow') || techLower.includes('storybook')) {
    return <Layout className="text-pink-500" size={16} />;
  } else if (techLower.includes('node') || techLower.includes('express') || techLower.includes('nest') ||
             techLower.includes('django') || techLower.includes('flask') || techLower.includes('rails') ||
             techLower.includes('spring') || techLower.includes('laravel') || techLower.includes('asp.net') ||
             techLower.includes('graphql') || techLower.includes('rest')) {
    return <Server className="text-green-500" size={16} />;
  } else if (techLower.includes('sql') || techLower.includes('mongo') || techLower.includes('redis') ||
             techLower.includes('cassandra') || techLower.includes('dynamo') || techLower.includes('supabase') ||
             techLower.includes('firebase') || techLower.includes('elastic')) {
    return <Database className="text-purple-500" size={16} />;
  } else if (techLower.includes('aws') || techLower.includes('azure') || techLower.includes('cloud') ||
             techLower.includes('vercel') || techLower.includes('netlify') || techLower.includes('docker') ||
             techLower.includes('kubernetes') || techLower.includes('terraform') || techLower.includes('cloudflare') ||
             techLower.includes('digital ocean')) {
    return <Zap className="text-orange-500" size={16} />;
  }
  return <Settings className="text-gray-500" size={16} />;
};



// Sills 



export const skills = {
  development: [
    "Object-Oriented Programming",
    "Functional Programming",
    "Test-Driven Development",
    "Responsive Design",
    "Mobile-First Development",
    "Microservices Architecture",
    "RESTful API Design",
    "GraphQL Schema Design",
    "Serverless Architecture",
    "Progressive Web Apps",
    "Single Page Applications",
    "Component-Based Design",
    "State Management",
    "Authentication & Authorization",
    "WebSockets Implementation"
  ],
  dataScience: [
    "Data Analysis",
    "Machine Learning",
    "Natural Language Processing",
    "Computer Vision",
    "Statistical Modeling",
    "Data Visualization",
    "Big Data Processing",
    "Predictive Analytics",
    "A/B Testing",
    "ETL Pipelines",
    "Business Intelligence",
    "Feature Engineering",
    "Time Series Analysis",
    "Recommendation Systems",
    "Data Mining"
  ],
  design: [
    "UI/UX Design",
    "User Research",
    "Wireframing",
    "Prototyping",
    "Design Systems",
    "Accessibility (WCAG)",
    "Interaction Design",
    "Visual Design",
    "Information Architecture",
    "User Journey Mapping",
    "Motion Design",
    "Design Thinking",
    "Responsive Design",
    "Icon Design",
    "Typography"
  ],
  projectManagement: [
    "Agile Methodologies",
    "Scrum",
    "Kanban",
    "Sprint Planning",
    "Project Roadmapping",
    "Risk Management",
    "Resource Allocation",
    "Stakeholder Management",
    "Process Optimization",
    "Requirements Gathering",
    "Product Backlog Management",
    "Release Planning",
    "User Story Mapping",
    "Estimation Techniques",
    "Project Documentation"
  ],
  communication: [
    "Technical Writing",
    "API Documentation",
    "Client Communication",
    "Team Collaboration",
    "Public Speaking",
    "Presentation Skills",
    "Knowledge Sharing",
    "Code Reviews",
    "Requirement Analysis",
    "Cross-functional Coordination",
    "Conflict Resolution",
    "Remote Collaboration",
    "Constructive Feedback",
    "Training & Mentoring",
    "Technical Interviews"
  ],
  security: [
    "OWASP Security Practices",
    "Authentication Systems",
    "Authorization Frameworks",
    "Security Auditing",
    "Vulnerability Assessment",
    "Penetration Testing",
    "Secure Coding Practices",
    "Encryption Implementation",
    "Security Compliance",
    "Data Privacy (GDPR, CCPA)",
    "Security Incident Response",
    "Security Architecture Design",
    "Identity Management",
    "Network Security",
    "API Security"
  ],
  businessDomain: [
    "E-commerce Solutions",
    "FinTech Applications",
    "Healthcare Systems",
    "Enterprise Software",
    "SaaS Development",
    "Social Media Platforms",
    "Mobile App Development",
    "CRM Implementation",
    "Content Management Systems",
    "Marketing Automation",
    "Payment Processing",
    "Analytics Platforms",
    "Real-time Systems",
    "IoT Solutions",
    "AI Applications"
  ]
};

// Get skill icon based on category
export const getSkillIcon = (skill, category) => {
  switch(category) {
    case 'development':
      return <Code className="text-blue-500" size={16} />;
    case 'dataScience':
      return <Brain className="text-purple-500" size={16} />;
    case 'design':
      return <PenTool className="text-pink-500" size={16} />;
    case 'projectManagement':
      return <ChartBar className="text-green-500" size={16} />;
    case 'communication':
      return <Users className="text-yellow-500" size={16} />;
    case 'security':
      return <Shield className="text-red-500" size={16} />;
    case 'businessDomain':
      return <Briefcase className="text-indigo-500" size={16} />;
    default:
      return <Lightbulb className="text-gray-500" size={16} />;
  }
};

// Get skill color based on category
export const getSkillColor = (category) => {
  switch(category) {
    case 'development':
      return "bg-blue-50 text-blue-800 border-blue-200";
    case 'dataScience':
      return "bg-purple-50 text-purple-800 border-purple-200";
    case 'design':
      return "bg-pink-50 text-pink-800 border-pink-200";
    case 'projectManagement':
      return "bg-green-50 text-green-800 border-green-200";
    case 'communication':
      return "bg-yellow-50 text-yellow-800 border-yellow-200";
    case 'security':
      return "bg-red-50 text-red-800 border-red-200";
    case 'businessDomain':
      return "bg-indigo-50 text-indigo-800 border-indigo-200";
    default:
      return "bg-gray-50 text-gray-800 border-gray-200";
  }
};

// Get human-readable category name
export const getCategoryName = (category) => {
  switch(category) {
    case 'development':
      return "Software Development";
    case 'dataScience':
      return "Data Science & Analytics";
    case 'design':
      return "Design & User Experience";
    case 'projectManagement':
      return "Project Management";
    case 'communication':
      return "Communication & Collaboration";
    case 'security':
      return "Security & Compliance";
    case 'businessDomain':
      return "Business Domain Expertise";
    default:
      return category.charAt(0).toUpperCase() + category.slice(1);
  }
};