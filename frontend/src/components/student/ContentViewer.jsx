
import React from 'react';
import { Play, FileText, HelpCircle } from 'lucide-react';

const ContentViewer = ({ selectedItem, selectedType, title }) => {
  
  const renderViewer = () => {
    // Fix: Check for empty string, null, undefined, or missing values
    if (!selectedItem || !selectedType || selectedItem === '' || selectedType === '') {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[500px] rounded-xl p-8 border-2 border-dashed" style={{ backgroundColor: '#FFFDF6', borderColor: '#A0C878' }}>
          <div className="text-center text-gray-500 mb-6">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">Lesson Content Viewer</h3>
            <p>Select an item from the menu to view it here</p>
          </div>
          <div className="flex space-x-2 mt-4">
            <div className="w-3 h-3 rounded-full bg-green-400 animate-bounce"></div>
            <div className="w-3 h-3 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      );
    }

    switch (selectedType) {
      
      case 'video':
       
        return (
          <div className="h-full min-h-[500px] rounded-xl p-6 flex flex-col border" style={{ backgroundColor: '#FFFDF6', borderColor: '#A0C878' }}>
            <div className="flex items-center mb-4">
              <Play size={24} className="text-green-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-800">Now Playing: {title || 'Video'}</h3>
            </div>
            <div className="rounded-xl aspect-video flex-grow overflow-hidden bg-black">
              <video
                src={selectedItem}
                controls
                className="w-full h-full object-contain rounded-xl"
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-gray-600">Use the player controls above to watch the video.</p>
                <button
                  onClick={() => {
                    const video = document.querySelector('video');
                    if (video?.requestFullscreen) video.requestFullscreen();
                  }}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Full Screen
                </button>
              </div>
            </div>
          </div>
        );

      case 'file':
        const getFileExtension = (filePath) => {
          return filePath.split('.').pop().toLowerCase();
        };
      
        const getFileType = (extension) => {
          const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
          const documentTypes = ['pdf', 'doc', 'docx', 'txt', 'rtf'];
          const codeTypes = ['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'json', 'xml', 'py', 'java', 'cpp', 'c'];
          const archiveTypes = ['zip', 'rar', '7z', 'tar', 'gz'];
          
          if (imageTypes.includes(extension)) return 'image';
          if (documentTypes.includes(extension)) return 'document';
          if (codeTypes.includes(extension)) return 'code';
          if (archiveTypes.includes(extension)) return 'archive';
          return 'generic';
        };
        
        const fileExtension = getFileExtension(selectedItem);
        const fileType = getFileType(fileExtension);
        const fileName = selectedItem.split('/').pop();
        
        return (
          <div className="h-full min-h-[500px] rounded-xl p-6 flex flex-col border" style={{ backgroundColor: '#FFFDF6', borderColor: '#A0C878' }}>
            <div className="flex items-center mb-4">
              <FileText size={24} className="text-blue-500 mr-2" />
              <h3 className="text-xl font-semibold text-gray-800">File Viewer: {title || fileName}</h3>
            </div>
            <div className="bg-white border-2 border-gray-200 rounded-xl flex-grow flex flex-col">
              {fileType === 'image' ? (
                <div className="flex-grow flex items-center justify-center p-4">
                  <img 
                    src={selectedItem} 
                    alt={fileName}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div className="text-center hidden">
                    <FileText size={64} className="mx-auto mb-4 text-blue-400" />
                    <p className="text-lg font-medium text-gray-700">Image Preview Not Available</p>
                    <p className="text-gray-600 mt-2">{fileName}</p>
                  </div>
                </div>
              ) : fileType === 'document' && fileExtension === 'pdf' ? (
                <div className="flex-grow">
                  <iframe 
                    src={selectedItem}
                    className="w-full h-full min-h-[400px] rounded-lg"
                    title={title}
                  />
                </div>
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center p-8">
                  <div className="text-center mb-6">
                    <FileText size={64} className="mx-auto mb-4 text-blue-400" />
                    <p className="text-lg font-medium text-gray-700 capitalize">{fileType} File</p>
                    <p className="text-gray-600 mt-2">{fileName}</p>
                    <p className="text-sm text-gray-500 mt-1 uppercase">{fileExtension} format</p>
                  </div>
                </div>
              )}
              
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">File type:</span> {fileExtension.toUpperCase()} • 
                    <span className="font-medium ml-2">Category:</span> {fileType}
                  </div>
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => window.open(selectedItem, '_blank')}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                    >
                      <FileText size={16} className="mr-2" />
                      Open File
                    </button>
                    <a 
                      href={selectedItem}
                      download={fileName}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors inline-flex items-center"
                    >
                      Download
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'quiz':
        return (
          <div className="h-full min-h-[500px] rounded-xl p-6 flex flex-col border" style={{ backgroundColor: '#FFFDF6', borderColor: '#A0C878' }}>
            <div className="flex items-center mb-4">
              <HelpCircle size={24} className="text-purple-500 mr-2" />
              <h3 className="text-xl font-semibold text-gray-800">Quiz: {title || 'Assessment'}</h3>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 flex-grow flex flex-col">
              <div className="text-center mb-6 py-4">
                <HelpCircle size={64} className="mx-auto mb-4 text-purple-400" />
                <p className="text-lg font-medium text-gray-700">Ready to test your knowledge?</p>
                <p className="text-gray-600 mt-2 max-w-md mx-auto">{title || 'This quiz'} will assess your understanding of key concepts</p>
              </div>
              <div className="space-y-4 mt-auto">
                <div className="p-4 border rounded-xl bg-gray-50">
                  <p className="font-medium text-gray-800">Sample Question</p>
                  <p className="text-gray-600 mt-2">What is the virtual DOM in React?</p>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {['JavaScript object', 'Browser DOM', 'Server component', 'CSS framework'].map((opt, i) => (
                      <div key={i} className="p-3 border rounded-lg bg-white text-gray-700 hover:bg-gray-50 cursor-pointer">
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
                <button className="w-full py-3.5 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors font-medium flex items-center justify-center">
                  <HelpCircle size={20} className="mr-2" />
                  Start Quiz Now
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-full min-h-[500px] rounded-xl p-8 border-2 border-dashed" style={{ backgroundColor: '#FFFDF6', borderColor: '#A0C878' }}>
            <div className="text-center text-gray-500 mb-6">
              <div className="text-5xl mb-4">❓</div>
              <h3 className="text-xl font-semibold mb-2">Unknown Content Type</h3>
              <p>Content type "{selectedType}" is not supported</p>
              <p className="text-sm mt-2">Selected item: {selectedItem}</p>
            </div>
          </div>
        );
    }
  };

  return renderViewer();
};

export default ContentViewer;