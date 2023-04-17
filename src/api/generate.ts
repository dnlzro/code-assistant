const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export default async function (
  lang: string,
  content: string,
  level: string,
  key?: string
) {
  if (!(API_KEY || key)) {
    return {
      success: false,
      data: "OpenAI API key not configured. Make sure you have set the `VITE_OPENAI_API_KEY` environment variable (located in `.env`), or specify a key using the **settings menu** above.",
    };
  }

  // Key specified in frontend takes priority
  const apiKey = key || API_KEY;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "user", content: generatePrompt(lang, content, level) },
        ],
        temperature: 0.6,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const data = await response.json();
    if (response.ok) {
      if (data.choices[0].message.content) {
        return {
          success: true,
          data: data.choices[0].message.content,
        };
      } else {
        return {
          success: false,
          data: "Code assistant got your submission, but did not respond :(",
        };
      }
    } else {
      return {
        success: false,
        data: data.error.message,
      };
    }
  } catch (err) {
    return {
      success: false,
      data: "An unknown error occurred, please try again.",
    };
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
