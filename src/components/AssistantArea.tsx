import { DotLoader } from "react-spinners";
import ReactMarkdown from "react-markdown";
import remarkGFM from "remark-gfm";

function AssistantArea({
  response,
  inProgress,
}: {
  response: {
    success: boolean;
    data: string;
  } | null;
  inProgress: boolean;
}) {
  return (
    <div class="assistant-container overflow-y-auto rounded-xl bg-nord-0 p-5 text-nord-6 md:grow">
      {inProgress ? (
        <div class="flex h-full w-full flex-col items-center justify-center gap-8">
          <DotLoader color="#88C0D0" size="4rem" />
          <span class="text-center leading-tight text-nord-3">
            Generating response...
          </span>
        </div>
      ) : response ? (
        <>
          <ReactMarkdown
            remarkPlugins={[remarkGFM]}
            className={
              "prose !prose-nord " +
              (!response.success
                ? "prose-p:text-red-300 prose-a:text-red-300 prose-strong:text-red-300 prose-code:bg-red-300/10 prose-code:text-red-100"
                : "prose-code:bg-nord-4/10")
            }
          >
            {`### Assistant says...
` + response.data}
          </ReactMarkdown>
        </>
      ) : (
        <div class="prose !prose-nord">
          <h3>Assistant says...</h3>
          <p class="text-nord-4/75">Waiting to receive input.</p>
        </div>
      )}
    </div>
  );
}

export default AssistantArea;
