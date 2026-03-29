🤖 ContentSense AI - Smart Content Creation Project
ContentSense AI is a professional web application built to streamline social media content workflows. It leverages advanced AI to analyze user-uploaded visuals and generate high-impact, platform-specific content strategies instantly.

🌟 Key Features
AI Visual Analysis: Integrated with Google Gemini 1.5 Flash to identify colors, objects, and design elements, providing context-aware content suggestions.

Platform-Specific Generation: Automatically creates tailored captions and hashtag sets for Instagram, LinkedIn, TikTok, and Twitter (X).

Multi-Language Engine: Supports dynamic interface and AI output generation in Turkish, English, and German.

Built-in Image Editor: A dedicated studio where users can overlay custom text on their visuals and download them in high-quality (1080x1080px).

Personalized Onboarding: Users can define their specific interests during registration to receive more accurate and relevant AI results.

Credit System: Features a robust user management system with tiered access and content credits, powered by Prisma & PostgreSQL.

🚀 Tech Stack
Frontend: Next.js 14 (App Router), TypeScript, Tailwind CSS.

Backend: Next.js API Routes & Server Actions.

Database: PostgreSQL (managed via Prisma ORM).

AI Integration: Google Generative AI (Gemini API).

Security: Custom authentication with Bcrypt encryption and secure session handling.

Deployment: Vercel.

🛠️ Installation & Setup
Clone the repository:

Bash
git clone https://github.com/yourusername/contentsense-ai.git
cd contentsense-ai
Install dependencies:

Bash
npm install
Environment Variables:
Create a .env file in the root directory and add your keys:

Kod snippet'i
DATABASE_URL="your_postgresql_url"
GEMINI_API_KEY="your_google_gemini_api_key"
Database Sync:

Bash
npx prisma db push
npx prisma generate
Run the project:

Bash
npm run dev

Developed by Utku Sert Full-Stack Developer
