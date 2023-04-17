import { ModelResult } from "@vscode/vscode-languagedetection";

function SubmitArea({
  content,
  lang,
  level,
  setLevel,
  handleSubmit,
}: {
  content: string;
  lang: ModelResult | null;
  level: string;
  setLevel: (level: string) => void;
  handleSubmit: () => Promise<void>;
}) {
  return (
    <div class="flex flex-col items-center justify-center gap-5 p-5">
      <div
        class="tooltip tooltip-primary flex flex-row items-start gap-1"
        data-tip="Assistant uses a machine learning model to guess the input language"
      >
        <div class="flex flex-col items-center">
          <span class="text-lg text-nord-4">
            Detected Language:{" "}
            {lang ? <b class="underline">{lang.languageId}</b> : "None"}
          </span>
          {lang ? (
            <span class="text-md text-nord-4">
              ({(lang.confidence * 100).toFixed(1)}% confidence)
            </span>
          ) : (
            <></>
          )}
        </div>
      </div>

      <div class="flex flex-row items-end gap-5">
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text text-nord-4">
              Experience Level <span class="text-error">*</span>
            </span>
          </label>
          <select
            className={
              "select bg-neutral text-nord-6 " +
              (level ? "select-primary" : "select-error")
            }
            onChange={(e) => setLevel((e.target as HTMLSelectElement).value)}
            required
          >
            <option disabled selected>
              I am..
            </option>
            <option value="beginner">New to coding</option>
            <option value="intermediate">Somewhat experienced</option>
            <option value="expert">Very experienced</option>
          </select>
        </div>
        <div
          class="tooltip tooltip-top tooltip-error"
          data-tip={
            content.trim().length === 0 || level === ""
              ? "You must enter code and choose your experience level before continuing."
              : null
          }
        >
          <button
            class={
              "btn-primary btn w-36" +
              (content.trim().length === 0 || level === ""
                ? " btn-disabled bg-nord-2 text-nord-0"
                : "")
            }
            onClick={handleSubmit}
          >
            Explain Code
          </button>
        </div>
      </div>
    </div>
  );
}

export default SubmitArea;
