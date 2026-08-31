import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export interface DBUser {
  _id: string;
  name: string;
  username: string;
  email: string;
  password: string; // hashed
  profileImage: string;
  bio: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface DBPost {
  _id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  category: string;
  tags: string[];
  author: string; // user ID
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface DBComment {
  _id: string;
  post: string; // post ID
  user: string; // user ID
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface DBSchema {
  users: DBUser[];
  posts: DBPost[];
  comments: DBComment[];
}

const DB_FILE = path.join(process.cwd(), 'database_store.json');

// Helper to generate IDs
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
};

// Initial Seed Data Builder
export function getInitialSeedData(): DBSchema {
  const adminId = 'usr_admin_1';
  const subiId = 'usr_subi_2';
  const alexId = 'usr_alex_3';
  const sarahId = 'usr_sarah_4';

  const defaultPasswordHash = bcrypt.hashSync('Password123!', 10);

  const users: DBUser[] = [
    {
      _id: adminId,
      name: 'Admin Subiksha',
      username: 'admin',
      email: 'admin@blogspace.com',
      password: defaultPasswordHash,
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      bio: 'Platform administrator and lead tech evangelist at BlogSpace.',
      role: 'ADMIN',
      createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
    },
    {
      _id: subiId,
      name: 'Subiksha S.',
      username: 'subi',
      email: 'subi@blogspace.com',
      password: defaultPasswordHash,
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      bio: 'Full-stack software engineer passionate about Web3, AI, and distributed systems.',
      role: 'USER',
      createdAt: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString(),
    },
    {
      _id: alexId,
      name: 'Alex Rivera',
      username: 'alexdev',
      email: 'alex@blogspace.com',
      password: defaultPasswordHash,
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      bio: 'Cloud Architect & Open Source enthusiast. Writing about DevOps, Docker, and Kubernetes.',
      role: 'USER',
      createdAt: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString(),
    },
    {
      _id: sarahId,
      name: 'Sarah Chen',
      username: 'sarahc',
      email: 'sarah@blogspace.com',
      password: defaultPasswordHash,
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      bio: 'UX Designer & Lifestyle Blogger exploring mindful productivity and sustainable travel.',
      role: 'USER',
      createdAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
    },
  ];

  const posts: DBPost[] = [
    {
      _id: 'post_1',
      title: 'How Artificial Intelligence is Changing Modern Education',
      description: 'Explore how generative AI and adaptive learning platforms are revolutionizing classrooms, curriculum design, and personal tutoring.',
      content: `Artificial Intelligence is fundamentally shifting the landscape of education across the globe. From personalized tutoring systems to automated administrative tasks for teachers, AI offers unprecedented tools for both educators and students.

### The Rise of Adaptive Learning
Adaptive learning technologies analyze student performance in real-time, tailoring lessons and exercises to individual pacing and comprehension levels. Instead of the traditional one-size-fits-all classroom model, each student receives custom learning pathways.

### Key Benefits:
1. **24/7 Personalized Tutoring**: Intelligent agents provide instant feedback and explanations.
2. **Automated Assessment**: Freeing teachers from manual grading allows them to focus on direct mentoring.
3. **Accessibility**: Language translation and speech-to-text features ensure global inclusivity for differently-abled learners.

### Ethical Considerations
As we integrate AI tools into schools, we must prioritize student data privacy, combat algorithmic bias, and ensure equal technological access for underrepresented communities.`,
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
      category: 'Technology',
      tags: ['AI', 'Education', 'EdTech', 'MachineLearning'],
      author: subiId,
      views: 342,
      createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
    },
    {
      _id: 'post_2',
      title: 'Mastering React 19: Actions, useOptimistic, and Server Components',
      description: 'A comprehensive deep-dive into the newest features of React 19 and how they simplify state management and asynchronous data workflows.',
      content: `React 19 brings some of the most anticipated improvements to the frontend ecosystem. In this guide, we break down what developers need to know about Actions, the useOptimistic hook, and unified compiler optimizations.

### What are React Actions?
Actions allow developers to handle form submissions and async transitions seamlessly. Instead of manually juggling \`isPending\` or \`loading\` states with \`useState\`, React manages pending states and error boundaries automatically.

\`\`\`jsx
async function updateName(name) {
  const error = await api.updateName(name);
  if (error) return error;
  redirect('/profile');
}
\`\`\`

### Why useOptimistic Matters
With \`useOptimistic\`, you can update UI immediately before server responses arrive, rolling back automatically if the API fails. This delivers lightning-fast responsiveness for user interactions like liking posts or posting comments.`,
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80',
      category: 'Programming',
      tags: ['React', 'JavaScript', 'WebDev', 'Frontend'],
      author: alexId,
      views: 520,
      createdAt: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(),
    },
    {
      _id: 'post_3',
      title: '10 Essential Habits for Sustainable Remote Work Productivity',
      description: 'Practical routines and ergonomic strategies to maintain focus, avoid burnout, and thrive while working from home.',
      content: `Working remotely provides flexibility, but without deliberate boundaries, the lines between work and life quickly blur. Here are the top tested strategies for sustaining high performance without burning out.

### 1. Establish a Dedicated Workspace
Never work from your bed or couch long-term. A designated desk signals to your brain that it is time to focus and helps you disconnect once the workday concludes.

### 2. Time-Blocking and The Pomodoro Technique
Chunk your day into 50-minute deep work blocks followed by 10-minute movement breaks. Protect morning hours for high-cognition creative tasks and leave afternoons for meetings.

### 3. Digital Sunsets
Turn off Slack and email notifications at least one hour before bed to foster restorative sleep and mental clarity.`,
      image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1200&q=80',
      category: 'Lifestyle',
      tags: ['RemoteWork', 'Productivity', 'Wellbeing', 'Habits'],
      author: sarahId,
      views: 289,
      createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
    },
    {
      _id: 'post_4',
      title: 'Exploring Kyoto: A 7-Day Guide to Temples, Tea, and Bamboo Groves',
      description: 'An immersive itinerary through Japan ancient capital, featuring hidden shrines, authentic matcha tea houses, and tranquil nature walks.',
      content: `Kyoto is a city where millennium-old history meets serene natural beauty. Whether visiting in cherry blossom spring or vibrant autumn, here is the ultimate traveler guide.

### Day 1-2: Eastern Kyoto & Gion
Start your morning at Kiyomizu-dera to catch the panoramic view over the wooden terrace. Wander through the preserved cobblestone alleys of Sannenzaka and Ninenzaka. In the evening, explore Gion for traditional kaiseki dining.

### Day 3-4: Arashiyama & The Golden Pavilion
Take an early morning stroll through the Arashiyama Bamboo Grove before crowds arrive. Head over to Kinkaku-ji (The Golden Pavilion) to see the gilded temple reflecting across the mirror pond.

### Tips for Travelers:
- Get an IC card (Suica/Pasmo) for seamless train and bus transport.
- Respect local temple etiquette by removing shoes and speaking softly.`,
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
      category: 'Travel',
      tags: ['Japan', 'Kyoto', 'TravelGuide', 'Culture'],
      author: sarahId,
      views: 410,
      createdAt: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString(),
    },
    {
      _id: 'post_5',
      title: 'Building Scalable Microservices with Node.js and Docker',
      description: 'Step-by-step architectural guidelines for decoupling monolithic backends into resilient, containerized microservices.',
      content: `Monolithic applications often become bottlenecks as engineering teams scale. Decomposing systems into discrete microservices allows independent deployment, targeted scaling, and tech stack flexibility.

### Principles of Solid Service Design
- **Single Responsibility**: Each microservice should own a specific business domain (e.g., Auth, Payments, Notifications).
- **Decoupled Databases**: Avoid shared databases across services; prefer API-driven data exchange or event sourcing with message queues (Kafka, RabbitMQ).
- **Containerization**: Use multi-stage Dockerfiles to produce lightweight, secure production images.

\`\`\`dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
\`\`\`

Implement API gateways for authentication routing, rate limiting, and SSL termination.`,
      image: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&w=1200&q=80',
      category: 'Technology',
      tags: ['Docker', 'NodeJS', 'Microservices', 'DevOps'],
      author: alexId,
      views: 630,
      createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    },
    {
      _id: 'post_6',
      title: 'The Science of Sleep and Cognitive Performance',
      description: 'Understanding circadian rhythms, REM cycles, and research-backed methods to optimize memory consolidation and daily alertness.',
      content: `Sleep is not merely downtime; it is an active biological phase essential for brain repair, cellular restoration, and cognitive longevity.

### Sleep Architecture: Non-REM vs REM
- **Deep Sleep (Stage 3)**: Crucial for physical recovery, immune function, and clearing metabolic waste through the glymphatic system.
- **REM Sleep**: Essential for emotional regulation, creative problem-solving, and neuroplasticity.

### Protocols for Restorative Sleep:
1. **Morning Light Exposure**: Get 10-15 minutes of direct sunlight within an hour of waking to set your circadian timer.
2. **Caffeine Timing**: Stop caffeine intake 8-10 hours prior to sleep.
3. **Room Temperature**: Keep your bedroom cool (around 65°F / 18°C) for optimal thermoregulation.`,
      image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=1200&q=80',
      category: 'Health',
      tags: ['Health', 'Sleep', 'Neuroscience', 'Wellness'],
      author: subiId,
      views: 315,
      createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
    },
    {
      _id: 'post_7',
      title: 'Top 10 Sci-Fi Films That Predicted Our Technological Future',
      description: 'From 2001: A Space Odyssey to Minority Report, discover how cinema envisioned modern smartphones, VR, and AI decades ago.',
      content: `Cinema has always been a mirror for human imagination and technological anticipation. Visionary directors collaborated with scientists and futurists to depict gadgets that are now in our pockets.

### 1. Minority Report (2002)
Anticipated gesture-based user interfaces, personalized retinal advertisement tracking, and predictive policing algorithms.

### 2. Her (2013)
Showcased emotionally nuanced conversational AI assistants years before modern large language models arrived.

### 3. Blade Runner (1982)
Pioneered the aesthetic of cyberpunk, climate-altered megacities, and autonomous synthetic life questions.`,
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
      category: 'Entertainment',
      tags: ['Cinema', 'SciFi', 'FutureTech', 'Movies'],
      author: adminId,
      views: 480,
      createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    },
    {
      _id: 'post_8',
      title: 'TypeScript Design Patterns: Writing Clean & Maintainable Code',
      description: 'Learn how to apply Factory, Observer, and Strategy patterns in TypeScript with strict typing and modern syntax.',
      content: `TypeScript provides strong structural typing that elevates traditional object-oriented and functional design patterns.

### The Strategy Pattern
The Strategy pattern defines a family of algorithms, encapsulating each one, and making them interchangeable at runtime.

\`\`\`typescript
interface PaymentStrategy {
  pay(amount: number): Promise<boolean>;
}

class StripePayment implements PaymentStrategy {
  async pay(amount: number) {
    console.log(\`Paid \${amount} via Stripe\`);
    return true;
  }
}

class PayPalPayment implements PaymentStrategy {
  async pay(amount: number) {
    console.log(\`Paid \${amount} via PayPal\`);
    return true;
  }
}
\`\`\`

Using interface contracts allows your application to extend new payment providers without modifying core checkout code (Open/Closed Principle).`,
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      category: 'Programming',
      tags: ['TypeScript', 'DesignPatterns', 'CleanCode', 'Architecture'],
      author: subiId,
      views: 750,
      createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    },
    {
      _id: 'post_9',
      title: 'The Art of Sourdough: Breadmaking as Mindful Meditation',
      description: 'Why millions are turning to wild yeast fermentation as an antidote to screen fatigue and high-stress workdays.',
      content: `Baking sourdough bread is equal parts biochemistry and slow living. Unlike commercial yeast that rises in an hour, wild sourdough requires patience, hydration management, and sensory awareness.

### The Starter Lifecycle
Maintaining a starter (flour + water + wild microflora) teaches consistency. Feeding it daily at consistent temperatures creates a reliable rising power.

### Why It Calms the Mind:
- **Tactile Engagement**: Kneading and folding dough pulls attention away from digital screens.
- **Acceptance of Time**: You cannot rush fermentation; dough moves at its own biological cadence.
- **Nourishing Results**: High fermentation breaks down gluten and phytic acid, making sourdough gentler on digestion.`,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
      category: 'Lifestyle',
      tags: ['Baking', 'Mindfulness', 'Sourdough', 'Cooking'],
      author: sarahId,
      views: 220,
      createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    },
    {
      _id: 'post_10',
      title: 'Modern Higher Education: Navigating Online Degrees vs Bootcamps',
      description: 'An analytical comparison of university degrees, intensive coding bootcamps, and self-directed portfolios in the current tech hiring market.',
      content: `The job market is continually evaluating non-traditional credentials. Prospective engineers, designers, and managers face critical choices when investing in their education.

### Comparing Pathways:
- **4-Year Degree**: Deep theoretical foundation (algorithms, computer systems, discrete math), network access, and institutional credibility.
- **Coding Bootcamp**: Fast-paced, high project density, practical modern frameworks (React, Express, AWS), but variable graduate quality.
- **Self-Directed / Open Courseware**: Near zero monetary cost, highly self-paced, requires extreme discipline and standout open-source contributions.

The verdict? A hybrid approach where practical portfolio projects demonstrate real competence combined with solid theoretical fundamentals wins every time.`,
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
      category: 'Education',
      tags: ['HigherEd', 'Bootcamp', 'CareerAdvice', 'Learning'],
      author: adminId,
      views: 390,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  const comments: DBComment[] = [
    {
      _id: 'cmt_1',
      post: 'post_1',
      user: alexId,
      content: 'This is a fantastic summary! As someone working with EdTech tools, adaptive pacing makes a massive difference for struggling students.',
      createdAt: new Date(Date.now() - 9 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 9 * 24 * 3600 * 1000).toISOString(),
    },
    {
      _id: 'cmt_2',
      post: 'post_1',
      user: sarahId,
      content: 'I love the emphasis on ethics and equal access. Technology must uplift everyone, not just well-funded institutions.',
      createdAt: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(),
    },
    {
      _id: 'cmt_3',
      post: 'post_1',
      user: adminId,
      content: 'Excellent insights, Subi! We are planning to feature this in our monthly newsletter.',
      createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
    },
    {
      _id: 'cmt_4',
      post: 'post_2',
      user: subiId,
      content: 'React 19 Actions have eliminated so much boilerplate in my projects. Great explanation of useOptimistic too!',
      createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
    },
    {
      _id: 'cmt_5',
      post: 'post_2',
      user: sarahId,
      content: 'The code snippet made it click for me. Thanks Alex!',
      createdAt: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString(),
    },
    {
      _id: 'cmt_6',
      post: 'post_3',
      user: alexId,
      content: 'The digital sunset habit literally changed my insomnia. Great advice for remote workers!',
      createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    },
    {
      _id: 'cmt_7',
      post: 'post_4',
      user: subiId,
      content: 'Kyoto is on my bucket list for next spring! Saving this itinerary immediately.',
      createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
    },
    {
      _id: 'cmt_8',
      post: 'post_5',
      user: subiId,
      content: 'Docker multi-stage builds are such a game-changer for production deployment sizes.',
      createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
    },
    {
      _id: 'cmt_9',
      post: 'post_6',
      user: alexId,
      content: 'Morning sunlight exposure protocol worked wonders for my focus levels during coding sprints.',
      createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    },
    {
      _id: 'cmt_10',
      post: 'post_7',
      user: sarahId,
      content: 'Her (2013) is still one of my favorite movies. The UI design in that film was so prescient.',
      createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    },
    {
      _id: 'cmt_11',
      post: 'post_8',
      user: alexId,
      content: 'The Strategy pattern with TypeScript interfaces is pristine. Very clean write-up!',
      createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    },
    {
      _id: 'cmt_12',
      post: 'post_9',
      user: subiId,
      content: 'Now I want to bake fresh sourdough this weekend! The mindfulness aspect is so true.',
      createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    },
    {
      _id: 'cmt_13',
      post: 'post_10',
      user: alexId,
      content: 'Spot on analysis on degrees vs bootcamps. The portfolio and actual code review always speak the loudest.',
      createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    },
    {
      _id: 'cmt_14',
      post: 'post_8',
      user: adminId,
      content: 'Great example of software craftsmanship. Keep up the high-quality content!',
      createdAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    },
    {
      _id: 'cmt_15',
      post: 'post_5',
      user: sarahId,
      content: 'Very clear explanation for beginners who find microservices overwhelming.',
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    }
  ];

  return { users, posts, comments };
}

// In-memory / File persistent DB class
class JSONDatabase {
  private data: DBSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DBSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(fileContent);
      }
    } catch (e) {
      console.warn('Could not read existing database_store.json, initializing fresh store:', e);
    }
    const seed = getInitialSeedData();
    this.saveData(seed);
    return seed;
  }

  private saveData(data: DBSchema) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving data to database_store.json:', e);
    }
  }

  public resetSeed(): DBSchema {
    const seed = getInitialSeedData();
    this.data = seed;
    this.saveData(seed);
    return seed;
  }

  // Users collection
  public getUsers(): DBUser[] {
    return this.data.users;
  }

  public getUserById(id: string): DBUser | undefined {
    return this.data.users.find((u) => u._id === id);
  }

  public getUserByEmail(email: string): DBUser | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public getUserByUsername(username: string): DBUser | undefined {
    return this.data.users.find((u) => u.username.toLowerCase() === username.toLowerCase());
  }

  public createUser(user: Omit<DBUser, '_id' | 'createdAt' | 'updatedAt'>): DBUser {
    const newUser: DBUser = {
      ...user,
      _id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.users.push(newUser);
    this.saveData(this.data);
    return newUser;
  }

  public updateUser(id: string, updates: Partial<DBUser>): DBUser | null {
    const index = this.data.users.findIndex((u) => u._id === id);
    if (index === -1) return null;
    this.data.users[index] = {
      ...this.data.users[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveData(this.data);
    return this.data.users[index];
  }

  public deleteUser(id: string): boolean {
    const initialLen = this.data.users.length;
    this.data.users = this.data.users.filter((u) => u._id !== id);
    // Cascade delete posts and comments
    this.data.posts = this.data.posts.filter((p) => p.author !== id);
    this.data.comments = this.data.comments.filter((c) => c.user !== id);
    this.saveData(this.data);
    return this.data.users.length < initialLen;
  }

  // Posts collection
  public getPosts(): DBPost[] {
    return this.data.posts;
  }

  public getPostById(id: string): DBPost | undefined {
    return this.data.posts.find((p) => p._id === id);
  }

  public createPost(post: Omit<DBPost, '_id' | 'views' | 'createdAt' | 'updatedAt'>): DBPost {
    const newPost: DBPost = {
      ...post,
      _id: generateId(),
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.posts.unshift(newPost);
    this.saveData(this.data);
    return newPost;
  }

  public updatePost(id: string, updates: Partial<DBPost>): DBPost | null {
    const index = this.data.posts.findIndex((p) => p._id === id);
    if (index === -1) return null;
    this.data.posts[index] = {
      ...this.data.posts[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveData(this.data);
    return this.data.posts[index];
  }

  public incrementPostViews(id: string): void {
    const post = this.getPostById(id);
    if (post) {
      post.views = (post.views || 0) + 1;
      this.saveData(this.data);
    }
  }

  public deletePost(id: string): boolean {
    const initialLen = this.data.posts.length;
    this.data.posts = this.data.posts.filter((p) => p._id !== id);
    // Cascade delete associated comments
    this.data.comments = this.data.comments.filter((c) => c.post !== id);
    this.saveData(this.data);
    return this.data.posts.length < initialLen;
  }

  // Comments collection
  public getComments(): DBComment[] {
    return this.data.comments;
  }

  public getCommentsByPostId(postId: string): DBComment[] {
    return this.data.comments.filter((c) => c.post === postId);
  }

  public getCommentById(id: string): DBComment | undefined {
    return this.data.comments.find((c) => c._id === id);
  }

  public createComment(comment: Omit<DBComment, '_id' | 'createdAt' | 'updatedAt'>): DBComment {
    const newComment: DBComment = {
      ...comment,
      _id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.comments.push(newComment);
    this.saveData(this.data);
    return newComment;
  }

  public updateComment(id: string, content: string): DBComment | null {
    const index = this.data.comments.findIndex((c) => c._id === id);
    if (index === -1) return null;
    this.data.comments[index].content = content;
    this.data.comments[index].updatedAt = new Date().toISOString();
    this.saveData(this.data);
    return this.data.comments[index];
  }

  public deleteComment(id: string): boolean {
    const initialLen = this.data.comments.length;
    this.data.comments = this.data.comments.filter((c) => c._id !== id);
    this.saveData(this.data);
    return this.data.comments.length < initialLen;
  }
}

export const db = new JSONDatabase();
