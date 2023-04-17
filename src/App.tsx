import { useEffect, useState } from "preact/hooks";
import Editor from "./components/Editor";
import { ModelResult } from "@vscode/vscode-languagedetection";
import SubmitArea from "./components/SubmitArea";
import AssistantArea from "./components/AssistantArea";
import generate from "./api/generate";
import SettingsArea from "./components/SettingsArea";

export function App() {
  const [content, setContent] = useState("");
  const [lang, setLang] = useState<ModelResult | null>(null);
  const [level, setLevel] = useState<string>("");
  const [inProgress, setInProgress] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [useEnvKey, setUseEnvKey] = useState(true);
  const [envKey, setEnvKey] = useState("");
  const [envKeyValid, setEnvKeyValid] = useState(false);
  const [response, setResponse] = useState<{
    success: boolean;
    data: string;
  } | null>(null);
  const handleSubmit = async () => {
    setInProgress(true);
    setResponse(
      await generate(
        lang?.languageId ? lang.languageId : "",
        content,
        level,
        useEnvKey && envKeyValid ? envKey : undefined
      )
    );
    setInProgress(false);
  };

  useEffect(() => {
    envKey.match(/^sk-[A-Za-z0-9]{48}$/)
      ? setEnvKeyValid(true)
      : setEnvKeyValid(false);
  }, [envKey]);

  return (
    <div class="flex min-h-screen flex-col md:max-h-screen">
      <div class="flex flex-row items-center justify-between px-7 pt-6 text-nord-8 md:px-4 md:pt-3">
        <h1 class="text-3xl font-bold">AI Code Assistant</h1>
        <SettingsArea
          settingsOpen={settingsOpen}
          setSettingsOpen={setSettingsOpen}
          useEnvKey={useEnvKey}
          setUseEnvKey={setUseEnvKey}
          envKey={envKey}
          setEnvKey={setEnvKey}
          envKeyValid={envKeyValid}
        />
      </div>
      <div class="flex min-h-0 grow flex-col gap-6 p-6 md:grid md:grid-cols-2 md:gap-3 md:p-3">
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
