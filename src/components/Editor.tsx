import React, { useEffect, useRef, useState } from 'react';
import { useFileContext } from './provider';

const Editor: React.FC = () => {
 
  const editorRef = useRef<HTMLDivElement>(null);
  const {currentFile,updateFileContent, currentTheme} = useFileContext();
 

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {

    updateFileContent(currentFile?.id as string,e.currentTarget.innerText)
  };


  
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


useEffect(() => {
    const highlightSyntax = () => {
      if (!editorRef.current) return;
  
     
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
  
     
      const range = selection.getRangeAt(0);
     
      const preCaretRange = range.cloneRange();
     
      preCaretRange.selectNodeContents(editorRef.current);
  
      preCaretRange.setEnd(range.startContainer, range.startOffset);
      const caretOffset = preCaretRange.toString().length;
   
      
      
     
      editorRef.current.innerHTML =currentFile?.content || "";
      
    
      const textNodes = getTextNodes(editorRef.current);
 
      let offset = caretOffset;
  
      let node = null;
      for (let i = 0; i < textNodes.length; i++) {
        
          if (offset <= textNodes[i].textContent!.length) {
              node = textNodes[i];
              break;
            }
            offset = textNodes[i].textContent!.length + 1;
        }
        
   
      if (node) {
        const newRange = document.createRange();
        newRange.setStart(node, offset);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    };
  
    const getTextNodes = (node: Node) => {
      const textNodes: Text[] = [];
      const walk = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null);
      let n;
      while ((n = walk.nextNode())) {
        textNodes.push(n as Text);
      }
      return textNodes;
    };
  
    highlightSyntax();
  }, [currentFile]);
  
  

  return (
    <div
      id="editor"
      ref={editorRef}
      contentEditable={true}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      
      className={`w-full h-full border overflow-y-scroll transition-all duration-300 ease-in-out ${currentTheme.borderColor} pt-10 pl-5 font-mono text-sm overflow-y-scroll whitespace-pre-wrap ${currentTheme.editorBg} outline-none ${currentTheme.editorText}`}
    />
  );
};

export default Editor;
