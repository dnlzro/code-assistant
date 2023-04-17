import { Cog6ToothIcon as Cog6ToothIconOutline } from "@heroicons/react/24/outline";
import { Cog6ToothIcon as Cog6ToothIconSolid } from "@heroicons/react/24/solid";

type SettingsAreaProps = {
  settingsOpen: boolean;
  setSettingsOpen: (settingsOpen: boolean) => void;
  useEnvKey: boolean;
  setUseEnvKey: (useEnvKey: boolean) => void;
  apiKey: string;
  setApiKey: (apiKey: string) => void;
  apiKeyValid: boolean;
};

function SettingsArea({
  settingsOpen,
  setSettingsOpen,
  useEnvKey,
  setUseEnvKey,
  apiKey,
  setApiKey,
  apiKeyValid,
}: SettingsAreaProps) {
  return (
    <div className="dropdown dropdown-end dropdown-open">
      <label class="swap">
        <input
          type="checkbox"
          onChange={() => setSettingsOpen(!settingsOpen)}
        />
        <div class="swap-off">
          <Cog6ToothIconOutline className="h-8" />
        </div>
        <div class="swap-on">
          <Cog6ToothIconSolid className="h-8" />
        </div>
      </label>
      {settingsOpen && (
        <ul
          className={
            "dropdown-content menu rounded-box w-72 overflow-clip border border-solid border-nord-8 bg-nord-1 shadow sm:w-96"
          }
        >
          <li>
            <label className="label flex cursor-pointer gap-4 hover:bg-nord-2 active:bg-transparent">
              <span className="label-text text-nord-4">
                Use API key from environment (
                <span class="font-mono">.env</span>)
              </span>
              <input
                type="checkbox"
                className="toggle-primary toggle"
                onClick={() => setUseEnvKey(!useEnvKey)}
              />
            </label>
          </li>
          {!useEnvKey && (
            <div className="form-control w-full border-t-2 border-nord-0 px-4 pb-4 pt-3">
              <label className="label p-0 pb-2">
                <span className="label-text text-nord-4">
                  Enter OpenAI API key
                </span>
              </label>
              <input
                type="text"
                placeholder="sk-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                className={
                  "input w-full bg-nord-0 font-mono text-nord-4 placeholder-nord-2 focus:bg-nord-3 focus:placeholder-nord-1 focus:outline-none" +
                  (apiKeyValid
                    ? "border-2 border-success"
                    : !apiKeyValid && apiKey && "border-2 border-error")
                }
                onChange={(e) =>
                  setApiKey((e.target as HTMLInputElement).value)
                }
                value={apiKey}
              />
              {apiKeyValid && (
                <label className="label p-0 pt-2">
                  <span className="label-text text-success">
                    Key is valid! Using for future requests.
                  </span>
                </label>
              )}
              {!apiKeyValid && apiKey && (
                <label className="label p-0 pt-2">
                  <span className="label-text text-error">
                    Invalid private key
                  </span>
                </label>
              )}
            </div>
          )}
        </ul>
      )}
    </div>
  );
}

export default SettingsArea;
