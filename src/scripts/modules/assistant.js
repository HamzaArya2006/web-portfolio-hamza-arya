/**
 * Advanced AI Assistant - Intelligent, Conversational, Voice-Enabled
 * Features: Smart responses, jokes, website touring, text-to-speech, voice input
 */

import { log } from './logger.js';

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
    this.context = {
      lastSection: null,
      lastTopic: null,
      visitCount: 0,
      userPreferences: {},
      conversationFlow: [],
      mentionedTopics: [],
      userMood: 'neutral'
    };
    this.init();
  }

  init() {
    this.initSpeechRecognition();
    this.createUI();
    this.bindEvents();
    this.loadContext();
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

  handleUserMessage(message) {
    this.hideSuggestions();
    this.addMessage(message, 'user');
    this.conversationHistory.push({ role: 'user', content: message });
    
    // Update context
    this.updateContext(message);
    
    // Check for navigation commands
    if (this.handleNavigation(message)) {
      return;
    }
    
    // Show typing indicator
    this.showTypingIndicator();
    
    // Simulate thinking delay with variable timing for more natural feel
    const thinkingTime = this.calculateThinkingTime(message);
    
    setTimeout(() => {
      this.hideTypingIndicator();
      const response = this.generateResponse(message);
      this.addMessage(response, 'assistant', true);
      this.conversationHistory.push({ role: 'assistant', content: response });
      
      // Speak the response if voice is enabled
      if (this.voiceEnabled) {
        this.speak(response.replace(/[🎯🚀💼📧📍⏱️🌐📝🔗🎉💬🗺️📚🎤🎭😊👋💡🛒⚡☁️💾⚙️🎨📊🤖✨]/g, '').replace(/\n/g, ' '));
      }
    }, thinkingTime);
  }

  calculateThinkingTime(message) {
    // More complex questions get longer thinking time
    const length = message.length;
    const hasQuestion = message.includes('?');
    const complexity = (length > 50 ? 200 : 0) + (hasQuestion ? 300 : 0);
    return 400 + complexity + Math.random() * 300;
  }

  updateContext(message) {
    const lowerMsg = message.toLowerCase();
    
    // Track mentioned topics
    const topics = ['service', 'project', 'skill', 'contact', 'about', 'blog', 'price', 'experience'];
    topics.forEach(topic => {
      if (lowerMsg.includes(topic) && !this.context.mentionedTopics.includes(topic)) {
        this.context.mentionedTopics.push(topic);
      }
    });
    
    // Detect user mood
    if (lowerMsg.match(/\b(thanks|thank you|appreciate|great|awesome|love|amazing)\b/)) {
      this.context.userMood = 'positive';
    } else if (lowerMsg.match(/\b(help|confused|don't understand|problem|issue)\b/)) {
      this.context.userMood = 'needs_help';
    }
    
    // Track conversation flow
    this.context.conversationFlow.push({
      timestamp: Date.now(),
      message: message.substring(0, 50),
      topic: this.detectTopic(message)
    });
    
    // Keep only last 10 interactions
    if (this.context.conversationFlow.length > 10) {
      this.context.conversationFlow.shift();
    }
    
    this.saveContext();
  }

  detectTopic(message) {
    const lowerMsg = message.toLowerCase();
    for (const [category] of Object.entries(KNOWLEDGE_BASE)) {
      if (category !== 'default' && KNOWLEDGE_BASE[category].patterns.some(p => lowerMsg.includes(p))) {
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
    const context = this.context;
    
    // Enhanced pattern matching with context awareness and fuzzy matching
    let bestMatch = null;
    let bestScore = 0;
    
    for (const [category, data] of Object.entries(KNOWLEDGE_BASE)) {
      if (category === 'default') continue;
      
      let score = 0;
      const words = lowerMessage.split(/\s+/);
      
      // Calculate match score
      data.patterns.forEach(pattern => {
        const patternLower = pattern.toLowerCase();
        const patternWords = patternLower.split(/\s+/);
        
        // Exact phrase match (highest score)
        if (lowerMessage.includes(patternLower)) {
          score += 10;
        }
        
        // Word matches
        patternWords.forEach(pWord => {
          words.forEach(word => {
            if (word === pWord) score += 3;
            else if (word.includes(pWord) || pWord.includes(word)) score += 1;
          });
        });
      });
      
      // Boost score if topic was mentioned before
      if (this.context.mentionedTopics.includes(category)) {
        score += 2;
      }
      
      // Boost score if last topic matches
      if (this.context.lastTopic === category) {
        score += 1.5;
      }
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = { category, data };
      }
    }
    
    // Use best match if score is significant
    if (bestMatch && bestScore >= 3) {
      const responses = typeof bestMatch.data.responses === 'function' 
        ? bestMatch.data.responses(context) 
        : bestMatch.data.responses;
      
      let response = responses[Math.floor(Math.random() * responses.length)];
      
      // Add contextual follow-ups
      response = this.addContextualFollowUp(response, bestMatch.category, message);
      
      this.context.lastTopic = bestMatch.category;
      this.saveContext();
      return response;
    }
    
    // Default response with context-aware suggestions
    const defaultResponses = KNOWLEDGE_BASE.default.responses(context);
    let response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    
    // Add smart suggestions based on conversation history
    if (this.context.mentionedTopics.length > 0) {
      const suggestions = this.generateSmartSuggestions();
      if (suggestions) {
        response += `\n\n${suggestions}`;
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
    
    return suggestions.length > 0 ? suggestions.join(' ') : null;
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
}

let assistantInstance = null;

export function initAssistant() {
  if (assistantInstance) return;
  assistantInstance = new AIAssistant();
  log('[assistant] Initialized successfully with advanced features');
}
