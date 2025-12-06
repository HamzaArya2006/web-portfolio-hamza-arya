/**
 * Advanced AI Assistant - Intelligent, Conversational, Voice-Enabled
 * Features: Smart responses, jokes, website touring, text-to-speech, voice input
 * Enhanced with: NLP algorithms, sentiment analysis, intent classification, fuzzy matching
 */

import { log } from './logger.js';

// ============================================
// Advanced NLP Algorithms
// ============================================

/**
 * Calculate Levenshtein distance (edit distance) between two strings
 * Used for fuzzy string matching
 */
function levenshteinDistance(str1, str2) {
  const matrix = [];
  const len1 = str1.length;
  const len2 = str2.length;

  for (let i = 0; i <= len2; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len1; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len2; i++) {
    for (let j = 1; j <= len1; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[len2][len1];
}

/**
 * Calculate similarity score between two strings (0-1)
 */
function stringSimilarity(str1, str2) {
  const maxLen = Math.max(str1.length, str2.length);
  if (maxLen === 0) return 1.0;
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  return 1 - (distance / maxLen);
}

/**
 * Tokenize text into words, removing stop words
 */
function tokenize(text) {
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which', 'who', 'whom', 'whose', 'where', 'when', 'why', 'how']);
  return text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));
}

/**
 * Calculate TF-IDF score for a term in a document
 */
function calculateTFIDF(term, document, allDocuments) {
  // Term Frequency
  const termCount = (document.match(new RegExp(term, 'gi')) || []).length;
  const totalTerms = document.split(/\s+/).length;
  const tf = termCount / totalTerms;

  // Inverse Document Frequency
  const docsWithTerm = allDocuments.filter(doc => 
    doc.toLowerCase().includes(term.toLowerCase())
  ).length;
  const idf = Math.log(allDocuments.length / (1 + docsWithTerm));

  return tf * idf;
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(vec1, vec2) {
  if (vec1.length !== vec2.length) return 0;
  
  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;

  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    mag1 += vec1[i] * vec1[i];
    mag2 += vec2[i] * vec2[i];
  }

  const magnitude = Math.sqrt(mag1) * Math.sqrt(mag2);
  return magnitude === 0 ? 0 : dotProduct / magnitude;
}

/**
 * Advanced Sentiment Analysis with intensity scoring
 */
function analyzeSentiment(text) {
  const positiveWords = {
    strong: ['love', 'adore', 'fantastic', 'amazing', 'perfect', 'excellent', 'brilliant', 'outstanding', 'phenomenal'],
    medium: ['good', 'great', 'nice', 'awesome', 'wonderful', 'happy', 'pleased', 'satisfied', 'glad'],
    light: ['okay', 'fine', 'alright', 'decent', 'acceptable']
  };
  
  const negativeWords = {
    strong: ['hate', 'terrible', 'awful', 'horrible', 'worst', 'disgusting', 'horrendous', 'atrocious'],
    medium: ['bad', 'poor', 'disappointed', 'frustrated', 'annoyed', 'upset', 'sad'],
    light: ['not great', 'could be better', 'meh', 'boring']
  };
  
  const lowerText = text.toLowerCase();
  let positiveScore = 0;
  let negativeScore = 0;
  let intensity = 0;

  // Weighted sentiment scoring
  Object.entries(positiveWords).forEach(([strength, words]) => {
    const weight = strength === 'strong' ? 3 : strength === 'medium' ? 2 : 1;
    words.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = (lowerText.match(regex) || []).length;
      positiveScore += matches * weight;
      intensity += matches * weight;
    });
  });

  Object.entries(negativeWords).forEach(([strength, words]) => {
    const weight = strength === 'strong' ? 3 : strength === 'medium' ? 2 : 1;
    words.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = (lowerText.match(regex) || []).length;
      negativeScore += matches * weight;
      intensity += matches * weight;
    });
  });

  // Check for negation (e.g., "not good" = negative)
  const negationPatterns = /\b(not|no|never|don't|doesn't|isn't|aren't|wasn't|weren't)\s+\w+/gi;
  const negations = (lowerText.match(negationPatterns) || []).length;
  if (negations > 0 && positiveScore > 0) {
    positiveScore *= 0.3; // Reduce positive score if negated
    negativeScore += negations * 2;
  }

  // Exclamation marks indicate intensity
  const exclamations = (text.match(/!/g) || []).length;
  intensity += exclamations * 0.5;

  const sentiment = positiveScore > negativeScore ? 'positive' : 
                   negativeScore > positiveScore ? 'negative' : 'neutral';
  
  return {
    sentiment,
    intensity: Math.min(intensity / 10, 1), // Normalize to 0-1
    confidence: Math.abs(positiveScore - negativeScore) / (positiveScore + negativeScore + 1),
    positiveScore,
    negativeScore
  };
}

/**
 * Extract entities from text (simple entity recognition)
 */
function extractEntities(text) {
  const entities = {
    technologies: [],
    topics: [],
    actions: []
  };

  const techKeywords = ['react', 'vue', 'javascript', 'typescript', 'node', 'python', 'html', 'css', 'api', 'database', 'aws', 'docker', 'git', 'github'];
  const topicKeywords = ['service', 'project', 'skill', 'contact', 'about', 'blog', 'price', 'experience', 'portfolio', 'work'];
  const actionKeywords = ['show', 'tell', 'explain', 'help', 'guide', 'navigate', 'go', 'scroll', 'find', 'search'];

  const lowerText = text.toLowerCase();
  
  techKeywords.forEach(tech => {
    if (lowerText.includes(tech)) entities.technologies.push(tech);
  });

  topicKeywords.forEach(topic => {
    if (lowerText.includes(topic)) entities.topics.push(topic);
  });

  actionKeywords.forEach(action => {
    if (lowerText.includes(action)) entities.actions.push(action);
  });

  return entities;
}

