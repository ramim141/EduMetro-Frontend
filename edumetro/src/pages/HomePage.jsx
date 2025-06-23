"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../utils/api"
import Spinner from "../components/Spinner"
import NoteCard from "../components/NoteCard"
import StrengthSection from "@/components/strength-section"
import RequestNoteForm from "@/components/request-note-form"
import Footer from "@/components/footer"
import NotesSection from "@/components/ui/NotesSection"
import {
  FaArrowRight,
  FaBookOpen as FaBookOpenLegacy,
  FaDownload,
  FaGraduationCap,
  FaSearch,
  FaStar,
  FaUniversity,
  FaUpload as FaUploadLegacy,
  FaUsers
} 
from "react-icons/fa"
import heroImage from "../assets/images/home-hero-img.png"
import { BookOpen, Upload, ArrowRight, LoaderCircle, XCircle } from 'lucide-react';

const HomePage = () => {
  const [popularNotes, setPopularNotes] = useState([])
  const [notesLoading, setNotesLoading] = useState(true)
  const [notesError, setNotesError] = useState(null)

  useEffect(() => {
    const fetchPopularNotes = async () => {
      setNotesLoading(true)
      try {
        // Simulate API call delay for demonstration of loading/error states
        await new Promise(resolve => setTimeout(resolve, 1500));

        // For demonstration, you can uncomment one of these to test different states:
        // const response = { data: { results: [] } }; // No notes state
        // throw new Error("Network connection lost. Please check your internet."); // Error state
        
        const response = await api.get("/api/notes/?ordering=-created_at&limit=4")
        setPopularNotes(response.data.results || [])
      } catch (err) {
        console.error("Failed to fetch notes for homepage:", err)
        setNotesError(err.message || "Failed to load notes. Please try again later.")
      } finally {
        setNotesLoading(false)
      }
    }

    fetchPopularNotes()
  }, [])


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 bg-white rounded-full w-96 h-96 mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 right-0 bg-yellow-300 rounded-full w-96 h-96 mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 bg-pink-300 rounded-full left-20 w-96 h-96 mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative flex flex-col items-center justify-center gap-16 px-4 py-20 mx-auto max-w-7xl md:flex-row md:px-8 lg:px-12">
          {/* Left Side: Text Content and CTAs */}
          <div className="order-2 space-y-8 text-center md:w-1/2 md:text-left md:order-1">
            <div className="space-y-6">
              <h1 className="text-5xl font-black leading-tight md:text-6xl lg:text-7xl">
                <span className="text-white">Unlock Your</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                  Academic
                </span>
                <br />
                <span className="text-white">Potential</span>
              </h1>
              <div className="w-24 h-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400"></div>
              <p className="max-w-2xl text-xl leading-relaxed md:text-2xl text-white/90">
                Discover, share, and manage high-quality study notes from various courses and departments. Join
                thousands of students already excelling.
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 md:justify-start">
              <div className="text-center">
                {/* here add a share icon */}
                <FaUsers className="mx-auto text-2xl text-yellow-400" />
                <div className="text-sm text-white/80">Share</div>
              </div>
              <div className="text-center">
                {/* here add a download icon */}
                <FaDownload className="mx-auto text-2xl text-yellow-400" />
                <div className="text-sm text-white/80">Downloads</div>
              </div>
              <div className="text-center">
                {/* here add a upload icon */}
                <FaUploadLegacy className="mx-auto text-2xl text-yellow-400" />
                <div className="text-sm text-white/80">Upload</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
              <Link
                to="/note"
                className="relative px-8 py-4 overflow-hidden font-bold text-indigo-600 transition-all duration-300 transform bg-white shadow-2xl rounded-2xl group hover:shadow-3xl hover:scale-105"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Browse All Notes
                  <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:opacity-100"></div>
                <span className="absolute inset-0 z-10 flex items-center justify-center gap-2 font-bold text-white transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                  Browse All Notes
                  <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
              <Link
                to="/register"
                className="px-8 py-4 font-bold text-gray-900 transition-all duration-300 transform shadow-2xl bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl group hover:shadow-3xl hover:scale-105 hover:from-yellow-300 hover:to-orange-300"
              >
                <span className="flex items-center justify-center gap-2">
                  Join Now - It's Free!
                  <FaStar className="transition-transform duration-300 group-hover:rotate-12" />
                </span>
              </Link>
            </div>
          </div>

          {/* Right Side: Image */}
          <div className="flex justify-center order-1 md:w-1/2 md:order-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl opacity-30 blur-2xl animate-pulse"></div>
              <img
                src={heroImage || "/placeholder.svg"}
                alt="Study materials"
                className="relative object-cover w-full max-w-lg transition-transform duration-500 transform shadow-2xl rounded-3xl hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-4 py-24 mx-auto overflow-hidden bg-white max-w-7xl md:px-8 lg:px-8">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute bg-indigo-600 rounded-full left-10 top-20 w-72 h-72"></div>
          <div className="absolute bg-purple-600 rounded-full right-10 bottom-20 w-96 h-96"></div>
        </div>

        <div className="container relative z-10 mx-auto">
          <div className="mb-20 text-center">
            <h2 className="mb-6 text-5xl font-black text-gray-900 md:text-6xl">
              Why Choose{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                NoteBank?
              </span>
            </h2>
            <div className="w-32 h-1 mx-auto mb-6 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600"></div>
            <p className="max-w-3xl mx-auto text-xl leading-relaxed text-gray-600">
              Join thousands of students who are already transforming their academic journey with our comprehensive
              note-sharing platform.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
            {/* Feature 1 */}
            <div className="relative p-8 transition-all duration-500 transform border border-gray-100 shadow-xl bg-gradient-to-br from-white to-gray-50 rounded-3xl group hover:shadow-2xl hover:-translate-y-2">
              <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl group-hover:opacity-5"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center w-20 h-20 mb-6 transition-transform duration-300 shadow-lg bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl group-hover:scale-110">
                  <FaSearch className="text-3xl text-white" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-indigo-600">
                  Find Notes Easily
                </h3>
                <p className="mb-6 leading-relaxed text-gray-600">
                  Quickly search and filter notes by course, department, and rating with our advanced search system.
                </p>
                <div className="flex items-center font-semibold text-indigo-600 transition-all duration-300 group-hover:gap-2">
                  <span>Learn More</span>
                  <FaArrowRight className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="relative p-8 transition-all duration-500 transform border border-gray-100 shadow-xl bg-gradient-to-br from-white to-gray-50 rounded-3xl group hover:shadow-2xl hover:-translate-y-2">
              <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl group-hover:opacity-5"></div>              <div className="relative z-10">
                <div className="flex items-center justify-center w-20 h-20 mb-6 transition-transform duration-300 shadow-lg bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl group-hover:scale-110">
                  <FaUploadLegacy className="text-3xl text-white" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-blue-600">
                  Share Your Knowledge
                </h3>
                <p className="mb-6 leading-relaxed text-gray-600">
                  Upload your own notes and contribute to the community while earning recognition and rewards.
                </p>
                <div className="flex items-center font-semibold text-blue-600 transition-all duration-300 group-hover:gap-2">
                  <span>Start Sharing</span>
                  <FaArrowRight className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="relative p-8 transition-all duration-500 transform border border-gray-100 shadow-xl bg-gradient-to-br from-white to-gray-50 rounded-3xl group hover:shadow-2xl hover:-translate-y-2">
              <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-3xl group-hover:opacity-5"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center w-20 h-20 mb-6 transition-transform duration-300 shadow-lg bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl group-hover:scale-110">
                  <FaStar className="text-3xl text-white" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-yellow-600">
                  Review & Rate
                </h3>
                <p className="mb-6 leading-relaxed text-gray-600">
                  Provide valuable feedback on notes and help others discover the best study materials available.
                </p>
                <div className="flex items-center font-semibold text-yellow-600 transition-all duration-300 group-hover:gap-2">
                  <span>Join Community</span>
                  <FaArrowRight className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </div>

            
          </div>
        </div>
      </section>

       {/* Enhanced Latest Notes Section */}
       <section className="bg-gradient-to-tl from-[#84A2A8] via-white to-[#99BEE3]">
        <div className="container px-4 py-24 mx-auto max-w-7xl ">
        <h1 className="text-6xl font-extrabold text-center">Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Notes
              </span></h1>
         <div className="w-32 h-1 mx-auto mt-4 mb-6 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600"></div>
            <p className="max-w-3xl mx-auto text-xl leading-relaxed text-center text-gray-600">
              Check out our most recent uploads from the community
            </p>
        
        <NotesSection
       
          limit={4}
          ordering="-created_at"
          showViewAllButton={true}
          className="border shadow-xl rounded-3xl backdrop-blur-sm bg-white/50 border-white/20"
        />
      </div>
       </section>
      <StrengthSection />
      
      {/* Request note form Section */}
      <RequestNoteForm />

      {/* Footer Section */}
      <Footer />

    </div>
  )
}

export default HomePage
