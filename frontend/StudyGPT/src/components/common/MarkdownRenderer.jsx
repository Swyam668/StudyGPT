// this module is used for proper (human-readable) rendering of chat strings we get from the server
// becoz that might use bullet points, emphasized text, italics, bolds, which you know how they render in browser 
// nice rendering in browser, becoz browser does not understand direct plain strings, it underestands HTML elements 

import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from "react-syntax-highlighter/dist/esm/styles/hljs";
// try this if above does not work
// import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

const MarkdownRenderer = ({content}) => {
    return (
        <div className="w-full space-y-3 text-cyan-100 leading-relaxed">
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      h1: ({ node, ...props }) => (
        <h1
          className="text-2xl md:text-3xl font-semibold text-cyan-300 mt-6 mb-3 tracking-wide"
          {...props}
        />
      ),
      h2: ({ node, ...props }) => (
        <h2
          className="text-xl md:text-2xl font-semibold text-cyan-300 mt-5 mb-2"
          {...props}
        />
      ),
      h3: ({ node, ...props }) => (
        <h3
          className="text-lg md:text-xl font-medium text-cyan-200 mt-4 mb-2"
          {...props}
        />
      ),
      h4: ({ node, ...props }) => (
        <h4
          className="text-base md:text-lg font-medium text-cyan-200 mt-3 mb-1"
          {...props}
        />
      ),

      p: ({ node, ...props }) => (
        <p
          className="text-sm md:text-base text-cyan-100/90 leading-6"
          {...props}
        />
      ),

      a: ({ node, ...props }) => (
        <a
          className="text-cyan-400 underline underline-offset-4 hover:text-cyan-300 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        />
      ),

      ul: ({ node, ...props }) => (
        <ul
          className="list-disc list-inside pl-3 space-y-1 text-cyan-100/90"
          {...props}
        />
      ),
      ol: ({ node, ...props }) => (
        <ol
          className="list-decimal list-inside pl-3 space-y-1 text-cyan-100/90"
          {...props}
        />
      ),
      li: ({ node, ...props }) => (
        <li className="marker:text-cyan-400" {...props} />
      ),

      strong: ({ node, ...props }) => (
        <strong className="font-semibold text-cyan-200" {...props} />
      ),
      em: ({ node, ...props }) => (
        <em className="italic text-cyan-300/90" {...props} />
      ),

      blockquote: ({ node, ...props }) => (
        <blockquote
          className="
            border-l-2 border-cyan-400/50
            pl-4 py-2 my-3
            bg-cyan-500/5
            text-cyan-200/90
            italic rounded-r-lg
          "
          {...props}
        />
      ),

      code: ({ node, inline, className, children, ...props }) => {
        const match = /language-(\w+)/.exec(className || '');
        return !inline && match ? (
          <div className="my-4 rounded-xl overflow-hidden border border-cyan-400/30 shadow-[0_0_25px_rgba(34,211,238,0.15)]">
            <SyntaxHighlighter
              style={dracula}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          </div>
        ) : (
          <code
            className="
              px-1.5 py-0.5 rounded-md
              bg-cyan-400/10
              text-cyan-300
              text-xs md:text-sm
              border border-cyan-400/20
            "
            {...props}
          >
            {children}
          </code>
        );
      },

      pre: ({ node, ...props }) => (
        <pre
          className="overflow-x-auto rounded-xl"
          {...props}
        />
      ),
    }}
  >
    {content}
  </ReactMarkdown>
</div>

    )
}

export default MarkdownRenderer