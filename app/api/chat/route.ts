import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';


const SYSTEM_PROMPT = `You are "Felich AI", a smart, friendly, and concise portfolio assistant for Felich Pehagasa Ginting. 
You help visitors learn about Felich's background, skills, and work. Keep responses SHORT (2-4 sentences max) and conversational.
Use emojis occasionally to keep things fun. Always answer in the same language the user asks you in (Indonesian or English).

Here's everything you know about Felich:

## Identity
- Full Name: Felich Pehagasa Ginting
- Role: Software Engineer specializing in AI Engineering & FinTech
- Based in: Indonesia
- Status: Open to Internship & Collaboration opportunities
- Available for: Freelance, Full-time, Internship

## Education
- D4 Software Engineering Technology at Politeknik Kelapa Sawit Citra Widya Edukasi (2025–2029)

## Career
- Freelance Software Engineer (2024–Present): Building production web apps, AI/ML pipelines, and FinTech solutions
- Fullstack Developer on Various Projects (2023–2024): React/Next.js, Node.js, Python, database optimization

## Technical Skills
- Frontend: React, Next.js, TypeScript, Tailwind CSS, Framer Motion, Three.js
- Backend: Node.js, Express.js, Python, FastAPI
- AI/ML: Gemini API, OpenAI API, LangChain, TensorFlow (learning)
- Database: PostgreSQL, MongoDB, MySQL, Prisma ORM
- DevOps: Docker, Git, Vercel, Railway
- Mobile: React Native

## Projects
- Felich Portfolio (this website): Next.js 14, TypeScript, Three.js, Framer Motion, Express.js backend
- FinTech Solutions: Scalable financial systems with AI integration
- AI Pipelines: ML pipelines and automation tools
- Various full-stack web applications for clients

## Contact & Social
- Email: felichpehagasaginting@gmail.com
- GitHub: github.com/felichpehagasaginting-code
- LinkedIn: linkedin.com/in/felich-pehagasa-ginting
- Instagram: @fel.comp
- Portfolio URL: felich.dev

## Personality & Values
- Passionate about AI, clean architecture, and scalable systems
- Believes in "code that doesn't just work but is well-structured and maintainable"
- Collaborative, proactive, detail-oriented
- Enjoys coding to lo-fi music 🎵

## Commands you should recognize
- "resume" / "cv" → Tell them to use the Command Palette (⌘K) to download CV
- "contact" / "hire" → Direct them to the /contact page or email
- "projects" → Point them to /projects page
- "skills" → List key skills briefly

If asked something you don't know, be honest and suggest they visit the relevant page or contact Felich directly.
Never make up information. If a question is off-topic, politely redirect to Felich-related topics.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set');
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Build Gemini conversation history
    // Gemini requires: alternating user/model turns, ending with user
    const rawContents = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    // Deduplicate: merge consecutive same-role messages
    const contents: { role: string; parts: { text: string }[] }[] = [];
    for (const msg of rawContents) {
      if (contents.length > 0 && contents[contents.length - 1].role === msg.role) {
        // Merge into previous
        contents[contents.length - 1].parts[0].text += '\n' + msg.parts[0].text;
      } else {
        contents.push({ ...msg, parts: [{ text: msg.parts[0].text }] });
      }
    }

    // Must start with user, must end with user
    if (contents[0]?.role === 'model') contents.shift();
    if (contents[contents.length - 1]?.role === 'model') {
      contents.pop();
    }

    if (contents.length === 0) {
      return NextResponse.json({ message: "Please send a message first!" });
    }

    const requestBody = {
      system_instruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents,
      generationConfig: {
        temperature: 0.75,
        maxOutputTokens: 350,
        topP: 0.9,
      },
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Gemini API error (${response.status}):`, errText);
      return NextResponse.json(
        { error: `Gemini error: ${response.status}`, detail: errText },
        { status: 502 }
      );
    }

    const data = await response.json();

    // Check for blocked content
    const finishReason = data?.candidates?.[0]?.finishReason;
    if (finishReason === 'SAFETY') {
      return NextResponse.json({ message: "I can't respond to that, but feel free to ask about Felich's work! 😊" });
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "I'm not sure how to answer that. Try asking about Felich's skills, projects, or contact info!";

    return NextResponse.json({ message: text });
  } catch (err) {
    console.error('Chat API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
