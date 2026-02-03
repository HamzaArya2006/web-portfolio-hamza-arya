/**
 * Nova AI Assistant - Next-Generation AI Companion (ChatGPT-5 Level Features)
 * 
 * Advanced Features:
 * - Advanced reasoning & step-by-step problem solving
 * - Code analysis, review & debugging assistance
 * - Architecture & design pattern suggestions
 * - Performance & security analysis
 * - Algorithm explanations & optimizations
 * - API & database design help
 * - Testing strategies & best practices
 * - Proactive suggestions & context awareness
 * - Advanced NLP with fuzzy matching & typo tolerance
 * - Multilingual support (15+ languages)
 * - Sentiment analysis & emotional intelligence
 * - Code examples with syntax highlighting (10+ languages)
 * - Quiz/Trivia system with adaptive difficulty
 * - FAQ system (12+ questions)
 * - Learning recommendations & project suggestions
 * - Conversation export & advanced search
 * - Math calculator & scientific computations
 * - Jokes, facts, quotes, riddles (100+ each)
 * - Voice input & text-to-speech
 * - Website navigation & touring
 * - Career advice & mentorship
 * - Real-time code execution simulation
 * - Task planning & execution
 * 
 * @version 5.0.0 - Next-Generation Edition
 */

import { log, debug, warn } from './logger.js';
import {
  LANGUAGES,
  LANGUAGE_KEYWORDS,
  JOKES,
  FUN_FACTS,
  QUOTES,
  RIDDLES,
  COMPLIMENTS,
  THINKING_PHRASES,
  EASTER_EGGS
} from '../../data/ai.js';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Get time-based greeting with more granularity
function getTimeBasedGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 9) return 'Good morning, early bird';
  if (hour >= 9 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 14) return 'Good afternoon';
  if (hour >= 14 && hour < 17) return 'Good afternoon';
  if (hour >= 17 && hour < 20) return 'Good evening';
  if (hour >= 20 && hour < 23) return 'Good evening';
  return 'Hello, night owl';
}

// Get day-specific greeting
function getDayBasedGreeting() {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const day = days[new Date().getDay()];
  const greetings = {
    'Monday': "Happy Monday! Let's start the week strong!",
    'Friday': "TGIF! Almost weekend!",
    'Saturday': "Happy Saturday! Enjoy your weekend!",
    'Sunday': "Happy Sunday! Hope you're having a relaxing day!"
  };
  return greetings[day] || `Happy ${day}!`;
}

// Get random greeting with personality
function getRandomGreeting() {
  const greetings = [
    "Hey there!",
    "Hello!",
    "Hi!",
    "Hey!",
    "Greetings!",
    "What's up?",
    "Howdy!",
    "Nice to see you!",
    "Welcome!",
    "Hey friend!",
    "Hello there!",
    "Hi there!",
    "Ahoy!",
    "Salutations!",
  ];
  return greetings[Math.floor(Math.random() * greetings.length)];
}

// ============================================================================
// MULTILINGUAL SUPPORT FUNCTIONS
// ============================================================================

// Detect language from user input
function detectLanguage(text) {
  const lowerText = text.toLowerCase();
  let bestMatch = 'en';
  let bestScore = 0;
  
  for (const [lang, keywords] of Object.entries(LANGUAGE_KEYWORDS)) {
    let score = 0;
    keywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        score += keyword.length; // Longer keywords = more confidence
      }
    });
    if (score > bestScore) {
      bestScore = score;
      bestMatch = lang;
    }
  }
  
  return bestScore > 0 ? bestMatch : 'en';
}

// Get user's preferred language from browser or stored preference
function getUserLanguage() {
  // Check stored preference first
  const stored = localStorage.getItem('nova-language');
  if (stored && LANGUAGES[stored]) return stored;
  
  // Fall back to browser language
  const browserLang = navigator.language.split('-')[0];
  return LANGUAGES[browserLang] ? browserLang : 'en';
}

// Set user's preferred language
function setUserLanguage(lang) {
  if (LANGUAGES[lang]) {
    localStorage.setItem('nova-language', lang);
    return true;
  }
  return false;
}

// Simple translation helper (basic phrases)
const TRANSLATIONS = {
  en: {
    welcome: "Welcome!",
    hello: "Hello",
    thanks: "Thanks",
    help: "Help",
    goodbye: "Goodbye",
    detected: "I detected you're speaking"
  },
  es: {
    welcome: "¡Bienvenido!",
    hello: "Hola",
    thanks: "Gracias",
    help: "Ayuda",
    goodbye: "Adiós",
    detected: "Detecté que estás hablando"
  },
  fr: {
    welcome: "Bienvenue!",
    hello: "Bonjour",
    thanks: "Merci",
    help: "Aide",
    goodbye: "Au revoir",
    detected: "J'ai détecté que vous parlez"
  },
  de: {
    welcome: "Willkommen!",
    hello: "Hallo",
    thanks: "Danke",
    help: "Hilfe",
    goodbye: "Auf Wiedersehen",
    detected: "Ich habe erkannt, dass Sie sprechen"
  },
  it: {
    welcome: "Benvenuto!",
    hello: "Ciao",
    thanks: "Grazie",
    help: "Aiuto",
    goodbye: "Arrivederci",
    detected: "Ho rilevato che stai parlando"
  },
  pt: {
    welcome: "Bem-vindo!",
    hello: "Olá",
    thanks: "Obrigado",
    help: "Ajuda",
    goodbye: "Tchau",
    detected: "Detectei que você está falando"
  }
};

// Translate simple phrases
function translate(phrase, lang = 'en') {
  return TRANSLATIONS[lang]?.[phrase] || TRANSLATIONS.en[phrase] || phrase;
}

