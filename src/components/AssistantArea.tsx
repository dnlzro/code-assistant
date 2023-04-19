import { DotLoader, PulseLoader } from "react-spinners";
import { useState } from "preact/hooks";
import AssistantAreaHeader from "./AssistantAreaHeader";
import { FullResponse } from "../types";
import CustomRemark from "./CustomRemark";
import EmptyProse from "./EmptyProse";
import { AnimatePresence, motion } from "framer-motion";

export enum ActiveTab {
  Explanation,
  Details,
}

function getConfidencePercent(data: string) {
  const lines = data.split("\n\n");
  return lines[0].replace("Confidence: ", "").replace("%", "");
}

function getConfidenceExplanation(data: string) {
  const lines = data.split("\n\n");
  return lines[1].replace("Explanation: ", "");
}

function AssistantArea({
  response,
  inProgress,
}: {
  response: FullResponse;
  inProgress: boolean;
}) {
  const [activeTab, setActiveTab] = useState(ActiveTab.Explanation);
  let { explanation, confidence, assumptions, resources } = response;

  if (inProgress && !response.explanation) {
    // Loading explanation
    return (
      <div class="flex h-full w-full flex-col items-center justify-center gap-8 rounded-xl bg-nord-0 py-16">
        <DotLoader color="#88C0D0" size="4rem" />
        <span class="text-center leading-tight text-nord-3">
          Generating response...
        </span>
      </div>
    );
  }

  return (
    <div class="assistant-container overflow-y-auto rounded-xl bg-nord-0 pb-5 pt-0 text-nord-6 md:grow">
      <AssistantAreaHeader
        success={explanation?.success ? true : false}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <AnimatePresence initial={false}>
        {explanation && activeTab === ActiveTab.Explanation ? (
          <motion.div
            key="explanation"
            initial={{ opacity: 0, x: -150 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: { ease: "easeOut", duration: 0.2, delay: 0.2 },
            }}
            exit={{
              opacity: 0,
              x: -150,
              transition: { ease: "easeOut", duration: 0.2 },
            }}
          >
            <CustomRemark
              content={explanation.data}
              success={explanation.success}
            ></CustomRemark>
          </motion.div>
        ) : explanation && activeTab === ActiveTab.Details ? (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 150 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: { ease: "easeOut", duration: 0.2, delay: 0.2 },
            }}
            exit={{
              opacity: 0,
              x: 150,
              transition: { ease: "easeOut", duration: 0.2 },
            }}
          >
            <h3 class="px-5 text-lg font-bold">Confidence</h3>
            {inProgress && !confidence ? (
              <div class="px-5 py-4">
                <PulseLoader color="#88C0D0" size="1rem" />
              </div>
            ) : confidence ? (
              <>
                <div className="stat gap-2 px-5 pt-1">
                  <div className="stat-value">
                    {getConfidencePercent(confidence.data)}%
                  </div>
                  <progress
                    class="progress progress-primary h-4 w-56 bg-nord-3"
                    value={getConfidencePercent(confidence.data)}
                    max="100"
                  ></progress>
                </div>
                <CustomRemark
                  content={getConfidenceExplanation(confidence.data)}
                  success={confidence.success}
                ></CustomRemark>
              </>
            ) : (
              <EmptyProse />
            )}
            <h3 class="px-5 pt-4 text-lg font-bold">Assumptions</h3>
            {inProgress && !assumptions ? (
              <div class="px-5 py-4">
                <PulseLoader color="#88C0D0" size="1rem" />
              </div>
            ) : assumptions ? (
              <CustomRemark
                content={assumptions.data}
                success={assumptions.success}
              ></CustomRemark>
            ) : (
              <EmptyProse />
            )}
            <h3 class="px-5 pt-4 text-lg font-bold">Additional Resources</h3>
            {inProgress && !resources ? (
              <div class="px-5 py-4">
                <PulseLoader color="#88C0D0" size="1rem" />
              </div>
            ) : resources ? (
              <CustomRemark
                content={resources.data}
                success={resources.success}
              ></CustomRemark>
            ) : (
              <EmptyProse />
            )}
          </motion.div>
        ) : (
          // Initial state
          <EmptyProse />
        )}
      </AnimatePresence>
    </div>
  );
}

export default AssistantArea;
