import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (lang: string, content: string, level: string) {
  if (!configuration.apiKey) {
    return {
      success: false,
      data: "OpenAI API key not configured. Make sure you have set the `VITE_OPENAI_API_KEY` environment variable (located in `.env`).",
    };
  }
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: generatePrompt(lang, content, level) },
      ],
      max_tokens: 2048,
      temperature: 0.6,
    });
    return {
      success: true,
      data:
        completion.data.choices[0].message?.content ||
        "Code assistant got your submission, but did not respond :(",
    };
  } catch (error: any) {
    if (error.response) {
      return {
        success: false,
        data: JSON.stringify(error.response.data.error.message),
      };
    } else {
      return { success: false, data: "An unknown error occurred" };
    }
  }
}

function generatePrompt(lang: string, content: string, level: string) {
  const formattedLang = lang ? lang + " " : "";
  const formattedLevel =
    level === "beginner"
      ? "a beginner"
      : level === "intermediate"
      ? "an intermediate"
      : "an expert";
  return `I am ${formattedLevel} programmer. Please explain the following ${formattedLang}code in language that I can understand. Explain the code step by step and with bullet points. Use Markdown formatting, especially backticks for code snippets.

${content}`;
}