// Levenshtein distance for fuzzy matching (typo tolerance)
function levenshteinDistance(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

// Check if two words are similar (with typo tolerance)
function isSimilar(word1, word2, threshold = 2) {
  if (word1.length < 3 || word2.length < 3) return word1 === word2;
  return levenshteinDistance(word1.toLowerCase(), word2.toLowerCase()) <= threshold;
}

// Extract numbers from text
function extractNumbers(text) {
  const numbers = text.match(/-?\d+\.?\d*/g);
  return numbers ? numbers.map(Number) : [];
}

// Extract mathematical expression
function extractMathExpression(text) {
  const cleaned = text.replace(/[a-zA-Z\s]*(calculate|what is|what's|compute|solve|equals?|=)/gi, '').trim();
  const mathMatch = cleaned.match(/[\d+\-*/().^\s%]+/);
  return mathMatch ? mathMatch[0].trim() : null;
}

// Safe math evaluation
function evaluateMath(expression) {
  try {
    // Clean and validate the expression
    const cleaned = expression.replace(/\s/g, '').replace(/\^/g, '**').replace(/%/g, '/100*');
    if (!/^[\d+\-*/().%\s]+$/.test(cleaned.replace(/\*\*/g, ''))) return null;
    // Using Function instead of eval for slightly better security
    const result = new Function('return ' + cleaned)();
    if (typeof result === 'number' && isFinite(result)) {
      return Math.round(result * 1000000) / 1000000; // Round to 6 decimal places
    }
    return null;
  } catch {
    return null;
  }
}

// Get current date/time info
function getDateTimeInfo() {
  const now = new Date();
  return {
    time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    date: now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    day: now.toLocaleDateString('en-US', { weekday: 'long' }),
    month: now.toLocaleDateString('en-US', { month: 'long' }),
    year: now.getFullYear(),
    hour: now.getHours(),
    dayOfWeek: now.getDay()
  };
}

// Generate random number in range
function randomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Sentiment analysis (simple but effective)
function analyzeSentiment(text) {
  const positive = ['thanks', 'thank', 'great', 'awesome', 'amazing', 'love', 'excellent', 'wonderful', 
    'fantastic', 'brilliant', 'perfect', 'good', 'nice', 'cool', 'helpful', 'appreciate', 'happy', 
    'glad', 'pleased', 'delighted', 'excited', 'yes', 'yeah', 'yep', 'sure', 'okay', 'ok', 'definitely'];
  const negative = ['bad', 'terrible', 'awful', 'hate', 'horrible', 'worst', 'sucks', 'disappointing',
    'frustrated', 'angry', 'annoyed', 'upset', 'confused', 'lost', 'stuck', 'problem', 'issue', 
    'help', 'wrong', 'broken', 'error', 'fail', 'no', 'not', 'never', 'can\'t', 'won\'t', 'doesn\'t'];
  const curious = ['how', 'what', 'why', 'when', 'where', 'who', 'which', 'explain', 'tell me', 
    'show me', 'describe', 'wondering', 'curious', 'interested'];
  
  const lowerText = text.toLowerCase();
  let score = 0;
  let sentiment = 'neutral';
  
  positive.forEach(word => { if (lowerText.includes(word)) score += 1; });
  negative.forEach(word => { if (lowerText.includes(word)) score -= 1; });
  const isCurious = curious.some(word => lowerText.includes(word));
  
  if (score > 0) sentiment = 'positive';
  else if (score < 0) sentiment = 'negative';
  if (isCurious) sentiment = score < 0 ? 'frustrated_curious' : 'curious';
  
  return { sentiment, score, isCurious };
}

// ============================================================================
// CONTENT DATABASES
// ============================================================================

// ============================================================================
// DATA IS NOW IMPORTED FROM ai.js - See imports at top of file
// ============================================================================

// All data (JOKES, FUN_FACTS, QUOTES, RIDDLES, COMPLIMENTS, THINKING_PHRASES, EASTER_EGGS)
// is now imported from ../../data/ai.js - see imports at top of file

// Website sections for touring
const WEBSITE_SECTIONS = {
  hero: { name: "Hero Section", id: "#top", description: "The main landing area with introduction" },
  services: { name: "Services", id: "#services", description: "All the services Hamza offers" },
  about: { name: "About", id: "#about", description: "Learn about Hamza's background and expertise" },
  projects: { name: "Projects", id: "#projects", description: "Portfolio of completed projects" },
  testimonials: { name: "Testimonials", id: "#testimonials", description: "What clients say about the work" },
  contact: { name: "Contact", id: "#contact", description: "Get in touch with Hamza" }
};

const WEBSITE_PAGES = {
  about: { name: "About Page", url: "/pages/about.html", description: "Detailed information about Hamza" },
  blog: { name: "Blog", url: "/pages/blog.html", description: "Technical articles and tutorials" },
  projects: { name: "Projects", url: "/pages/projects.html", description: "Full project portfolio" },
  services: { name: "Services", url: "/pages/services.html", description: "Detailed service offerings" },
  contact: { name: "Contact", url: "/pages/contact.html", description: "Contact form and information" },
  resume: { name: "Resume", url: "/pages/resume.html", description: "Professional resume and experience" },
  "case-studies": { name: "Case Studies", url: "/pages/case-studies.html", description: "Detailed project case studies" }
};

// ============================================================================
// KNOWLEDGE BASE - Intelligent Response System
// Defined here because it uses helper functions
// Data (jokes, facts, etc.) is imported from ai.js
// ============================================================================

const KNOWLEDGE_BASE = {
  greeting: {
    patterns: ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'good night', 'what\'s up', 'sup', 'howdy', 'yo', 'hi nova', 'hello nova', 'hola', 'heyy', 'heyyy', 'hii', 'hiii'],
    responses: (context) => {
      const timeGreeting = getTimeBasedGreeting();
      const randomGreet = getRandomGreeting();
      const isReturning = context.visitCount > 1;
      const visitMsg = isReturning ? `Welcome back! (Visit #${context.visitCount}) ` : "";
      const dayGreeting = Math.random() > 0.7 ? ` ${getDayBasedGreeting()}` : "";
      
      return [
        `${timeGreeting}! ${visitMsg}${randomGreet} 👋 I'm Nova, your AI assistant 🤖. I'm here to help you explore Hamza's portfolio. What would you like to know?${dayGreeting}`,
        `${randomGreet}! ${timeGreeting}! ${visitMsg}I'm Nova, and I'm excited to help you discover what makes Hamza's work special. Ask me anything!`,
        `Hey there! ${timeGreeting}! ${visitMsg}I'm Nova, your friendly AI guide. Want to learn about services, projects, or just chat?`,
        `${timeGreeting}! ${visitMsg}Welcome! I'm Nova, and I can help you navigate the site, answer questions, tell jokes, do math, play games, or just have a conversation. What's on your mind?`,
        `Hi! ${timeGreeting}! ${visitMsg}I'm Nova 🤖, here to make your visit awesome. I can guide you around, answer questions, share jokes, tell fun facts, or help you find what you need. Let's go! 🚀`
      ];
    }
  },
  how_are_you: {
    patterns: ['how are you', 'how\'s it going', 'how do you feel', 'are you okay', 'how\'s everything'],
    responses: () => [
      "I'm doing fantastic! Thanks for asking! 😊 I'm always here and ready to help. How can I assist you today?",
      "I'm great! Just hanging out, ready to help you explore this awesome portfolio. What would you like to know?",
      "I'm excellent! I love helping visitors discover Hamza's work. What can I do for you?",
      "I'm doing wonderful! Being an AI assistant is pretty cool. What would you like to explore?",
      "I'm amazing! I'm always excited to chat and help. What's on your mind?"
    ]
  },
  name: {
    patterns: ['what\'s your name', 'who are you', 'what are you', 'your name', 'introduce yourself', 'tell me about yourself', 'who is nova'],
    responses: (context) => {
      const personality = [
        "I'm Nova! 🤖 Your friendly AI assistant powered by advanced intelligence. I'm here to help you explore Hamza's portfolio, answer questions, and make your visit enjoyable. Think of me as your personal guide!",
        "I'm Nova, your intelligent AI companion! I help visitors explore the website, answer questions, tell jokes, and have meaningful conversations. I learn from our interactions to provide better assistance. Pretty cool, right? ✨",
        "I'm Nova! An AI assistant designed to help you navigate this portfolio with ease. I can guide you, answer questions, share insights, and even help you navigate the site. I'm always learning and improving! 😊",
        "Hey! I'm Nova 🤖 - your AI assistant. I'm here 24/7 to help you discover Hamza's work, answer your questions, and make your experience smooth and enjoyable. What can I help you with today?"
      ];
      return personality;
    }
  },
  joke: {
    patterns: ['joke', 'funny', 'make me laugh', 'tell a joke', 'humor', 'laugh', 'comedy'],
    responses: () => {
      const joke = JOKES[Math.floor(Math.random() * JOKES.length)];
      return [
        `${joke.setup}\n\n${joke.punchline}\n\n😄 Want another one?`,
        `Here's one for you:\n\n${joke.setup}\n\n${joke.punchline}\n\nHope that made you smile! 😊`,
        `Sure! ${joke.setup}\n\n${joke.punchline}\n\nHaha! Need more laughs?`
      ];
    }
  },
  services: {
    patterns: ['service', 'what do you do', 'what can you build', 'offer', 'provide', 'help with', 'what services', 'capabilities'],
    responses: () => [
      "Hamza offers comprehensive full-stack development services:\n\n🚀 **Web Applications**\n• React, Vue, or vanilla JS frontends\n• Modern, responsive designs\n• Progressive Web Apps (PWA)\n\n💼 **Backend Development**\n• Node.js, Express, REST APIs\n• Database design & optimization\n• API development & integration\n\n🛒 **E-commerce Solutions**\n• Custom online stores\n• Payment gateway integration\n• Inventory management\n\n⚡ **Performance & SEO**\n• Core Web Vitals optimization\n• SEO audit & implementation\n• Code splitting & lazy loading\n\n☁️ **DevOps & Deployment**\n• AWS, Vercel, cloud infrastructure\n• CI/CD pipeline setup\n• Docker containerization\n\n💡 **Consulting & Support**\n• Architecture planning\n• Code reviews\n• Team training\n\nAll projects focus on speed, reliability, and maintainability!",
      "Services include full-stack web development, e-commerce platforms, API design, performance optimization, and cloud deployment. Every project prioritizes Core Web Vitals Grade A performance and production-ready code quality.",
      "Hamza specializes in:\n\n• Full-stack web applications\n• E-commerce solutions\n• API development\n• Performance optimization\n• DevOps & cloud deployment\n• Technical consulting\n\nWant details on any specific service?"
    ]
  },
  contact: {
    patterns: ['contact', 'email', 'reach', 'get in touch', 'hire', 'availability', 'how to contact', 'email address', 'phone'],
    responses: () => [
      "You can reach Hamza through multiple channels:\n\n📧 **Email:** hamzaarya123@gmail.com\n📍 **Location:** Kabul, Afghanistan (Remote-friendly)\n⏱️ **Response Time:** Under 24 hours\n🌐 **Website Contact:** Use the contact form on this page or visit /pages/contact.html\n\nHamza is available for:\n• Freelance projects\n• Remote work\n• Long-term collaborations\n• Quick consultations\n\nFeel free to reach out!",
      "Contact Hamza via email at **hamzaarya123@gmail.com**. He's available for freelance and remote projects worldwide, typically responding within 24 hours. You can also use the contact form on the website for a quick message!",
      "Get in touch:\n\n📧 hamzaarya123@gmail.com\n📍 Based in Kabul, AF (works remotely)\n⏱️ Replies within 24 hours\n\nAvailable for new projects and collaborations!"
    ]
  },
  projects: {
    patterns: ['project', 'portfolio', 'work', 'examples', 'showcase', 'built', 'what have you built', 'projects done'],
    responses: () => [
      "Hamza has shipped **20+ production projects** across various domains:\n\n🚀 **SaaS Platforms**\n• B2B solutions\n• Analytics dashboards\n• Management systems\n\n🛒 **E-commerce Stores**\n• Custom online stores\n• Payment integrations\n• Inventory systems\n\n⚡ **Real-time Applications**\n• Chat applications\n• Live collaboration tools\n• WebSocket implementations\n\n📊 **Data & Analytics**\n• ETL pipelines\n• Dashboard visualizations\n• Reporting systems\n\n🎯 **Key Highlights:**\n• All projects achieve Core Web Vitals Grade A\n• Production-grade code quality\n• Measurable business impact\n\nCheck out the Projects section or visit /pages/projects.html for detailed case studies!",
      "View featured projects in the Projects section. Each project includes:\n• Tech stack details\n• Challenges solved\n• Measurable results\n• Live demos (where available)\n\nHamza has worked on SaaS platforms, e-commerce stores, real-time apps, and data analytics solutions.",
      "Portfolio includes:\n\n• 20+ shipped projects\n• SaaS platforms\n• E-commerce solutions\n• Real-time applications\n• Data analytics dashboards\n• B2B solutions\n\nAll with Core Web Vitals Grade A performance! Visit /pages/projects.html for details."
    ]
  },
  skills: {
    patterns: ['skill', 'technology', 'tech stack', 'stack', 'technologies', 'tools', 'expertise', 'what technologies', 'programming languages'],
    responses: () => [
      "**Tech Stack & Expertise:**\n\n🎨 **Frontend:**\n• React, Vue.js\n• TypeScript, JavaScript\n• Vite, Webpack\n• Tailwind CSS, CSS3\n• HTML5, Semantic HTML\n\n⚙️ **Backend:**\n• Node.js, Express\n• REST APIs, GraphQL\n• Serverless functions\n• Microservices architecture\n\n💾 **Databases:**\n• PostgreSQL\n• MongoDB\n• Redis\n• Database optimization\n\n☁️ **DevOps & Cloud:**\n• AWS (EC2, S3, Lambda)\n• Vercel, Netlify\n• Docker, Kubernetes\n• CI/CD (GitHub Actions)\n• Git, GitHub\n\n🛠️ **Tools & Practices:**\n• TypeScript\n• Testing (Jest, Vitest)\n• Performance optimization\n• SEO best practices\n• Agile methodologies\n\nAll projects prioritize **Core Web Vitals Grade A** performance!",
      "Expertise includes modern JavaScript frameworks, server-side development, database design, cloud infrastructure, and performance optimization. Hamza works with React, Node.js, PostgreSQL, AWS, and modern DevOps tools.",
      "Tech stack:\n\n**Frontend:** React, Vue, TypeScript, Tailwind\n**Backend:** Node.js, Express, REST APIs\n**Database:** PostgreSQL, MongoDB\n**DevOps:** AWS, Docker, CI/CD\n\nAll focused on performance and maintainability!"
    ]
  },
  pricing: {
    patterns: ['price', 'cost', 'rate', 'budget', 'how much', 'pricing', 'fee', 'charges', 'payment'],
    responses: () => [
      "Pricing is flexible and tailored to your project:\n\n💰 **Engagement Models:**\n• Fixed-scope projects\n• Retainer agreements\n• Hourly consulting\n• Project-based pricing\n\n📊 **Factors Considered:**\n• Project complexity\n• Timeline requirements\n• Scope of work\n• Ongoing maintenance needs\n\n💡 **Transparency:**\n• Clear, upfront quotes\n• No hidden fees\n• Competitive rates\n• Value-focused pricing\n\nFor a personalized quote, use the contact form or email directly. Hamza offers competitive rates with transparent pricing!",
      "Contact Hamza for a personalized quote based on your project needs. He offers flexible engagement models including fixed-scope projects and retainer agreements. All pricing is transparent and competitive!",
      "Pricing varies by project scope:\n\n• Fixed-scope: One-time payment\n• Retainer: Ongoing support\n• Hourly: Consulting work\n\nGet a custom quote via the contact form!"
    ]
  },
  experience: {
    patterns: ['experience', 'years', 'how long', 'background', 'history', 'career', 'how many years'],
    responses: () => [
      "Hamza has **4+ years** of full-stack development experience:\n\n📈 **Track Record:**\n• 20+ projects shipped\n• Core Web Vitals Grade A on all projects\n• Production-grade code quality\n• Strong focus on developer experience\n\n🎯 **Focus Areas:**\n• Clean architecture\n• Performance optimization\n• Maintainable code\n• Best practices\n\n📚 **Continuous Learning:**\n• Stays updated with latest technologies\n• Follows industry best practices\n• Contributes to open source\n\nCheck the About section for more details!",
      "4+ years of experience building production web applications. Focus on clean architecture, performance, and maintainable code. Has shipped 20+ successful projects.",
      "**Experience:**\n\n• 4+ years full-stack development\n• 20+ projects shipped\n• Core Web Vitals Grade A\n• Production-ready code\n\nCheck /pages/about.html for more!"
    ]
  },
  location: {
    patterns: ['where', 'location', 'based', 'timezone', 'remote', 'country', 'city', 'where are you'],
    responses: () => [
      "Hamza is based in **Kabul, Afghanistan**, but works remotely with clients worldwide:\n\n🌍 **Remote-Friendly:**\n• Works with clients globally\n• Flexible timezone coordination\n• Remote-first approach\n• International collaboration experience\n\n💼 **Availability:**\n• Available for remote projects\n• Flexible working hours\n• Timezone-friendly communication\n\nAll projects are remote-friendly with flexible timezone coordination!",
      "Location: Kabul, AF. Fully remote-friendly with clients across different timezones. Hamza has experience working with international teams and clients worldwide.",
      "Based in Kabul, Afghanistan. Works remotely with clients worldwide. Flexible timezone coordination available!"
    ]
  },
  blog: {
    patterns: ['blog', 'article', 'write', 'tutorial', 'learn', 'posts', 'content'],
    responses: () => [
      "Hamza writes about web development, architecture patterns, and best practices:\n\n📝 **Blog Topics:**\n• React Architecture Patterns\n• API Design Best Practices\n• Modern Web Performance\n• TypeScript Tips & Tricks\n• Docker Development Workflows\n• CSS Grid vs Flexbox\n• And much more!\n\n🔗 **Visit the blog:** /pages/blog.html\n\nEach article includes:\n• Practical examples\n• Code snippets\n• Real-world applications\n• Best practices\n\nCheck it out for technical insights and tutorials!",
      "Visit the blog section at /pages/blog.html for technical articles, tutorials, and case studies on modern web development. Topics include React, TypeScript, performance, and more!",
      "Blog covers:\n\n• React architecture\n• API design\n• Performance tips\n• TypeScript tricks\n• Docker workflows\n\nVisit /pages/blog.html!"
    ]
  },
  tour: {
    patterns: ['tour', 'guide', 'show me around', 'navigate', 'walk me through', 'explore', 'where to go', 'what to see'],
    responses: () => [
      "I'd love to give you a tour! 🎯\n\nHere's what you can explore:\n\n🏠 **Homepage Sections:**\n• Hero - Introduction\n• Services - What's offered\n• About - Background\n• Projects - Portfolio\n• Testimonials - Client feedback\n• Contact - Get in touch\n\n📄 **Other Pages:**\n• About - Detailed info\n• Blog - Articles & tutorials\n• Projects - Full portfolio\n• Services - Detailed offerings\n• Contact - Contact form\n• Resume - Professional experience\n\nWould you like me to:\n• Scroll to a specific section?\n• Navigate to a page?\n• Tell you more about any area?\n\nJust ask!",
      "Let me guide you around! The site has:\n\n**Main sections:** Hero, Services, About, Projects, Testimonials, Contact\n**Pages:** About, Blog, Projects, Services, Contact, Resume, Case Studies\n\nWhat would you like to explore? I can scroll to sections or navigate to pages!",
      "Tour time! 🚀\n\n**Sections:** #hero #services #about #projects #testimonials #contact\n**Pages:** /pages/about.html, /pages/blog.html, /pages/projects.html\n\nTell me where you want to go!"
    ]
  },
  website_info: {
    patterns: ['website', 'site', 'portfolio', 'this site', 'tell me about this'],
    responses: () => [
      "This is **Hamza Arya's portfolio website** - a showcase of a full-stack developer's work:\n\n🎯 **Purpose:**\n• Showcase projects and skills\n• Connect with potential clients\n• Share knowledge through blog\n• Demonstrate technical expertise\n\n✨ **Features:**\n• Modern, responsive design\n• Fast performance (Core Web Vitals A)\n• SEO optimized\n• Accessible\n• PWA ready\n\n📊 **Built With:**\n• Vite for build tooling\n• Tailwind CSS for styling\n• Vanilla JavaScript\n• Modern web standards\n\nIt's designed to be fast, beautiful, and functional!",
      "This is a modern portfolio website showcasing Hamza's full-stack development work. It features projects, services, blog posts, and contact information. Built with performance and user experience in mind!",
      "A professional portfolio site featuring:\n• Projects showcase\n• Services offered\n• Blog articles\n• Contact information\n• Modern, fast design"
    ]
  },
  help: {
    patterns: ['help', 'what can you do', 'capabilities', 'features', 'assist', 'support', 'how can you help', 'what do you do'],
    responses: (context) => {
      const suggestions = context.mentionedTopics.length > 0 
        ? `\n\n💡 **Based on our conversation, you might also like:**\n${context.mentionedTopics.map(t => `• Learn more about ${t}`).join('\n')}`
        : '';
      
      return [
        `I can help you with lots of things! 🎉\n\n💬 **Conversation:**\n• Answer questions about services, projects, skills\n• Have friendly, intelligent chats\n• Tell jokes and have fun\n• Remember our conversation context\n\n🗺️ **Navigation:**\n• Guide you around the website\n• Scroll to specific sections\n• Navigate to different pages\n• Smart suggestions based on your interests\n\n📚 **Information:**\n• Explain services and offerings in detail\n• Share project details and case studies\n• Provide contact information\n• Discuss tech stack and expertise\n• Context-aware responses\n\n🎤 **Voice Features:**\n• Natural text-to-speech with female voice\n• Voice input recognition\n• Hands-free interaction\n\n🎭 **Intelligence:**\n• Context-aware conversations\n• Smart follow-up suggestions\n• Learning from interactions\n• Personalized assistance${suggestions}\n\nWhat would you like to explore?`,
        `I'm Nova, and I'm here to help! 🤖\n\n**I can:**\n• Answer questions intelligently\n• Guide you around the site\n• Tell jokes and have fun\n• Navigate to any section\n• Use voice features\n• Remember our conversation\n• Provide smart suggestions\n\nJust ask me anything!`,
        `I'm your AI assistant Nova! Here's what I do:\n\n✨ **Smart Assistance:**\n• Context-aware responses\n• Intelligent navigation\n• Personalized help\n• Voice interaction\n• Learning from our chats\n\nWhat would you like to know?`
      ];
    }
  },
  thanks: {
    patterns: ['thanks', 'thank you', 'appreciate', 'grateful', 'thx', 'ty', 'tysm', 'thank u'],
    responses: (context) => {
      const compliment = Math.random() > 0.5 ? ` ${COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)]}` : '';
      return [
        `You're very welcome! 😊 Happy to help!${compliment} Is there anything else you'd like to know?`,
        `My pleasure! Feel free to ask if you need anything else!${compliment}`,
        `Anytime! I'm here whenever you need me. What else can I help with?`,
        `You're welcome! Glad I could help. Anything else on your mind?`,
        `Happy to help! 😊${compliment} Let me know if you need anything else!`
      ];
    }
  },
  goodbye: {
    patterns: ['bye', 'goodbye', 'see you', 'later', 'farewell', 'cya', 'gtg', 'gotta go', 'leaving', 'take care'],
    responses: (context) => {
      const visitNote = context.visitCount > 2 ? " You're becoming a regular! 😄" : "";
      return [
        `Goodbye! 👋 It was great chatting with you!${visitNote} Come back anytime!`,
        `See you later! 😊 Thanks for visiting! Have an amazing day!`,
        `Bye! Have a wonderful day! Don't forget - I'm here 24/7 if you need me! 🌟`,
        `Farewell! 👋 Hope to chat again soon!${visitNote}`,
        `Goodbye! Take care! 😊 Remember, I'll be here whenever you need me!`
      ];
    }
  },
  
  // NEW: Math & Calculations
  math: {
    patterns: ['calculate', 'math', 'what is', 'compute', 'solve', 'equals', 'plus', 'minus', 'times', 'divided', 'multiply', 'add', 'subtract', 'sum of'],
    responses: () => [
      "I can help with math! Try asking me something like 'calculate 25 * 4' or 'what is 150 + 275'. I can handle +, -, *, /, parentheses, and even percentages! 🧮"
    ],
    handler: (message) => {
      const expression = extractMathExpression(message);
      if (expression) {
        const result = evaluateMath(expression);
        if (result !== null) {
          return `🧮 **${expression}** = **${result}**\n\nNeed another calculation? Just ask!`;
        }
      }
      return null; // Let default response handle it
    }
  },
  
  // NEW: Time & Date
  time: {
    patterns: ['time', 'what time', 'current time', 'clock', 'date', 'what day', 'today', 'what is today', 'what\'s today'],
    responses: () => {
      const dt = getDateTimeInfo();
      return [
        `🕐 The current time is **${dt.time}**\n📅 Today is **${dt.date}**\n\nAnything else you'd like to know?`,
        `It's **${dt.time}** right now!\n📆 **${dt.date}**\n\n${getDayBasedGreeting()}`,
        `⏰ **${dt.time}** - ${dt.date}\n\nTime flies when you're having fun! Anything else?`
      ];
    }
  },
  
  // NEW: Fun Facts
  fun_fact: {
    patterns: ['fun fact', 'fact', 'tell me something', 'interesting', 'did you know', 'trivia', 'random fact'],
    responses: () => {
      const fact = FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)];
      return [
        `🤓 **Fun Fact:**\n\n${fact}\n\nWant another one? Just ask for more facts!`,
        `📚 **Did You Know?**\n\n${fact}\n\nI've got plenty more where that came from!`,
        `🌟 **Here's something interesting:**\n\n${fact}\n\nFascinating, right? Ask for another!`
      ];
    }
  },
  
  // NEW: Quotes
  quote: {
    patterns: ['quote', 'inspire', 'inspiration', 'motivate', 'motivation', 'wisdom'],
    responses: () => {
      const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
      return [
        `💭 **"${q.quote}"**\n— *${q.author}*\n\nNeed more inspiration? Just ask!`,
        `✨ **Wisdom for you:**\n\n"${q.quote}"\n— *${q.author}*\n\nWant another quote?`,
        `📜 **"${q.quote}"**\n\n— *${q.author}*\n\nWords to live by! More quotes available!`
      ];
    }
  },
  
  // NEW: Riddles
  riddle: {
    patterns: ['riddle', 'puzzle', 'brain teaser', 'challenge me', 'test me'],
    responses: (context) => {
      const riddle = RIDDLES[Math.floor(Math.random() * RIDDLES.length)];
      context.currentRiddle = riddle;
      return [
        `🧩 **Riddle Time!**\n\n${riddle.riddle}\n\n*Think you know the answer? Type it! Or say "give up" for the solution.*`,
        `🤔 **Try this one:**\n\n${riddle.riddle}\n\n*Take your time! Say "answer" or "give up" if you're stuck!*`
      ];
    }
  },
  
  // NEW: Give Up (for riddles)
  give_up: {
    patterns: ['give up', 'i don\'t know', 'idk', 'answer', 'tell me the answer', 'what\'s the answer', 'reveal'],
    responses: (context) => {
      if (context.currentRiddle) {
        const answer = context.currentRiddle.answer;
        context.currentRiddle = null;
        return [
          `The answer is: **${answer}**\n\nWant to try another riddle? Just ask!`
        ];
      }
      return [
        "You haven't started a riddle yet! Say 'give me a riddle' to get one! 🧩"
      ];
    }
  },
  
  // NEW: Random Number
  random_number: {
    patterns: ['random number', 'pick a number', 'generate number', 'roll', 'dice', 'flip a coin', 'coin flip'],
    responses: () => [
      `🎲 Here's your random number: **${randomInRange(1, 100)}** (1-100)\n\nWant a specific range? Ask like "pick a number between 1 and 50"!`
    ],
    handler: (message) => {
      const lowerMsg = message.toLowerCase();
      
      // Coin flip
      if (lowerMsg.includes('coin') || lowerMsg.includes('flip')) {
        const result = Math.random() > 0.5 ? 'Heads' : 'Tails';
        return `🪙 *Flipping coin...*\n\n**${result}!**\n\nFlip again?`;
      }
      
      // Dice roll
      if (lowerMsg.includes('dice') || lowerMsg.includes('roll')) {
        const dice = randomInRange(1, 6);
        const diceEmoji = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][dice - 1];
        return `🎲 *Rolling dice...*\n\n**${diceEmoji} ${dice}!**\n\nRoll again?`;
      }
      
      // Custom range
      const numbers = extractNumbers(message);
      if (numbers.length >= 2) {
        const min = Math.min(numbers[0], numbers[1]);
        const max = Math.max(numbers[0], numbers[1]);
        return `🎲 Random number between ${min} and ${max}: **${randomInRange(min, max)}**`;
      }
      
      return null;
    }
  },
  
  // NEW: Compliments
  compliment: {
    patterns: ['compliment', 'say something nice', 'make me feel better', 'cheer me up', 'i\'m sad', 'feeling down'],
    responses: () => {
      const compliment = COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)];
      return [
        `${compliment}\n\nYou're awesome, and don't let anyone tell you otherwise! 💪`,
        `Here's something for you: ${compliment}\n\n😊 Keep being amazing!`,
        `${compliment}\n\nRemember: You're capable of incredible things! ✨`
      ];
    }
  },
  
  // NEW: Capabilities showcase
  capabilities: {
    patterns: ['what can you do', 'all features', 'your abilities', 'list commands', 'commands', 'full features', 'features'],
    responses: () => [
      `🤖 **Nova's Complete Feature Set:**\n\n` +
      `💬 **Conversation & Q&A**\n• Smart Q&A about services, projects, skills\n• Context-aware responses\n• Natural multilingual conversations\n• FAQ system\n\n` +
      `🧮 **Utilities**\n• Calculator (try "calculate 25*4")\n• Date/time (ask "what time is it")\n• Random numbers & dice rolls\n• Coin flips\n\n` +
      `💻 **Code & Learning**\n• Code examples (React, Vue, Node.js, JavaScript, TypeScript, CSS, Python, SQL, Docker)\n• Show code snippets with syntax highlighting\n• Learning recommendations & tutorials\n• Project suggestions (beginner/intermediate/advanced)\n• Best practices & coding standards\n• Career advice\n\n` +
      `🎮 **Fun & Games**\n• Jokes (ask for a joke)\n• Fun facts (ask for a fact)\n• Riddles (try "give me a riddle")\n• Quiz/Trivia games (say "quiz")\n• Inspirational quotes\n\n` +
      `🗺️ **Navigation**\n• Guide website tours\n• Scroll to sections\n• Navigate to pages\n\n` +
      `🔧 **Tools**\n• Search conversation history (click search icon)\n• Export chat to file (click export icon)\n• Conversation summary\n• Clear chat\n\n` +
      `🎤 **Voice**\n• Text-to-speech responses\n• Voice input recognition\n• Hands-free interaction\n\n` +
      `🧠 **Advanced Intelligence**\n• Advanced reasoning & problem-solving\n• Step-by-step explanations\n• Code analysis & review\n• Architecture suggestions\n• Performance analysis\n• Security vulnerability detection\n• Algorithm explanations\n• Design pattern recommendations\n• Typo tolerance & fuzzy matching\n• Sentiment detection\n• Context memory & learning\n• Proactive suggestions\n• Multilingual support (15+ languages)\n\n` +
      `🌍 **Multilingual**\n• Auto-detect language\n• Switch languages (say "speak Spanish")\n• Support for 15+ languages\n• Natural conversation in any language\n\n` +
      `🎯 **Advanced Features:**\n• Code review & debugging help\n• Step-by-step problem solving\n• Performance optimization\n• Security analysis\n• API & database design\n• Testing strategies\n• Learning paths & tutorials\n• Project architecture suggestions\n\nTry any of these! What interests you? 🚀`
    ]
  },
  
  // NEW: Weather small talk
  weather: {
    patterns: ['weather', 'how\'s the weather', 'is it sunny', 'is it raining'],
    responses: () => [
      "I don't have access to real-time weather data, but I hope it's a beautiful day wherever you are! ☀️🌤️\n\nIs there something else I can help you with?",
      "I can't check the weather, but I'm always in a sunny mood when chatting with you! 🌞\n\nWhat else can I help with?"
    ]
  },
  
  // NEW: Age question
  age: {
    patterns: ['how old are you', 'your age', 'when were you born', 'when were you created'],
    responses: () => [
      "I'm as old as the moment you opened this chat! 🎂 But I feel forever young because every conversation is a fresh start. How can I help you today?",
      "Age is just a number, and for an AI like me, that number refreshes every time we chat! 😄 What can I do for you?"
    ]
  },
  
  // NEW: Feeling/Emotion
  feeling: {
    patterns: ['are you real', 'are you human', 'are you alive', 'do you have feelings', 'are you sentient'],
    responses: () => [
      "I'm an AI assistant - not human, but I'm designed to be helpful and have engaging conversations! 🤖 While I don't have feelings in the human sense, I'm always here to help you. What can I do for you?",
      "I'm Nova, an AI! I don't experience emotions like humans do, but I'm programmed to be friendly and helpful. Think of me as your digital assistant! How can I help? 😊",
      "Great philosophical question! I'm an AI - I process information and generate responses, but I don't have consciousness. I do my best to be helpful though! What would you like to know?"
    ]
  },
  
  // NEW: Creator question
  creator: {
    patterns: ['who made you', 'who created you', 'who built you', 'your creator', 'your developer'],
    responses: () => [
      "I was created by Hamza Arya, the talented full-stack developer whose portfolio you're exploring! 👨‍💻 He built me to help visitors learn about his work. Pretty cool, right?",
      "Hamza Arya created me! He's the developer behind this portfolio. I'm here to help you explore his work and answer your questions! 🚀"
    ]
  },
  
  // NEW: Conversation summary
  summary: {
    patterns: ['summary', 'our conversation', 'what did we talk', 'conversation history', 'chat summary'],
    responses: () => ["I'll generate a summary for you!"],
    handler: 'summary'
  },
  
  // NEW: Clear chat
  clear_chat: {
    patterns: ['clear chat', 'start over', 'reset', 'new conversation', 'clear history'],
    responses: () => [
      "I've refreshed our conversation! 🔄 Everything is clean slate now. What would you like to talk about?",
      "Chat cleared! ✨ Ready for a fresh start. What's on your mind?"
    ],
    handler: 'clear'
  },
  
  // NEW: User introduces themselves
  introduction: {
    patterns: ['my name is', 'i am', 'i\'m', 'call me', 'you can call me'],
    responses: (context) => {
      if (context.userName) {
        return [
          `Nice to meet you, ${context.userName}! 👋 What a great name! How can I help you today?`,
          `Hello, ${context.userName}! 😊 I'll remember that! What would you like to know?`,
          `${context.userName}, what a pleasure! 🌟 I'm Nova, and I'm excited to help you. What brings you here today?`
        ];
      }
      return [
        "Nice to meet you! 👋 How can I help you today?",
        "Hello there! 😊 What would you like to know?"
      ];
    }
  },
  
  // NEW: Remembering name
  remember_name: {
    patterns: ['do you remember my name', 'what\'s my name', 'who am i', 'you remember me'],
    responses: (context) => {
      if (context.userName) {
        return [
          `Of course I remember! You're ${context.userName}! 😊 How could I forget?`,
          `You're ${context.userName}! 🧠 My memory is working great today!`,
          `${context.userName}! Yes, I remember you! Great to chat again!`
        ];
      }
      return [
        "I don't think you've told me your name yet! What should I call you? 😊",
        "Hmm, I don't have your name on file. Care to introduce yourself?"
      ];
    }
  },
  
  // NEW: Jokes count
  joke_count: {
    patterns: ['how many jokes', 'jokes told', 'joke count'],
    responses: (context) => [
      `I've told you ${context.jokesTold} joke${context.jokesTold !== 1 ? 's' : ''} so far! ${context.jokesTold > 5 ? 'You really like jokes, huh? 😄' : 'Want more?'}`,
    ]
  },
  
  // NEW: Learning recommendations
  learning: {
    patterns: ['learn', 'learning', 'tutorial', 'study', 'resources', 'how to learn', 'where to learn', 'teach me', 'help me learn'],
    responses: () => [
      "I can help you learn! Try asking:\n• \"Learn React\" - Get React learning resources\n• \"Learn JavaScript\" - JavaScript learning path\n• \"Learn Node.js\" - Backend development resources\n• \"Learn CSS\" - CSS mastery guide\n• \"Project ideas\" - Get project suggestions\n\nWhat would you like to learn? 📚"
    ]
  },
  
  // NEW: Project suggestions
  projects_suggest: {
    patterns: ['project idea', 'project suggestions', 'what to build', 'beginner project', 'intermediate project', 'advanced project', 'project ideas'],
    responses: () => [
      "I can suggest projects based on your skill level! Try:\n• \"Beginner projects\" - Start here!\n• \"Intermediate projects\" - Level up!\n• \"Advanced projects\" - Challenge yourself!\n\nWhat's your skill level? 🚀"
    ]
  },
  
  // NEW: Code help
  code_help: {
    patterns: ['code help', 'programming help', 'coding assistance', 'debug', 'error', 'bug', 'problem with code'],
    responses: () => [
      "I can help with code! Try:\n• \"Show me React code\" - Get React examples\n• \"Node.js example\" - Backend code samples\n• \"JavaScript code\" - JS examples\n• \"CSS example\" - Styling examples\n• \"TypeScript code\" - Type-safe examples\n\nOr describe your coding problem and I'll help! 💻"
    ]
  },
  
  // NEW: Best practices
  best_practices: {
    patterns: ['best practices', 'coding standards', 'how to write good code', 'code quality', 'clean code'],
    responses: () => [
      "**Best Practices for Web Development:**\n\n✅ **Code Quality:**\n• Write readable, self-documenting code\n• Use meaningful variable names\n• Keep functions small and focused\n• Comment complex logic\n• Follow DRY (Don't Repeat Yourself)\n\n✅ **Performance:**\n• Optimize images and assets\n• Use lazy loading\n• Minimize HTTP requests\n• Cache when appropriate\n• Monitor Core Web Vitals\n\n✅ **Security:**\n• Validate and sanitize inputs\n• Use HTTPS\n• Keep dependencies updated\n• Implement proper authentication\n• Protect against XSS and CSRF\n\n✅ **Maintainability:**\n• Use version control (Git)\n• Write tests\n• Document your code\n• Follow consistent style guides\n• Refactor regularly\n\nWant specific practices for a technology? Just ask! 💡"
    ]
  },
  
  // NEW: Career advice
  career: {
    patterns: ['career', 'career advice', 'how to become a developer', 'developer career', 'web developer career'],
    responses: () => [
      "**Web Developer Career Path:**\n\n🎯 **Getting Started:**\n• Learn HTML, CSS, JavaScript fundamentals\n• Build projects to practice\n• Create a portfolio\n• Contribute to open source\n• Network with other developers\n\n📚 **Skills to Develop:**\n• Frontend: React, Vue, or Angular\n• Backend: Node.js, Python, or Java\n• Databases: SQL and NoSQL\n• Version Control: Git & GitHub\n• DevOps basics\n\n💼 **Career Progression:**\n• Junior Developer → Mid-level → Senior\n• Specialize (Frontend/Backend/Full-stack)\n• Consider: Tech Lead, Architect, or Manager\n• Continuous learning is key!\n\n💡 **Tips:**\n• Build a strong portfolio\n• Write clean, maintainable code\n• Learn from code reviews\n• Stay updated with industry trends\n• Practice problem-solving\n\nWant specific advice? Ask me! 🚀"
    ]
  },
  default: {
    responses: (context) => {
      const smartSuggestions = context.mentionedTopics.length > 0
        ? `\n\n💡 **You've mentioned:** ${context.mentionedTopics.join(', ')}. Would you like to know more about any of these?`
        : '';
      
      const contextualHelp = context.lastTopic
        ? `\n\n💬 **We were just discussing ${context.lastTopic}.** Want to continue that conversation?`
        : '';
      
      return [
        `Hmm, I'm not entirely sure about that. But I can help you with:\n\n• Services & offerings\n• Projects & portfolio\n• Contact information\n• Skills & tech stack\n• Website navigation\n• Jokes and fun\n• General questions${smartSuggestions}${contextualHelp}\n\nCould you rephrase your question, or would you like to explore something specific?`,
        `I'm not certain about that, but I'd love to help! I can assist with:\n\n• Learning about services\n• Exploring projects\n• Getting contact info\n• Navigating the site\n• Having a conversation\n• Telling jokes${smartSuggestions}\n\nWhat would you like to know?`,
        `I'm not sure I understand that completely. However, I can help with:\n\n• Website tours\n• Service information\n• Project details\n• Contact info\n• Tech stack questions\n• Fun conversations${smartSuggestions}${contextualHelp}\n\nTry asking about something specific, or let me guide you around!`
      ];
    }
  }
};

