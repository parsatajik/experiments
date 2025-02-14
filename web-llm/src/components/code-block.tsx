import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import tsx from "react-syntax-highlighter/dist/cjs/languages/prism/tsx";
import typescript from "react-syntax-highlighter/dist/cjs/languages/prism/typescript";
import javascript from "react-syntax-highlighter/dist/cjs/languages/prism/javascript";
import python from "react-syntax-highlighter/dist/cjs/languages/prism/python";
import { cn } from "@/lib/utils";

// Register languages for syntax highlighting
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('python', python);

interface CodeBlockProps {
  className?: string;
  children: any;
}

export function CodeBlock({
  className,
  children,
}: CodeBlockProps) {
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : 'text';

  return (
    <div className="not-prose relative">
      <div className="absolute right-2 top-2 text-xs text-zinc-400">
        {language}
      </div>
      <SyntaxHighlighter
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        style={oneDark as any}
        language={language}
        PreTag="div"
        className={cn(
          "rounded-xl !bg-zinc-900 !p-4 border border-zinc-200 dark:border-zinc-700",
          "text-sm overflow-x-auto"
        )}
        customStyle={{
          margin: 0,
          background: "transparent",
        }}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  );
}
