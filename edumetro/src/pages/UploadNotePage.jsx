"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  FaUpload,
  FaFileAlt,
  FaGraduationCap,
  FaBuilding,
  FaBookOpen,
  FaEdit,
  FaCheckCircle,
  FaCloudUploadAlt,
  FaRocket,
  FaStar,
  FaHeart,
} from "react-icons/fa"
import { Sparkles } from "lucide-react"
import AuthLayout from "../layouts/AuthLayout"
import Input from "../components/ui/Input"
import Button from "../components/ui/Button"
import Heading from "../components/ui/Heading"
import Message from "../components/ui/Message"
import Dropdown from "../components/ui/Dropdown"
import Modal from "../components/ui/Modal"
import DragAndDropFileInput from "../components/ui/DragAndDropFileInput"
import api, { getDepartments as fetchDepartmentsApi, getCourses as fetchCoursesApi } from "../utils/api"

// Function to sanitize filename
const sanitizeFilename = (filename) => {
  const ext = filename.split(".").pop()
  const nameWithoutExt = filename.slice(0, -(ext.length + 1))

  const sanitized = nameWithoutExt
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .replace(/\s+/g, "_")
    .toLowerCase()

  const truncated = sanitized.slice(0, 100)
  const timestamp = new Date().getTime()

  return `${truncated}_${timestamp}.${ext}`
}

const EnhancedUploadNotePage = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("")
  const [selectedCourseId, setSelectedCourseId] = useState("")
  const [description, setDescription] = useState("")
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const [departments, setDepartments] = useState([])
  const [allCourses, setAllCourses] = useState([])
  const [filteredCourses, setFilteredCourses] = useState([])

  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const departmentRes = await fetchDepartmentsApi()
        const loadedDepartments = departmentRes.data.results || departmentRes.data
        setDepartments(loadedDepartments)

        const courseRes = await fetchCoursesApi()
        const loadedCourses = courseRes.data.results || courseRes.data
        setAllCourses(loadedCourses)
      } catch (err) {
        console.error("Failed to load departments or courses:", err.response ? err.response.data : err.message)
        setError("Failed to load department and course options.")
      }
    }
    loadDropdownData()
  }, [])

  useEffect(() => {
    if (selectedDepartmentId) {
      const departmentIdInt = Number.parseInt(selectedDepartmentId)
      const coursesForDept = allCourses.filter((course) => {
        return course.department === departmentIdInt
      })
      setFilteredCourses(coursesForDept)
    } else {
      setFilteredCourses([])
    }
    setSelectedCourseId("")
  }, [selectedDepartmentId, allCourses])

  const handleDepartmentChange = (e) => {
    const newDepartmentId = e.target.value
    setSelectedDepartmentId(newDepartmentId)
  }

  const handleCourseChange = (e) => {
    const newCourseId = e.target.value
    setSelectedCourseId(newCourseId)
  }

  const handleFileSelect = (file) => {
    if (file) {
      const maxSize = 10 * 1024 * 1024 // 10MB in bytes
      if (file.size > maxSize) {
        setError("File size should not exceed 10MB")
        setSelectedFile(null)
        return
      }

      if (file.type !== "application/pdf") {
        setError("Only PDF files are allowed")
        setSelectedFile(null)
        return
      }

      const sanitizedFile = new File([file], sanitizeFilename(file.name), { type: file.type })
      setSelectedFile(sanitizedFile)
      setError(null)
    } else {
      setSelectedFile(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!title || !selectedCourseId || !description || !selectedDepartmentId || !selectedFile) {
      setError("All fields including the note file are required.")
      setLoading(false)
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)
      formData.append("file", selectedFile)
      formData.append("department", selectedDepartmentId)
      formData.append("course", selectedCourseId)

      const response = await api.post("/api/notes/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      console.log("Note uploaded successfully:", response.data)
      setShowSuccessModal(true)

      // Clear form
      setTitle("")
      setSelectedCourseId("")
      setSelectedDepartmentId("")
      setDescription("")
      setSelectedFile(null)
      setError(null)
    } catch (err) {
      console.error("Note upload error:", err)
      let errorMessage = "Failed to upload note. Please try again."

      if (err.response) {
        if (err.response.data) {
          const errors = err.response.data
          if (errors.detail) {
            errorMessage = errors.detail
          } else if (typeof errors === "object") {
            errorMessage = Object.entries(errors)
              .map(([field, messages]) => {
                const formattedMessages = Array.isArray(messages) ? messages.join(", ") : messages
                return `${field}: ${formattedMessages}`
              })
              .join("\n")
          } else if (typeof errors === "string") {
            errorMessage = errors
          }
        } else {
          errorMessage = `Request failed with status ${err.response.status}.`
        }
      } else if (err.request) {
        errorMessage = "No response from server. Check your network connection."
      } else {
        errorMessage = `Error setting up request: ${err.message}`
      }
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false)
    navigate("/my-notes")
  }

  return (
    <AuthLayout>
      {/* Background with animated gradient */}
      <div className="overflow-hidden relative min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50">
        {/* Animated background elements */}
        <div className="overflow-hidden absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br rounded-full opacity-20 from-primary-200 to-secondary-200 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br rounded-full opacity-20 from-accent-200 to-primary-200 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-gradient-to-br rounded-full opacity-20 transform -translate-x-1/2 -translate-y-1/2 from-secondary-200 to-accent-200 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container relative z-10 px-4 py-8 mx-auto">
          <div className="mx-auto max-w-4xl">
            {/* Header Section */}
            <div className="mb-12 text-center animate-fade-in-up">
              <div className="inline-flex justify-center items-center mb-6 w-20 h-20 bg-gradient-to-br rounded-full shadow-lg from-primary-500 to-secondary-500 animate-bounce-slow">
                <FaCloudUploadAlt className="w-10 h-10 text-white" />
              </div>

              <Heading level={1} gradient={true} color="primary" className="mb-4 animate-fade-in-up" animated={true}>
                <span className="flex gap-3 justify-center items-center">
                  <Sparkles className="w-8 h-8 animate-pulse text-accent-500" />
                  Share Your Knowledge
                  <FaRocket className="w-8 h-8 animate-bounce text-secondary-500" />
                </span>
              </Heading>

              <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-600 animate-fade-in-up animation-delay-200">
                Upload your notes and help fellow students succeed. Your contribution makes a difference!
                <FaHeart className="inline-block ml-2 w-5 h-5 animate-pulse text-accent-500" />
              </p>
            </div>

            {/* Main Upload Form */}
            <div className="overflow-hidden rounded-3xl border shadow-2xl backdrop-blur-sm bg-white/80 border-white/20 animate-fade-in-up animation-delay-400">
              {/* Form Header */}
              <div className="overflow-hidden relative p-6 text-white bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-secondary-600/90"></div>
                <div className="flex relative z-10 gap-3 justify-center items-center">
                  <FaFileAlt className="w-6 h-6 animate-pulse" />
                  <h2 className="text-2xl font-bold">Upload Your Note</h2>
                  <FaStar className="w-6 h-6 animate-spin" />
                </div>
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full animate-pulse bg-white/10"></div>
                <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-white/10 animate-bounce-slow"></div>
              </div>

              <div className="p-8">
                {error && (
                  <div className="mb-8 animate-fade-in-up">
                    <Message type="error" message={error} onClose={() => setError(null)} duration={5000} />
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Title Input */}
                  <div className="group animate-fade-in-left animation-delay-600">
                    <div className="flex gap-3 items-center mb-3">
                      <div className="flex justify-center items-center w-10 h-10 bg-gradient-to-br rounded-full shadow-lg transition-transform duration-300 from-primary-500 to-secondary-500 group-hover:scale-110">
                        <FaEdit className="w-5 h-5 text-white" />
                      </div>
                      <label className="text-lg font-semibold text-gray-800 transition-colors duration-300 group-hover:text-primary-600">
                        Note Title
                      </label>
                    </div>
                    <Input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter an engaging title for your note"
                      required
                      className="w-full transform hover:scale-[1.02] transition-all duration-300"
                      size="lg"
                      icon="book-open"
                    />
                  </div>

                  {/* Department and Course Row */}
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Department Dropdown */}
                    <div className="group animate-fade-in-left animation-delay-800">
                      <div className="flex gap-3 items-center mb-3">
                        <div className="flex justify-center items-center w-10 h-10 bg-gradient-to-br rounded-full shadow-lg transition-transform duration-300 from-accent-500 to-primary-500 group-hover:scale-110">
                          <FaBuilding className="w-5 h-5 text-white" />
                        </div>
                        <label className="text-lg font-semibold text-gray-800 transition-colors duration-300 group-hover:text-accent-600">
                          Department
                        </label>
                      </div>
                      <div className="transform hover:scale-[1.02] transition-all duration-300">
                        <Dropdown
                          options={departments.map((dept) => ({ value: dept.id, label: dept.name }))}
                          value={selectedDepartmentId}
                          onChange={handleDepartmentChange}
                          placeholder="Select your department"
                          required
                          className="w-full"
                          size="lg"
                          animated={true}
                        />
                      </div>
                    </div>

                    {/* Course Dropdown */}
                    <div className="group animate-fade-in-right animation-delay-1000">
                      <div className="flex gap-3 items-center mb-3">
                        <div className="flex justify-center items-center w-10 h-10 bg-gradient-to-br rounded-full shadow-lg transition-transform duration-300 from-secondary-500 to-accent-500 group-hover:scale-110">
                          <FaGraduationCap className="w-5 h-5 text-white" />
                        </div>
                        <label className="text-lg font-semibold text-gray-800 transition-colors duration-300 group-hover:text-secondary-600">
                          Course
                        </label>
                      </div>
                      <div className="transform hover:scale-[1.02] transition-all duration-300">
                        <Dropdown
                          options={filteredCourses.map((course) => ({ value: course.id, label: course.name }))}
                          value={selectedCourseId}
                          onChange={handleCourseChange}
                          placeholder={selectedDepartmentId ? "Select a course" : "Select a department first"}
                          required
                          disabled={!selectedDepartmentId || filteredCourses.length === 0}
                          className="w-full"
                          size="lg"
                          animated={true}
                        />
                      </div>
                      {selectedDepartmentId && filteredCourses.length === 0 && !loading && (
                        <p className="mt-2 text-sm text-red-500 animate-fade-in">
                          No courses found for this department.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="group animate-fade-in-left animation-delay-1200">
                    <div className="flex gap-3 items-center mb-3">
                      <div className="flex justify-center items-center w-10 h-10 bg-gradient-to-br rounded-full shadow-lg transition-transform duration-300 from-success-500 to-primary-500 group-hover:scale-110">
                        <FaBookOpen className="w-5 h-5 text-white" />
                      </div>
                      <label className="text-lg font-semibold text-gray-800 transition-colors duration-300 group-hover:text-success-600">
                        Description
                      </label>
                    </div>
                    <div className="transform hover:scale-[1.02] transition-all duration-300">
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your note content, topics covered, and any helpful details..."
                        rows="4"
                        className="p-4 w-full placeholder-gray-400 text-gray-700 bg-gray-50 rounded-xl border-2 border-gray-200 transition-all duration-300 resize-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 hover:bg-white"
                        required
                      />
                    </div>
                  </div>

                  {/* File Upload */}
                  <div className="group animate-fade-in-right animation-delay-1400">
                    <div className="flex gap-3 items-center mb-3">
                      <div className="flex justify-center items-center w-10 h-10 bg-gradient-to-br rounded-full shadow-lg transition-transform duration-300 from-warning-500 to-accent-500 group-hover:scale-110">
                        <FaUpload className="w-5 h-5 text-white" />
                      </div>
                      <label className="text-lg font-semibold text-gray-800 transition-colors duration-300 group-hover:text-warning-600">
                        Upload File
                      </label>
                    </div>
                    <div className="transform hover:scale-[1.02] transition-all duration-300">
                      <DragAndDropFileInput
                        onFileSelect={handleFileSelect}
                        acceptedFileTypes={["pdf"]}
                        className="w-full"
                        variant="accent"
                        size="lg"
                        animated={true}
                      />
                    </div>
                    <p className="flex gap-2 items-center mt-3 text-sm text-gray-500">
                      <FaFileAlt className="w-4 h-4 text-primary-500" />
                      Maximum file size: 10MB. Only PDF files are allowed.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6 animate-fade-in-up animation-delay-1600">
                    <Button
                      type="submit"
                      loading={loading}
                      className="w-full py-4 text-lg font-semibold transform hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl"
                      size="xl"
                      variant="primary"
                      icon={<FaRocket className="w-5 h-5" />}
                      iconPosition="left"
                    >
                      {loading ? "Uploading Your Note..." : "Share Your Knowledge"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>

           
          </div>
        </div>
      </div>
       
      <Modal isOpen={showSuccessModal} onClose={handleCloseSuccessModal} customClasses="w-full max-w-md mt-[560px]">
        <div className="overflow-hidden relative p-6 text-center text-white bg-gradient-to-br rounded-t-lg from-success-500 to-primary-500">
          <div className="absolute inset-0 bg-gradient-to-br from-success-500/90 to-primary-500/90"></div>
          <div className="relative z-10">
            <div className="flex justify-center items-center mx-auto mb-4 w-20 h-20 rounded-full bg-white/20 animate-bounce-slow">
              <FaCheckCircle className="w-10 h-10 text-white animate-pulse" />
            </div>
            <h3 className="mb-2 text-2xl font-bold">Success!</h3>
            <p className="text-success-100">Your note has been uploaded successfully ! Waiting for Admin Approval.</p>
            
          </div>
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full animate-pulse bg-white/10"></div>
          <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-white/10 animate-bounce-slow"></div>
        </div>

        <div className="p-8 text-center bg-white rounded-b-lg">
          <div className="mb-6">
            {/* ... */}
          </div>

          <Button
            onClick={handleCloseSuccessModal}
            className="w-full transition-all duration-300 transform hover:scale-105"
            size="lg"
            variant="primary"
            // ...
          >
            View My Notes
          </Button>
        </div>
      </Modal>
    </AuthLayout>
  )
}

export default EnhancedUploadNotePage
