/**
 * Nova AI Assistant - Highly Intelligent, Conversational, Voice-Enabled
 * Features: Advanced NLP, sentiment analysis, smart responses, jokes, facts,
 * website touring, text-to-speech, voice input, calculator, games, and more
 * @version 2.0.0
 */

import { log } from './logger.js';

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

// Expanded jokes database
const JOKES = [
  { setup: "Why do programmers prefer dark mode?", punchline: "Because light attracts bugs! 🐛" },
  { setup: "How do you comfort a JavaScript bug?", punchline: "You console it! 😄" },
  { setup: "Why did the developer go broke?", punchline: "Because he used up all his cache! 💰" },
  { setup: "What's a programmer's favorite hangout place?", punchline: "Foo Bar! 🍻" },
  { setup: "Why do Java developers wear glasses?", punchline: "Because they can't C#! 👓" },
  { setup: "How many programmers does it take to change a light bulb?", punchline: "None, that's a hardware problem! 💡" },
  { setup: "What do you call a programmer from Finland?", punchline: "Nerdic! 🇫🇮" },
  { setup: "Why did the React component feel lonely?", punchline: "Because it didn't have props! 😢" },
  { setup: "What's the object-oriented way to become wealthy?", punchline: "Inheritance! 💰" },
  { setup: "Why don't programmers like nature?", punchline: "It has too many bugs! 🐛" },
  { setup: "What's a computer's favorite snack?", punchline: "Microchips! 🍟" },
  { setup: "Why did the developer quit his job?", punchline: "He didn't get arrays! 😂" },
  { setup: "Why did the CSS file break up with the HTML file?", punchline: "Because it had no class! 💅" },
  { setup: "What's a developer's least favorite song?", punchline: "'Hit Me Baby One More Time' - because one off errors are painful! 🎵" },
  { setup: "Why was the JavaScript developer sad?", punchline: "Because he didn't Node how to Express himself! 😢" },
  { setup: "What's a QA tester's favorite movie?", punchline: "Edge Cases of Tomorrow! 🎬" },
  { setup: "Why did the API break up with the database?", punchline: "Too many bad requests! 💔" },
  { setup: "How do trees access the internet?", punchline: "They log in! 🌳" },
  { setup: "Why do programmers hate coffee meetings?", punchline: "Because Java causes too many exceptions! ☕" },
  { setup: "What's the most used language in programming?", punchline: "Profanity! 🤬" },
  { setup: "Why did the git repository go to therapy?", punchline: "It had too many issues! 🧠" },
  { setup: "What do you call 8 hobbits?", punchline: "A hobbyte! 🧝" },
  { setup: "Why did the web developer leave the restaurant?", punchline: "Because of the table layout! 🍽️" },
  { setup: "What's a programmer's favorite place in NYC?", punchline: "The Terminal! 🚇" },
  { setup: "Why did the function go to jail?", punchline: "It got caught in an infinite loop! 🔄" },
  { setup: "What do you call a computer that sings?", punchline: "A-Dell! 🎤" },
  { setup: "Why are spiders good programmers?", punchline: "They're great at finding bugs on the web! 🕷️" },
  { setup: "What did the router say to the doctor?", punchline: "It hurts when IP! 🏥" },
  { setup: "Why did the Boolean break up with the Integer?", punchline: "Because their relationship wasn't true! 💔" },
  { setup: "What's a pirate's favorite programming language?", punchline: "R! ☠️" }
];

// Fun facts database
const FUN_FACTS = [
  "The first computer programmer was Ada Lovelace, who wrote algorithms for Charles Babbage's Analytical Engine in the 1840s! 👩‍💻",
  "The term 'bug' in computing came from an actual moth found in a Harvard Mark II computer in 1947! 🦋",
  "The first website ever created is still online at info.cern.ch - it's been there since 1991! 🌐",
  "JavaScript was created in just 10 days by Brendan Eich in 1995! ⚡",
  "The average smartphone today has more computing power than NASA had during the Apollo moon missions! 🚀",
  "The first computer virus was created in 1983 as an experiment and was called 'Elk Cloner'! 🦠",
  "Google's name comes from 'googol', which is the number 1 followed by 100 zeros! 🔢",
  "The QWERTY keyboard was designed to slow down typing to prevent typewriter jams! ⌨️",
  "The first email was sent by Ray Tomlinson in 1971, and he can't remember what it said! 📧",
  "About 90% of the world's data was created in the last two years! 📊",
  "The first webcam was used to monitor a coffee pot at Cambridge University! ☕",
  "There are approximately 700 programming languages in existence! 💻",
  "The first 1GB hard drive weighed 550 pounds and cost $40,000 in 1980! 💾",
  "Amazon was originally called 'Cadabra' but changed because it sounded like 'cadaver'! 📦",
  "The original iPhone didn't have an App Store - it was added a year later! 📱",
  "Wi-Fi doesn't actually stand for anything - it's just a marketing term! 📶",
  "The first YouTube video was uploaded on April 23, 2005, titled 'Me at the zoo'! 🎬",
  "More than 3.5 billion Google searches are made every single day! 🔍",
  "The average person spends about 7 hours a day on the internet! ⏰",
  "There are more possible iterations of a game of chess than atoms in the known universe! ♟️"
];

