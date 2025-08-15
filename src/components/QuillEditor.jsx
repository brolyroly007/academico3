import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import '../styles/quill-custom.css';

const QuillEditor = ({ 
  value = '', 
  onChange = () => {}, 
  placeholder = 'Comience a escribir...', 
  className = '',
  readOnly = false 
}) => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  // Configuración de módulos
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'color', 'background',
    'align', 'script', 'code-block'
  ];

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      // Inicializar Quill
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules,
        formats,
        placeholder,
        readOnly
      });

      // Event listener para cambios
      quillRef.current.on('text-change', () => {
        const html = quillRef.current.root.innerHTML;
        onChange(html);
      });

      setIsReady(true);
    }
  }, []);

  // Actualizar contenido cuando value cambia
  useEffect(() => {
    if (quillRef.current && isReady) {
      const currentContent = quillRef.current.root.innerHTML;
      if (currentContent !== value) {
        quillRef.current.root.innerHTML = value;
      }
    }
  }, [value, isReady]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (quillRef.current) {
        quillRef.current = null;
      }
    };
  }, []);

  // Métodos públicos
  const getEditor = () => quillRef.current;
  
  const insertHTML = (html) => {
    if (quillRef.current) {
      const selection = quillRef.current.getSelection();
      const index = selection ? selection.index : quillRef.current.getLength();
      quillRef.current.clipboard.dangerouslyPasteHTML(index, html);
    }
  };

  const focus = () => {
    if (quillRef.current) {
      quillRef.current.focus();
    }
  };

  // Exponer métodos a través de ref
  React.useImperativeHandle(React.forwardRef(() => null), () => ({
    getEditor,
    insertHTML,
    focus
  }));

  return (
    <div className={`quill-container ${className}`}>
      <div ref={editorRef} className="quill-editor" />
    </div>
  );
};

export default QuillEditor;