import { useEffect, useState } from "preact/hooks";
import Editor from "./components/Editor";
import { ModelResult } from "@vscode/vscode-languagedetection";
import SubmitArea from "./components/SubmitArea";
import AssistantArea from "./components/AssistantArea";
import {
  generateConfidence,
  generateExplanation,
  generateResources,
} from "./api/generate";
import SettingsArea from "./components/SettingsArea";
import { FullResponse, Message } from "./types";

export function App() {
  const [content, setContent] = useState("");
  const [lang, setLang] = useState<ModelResult | null>(null);
  const [level, setLevel] = useState<string>("");
  const [inProgress, setInProgress] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [useEnvKey, setUseEnvKey] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [apiKeyValid, setApiKeyValid] = useState(false);
  const [response, setResponse] = useState<FullResponse | null>(null);
  const handleSubmit = async () => {
    setInProgress(true);
    setResponse({});

    // Get explanation
    let [explanation, messages1] = await generateExplanation(
      lang?.languageId ? lang.languageId : "",
      content,
      level,
      !useEnvKey && apiKeyValid ? apiKey : undefined
    );
    setResponse({ explanation: explanation });
    if (!explanation.success) return setInProgress(false);
    console.log(messages1);
    let messages2 = [
      ...messages1,
      { role: "assistant", content: explanation.data } as Message,
    ];
    console.log(messages2);

    // Get confidence
    let [confidence, messages3] = await generateConfidence(
      messages2,
      !useEnvKey && apiKeyValid ? apiKey : undefined
    );
    setResponse({ ...response, confidence: confidence });
    console.log(messages3);

    let messages4 = [
      ...messages3,
      { role: "assistant", content: confidence.data } as Message,
    ];
    console.log(messages4);

    // Get resources
    const [resources, messages5] = await generateResources(
      messages4,
      !useEnvKey && apiKeyValid ? apiKey : undefined
    );
    setResponse({ ...response, resources: resources });
    console.log(messages5);

    setInProgress(false);
  };

  useEffect(() => {
    apiKey.match(/^sk-[A-Za-z0-9]{48}$/)
      ? setApiKeyValid(true)
      : setApiKeyValid(false);
  }, [apiKey]);

  return (
    <div class="flex min-h-screen flex-col md:max-h-screen">
      <div class="flex flex-row items-center justify-between px-4 pt-3 text-nord-8">
        <h1 class="text-3xl font-bold">AI Code Assistant</h1>
        <SettingsArea
          settingsOpen={settingsOpen}
          setSettingsOpen={setSettingsOpen}
          useEnvKey={useEnvKey}
          setUseEnvKey={setUseEnvKey}
          apiKey={apiKey}
          setApiKey={setApiKey}
          apiKeyValid={apiKeyValid}
        />
      </div>
      <div class="flex min-h-0 grow flex-col gap-3 p-3 md:grid md:grid-cols-2">
        <Editor
          content={content}
          setContent={setContent}
          lang={lang}
          setLang={setLang}
        />

        <div class="flex min-h-0 flex-col gap-3">
          <AssistantArea
            response={response}
            inProgress={inProgress}
          ></AssistantArea>
          <SubmitArea
            inProgress={inProgress}
            content={content}
            lang={lang}
            level={level}
            setLevel={setLevel}
            handleSubmit={handleSubmit}
          ></SubmitArea>
        </div>
      </div>
    </div>
  );
}
