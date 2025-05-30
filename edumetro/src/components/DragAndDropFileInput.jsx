// src/components/DragAndDropFileInput.jsx

import React, { useState, useRef, useEffect, Fragment } from 'react';
import { 
  FaCloudUploadAlt, 
  FaFilePdf, 
  FaFileWord, 
  FaFilePowerpoint, 
  FaFileExcel,
  FaFileImage,
  FaFileAudio,
  FaFileVideo,
  FaFileArchive,
  FaFileCode,
  FaFileAlt,
  FaTrashAlt,
  FaExclamationCircle
} from 'react-icons/fa';

const DragAndDropFileInput = ({ 
  onFileSelect,
  maxFileSizeMB = 16, 
  acceptedFileTypes = ['pdf', 'doc', 'docx', 'ppt', 'pptx'],
  label = '',
  required = false,
  className = '',
  variant = 'default',
  size = 'md',
  animated = true,
  showFileInfo = true,
  showFilePreview = true,
  multiple = false,
  initialFile = null,
  error = null,
  ...props
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState(null);
  const [fileSize, setFileSize] = useState(null);

  // Set initial file if provided
  useEffect(() => {
    if (initialFile) {
      setFileName(initialFile.name);
      setFileSize(initialFile.size);
    }
  }, [initialFile]);

  // Size classes
  const sizeClasses = {
    sm: "p-3 text-xs",
    md: "p-6 text-sm",
    lg: "p-8 text-base",
    xl: "p-10 text-lg"
  }[size] || "p-6 text-sm";

  // Icon size classes
  const iconSizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20"
  }[size] || "w-12 h-12";

  // Variant classes
  const getVariantClasses = () => {
    const baseClasses = "border-2 border-dashed rounded-lg transition-all duration-300 ease-in-out";
    
    const variants = {
      default: `${baseClasses} ${dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 bg-gray-50 hover:border-primary-400 hover:bg-gray-100'}`,
      outline: `${baseClasses} bg-transparent ${dragActive ? 'border-primary-500' : 'border-gray-300 hover:border-primary-400'}`,
      filled: `${baseClasses} ${dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-200 bg-gray-100 hover:border-primary-400'}`,
      minimal: `${baseClasses} border-none ${dragActive ? 'bg-primary-50' : 'bg-gray-50 hover:bg-gray-100'}`,
      accent: `${baseClasses} ${dragActive ? 'border-accent-500 bg-accent-50' : 'border-gray-300 bg-gray-50 hover:border-accent-400 hover:bg-gray-100'}`
    };
    
    return variants[variant] || variants.default;
  };

  // Animation classes
  const animationClasses = animated ? "animate-fadeIn" : "";

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const file = files[0];
    if (file) {
      setFileName(file.name);
      setFileSize(file.size);
      if (onFileSelect) {
        onFileSelect(file);
      }
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setFileName(null);
    setFileSize(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    if (onFileSelect) {
      onFileSelect(null);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return <FaFileAlt className="text-gray-400" />;
    const extension = fileName.split('.').pop().toLowerCase();
    
    const iconClasses = `${iconSizeClasses} transition-all duration-300`;
    
    switch (extension) {
      case 'pdf': return <FaFilePdf className={`${iconClasses} text-danger-500`} />;
      case 'doc':
      case 'docx': return <FaFileWord className={`${iconClasses} text-primary-500`} />;
      case 'ppt':
      case 'pptx': return <FaFilePowerpoint className={`${iconClasses} text-warning-500`} />;
      case 'xls':
      case 'xlsx': return <FaFileExcel className={`${iconClasses} text-success-500`} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg': return <FaFileImage className={`${iconClasses} text-accent-500`} />;
      case 'mp3':
      case 'wav':
      case 'ogg': return <FaFileAudio className={`${iconClasses} text-secondary-500`} />;
      case 'mp4':
      case 'avi':
      case 'mov': return <FaFileVideo className={`${iconClasses} text-secondary-600`} />;
      case 'zip':
      case 'rar':
      case '7z': return <FaFileArchive className={`${iconClasses} text-warning-600`} />;
      case 'html':
      case 'css':
      case 'js': return <FaFileCode className={`${iconClasses} text-info-500`} />;
      default: return <FaFileAlt className={`${iconClasses} text-gray-500`} />;
    }
  };

  return (
    <>
      {label && (
        <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="ml-1 text-danger-500">*</span>}
        </label>
      )}
      
      <div
        className={`${getVariantClasses()} ${sizeClasses} text-center relative ${error ? '!border-red-500' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={!fileName ? onButtonClick : undefined}
        {...props}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          accept={acceptedFileTypes.map(type => `.${type}`).join(',')}
          multiple={multiple}
        />
        
        {fileName ? (
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-3">
              <div className="flex items-center space-x-2">
                 {getFileIcon(fileName)}
                 <span className="text-sm font-medium text-gray-700 dark:text-gray-300 break-all">{fileName}</span>
              </div>
              <button 
                 onClick={handleRemoveFile}
                 className="flex-shrink-0 p-1 text-red-500 rounded-full hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                 title="Remove file"
              >
                 <FaTrashAlt className="text-sm"/>
              </button>
            </div>
            {showFileInfo && fileSize && (
              <p className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(fileSize)}</p>
            )}
          </div>
        ) : (
            <div className="transition-all duration-300 transform hover:scale-105">
              <FaCloudUploadAlt className={`${iconSizeClasses} mb-3 mx-auto text-gray-400 dark:text-gray-500 ${dragActive ? 'animate-bounce' : ''}`} />
              
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                <span className="text-primary-600 dark:text-primary-400 hover:underline cursor-pointer">
                  Upload a file
                </span>{' '}
                or drag and drop
              </p>
              
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {acceptedFileTypes.map(type => type.toUpperCase()).join(', ')} up to {maxFileSizeMB}MB
              </p>
            </div>
          )}
        
        {error && (
          <div className="mt-3 flex items-center justify-center text-sm text-danger-500 animate-fadeIn">
            <FaExclamationCircle className="mr-1" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </>
  );
};

export default DragAndDropFileInput;