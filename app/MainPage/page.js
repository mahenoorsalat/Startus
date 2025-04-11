"use client"

import { useState } from 'react';

export default function Mainpage() {
  const [showModal, setShowModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadDates, setUploadDates] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  // Add states for prediction results
  const [predictions, setPredictions] = useState([]);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [isBackendProcessing, setIsBackendProcessing] = useState(false);

  const uploadToEndpoint = async (file, fileIndex) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      // Start upload process
      setUploading(true);
      setIsBackendProcessing(false);
      
      // Initialize upload progress
      setUploadProgress((prev) => {
        const newProgress = [...prev];
        newProgress[fileIndex] = 0;
        return newProgress;
      });
      
      // Simulate progress before the actual upload
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = [...prev];
          if (newProgress[fileIndex] >= 90) {
            clearInterval(progressInterval);
            return newProgress;
          }
          newProgress[fileIndex] += 10;
          return newProgress;
        });
      }, 300);
      
      // Actual upload to the endpoint
      const response = await fetch('https://kuoog311n5.execute-api.us-west-2.amazonaws.com', {
        method: 'POST',
        body: formData,
      });
      
      // Clear progress interval if it's still running
      clearInterval(progressInterval);
      
      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }
      
      // Complete the progress to 100%
      setUploadProgress((prev) => {
        const newProgress = [...prev];
        newProgress[fileIndex] = 100;
        return newProgress;
      });
      
      // Process response
      const resultData = await response.json();
      
      // Set backend processing state
      setIsBackendProcessing(true);
      
      // Simulate backend processing time (you would remove this in production)
      setTimeout(() => {
        // Add prediction result
        setPredictions(prev => {
          const newPredictions = [...prev];
          newPredictions[fileIndex] = resultData;
          return newPredictions;
        });
        
        // Set upload date
        setUploadDates((prevDates) => {
          const newDates = [...prevDates];
          newDates[fileIndex] = new Date().toLocaleDateString();
          return newDates;
        });
        
        setIsBackendProcessing(false);
        setProcessingComplete(true);
        setUploading(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error uploading file:', error);
      
      // Set progress to reflect error
      setUploadProgress((prev) => {
        const newProgress = [...prev];
        newProgress[fileIndex] = -1; // Use negative value to indicate error
        return newProgress;
      });
      
      setUploading(false);
    }
  };

  const handleUpload = (fileIndex) => {
    setShowModal(true);
    uploadToEndpoint(files[fileIndex], fileIndex);
  };

  const simulateFileSelect = (e) => {
    if (e.target.files?.length) {
      const newFiles = Array.from(e.target.files);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

      setFiles(newFiles);
      setFilePreviews(newPreviews);

      // Reset states when new files are selected
      setPredictions([]);
      setProcessingComplete(false);
    }
  };

  const handleUploadButtonClick = () => {
    if (files.length > 0) {
      files.forEach((_, index) => {
        handleUpload(index);
      });
    }
  };

  const handleDelete = (index) => {
    // Remove file from state by index
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);

    const newPreviews = [...filePreviews];
    newPreviews.splice(index, 1);
    setFilePreviews(newPreviews);

    setUploadProgress((prev) => {
      const newProgress = [...prev];
      newProgress.splice(index, 1);
      return newProgress;
    });

    const newUploadDates = [...uploadDates];
    newUploadDates.splice(index, 1);
    setUploadDates(newUploadDates);

    const newPredictions = [...predictions];
    newPredictions.splice(index, 1);
    setPredictions(newPredictions);
  };

  const handleReupload = () => {
    setShowModal(false);
    setUploading(false);
    setUploadProgress([]);
    setUploadDates([]);
    setFilePreviews([]);
    setPredictions([]);
    setProcessingComplete(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white p-4 shadow-sm">
        <div className="flex items-center">
          <div className="flex items-center">
            <div className="text-black font-bold text-xl flex items-center">
              <span className="mr-1">
                <svg viewBox="0 0 24 24" width="24" height="24" className="inline-block">
                  <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
                    <path d="M12 16a4 4 0 100-8 4 4 0 000 8z" />
                    <path d="M12 8v-2M12 18v-2M8 12h-2M18 12h-2" />
                  </g>
                </svg>
              </span>
              Stratus
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-white flex flex-col items-center justify-center relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full absolute">
            {[1, 2, 3, 4, 5].map((circle) => (
              <div 
                key={circle} 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-gray-200 rounded-full"
                style={{ 
                  width: `${circle * 20}%`, 
                  height: `${circle * 20}%`,
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-green-500 bg-white flex items-center justify-center relative overflow-hidden">
              <div
                className="absolute inset-0 border-4 border-transparent rounded-full"
                style={{
                  borderTopColor: '#97d700',
                  borderRightColor: '#97d700',
                  transform: 'rotate(45deg)',
                }}
              />
              <div className="text-center">
                <h2 className="text-gray-800 font-bold">Add Files</h2>
                <p className="text-sm text-gray-600">Click Here</p>
              </div>
            </div>
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={simulateFileSelect}
              multiple
            />
          </div>

          <div className="mt-4">
            <button 
              className={`bg-white text-black shadow-md px-6 py-2 rounded flex items-center ${files.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
              onClick={handleUploadButtonClick}
              disabled={files.length === 0}
            >
              Upload File <span className="ml-2">→</span>
            </button>
          </div>

          {/* File Preview Section */}
          {filePreviews.map((preview, index) => (
            <div key={index} className="mt-6 flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                <img src={preview} alt="file preview" className="w-10 h-10 rounded-full object-cover" />
              </div>
              <div>
                <div className="font-semibold">{files[index]?.name}</div>
                <div className="text-xs text-gray-500">{(files[index]?.size / 1024).toFixed(1) + "KB"}</div>
                <div className="mt-2 flex space-x-4">
                  <button className="text-red-500 text-xs" onClick={() => handleDelete(index)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Prediction Results Table */}
          {processingComplete && predictions.length > 0 && (
            <div className="mt-8 w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">Prediction Results</h3>
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prediction</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {predictions.map((prediction, index) => (
                      prediction && (
                        <tr key={index}>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 mr-3">
                                <img className="h-8 w-8 rounded-full object-cover" src={filePreviews[index]} alt="" />
                              </div>
                              <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                {files[index]?.name}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {uploadDates[index]}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {/* Display the prediction data - adjust based on your API response structure */}
                            {prediction.result || prediction.prediction || JSON.stringify(prediction)}
                          </td>
                        </tr>
                      )
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!processingComplete && !uploading && files.length === 0 && (
            <div className="mt-16 flex flex-col items-center">
              <div className="w-16 h-16 text-black rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center">
                <svg viewBox="0 0 24 24" width="24" height="24" >
                  <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
                    <path d="M12 16a4 4 0 100-8 4 4 0 000 8z" />
                  </g>
                </svg>
              </div>
              <div className="mt-1 text-center">
                <div className="font-bold">You</div>
                <div className="text-sm text-gray-600">Online</div>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Stratus lets you share files with others. To get started, 
                <span className="font-bold"> upload some files</span>.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50  bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-center mb-4">
              <div className="text-black font-bold text-xl flex items-center">
                <span className="mr-1">
                  <svg viewBox="0 0 24 24" width="20" height="20" className="inline-block">
                    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
                      <path d="M12 16a4 4 0 100-8 4 4 0 000 8z" />
                      <path d="M12 8v-2M12 18v-2M8 12h-2M18 12h-2" />
                    </g>
                  </svg>
                </span>
                Stratus
              </div>
            </div>
            
            {files.map((file, index) => (
              <div key={index}>
                <div className="border-t border-b py-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-gray-800">{file.name}</div>
                    <div className="text-gray-800">{(file.size / 1024).toFixed(1)} KB</div>
                  </div>
                  <div className="relative h-6 w-full bg-gray-100 rounded-md overflow-hidden">
                    <div 
                      className={`absolute h-full transition-all duration-300 ${
                        uploadProgress[index] === -1 ? 'bg-red-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${uploadProgress[index] > 0 ? uploadProgress[index] : 0}%` }}
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs">
                      {uploadProgress[index] === -1 ? 'Error' : `${uploadProgress[index] || 0}%`}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="flex flex-col items-center mt-8 mb-4">
              {uploading ? (
                <>
                  <div className="w-8 h-8 rounded-full border-2 border-gray-300 border-t-green-500 animate-spin mb-2" />
                  <p className="font-bold">You're almost done!</p>
                  <p className="text-gray-600">
                    {isBackendProcessing ? 'Processing your files...' : 'Uploading your files...'}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-bold">Upload Complete!</p>
                  <button className="mt-4 bg-green-500 text-white px-6 py-2 rounded" onClick={() => setShowModal(false)}>
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}