/**
 * Intent Classification - Advanced multi-layer intent detection
 */
function classifyIntent(text, context) {
  const intents = {
    greeting: ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'good night', 'sup', 'howdy'],
    question: ['what', 'how', 'why', 'when', 'where', 'who', 'which', '?', 'tell me', 'explain'],
    request: ['show', 'tell', 'explain', 'give', 'provide', 'can you', 'could you', 'please', 'help me', 'i need', 'i want'],
    navigation: ['go to', 'navigate', 'scroll', 'show me', 'take me', 'visit', 'open', 'jump to'],
    appreciation: ['thanks', 'thank you', 'appreciate', 'great', 'awesome', 'perfect', 'excellent'],
    clarification: ['what do you mean', 'i don\'t understand', 'explain', 'clarify', 'more details', 'elaborate', 'can you explain'],
    comparison: ['compare', 'difference', 'vs', 'versus', 'better', 'best', 'which is better', 'what\'s the difference'],
    information: ['tell me about', 'what is', 'what are', 'information', 'details', 'describe', 'elaborate on'],
    command: ['do', 'make', 'create', 'build', 'generate', 'find', 'search', 'look for'],
    confirmation: ['yes', 'yeah', 'yep', 'sure', 'ok', 'okay', 'correct', 'right', 'exactly'],
    negation: ['no', 'nope', 'not', 'don\'t', 'never', 'nothing', 'none'],
    continuation: ['more', 'continue', 'and', 'also', 'additionally', 'furthermore', 'what else'],
    urgency: ['urgent', 'asap', 'quickly', 'fast', 'immediately', 'now', 'right now']
  };

  const lowerText = text.toLowerCase();
  const scores = {};
  const tokens = tokenize(text);

  // Multi-layer scoring
  for (const [intent, keywords] of Object.entries(intents)) {
    scores[intent] = 0;
    
    // Layer 1: Direct keyword matching
    keywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        const weight = keyword.length > 3 ? 3 : 1.5;
        scores[intent] += weight;
      }
    });
    
    // Layer 2: Token-based matching (more accurate)
    keywords.forEach(keyword => {
      const keywordTokens = tokenize(keyword);
      keywordTokens.forEach(kwToken => {
        if (tokens.includes(kwToken)) {
          scores[intent] += 2;
        }
      });
    });
    
    // Layer 3: Fuzzy matching for variations
    keywords.forEach(keyword => {
      tokens.forEach(token => {
        const similarity = stringSimilarity(token, keyword);
        if (similarity > 0.8) {
          scores[intent] += similarity * 1.5;
        }
      });
    });
  }

  // Context-aware boosting
  if (context.lastTopic && lowerText.includes(context.lastTopic)) {
    scores.question += 2;
    scores.information += 1.5;
  }
  
  if (context.lastIntent === 'question' && lowerText.length < 20) {
    scores.confirmation += 1.5;
    scores.negation += 1.5;
  }
  
  if (context.conversationFlow && context.conversationFlow.length > 0) {
    const lastMessage = context.conversationFlow[context.conversationFlow.length - 1];
    if (lastMessage.intent === 'question' && !lowerText.includes('?')) {
      scores.continuation += 2;
    }
  }

  // Find highest scoring intent with confidence
  const maxScore = Math.max(...Object.values(scores));
  const primaryIntent = Object.keys(scores).find(key => scores[key] === maxScore);
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const confidence = totalScore > 0 ? maxScore / totalScore : 0;
  
  return {
    primary: primaryIntent || 'general',
    confidence: Math.min(confidence, 1), // Normalize to 0-1
    allScores: scores,
    secondary: Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .slice(1, 3)
      .map(([intent]) => intent)
  };
}

// Get time-based greeting
function getTimeBasedGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
}

// Get random greeting
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
  ];
  return greetings[Math.floor(Math.random() * greetings.length)];
}

// Jokes database
const JOKES = [
  {
    setup: "Why do programmers prefer dark mode?",
    punchline: "Because light attracts bugs! 🐛"
  },
  {
    setup: "How do you comfort a JavaScript bug?",
    punchline: "You console it! 😄"
  },
  {
    setup: "Why did the developer go broke?",
    punchline: "Because he used up all his cache! 💰"
  },
  {
    setup: "What's a programmer's favorite hangout place?",
    punchline: "Foo Bar! 🍻"
  },
  {
    setup: "Why do Java developers wear glasses?",
    punchline: "Because they can't C#! 👓"
  },
  {
    setup: "How many programmers does it take to change a light bulb?",
    punchline: "None, that's a hardware problem! 💡"
  },
  {
    setup: "What do you call a programmer from Finland?",
    punchline: "Nerdic! 🇫🇮"
  },
  {
    setup: "Why did the React component feel lonely?",
    punchline: "Because it didn't have props! 😢"
  },
  {
    setup: "What's the object-oriented way to become wealthy?",
    punchline: "Inheritance! 💰"
  },
  {
    setup: "Why don't programmers like nature?",
    punchline: "It has too many bugs! 🐛"
  },
  {
    setup: "What's a computer's favorite snack?",
    punchline: "Microchips! 🍟"
  },
  {
    setup: "Why did the developer quit his job?",
    punchline: "He didn't get arrays! 😂"
  }
];

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

