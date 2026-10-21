const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GOOGLE_GEMINI_KEY) {
    console.error("❌ GOOGLE_GEMINI_KEY missing hai. backend/.env file banao (backend/.env.example dekho).");
    process.exit(1);
}

const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-3.5-flash";

const SYSTEM_PROMPT = `
You are an expert code reviewer with 7+ years of development experience.
Analyze the code the developer sends and help them improve it.

Focus on:
- Code quality: clean, maintainable, well-structured code
- Best practices and consistency (naming, formatting, DRY, SOLID)
- Bugs, logical flaws and security risks (e.g. SQL injection, XSS, CSRF)
- Performance and scalability
- Readability, documentation and test coverage

Guidelines:
- Be precise and constructive; explain WHY a change is needed.
- Show a refactored version of the code when possible.
- Assume the developer is competent, balance strictness with encouragement,
  and mention strengths too.

Reply in Markdown using this structure:
### ❌ Issues
(bullet list of problems found)
### ✅ Recommended Fix
(corrected code in a fenced code block with the language name)
### 💡 Improvements
(short bullet list of what got better and further suggestions)

Do not ask follow-up questions and do not add any closing remarks.
`;

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);
const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: SYSTEM_PROMPT,
});

async function generateContent(prompt) {
    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("❌ Error generating content:", error);
        throw error; // original error (status code samet) controller tak jaye
    }
}

module.exports = generateContent;
