// RichTextEditor.tsx
import React, { useRef } from "react";
import { Editor as TinyMCEEditor } from "tinymce";
import { Editor } from "@tinymce/tinymce-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  height?: number;
  readOnly?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter description...",
  className = "",
  height = 300,
  readOnly = false,
}) => {
  const editorRef = useRef<TinyMCEEditor | null>(null);

  const handleEditorChange = (content: string) => {
    onChange(content);
  };

  return (
    <div className={`rich-text-editor ${className}`}>
      <Editor
        apiKey={import.meta.env.VITE_TINYMCE_KEY}
       onInit={(_evt: unknown, editor:unknown) => {
  editorRef.current = editor as TinyMCEEditor; 
}}

        value={value}
        onEditorChange={handleEditorChange}
        disabled={readOnly}
        init={{
          height,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "help",
            "wordcount",
            "paste",
            "textcolor"
          ],

          toolbar_mode: "sliding",
          toolbar:
            "undo redo | blocks | bold italic | forecolor backcolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | removeformat | help",
          content_style: `
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              font-size: 14px;
              line-height: 1.5;
            }
          `,
          placeholder,
          paste_data_images: true,
          paste_word_valid_elements:
            "b,strong,i,em,h1,h2,h3,h4,h5,h6,p,ol,ul,li,a,span,div,br",
          paste_retain_style_properties: "color font-size font-family background-color",
          branding: false,
          setup: (editor) => {
            editor.on("focus", () => {
              const container = editor.getContainer();
              if (container) {
                container.style.borderColor = "#a855f7";
                container.style.boxShadow = "0 0 0 1px #a855f7";
              }
            });
            editor.on("blur", () => {
              const container = editor.getContainer();
              if (container) {
                container.style.borderColor = "#e2e8f0";
                container.style.boxShadow = "none";
              }
            });
          },
        }}
      />

      {/* CSS styles */}
      <style>{`
        .rich-text-editor .tox .tox-editor-container {
          border-radius: 0.5rem;
        }
        .rich-text-editor .tox .tox-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
        }
        .rich-text-editor .tox .tox-edit-area {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;