import React, { useEffect, useRef, useState } from 'react';

const Editor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState<string>('// Start writing your code here...');

  // Update state with editor content changes
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    console.log(e.currentTarget.innerText)
    setContent(e.currentTarget.innerText || '');
  };

  // Handle key events like Tab for indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      insertTab();
    }
    if(e.key === "Enter"){
        e.preventDefault()
        insertLine()
       
    }
  };

  const insertLine = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        
        // Create and insert a line break element
        const lineBreak = document.createElement('br');
        range.insertNode(lineBreak);

        // Create a new text node for typing
        // const newTextNode = document.createTextNode('');
        // range.insertNode(newTextNode);
        
        // Move the cursor to the position after the new text node
        range.setStartAfter(lineBreak);
        range.setEndAfter(lineBreak);
        
        // Clear the selection and set it to the new range
        selection.removeAllRanges();
        selection.addRange(range);

        // Focus on the editor to ensure the cursor is visible
        const editor = document.getElementById('editor');
        if (editor) {
            editor.focus();
        }

    }
};




  const insertTab = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const tabNode = document.createTextNode('    '); // Insert four spaces for Tab

    range.insertNode(tabNode);
    range.setStartAfter(tabNode);
    range.setEndAfter(tabNode);
    selection.removeAllRanges();
    // selection.addRange(range);
  };

  // Basic Syntax Highlighting (Example: for JavaScript)
  useEffect(() => {
    const highlightSyntax = () => {
      if (!editorRef.current) return;

    //   const keywords = ['function', 'const', 'let', 'var', 'if', 'else', 'return'];
      const highlightedContent = content;

      // Replace keywords with styled versions
    //   keywords.forEach((keyword) => {
    //     const regex = new RegExp(`\\b${keyword}\\b`, 'g');
    //     highlightedContent = highlightedContent.replace(
    //       regex,
    //       `<span class="keyword">${keyword}</span>`
    //     );
    //   });

      const selection = window.getSelection();
      const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
    
      const position = range?.startOffset || 0;

      // Update the content
      editorRef.current.innerHTML = highlightedContent;

      // Restore the cursor position
      const newRange = document.createRange();
      const textNode = editorRef.current.childNodes[0];
      console.log(position,textNode.textContent?.length)
      if (textNode) {
        newRange.setStart(textNode, Math.min(position, textNode.textContent?.length || 0));
        newRange.collapse(true);
        selection?.removeAllRanges();
        selection?.addRange(newRange);
      }
    };

    highlightSyntax();
  }, [content]);

  return (
    <div
      id="editor"
      ref={editorRef}
      contentEditable={true}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      className="w-full h-screen border border-gray-300 p-4 font-mono text-sm overflow-y-scroll whitespace-pre-wrap bg-gray-100 outline-none text-gray-800"
    />
  );
};

export default Editor;
