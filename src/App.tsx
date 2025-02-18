import { useEffect, useState } from "preact/hooks";
import Editor from "./components/Editor";
import { ModelResult } from "@vscode/vscode-languagedetection";
import SubmitArea from "./components/SubmitArea";
import AssistantArea from "./components/AssistantArea";
import {
  generateAssumptions,
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
  const [response, setResponse] = useState<FullResponse>({});
  const handleSubmit = async () => {
    setInProgress(true);
    setResponse({});
    let lastResponse = {};

    // Get explanation
    let [explanation, messages1] = await generateExplanation(
      lang?.languageId ? lang.languageId : "",
      content,
      level,
      !useEnvKey && apiKeyValid ? apiKey : undefined
    );
    lastResponse = { explanation: explanation };
    setResponse(lastResponse);

    if (!explanation.success) return setInProgress(false);

    let messages2 = [
      ...messages1,
      { role: "assistant", content: explanation.data } as Message,
    ];

    // Get confidence
    let [confidence, messages3] = await generateConfidence(
      messages2,
      !useEnvKey && apiKeyValid ? apiKey : undefined
    );
    lastResponse = { ...lastResponse, confidence: confidence };
    setResponse(lastResponse);

    let messages4 = [
      ...messages3,
      { role: "assistant", content: confidence.data } as Message,
    ];

    // Get assumptions
    let [assumptions, messages5] = await generateAssumptions(
      messages4,
      !useEnvKey && apiKeyValid ? apiKey : undefined
    );
    lastResponse = { ...lastResponse, assumptions: assumptions };
    setResponse(lastResponse);

    let messages6 = [
      ...messages5,
      { role: "assistant", content: assumptions.data } as Message,
    ];

    // Get resources
    const [resources] = await generateResources(
      messages6,
      !useEnvKey && apiKeyValid ? apiKey : undefined
    );
    lastResponse = { ...lastResponse, resources: resources };
    setResponse(lastResponse);

    setInProgress(false);
  };

  useEffect(() => {
    apiKey.match(/^sk-.*$/) ? setApiKeyValid(true) : setApiKeyValid(false);
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
