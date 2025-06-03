"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Upload, X } from 'lucide-react'

const DragAndDropFileInput = ({
  onFileSelect,
  acceptedFileTypes = ["pdf"],
  className = "",
  variant = "primary",
  size = "md",
  animated = true,
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const fileInputRef = useRef(null)

  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "border-indigo-300 bg-indigo-50 hover:bg-indigo-100"
      case "secondary":
        return "border-gray-300 bg-gray-50 hover:bg-gray-100"
      case "accent":
        return "border-purple-300 bg-purple-50 hover:bg-purple-100"
      default:
        return "border-gray-300 bg-gray-50 hover:bg-gray-100"
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "p-3 text-sm"
      case "lg":
        return "p-6 text-lg"
      case "xl":
        return "p-8 text-xl"
      default:
        return "p-4 text-base"
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFileInput = (e) => {
    const files = e.target.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFile = (file) => {
    const fileType = file.type.split("/")[1]
    if (acceptedFileTypes.includes(fileType)) {
      setSelectedFile(file)
      onFileSelect(file)
    } else {
      alert(`Please upload a valid file type: ${acceptedFileTypes.join(", ")}`)
    }
  }

  const handleRemoveFile = (e) => {
    e.stopPropagation()
    setSelectedFile(null)
    onFileSelect(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <motion.div
      className={`relative rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer ${
        isDragging ? "bg-indigo-100 border-indigo-500 scale-105" : ""} ${getVariantClasses()} ${getSizeClasses()} ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      whileHover={animated ? { scale: 1.02 } : {}}
      whileTap={animated ? { scale: 0.98 } : {}}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={acceptedFileTypes.map((type) => `.${type}`).join(",")}
        onChange={handleFileInput}
      />

      {selectedFile ? (
        <div className="flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <Upload className="w-6 h-6 text-gray-500" />
            <span className="font-medium text-gray-700">{selectedFile.name}</span>
          </div>
          <button
            onClick={handleRemoveFile}
            className="p-1 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div className="text-center">
          <Upload className="mx-auto mb-3 w-8 h-8 text-gray-400" />
          <p className="mb-1 font-medium text-gray-700">
            Drag and drop your file here, or click to select
          </p>
          <p className="text-sm text-gray-500">
            Supported formats: {acceptedFileTypes.join(", ").toUpperCase()}
          </p>
        </div>
      )}
    </motion.div>
  )
}

export default DragAndDropFileInput
