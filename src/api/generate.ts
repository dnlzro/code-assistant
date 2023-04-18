import { Message, PartResponse } from "../types";

const API_KEY: string = import.meta.env.VITE_OPENAI_API_KEY;

export async function generateExplanation(
  lang: string,
  content: string,
  level: string,
  apiKey?: string
): Promise<[PartResponse, Message[]]> {
  // Initialize messages
  const messages = [
    {
      role: "user",
      content: generateExplanationPrompt(lang, content, level),
    } as Message,
  ];
  // Return part response (explanation) and messages
  return [await formPartResponse(messages, apiKey), messages];
}

export async function generateConfidence(
  messages: Message[],
  apiKey?: string
): Promise<[PartResponse, Message[]]> {
  // Update messages
  const newMessages = [
    ...messages,
    {
      role: "user",
      content: `How confident are you in your response? Give a percentage estimate, and answer in the following format:

Confidence: {X}%
Explanation: {A very short explanation for why you are this confident.}`,
    } as Message,
  ];
  // Return part response (confidence)
  return [await formPartResponse(newMessages, apiKey), newMessages];
}

export async function generateResources(
  messages: Message[],
  apiKey?: string
): Promise<[PartResponse, Message[]]> {
  // Update messages
  const newMessages = [
    ...messages,
    {
      role: "user",
      content: `Give a list of links to additional resources so I can learn more about this code. Format your answer as a Markdown list.  Do not include an introduction (e.g. "Here are some resources...").`,
    } as Message,
  ];
  // Return part response (resources)
  return [await formPartResponse(newMessages, apiKey), newMessages];
}

function generateExplanationPrompt(
  lang: string,
  content: string,
  level: string
) {
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

function fullResponseToMessages() {}

function partResponseToMessage(response: PartResponse) {}

function getCompletion(messages: Message[], apiKey: string) {
  return fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.6,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
  });
}

async function formPartResponse(
  messages: Message[],
  apiKey?: string
): Promise<PartResponse> {
  if (!(API_KEY || apiKey)) {
    return {
      success: false,
      data: "OpenAI API key not configured. Make sure you have specified an API key using the **settings menu** above.\r\n\r\nIf you are running this app locally, you can instead set the `VITE_OPENAI_API_KEY` environment variable (located in `.env`), then toggle the option 'Use API key from environment' in the settings menu.",
    };
  }
  const key = apiKey || API_KEY; // Key provided in frontend takes precedence

  try {
    // Fetch from API
    const response = await getCompletion(messages, key);

    // Parse return data
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
      console.log(data.error.message);
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
