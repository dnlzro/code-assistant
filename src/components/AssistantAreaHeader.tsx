import { ActiveTab } from "./AssistantArea";

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
  return (
    <div class="sticky top-0 z-20 flex min-h-[40px] flex-row items-center justify-between bg-gradient-to-b from-nord-0 to-transparent px-5 pb-2 pt-5 backdrop-blur-md">
      <h2 class="text-2xl font-bold">Assistant says...</h2>
      {/* Display tabs when response is successful */}
      {success && (
        <div className="tabs tabs-boxed bg-nord-2/50">
          <a
            className={
              "tab px-3 text-nord-4 " +
              (activeTab === ActiveTab.Explanation && "tab-active")
            }
            onClick={() => setActiveTab(ActiveTab.Explanation)}
          >
            Explanation
          </a>
          <a
            className={
              "tab px-3 text-nord-4 " +
              (activeTab === ActiveTab.Details && "tab-active")
            }
            onClick={() => setActiveTab(ActiveTab.Details)}
          >
            Details
          </a>
        </div>
      )}
    </div>
  );
}

export default AssistantAreaHeader;
