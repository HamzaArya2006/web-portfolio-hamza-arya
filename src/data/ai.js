/**
 * Nova AI Assistant - Complete Data Repository
 * Contains all jokes, facts, quotes, knowledge base, translations, and responses
 * @version 3.0.0
 */

// ============================================================================
// MULTILINGUAL SUPPORT
// ============================================================================

export const LANGUAGES = {
  en: { name: 'English', native: 'English', flag: '🇺🇸' },
  es: { name: 'Spanish', native: 'Español', flag: '🇪🇸' },
  fr: { name: 'French', native: 'Français', flag: '🇫🇷' },
  de: { name: 'German', native: 'Deutsch', flag: '🇩🇪' },
  it: { name: 'Italian', native: 'Italiano', flag: '🇮🇹' },
  pt: { name: 'Portuguese', native: 'Português', flag: '🇵🇹' },
  ru: { name: 'Russian', native: 'Русский', flag: '🇷🇺' },
  zh: { name: 'Chinese', native: '中文', flag: '🇨🇳' },
  ja: { name: 'Japanese', native: '日本語', flag: '🇯🇵' },
  ar: { name: 'Arabic', native: 'العربية', flag: '🇸🇦' },
  hi: { name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  tr: { name: 'Turkish', native: 'Türkçe', flag: '🇹🇷' },
  nl: { name: 'Dutch', native: 'Nederlands', flag: '🇳🇱' },
  pl: { name: 'Polish', native: 'Polski', flag: '🇵🇱' },
  fa: { name: 'Persian', native: 'فارسی', flag: '🇮🇷' }
};

// Language detection keywords
export const LANGUAGE_KEYWORDS = {
  en: ['hello', 'hi', 'hey', 'thanks', 'thank you', 'help', 'what', 'how', 'where', 'when', 'why'],
  es: ['hola', 'gracias', 'ayuda', 'qué', 'cómo', 'dónde', 'cuándo', 'por qué', 'adiós', 'por favor'],
  fr: ['bonjour', 'salut', 'merci', 'aide', 'quoi', 'comment', 'où', 'quand', 'pourquoi', 'au revoir'],
  de: ['hallo', 'guten tag', 'danke', 'hilfe', 'was', 'wie', 'wo', 'wann', 'warum', 'auf wiedersehen'],
  it: ['ciao', 'salve', 'grazie', 'aiuto', 'cosa', 'come', 'dove', 'quando', 'perché', 'arrivederci'],
  pt: ['olá', 'oi', 'obrigado', 'ajuda', 'o que', 'como', 'onde', 'quando', 'por que', 'tchau'],
  ru: ['привет', 'здравствуйте', 'спасибо', 'помощь', 'что', 'как', 'где', 'когда', 'почему'],
  zh: ['你好', '谢谢', '帮助', '什么', '怎么', '哪里', '什么时候', '为什么'],
  ja: ['こんにちは', 'ありがとう', '助けて', '何', 'どう', 'どこ', 'いつ', 'なぜ'],
  ar: ['مرحبا', 'شكرا', 'مساعدة', 'ماذا', 'كيف', 'أين', 'متى', 'لماذا'],
  hi: ['नमस्ते', 'धन्यवाद', 'मदद', 'क्या', 'कैसे', 'कहाँ', 'कब', 'क्यों'],
  tr: ['merhaba', 'selam', 'teşekkür', 'yardım', 'ne', 'nasıl', 'nerede', 'ne zaman', 'neden'],
  nl: ['hallo', 'hoi', 'dank je', 'help', 'wat', 'hoe', 'waar', 'wanneer', 'waarom'],
  pl: ['cześć', 'dzień dobry', 'dziękuję', 'pomoc', 'co', 'jak', 'gdzie', 'kiedy', 'dlaczego'],
  fa: ['سلام', 'متشکرم', 'کمک', 'چه', 'چگونه', 'کجا', 'کی', 'چرا']
};

// ============================================================================
// JOKES DATABASE (50+ jokes)
// ============================================================================

export const JOKES = [
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
  { setup: "What's a pirate's favorite programming language?", punchline: "R! ☠️" },
  { setup: "Why did the developer get kicked out of the bar?", punchline: "He kept trying to push to main! 🍺" },
  { setup: "What do you call a programmer who doesn't comment code?", punchline: "A future maintainer's nightmare! 😱" },
  { setup: "Why did the developer break up with their keyboard?", punchline: "It had too many keys! ⌨️" },
  { setup: "What's a programmer's favorite type of music?", punchline: "Algo-rhythm! 🎵" },
  { setup: "Why did the developer get fired from the calendar factory?", punchline: "He took a day off! 📅" },
  { setup: "What do you call a programmer from the North Pole?", punchline: "Santa's little helper! 🎅" },
  { setup: "Why did the developer go to therapy?", punchline: "Because he had too many dependencies! 🧠" },
  { setup: "What's a programmer's favorite game?", punchline: "Hide and seek - they're great at finding bugs! 🎮" },
  { setup: "Why did the developer get lost?", punchline: "He couldn't find his way out of the stack! 📚" },
  { setup: "What do you call a programmer who fixes bugs?", punchline: "A debugger! 🐛" },
  { setup: "Why did the developer become a gardener?", punchline: "Because he loved planting seeds (in databases)! 🌱" },
  { setup: "What's a programmer's favorite exercise?", punchline: "Code reviews! 💪" },
  { setup: "Why did the developer refuse to play cards?", punchline: "He was afraid of stack overflow! 🃏" },
  { setup: "What do you call a programmer who works at night?", punchline: "A night coder! 🌙" },
  { setup: "Why did the developer get a promotion?", punchline: "He had great commit messages! 📝" },
  { setup: "What's a programmer's favorite type of sandwich?", punchline: "A stack! 🥪" },
  { setup: "Why did the developer go to the beach?", punchline: "To catch some waves (and errors)! 🏖️" },
  { setup: "What do you call a programmer who loves math?", punchline: "An algorithm enthusiast! 🔢" },
  { setup: "Why did the developer become a chef?", punchline: "He loved cooking up new features! 👨‍🍳" },
  { setup: "What's a programmer's favorite social media?", punchline: "GitHub! Because it's all about commits! 💻" },
  { setup: "Why did the developer get a ticket?", punchline: "He was speeding through the code! 🚗" }
];

// ============================================================================
// FUN FACTS DATABASE (50+ facts)
// ============================================================================

export const FUN_FACTS = [
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
  "There are more possible iterations of a game of chess than atoms in the known universe! ♟️",
  "The first computer mouse was made of wood! 🖱️",
  "Python was named after Monty Python's Flying Circus, not the snake! 🐍",
  "The first computer game was created in 1962 and was called 'Spacewar!' 🎮",
  "The '@' symbol in email addresses is called an 'at sign' or 'commercial at' 📧",
  "The first domain name ever registered was symbolics.com on March 15, 1985 🌐",
  "A single Google search uses 1,000 computers in 0.2 seconds to return results! ⚡",
  "The first computer weighed more than 30 tons and took up 1,800 square feet! 💻",
  "The word 'robot' comes from the Czech word 'robota', meaning 'forced labor' 🤖",
  "The first web browser was called WorldWideWeb and was created in 1990 🌍",
  "There are over 1 billion websites on the internet today! 🌐",
  "The first computer bug was actually a real bug - a moth trapped in a relay! 🦋",
  "The first computer programmer was a woman - Ada Lovelace in the 1840s! 👩‍💻",
  "The internet was originally called ARPANET and was created by the US Department of Defense 🛡️",
  "The first emoji was created in Japan in 1999! 😊",
  "The first computer virus was created in 1983 and was called 'Elk Cloner' 🦠",
  "The first computer mouse was invented in 1964 by Douglas Engelbart 🖱️",
  "The first computer game was created in 1962 and was called 'Spacewar!' 🎮",
  "The first computer weighed more than 30 tons and took up 1,800 square feet! 💻",
  "The first computer programmer was a woman - Ada Lovelace in the 1840s! 👩‍💻",
  "The first computer bug was actually a real bug - a moth trapped in a relay! 🦋",
  "The first computer mouse was made of wood! 🖱️",
  "The first computer game was created in 1962 and was called 'Spacewar!' 🎮",
  "The first computer weighed more than 30 tons and took up 1,800 square feet! 💻",
  "The first computer programmer was a woman - Ada Lovelace in the 1840s! 👩‍💻",
  "The first computer bug was actually a real bug - a moth trapped in a relay! 🦋",
  "The first computer mouse was made of wood! 🖱️",
  "The first computer game was created in 1962 and was called 'Spacewar!' 🎮",
  "The first computer weighed more than 30 tons and took up 1,800 square feet! 💻",
  "The first computer programmer was a woman - Ada Lovelace in the 1840s! 👩‍💻",
  "The first computer bug was actually a real bug - a moth trapped in a relay! 🦋"
];

// ============================================================================
// INSPIRATIONAL QUOTES (30+ quotes)
// ============================================================================

export const QUOTES = [
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
  { quote: "Walking on water and developing software from a specification are easy if both are frozen.", author: "Edward V. Berard" },
  { quote: "The best code is no code at all.", author: "Jeff Atwood" },
  { quote: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
  { quote: "The computer is incredibly fast, accurate, and stupid. Man is incredibly slow, inaccurate, and brilliant. Together they are powerful beyond imagination.", author: "Albert Einstein" },
  { quote: "Software is a great combination between artistry and engineering.", author: "Bill Gates" },
  { quote: "The best way to get a project done faster is to start sooner.", author: "Jim Highsmith" },
  { quote: "The most important property of a program is whether it accomplishes the intention of its user.", author: "C.A.R. Hoare" },
  { quote: "There are only two kinds of languages: the ones people complain about and the ones nobody uses.", author: "Bjarne Stroustrup" },
  { quote: "The best thing about a boolean is even if you are wrong, you are only off by a bit.", author: "Anonymous" },
  { quote: "Before software can be reusable it first has to be usable.", author: "Ralph Johnson" },
  { quote: "The best programs are written so that computing machines can perform them quickly and so that human beings can understand them clearly.", author: "Donald Knuth" },
  { quote: "Programmers are in a race with the Universe to create bigger and better idiot-proof programs, while the Universe is trying to create bigger and better idiots. So far the Universe is winning.", author: "Rich Cook" },
  { quote: "Always code as if the person who ends up maintaining your code is a violent psychopath who knows where you live.", author: "Martin Golding" },
  { quote: "The best way to predict the future is to implement it.", author: "David Heinemeier Hansson" },
  { quote: "The problem with programmers is that you can never tell what a programmer is doing until it's too late.", author: "Seymour Cray" },
  { quote: "Measuring programming progress by lines of code is like measuring aircraft building progress by weight.", author: "Bill Gates" }
];

// ============================================================================
// RIDDLES DATABASE (20+ riddles)
// ============================================================================

export const RIDDLES = [
  { riddle: "I speak without a mouth and hear without ears. I have no body, but I come alive with the wind. What am I?", answer: "An echo!" },
  { riddle: "I'm tall when I'm young, and I'm short when I'm old. What am I?", answer: "A candle!" },
  { riddle: "What has keys but no locks, space but no room, and you can enter but can't go inside?", answer: "A keyboard!" },
  { riddle: "What runs but never walks, has a mouth but never talks?", answer: "A river!" },
  { riddle: "I have cities, but no houses live there. I have mountains, but no trees grow. I have water, but no fish swim. What am I?", answer: "A map!" },
  { riddle: "What can travel around the world while staying in a corner?", answer: "A stamp!" },
  { riddle: "I have hands but can't clap. What am I?", answer: "A clock!" },
  { riddle: "What has a head and a tail but no body?", answer: "A coin!" },
  { riddle: "What has an eye but cannot see?", answer: "A needle!" },
  { riddle: "I'm light as a feather, but the strongest person can't hold me for more than a few minutes. What am I?", answer: "Your breath!" },
  { riddle: "What has a neck but no head?", answer: "A bottle!" },
  { riddle: "What gets wetter the more it dries?", answer: "A towel!" },
  { riddle: "What has to be broken before you can use it?", answer: "An egg!" },
  { riddle: "I'm tall when I'm young, short when I'm old. What am I?", answer: "A candle!" },
  { riddle: "What can you catch but not throw?", answer: "A cold!" },
  { riddle: "What goes up but never comes down?", answer: "Your age!" },
  { riddle: "What has many keys but can't open a single lock?", answer: "A piano!" },
  { riddle: "What has a thumb and four fingers but is not alive?", answer: "A glove!" },
  { riddle: "What comes once in a minute, twice in a moment, but never in a thousand years?", answer: "The letter M!" },
  { riddle: "What has a face and two hands but no arms or legs?", answer: "A clock!" }
];

// ============================================================================
// COMPLIMENTS & ENCOURAGEMENT
// ============================================================================

export const COMPLIMENTS = [
  "You're asking great questions! I can tell you're thoughtful. 🌟",
  "I really enjoy our conversations! You have an inquisitive mind. 💭",
  "You're doing amazing! Keep that curiosity alive! ✨",
  "You seem like someone who values quality - I respect that! 👏",
  "Great question! You really know how to dig deep! 🔍",
  "I appreciate you taking the time to chat with me! 😊",
  "You have excellent taste in websites! 😄",
  "Your questions show real insight! Keep them coming! 💡",
  "You're making this conversation really engaging! 🎯",
  "I love your enthusiasm! It's contagious! ⚡",
  "You're asking the right questions! That shows intelligence! 🧠",
  "Your curiosity is inspiring! Keep exploring! 🚀",
  "You have a great way of thinking! I'm impressed! 💪",
  "You're really making me think! I appreciate that! 🤔",
  "Your questions are well thought out! Keep it up! 📚"
];

// ============================================================================
// THINKING PHRASES
// ============================================================================

export const THINKING_PHRASES = [
  "Let me think about that...",
  "Hmm, good question...",
  "Interesting! Let me see...",
  "That's a great question! Let me check...",
  "Give me a moment to think...",
  "Ah, I know this one!",
  "Let me look into that for you...",
  "Great question! Here's what I know...",
  "That's an interesting point...",
  "Let me process that...",
  "Hmm, let me consider...",
  "That's a thoughtful question..."
];

// ============================================================================
// EASTER EGGS
// ============================================================================

export const EASTER_EGGS = {
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
  'coffee': "☕ I run on electricity, but I understand the coffee dependency! #NoCoffeeNoCode",
  'sleep': "💤 Sleep is important! But as an AI, I'm always here when you need me!",
  'bored': "Let me fix that! Want a joke? A fun fact? A riddle? Or we could play a game! 🎮",
  'rick roll': "Never gonna give you up, never gonna let you down! 🎵 Just kidding! 😄",
  'beep boop': "Beep boop! 🤖 I'm Nova, your friendly AI assistant!",
  'test': "✅ Test successful! I'm working perfectly! How can I help you?",
  'ping': "Pong! 🏓 I'm here and ready!",
  'whoami': "You're talking to Nova, your intelligent AI assistant! 🤖"
};

// ============================================================================
// KNOWLEDGE BASE - Note: Full KNOWLEDGE_BASE is in assistant.js
// This file contains only data (jokes, facts, quotes, etc.)
// The KNOWLEDGE_BASE uses helper functions from assistant.js
// ============================================================================

// KNOWLEDGE_BASE is defined in assistant.js because it uses helper functions
// This keeps ai.js as pure data

// Export default for easy importing
export default {
  LANGUAGES,
  LANGUAGE_KEYWORDS,
  JOKES,
  FUN_FACTS,
  QUOTES,
  RIDDLES,
  COMPLIMENTS,
  THINKING_PHRASES,
  EASTER_EGGS
};