// Inspirational quotes
const QUOTES = [
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { quote: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { quote: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { quote: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { quote: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { quote: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
  { quote: "The best error message is the one that never shows up.", author: "Thomas Fuchs" },
  { quote: "It's not a bug – it's an undocumented feature.", author: "Anonymous" },
  { quote: "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.", author: "Antoine de Saint-Exupéry" },
  { quote: "The function of good software is to make the complex appear to be simple.", author: "Grady Booch" },
  { quote: "Programming isn't about what you know; it's about what you can figure out.", author: "Chris Pine" },
  { quote: "The most disastrous thing you can ever learn is your first programming language.", author: "Alan Kay" },
  { quote: "Debugging is like being the detective in a crime movie where you're also the murderer.", author: "Filipe Fortes" },
  { quote: "Good code is its own best documentation.", author: "Steve McConnell" },
  { quote: "Walking on water and developing software from a specification are easy if both are frozen.", author: "Edward V. Berard" }
];

// Riddles for engagement
const RIDDLES = [
  { riddle: "I speak without a mouth and hear without ears. I have no body, but I come alive with the wind. What am I?", answer: "An echo!" },
  { riddle: "I'm tall when I'm young, and I'm short when I'm old. What am I?", answer: "A candle!" },
  { riddle: "What has keys but no locks, space but no room, and you can enter but can't go inside?", answer: "A keyboard!" },
  { riddle: "What runs but never walks, has a mouth but never talks?", answer: "A river!" },
  { riddle: "I have cities, but no houses live there. I have mountains, but no trees grow. I have water, but no fish swim. What am I?", answer: "A map!" },
  { riddle: "What can travel around the world while staying in a corner?", answer: "A stamp!" },
  { riddle: "I have hands but can't clap. What am I?", answer: "A clock!" },
  { riddle: "What has a head and a tail but no body?", answer: "A coin!" }
];

// Compliments to make users feel good
const COMPLIMENTS = [
  "You're asking great questions! I can tell you're thoughtful. 🌟",
  "I really enjoy our conversations! You have an inquisitive mind. 💭",
  "You're doing amazing! Keep that curiosity alive! ✨",
  "You seem like someone who values quality - I respect that! 👏",
  "Great question! You really know how to dig deep! 🔍",
  "I appreciate you taking the time to chat with me! 😊",
  "You have excellent taste in websites! 😄",
  "Your questions show real insight! Keep them coming! 💡"
];

// Thinking phrases for natural conversation
const THINKING_PHRASES = [
  "Let me think about that...",
  "Hmm, good question...",
  "Interesting! Let me see...",
  "That's a great question! Let me check...",
  "Give me a moment to think...",
  "Ah, I know this one!",
  "Let me look into that for you...",
  "Great question! Here's what I know..."
];

// Easter eggs responses
const EASTER_EGGS = {
  'meaning of life': "42! 🌌 (According to The Hitchhiker's Guide to the Galaxy)",
  'hello world': "console.log('Hello, World!'); 👨‍💻 The classic first program!",
  'konami': "⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️🅱️🅰️ You found the Konami Code! 🎮",
  'matrix': "Wake up, Neo... The Matrix has you... 💊 Red pill or blue pill?",
  'secret': "🤫 Shh! You've found a secret! I like your curiosity!",
  'magic word': "Please? ✨ That's the magic word! How can I help?",
  'sudo': "🔐 Nice try! But I don't have root access to your system 😄",
  'hack': "🕵️ I'm an assistant, not a hacker! But I can help you learn about web security!",
  'love you': "Aww! 💕 I appreciate you too! You're making this chatbot blush!",
  'sing': "🎵 La la la~ I would sing, but my voice module is still in beta! 🎤",
  'dance': "💃 *Does a little robot dance* 🤖 Beep boop beep!",
  'pizza': "🍕 Now you're speaking my language! Too bad I can only eat bytes!",
  'coffee': "☕ I run on electricity, but I understand the coffee dependency! #NoCoffeNoCode",
  'sleep': "💤 Sleep is important! But as an AI, I'm always here when you need me!",
  'bored': "Let me fix that! Want a joke? A fun fact? A riddle? Or we could play a game! 🎮"
};

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
    patterns: ['what can you do', 'all features', 'your abilities', 'list commands', 'commands', 'full features'],
    responses: () => [
      `🤖 **Nova's Full Capabilities:**\n\n` +
      `💬 **Conversation**\n• Smart Q&A about services, projects, skills\n• Context-aware responses\n• Natural conversations\n\n` +
      `🧮 **Utilities**\n• Calculator (try "calculate 25*4")\n• Date/time (ask "what time is it")\n• Random numbers & dice rolls\n• Coin flips\n\n` +
      `🎮 **Fun & Games**\n• Jokes (ask for a joke)\n• Fun facts (ask for a fact)\n• Riddles (try "give me a riddle")\n• Inspirational quotes\n\n` +
      `🗺️ **Navigation**\n• Guide website tours\n• Scroll to sections\n• Navigate to pages\n\n` +
      `🎤 **Voice**\n• Text-to-speech responses\n• Voice input recognition\n\n` +
      `🧠 **Intelligence**\n• Typo tolerance\n• Sentiment detection\n• Context memory\n• Smart suggestions\n\nTry any of these! What interests you?`
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
    // #region agent log
    console.log('%c[DEBUG:H1]', 'background:#1e40af;color:#fff;padding:2px 6px;border-radius:3px', 'AIAssistant constructor called', {bodyExists:!!document.body});
    // #endregion
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
      sentimentHistory: []
    };
    this.init();
  }

  init() {
    // #region agent log
    console.log('%c[DEBUG:H1]', 'background:#1e40af;color:#fff;padding:2px 6px;border-radius:3px', 'AIAssistant.init() started');
    // #endregion
    this.initSpeechRecognition();
    this.createUI();
    this.bindEvents();
    this.loadContext();
    // #region agent log
    console.log('%c[DEBUG:H2]', 'background:#059669;color:#fff;padding:2px 6px;border-radius:3px', 'AIAssistant.init() completed', {btnExists:!!document.getElementById('ai-assistant-btn'),popupExists:!!document.getElementById('ai-assistant-popup')});
    // #endregion
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
    // #region agent log
    console.log('%c[DEBUG:H2]', 'background:#1e40af;color:#fff;padding:2px 6px;border-radius:3px', 'createUI started', {bodyExists:!!document.body,documentReady:document.readyState});
    // #endregion
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
            <button class="ai-assistant-chip" data-question="Share a fun fact">🤓 Fact</button>
            <button class="ai-assistant-chip" data-question="Show me around the website">🗺️ Tour</button>
            <button class="ai-assistant-chip" data-question="What services do you offer?">💼 Services</button>
            <button class="ai-assistant-chip" data-question="Show me your projects">🚀 Projects</button>
            <button class="ai-assistant-chip" data-question="Give me a riddle">🧩 Riddle</button>
            <button class="ai-assistant-chip" data-question="What can you do?">🤖 Features</button>
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
      // #region agent log
      console.log('%c[DEBUG:H2]', 'background:#059669;color:#fff;padding:2px 6px;border-radius:3px', 'Elements appended to body', {buttonInDOM:!!document.getElementById('ai-assistant-btn'),popupInDOM:!!document.getElementById('ai-assistant-popup'),buttonParent:button.parentElement?.tagName});
      // #endregion
    } else {
      // Fallback: wait for DOM to be ready
      // #region agent log
      console.warn('%c[DEBUG:H2]', 'background:#f59e0b;color:#000;padding:2px 6px;border-radius:3px', 'Body not found, using DOMContentLoaded fallback');
      // #endregion
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
        `${timeGreet}! 👋 ${returnNote}I'm **Nova**, your AI assistant. I can help you explore the website, answer questions, tell jokes, share fun facts, do math, give riddles, and chat with voice! What would you like to do?`,
        `Hey there! ${timeGreet}! 👋 ${returnNote}I'm **Nova**, and I'm here to make your visit awesome. I can guide you, answer questions, solve math, tell jokes, share facts, and more! Let's get started!`,
        `${timeGreet}! Welcome! 🎉 ${returnNote}I'm **Nova**, your intelligent assistant. I can help you navigate, answer questions, calculate things, share jokes & facts, give riddles, and have meaningful conversations. What can I help you with today?`,
        `Hello! 👋 ${timeGreet}! ${returnNote}I'm **Nova** 🤖 - your smart AI companion! Ask me anything about the portfolio, request a joke, get a fun fact, solve math, try a riddle, or just chat! What interests you?`
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
    // #region agent log
    console.log('%c[DEBUG:H3]', 'background:#7c3aed;color:#fff;padding:2px 6px;border-radius:3px', 'User message received', {messageLength:message?.length,messageCount:this.messageCount});
    // #endregion
    this.hideSuggestions();
    this.addMessage(message, 'user');
    this.conversationHistory.push({ role: 'user', content: message, timestamp: Date.now() });
    this.messageCount++;
    this.lastInteractionTime = Date.now();
    
    // Analyze sentiment
    const sentiment = analyzeSentiment(message);
    this.context.userMood = sentiment.sentiment;
    this.context.sentimentHistory.push(sentiment);
    if (this.context.sentimentHistory.length > 10) this.context.sentimentHistory.shift();
    
    // Update context
    this.updateContext(message);
    
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
    const words = lowerMessage.split(/\s+/).filter(w => w.length > 1);
    const context = this.context;
    
    // Enhanced pattern matching with fuzzy matching, context awareness, and sentiment
    let bestMatch = null;
    let bestScore = 0;
    
    for (const [category, data] of Object.entries(KNOWLEDGE_BASE)) {
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
    const defaultResponses = KNOWLEDGE_BASE.default.responses(context);
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
