import React, { memo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./code-block";

const components: Partial<Components> = {
  code({ inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    const language = match ? match[1] : "text";

    if (language === "text") {
      return (
        <span
          className="font-mono text-sm px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
          {...props}
        >
          {children}
        </span>
      );
    }

    return (
      <div className="not-prose relative">
        {language && (
          <div className="absolute right-2 top-2 text-xs text-zinc-400">
            {language}
          </div>
        )}
        <CodeBlock className={className} {...props}>
          {children}
        </CodeBlock>
      </div>
    );
  },
  pre: ({ children }) => <>{children}</>,
  ol: ({ node, children, ...props }) => {
    return (
      <ol className="list-decimal list-outside ml-4" {...props}>
        {children}
      </ol>
    );
  },
  li: ({ node, children, ...props }) => {
    return (
      <li className="py-1" {...props}>
        {children}
      </li>
    );
  },
  ul: ({ node, children, ...props }) => {
    return (
      <ul className="list-decimal list-outside ml-4" {...props}>
        {children}
      </ul>
    );
  },
  strong: ({ node, children, ...props }) => {
    return (
      <span className="font-semibold" {...props}>
        {children}
      </span>
    );
  },
  a: ({ node, children, ...props }) => {
    return (
      // @ts-expect-error
      <a
        className="text-blue-500 hover:underline"
        target="_blank"
        rel="noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  },
  h1: ({ node, children, ...props }) => {
    return (
      <h1 className="text-3xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h1>
    );
  },
  h2: ({ node, children, ...props }) => {
    return (
      <h2 className="text-2xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h2>
    );
  },
  h3: ({ node, children, ...props }) => {
    return (
      <h3 className="text-xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h3>
    );
  },
  h4: ({ node, children, ...props }) => {
    return (
      <h4 className="text-lg font-semibold mt-6 mb-2" {...props}>
        {children}
      </h4>
    );
  },
  h5: ({ node, children, ...props }) => {
    return (
      <h5 className="text-base font-semibold mt-6 mb-2" {...props}>
        {children}
      </h5>
    );
  },
  h6: ({ node, children, ...props }) => {
    return (
      <h6 className="text-sm font-semibold mt-6 mb-2" {...props}>
        {children}
      </h6>
    );
  },
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-zinc-300 dark:border-zinc-700 pl-4 italic my-4">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 font-semibold text-left">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 border-t border-zinc-200 dark:border-zinc-800">
      {children}
    </td>
  ),
};

const remarkPlugins = [remarkGfm];

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  return (
    <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
      {children}
    </ReactMarkdown>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children
);
