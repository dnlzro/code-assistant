import { Cog6ToothIcon as Cog6ToothIconOutline } from "@heroicons/react/24/outline";
import { Cog6ToothIcon as Cog6ToothIconSolid } from "@heroicons/react/24/solid";
import { useEffect, useRef } from "preact/hooks";
import { motion, AnimatePresence } from "framer-motion";

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
  const dropdown = useRef<HTMLUListElement | null>(null);
  const checkbox = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (dropdown.current && checkbox.current) {
        if (checkbox.current.parentNode?.contains(e.target)) return;
        if (!dropdown.current.contains(e.target)) {
          setSettingsOpen(false);
          checkbox.current.checked = false;
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdown, checkbox]);

  return (
    <div className="dropdown dropdown-end dropdown-open">
      <label class="swap swap-rotate">
        <input
          ref={checkbox}
          type="checkbox"
          onClick={(e) => {
            if ((e.target as HTMLInputElement).checked) {
              setSettingsOpen(true);
              (e.target as HTMLInputElement).checked = true;
            } else {
              setSettingsOpen(false);
              (e.target as HTMLInputElement).checked = false;
            }
          }}
        />
        <div class="swap-off">
          <Cog6ToothIconOutline className="h-8" />
        </div>
        <div class="swap-on">
          <Cog6ToothIconSolid className="h-8" />
        </div>
      </label>
      <AnimatePresence>
        {settingsOpen && (
          <motion.ul
            ref={dropdown}
            className={
              "dropdown-content menu rounded-box w-72 overflow-clip border border-solid border-nord-8 bg-nord-1 shadow !transition-none sm:w-96"
            }
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25, transition: { duration: 0.1 } }}
            transition={{ y: { type: "spring", bounce: 0.5 } }}
          >
            <li>
              <label className="label flex cursor-pointer gap-4 hover:bg-nord-2 active:bg-transparent">
                <span className="label-text text-nord-4">
                  Use API key from environment (
                  <span class="font-mono">.env</span>)
                </span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  onClick={() => setUseEnvKey(!useEnvKey)}
                />
              </label>
            </li>
            <AnimatePresence initial={false}>
              {!useEnvKey && (
                <motion.div
                  initial={{
                    opacity: 0,
                    height: 0,
                  }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                  }}
                >
                  <div className="form-control box-border w-full border-t-2 border-nord-0 px-4 pb-4 pt-3">
                    <label className="label p-0 pb-2">
                      <span className="label-text text-nord-4">
                        Enter OpenAI API key
                      </span>
                    </label>
                    <input
                      type="password"
                      autoCorrect="off"
                      autoComplete="off"
                      autoCapitalize="off"
                      spellcheck={false}
                      placeholder="sk-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                      className={
                        "input h-auto w-full bg-nord-0 p-2 font-mono text-nord-4 placeholder-nord-2 focus:bg-nord-3 focus:placeholder-nord-1 focus:outline-none" +
                        (apiKeyValid
                          ? "border-2 border-success"
                          : !apiKeyValid && apiKey && "border-2 border-error")
                      }
                      onChange={(e) =>
                        setApiKey((e.target as HTMLInputElement).value)
                      }
                      value={apiKey}
                    />
                    <AnimatePresence>
                      {apiKey && (
                        <motion.label
                          initial={{
                            opacity: 0,
                            height: 0,
                          }}
                          animate={{
                            opacity: 1,
                            height: "auto",
                          }}
                          exit={{
                            opacity: 0,
                            height: 0,
                          }}
                          className="label p-0"
                        >
                          {apiKeyValid ? (
                            <span className="label-text pt-2 text-success">
                              Key is valid! Using for future requests.
                            </span>
                          ) : (
                            <span className="label-text pt-2 text-error">
                              Invalid private key
                            </span>
                          )}
                        </motion.label>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SettingsArea;
