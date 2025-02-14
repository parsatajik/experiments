import ReactMarkdown from "react-markdown";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark as oneDarkStyle } from "react-syntax-highlighter/dist/cjs/styles/prism";
import tsx from "react-syntax-highlighter/dist/cjs/languages/prism/tsx";
import typescript from "react-syntax-highlighter/dist/cjs/languages/prism/typescript";
import javascript from "react-syntax-highlighter/dist/cjs/languages/prism/javascript";
import python from "react-syntax-highlighter/dist/cjs/languages/prism/python";

// Register languages for syntax highlighting
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('python', python);

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      className="prose prose-sm max-w-none dark:prose-invert prose-pre:p-0"
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          
          if (inline) {
            return (
              <code className="px-1 py-0.5 rounded-md bg-gray-200 text-gray-800 text-sm" {...props}>
                {children}
              </code>
            );
          }

          return match ? (
            <div className="rounded-lg overflow-hidden">
              <SyntaxHighlighter
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                style={oneDarkStyle as any}
                language={match[1]}
                PreTag="div"
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold mb-4 mt-6 text-gray-800">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-bold mb-3 mt-5 text-gray-800">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-bold mb-2 mt-4 text-gray-800">{children}</h3>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-inside mb-4 space-y-1 text-gray-800">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-800">{children}</ol>
        ),
        a: ({ children, href }) => (
          <a
            href={href}
            className="text-blue-600 hover:text-blue-800 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-700">
            {children}
          </blockquote>
        ),
        p: ({ children }) => (
          <p className="mb-4 last:mb-0 text-gray-800">{children}</p>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto my-4">
            <table className="min-w-full divide-y divide-gray-300 text-gray-800">
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => (
          <th className="px-3 py-2 bg-gray-100 font-semibold text-left text-gray-800">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-3 py-2 border-t text-gray-800">{children}</td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
