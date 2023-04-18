import ReactMarkdown from "react-markdown";
import remarkGFM from "remark-gfm";

function CustomRemark({
  content,
  success,
}: {
  content: string;
  success: boolean;
}) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGFM]}
      className={
        "prose !prose-nord max-w-none px-5" +
        (success
          ? "prose-code:bg-nord-4/10"
          : "prose-p:text-red-300 prose-a:text-red-300 prose-strong:text-red-300 prose-code:bg-red-300/10 prose-code:text-red-100")
      }
    >
      {content}
    </ReactMarkdown>
  );
}

export default CustomRemark;