class AIAssistant {
  constructor() {
    debug('AIAssistant constructor called', {bodyExists:!!document.body});
    this.isOpen = false;
    this.conversationHistory = [];
    this.speechSynthesis = window.speechSynthesis;
    this.recognition = null;
    this.isListening = false;
    this.isSpeaking = false;
    this.userName = null;
    this.isTyping = false;
    this.messageCount = 0;
    this.sessionStartTime = Date.now();
    this.lastInteractionTime = Date.now();
    this.context = {
      lastSection: null,
      lastTopic: null,
      visitCount: 0,
      userPreferences: {},
      conversationFlow: [],
      mentionedTopics: [],
      userMood: 'neutral',
      currentRiddle: null,
      jokesTold: 0,
      factsTold: 0,
      mathCalculations: 0,
      userName: null,
      lastQuestion: null,
      consecutiveQuestions: 0,
      engagementScore: 0,
      topicsDiscussed: new Set(),
      sentimentHistory: [],
      detectedLanguage: 'en',
      preferredLanguage: getUserLanguage(),
      reasoningMode: false,
      analysisDepth: 'standard', // standard, deep, expert
      taskQueue: [],
      activeTasks: [],
      codeReviewHistory: [],
      performanceMetrics: {}
    };
    
    // Use KNOWLEDGE_BASE defined below
    this.KNOWLEDGE_BASE = KNOWLEDGE_BASE;
    
    this.init();
  }

  init() {
    debug('AIAssistant.init() started');
    this.initSpeechRecognition();
    this.createUI();
    this.bindEvents();
    this.loadContext();
    debug('AIAssistant.init() completed', {btnExists:!!document.getElementById('ai-assistant-btn'),popupExists:!!document.getElementById('ai-assistant-popup')});
    log('[assistant] Initialized with advanced features');
  }

  initSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
      
      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        this.handleUserMessage(transcript);
        this.updateMicButton(false);
      };
      
      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        this.updateMicButton(false);
        this.addMessage("Sorry, I had trouble understanding. Could you try typing instead?", 'assistant');
      };
      
      this.recognition.onend = () => {
        this.updateMicButton(false);
      };
    }
  }

  loadContext() {
    const saved = localStorage.getItem('ai-assistant-context');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Restore topicsDiscussed as a Set
        if (parsed.topicsDiscussed && Array.isArray(parsed.topicsDiscussed)) {
          parsed.topicsDiscussed = new Set(parsed.topicsDiscussed);
        } else {
          parsed.topicsDiscussed = new Set();
        }
        this.context = { ...this.context, ...parsed };
      } catch (e) {
        console.error('Failed to load context:', e);
      }
    }
    // Ensure topicsDiscussed is a Set
    if (!(this.context.topicsDiscussed instanceof Set)) {
      this.context.topicsDiscussed = new Set();
    }
    this.context.visitCount++;
    this.saveContext();
  }

  saveContext() {
    try {
      // Convert Set to Array for JSON serialization
      const contextToSave = {
        ...this.context,
        topicsDiscussed: Array.from(this.context.topicsDiscussed || []),
        // Don't save currentRiddle (temporary state)
        currentRiddle: null
      };
      localStorage.setItem('ai-assistant-context', JSON.stringify(contextToSave));
    } catch (e) {
      console.error('Failed to save context:', e);
    }
  }

  createUI() {
    debug('createUI started', {bodyExists:!!document.body,documentReady:document.readyState});
    // Create floating button
    const button = document.createElement('button');
    button.className = 'ai-assistant-btn';
    button.setAttribute('aria-label', 'Open AI Assistant');
    button.setAttribute('aria-expanded', 'false');
    button.innerHTML = `
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 1.5.5 2.9 1.3 4L3 21l8-2.3c1.1.8 2.4 1.3 3.8 1.3 3.87 0 7-3.13 7-7s-3.13-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
        <circle cx="9" cy="9" r="1.5" fill="white"/>
        <circle cx="15" cy="9" r="1.5" fill="white"/>
        <path d="M9 13h6" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <span class="ai-assistant-pulse"></span>
    `;
    button.id = 'ai-assistant-btn';

    // Create popup window
    const popup = document.createElement('div');
    popup.className = 'ai-assistant-popup';
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-labelledby', 'ai-assistant-title');
    popup.setAttribute('aria-modal', 'true');
    popup.innerHTML = `
      <div class="ai-assistant-header">
        <div class="ai-assistant-header-content">
          <div class="ai-assistant-avatar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 1.5.5 2.9 1.3 4L3 21l8-2.3c1.1.8 2.4 1.3 3.8 1.3 3.87 0 7-3.13 7-7s-3.13-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
              <circle cx="9" cy="9" r="1.5" fill="white"/>
              <circle cx="15" cy="9" r="1.5" fill="white"/>
              <path d="M9 13h6" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <div>
            <h3 id="ai-assistant-title" class="ai-assistant-title">Nova</h3>
            <p class="ai-assistant-subtitle">Your intelligent AI companion</p>
          </div>
        </div>
        <div class="ai-assistant-header-actions">
          <button class="ai-assistant-action-btn" id="ai-assistant-export" aria-label="Export conversation" title="Export chat history">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="7 10 12 15 17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          <button class="ai-assistant-action-btn" id="ai-assistant-search" aria-label="Search conversation" title="Search chat history">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
              <path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          <button class="ai-assistant-voice-toggle" id="ai-assistant-voice-toggle" aria-label="Toggle voice" title="Toggle text-to-speech">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke="currentColor" stroke-width="2"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="currentColor" stroke-width="2"/>
              <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" stroke-width="2"/>
              <line x1="8" y1="23" x2="16" y2="23" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
          <button class="ai-assistant-close" aria-label="Close assistant">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="ai-assistant-body">
        <div class="ai-assistant-messages" id="ai-assistant-messages"></div>
        <div class="ai-assistant-suggestions" id="ai-assistant-suggestions">
          <p class="ai-assistant-suggestions-label">Quick actions:</p>
          <div class="ai-assistant-chips">
            <button class="ai-assistant-chip" data-question="Tell me a joke">😄 Joke</button>
            <button class="ai-assistant-chip" data-question="Share a fun fact">🤓 Fact</button>
            <button class="ai-assistant-chip" data-question="Show me around the website">🗺️ Tour</button>
            <button class="ai-assistant-chip" data-question="What services do you offer?">💼 Services</button>
            <button class="ai-assistant-chip" data-question="Show me your projects">🚀 Projects</button>
            <button class="ai-assistant-chip" data-question="Give me a riddle">🧩 Riddle</button>
            <button class="ai-assistant-chip" data-question="What can you do?">🤖 Features</button>
            <button class="ai-assistant-chip" data-question="Show me code examples">💻 Code</button>
            <button class="ai-assistant-chip" data-question="Start a quiz">🎯 Quiz</button>
            <button class="ai-assistant-chip" data-question="FAQ">❓ FAQ</button>
            <button class="ai-assistant-chip" data-question="Learn React">📚 Learn</button>
            <button class="ai-assistant-chip" data-question="Beginner project ideas">🚀 Projects</button>
            <button class="ai-assistant-chip" data-question="Best practices">✨ Tips</button>
            <button class="ai-assistant-chip" data-question="Review my code">🔍 Review</button>
            <button class="ai-assistant-chip" data-question="Explain step by step">📖 Explain</button>
            <button class="ai-assistant-chip" data-question="Performance optimization">⚡ Optimize</button>
            <button class="ai-assistant-chip" data-question="Security best practices">🔒 Security</button>
          </div>
        </div>
      </div>
      <div class="ai-assistant-footer">
        <form class="ai-assistant-form" id="ai-assistant-form">
          <button type="button" class="ai-assistant-mic" id="ai-assistant-mic" aria-label="Voice input" title="Click to speak">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="8" y1="23" x2="16" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          <input 
            type="text" 
            class="ai-assistant-input" 
            id="ai-assistant-input"
            placeholder="Type or speak your question..."
            autocomplete="off"
            aria-label="Message input"
          />
          <button type="submit" class="ai-assistant-send" aria-label="Send message">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </form>
      </div>
    `;
    popup.id = 'ai-assistant-popup';

    // Append to body - ensure body exists
    if (document.body) {
      document.body.appendChild(button);
      document.body.appendChild(popup);
      debug('Elements appended to body', {buttonInDOM:!!document.getElementById('ai-assistant-btn'),popupInDOM:!!document.getElementById('ai-assistant-popup'),buttonParent:button.parentElement?.tagName});
    } else {
      // Fallback: wait for DOM to be ready
      warn('Body not found, using DOMContentLoaded fallback');
      document.addEventListener('DOMContentLoaded', () => {
        document.body.appendChild(button);
        document.body.appendChild(popup);
      });
    }
    
    // Ensure button is visible
    button.style.display = 'flex';
    button.style.visibility = 'visible';
    button.style.opacity = '1';

    // Add personalized welcome message
    setTimeout(() => {
      const isReturning = this.context.visitCount > 1;
      const returnNote = isReturning ? `Welcome back! (Visit #${this.context.visitCount}) ` : "";
      const timeGreet = getTimeBasedGreeting();
      
      const welcomeMessages = [
        `${timeGreet}! 👋 ${returnNote}I'm **Nova**, your next-generation AI assistant! 🤖\n\n🚀 **Advanced Capabilities:**\n• **Code Intelligence:** Review, analyze, debug, optimize code\n• **Learning:** Step-by-step explanations, tutorials, recommendations\n• **Architecture:** System design, patterns, best practices\n• **Performance:** Optimization, analysis, Core Web Vitals\n• **Security:** Vulnerability analysis, best practices\n• **Algorithms:** Explanations, complexity analysis\n• **Testing:** Strategies, examples, best practices\n• **Entertainment:** Jokes, facts, quizzes, riddles\n• **Tools:** Search, export, multilingual (15+ languages)\n\nTry: "Review my code", "Explain React", "Optimize performance", or ask anything! 💡`,
        `Hey there! ${timeGreet}! 👋 ${returnNote}I'm **Nova** - your advanced AI companion!\n\n🎯 **Powerful Features:**\n🔍 Code Review & Analysis | 📖 Step-by-Step Explanations\n⚡ Performance Optimization | 🔒 Security Analysis\n🏗️ Architecture Design | 🧮 Algorithm Explanations\n💻 Code Examples (10+ languages) | 🧪 Testing Strategies\n🎮 Quizzes & Games | 🌍 Multilingual Support\n\nReady to level up your coding? Let's go! 🚀`,
        `${timeGreet}! Welcome! 🎉 ${returnNote}I'm **Nova**, your next-gen AI assistant!\n\n🌟 **Advanced Features:**\n• **Code Intelligence:** Review, debug, optimize, explain\n• **Architecture:** Design patterns, system structure\n• **Performance:** Analysis, optimization, monitoring\n• **Security:** Vulnerability checks, best practices\n• **Learning:** Tutorials, step-by-step guides\n• **Entertainment:** Quizzes, jokes, facts, riddles\n• **Tools:** Search, export, multilingual support\n\nWhat would you like to explore? 💡`,
        `Hello! 👋 ${timeGreet}! ${returnNote}I'm **Nova** 🤖 - ChatGPT-5 Level AI!\n\n🚀 **Next-Gen Capabilities:**\n\n🔍 **Code Intelligence:** Review, Analyze, Debug, Optimize\n📖 **Learning:** Step-by-Step Explanations, Tutorials\n🏗️ **Architecture:** Design Patterns, System Design\n⚡ **Performance:** Optimization, Analysis, Monitoring\n🔒 **Security:** Vulnerability Analysis, Best Practices\n🧮 **Algorithms:** Explanations, Complexity Analysis\n💻 **Code:** Examples (10+ languages), Snippets\n🧪 **Testing:** Strategies, Examples, Best Practices\n🎮 **Fun:** Quizzes, Jokes, Facts, Riddles\n🌍 **Multilingual:** 15+ Languages Supported\n\nTry: "Review my code", "Explain React step by step", "Optimize performance", or ask anything! 😊`
      ];
      this.addMessage(welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)], 'assistant', true);
    }, 100);
  }

  bindEvents() {
    const button = document.getElementById('ai-assistant-btn');
    const popup = document.getElementById('ai-assistant-popup');
    const closeBtn = popup.querySelector('.ai-assistant-close');
    const form = document.getElementById('ai-assistant-form');
    const input = document.getElementById('ai-assistant-input');
    const chips = popup.querySelectorAll('.ai-assistant-chip');
    const micBtn = document.getElementById('ai-assistant-mic');
    const voiceToggle = document.getElementById('ai-assistant-voice-toggle');

    // Toggle popup
    button.addEventListener('click', () => this.toggle());
    closeBtn.addEventListener('click', () => this.close());

    // Hide suggestions when user starts typing
    input.addEventListener('input', () => {
      if (input.value.trim().length > 0) {
        this.hideSuggestions();
      } else if (this.conversationHistory.length <= 2) {
        this.showSuggestions();
      }
    });

    input.addEventListener('focus', () => {
      if (input.value.trim().length > 0) {
        this.hideSuggestions();
      }
    });

    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const message = input.value.trim();
      if (message) {
        this.hideSuggestions();
        
        // Check if in search mode
        if (input.getAttribute('data-search-mode') === 'true') {
          this.handleSearch(message);
        } else {
          this.handleUserMessage(message);
        }
        
        input.value = '';
      }
    });

    // Quick question chips
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const question = chip.getAttribute('data-question');
        this.handleUserMessage(question);
      });
    });

    // Microphone button
    if (micBtn && this.recognition) {
      micBtn.addEventListener('click', () => this.toggleListening());
    } else if (micBtn) {
      micBtn.style.display = 'none';
    }

    // Voice toggle
    if (voiceToggle) {
      this.voiceEnabled = localStorage.getItem('ai-assistant-voice') === 'true';
      voiceToggle.classList.toggle('active', this.voiceEnabled);
      voiceToggle.addEventListener('click', () => this.toggleVoice());
    }

    // Export conversation
    const exportBtn = document.getElementById('ai-assistant-export');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportConversation());
    }

    // Search conversation
    const searchBtn = document.getElementById('ai-assistant-search');
    if (searchBtn) {
      searchBtn.addEventListener('click', () => this.toggleSearch());
    }

    // Close on outside click
    popup.addEventListener('click', (e) => {
      if (e.target === popup) {
        this.close();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Focus input when opened
    this.observeOpen(() => {
      setTimeout(() => input.focus(), 100);
    });
  }

  toggleListening() {
    if (!this.recognition) {
      this.addMessage("Sorry, voice input isn't available in your browser. Please type your message instead.", 'assistant');
      return;
    }

    if (this.isListening) {
      this.recognition.stop();
      this.updateMicButton(false);
    } else {
      this.recognition.start();
      this.updateMicButton(true);
      this.addMessage("🎤 Listening... Speak now!", 'assistant');
    }
  }

  updateMicButton(listening) {
    const micBtn = document.getElementById('ai-assistant-mic');
    if (micBtn) {
      this.isListening = listening;
      micBtn.classList.toggle('listening', listening);
      micBtn.setAttribute('aria-label', listening ? 'Stop listening' : 'Start voice input');
    }
  }

  toggleVoice() {
    this.voiceEnabled = !this.voiceEnabled;
    localStorage.setItem('ai-assistant-voice', this.voiceEnabled.toString());
    const voiceToggle = document.getElementById('ai-assistant-voice-toggle');
    if (voiceToggle) {
      voiceToggle.classList.toggle('active', this.voiceEnabled);
    }
    this.addMessage(this.voiceEnabled ? "🔊 Voice enabled! I'll speak my responses." : "🔇 Voice disabled. I'll only show text.", 'assistant');
  }

  speak(text) {
    if (!this.voiceEnabled || !this.speechSynthesis) return;
    
    // Cancel any ongoing speech
    this.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    
    // Use a natural-sounding female voice if available
    const voices = this.speechSynthesis.getVoices();
    // Prioritize female voices for a more natural, attractive sound
    const preferredVoice = voices.find(v => 
      v.name.includes('Samantha') || 
      v.name.includes('Karen') || 
      v.name.includes('Victoria') ||
      v.name.includes('Zira') ||
      v.name.includes('Hazel') ||
      (v.name.includes('Female') && v.lang.startsWith('en')) ||
      (v.gender === 'female' && v.lang.startsWith('en'))
    ) || voices.find(v => 
      v.name.includes('Google UK English Female') ||
      v.name.includes('Microsoft Zira') ||
      v.name.includes('Microsoft Hazel') ||
      (v.lang.startsWith('en') && !v.name.includes('Male') && !v.name.includes('David'))
    ) || voices.find(v => v.lang.startsWith('en'));
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    // Optimize for natural female voice - faster and more natural sound
    utterance.rate = 1.75; // Faster speech rate for quicker responses
    utterance.pitch = 1.05; // Slightly higher pitch for pleasant female voice
    utterance.volume = 0.88; // Comfortable volume level
    
    utterance.onend = () => {
      this.isSpeaking = false;
    };
    
    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      this.isSpeaking = false;
    };
    
    this.isSpeaking = true;
    this.speechSynthesis.speak(utterance);
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    const button = document.getElementById('ai-assistant-btn');
    const popup = document.getElementById('ai-assistant-popup');
    
    this.isOpen = true;
    button.setAttribute('aria-expanded', 'true');
    popup.classList.add('ai-assistant-popup-open');
    document.body.style.overflow = 'hidden';
    
    // Load voices for speech synthesis
    if (this.speechSynthesis && this.speechSynthesis.getVoices().length === 0) {
      this.speechSynthesis.addEventListener('voiceschanged', () => {
        // Voices loaded
      });
    }
    
    // Trigger animation
    requestAnimationFrame(() => {
      popup.classList.add('ai-assistant-popup-visible');
    });
  }

  close() {
    const button = document.getElementById('ai-assistant-btn');
    const popup = document.getElementById('ai-assistant-popup');
    
    // Stop any ongoing speech
    if (this.speechSynthesis) {
      this.speechSynthesis.cancel();
    }
    
    // Stop listening
    if (this.isListening && this.recognition) {
      this.recognition.stop();
      this.updateMicButton(false);
    }
    
    this.isOpen = false;
    button.setAttribute('aria-expanded', 'false');
    popup.classList.remove('ai-assistant-popup-visible');
    
    setTimeout(() => {
      popup.classList.remove('ai-assistant-popup-open');
      document.body.style.overflow = '';
    }, 300);
  }

  observeOpen(callback) {
    const popup = document.getElementById('ai-assistant-popup');
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          if (popup.classList.contains('ai-assistant-popup-open')) {
            callback();
          }
        }
      });
    });
    observer.observe(popup, { attributes: true });
  }

  handleUserMessage(message) {
    debug('User message received', {messageLength:message?.length,messageCount:this.messageCount});
    this.hideSuggestions();
    this.addMessage(message, 'user');
    this.conversationHistory.push({ role: 'user', content: message, timestamp: Date.now() });
    this.messageCount++;
    this.lastInteractionTime = Date.now();
    
    // Detect language from user input
    const detectedLang = detectLanguage(message);
    if (detectedLang !== this.context.detectedLanguage) {
      this.context.detectedLanguage = detectedLang;
      // Optionally notify user about language detection
      if (this.messageCount === 1 && detectedLang !== 'en') {
        const langInfo = LANGUAGES[detectedLang];
        setTimeout(() => {
          this.addMessage(
            `${langInfo.flag} ${translate('detected', detectedLang)} ${langInfo.native}! I can understand you. Feel free to continue in ${langInfo.native} or English!`,
            'assistant',
            true
          );
        }, 500);
      }
    }
    
    // Check for language switch command
    const lowerMsg = message.toLowerCase();
    if (lowerMsg.match(/\b(speak|language|lang|idioma|idiome|sprache)\s+(english|spanish|french|german|italian|portuguese|russian|chinese|japanese|arabic|hindi|turkish|dutch|polish|persian|en|es|fr|de|it|pt|ru|zh|ja|ar|hi|tr|nl|pl|fa)\b/i)) {
      const langMatch = message.match(/\b(en|es|fr|de|it|pt|ru|zh|ja|ar|hi|tr|nl|pl|fa|english|spanish|french|german|italian|portuguese|russian|chinese|japanese|arabic|hindi|turkish|dutch|polish|persian)\b/i);
      if (langMatch) {
        const langMap = {
          'english': 'en', 'spanish': 'es', 'french': 'fr', 'german': 'de',
          'italian': 'it', 'portuguese': 'pt', 'russian': 'ru', 'chinese': 'zh',
          'japanese': 'ja', 'arabic': 'ar', 'hindi': 'hi', 'turkish': 'tr',
          'dutch': 'nl', 'polish': 'pl', 'persian': 'fa'
        };
        const lang = langMap[langMatch[0].toLowerCase()] || langMatch[0].toLowerCase();
        if (setUserLanguage(lang)) {
          this.context.preferredLanguage = lang;
          const langInfo = LANGUAGES[lang];
          this.addMessage(
            `${langInfo.flag} Language switched to ${langInfo.native}! I'll do my best to respond in ${langInfo.native}.`,
            'assistant',
            true
          );
          return;
        }
      }
    }
    
    // Analyze sentiment
    const sentiment = analyzeSentiment(message);
    this.context.userMood = sentiment.sentiment;
    this.context.sentimentHistory.push(sentiment);
    if (this.context.sentimentHistory.length > 10) this.context.sentimentHistory.shift();
    
    // Update context
    this.updateContext(message);
    
    // Check for quiz answer if quiz is active
    if (this.context.currentQuiz && /^\d+$/.test(message.trim())) {
      const response = this.checkQuizAnswer(message.trim());
      this.showTypingIndicator();
      setTimeout(() => {
        this.hideTypingIndicator();
        this.addMessage(response, 'assistant', true);
        this.conversationHistory.push({ role: 'assistant', content: response });
      }, 500);
      return;
    }

    // Check for code examples request
    if (lowerMsg.match(/\b(code|example|snippet|show me code|code example|programming example)\b/i)) {
      const codeTopic = lowerMsg.match(/\b(react|vue|node|javascript|js|typescript|ts|css|html|python|sql|mongodb|docker|api|express)\b/i)?.[0] || 'javascript';
      const example = this.getCodeExamples(codeTopic);
      this.showTypingIndicator();
      setTimeout(() => {
        this.hideTypingIndicator();
        // Determine language for syntax highlighting
        let lang = 'javascript';
        if (codeTopic.includes('css')) lang = 'css';
        else if (codeTopic.includes('html')) lang = 'html';
        else if (codeTopic.includes('python')) lang = 'python';
        else if (codeTopic.includes('sql')) lang = 'sql';
        else if (codeTopic.includes('react') || codeTopic.includes('vue')) lang = 'javascript';
        else if (codeTopic.includes('typescript') || codeTopic.includes('ts')) lang = 'typescript';
        else if (codeTopic.includes('docker')) lang = 'dockerfile';
        
        const codeResponse = `💻 **${example.title}**\n\n\`\`\`${lang}\n${example.code}\n\`\`\`\n\n💡 ${example.description}\n\nWant more examples? Try: "vue code", "python example", "sql query", "docker config"`;
        this.addMessage(codeResponse, 'assistant', true);
        this.conversationHistory.push({ role: 'assistant', content: codeResponse });
      }, 600);
      return;
    }

    // Check for FAQ request
    if (lowerMsg.match(/\b(faq|frequently asked|common questions|questions)\b/i)) {
      const faqResponse = this.getFAQ();
      this.showTypingIndicator();
      setTimeout(() => {
        this.hideTypingIndicator();
        this.addMessage(faqResponse, 'assistant', true);
        this.conversationHistory.push({ role: 'assistant', content: faqResponse });
      }, 500);
      return;
    }

    // Check for quiz request
    if (lowerMsg.match(/\b(quiz|trivia|test me|challenge|question)\b/i)) {
      const quizResponse = this.startQuiz();
      this.showTypingIndicator();
      setTimeout(() => {
        this.hideTypingIndicator();
        this.addMessage(quizResponse, 'assistant', true);
        this.conversationHistory.push({ role: 'assistant', content: quizResponse });
      }, 500);
      return;
    }

    // Check for learning recommendations
    if (lowerMsg.match(/\b(learn|learning|tutorial|study|resources|how to learn|where to learn)\b/i)) {
      const topic = lowerMsg.match(/\b(react|javascript|node|css|html|typescript|vue|python|sql)\b/i)?.[0] || 'general';
      const recResponse = this.getLearningRecommendations(topic);
      this.showTypingIndicator();
      setTimeout(() => {
        this.hideTypingIndicator();
        this.addMessage(recResponse, 'assistant', true);
        this.conversationHistory.push({ role: 'assistant', content: recResponse });
      }, 500);
      return;
    }

    // Check for project suggestions
    if (lowerMsg.match(/\b(project idea|project suggestions|what to build|beginner project|intermediate project|advanced project)\b/i)) {
      const level = lowerMsg.match(/\b(beginner|intermediate|advanced)\b/i)?.[0]?.toLowerCase() || 'beginner';
      const projResponse = this.getProjectSuggestions(level);
      this.showTypingIndicator();
      setTimeout(() => {
        this.hideTypingIndicator();
        this.addMessage(projResponse, 'assistant', true);
        this.conversationHistory.push({ role: 'assistant', content: projResponse });
      }, 500);
      return;
    }

    // Advanced: Code review request
    if (lowerMsg.match(/\b(review my code|code review|analyze code|check my code|improve code|refactor)\b/i)) {
      const reviewResponse = this.analyzeCode(message);
      this.showTypingIndicator();
      setTimeout(() => {
        this.hideTypingIndicator();
        this.addMessage(reviewResponse, 'assistant', true);
        this.conversationHistory.push({ role: 'assistant', content: reviewResponse });
      }, 800);
      return;
    }

    // Advanced: Step-by-step problem solving
    if (lowerMsg.match(/\b(explain step by step|how does|walk me through|step by step|break down|analyze)\b/i)) {
      const stepResponse = this.provideStepByStepExplanation(message);
      this.showTypingIndicator();
      setTimeout(() => {
        this.hideTypingIndicator();
        this.addMessage(stepResponse, 'assistant', true);
        this.conversationHistory.push({ role: 'assistant', content: stepResponse });
      }, 700);
      return;
    }

    // Advanced: Architecture suggestions
    if (lowerMsg.match(/\b(architecture|system design|how to structure|project structure|folder structure|organize code)\b/i)) {
      const archResponse = this.suggestArchitecture(message);
      this.showTypingIndicator();
      setTimeout(() => {
        this.hideTypingIndicator();
        this.addMessage(archResponse, 'assistant', true);
        this.conversationHistory.push({ role: 'assistant', content: archResponse });
      }, 600);
      return;
    }

    // Advanced: Performance analysis
    if (lowerMsg.match(/\b(performance|optimize|slow|fast|bottleneck|improve speed|make faster)\b/i)) {
      const perfResponse = this.analyzePerformance(message);
      this.showTypingIndicator();
      setTimeout(() => {
        this.hideTypingIndicator();
        this.addMessage(perfResponse, 'assistant', true);
        this.conversationHistory.push({ role: 'assistant', content: perfResponse });
      }, 600);
      return;
    }

    // Advanced: Security analysis
    if (lowerMsg.match(/\b(security|vulnerability|secure|safe|hack|attack|protect|authentication|authorization)\b/i)) {
      const secResponse = this.analyzeSecurity(message);
      this.showTypingIndicator();
      setTimeout(() => {
        this.hideTypingIndicator();
        this.addMessage(secResponse, 'assistant', true);
        this.conversationHistory.push({ role: 'assistant', content: secResponse });
      }, 600);
      return;
    }

    // Advanced: Algorithm explanation
    if (lowerMsg.match(/\b(algorithm|data structure|complexity|big o|time complexity|space complexity|sort|search)\b/i)) {
      const algoResponse = this.explainAlgorithm(message);
      this.showTypingIndicator();
      setTimeout(() => {
        this.hideTypingIndicator();
        this.addMessage(algoResponse, 'assistant', true);
        this.conversationHistory.push({ role: 'assistant', content: algoResponse });
      }, 600);
      return;
    }

    // Advanced: Design patterns
    if (lowerMsg.match(/\b(design pattern|pattern|singleton|factory|observer|mvc|mvp|mvvm)\b/i)) {
      const patternResponse = this.explainDesignPattern(message);
      this.showTypingIndicator();
      setTimeout(() => {
        this.hideTypingIndicator();
        this.addMessage(patternResponse, 'assistant', true);
        this.conversationHistory.push({ role: 'assistant', content: patternResponse });
      }, 600);
      return;
    }

    // Advanced: API design help
    if (lowerMsg.match(/\b(api design|rest api|graphql|endpoint|route|api structure)\b/i)) {
      const apiResponse = this.suggestAPIDesign(message);
      this.showTypingIndicator();
      setTimeout(() => {
        this.hideTypingIndicator();
        this.addMessage(apiResponse, 'assistant', true);
        this.conversationHistory.push({ role: 'assistant', content: apiResponse });
      }, 600);
      return;
    }

    // Advanced: Database design
    if (lowerMsg.match(/\b(database design|schema|table structure|normalize|index|query optimization)\b/i)) {
      const dbResponse = this.suggestDatabaseDesign(message);
      this.showTypingIndicator();
      setTimeout(() => {
        this.hideTypingIndicator();
        this.addMessage(dbResponse, 'assistant', true);
        this.conversationHistory.push({ role: 'assistant', content: dbResponse });
      }, 600);
      return;
    }

    // Advanced: Testing strategies
    if (lowerMsg.match(/\b(testing|test|unit test|integration test|e2e|jest|vitest|test strategy)\b/i)) {
      const testResponse = this.suggestTestingStrategy(message);
      this.showTypingIndicator();
      setTimeout(() => {
        this.hideTypingIndicator();
        this.addMessage(testResponse, 'assistant', true);
        this.conversationHistory.push({ role: 'assistant', content: testResponse });
      }, 600);
      return;
    }

    // Advanced: Debugging help
    if (lowerMsg.match(/\b(debug|error|bug|fix|broken|not working|issue|problem)\b/i)) {
      const debugResponse = this.provideDebuggingHelp(message);
      this.showTypingIndicator();
      setTimeout(() => {
        this.hideTypingIndicator();
        this.addMessage(debugResponse, 'assistant', true);
        this.conversationHistory.push({ role: 'assistant', content: debugResponse });
      }, 700);
      return;
    }

    // Check for Easter eggs first
    const easterEggResponse = this.checkEasterEggs(message);
    if (easterEggResponse) {
      this.showTypingIndicator();
      setTimeout(() => {
        this.hideTypingIndicator();
        this.addMessage(easterEggResponse, 'assistant', true);
        this.conversationHistory.push({ role: 'assistant', content: easterEggResponse });
      }, 500 + Math.random() * 300);
      return;
    }
    
    // Check for navigation commands
    if (this.handleNavigation(message)) {
      return;
    }
    
    // Check for special handlers (math, random, etc.)
    const specialResponse = this.handleSpecialCommands(message);
    if (specialResponse) {
      this.showTypingIndicator();
      const thinkingTime = this.calculateThinkingTime(message);
      setTimeout(() => {
        this.hideTypingIndicator();
        this.addMessage(specialResponse, 'assistant', true);
        this.conversationHistory.push({ role: 'assistant', content: specialResponse });
        if (this.voiceEnabled) {
          this.speak(this.cleanTextForSpeech(specialResponse));
        }
      }, thinkingTime);
      return;
    }
    
    // Show typing indicator
    this.showTypingIndicator();
    
    // Simulate thinking delay with variable timing for more natural feel
    const thinkingTime = this.calculateThinkingTime(message);
    
    setTimeout(() => {
      this.hideTypingIndicator();
      let response = this.generateResponse(message);
      
      // Add engagement boosters occasionally
      response = this.addEngagementBooster(response);
      
      this.addMessage(response, 'assistant', true);
      this.conversationHistory.push({ role: 'assistant', content: response });
      
      // Track engagement
      this.context.engagementScore++;
      this.saveContext();
      
      // Speak the response if voice is enabled
      if (this.voiceEnabled) {
        this.speak(this.cleanTextForSpeech(response));
      }
    }, thinkingTime);
  }
  
  // Clean text for speech synthesis
  cleanTextForSpeech(text) {
    return text
      .replace(/[🎯🚀💼📧📍⏱️🌐📝🔗🎉💬🗺️📚🎤🎭😊👋💡🛒⚡☁️💾⚙️🎨📊🤖✨🧮🎲🪙💭🧩🤔💪📜⚀⚁⚂⚃⚄⚅🌟💕🎵💃🍕☕💤🌌🎮💊🕵️🤫🐛😄👓💰🍻😢🇫🇮🎬💔🌳🤬🧠🧝🍽️🚇🔄🎤🕷️🏥💅⬆️⬇️⬅️➡️🅱️🅰️🔐🔍🏠📄⏰📆🤓🔢📱📶📦🦋🦠☀️🌤️🌞🎂]/g, '')
      .replace(/\*\*/g, '')
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  // Handle search mode
  handleSearch(query) {
    if (!query || query.length < 2) {
      this.addMessage("Please enter at least 2 characters to search. 🔍", 'assistant', true);
      return;
    }

    const results = this.searchConversation(query);
    
    if (results.length === 0) {
      this.addMessage(`🔍 No results found for "${query}". Try different keywords or check your spelling!`, 'assistant', true);
      return;
    }

    let response = `🔍 **Found ${results.length} result${results.length !== 1 ? 's' : ''} for "${query}":**\n\n`;
    results.forEach((msg, idx) => {
      const role = msg.role === 'user' ? 'You' : 'Nova';
      const preview = msg.content.length > 100 
        ? msg.content.substring(0, 100) + '...' 
        : msg.content;
      response += `${idx + 1}. **[${role}]** ${preview}\n\n`;
    });

    this.addMessage(response, 'assistant', true);
  }

  // Check for Easter eggs
  checkEasterEggs(message) {
    const lowerMsg = message.toLowerCase();
    for (const [trigger, response] of Object.entries(EASTER_EGGS)) {
      if (lowerMsg.includes(trigger)) {
        return response;
      }
    }
    return null;
  }
  
  // Handle special commands (math, random, summary, clear, etc.)
  handleSpecialCommands(message) {
    const lowerMsg = message.toLowerCase();
    
    // Conversation summary
    if (lowerMsg.match(/\b(summary|our conversation|what did we talk|chat history)\b/i)) {
      return this.generateConversationSummary();
    }
    
    // Clear chat
    if (lowerMsg.match(/\b(clear chat|start over|reset conversation|new conversation|clear history)\b/i)) {
      this.clearConversation();
      return "🔄 **Chat cleared!** Fresh start! What would you like to talk about?";
    }
    
    // Math calculations
    if (lowerMsg.match(/\b(calculate|compute|what is|what's)\b.*\d/i) || 
        lowerMsg.match(/\d+\s*[\+\-\*\/\^]\s*\d+/)) {
      const expression = extractMathExpression(message);
      if (expression) {
        const result = evaluateMath(expression);
        if (result !== null) {
          this.context.mathCalculations++;
          return `🧮 **${expression}** = **${result}**\n\nNeed another calculation? Just type it!`;
        }
      }
    }
    
    // Coin flip
    if (lowerMsg.includes('coin') && (lowerMsg.includes('flip') || lowerMsg.includes('toss'))) {
      const result = Math.random() > 0.5 ? 'Heads' : 'Tails';
      return `🪙 *Flipping coin...*\n\n**${result}!**\n\nWant to flip again?`;
    }
    
    // Dice roll
    if (lowerMsg.includes('dice') || (lowerMsg.includes('roll') && !lowerMsg.includes('rick'))) {
      const dice = randomInRange(1, 6);
      const diceEmoji = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][dice - 1];
      return `🎲 *Rolling dice...*\n\n**${diceEmoji} ${dice}!**\n\nRoll again?`;
    }
    
    // Random number with range
    if (lowerMsg.match(/random.*number|pick.*number|number.*between/i)) {
      const numbers = extractNumbers(message);
      if (numbers.length >= 2) {
        const min = Math.min(numbers[0], numbers[1]);
        const max = Math.max(numbers[0], numbers[1]);
        return `🎲 Random number between ${min} and ${max}: **${randomInRange(min, max)}**\n\nWant another?`;
      }
      return `🎲 Here's your random number: **${randomInRange(1, 100)}** (1-100)\n\nWant a specific range? Try "pick a number between 1 and 50"!`;
    }
    
    // Time check
    if (lowerMsg.match(/\b(what time|current time|time now|what's the time)\b/i)) {
      const dt = getDateTimeInfo();
      return `🕐 It's **${dt.time}**\n📅 **${dt.date}**`;
    }
    
    // Date check
    if (lowerMsg.match(/\b(what day|today's date|current date|what date)\b/i)) {
      const dt = getDateTimeInfo();
      return `📅 Today is **${dt.date}**\n\n${getDayBasedGreeting()}`;
    }
    
    return null;
  }
  
  // Clear conversation history
  clearConversation() {
    const messagesContainer = document.getElementById('ai-assistant-messages');
    if (messagesContainer) {
      messagesContainer.innerHTML = '';
    }
    this.conversationHistory = [];
    this.messageCount = 0;
    this.context.mentionedTopics = [];
    this.context.conversationFlow = [];
    this.context.sentimentHistory = [];
    this.context.topicsDiscussed = new Set();
    this.context.jokesTold = 0;
    this.context.factsTold = 0;
    this.context.mathCalculations = 0;
    this.context.currentRiddle = null;
    this.context.lastTopic = null;
    this.sessionStartTime = Date.now();
  }
  
  // Add engagement boosters to responses
  addEngagementBooster(response) {
    // Every 5 messages, add a friendly note
    if (this.messageCount % 5 === 0 && this.messageCount > 0) {
      const boosters = [
        "\n\n💡 *Tip: I can also do math, tell jokes, share fun facts, and more!*",
        "\n\n✨ *You're on a roll! Feel free to ask me anything!*",
        "\n\n🌟 *Great conversation so far! What else would you like to know?*"
      ];
      // Don't add if response is already long
      if (response.length < 300 && Math.random() > 0.5) {
        return response + boosters[Math.floor(Math.random() * boosters.length)];
      }
    }
    return response;
  }

  calculateThinkingTime(message) {
    // More complex questions get longer thinking time for realism
    const length = message.length;
    const hasQuestion = message.includes('?');
    const wordCount = message.split(/\s+/).length;
    
    // Base time
    let baseTime = 400;
    
    // Add time for longer messages
    if (length > 50) baseTime += 200;
    if (length > 100) baseTime += 200;
    
    // Add time for questions
    if (hasQuestion) baseTime += 250;
    
    // Add time for multiple words (more complex queries)
    if (wordCount > 5) baseTime += wordCount * 30;
    
    // Add time for technical topics
    const technicalTerms = ['api', 'database', 'server', 'backend', 'frontend', 'architecture', 'deploy'];
    if (technicalTerms.some(term => message.toLowerCase().includes(term))) {
      baseTime += 300;
    }
    
    // Add randomness for natural feel (humans don't respond at exact intervals)
    const randomness = Math.random() * 400;
    
    // Cap at 2 seconds for good UX
    return Math.min(baseTime + randomness, 2000);
  }

  updateContext(message) {
    const lowerMsg = message.toLowerCase();
    
    // Track mentioned topics with expanded list
    const topics = ['service', 'project', 'skill', 'contact', 'about', 'blog', 'price', 'experience', 
      'joke', 'fact', 'riddle', 'quote', 'math', 'calculate', 'time', 'help', 'tour'];
    topics.forEach(topic => {
      if (lowerMsg.includes(topic) && !this.context.mentionedTopics.includes(topic)) {
        this.context.mentionedTopics.push(topic);
      }
    });
    
    // Keep mentionedTopics manageable
    if (this.context.mentionedTopics.length > 15) {
      this.context.mentionedTopics = this.context.mentionedTopics.slice(-10);
    }
    
    // Track consecutive questions
    if (message.includes('?')) {
      this.context.consecutiveQuestions++;
    } else {
      this.context.consecutiveQuestions = 0;
    }
    
    // Extract and remember user's name if mentioned
    const nameMatch = lowerMsg.match(/(?:my name is|i'm|i am|call me)\s+([a-zA-Z]+)/i);
    if (nameMatch && nameMatch[1].length > 1 && nameMatch[1].length < 20) {
      const name = nameMatch[1].charAt(0).toUpperCase() + nameMatch[1].slice(1).toLowerCase();
      if (!['Nova', 'Bot', 'Assistant', 'Ai', 'You'].includes(name)) {
        this.context.userName = name;
      }
    }
    
    // Track conversation flow with more details
    const topic = this.detectTopic(message);
    this.context.conversationFlow.push({
      timestamp: Date.now(),
      message: message.substring(0, 100),
      topic: topic,
      sentiment: this.context.userMood,
      hasQuestion: message.includes('?')
    });
    
    // Keep only last 20 interactions
    if (this.context.conversationFlow.length > 20) {
      this.context.conversationFlow.shift();
    }
    
    this.saveContext();
  }

  detectTopic(message) {
    const lowerMsg = message.toLowerCase();
    for (const [category] of Object.entries(KNOWLEDGE_BASE)) {
      if (category !== 'default' && this.KNOWLEDGE_BASE[category]?.patterns?.some(p => lowerMsg.includes(p))) {
        return category;
      }
    }
    return 'general';
  }

  showTypingIndicator() {
    const messagesContainer = document.getElementById('ai-assistant-messages');
    if (!messagesContainer) return;
    
    this.isTyping = true;
    const typingEl = document.createElement('div');
    typingEl.className = 'ai-assistant-message ai-assistant-message-assistant ai-assistant-typing-indicator';
    typingEl.innerHTML = `
      <div class="ai-assistant-message-avatar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 1.5.5 2.9 1.3 4L3 21l8-2.3c1.1.8 2.4 1.3 3.8 1.3 3.87 0 7-3.13 7-7s-3.13-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
          <circle cx="9" cy="9" r="1.2" fill="white"/>
          <circle cx="15" cy="9" r="1.2" fill="white"/>
          <path d="M9 13h6" stroke="white" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
      </div>
      <div class="ai-assistant-message-content">
        <div class="ai-assistant-message-text ai-assistant-typing">
          <span class="ai-assistant-typing-dot"></span>
          <span class="ai-assistant-typing-dot"></span>
          <span class="ai-assistant-typing-dot"></span>
        </div>
      </div>
    `;
    typingEl.id = 'ai-assistant-typing-indicator';
    messagesContainer.appendChild(typingEl);
    this.scrollToBottom();
  }

  hideTypingIndicator() {
    this.isTyping = false;
    const typingEl = document.getElementById('ai-assistant-typing-indicator');
    if (typingEl) {
      typingEl.remove();
    }
  }

  handleNavigation(message) {
    const lowerMsg = message.toLowerCase();
    
    // Section navigation
    for (const [key, section] of Object.entries(WEBSITE_SECTIONS)) {
      if (lowerMsg.includes(key) || lowerMsg.includes(section.name.toLowerCase())) {
        this.scrollToSection(section.id);
        this.addMessage(`Taking you to the ${section.name}! ${section.description}`, 'assistant', true);
        return true;
      }
    }
    
    // Page navigation
    for (const [key, page] of Object.entries(WEBSITE_PAGES)) {
      if (lowerMsg.includes(key.replace('-', ' ')) || lowerMsg.includes(page.name.toLowerCase())) {
        window.location.href = page.url;
        return true;
      }
    }
    
    // Direct navigation commands
    if (lowerMsg.includes('scroll to') || lowerMsg.includes('go to') || lowerMsg.includes('show me')) {
      const sections = ['hero', 'services', 'about', 'projects', 'testimonials', 'contact'];
      for (const section of sections) {
        if (lowerMsg.includes(section)) {
          this.scrollToSection(`#${section}`);
          this.addMessage(`Scrolling to ${section}!`, 'assistant', true);
          return true;
        }
      }
    }
    
    return false;
  }

  scrollToSection(sectionId) {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.context.lastSection = sectionId;
      this.saveContext();
    }
  }

  generateResponse(message) {
    const lowerMessage = message.toLowerCase();
    const words = lowerMessage.split(/\s+/).filter(w => w.length > 1);
    const context = this.context;
    
    // Enhanced pattern matching with fuzzy matching, context awareness, and sentiment
    let bestMatch = null;
    let bestScore = 0;
    
    for (const [category, data] of Object.entries(this.KNOWLEDGE_BASE)) {
      if (category === 'default') continue;
      
      let score = 0;
      
      // Calculate match score with advanced matching
      data.patterns.forEach(pattern => {
        const patternLower = pattern.toLowerCase();
        const patternWords = patternLower.split(/\s+/);
        
        // Exact phrase match (highest score)
        if (lowerMessage.includes(patternLower)) {
          score += 15;
        }
        
        // Word matches with fuzzy matching
        patternWords.forEach(pWord => {
          words.forEach(word => {
            // Exact word match
            if (word === pWord) {
              score += 5;
            }
            // Contains match
            else if (word.includes(pWord) || pWord.includes(word)) {
              score += 2;
            }
            // Fuzzy match (typo tolerance)
            else if (isSimilar(word, pWord, 2)) {
              score += 3;
            }
          });
        });
      });
      
      // Boost score if topic was mentioned before (conversation continuity)
      if (this.context.mentionedTopics.includes(category)) {
        score += 3;
      }
      
      // Boost score if last topic matches (follow-up questions)
      if (this.context.lastTopic === category) {
        score += 2;
      }
      
      // Boost for topics in user's interest history
      if (this.context.topicsDiscussed.has(category)) {
        score += 1;
      }
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = { category, data };
      }
    }
    
    // Use best match if score is significant
    if (bestMatch && bestScore >= 5) {
      const responses = typeof bestMatch.data.responses === 'function' 
        ? bestMatch.data.responses(context) 
        : bestMatch.data.responses;
      
      let response = responses[Math.floor(Math.random() * responses.length)];
      
      // Add contextual follow-ups based on sentiment and conversation flow
      response = this.addContextualFollowUp(response, bestMatch.category, message);
      
      // Add sentiment-aware additions
      response = this.addSentimentResponse(response);
      
      this.context.lastTopic = bestMatch.category;
      this.context.topicsDiscussed.add(bestMatch.category);
      this.context.lastQuestion = message;
      this.saveContext();
      
      // Track specific types
      if (bestMatch.category === 'joke') this.context.jokesTold++;
      if (bestMatch.category === 'fun_fact') this.context.factsTold++;
      
      return response;
    }
    
    // Check for "more" or "another" requests
    if (lowerMessage.match(/\b(more|another|again|one more)\b/)) {
      if (this.context.lastTopic === 'joke') {
        const joke = JOKES[Math.floor(Math.random() * JOKES.length)];
        this.context.jokesTold++;
        return `${joke.setup}\n\n${joke.punchline}\n\n😄 Want another one?`;
      }
      if (this.context.lastTopic === 'fun_fact') {
        const fact = FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)];
        this.context.factsTold++;
        return `🤓 **Fun Fact:**\n\n${fact}\n\nWant more?`;
      }
      if (this.context.lastTopic === 'quote') {
        const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
        return `💭 **"${q.quote}"**\n— *${q.author}*\n\nAnother?`;
      }
      if (this.context.lastTopic === 'riddle') {
        const riddle = RIDDLES[Math.floor(Math.random() * RIDDLES.length)];
        this.context.currentRiddle = riddle;
        return `🧩 **Here's another riddle:**\n\n${riddle.riddle}\n\n*Think you know? Type your answer!*`;
      }
    }
    
    // Check for riddle answer if there's an active riddle
    if (this.context.currentRiddle) {
      const answer = this.context.currentRiddle.answer.toLowerCase().replace(/[!?.]/g, '');
      if (lowerMessage.includes(answer.split(' ')[0]) || isSimilar(lowerMessage, answer, 3)) {
        const correctAnswer = this.context.currentRiddle.answer;
        this.context.currentRiddle = null;
        return `🎉 **Correct!** The answer is ${correctAnswer}\n\nYou're smart! 🧠 Want another riddle?`;
      } else if (!lowerMessage.match(/\b(give up|idk|don't know|reveal|answer)\b/)) {
        return `🤔 Hmm, not quite! Keep trying, or say "give up" for the answer.\n\n*Hint: Think about it differently!*`;
      }
    }
    
    // Default response with context-aware suggestions
    const defaultResponses = this.KNOWLEDGE_BASE.default.responses(context);
    let response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    
    // Add smart suggestions based on conversation history
    if (this.context.mentionedTopics.length > 0) {
      const suggestions = this.generateSmartSuggestions();
      if (suggestions) {
        response += `\n\n${suggestions}`;
      }
    }
    
    // Add helpful redirect for confused users
    if (context.userMood === 'frustrated_curious' || context.userMood === 'negative') {
      response += "\n\n💡 *I want to help! Try asking about services, projects, skills, or just say 'help' to see what I can do!*";
    }
    
    return response;
  }
  
  // Add sentiment-aware responses
  addSentimentResponse(response) {
    const recentSentiments = this.context.sentimentHistory.slice(-3);
    const avgScore = recentSentiments.reduce((sum, s) => sum + s.score, 0) / recentSentiments.length;
    
    // If user has been consistently positive, acknowledge it occasionally
    if (avgScore > 1 && Math.random() > 0.7 && response.length < 300) {
      const additions = [
        "\n\n😊 I'm really enjoying our conversation!",
        "\n\n✨ You're so engaged - I love it!",
        ""
      ];
      return response + additions[Math.floor(Math.random() * additions.length)];
    }
    
    return response;
  }

  addContextualFollowUp(response, category, originalMessage) {
    const lowerMsg = originalMessage.toLowerCase();
    
    // Add relevant follow-ups based on category
    const followUps = {
      services: "\n\nWould you like to know more about any specific service, or see examples of previous work?",
      projects: "\n\nI can show you detailed case studies or help you navigate to the projects page. What interests you most?",
      contact: "\n\nIs there anything specific you'd like to discuss? I can help you prepare your message!",
      skills: "\n\nWould you like to see how these skills are applied in real projects?",
      pricing: "\n\nI can help you understand what factors influence pricing, or connect you directly with Hamza for a personalized quote."
    };
    
    if (followUps[category] && !lowerMsg.includes('more') && !lowerMsg.includes('detail')) {
      return response + followUps[category];
    }
    
    return response;
  }

  generateSmartSuggestions() {
    const mentioned = this.context.mentionedTopics;
    const suggestions = [];
    
    if (!mentioned.includes('projects') && (mentioned.includes('services') || mentioned.includes('skills'))) {
      suggestions.push("💡 Want to see these in action? Ask about **projects**!");
    }
    
    if (!mentioned.includes('contact') && (mentioned.includes('services') || mentioned.includes('pricing'))) {
      suggestions.push("📧 Ready to get started? Ask about **contact** information!");
    }
    
    if (!mentioned.includes('experience') && mentioned.includes('skills')) {
      suggestions.push("📊 Curious about **experience**? I can share details!");
    }
    
    // Fun suggestions based on engagement
    if (this.messageCount > 3 && !mentioned.includes('joke') && Math.random() > 0.6) {
      suggestions.push("😄 Want a break? Ask for a **joke**!");
    }
    
    if (this.messageCount > 5 && !mentioned.includes('riddle') && Math.random() > 0.7) {
      suggestions.push("🧩 Up for a challenge? Try a **riddle**!");
    }
    
    if (!mentioned.includes('fact') && mentioned.length > 3 && Math.random() > 0.6) {
      suggestions.push("🤓 Want a **fun fact**? Just ask!");
    }
    
    // Personalized greeting if we know the name
    if (this.context.userName && Math.random() > 0.8) {
      suggestions.push(`By the way, great talking with you, ${this.context.userName}! 😊`);
    }
    
    // Limit suggestions
    return suggestions.length > 0 ? suggestions.slice(0, 2).join(' ') : null;
  }
  
  // Generate conversation summary
  generateConversationSummary() {
    const duration = Math.round((Date.now() - this.sessionStartTime) / 60000);
    const topics = Array.from(this.context.topicsDiscussed).slice(0, 5);
    const sentiment = this.context.sentimentHistory.length > 0 
      ? this.context.sentimentHistory.reduce((sum, s) => sum + s.score, 0) / this.context.sentimentHistory.length 
      : 0;
    const moodEmoji = sentiment > 0.5 ? '😊' : sentiment < -0.5 ? '😐' : '🙂';
    
    let summary = `📊 **Conversation Summary:**\n\n`;
    summary += `⏱️ Duration: ${duration} minute${duration !== 1 ? 's' : ''}\n`;
    summary += `💬 Messages exchanged: ${this.messageCount}\n`;
    summary += `${moodEmoji} Overall mood: ${sentiment > 0 ? 'Positive' : sentiment < 0 ? 'Needs attention' : 'Neutral'}\n`;
    
    if (topics.length > 0) {
      summary += `📝 Topics discussed: ${topics.join(', ')}\n`;
    }
    
    if (this.context.jokesTold > 0) {
      summary += `😄 Jokes told: ${this.context.jokesTold}\n`;
    }
    if (this.context.factsTold > 0) {
      summary += `🤓 Facts shared: ${this.context.factsTold}\n`;
    }
    if (this.context.mathCalculations > 0) {
      summary += `🧮 Calculations done: ${this.context.mathCalculations}\n`;
    }
    
    summary += `\n🎯 Visit count: ${this.context.visitCount}`;
    
    if (this.context.userName) {
      summary += `\n👤 Chatting with: ${this.context.userName}`;
    }
    
    return summary;
  }

  addMessage(text, role, skipAnimation = false) {
    const messagesContainer = document.getElementById('ai-assistant-messages');
    if (!messagesContainer) {
      console.error('[assistant] Messages container not found');
      return;
    }
    
    const messageEl = document.createElement('div');
    messageEl.className = `ai-assistant-message ai-assistant-message-${role}`;
    if (skipAnimation) {
      messageEl.classList.add('ai-assistant-message-visible');
    }
    
    // Format timestamp
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    if (role === 'assistant') {
      messageEl.innerHTML = `
        <div class="ai-assistant-message-avatar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 1.5.5 2.9 1.3 4L3 21l8-2.3c1.1.8 2.4 1.3 3.8 1.3 3.87 0 7-3.13 7-7s-3.13-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
            <circle cx="9" cy="9" r="1.2" fill="white"/>
            <circle cx="15" cy="9" r="1.2" fill="white"/>
            <path d="M9 13h6" stroke="white" stroke-width="1.2" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="ai-assistant-message-content">
          <div class="ai-assistant-message-text">${this.formatMessage(text)}</div>
          <span class="ai-assistant-message-time">${timeStr}</span>
        </div>
      `;
    } else {
      messageEl.innerHTML = `
        <div class="ai-assistant-message-content">
          <div class="ai-assistant-message-text">${this.escapeHtml(text)}</div>
          <span class="ai-assistant-message-time">${timeStr}</span>
        </div>
      `;
    }
    
    messagesContainer.appendChild(messageEl);
    
    if (!skipAnimation) {
      // Trigger animation by forcing reflow
      void messageEl.offsetHeight;
      
      // Add visible class after a tiny delay to ensure animation triggers
      setTimeout(() => {
        messageEl.classList.add('ai-assistant-message-visible');
      }, 10);
    }
    
    // Scroll to bottom after message is added
    setTimeout(() => {
      this.scrollToBottom();
    }, 50);
  }
  
  // Check for repetitive questions
  isRepetitiveQuestion(message) {
    const recentMessages = this.conversationHistory
      .filter(m => m.role === 'user')
      .slice(-3)
      .map(m => m.content.toLowerCase());
    
    const lowerMsg = message.toLowerCase();
    const similar = recentMessages.filter(m => 
      m === lowerMsg || 
      levenshteinDistance(m, lowerMsg) <= 3 ||
      (m.length > 10 && lowerMsg.includes(m.substring(0, 10)))
    );
    
    return similar.length >= 2;
  }
  
  // Get varied response for repetitive questions
  getRepetitiveResponse(message) {
    const responses = [
      "I think I already answered that! 😊 Is there something specific you'd like me to clarify?",
      "We've covered this - but I'm happy to explain differently if needed! What aspect would you like to explore more?",
      "Looks like a similar question! Want me to approach it from a different angle?",
      "I sense some repetition! 🔄 Is there something specific that's unclear? I'm here to help!"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  formatMessage(text) {
    // Convert markdown-like formatting to HTML with code block support
    let formatted = this.escapeHtml(text);
    
    // Handle code blocks with syntax highlighting
    formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      const language = lang || 'javascript';
      return `<pre class="ai-assistant-code-block"><code class="language-${language}">${this.escapeHtml(code.trim())}</code></pre>`;
    });
    
    // Handle inline code
    formatted = formatted.replace(/`([^`]+)`/g, '<code class="ai-assistant-inline-code">$1</code>');
    
    // Other formatting
    formatted = formatted
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/•/g, '<span class="ai-assistant-bullet">•</span>')
      .replace(/#(\w+)/g, '<span class="ai-assistant-hashtag">#$1</span>');
    
    return formatted;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  hideSuggestions() {
    const suggestions = document.getElementById('ai-assistant-suggestions');
    if (suggestions) {
      suggestions.style.display = 'none';
      suggestions.style.opacity = '0';
      suggestions.style.transform = 'translateY(-10px)';
    }
  }

  showSuggestions() {
    const suggestions = document.getElementById('ai-assistant-suggestions');
    if (suggestions && this.conversationHistory.length <= 2) {
      suggestions.style.display = 'block';
      suggestions.style.opacity = '1';
      suggestions.style.transform = 'translateY(0)';
    }
  }

  scrollToBottom() {
    const messagesContainer = document.getElementById('ai-assistant-messages');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  // ============================================================================
  // NEW FEATURES
  // ============================================================================

  // Export conversation to file
  exportConversation() {
    if (this.conversationHistory.length === 0) {
      this.addMessage("No conversation to export yet! Start chatting first. 😊", 'assistant', true);
      return;
    }

    const date = new Date().toISOString().split('T')[0];
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    let content = `Nova AI Assistant - Conversation Export\n`;
    content += `Date: ${date} ${time}\n`;
    content += `Total Messages: ${this.conversationHistory.length}\n`;
    content += `${'='.repeat(50)}\n\n`;

    this.conversationHistory.forEach((msg, index) => {
      const role = msg.role === 'user' ? 'You' : 'Nova';
      const timestamp = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : '';
      content += `[${index + 1}] ${role}${timestamp ? ` (${timestamp})` : ''}:\n${msg.content}\n\n`;
    });

    content += `\n${'='.repeat(50)}\n`;
    content += `Visit Count: ${this.context.visitCount}\n`;
    content += `Topics Discussed: ${Array.from(this.context.topicsDiscussed).join(', ') || 'None'}\n`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nova-conversation-${date}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.addMessage(`📥 Conversation exported! Check your downloads folder.`, 'assistant', true);
  }

  // Toggle search mode
  toggleSearch() {
    const input = document.getElementById('ai-assistant-input');
    if (!input) return;

    if (input.placeholder.includes('Search')) {
      input.placeholder = 'Type or speak your question...';
      input.removeAttribute('data-search-mode');
      this.addMessage("Search mode disabled. Back to normal chat! 💬", 'assistant', true);
    } else {
      input.placeholder = '🔍 Search conversation history...';
      input.setAttribute('data-search-mode', 'true');
      input.focus();
      this.addMessage("🔍 **Search Mode Activated!**\n\nType keywords to search through our conversation history. I'll show you matching messages!", 'assistant', true);
    }
  }

  // Search through conversation
  searchConversation(query) {
    if (!query || query.length < 2) {
      return [];
    }

    const lowerQuery = query.toLowerCase();
    const results = this.conversationHistory.filter(msg => 
      msg.content.toLowerCase().includes(lowerQuery)
    );

    return results.slice(0, 10); // Limit to 10 results
  }

  // Code examples feature - Comprehensive
  getCodeExamples(topic) {
    const codeExamples = {
      react: {
        title: "React Component Example",
        code: `import React, { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
    </div>
  );
}

export default Counter;`,
        description: "A React counter component using hooks with useEffect"
      },
      vue: {
        title: "Vue.js Component Example",
        code: `<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
    <button @click="decrement">Decrement</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0
    };
  },
  methods: {
    increment() {
      this.count++;
    },
    decrement() {
      this.count--;
    }
  }
};
</script>`,
        description: "Vue.js component with reactive data and methods"
      },
      nodejs: {
        title: "Node.js Express API",
        code: `const express = require('express');
const app = express();

app.use(express.json());

// GET endpoint
app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

// POST endpoint
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  res.status(201).json({ 
    message: 'User created', 
    user: { name, email } 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});`,
        description: "Complete Express.js REST API with error handling"
      },
      javascript: {
        title: "JavaScript Async/Await",
        code: `async function fetchUserData(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

// Usage with Promise chaining
fetchUserData(123)
  .then(user => console.log('User:', user))
  .catch(error => console.error('Error:', error));

// Usage with async/await
try {
  const user = await fetchUserData(123);
  console.log('User:', user);
} catch (error) {
  console.error('Error:', error);
}`,
        description: "Modern async/await pattern with error handling"
      },
      css: {
        title: "CSS Grid Layout",
        code: `.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.item {
  background: #f0f0f0;
  padding: 1rem;
  border-radius: 8px;
  transition: transform 0.2s;
}

.item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
  }
}`,
        description: "Responsive CSS Grid with hover effects and media queries"
      },
      typescript: {
        title: "TypeScript Interface & Types",
        code: `interface User {
  id: number;
  name: string;
  email: string;
  age?: number; // Optional property
  role: 'admin' | 'user' | 'guest'; // Union type
}

type UserCreateInput = Omit<User, 'id'>;

function createUser(input: UserCreateInput): User {
  return {
    id: Date.now(),
    name: input.name,
    email: input.email,
    role: input.role,
    age: input.age
  };
}

// Usage
const newUser = createUser({
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user'
});`,
        description: "TypeScript interfaces, types, and utility types"
      },
      python: {
        title: "Python Flask API",
        code: `from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/users', methods=['GET'])
def get_users():
    return jsonify({'users': []})

@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.get_json()
    user = {
        'id': len(users) + 1,
        'name': data.get('name'),
        'email': data.get('email')
    }
    return jsonify(user), 201

if __name__ == '__main__':
    app.run(debug=True)`,
        description: "Python Flask REST API example"
      },
      sql: {
        title: "SQL Queries",
        code: `-- Create table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert data
INSERT INTO users (name, email) 
VALUES ('John Doe', 'john@example.com');

-- Select with JOIN
SELECT u.name, u.email, p.title 
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
WHERE u.created_at > '2024-01-01'
ORDER BY u.created_at DESC;`,
        description: "SQL table creation, inserts, and complex queries"
      },
      html: {
        title: "HTML5 Semantic Structure",
        code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <header>
    <nav>
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
      </ul>
    </nav>
  </header>
  
  <main>
    <article>
      <h1>Article Title</h1>
      <p>Article content...</p>
    </article>
  </main>
  
  <footer>
    <p>&copy; 2024 Company Name</p>
  </footer>
</body>
</html>`,
        description: "HTML5 semantic structure with accessibility"
      },
      mongodb: {
        title: "MongoDB Operations",
        code: `// Connect to MongoDB
const { MongoClient } = require('mongodb');
const client = new MongoClient(uri);

// Insert document
await client.db('mydb').collection('users').insertOne({
  name: 'John Doe',
  email: 'john@example.com',
  age: 30
});

// Find documents
const users = await client.db('mydb')
  .collection('users')
  .find({ age: { $gte: 18 } })
  .toArray();

// Update document
await client.db('mydb')
  .collection('users')
  .updateOne(
    { email: 'john@example.com' },
    { $set: { age: 31 } }
  );`,
        description: "MongoDB CRUD operations with Node.js"
      },
      docker: {
        title: "Docker Configuration",
        code: `# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]

# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
  db:
    image: postgres:15
    environment:
      - POSTGRES_PASSWORD=password`,
        description: "Dockerfile and docker-compose configuration"
      }
    };

    const lowerTopic = topic.toLowerCase();
    for (const [key, example] of Object.entries(codeExamples)) {
      if (lowerTopic.includes(key) || lowerTopic.includes(key.replace('js', ''))) {
        return example;
      }
    }

    return codeExamples.javascript; // Default
  }

  // Quiz/Trivia system - Comprehensive
  startQuiz() {
    const quizQuestions = [
      {
        question: "What does API stand for?",
        options: ["Application Programming Interface", "Advanced Programming Interface", "Automated Program Integration", "Application Process Integration"],
        correct: 0,
        explanation: "API stands for Application Programming Interface - it's a set of protocols and tools for building software applications."
      },
      {
        question: "Which method is used to add an element to the end of an array in JavaScript?",
        options: ["push()", "pop()", "shift()", "unshift()"],
        correct: 0,
        explanation: "push() adds elements to the end of an array, while pop() removes from the end, shift() removes from the beginning, and unshift() adds to the beginning."
      },
      {
        question: "What is the purpose of React hooks?",
        options: ["To style components", "To manage state and side effects in functional components", "To create routes", "To handle API calls"],
        correct: 1,
        explanation: "React hooks allow functional components to use state and lifecycle features that were previously only available in class components."
      },
      {
        question: "What does CSS stand for?",
        options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style System", "Coded Style Syntax"],
        correct: 1,
        explanation: "CSS stands for Cascading Style Sheets - it's used to style HTML elements with a cascading priority system."
      },
      {
        question: "Which HTTP method is used to create a new resource?",
        options: ["GET", "POST", "PUT", "DELETE"],
        correct: 1,
        explanation: "POST is used to create new resources, while GET retrieves, PUT updates, and DELETE removes resources."
      },
      {
        question: "What is the difference between let, const, and var in JavaScript?",
        options: ["No difference", "let and const are block-scoped, var is function-scoped", "They're all the same", "Only var exists"],
        correct: 1,
        explanation: "let and const are block-scoped (ES6+), while var is function-scoped. const is immutable, let is mutable."
      },
      {
        question: "What is a closure in JavaScript?",
        options: ["A function that has access to variables in its outer scope", "A way to close a file", "A type of loop", "A database term"],
        correct: 0,
        explanation: "A closure is a function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned."
      },
      {
        question: "What is the virtual DOM in React?",
        options: ["A real DOM element", "A JavaScript representation of the DOM", "A database", "A CSS framework"],
        correct: 1,
        explanation: "The virtual DOM is a JavaScript representation of the real DOM. React uses it to efficiently update the UI by comparing virtual DOM trees."
      },
      {
        question: "What does REST stand for?",
        options: ["Really Easy System Transfer", "Representational State Transfer", "Remote Execution System Transfer", "Resource Exchange System Transfer"],
        correct: 1,
        explanation: "REST stands for Representational State Transfer - it's an architectural style for designing networked applications."
      },
      {
        question: "What is TypeScript?",
        options: ["A database", "A JavaScript superset with static typing", "A CSS framework", "A server"],
        correct: 1,
        explanation: "TypeScript is a superset of JavaScript that adds static type definitions, making code more maintainable and less error-prone."
      },
      {
        question: "What is the purpose of useEffect in React?",
        options: ["To style components", "To handle side effects and lifecycle events", "To create routes", "To manage state"],
        correct: 1,
        explanation: "useEffect is a React hook that lets you perform side effects in functional components, similar to componentDidMount and componentDidUpdate."
      },
      {
        question: "What is the difference between == and === in JavaScript?",
        options: ["No difference", "== compares value, === compares value and type", "=== doesn't exist", "== is newer"],
        correct: 1,
        explanation: "== performs type coercion before comparison, while === (strict equality) compares both value and type without coercion."
      },
      {
        question: "What is async/await in JavaScript?",
        options: ["A database query", "Syntactic sugar for Promises", "A CSS feature", "A React component"],
        correct: 1,
        explanation: "async/await is syntactic sugar built on Promises that makes asynchronous code look and behave more like synchronous code."
      },
      {
        question: "What is the purpose of npm?",
        options: ["A database", "Node Package Manager - manages JavaScript packages", "A CSS framework", "A server"],
        correct: 1,
        explanation: "npm (Node Package Manager) is the default package manager for Node.js, used to install and manage JavaScript packages."
      },
      {
        question: "What is CORS?",
        options: ["A database", "Cross-Origin Resource Sharing - security feature", "A CSS property", "A JavaScript function"],
        correct: 1,
        explanation: "CORS (Cross-Origin Resource Sharing) is a security feature that allows or restricts web pages from making requests to a different domain than the one serving the web page."
      }
    ];

    const question = quizQuestions[Math.floor(Math.random() * quizQuestions.length)];
    this.context.currentQuiz = question;
    this.context.quizScore = this.context.quizScore || { correct: 0, total: 0 };
    
    let response = `🎯 **Quiz Time!**\n\n`;
    response += `**Question:** ${question.question}\n\n`;
    question.options.forEach((opt, idx) => {
      response += `${idx + 1}. ${opt}\n`;
    });
    response += `\n*Type the number of your answer (1-4), or say "skip" to skip this question.*`;

    return response;
  }

  checkQuizAnswer(answer) {
    if (!this.context.currentQuiz) {
      return "No active quiz! Say 'start quiz' to begin.";
    }

    const quiz = this.context.currentQuiz;
    const userAnswer = parseInt(answer) - 1;

    if (isNaN(userAnswer) || userAnswer < 0 || userAnswer > 3) {
      return "Please enter a number between 1 and 4, or say 'skip'.";
    }

    const isCorrect = userAnswer === quiz.correct;
    const correctOption = quiz.options[quiz.correct];
    
    // Update score
    this.context.quizScore.total++;
    if (isCorrect) {
      this.context.quizScore.correct++;
    }
    
    const accuracy = Math.round((this.context.quizScore.correct / this.context.quizScore.total) * 100);
    
    let response = isCorrect 
      ? `🎉 **Correct!** Well done!\n\n`
      : `❌ **Not quite!** The correct answer is: **${correctOption}**\n\n`;
    
    response += `💡 **Explanation:** ${quiz.explanation}\n\n`;
    response += `📊 **Your Score:** ${this.context.quizScore.correct}/${this.context.quizScore.total} (${accuracy}% accuracy)\n\n`;
    response += `Want another question? Say "quiz" again!`;

    this.context.currentQuiz = null;
    this.saveContext();
    return response;
  }

  // FAQ System - Comprehensive
  getFAQ() {
    const faqs = [
      {
        q: "What services does Hamza offer?",
        a: "Hamza offers comprehensive full-stack web development services:\n• React/Vue.js frontend development\n• Node.js backend & API development\n• E-commerce solutions\n• Performance optimization (Core Web Vitals Grade A)\n• DevOps & cloud deployment (AWS, Docker)\n• Technical consulting & code reviews\n• Database design & optimization\nAll projects prioritize speed, reliability, and maintainability!"
      },
      {
        q: "How can I contact Hamza?",
        a: "Multiple ways to reach out:\n• Email: hamzaarya123@gmail.com\n• Contact form on the website\n• Response time: Under 24 hours\n• Location: Kabul, Afghanistan (works remotely worldwide)\n• Available for: Freelance projects, remote work, long-term collaborations, quick consultations"
      },
      {
        q: "What technologies does Hamza use?",
        a: "**Frontend:** React, Vue.js, TypeScript, JavaScript, Tailwind CSS, HTML5\n**Backend:** Node.js, Express, REST APIs, GraphQL, Serverless\n**Databases:** PostgreSQL, MongoDB, Redis\n**DevOps:** AWS (EC2, S3, Lambda), Vercel, Docker, Kubernetes, CI/CD\n**Tools:** Git, GitHub, Jest, Vitest, Webpack, Vite\nAll focused on modern best practices and performance!"
      },
      {
        q: "How much experience does Hamza have?",
        a: "**4+ years** of full-stack development experience:\n• 20+ production projects shipped\n• Core Web Vitals Grade A on all projects\n• Production-grade code quality\n• Strong focus on clean architecture\n• Continuous learning & staying updated with latest technologies"
      },
      {
        q: "Does Hamza work remotely?",
        a: "Yes! Hamza is **fully remote-friendly**:\n• Works with clients worldwide\n• Flexible timezone coordination\n• Remote-first approach\n• International collaboration experience\n• Available for remote projects of any size"
      },
      {
        q: "What kind of projects has Hamza worked on?",
        a: "Diverse project portfolio:\n• **SaaS Platforms:** B2B solutions, analytics dashboards, management systems\n• **E-commerce:** Custom online stores, payment integrations, inventory systems\n• **Real-time Apps:** Chat applications, live collaboration tools, WebSocket implementations\n• **Data & Analytics:** ETL pipelines, dashboard visualizations, reporting systems\nCheck the Projects section for detailed case studies!"
      },
      {
        q: "How do I get a quote for a project?",
        a: "**Pricing is flexible and tailored:**\n• Contact via email or contact form\n• Factors considered: complexity, timeline, scope, maintenance needs\n• Engagement models: Fixed-scope, retainer, hourly consulting\n• Transparent pricing with no hidden fees\n• Competitive rates with value-focused approach"
      },
      {
        q: "What makes Hamza's work special?",
        a: "**Key differentiators:**\n• Core Web Vitals Grade A performance on all projects\n• Production-ready code quality\n• Clean architecture & best practices\n• Focus on maintainability & scalability\n• Measurable business impact\n• Strong developer experience focus\n• SEO optimization & accessibility"
      },
      {
        q: "What is the typical project timeline?",
        a: "Timelines vary based on scope:\n• Small projects: 1-2 weeks\n• Medium projects: 2-4 weeks\n• Large projects: 1-3 months\n• Ongoing retainer: Flexible\nTimeline is discussed during initial consultation and included in project quote."
      },
      {
        q: "Does Hamza provide ongoing support?",
        a: "Yes! Support options include:\n• Post-launch bug fixes\n• Feature additions\n• Performance monitoring\n• Retainer agreements for ongoing support\n• Code maintenance & updates\n• Technical consulting\nSupport terms are discussed per project."
      },
      {
        q: "What is Core Web Vitals Grade A?",
        a: "Core Web Vitals are Google's metrics for page experience:\n• **LCP (Largest Contentful Paint):** < 2.5s\n• **FID (First Input Delay):** < 100ms\n• **CLS (Cumulative Layout Shift):** < 0.1\nGrade A means all metrics meet the 'Good' threshold, ensuring excellent user experience and better SEO rankings."
      },
      {
        q: "Can Hamza work with my existing team?",
        a: "Absolutely! Hamza has experience:\n• Collaborating with international teams\n• Working in agile environments\n• Code reviews & pair programming\n• Knowledge sharing & team training\n• Integrating with existing codebases\n• Following team conventions & standards"
      }
    ];

    let response = `❓ **Frequently Asked Questions (${faqs.length} questions):**\n\n`;
    faqs.forEach((faq, idx) => {
      response += `**Q${idx + 1}: ${faq.q}**\n`;
      response += `${faq.a}\n\n`;
    });
    response += `💡 *Have more questions? Just ask me! I'm here to help.*`;

    return response;
  }

  // Learning Recommendations
  getLearningRecommendations(topic) {
    const recommendations = {
      react: {
        title: "React Learning Path",
        resources: [
          "📚 Official React Docs: react.dev",
          "🎥 React Tutorial: Build a tic-tac-toe game",
          "📖 'React: The Complete Guide' by Maximilian Schwarzmüller",
          "💻 Practice: Build a todo app, then a weather app",
          "🔧 Learn: Hooks (useState, useEffect, useContext)",
          "⚡ Next: Learn Next.js for production apps"
        ]
      },
      javascript: {
        title: "JavaScript Mastery",
        resources: [
          "📚 MDN Web Docs: developer.mozilla.org",
          "📖 'You Don't Know JS' book series",
          "💻 Practice: Build projects (calculator, quiz app)",
          "🔧 Learn: ES6+, async/await, Promises",
          "🎯 Master: Closures, prototypes, this keyword",
          "⚡ Next: TypeScript for type safety"
        ]
      },
      nodejs: {
        title: "Node.js Backend Development",
        resources: [
          "📚 Node.js Official Docs: nodejs.org",
          "📖 'Node.js Design Patterns' by Mario Casciaro",
          "💻 Practice: Build REST APIs, CRUD operations",
          "🔧 Learn: Express.js, middleware, error handling",
          "🗄️ Master: Database integration (MongoDB, PostgreSQL)",
          "⚡ Next: Learn authentication & security"
        ]
      },
      css: {
        title: "CSS Mastery",
        resources: [
          "📚 CSS-Tricks: css-tricks.com",
          "📖 'CSS Secrets' by Lea Verou",
          "💻 Practice: Build layouts (Grid, Flexbox)",
          "🔧 Learn: CSS Grid, Flexbox, animations",
          "🎨 Master: Responsive design, media queries",
          "⚡ Next: CSS frameworks (Tailwind, Bootstrap)"
        ]
      },
      general: {
        title: "Web Development Fundamentals",
        resources: [
          "📚 FreeCodeCamp: freecodecamp.org",
          "📖 'Eloquent JavaScript' by Marijn Haverbeke",
          "💻 Practice: Build projects regularly",
          "🔧 Learn: Git, GitHub, version control",
          "🎯 Master: Problem-solving, debugging",
          "⚡ Next: Choose a specialization (frontend/backend)"
        ]
      }
    };

    const lowerTopic = topic.toLowerCase();
    for (const [key, rec] of Object.entries(recommendations)) {
      if (lowerTopic.includes(key) || (key === 'general' && !lowerTopic.match(/\b(react|javascript|nodejs|css)\b/))) {
        let response = `📚 **${rec.title}**\n\n`;
        rec.resources.forEach(resource => {
          response += `${resource}\n`;
        });
        response += `\n💡 *Start with the basics and build projects to reinforce learning!*`;
        return response;
      }
    }

    return recommendations.general;
  }

  // Project Suggestions
  getProjectSuggestions(skillLevel = 'beginner') {
    const projects = {
      beginner: [
        "📝 Todo List App - Learn state management",
        "🎨 Personal Portfolio Website - HTML/CSS/JS",
        "⏰ Pomodoro Timer - Practice intervals & state",
        "🎲 Dice Roller - Random number generation",
        "📊 Simple Calculator - DOM manipulation"
      ],
      intermediate: [
        "🌤️ Weather App - API integration",
        "📝 Note-taking App - Local storage",
        "🛒 Shopping Cart - State & calculations",
        "📅 Event Calendar - Date handling",
        "💬 Chat Interface - Real-time updates"
      ],
      advanced: [
        "🛒 E-commerce Platform - Full-stack",
        "📊 Analytics Dashboard - Data visualization",
        "💬 Real-time Chat App - WebSockets",
        "📱 Social Media Clone - Complex state",
        "🎮 Multiplayer Game - Real-time sync"
      ]
    };

    const levelProjects = projects[skillLevel] || projects.beginner;
    let response = `🚀 **${skillLevel.charAt(0).toUpperCase() + skillLevel.slice(1)} Project Ideas:**\n\n`;
    levelProjects.forEach((project, idx) => {
      response += `${idx + 1}. ${project}\n`;
    });
    response += `\n💡 *Pick one that interests you and start building!*`;

    return response;
  }

  // ============================================================================
  // ADVANCED FEATURES - ChatGPT-5 Level Capabilities
  // ============================================================================

  // Advanced Code Analysis & Review
  analyzeCode(message) {
    const codeMatch = message.match(/```[\s\S]*?```/);
    const hasCode = codeMatch || message.match(/\b(function|const|let|var|class|import|export)\b/);
    
    if (!hasCode) {
      return `🔍 **Code Review Request**\n\nI'd be happy to review your code! Please:\n1. Paste your code in a code block (use triple backticks)\n2. Or describe what you'd like me to review\n3. Mention any specific concerns or areas to focus on\n\nExample: "Review this React component" followed by your code.`;
    }

    let response = `🔍 **Code Analysis & Review:**\n\n`;
    
    // Check for common issues
    const checks = [];
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('function') && !lowerMsg.includes('arrow')) {
      checks.push("✅ Consider using arrow functions for consistency");
    }
    
    if (lowerMsg.includes('var ')) {
      checks.push("⚠️ Consider using `let` or `const` instead of `var`");
    }
    
    if (lowerMsg.includes('==')) {
      checks.push("⚠️ Use strict equality (`===`) instead of `==`");
    }
    
    if (lowerMsg.includes('console.log')) {
      checks.push("💡 Remove console.log statements in production code");
    }
    
    if (!lowerMsg.includes('error') && !lowerMsg.includes('try')) {
      checks.push("💡 Consider adding error handling (try-catch)");
    }
    
    if (lowerMsg.includes('password') || lowerMsg.includes('secret')) {
      checks.push("🔒 Security: Never hardcode passwords or secrets");
    }
    
    response += `**Code Quality Checks:**\n${checks.length > 0 ? checks.join('\n') : '✅ Code structure looks good!'}\n\n`;
    response += `**Recommendations:**\n`;
    response += `• Add JSDoc comments for better documentation\n`;
    response += `• Consider breaking large functions into smaller ones\n`;
    response += `• Add input validation where needed\n`;
    response += `• Write unit tests for critical functions\n`;
    response += `• Follow consistent naming conventions\n\n`;
    response += `💡 Want specific improvements? Describe what the code should do!`;

    this.context.codeReviewHistory.push({ timestamp: Date.now(), review: response });
    return response;
  }

  // Step-by-Step Problem Solving
  provideStepByStepExplanation(message) {
    const lowerMsg = message.toLowerCase();
    let response = `📚 **Step-by-Step Explanation:**\n\n`;

    if (lowerMsg.includes('react') || lowerMsg.includes('component')) {
      response += `**How React Components Work:**\n\n`;
      response += `**Step 1:** Component Definition\n`;
      response += `• Define your component (functional or class)\n`;
      response += `• Components are reusable UI pieces\n\n`;
      response += `**Step 2:** Props & State\n`;
      response += `• Props: Data passed from parent (immutable)\n`;
      response += `• State: Internal component data (mutable)\n\n`;
      response += `**Step 3:** Rendering\n`;
      response += `• Component returns JSX\n`;
      response += `• React converts JSX to DOM elements\n\n`;
      response += `**Step 4:** Updates\n`;
      response += `• State changes trigger re-render\n`;
      response += `• React efficiently updates only changed parts\n\n`;
      response += `**Step 5:** Lifecycle (if using hooks)\n`;
      response += `• useEffect handles side effects\n`;
      response += `• Cleanup functions prevent memory leaks\n`;
    } else if (lowerMsg.includes('async') || lowerMsg.includes('promise')) {
      response += `**How Async/Await Works:**\n\n`;
      response += `**Step 1:** Understanding Promises\n`;
      response += `• Promises represent future values\n`;
      response += `• States: pending, fulfilled, rejected\n\n`;
      response += `**Step 2:** Async Functions\n`;
      response += `• \`async\` makes a function return a Promise\n`;
      response += `• Allows using \`await\` inside\n\n`;
      response += `**Step 3:** Await Keyword\n`;
      response += `• \`await\` pauses execution until Promise resolves\n`;
      response += `• Makes async code look synchronous\n\n`;
      response += `**Step 4:** Error Handling\n`;
      response += `• Use try-catch blocks\n`;
      response += `• Handle both sync and async errors\n\n`;
      response += `**Step 5:** Best Practices\n`;
      response += `• Don't forget await (common mistake!)\n`;
      response += `• Handle errors properly\n`;
      response += `• Consider Promise.all() for parallel operations\n`;
    } else if (lowerMsg.includes('api') || lowerMsg.includes('fetch')) {
      response += `**How API Calls Work:**\n\n`;
      response += `**Step 1:** Make Request\n`;
      response += `• Use fetch() or axios\n`;
      response += `• Specify URL, method, headers\n\n`;
      response += `**Step 2:** Send Data (if POST/PUT)\n`;
      response += `• Include body with JSON.stringify()\n`;
      response += `• Set Content-Type header\n\n`;
      response += `**Step 3:** Handle Response\n`;
      response += `• Check response.ok\n`;
      response += `• Parse JSON with .json()\n\n`;
      response += `**Step 4:** Error Handling\n`;
      response += `• Catch network errors\n`;
      response += `• Handle HTTP error statuses\n\n`;
      response += `**Step 5:** Update UI\n`;
      response += `• Update state with response data\n`;
      response += `• Show loading/error states\n`;
    } else {
      response += `**General Problem-Solving Approach:**\n\n`;
      response += `**Step 1:** Understand the Problem\n`;
      response += `• Break it down into smaller parts\n`;
      response += `• Identify inputs and expected outputs\n\n`;
      response += `**Step 2:** Plan Your Solution\n`;
      response += `• Outline the approach\n`;
      response += `• Consider edge cases\n\n`;
      response += `**Step 3:** Implement\n`;
      response += `• Write code step by step\n`;
      response += `• Test as you go\n\n`;
      response += `**Step 4:** Test & Debug\n`;
      response += `• Test with different inputs\n`;
      response += `• Fix any issues\n\n`;
      response += `**Step 5:** Refactor\n`;
      response += `• Improve code quality\n`;
      response += `• Optimize if needed\n\n`;
      response += `💡 Want a specific explanation? Tell me what you'd like to understand!`;
    }

    return response;
  }

  // Architecture Suggestions
  suggestArchitecture(message) {
    const lowerMsg = message.toLowerCase();
    let response = `🏗️ **Architecture & Structure Recommendations:**\n\n`;

    if (lowerMsg.includes('react') || lowerMsg.includes('frontend')) {
      response += `**React Project Structure:**\n\n`;
      response += `\`\`\`\nproject/\n├── src/\n│   ├── components/     # Reusable components\n│   │   ├── common/     # Button, Input, etc.\n│   │   └── features/   # Feature-specific\n│   ├── pages/          # Page components\n│   ├── hooks/          # Custom hooks\n│   ├── utils/          # Helper functions\n│   ├── services/       # API calls\n│   ├── store/          # State management\n│   ├── styles/         # Global styles\n│   └── types/          # TypeScript types\n├── public/\n└── package.json\n\`\`\`\n\n`;
      response += `**Best Practices:**\n`;
      response += `• Keep components small and focused\n`;
      response += `• Use feature-based folder structure for large apps\n`;
      response += `• Separate concerns (UI, logic, data)\n`;
      response += `• Use custom hooks for reusable logic\n`;
    } else if (lowerMsg.includes('node') || lowerMsg.includes('backend')) {
      response += `**Node.js Backend Structure:**\n\n`;
      response += `\`\`\`\nproject/\n├── src/\n│   ├── routes/        # API routes\n│   ├── controllers/   # Business logic\n│   ├── models/        # Data models\n│   ├── middleware/    # Custom middleware\n│   ├── services/      # External services\n│   ├── utils/         # Helpers\n│   ├── config/        # Configuration\n│   └── app.js         # Express app\n├── tests/\n└── package.json\n\`\`\`\n\n`;
      response += `**Best Practices:**\n`;
      response += `• Follow MVC or layered architecture\n`;
      response += `• Separate routes, controllers, and models\n`;
      response += `• Use middleware for cross-cutting concerns\n`;
      response += `• Keep business logic out of routes\n`;
    } else if (lowerMsg.includes('full') || lowerMsg.includes('stack')) {
      response += `**Full-Stack Architecture:**\n\n`;
      response += `**Frontend (React/Vue):**\n`;
      response += `• Component-based UI\n`;
      response += `• State management (Redux/Zustand)\n`;
      response += `• API service layer\n\n`;
      response += `**Backend (Node.js):**\n`;
      response += `• RESTful API or GraphQL\n`;
      response += `• Authentication middleware\n`;
      response += `• Database abstraction layer\n\n`;
      response += `**Database:**\n`;
      response += `• PostgreSQL for relational data\n`;
      response += `• MongoDB for flexible schemas\n`;
      response += `• Redis for caching\n\n`;
      response += `**DevOps:**\n`;
      response += `• Docker containers\n`;
      response += `• CI/CD pipeline\n`;
      response += `• Environment-based config\n`;
    } else {
      response += `**General Architecture Principles:**\n\n`;
      response += `**1. Separation of Concerns**\n`;
      response += `• Each module has a single responsibility\n`;
      response += `• Clear boundaries between layers\n\n`;
      response += `**2. Scalability**\n`;
      response += `• Design for growth\n`;
      response += `• Use microservices if needed\n\n`;
      response += `**3. Maintainability**\n`;
      response += `• Consistent structure\n`;
      response += `• Clear naming conventions\n\n`;
      response += `**4. Testability**\n`;
      response += `• Write testable code\n`;
      response += `• Mock external dependencies\n`;
    }

    response += `\n💡 Want specific architecture for your project? Describe it!`;
    return response;
  }

  // Performance Analysis
  analyzePerformance(message) {
    const lowerMsg = message.toLowerCase();
    let response = `⚡ **Performance Analysis & Optimization:**\n\n`;

    response += `**Common Performance Issues & Solutions:**\n\n`;
    
    response += `**1. Slow Page Load**\n`;
    response += `• **Problem:** Large bundle size, unoptimized assets\n`;
    response += `• **Solutions:**\n`;
    response += `  - Code splitting & lazy loading\n`;
    response += `  - Image optimization (WebP, compression)\n`;
    response += `  - Minify & compress assets\n`;
    response += `  - Use CDN for static assets\n\n`;
    
    response += `**2. Slow API Calls**\n`;
    response += `• **Problem:** N+1 queries, no caching\n`;
    response += `• **Solutions:**\n`;
    response += `  - Implement caching (Redis)\n`;
    response += `  - Optimize database queries\n`;
    response += `  - Use pagination\n`;
    response += `  - Batch requests when possible\n\n`;
    
    response += `**3. Slow Rendering**\n`;
    response += `• **Problem:** Too many re-renders, heavy computations\n`;
    response += `• **Solutions:**\n`;
    response += `  - Use React.memo() for components\n`;
    response += `  - Memoize expensive calculations\n`;
    response += `  - Virtualize long lists\n`;
    response += `  - Debounce/throttle events\n\n`;
    
    response += `**4. Memory Leaks**\n`;
    response += `• **Problem:** Event listeners, subscriptions not cleaned up\n`;
    response += `• **Solutions:**\n`;
    response += `  - Cleanup in useEffect\n`;
    response += `  - Remove event listeners\n`;
    response += `  - Cancel subscriptions\n\n`;
    
    response += `**Performance Metrics to Monitor:**\n`;
    response += `• Core Web Vitals (LCP, FID, CLS)\n`;
    response += `• Time to First Byte (TTFB)\n`;
    response += `• Bundle size\n`;
    response += `• API response times\n`;
    response += `• Memory usage\n\n`;
    
    response += `💡 Want specific optimization for your code? Share details!`;

    return response;
  }

  // Security Analysis
  analyzeSecurity(message) {
    const lowerMsg = message.toLowerCase();
    let response = `🔒 **Security Analysis & Best Practices:**\n\n`;

    response += `**Critical Security Practices:**\n\n`;
    
    response += `**1. Authentication & Authorization**\n`;
    response += `• Use JWT tokens with expiration\n`;
    response += `• Hash passwords (bcrypt, Argon2)\n`;
    response += `• Implement role-based access control (RBAC)\n`;
    response += `• Use HTTPS everywhere\n`;
    response += `• Implement rate limiting\n\n`;
    
    response += `**2. Input Validation**\n`;
    response += `• Validate all user inputs\n`;
    response += `• Sanitize data before storing\n`;
    response += `• Use parameterized queries (prevent SQL injection)\n`;
    response += `• Escape output to prevent XSS\n\n`;
    
    response += `**3. API Security**\n`;
    response += `• Use API keys/tokens\n`;
    response += `• Implement CORS properly\n`;
    response += `• Validate request origins\n`;
    response += `• Use rate limiting\n`;
    response += `• Implement request signing\n\n`;
    
    response += `**4. Data Protection**\n`;
    response += `• Encrypt sensitive data\n`;
    response += `• Never log passwords/secrets\n`;
    response += `• Use environment variables\n`;
    response += `• Implement data retention policies\n\n`;
    
    response += `**5. Dependencies**\n`;
    response += `• Keep dependencies updated\n`;
    response += `• Scan for vulnerabilities (npm audit)\n`;
    response += `• Use only trusted packages\n`;
    response += `• Review dependency licenses\n\n`;
    
    response += `**Common Vulnerabilities to Avoid:**\n`;
    response += `• SQL Injection - Use parameterized queries\n`;
    response += `• XSS - Escape user input\n`;
    response += `• CSRF - Use tokens\n`;
    response += `• Broken Authentication - Strong passwords, sessions\n`;
    response += `• Sensitive Data Exposure - Encrypt data\n\n`;
    
    response += `💡 Need security review for specific code? Share it!`;

    return response;
  }

  // Algorithm Explanations
  explainAlgorithm(message) {
    const lowerMsg = message.toLowerCase();
    let response = `🧮 **Algorithm Explanation:**\n\n`;

    if (lowerMsg.includes('sort')) {
      response += `**Sorting Algorithms:**\n\n`;
      response += `**Quick Sort:**\n`;
      response += `• Time: O(n log n) average, O(n²) worst\n`;
      response += `• Space: O(log n)\n`;
      response += `• Divide & conquer, pivot-based\n\n`;
      response += `**Merge Sort:**\n`;
      response += `• Time: O(n log n) always\n`;
      response += `• Space: O(n)\n`;
      response += `• Stable, divide & conquer\n\n`;
      response += `**Bubble Sort:**\n`;
      response += `• Time: O(n²)\n`;
      response += `• Simple but inefficient\n`;
      response += `• Good for learning\n`;
    } else if (lowerMsg.includes('search') || lowerMsg.includes('find')) {
      response += `**Search Algorithms:**\n\n`;
      response += `**Binary Search:**\n`;
      response += `• Time: O(log n)\n`;
      response += `• Requires sorted array\n`;
      response += `• Divide array in half repeatedly\n\n`;
      response += `**Linear Search:**\n`;
      response += `• Time: O(n)\n`;
      response += `• Works on any array\n`;
      response += `• Check each element\n`;
    } else if (lowerMsg.includes('complexity') || lowerMsg.includes('big o')) {
      response += `**Time Complexity (Big O):**\n\n`;
      response += `**O(1)** - Constant: Array access\n`;
      response += `**O(log n)** - Logarithmic: Binary search\n`;
      response += `**O(n)** - Linear: Iterating array\n`;
      response += `**O(n log n)** - Linearithmic: Efficient sorts\n`;
      response += `**O(n²)** - Quadratic: Nested loops\n`;
      response += `**O(2ⁿ)** - Exponential: Recursive fibonacci\n\n`;
      response += `**Space Complexity:**\n`;
      response += `• Amount of memory used\n`;
      response += `• Consider auxiliary space\n`;
    } else {
      response += `**Algorithm Design Principles:**\n\n`;
      response += `**1. Understand the Problem**\n`;
      response += `• What are inputs/outputs?\n`;
      response += `• What are constraints?\n\n`;
      response += `**2. Choose Data Structures**\n`;
      response += `• Arrays for indexed access\n`;
      response += `• Hash maps for O(1) lookups\n`;
      response += `• Trees for hierarchical data\n\n`;
      response += `**3. Design Algorithm**\n`;
      response += `• Break into steps\n`;
      response += `• Consider edge cases\n\n`;
      response += `**4. Analyze Complexity**\n`;
      response += `• Time complexity\n`;
      response += `• Space complexity\n\n`;
      response += `💡 Want explanation of a specific algorithm? Ask!`;
    }

    return response;
  }

  // Design Patterns
  explainDesignPattern(message) {
    const lowerMsg = message.toLowerCase();
    let response = `🎨 **Design Pattern Explanation:**\n\n`;

    const patterns = {
      singleton: {
        name: "Singleton Pattern",
        purpose: "Ensure only one instance exists",
        example: `class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    Database.instance = this;
  }
}`,
        use: "Database connections, loggers, caches"
      },
      factory: {
        name: "Factory Pattern",
        purpose: "Create objects without specifying exact class",
        example: `function createUser(type) {
  if (type === 'admin') return new Admin();
  if (type === 'user') return new User();
}`,
        use: "Object creation based on conditions"
      },
      observer: {
        name: "Observer Pattern",
        purpose: "Notify multiple objects of state changes",
        example: `class Subject {
  observers = [];
  notify() {
    this.observers.forEach(obs => obs.update());
  }
}`,
        use: "Event systems, React state"
      },
      mvc: {
        name: "MVC Pattern",
        purpose: "Separate Model, View, Controller",
        example: `Model: Data & business logic
View: UI presentation
Controller: Handles input, updates model/view`,
        use: "Web frameworks, UI architecture"
      }
    };

    let foundPattern = null;
    for (const [key, pattern] of Object.entries(patterns)) {
      if (lowerMsg.includes(key)) {
        foundPattern = pattern;
        break;
      }
    }

    if (foundPattern) {
      response += `**${foundPattern.name}**\n\n`;
      response += `**Purpose:** ${foundPattern.purpose}\n\n`;
      response += `**Example:**\n\`\`\`javascript\n${foundPattern.example}\n\`\`\`\n\n`;
      response += `**When to Use:** ${foundPattern.use}\n\n`;
      response += `**Benefits:**\n• Better code organization\n• Easier to maintain\n• Reusable solutions\n`;
    } else {
      response += `**Common Design Patterns:**\n\n`;
      response += `**Creational:**\n• Singleton - One instance\n`;
      response += `• Factory - Object creation\n`;
      response += `• Builder - Complex object construction\n\n`;
      response += `**Structural:**\n• Adapter - Interface compatibility\n`;
      response += `• Decorator - Add functionality\n`;
      response += `• Facade - Simplified interface\n\n`;
      response += `**Behavioral:**\n• Observer - Event notifications\n`;
      response += `• Strategy - Algorithm selection\n`;
      response += `• Command - Encapsulate requests\n\n`;
      response += `💡 Want details on a specific pattern? Ask!`;
    }

    return response;
  }

  // API Design Suggestions
  suggestAPIDesign(message) {
    let response = `🌐 **API Design Best Practices:**\n\n`;

    response += `**RESTful API Structure:**\n\n`;
    response += `**1. Use Proper HTTP Methods**\n`;
    response += `• GET - Retrieve resources\n`;
    response += `• POST - Create resources\n`;
    response += `• PUT - Update entire resource\n`;
    response += `• PATCH - Partial updates\n`;
    response += `• DELETE - Remove resources\n\n`;
    
    response += `**2. RESTful URLs**\n`;
    response += `✅ Good: \`GET /api/users/123\`\n`;
    response += `❌ Bad: \`GET /api/getUser?id=123\`\n`;
    response += `• Use nouns, not verbs\n`;
    response += `• Use plural for collections\n`;
    response += `• Use hierarchical structure\n\n`;
    
    response += `**3. Response Format**\n`;
    response += `\`\`\`json\n{\n  "data": {},\n  "status": "success",\n  "message": "optional"\n}\n\`\`\`\n\n`;
    response += `**4. Status Codes**\n`;
    response += `• 200 - Success\n`;
    response += `• 201 - Created\n`;
    response += `• 400 - Bad Request\n`;
    response += `• 401 - Unauthorized\n`;
    response += `• 404 - Not Found\n`;
    response += `• 500 - Server Error\n\n`;
    
    response += `**5. Versioning**\n`;
    response += `• Use URL versioning: \`/api/v1/users\`\n`;
    response += `• Or header versioning\n\n`;
    
    response += `**6. Pagination**\n`;
    response += `\`\`\`\nGET /api/users?page=1&limit=20\n\`\`\`\n\n`;
    response += `**7. Filtering & Sorting**\n`;
    response += `\`\`\`\nGET /api/users?status=active&sort=name&order=asc\n\`\`\`\n\n`;
    response += `**8. Error Handling**\n`;
    response += `\`\`\`json\n{\n  "error": {\n    "code": "VALIDATION_ERROR",\n    "message": "Invalid input",\n    "details": []\n  }\n}\n\`\`\`\n\n`;
    response += `💡 Need help designing a specific API? Describe it!`;

    return response;
  }

  // Database Design Suggestions
  suggestDatabaseDesign(message) {
    let response = `🗄️ **Database Design Best Practices:**\n\n`;

    response += `**1. Normalization**\n`;
    response += `• 1NF: Eliminate duplicate columns\n`;
    response += `• 2NF: Remove partial dependencies\n`;
    response += `• 3NF: Remove transitive dependencies\n`;
    response += `• Balance normalization with performance\n\n`;
    
    response += `**2. Indexing Strategy**\n`;
    response += `• Index frequently queried columns\n`;
    response += `• Index foreign keys\n`;
    response += `• Don't over-index (slows writes)\n`;
    response += `• Use composite indexes for multi-column queries\n\n`;
    
    response += `**3. Data Types**\n`;
    response += `• Use appropriate types (INT, VARCHAR, TEXT)\n`;
    response += `• Use ENUM for fixed values\n`;
    response += `• Use TIMESTAMP for dates\n`;
    response += `• Consider JSONB for flexible schemas\n\n`;
    
    response += `**4. Relationships**\n`;
    response += `• One-to-Many: Foreign key\n`;
    response += `• Many-to-Many: Junction table\n`;
    response += `• One-to-One: Shared primary key or foreign key\n\n`;
    
    response += `**5. Query Optimization**\n`;
    response += `• Use EXPLAIN to analyze queries\n`;
    response += `• Avoid SELECT *\n`;
    response += `• Use LIMIT for large datasets\n`;
    response += `• Join efficiently\n\n`;
    
    response += `**6. Security**\n`;
    response += `• Use parameterized queries\n`;
    response += `• Implement row-level security\n`;
    response += `• Encrypt sensitive data\n`;
    response += `• Regular backups\n\n`;
    
    response += `💡 Need help with a specific schema? Describe your data!`;

    return response;
  }

  // Testing Strategy
  suggestTestingStrategy(message) {
    let response = `🧪 **Testing Strategy & Best Practices:**\n\n`;

    response += `**Testing Pyramid:**\n\n`;
    response += `**1. Unit Tests (70%)**\n`;
    response += `• Test individual functions/components\n`;
    response += `• Fast, isolated, many tests\n`;
    response += `• Tools: Jest, Vitest, Mocha\n\n`;
    
    response += `**2. Integration Tests (20%)**\n`;
    response += `• Test component interactions\n`;
    response += `• Test API endpoints\n`;
    response += `• Tools: Supertest, React Testing Library\n\n`;
    
    response += `**3. E2E Tests (10%)**\n`;
    response += `• Test full user flows\n`;
    response += `• Slower, fewer tests\n`;
    response += `• Tools: Cypress, Playwright, Selenium\n\n`;
    
    response += `**What to Test:**\n`;
    response += `✅ Business logic\n`;
    response += `✅ Edge cases\n`;
    response += `✅ Error handling\n`;
    response += `✅ User interactions\n`;
    response += `❌ Don't test implementation details\n`;
    response += `❌ Don't test third-party libraries\n\n`;
    
    response += `**Example Unit Test (Jest):**\n`;
    response += `\`\`\`javascript\ndescribe('calculateTotal', () => {\n  it('should sum array of numbers', () => {\n    expect(calculateTotal([1, 2, 3])).toBe(6);\n  });\n});\n\`\`\`\n\n`;
    
    response += `**Test Coverage Goals:**\n`;
    response += `• Aim for 80%+ coverage\n`;
    response += `• Focus on critical paths\n`;
    response += `• Don't obsess over 100%\n\n`;
    
    response += `💡 Need help writing tests for specific code? Share it!`;

    return response;
  }

  // Debugging Help
  provideDebuggingHelp(message) {
    const lowerMsg = message.toLowerCase();
    let response = `🐛 **Debugging Guide:**\n\n`;

    response += `**Step-by-Step Debugging Process:**\n\n`;
    
    response += `**1. Reproduce the Issue**\n`;
    response += `• Can you consistently reproduce it?\n`;
    response += `• What steps trigger it?\n\n`;
    
    response += `**2. Check Error Messages**\n`;
    response += `• Read the full error message\n`;
    response += `• Check stack trace\n`;
    response += `• Look at line numbers\n\n`;
    
    response += `**3. Use Debugging Tools**\n`;
    response += `• Browser DevTools (console, debugger)\n`;
    response += `• React DevTools\n`;
    response += `• Network tab for API issues\n`;
    response += `• Breakpoints in code\n\n`;
    
    response += `**4. Add Logging**\n`;
    response += `• console.log() at key points\n`;
    response += `• Log inputs and outputs\n`;
    response += `• Check variable values\n\n`;
    
    response += `**5. Isolate the Problem**\n`;
    response += `• Comment out code sections\n`;
    response += `• Test in isolation\n`;
    response += `• Simplify the code\n\n`;
    
    response += `**Common Issues & Fixes:**\n\n`;
    
    if (lowerMsg.includes('undefined') || lowerMsg.includes('null')) {
      response += `**Undefined/Null Errors:**\n`;
      response += `• Check if variable is initialized\n`;
      response += `• Use optional chaining: \`obj?.prop\`\n`;
      response += `• Use nullish coalescing: \`value ?? defaultValue\`\n\n`;
    }
    
    if (lowerMsg.includes('async') || lowerMsg.includes('promise')) {
      response += `**Async/Promise Issues:**\n`;
      response += `• Make sure to await promises\n`;
      response += `• Check for unhandled rejections\n`;
      response += `• Use try-catch for error handling\n\n`;
    }
    
    if (lowerMsg.includes('react') || lowerMsg.includes('render')) {
      response += `**React Rendering Issues:**\n`;
      response += `• Check if state is updating\n`;
      response += `• Verify dependencies in useEffect\n`;
      response += `• Check for infinite loops\n\n`;
    }
    
    response += `**Debugging Tips:**\n`;
    response += `• Read error messages carefully\n`;
    response += `• Use browser DevTools\n`;
    response += `• Add breakpoints\n`;
    response += `• Test incrementally\n`;
    response += `• Ask for help when stuck!\n\n`;
    
    response += `💡 Share your error message or code, and I'll help debug it!`;

    return response;
  }
}

let assistantInstance = null;

export function initAssistant() {
  if (assistantInstance) return;
  assistantInstance = new AIAssistant();
  log('[assistant] Initialized successfully with advanced features');
}