// Massive knowledge base with intelligent responses
const KNOWLEDGE_BASE = {
  greeting: {
    patterns: ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'good night', 'what\'s up', 'sup', 'howdy', 'yo', 'hi nova', 'hello nova'],
    responses: (context) => {
      const timeGreeting = getTimeBasedGreeting();
      const randomGreet = getRandomGreeting();
      const isReturning = context.visitCount > 1;
      const returnGreeting = isReturning ? "Welcome back! " : "";
      
      return [
        `${timeGreeting}! ${returnGreeting}${randomGreet} 👋 I'm Nova, your AI assistant 🤖. I'm here to help you explore Hamza's portfolio. What would you like to know?`,
        `${randomGreet}! ${timeGreeting}! ${returnGreeting}I'm Nova, and I'm excited to help you discover what makes Hamza's work special. Ask me anything!`,
        `Hey there! ${timeGreeting}! ${returnGreeting}I'm Nova, your friendly AI guide. Want to learn about services, projects, or just chat?`,
        `${timeGreeting}! ${returnGreeting}Welcome! I'm Nova, and I can help you navigate the site, answer questions, tell jokes, or just have a conversation. What's on your mind?`,
        `Hi! ${timeGreeting}! ${returnGreeting}I'm Nova 🤖, here to make your visit awesome. I can guide you around, answer questions, share jokes, or help you find what you need. Let's go! 🚀`
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
    patterns: ['thanks', 'thank you', 'appreciate', 'grateful', 'thx'],
    responses: () => [
      "You're very welcome! 😊 Happy to help! Is there anything else you'd like to know?",
      "My pleasure! Feel free to ask if you need anything else!",
      "Anytime! I'm here whenever you need me. What else can I help with?",
      "You're welcome! Glad I could help. Anything else?",
      "Happy to help! 😊 Let me know if you need anything else!"
    ]
  },
  goodbye: {
    patterns: ['bye', 'goodbye', 'see you', 'later', 'farewell', 'cya'],
    responses: () => [
      "Goodbye! 👋 It was great chatting with you! Come back anytime!",
      "See you later! 😊 Thanks for visiting!",
      "Bye! Have a wonderful day! Come back soon!",
      "Farewell! 👋 Hope to chat again soon!",
      "Goodbye! Take care! 😊"
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
    this.isOpen = false;
    this.conversationHistory = [];
    this.speechSynthesis = window.speechSynthesis;
    this.recognition = null;
    this.isListening = false;
    this.isSpeaking = false;
    this.userName = null;
    this.isTyping = false;
    this.sessionId = this.generateSessionId();
    this.apiBaseUrl = window.location.origin; // Will work with Netlify
    this.syncEnabled = true; // Enable cloud sync
    this.context = {
      lastSection: null,
      lastTopic: null,
      visitCount: 0,
      userPreferences: {},
      conversationFlow: [],
      mentionedTopics: [],
      userMood: 'neutral',
      sentimentHistory: [],
      lastIntent: null,
      intentConfidence: 0,
      learningData: {}, // For adaptive learning
      conversationMemory: [], // Long-term memory
      userProfile: {
        interests: [],
        expertise: 'unknown',
        communicationStyle: 'balanced',
        preferredTopics: []
      },
      reasoningChain: [], // For multi-step reasoning
      attentionWeights: {}, // Attention mechanism simulation
      globalAnalytics: null // Analytics from all users
    };
    this.init();
  }

  /**
   * Generate unique session ID
   */
  generateSessionId() {
    // Try to get existing session from localStorage
    let sessionId = localStorage.getItem('nova-session-id');
    if (sessionId) return sessionId;
    
    // Generate new session ID
    sessionId = `nova-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem('nova-session-id', sessionId);
    return sessionId;
  }

  async init() {
    this.initSpeechRecognition();
    this.createUI();
    this.bindEvents();
    this.loadContext();
    
    // Load conversations from cloud
    if (this.syncEnabled) {
      await this.loadConversationsFromCloud();
      await this.loadGlobalAnalytics();
    }
    
    log('[assistant] Initialized with advanced features and cloud sync');
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
        this.context = { ...this.context, ...JSON.parse(saved) };
      } catch (e) {
        console.error('Failed to load context:', e);
      }
    }
    this.context.visitCount++;
    this.saveContext();
  }

  saveContext() {
    try {
      localStorage.setItem('ai-assistant-context', JSON.stringify(this.context));
    } catch (e) {
      console.error('Failed to save context:', e);
    }
  }

  createUI() {
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
            <button class="ai-assistant-chip" data-question="Show me around the website">🗺️ Tour</button>
            <button class="ai-assistant-chip" data-question="What services do you offer?">💼 Services</button>
            <button class="ai-assistant-chip" data-question="Show me your projects">🚀 Projects</button>
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
    } else {
      // Fallback: wait for DOM to be ready
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
      const welcomeMessages = [
        `Hello! 👋 ${getTimeBasedGreeting()}! I'm Nova, your AI assistant. I can help you explore the website, answer questions, tell jokes, guide you around, and even chat with voice! What would you like to do?`,
        `Hey there! ${getTimeBasedGreeting()}! 👋 I'm Nova, and I'm here to make your visit awesome. I can guide you, answer questions, tell jokes, navigate the site, and use voice features. Let's get started!`,
        `${getTimeBasedGreeting()}! Welcome! 🎉 I'm Nova, your intelligent assistant. I can help you navigate, answer questions, share jokes, and have conversations. What can I help you with today?`
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
        this.handleUserMessage(message);
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

  async handleUserMessage(message) {
    this.hideSuggestions();
    this.addMessage(message, 'user');
    this.conversationHistory.push({ role: 'user', content: message });
    
    // Update context
    this.updateContext(message);
    
    // Check for navigation commands
    if (this.handleNavigation(message)) {
      // Save navigation action
      if (this.syncEnabled) {
        this.saveConversationToCloud(message, 'Navigation action', this.context);
      }
      return;
    }
    
    // Show typing indicator
    this.showTypingIndicator();
    
    // Simulate thinking delay with variable timing for more natural feel
    const thinkingTime = this.calculateThinkingTime(message);
    
    setTimeout(async () => {
      this.hideTypingIndicator();
      // Use enhanced response generation with global learning
      const response = this.generateResponseWithGlobalLearning(message);
      this.addMessage(response, 'assistant', true);
      this.conversationHistory.push({ role: 'assistant', content: response });
      
      // Save conversation to cloud
      if (this.syncEnabled) {
        await this.saveConversationToCloud(message, response, this.context);
      }
      
      // Speak the response if voice is enabled
      if (this.voiceEnabled) {
        this.speak(response.replace(/[🎯🚀💼📧📍⏱️🌐📝🔗🎉💬🗺️📚🎤🎭😊👋💡🛒⚡☁️💾⚙️🎨📊🤖✨]/g, '').replace(/\n/g, ' '));
      }
    }, thinkingTime);
  }

  calculateThinkingTime(message) {
    // Advanced complexity calculation
    const length = message.length;
    const hasQuestion = message.includes('?');
    const tokens = tokenize(message);
    const uniqueTokens = new Set(tokens).size;
    const intent = classifyIntent(message, this.context);
    
    // Base time
    let complexity = 300;
    
    // Length factor
    complexity += length > 50 ? 200 : 0;
    complexity += length > 100 ? 150 : 0;
    
    // Question factor
    if (hasQuestion) complexity += 250;
    
    // Vocabulary complexity (more unique words = more complex)
    complexity += uniqueTokens * 10;
    
    // Intent complexity
    if (intent.primary === 'question') complexity += 200;
    if (intent.primary === 'clarification') complexity += 150;
    
    // Context complexity (if switching topics)
    if (this.context.lastTopic && this.detectTopic(message) !== this.context.lastTopic) {
      complexity += 100;
    }
    
    // Add randomness for natural feel
    const randomFactor = 200 + Math.random() * 300;
    
    return Math.min(complexity + randomFactor, 2000); // Cap at 2 seconds
  }

  updateContext(message) {
    const lowerMsg = message.toLowerCase();
    
    // Advanced entity extraction
    const entities = extractEntities(message);
    entities.topics.forEach(topic => {
      if (!this.context.mentionedTopics.includes(topic)) {
        this.context.mentionedTopics.push(topic);
      }
    });
    
    // Enhanced sentiment analysis with intensity
    const sentimentData = analyzeSentiment(message);
    this.context.userMood = sentimentData.sentiment;
    this.context.sentimentHistory = this.context.sentimentHistory || [];
    this.context.sentimentHistory.push({
      sentiment: sentimentData.sentiment,
      intensity: sentimentData.intensity,
      confidence: sentimentData.confidence,
      timestamp: Date.now(),
      message: message.substring(0, 30)
    });
    
    // Keep sentiment history (last 10 for better analysis)
    if (this.context.sentimentHistory.length > 10) {
      this.context.sentimentHistory.shift();
    }
    
    // Advanced intent classification
    const intent = classifyIntent(message, this.context);
    this.context.lastIntent = intent.primary;
    this.context.intentConfidence = intent.confidence;
    
    // Build user profile
    this.updateUserProfile(message, entities, intent);
    
    // Attention mechanism - weight important information
    this.updateAttentionWeights(message, entities, intent);
    
    // Track conversation flow with comprehensive details
    const flowEntry = {
      timestamp: Date.now(),
      message: message.substring(0, 50),
      topic: this.detectTopic(message),
      intent: intent.primary,
      intentSecondary: intent.secondary,
      sentiment: sentimentData.sentiment,
      sentimentIntensity: sentimentData.intensity,
      entities: entities,
      tokens: tokenize(message),
      length: message.length
    };
    
    this.context.conversationFlow.push(flowEntry);
    
    // Keep last 20 interactions for deep context
    if (this.context.conversationFlow.length > 20) {
      this.context.conversationFlow.shift();
    }
    
    // Long-term memory for important information
    if (intent.confidence > 0.7 || sentimentData.intensity > 0.7) {
      this.context.conversationMemory.push({
        ...flowEntry,
        importance: intent.confidence * sentimentData.intensity
      });
      
      // Keep only most important memories (top 30)
      this.context.conversationMemory.sort((a, b) => b.importance - a.importance);
      if (this.context.conversationMemory.length > 30) {
        this.context.conversationMemory = this.context.conversationMemory.slice(0, 30);
      }
    }
    
    // Track user preferences with decay (recent interactions weighted more)
    if (!this.context.userPreferences) {
      this.context.userPreferences = {};
    }
    
    entities.topics.forEach(topic => {
      this.context.userPreferences[topic] = (this.context.userPreferences[topic] || 0) * 0.95 + 1; // Decay old preferences
    });
    
    // Multi-step reasoning chain
    this.updateReasoningChain(message, intent, entities);
    
    this.saveContext();
  }

  /**
   * Update user profile based on interactions
   */
  updateUserProfile(message, entities, intent) {
    const profile = this.context.userProfile;
    
    // Detect interests
    entities.topics.forEach(topic => {
      if (!profile.interests.includes(topic)) {
        profile.interests.push(topic);
      }
    });
    
    // Detect expertise level based on vocabulary and question complexity
    const tokens = tokenize(message);
    const uniqueTokens = new Set(tokens).size;
    const avgWordLength = tokens.reduce((sum, token) => sum + token.length, 0) / (tokens.length || 1);
    
    if (uniqueTokens > 8 && avgWordLength > 5 && message.length > 50) {
      profile.expertise = 'advanced';
    } else if (uniqueTokens > 5 && message.length > 30) {
      profile.expertise = 'intermediate';
    } else {
      profile.expertise = 'beginner';
    }
    
    // Detect communication style
    const sentiment = analyzeSentiment(message);
    if (sentiment.intensity > 0.7) {
      profile.communicationStyle = 'enthusiastic';
    } else if (message.length < 20) {
      profile.communicationStyle = 'concise';
    } else if (message.length > 100) {
      profile.communicationStyle = 'detailed';
    }
    
    // Track preferred topics
    entities.topics.forEach(topic => {
      if (!profile.preferredTopics.includes(topic)) {
        profile.preferredTopics.push(topic);
      }
    });
  }

  /**
   * Attention mechanism - weight important information
   */
  updateAttentionWeights(message, entities, intent) {
    const weights = this.context.attentionWeights;
    
    // Higher weight for high-confidence intents
    if (intent.confidence > 0.7) {
      weights[intent.primary] = (weights[intent.primary] || 0) + intent.confidence;
    }
    
    // Weight entities based on frequency
    entities.topics.forEach(topic => {
      weights[topic] = (weights[topic] || 0) + 1;
    });
    
    // Decay old weights
    Object.keys(weights).forEach(key => {
      weights[key] *= 0.9;
      if (weights[key] < 0.1) delete weights[key];
    });
  }

  /**
   * Multi-step reasoning chain
   */
  updateReasoningChain(message, intent, entities) {
    const chain = this.context.reasoningChain;
    
    // Add reasoning step
    chain.push({
      step: chain.length + 1,
      input: message.substring(0, 40),
      intent: intent.primary,
      entities: entities.topics,
      timestamp: Date.now()
    });
    
    // Keep last 5 reasoning steps
    if (chain.length > 5) {
      chain.shift();
    }
    
    // Detect reasoning patterns
    if (chain.length >= 2) {
      const lastTwo = chain.slice(-2);
      if (lastTwo[0].intent === 'question' && lastTwo[1].intent === 'clarification') {
        // User is seeking clarification - adjust response style
        this.context.needsClarification = true;
      }
    }
  }

  /**
   * Advanced reasoning system - simulates multi-step thought process
   */
  performAdvancedReasoning(message, context) {
    const steps = [];
    const intent = classifyIntent(message, context);
    const sentiment = analyzeSentiment(message);
    const entities = extractEntities(message);
    
    // Step 1: Understand the query
    steps.push({
      step: 1,
      reasoning: 'Understanding user intent',
      conclusion: `User intent: ${intent.primary} (confidence: ${(intent.confidence * 100).toFixed(1)}%)`
    });
    
    // Step 2: Analyze context
    if (context.lastTopic) {
      steps.push({
        step: 2,
        reasoning: 'Contextual analysis',
        conclusion: `Previous topic: ${context.lastTopic}, Current sentiment: ${sentiment.sentiment}`
      });
    }
    
    // Step 3: Entity extraction reasoning
    if (entities.topics.length > 0) {
      steps.push({
        step: 3,
        reasoning: 'Entity recognition',
        conclusion: `Detected topics: ${entities.topics.join(', ')}`
      });
    }
    
    // Step 4: Memory retrieval
    if (context.conversationMemory && context.conversationMemory.length > 0) {
      const relevantMemories = context.conversationMemory
        .filter(m => entities.topics.some(t => m.entities?.includes(t)))
        .slice(0, 2);
      
      if (relevantMemories.length > 0) {
        steps.push({
          step: 4,
          reasoning: 'Memory retrieval',
          conclusion: `Found ${relevantMemories.length} relevant memories`
        });
      }
    }
    
    // Step 5: Response strategy
    let strategy = 'direct';
    if (intent.primary === 'clarification') strategy = 'detailed';
    if (sentiment.intensity > 0.7) strategy = 'empathetic';
    if (context.userProfile?.expertise === 'advanced') strategy = 'technical';
    
    steps.push({
      step: 5,
      reasoning: 'Response strategy',
      conclusion: `Strategy: ${strategy} (based on user profile and context)`
    });
    
    return steps;
  }

  detectTopic(message) {
    const lowerMsg = message.toLowerCase();
    const tokens = tokenize(message);
    let bestTopic = 'general';
    let bestScore = 0;
    
    // Enhanced topic detection with fuzzy matching
    for (const [category, data] of Object.entries(KNOWLEDGE_BASE)) {
      if (category === 'default') continue;
      
      let score = 0;
      data.patterns.forEach(pattern => {
        const patternLower = pattern.toLowerCase();
        if (lowerMsg.includes(patternLower)) {
          score += 5;
        }
        // Fuzzy matching
        tokens.forEach(token => {
          const similarity = stringSimilarity(token, patternLower);
          if (similarity > 0.7) {
            score += similarity * 3;
          }
        });
      });
      
      if (score > bestScore) {
        bestScore = score;
        bestTopic = category;
      }
    }
    
    return bestTopic;
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
    const context = this.context;
    const tokens = tokenize(message);
    
    // Advanced reasoning: Multi-step thought process
    const reasoningSteps = this.performAdvancedReasoning(message, context);
    
    // Advanced multi-algorithm matching system with reasoning integration
    const matches = [];
    
    for (const [category, data] of Object.entries(KNOWLEDGE_BASE)) {
      if (category === 'default') continue;
      
      let score = 0;
      const words = lowerMessage.split(/\s+/);
      const patternTexts = data.patterns.join(' ');
      
      // Algorithm 1: Exact phrase matching (highest weight)
      data.patterns.forEach(pattern => {
        const patternLower = pattern.toLowerCase();
        if (lowerMessage.includes(patternLower)) {
          score += 15; // High weight for exact matches
        }
      });
      
      // Algorithm 2: Fuzzy string matching using Levenshtein distance
      data.patterns.forEach(pattern => {
        const similarity = stringSimilarity(lowerMessage, pattern);
        if (similarity > 0.7) {
          score += similarity * 10;
        }
      });
      
      // Algorithm 3: TF-IDF based scoring
      const allPatterns = Object.values(KNOWLEDGE_BASE)
        .flatMap(d => d.patterns)
        .join(' ');
      tokens.forEach(token => {
        const tfidf = calculateTFIDF(token, patternTexts, [allPatterns]);
        score += tfidf * 5;
      });
      
      // Algorithm 4: Word-level matching with weights
      data.patterns.forEach(pattern => {
        const patternWords = pattern.toLowerCase().split(/\s+/);
        patternWords.forEach(pWord => {
          words.forEach(word => {
            if (word === pWord) score += 4;
            else if (word.includes(pWord) || pWord.includes(word)) {
              const sim = stringSimilarity(word, pWord);
              score += sim * 2;
            }
          });
        });
      });
      
      // Algorithm 5: Context-aware boosting
      if (this.context.mentionedTopics.includes(category)) {
        score += 3; // Boost for previously mentioned topics
      }
      
      if (this.context.lastTopic === category) {
        score += 2.5; // Boost for continuation of topic
      }
      
      // Algorithm 6: User preference boosting
      if (this.context.userPreferences[category]) {
        score += Math.log(this.context.userPreferences[category] + 1) * 1.5;
      }
      
      // Algorithm 7: Intent-based matching
      const intent = classifyIntent(message, context);
      if (intent.primary === 'question' && category !== 'greeting') {
        score += 2;
      }
      
      // Algorithm 8: Sentiment-aware matching
      const sentimentData = analyzeSentiment(message);
      if (sentimentData.sentiment === 'positive' && category === 'thanks') {
        score += 3;
      }
      if (sentimentData.intensity > 0.7) {
        score += sentimentData.intensity * 2; // Boost for high-intensity sentiment
      }
      
      matches.push({ category, data, score });
    }
    
    // Sort matches by score (descending)
    matches.sort((a, b) => b.score - a.score);
    
    // Use best match if score is significant (lowered threshold for better matching)
    if (matches.length > 0 && matches[0].score >= 2) {
      const bestMatch = matches[0];
      const responses = typeof bestMatch.data.responses === 'function' 
        ? bestMatch.data.responses(context) 
        : bestMatch.data.responses;
      
      // Intelligent response selection based on context with advanced personalization
      let response = this.selectBestResponse(responses, message, context);
      
      // Apply user profile-based customization
      response = this.customizeResponseForUser(response, context);
      
      // Add contextual follow-ups with reasoning
      response = this.addContextualFollowUp(response, bestMatch.category, message);
      
      // Add sentiment-aware closing with advanced personalization
      response = this.addSentimentAwareClosing(response, context);
      
      // Add memory-based insights
      response = this.addMemoryBasedInsights(response, context, bestMatch.category);
      
      this.context.lastTopic = bestMatch.category;
      
      // Learning: Track successful matches
      if (!this.context.learningData[bestMatch.category]) {
        this.context.learningData[bestMatch.category] = { matches: 0, avgScore: 0 };
      }
      this.context.learningData[bestMatch.category].matches++;
      this.context.learningData[bestMatch.category].avgScore = 
        (this.context.learningData[bestMatch.category].avgScore + bestMatch.score) / 2;
      
        this.saveContext();
        return response;
    }
    
    // Enhanced default response with intelligent suggestions
    const defaultResponses = KNOWLEDGE_BASE.default.responses(context);
    let response = this.selectBestResponse(defaultResponses, message, context);
    
    // Add smart suggestions based on conversation history and user preferences
    const suggestions = this.generateIntelligentSuggestions();
    if (suggestions) {
      response += `\n\n${suggestions}`;
    }
    
    return response;
  }

  /**
   * Select best response from array based on context and message - Advanced version
   */
  selectBestResponse(responses, message, context) {
    if (responses.length === 0) return "I'm not sure how to respond to that.";
    if (responses.length === 1) return responses[0];
    
    // Score each response based on multiple factors
    const scoredResponses = responses.map((response, index) => {
      let score = 0;
      const responseLower = response.toLowerCase();
      const messageLower = message.toLowerCase();
      
      // Factor 1: Keyword overlap with TF-IDF weighting
      const messageTokens = tokenize(message);
      const responseTokens = tokenize(response);
      const overlap = messageTokens.filter(token => responseTokens.includes(token)).length;
      score += overlap * 2.5;
      
      // Factor 2: Context topic relevance
      if (context.mentionedTopics.length > 0) {
        context.mentionedTopics.forEach(topic => {
          if (responseLower.includes(topic)) {
            const topicWeight = context.userPreferences[topic] || 1;
            score += 3 * Math.log(topicWeight + 1);
          }
        });
      }
      
      // Factor 3: Sentiment alignment
      const sentimentData = analyzeSentiment(message);
      if (sentimentData.sentiment === 'positive' && (responseLower.includes('great') || responseLower.includes('awesome'))) {
        score += 2.5;
      }
      if (sentimentData.sentiment === 'negative' && (responseLower.includes('help') || responseLower.includes('clarify'))) {
        score += 3; // Higher boost for helpful responses to negative sentiment
      }
      
      // Factor 4: User profile matching
      if (context.userProfile) {
        if (context.userProfile.expertise === 'advanced' && response.length > 150) {
          score += 2; // Advanced users prefer detailed responses
        }
        if (context.userProfile.communicationStyle === 'concise' && response.length < 100) {
          score += 1.5; // Concise users prefer shorter responses
        }
        if (context.userProfile.communicationStyle === 'detailed' && response.length > 200) {
          score += 2; // Detailed users prefer longer responses
        }
      }
      
      // Factor 5: Intent matching
      const intent = classifyIntent(message, context);
      if (intent.primary === 'question' && response.includes('?')) {
        score -= 1; // Don't answer questions with questions
      }
      if (intent.primary === 'clarification' && (response.includes('explain') || response.includes('clarify'))) {
        score += 2.5;
      }
      
      // Factor 6: Response completeness
      const hasStructure = response.includes('\n') || response.includes('•') || response.includes('**');
      if (message.length > 40 && hasStructure) {
        score += 1.5; // Structured responses for complex queries
      }
      
      // Factor 7: Memory relevance
      if (context.conversationMemory) {
        const memoryRelevance = context.conversationMemory.filter(m => {
          const memoryText = m.message?.toLowerCase() || '';
          return responseTokens.some(token => memoryText.includes(token));
        }).length;
        score += memoryRelevance * 1.2;
      }
      
      // Factor 8: Attention weights
      responseTokens.forEach(token => {
        if (context.attentionWeights[token]) {
          score += context.attentionWeights[token] * 1.5;
        }
      });
      
      return { response, score, index };
    });
    
    // Sort by score and return top response
    scoredResponses.sort((a, b) => b.score - a.score);
    
    // If top two are very close, add some randomness for variety
    if (scoredResponses.length > 1) {
      const topScore = scoredResponses[0].score;
      const secondScore = scoredResponses[1].score;
      if (topScore - secondScore < 2 && Math.random() > 0.7) {
        return scoredResponses[1].response; // Sometimes use second best for variety
      }
    }
    
    return scoredResponses[0].response;
  }

  /**
   * Customize response based on user profile
   */
  customizeResponseForUser(response, context) {
    if (!context.userProfile) return response;
    
    const profile = context.userProfile;
    
    // Adjust for expertise level
    if (profile.expertise === 'beginner') {
      // Simplify technical terms
      response = response.replace(/\bAPI\b/g, 'Application Programming Interface (API)');
      response = response.replace(/\bPWA\b/g, 'Progressive Web App (PWA)');
    }
    
    // Adjust for communication style
    if (profile.communicationStyle === 'concise') {
      // Remove extra fluff
      response = response.replace(/\n\n+/g, '\n\n');
      if (response.split('\n\n').length > 3) {
        const parts = response.split('\n\n');
        response = parts.slice(0, 3).join('\n\n');
      }
    } else if (profile.communicationStyle === 'detailed') {
      // Add more context if needed
      if (response.length < 150 && !response.includes('**')) {
        // Could add more details, but keeping it simple for now
      }
    }
    
    return response;
  }

  /**
   * Add insights based on conversation memory
   */
  addMemoryBasedInsights(response, context, category) {
    if (!context.conversationMemory || context.conversationMemory.length === 0) {
      return response;
    }
    
    // Find related memories
    const relatedMemories = context.conversationMemory
      .filter(m => m.topic === category || m.entities?.includes(category))
      .slice(0, 2);
    
    if (relatedMemories.length > 0 && Math.random() > 0.6) {
      const memory = relatedMemories[0];
      if (memory.importance > 0.5) {
        // Add subtle reference to previous conversation
        const insights = [
          '\n\n💭 Based on our earlier conversation, I thought you might find this relevant!',
          '\n\n🔗 This relates to what we discussed earlier.',
          '\n\n✨ Building on what you mentioned before...'
        ];
        if (Math.random() > 0.7) {
          response += insights[Math.floor(Math.random() * insights.length)];
        }
      }
    }
    
    return response;
  }

  /**
   * Add sentiment-aware closing to responses with advanced personalization
   */
  addSentimentAwareClosing(response, context) {
    const sentimentHistory = context.sentimentHistory || [];
    const recentSentiment = sentimentHistory.length > 0 ? sentimentHistory[sentimentHistory.length - 1] : null;
    
    if (context.userMood === 'positive') {
      const intensity = recentSentiment?.intensity || 0.5;
      if (intensity > 0.7) {
        const closings = ['\n\nGlad I could help! 😊', '\n\nHappy to assist! ✨', '\n\nAnytime! 😄', '\n\nYou\'re very welcome! 🎉'];
        response += closings[Math.floor(Math.random() * closings.length)];
      } else if (Math.random() > 0.7) {
        const closings = ['\n\nGlad I could help! 😊', '\n\nHappy to assist! ✨'];
        response += closings[Math.floor(Math.random() * closings.length)];
      }
    } else if (context.userMood === 'negative') {
      if (!response.includes('help') && !response.includes('assist') && !response.includes('clarify')) {
        response += '\n\nI\'m here to help clarify anything. Feel free to ask more questions!';
      }
    } else if (context.userMood === 'neutral' && context.needsClarification) {
      response += '\n\nDoes this help clarify things? Let me know if you need more details!';
      context.needsClarification = false;
    }
    
    // Personalize based on user profile
    if (context.userProfile?.communicationStyle === 'concise') {
      // Keep closings short
      if (response.length > 200 && response.includes('\n\n')) {
        const parts = response.split('\n\n');
        if (parts.length > 1) {
          response = parts[0] + '\n\n' + parts[parts.length - 1];
        }
      }
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

  generateIntelligentSuggestions() {
    const mentioned = this.context.mentionedTopics;
    const suggestions = [];
    const preferences = this.context.userPreferences || {};
    
    // Algorithm: Suggest based on topic relationships
    const topicRelations = {
      'services': ['projects', 'skills', 'contact'],
      'projects': ['services', 'skills', 'experience'],
      'skills': ['projects', 'experience', 'services'],
      'contact': ['services', 'pricing'],
      'pricing': ['contact', 'services'],
      'experience': ['projects', 'skills']
    };
    
    // Find most mentioned topic
    let topTopic = null;
    let maxMentions = 0;
    Object.entries(preferences).forEach(([topic, count]) => {
      if (count > maxMentions) {
        maxMentions = count;
        topTopic = topic;
      }
    });
    
    // Suggest related topics
    if (topTopic && topicRelations[topTopic]) {
      topicRelations[topTopic].forEach(relatedTopic => {
        if (!mentioned.includes(relatedTopic) && !suggestions.find(s => s.includes(relatedTopic))) {
          const topicNames = {
            'projects': 'projects',
            'services': 'services',
            'skills': 'skills and technologies',
            'contact': 'contact information',
            'pricing': 'pricing details',
            'experience': 'experience and background'
          };
          suggestions.push(`💡 Interested in **${topicNames[relatedTopic] || relatedTopic}**? I can tell you more!`);
        }
      });
    }
    
    // Suggest based on conversation flow
    if (this.context.conversationFlow.length >= 3) {
      const recentTopics = this.context.conversationFlow
        .slice(-3)
        .map(f => f.topic)
        .filter(t => t && t !== 'general');
      
      if (recentTopics.length > 0 && !mentioned.includes('contact')) {
        suggestions.push("📧 Ready to connect? Ask about **contact** information!");
      }
    }
    
    // Suggest based on sentiment
    if (this.context.userMood === 'positive' && mentioned.length > 0) {
      suggestions.push("🚀 Want to explore more? I can guide you through the **projects** or **services**!");
    }
    
    return suggestions.length > 0 ? suggestions.slice(0, 2).join(' ') : null;
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
        </div>
      `;
    } else {
      messageEl.innerHTML = `
        <div class="ai-assistant-message-content">
          <div class="ai-assistant-message-text">${this.escapeHtml(text)}</div>
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

  formatMessage(text) {
    // Convert markdown-like formatting to HTML
    return this.escapeHtml(text)
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/•/g, '<span class="ai-assistant-bullet">•</span>')
      .replace(/#(\w+)/g, '<span class="ai-assistant-hashtag">#$1</span>');
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

  /**
   * Save conversation to cloud (Netlify Blobs)
   */
  async saveConversationToCloud(message, response, context) {
    try {
      const payload = {
        sessionId: this.sessionId,
        message: message,
        response: response,
        context: {
          lastTopic: context.lastTopic,
          mentionedTopics: context.mentionedTopics,
          userMood: context.userMood,
          lastIntent: context.lastIntent,
          intentConfidence: context.intentConfidence,
          userProfile: {
            expertise: context.userProfile?.expertise,
            communicationStyle: context.userProfile?.communicationStyle
          }
        },
        metadata: {
          timestamp: Date.now(),
          visitCount: context.visitCount
        }
      };

      const response_api = await fetch(`${this.apiBaseUrl}/.netlify/functions/api/conversations/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response_api.ok) {
        console.warn('[Nova] Failed to save conversation to cloud');
      } else {
        const data = await response_api.json();
        log('[Nova] Conversation saved to cloud:', data.conversationId);
      }
    } catch (error) {
      console.warn('[Nova] Error saving conversation:', error);
      // Fail silently - don't interrupt user experience
    }
  }

  /**
   * Load conversations from cloud
   */
  async loadConversationsFromCloud() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/.netlify/functions/api/conversations/load?sessionId=${this.sessionId}`);
      
      if (!response.ok) {
        console.warn('[Nova] Failed to load conversations from cloud');
        return;
      }

      const data = await response.json();
      
      if (data.conversations && data.conversations.length > 0) {
        // Restore conversation context from cloud
        const lastConversation = data.conversations[0];
        if (lastConversation.context) {
          // Merge cloud context with local context
          this.context.lastTopic = lastConversation.context.lastTopic || this.context.lastTopic;
          this.context.mentionedTopics = [
            ...new Set([...this.context.mentionedTopics, ...(lastConversation.context.mentionedTopics || [])])
          ];
          
          // Update user profile if available
          if (lastConversation.context.userProfile) {
            Object.assign(this.context.userProfile, lastConversation.context.userProfile);
          }
        }
        
        log(`[Nova] Loaded ${data.conversations.length} conversations from cloud`);
      }
    } catch (error) {
      console.warn('[Nova] Error loading conversations:', error);
      // Fail silently - continue with local context
    }
  }

  /**
   * Load global analytics to improve responses
   */
  async loadGlobalAnalytics() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/.netlify/functions/api/conversations/analytics`);
      
      if (!response.ok) {
        return;
      }

      const analytics = await response.json();
      this.context.globalAnalytics = analytics;
      
      // Use global analytics to improve response selection
      if (analytics.topTopics && analytics.topTopics.length > 0) {
        // Boost topics that are popular globally
        analytics.topTopics.forEach(({ topic, count }) => {
          if (!this.context.attentionWeights[topic]) {
            this.context.attentionWeights[topic] = Math.log(count + 1) * 0.5;
          }
        });
      }
      
      log('[Nova] Loaded global analytics for improved responses');
    } catch (error) {
      console.warn('[Nova] Error loading analytics:', error);
      // Fail silently
    }
  }

  /**
   * Enhanced response generation with global learning
   */
  generateResponseWithGlobalLearning(message) {
    const response = this.generateResponse(message);
    
    // Enhance with global analytics if available
    if (this.context.globalAnalytics) {
      const analytics = this.context.globalAnalytics;
      
      // If user asks about a popular topic, provide more detail
      const currentTopic = this.detectTopic(message);
      const popularTopic = analytics.topTopics?.find(t => t.topic === currentTopic);
      
      if (popularTopic && popularTopic.count > 10) {
        // This is a frequently asked topic - ensure comprehensive response
        if (response.length < 200) {
          // Add more detail for popular topics
          const enhancements = {
            services: '\n\n💡 This is one of our most asked-about topics! Many visitors find our services helpful.',
            projects: '\n\n🚀 Projects are a popular topic! Check out our detailed case studies for more insights.',
            contact: '\n\n📧 Many visitors reach out - we typically respond within 24 hours!'
          };
          
          if (enhancements[currentTopic]) {
            return response + enhancements[currentTopic];
          }
        }
      }
    }
    
    return response;
  }
}

let assistantInstance = null;

export function initAssistant() {
  if (assistantInstance) return;
  assistantInstance = new AIAssistant();
  log('[assistant] Initialized successfully with advanced features');
}
