'use client';
import { useState, useRef } from 'react';
import { Send, FileText, X, Paperclip } from 'lucide-react';

export default function InputBox({ onSend, onFileAction, fileUploaded, setFileUploaded, uploadedFileName, handleFileSelect, disabled }) {
  const [text, setText] = useState('');
  const fileRef = useRef();

  const handleSend = () => {
    if (!text.trim()) return;

    if (fileUploaded) {
      onFileAction(text);
      setFileUploaded(false);
    } else {
      onSend(text);
    }

    setText('');
  };

  return (
    <div className="p-3 border-t border-gray-200 dark:border-gray-700">
      <div className="flex gap-2 items-center">
        {/* Upload button */}
        <button onClick={() => fileRef.current.click()} className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
          <Paperclip className="w-5 h-5 text-purple-600" />
        </button>

        <input
          type="file"
          ref={fileRef}
          onChange={handleFileSelect}
          className="hidden"
          accept=".pdf,.txt,.docx"
        />

        {/* File chip */}
        {fileUploaded && (
          <div className="flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
            <FileText className="w-4 h-4" />
            <span className="max-w-[80px] truncate">{uploadedFileName}</span>
            <X className="w-4 h-4 cursor-pointer" onClick={() => setFileUploaded(false)} />
          </div>
        )}

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={fileUploaded ? "File uploaded — batao kya karna hai..." : "Ask something..."}
          className="flex-1 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none"
          disabled={disabled}
        />

        <button onClick={handleSend} className="p-2 bg-purple-600 text-white rounded-lg" disabled={disabled}>
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
