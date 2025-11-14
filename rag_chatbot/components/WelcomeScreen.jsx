'use client';
import { useState, useRef } from 'react';
import { Send, Paperclip, Mic, MessageSquare, FileText, X } from 'lucide-react';

export default function WelcomeScreen({ onSendMessage, onFileAction, darkMode }) {
    const [input, setInput] = useState('');
    const [fileUploaded, setFileUploaded] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState("");
    const [uploadedFileContent, setUploadedFileContent] = useState("");
    const fileRef = useRef();

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const text = await file.text();
        setUploadedFileContent(text);
        setUploadedFileName(file.name);
        setFileUploaded(true);
    };

    const handleSubmit = () => {
        if (!input.trim()) return;

        if (fileUploaded) {
            onFileAction(input.trim(), uploadedFileContent);
            setFileUploaded(false);
            setUploadedFileName("");
            setUploadedFileContent("");
        } else {
            onSendMessage(input.trim());
        }

        setInput('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className={`flex-1 flex items-center justify-center px-4 transition-colors ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
            <div className="max-w-3xl w-full">

                {/* HEADER */}
                <div className="text-center mb-8">
                    <div className={`w-15 h-15 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg ${darkMode ? 'bg-purple-700' : 'bg-purple-600'}`}>
                        <MessageSquare className="w-10 h-10 text-white" />
                    </div>
                    <h1 className={`text-2xl font-bold sm:text-4xl mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        RAG Chatbot
                    </h1>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Hello! File upload karein ya kuch bhi pooch sakte hain.
                    </p>
                </div>

                {/* INPUT AREA */}
                <div className="relative">
                    <div className={`flex items-center gap-3 
                        rounded-2xl px-4 py-3 shadow-sm hover:shadow-md transition-shadow
                        ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-300'}`}>

                        {/* FILE UPLOAD BUTTON */}
                        <button
                            onClick={() => fileRef.current.click()}
                            className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
                        >
                            <Paperclip className="w-5 h-5 text-purple-600" />
                        </button>

                        <input
                            type="file"
                            ref={fileRef}
                            onChange={handleFileSelect}
                            className="hidden"
                            accept=".pdf,.txt,.docx"
                        />

                        {/* FILE CHIP */}
                        {fileUploaded && (
                            <div className="flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                                <FileText className="w-4 h-4" />
                                <span className="max-w-[80px] truncate">{uploadedFileName}</span>
                                <X
                                    className="w-4 h-4 cursor-pointer"
                                    onClick={() => {
                                        setFileUploaded(false);
                                        setUploadedFileName("");
                                        setUploadedFileContent("");
                                    }}
                                />
                            </div>
                        )}

                        {/* USER INPUT */}
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={fileUploaded ? "File uploaded — batao kya karna hai..." : "Message RAG Chatbot..."}
                            className={`flex-1 bg-transparent border-none outline-none
                                ${darkMode ? 'text-gray-100 placeholder-gray-400' : 'text-gray-800 placeholder-gray-500'}`}
                        />

                        <Mic className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`} />

                        <button
                            onClick={handleSubmit}
                            disabled={!input.trim()}
                            className={`p-2 rounded-lg transition-colors
                                ${!input.trim() ? (darkMode ? 'bg-gray-600' : 'bg-gray-300') : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            <Send className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
