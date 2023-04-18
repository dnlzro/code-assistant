import { useEffect, useRef, useState } from "preact/hooks";
import { ActiveTab } from "./AssistantArea";
import {
  InformationCircleIcon,
  AcademicCapIcon,
} from "@heroicons/react/20/solid";

type AssistantAreaHeaderProps = {
  success: boolean;
  activeTab: ActiveTab;
  setActiveTab: (activeTab: ActiveTab) => void;
};

function AssistantAreaHeader({
  success,
  activeTab,
  setActiveTab,
}: AssistantAreaHeaderProps) {
  const container = useRef(null);
  const [collapseTabs, setCollapseTabs] = useState(false);

  useEffect(() => {
    if (!container.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      const container = entry.target;
      if (container.getBoundingClientRect().width < 424) {
        setCollapseTabs(true);
      } else {
        setCollapseTabs(false);
      }
    });
    resizeObserver.observe(container.current);
  }, [container]);

  return (
    <div
      ref={container}
      class="sticky top-0 z-20 flex min-h-[40px] flex-col items-center justify-between gap-4 bg-gradient-to-b from-nord-0 to-transparent px-5 pb-4 pt-5 backdrop-blur-md xs:flex-row xs:gap-3 xs:pb-2"
    >
      <h2 class="text-2xl font-bold">Assistant says...</h2>
      {/* Display tabs when response is successful */}
      {success && (
        <div className="tabs tabs-boxed w-full bg-nord-2/50 xs:w-auto">
          <a
            className={
              "tab grow px-3 text-nord-4 transition-all duration-[400ms] xs:grow-0 " +
              (activeTab === ActiveTab.Explanation && "tab-active")
            }
            onClick={() => setActiveTab(ActiveTab.Explanation)}
          >
            {collapseTabs ? <AcademicCapIcon className="h-5" /> : "Explanation"}
          </a>
          <a
            className={
              "tab grow px-3 text-nord-4 transition-all duration-[400ms] xs:grow-0 " +
              (activeTab === ActiveTab.Details && "tab-active")
            }
            onClick={() => setActiveTab(ActiveTab.Details)}
          >
            {collapseTabs ? (
              <InformationCircleIcon className="h-5" />
            ) : (
              "Details"
            )}
          </a>
        </div>
      )}
    </div>
  );
}

export default AssistantAreaHeader;
