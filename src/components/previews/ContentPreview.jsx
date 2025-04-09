import React from "react";
import ReactMarkdown from "react-markdown";
import remarkParse from "remark-parse";
import remarkHtml from "remark-html";
import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
// Import untuk KaTeX
import 'katex/dist/katex.min.css';

/**
 * Komponen untuk menampilkan preview konten dari HTML (Quill) dengan tampilan yang lebih profesional
 * Mendukung mode HTML langsung atau konversi ke Markdown untuk tampilan yang lebih bersih
 *
 * @param {Object} props - Properties komponen
 * @param {string} props.content - Konten HTML yang akan ditampilkan
 * @param {string} props.title - Judul untuk bagian preview
 * @param {string} props.mode - Mode tampilan: 'html' (default) atau 'markdown'
 * @param {string} props.className - Class tambahan
 * @param {object} props.themeColor - Warna tema
 */
const ContentPreview = ({
  content,
  title = "Preview Konten",
  mode = "html",
  className = "",
  themeColor = "#0369a1",
}) => {
  // State untuk menyimpan konten markdown jika diperlukan
  const [markdownContent, setMarkdownContent] = React.useState("");

  // Konversi HTML ke Markdown untuk tampilan yang lebih bersih jika mode markdown
  React.useEffect(() => {
    if (mode === "markdown" && content) {
      // Fungsi untuk konversi dari HTML ke Markdown menggunakan remark/rehype
      const convertHtmlToMarkdown = async () => {
        try {
          // Gunakan library rehype dan remark untuk konversi
          const { unified } = await import("unified");
          const processor = unified()
            .use(rehypeParse, { fragment: true })
            .use(rehypeRemark)
            .use(remarkParse)
            .use(remarkHtml);

          const result = await processor.process(content);
          setMarkdownContent(String(result));
        } catch (error) {
          console.error("Error converting HTML to Markdown:", error);
          // Fallback: gunakan HTML langsung jika konversi gagal
          setMarkdownContent("");
        }
      };

      convertHtmlToMarkdown();
    }
  }, [content, mode]);

  // Jika tidak ada konten, jangan tampilkan apa-apa
  if (!content) return null;

  return (
    <div className={`content-preview-container ${className} dark:bg-gray-900 dark:text-white`}>
      <style jsx>{`
        .content-preview-container {
          background-color: white;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
          overflow: hidden;
          margin-top: 1.5rem;
        }

        .preview-header {
          padding: 1rem 1.5rem;
          background-color: ${themeColor};
          color: white;
          font-weight: 600;
          font-size: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .preview-body {
          padding: 1.5rem;
          max-height: 600px;
          overflow-y: auto;
        }

        .content-preview {
          background-color: white;
          border-radius: 0.375rem;
          border: 1px solid #e2e8f0;
          padding: 1.5rem;
          line-height: 1.6;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 0.975rem;
        }

        /* Preview content styling - applied to the HTML content */
        :global(.preview-content-html) {
          margin-bottom: 1rem;
        }

        :global(.preview-content-html h1) {
          font-size: 1.75rem;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          font-weight: 700;
          color: #1a202c;
        }

        :global(.preview-content-html h2) {
          font-size: 1.5rem;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #1a202c;
        }

        :global(.preview-content-html h3) {
          font-size: 1.25rem;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #1a202c;
        }

        :global(.preview-content-html p) {
          margin-bottom: 1rem;
        }

        :global(.preview-content-html a) {
          color: ${themeColor};
          text-decoration: underline;
        }

        :global(.preview-content-html blockquote) {
          border-left: 4px solid #cbd5e0;
          padding-left: 1rem;
          font-style: italic;
          margin: 1rem 0;
          color: #4a5568;
        }

        /* Styling untuk gambar */
        .content-preview img {
          max-width: 400px !important;
          width: auto !important;
          height: auto !important;
          display: block !important;
          margin: 0.5rem auto !important;
        }

        /* Styling untuk video embed (YouTube, dll) */
        :global(.preview-content-html iframe.ql-video),
        :global(.preview-content-html iframe[src*="youtube.com"]),
        :global(.preview-content-html iframe[src*="youtu.be"]) {
          max-width: 400px !important;
          width: 100% !important;
          height: 225px !important; /* Rasio aspek 16:9 */
          display: block !important;
          margin: 0.5rem auto !important;
          border: none !important;
        }

        /* Styling untuk audio embed (SoundCloud, dll) */
        :global(.preview-content-html audio),
        :global(.preview-content-html iframe[src*="soundcloud.com"]) {
          max-width: 400px !important;
          width: 100% !important;
          display: block !important;
          margin: 0.5rem auto !important;
        }

        /* Styling untuk iframe lainnya */
        :global(.preview-content-html iframe:not(.ql-video):not([src*="youtube.com"]):not([src*="youtu.be"]):not([src*="soundcloud.com"])) {
          max-width: 400px !important;
          width: 100% !important;
          display: block !important;
          margin: 0.5rem auto !important;
          border: 1px solid #e2e8f0 !important;
        }

        :global(.preview-content-html .media-container) {
          margin: 1rem 0;
          padding: 0.5rem;
          background-color: #f8f9fa;
          border-radius: 4px;
          border: 1px solid #e2e8f0;
        }

        :global(.preview-content-html ol) {
          list-style-type: decimal !important;
          margin-left: 1.5em !important;
          padding-left: 1em !important;
          margin-bottom: 1rem;
        }

        :global(.preview-content-html ul) {
          list-style-type: disc !important;
          margin-left: 1.5em !important;
          padding-left: 1em !important;
          margin-bottom: 1rem;
        }

        :global(.preview-content-html li) {
          display: list-item !important;
          margin-bottom: 0.5em !important;
        }

        /* Dark mode styles */
        :global(.dark) .content-preview-container {
          background-color: #1a202c;
        }

        :global(.dark) .content-preview {
          background-color: #1a202c;
          border-color: #4a5568;
          color: white;
        }

        :global(.dark) :global(.preview-content-html h1),
        :global(.dark) :global(.preview-content-html h2),
        :global(.dark) :global(.preview-content-html h3) {
          color: white;
        }

        :global(.dark) :global(.preview-content-html blockquote) {
          color: #cbd5e0;
          border-color: #4a5568;
        }

        :global(.dark) :global(.preview-content-html .media-container) {
          background-color: #2d3748;
          border-color: #4a5568;
        }

        :global(.dark) :global(.preview-content-html iframe:not(.ql-video):not([src*="youtube.com"]):not([src*="youtu.be"]):not([src*="soundcloud.com"])) {
          border-color: #4a5568 !important;
        }
        
        /* Styling untuk formula matematika */
        :global(.preview-content-html .katex) {
          font-size: 1.1em;
          line-height: 1.2;
          text-indent: 0;
          text-rendering: auto;
        }
        
        :global(.preview-content-html .ql-formula) {
          display: inline-block;
          vertical-align: middle;
          margin: 0 0.2em;
          padding: 0.2em 0.4em;
          font-size: 1.05em;
        }

        /* Dark mode styles */
        .dark .preview-header {
          background-color: #2d3748;
        }

        .dark .content-preview {
          background-color: #2d3748;
          border-color: #4a5568;
        }

        .dark .content-preview a {
          color: ${themeColor};
        }

        .dark .preview-content-html h1,
        .dark .preview-content-html h2,
        .dark .preview-content-html h3 {
          color: white;
        }

        .dark .preview-content-html blockquote {
          color: #cbd5e0;
          border-color: #4a5568;
        }

        .dark .preview-content-html .media-container {
          background-color: #2d3748;
          border-color: #4a5568;
        }

        .dark .preview-content-html iframe:not(.ql-video):not([src*="youtube.com"]):not([src*="youtu.be"]):not([src*="soundcloud.com"]) {
          border-color: #4a5568 !important;
        }

        /* Styling untuk formula matematika */
        .dark .preview-content-html .katex {
          color: white;
        }

        .dark .preview-content-html .ql-formula {
          color: white;
        }
      `}</style>

      <div className="preview-header" style={{ backgroundColor: themeColor }}>
        <h2>{title}</h2>
      </div>

      <div className="preview-body">
        <div className="content-preview">
          {mode === "html" ? (
            <div
              dangerouslySetInnerHTML={{ __html: content }}
              className="preview-content-html"
            />
          ) : (
            <ReactMarkdown>{markdownContent || content}</ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentPreview;