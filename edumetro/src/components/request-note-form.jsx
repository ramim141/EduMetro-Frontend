"use client"

import { useState } from "react"
import {
  FaPaperPlane,
  FaUser,
  FaIdCard,
  FaBook,
  FaBuilding,
  FaEnvelope,
  FaWhatsapp,
  FaLinkedin,
  FaSpinner,
} from "react-icons/fa"

const RequestNoteForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    courseName: "",
    departmentName: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: "",
        studentId: "",
        courseName: "",
        departmentName: "",
        message: "",
      })
    }, 3000)
  }

  return (
    <section className="relative py-20 overflow-hidden lg:py-32">
      {/* Background with animated gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="absolute top-0 left-0 rounded-full w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 rounded-full w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute w-64 h-64 transform -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 bg-gradient-to-br from-green-400/10 to-emerald-400/10 blur-2xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid items-start grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Form Section */}
          <div className="relative">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 lg:p-12 transform hover:scale-[1.02] transition-all duration-500">
              {/* Decorative elements */}
              <div className="absolute w-8 h-8 rounded-full -top-4 -left-4 bg-gradient-to-br from-pink-400 to-rose-500 opacity-60"></div>
              <div className="absolute w-6 h-6 rounded-full -top-2 -right-2 bg-gradient-to-br from-purple-400 to-indigo-500 opacity-60"></div>
              <div className="absolute w-4 h-4 rounded-full -bottom-2 -left-2 bg-gradient-to-br from-blue-400 to-cyan-500 opacity-60"></div>

              {/* Header */}
              <div className="mb-10 text-center">
                <div className="inline-flex items-center gap-3 px-6 py-3 mb-6 rounded-full bg-gradient-to-r from-pink-100 to-rose-100">
                  <FaPaperPlane className="text-sm text-pink-600 animate-bounce" />
                  <span className="text-sm font-bold tracking-wider text-pink-700 uppercase">Request Form</span>
                </div>
                <h2 className="mb-4 text-4xl font-black text-gray-900 lg:text-5xl">
                  Request for{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-600 to-red-600">
                    Note
                  </span>
                </h2>
                <p className="text-lg font-medium text-gray-600">
                  We will be happy to collect your desired note and help you succeed in your studies.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Student ID Row */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="group">
                    <label className="block mb-2 text-sm font-bold text-gray-700">
                      <FaUser className="inline mr-2 text-pink-600" />
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                      className="w-full px-4 py-4 text-gray-900 placeholder-gray-500 transition-all duration-300 border-2 border-gray-200 bg-white/70 rounded-2xl focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 group-hover:border-pink-300"
                    />
                  </div>
                  <div className="group">
                    <label className="block mb-2 text-sm font-bold text-gray-700">
                      <FaIdCard className="inline mr-2 text-blue-600" />
                      Student ID
                    </label>
                    <input
                      type="text"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleInputChange}
                      placeholder="Enter your student ID"
                      required
                      className="w-full px-4 py-4 text-gray-900 placeholder-gray-500 transition-all duration-300 border-2 border-gray-200 bg-white/70 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 group-hover:border-blue-300"
                    />
                  </div>
                </div>

                {/* Course and Department Row */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="group">
                    <label className="block mb-2 text-sm font-bold text-gray-700">
                      <FaBook className="inline mr-2 text-purple-600" />
                      Course Name
                    </label>
                    <input
                      type="text"
                      name="courseName"
                      value={formData.courseName}
                      onChange={handleInputChange}
                      placeholder="Enter course name"
                      required
                      className="w-full px-4 py-4 text-gray-900 placeholder-gray-500 transition-all duration-300 border-2 border-gray-200 bg-white/70 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 group-hover:border-purple-300"
                    />
                  </div>
                  <div className="group">
                    <label className="block mb-2 text-sm font-bold text-gray-700">
                      <FaBuilding className="inline mr-2 text-emerald-600" />
                      Department Name
                    </label>
                    <input
                      type="text"
                      name="departmentName"
                      value={formData.departmentName}
                      onChange={handleInputChange}
                      placeholder="Enter department name"
                      required
                      className="w-full px-4 py-4 text-gray-900 placeholder-gray-500 transition-all duration-300 border-2 border-gray-200 bg-white/70 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 group-hover:border-emerald-300"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="group">
                  <label className="block mb-2 text-sm font-bold text-gray-700">
                    <FaEnvelope className="inline mr-2 text-orange-600" />
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Type your message here! Describe the specific notes you need..."
                    rows={5}
                    required
                    className="w-full px-4 py-4 text-gray-900 placeholder-gray-500 transition-all duration-300 border-2 border-gray-200 resize-none bg-white/70 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 group-hover:border-orange-300"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || isSubmitted}
                  className={`w-full py-5 px-8 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-300 transform ${
                    isSubmitted
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white scale-105"
                      : isSubmitting
                        ? "bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 hover:scale-105 hover:shadow-3xl"
                  }`}
                >
                  <span className="flex items-center justify-center gap-3">
                    {isSubmitted ? (
                      <>
                        <span className="flex items-center justify-center w-6 h-6 bg-white rounded-full">
                          <span className="text-sm text-green-600">✓</span>
                        </span>
                        Request Submitted Successfully!
                      </>
                    ) : isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Submitting Request...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="transition-transform duration-300 group-hover:translate-x-1" />
                        Submit Request
                      </>
                    )}
                  </span>
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="relative">
            <div className="bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 rounded-3xl shadow-2xl p-8 lg:pb-20 lg:p-12 text-white transform hover:scale-[1.02] transition-all duration-500">
              {/* Decorative elements */}
              <div className="absolute w-8 h-8 rounded-full -top-4 -right-4 bg-white/20"></div>
              <div className="absolute w-6 h-6 rounded-full -bottom-2 -right-2 bg-white/30"></div>
              <div className="absolute w-4 h-4 rounded-full top-1/2 -left-2 bg-white/20"></div>

              {/* Header */}
              <div className="mb-12 text-center">
                <div className="inline-flex items-center gap-2 px-6 py-3 mb-6 rounded-full bg-white/20 backdrop-blur-sm">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-sm font-bold tracking-wider uppercase">Get In Touch</span>
                </div>
                <h3 className="mb-4 text-3xl font-black lg:text-4xl">
                  Contact <span className="text-yellow-300">Information</span>
                </h3>
                <p className="text-lg text-emerald-100">Reach out to us through any of these channels</p>
              </div>

              {/* Contact Items */}
              <div className="space-y-8">
                {/* Email */}
                <div className="flex items-center gap-6 p-6 transition-all duration-300 transform group bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 hover:scale-105">
                  <div className="flex items-center justify-center w-16 h-16 transition-transform duration-300 bg-red-500 shadow-xl rounded-2xl group-hover:scale-110">
                    <FaEnvelope className="text-2xl text-white" />
                  </div>
                  <div>
                    <h4 className="mb-1 text-xl font-bold">Our Email</h4>
                    <p className="transition-colors duration-300 text-emerald-100 group-hover:text-white">
                      support@gmail.com
                    </p>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-center gap-6 p-6 transition-all duration-300 transform group bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 hover:scale-105">
                  <div className="flex items-center justify-center w-16 h-16 transition-transform duration-300 bg-green-500 shadow-xl rounded-2xl group-hover:scale-110">
                    <FaWhatsapp className="text-2xl text-white" />
                  </div>
                  <div>
                    <h4 className="mb-1 text-xl font-bold">Send Message</h4>
                    <p className="transition-colors duration-300 text-emerald-100 group-hover:text-white">
                      +8801768628911
                    </p>
                  </div>
                </div>

                {/* LinkedIn */}
                <div className="flex items-center gap-6 p-6 transition-all duration-300 transform group bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 hover:scale-105">
                  <div className="flex items-center justify-center w-16 h-16 transition-transform duration-300 bg-blue-600 shadow-xl rounded-2xl group-hover:scale-110">
                    <FaLinkedin className="text-2xl text-white" />
                  </div>
                  <div>
                    <h4 className="mb-1 text-xl font-bold">Follow Our</h4>
                    <p className="transition-colors duration-300 text-emerald-100 group-hover:text-white">@ramim-ahmed</p>
                  </div>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="mt-12 text-center">
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">We respond within 24 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RequestNoteForm
