"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../utils/api"
import Spinner from "../components/Spinner"
import NoteCard from "../components/NoteCard"
import { FaSearch, FaUpload, FaStar, FaArrowRight, FaBookOpen, FaUsers, FaDownload } from "react-icons/fa"
import heroImage from "../assets/images/home-hero-img.png"

const HomePage = () => {
  const [popularNotes, setPopularNotes] = useState([])
  const [notesLoading, setNotesLoading] = useState(true)
  const [notesError, setNotesError] = useState(null)

  useEffect(() => {
    const fetchPopularNotes = async () => {
      setNotesLoading(true)
      try {
        const response = await api.get("/api/notes/?ordering=-created_at&limit=4")
        setPopularNotes(response.data.results || [])
      } catch (err) {
        console.error("Failed to fetch notes for homepage:", err)
        setNotesError("Failed to load notes. Please try again later.")
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

        <div className="relative flex flex-col items-center justify-center gap-16 px-4 py-20 mx-auto md:flex-row md:px-8 lg:px-12 max-w-7xl">
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
                <FaUpload className="mx-auto text-2xl text-yellow-400" />
                <div className="text-sm text-white/80">Upload</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
              <Link
                to="/note"
                className="relative px-8 py-4 overflow-hidden font-bold text-indigo-600 transition-all duration-300 transform bg-white shadow-2xl group rounded-2xl hover:shadow-3xl hover:scale-105"
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
                className="px-8 py-4 font-bold text-gray-900 transition-all duration-300 transform shadow-2xl group bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl hover:shadow-3xl hover:scale-105 hover:from-yellow-300 hover:to-orange-300"
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
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl blur-2xl opacity-30 animate-pulse"></div>
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
      <section className="relative px-4 py-24 overflow-hidden bg-white">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute bg-indigo-600 rounded-full top-20 left-10 w-72 h-72"></div>
          <div className="absolute bg-purple-600 rounded-full bottom-20 right-10 w-96 h-96"></div>
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
            <div className="relative p-8 transition-all duration-500 transform border border-gray-100 shadow-xl group bg-gradient-to-br from-white to-gray-50 rounded-3xl hover:shadow-2xl hover:-translate-y-2">
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
            <div className="relative p-8 transition-all duration-500 transform border border-gray-100 shadow-xl group bg-gradient-to-br from-white to-gray-50 rounded-3xl hover:shadow-2xl hover:-translate-y-2">
              <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl group-hover:opacity-5"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center w-20 h-20 mb-6 transition-transform duration-300 shadow-lg bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl group-hover:scale-110">
                  <FaUpload className="text-3xl text-white" />
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
            <div className="relative p-8 transition-all duration-500 transform border border-gray-100 shadow-xl group bg-gradient-to-br from-white to-gray-50 rounded-3xl hover:shadow-2xl hover:-translate-y-2">
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

      {/* Latest Notes Section */}
      <section className="relative px-4 py-24 overflow-hidden bg-gradient-to-br from-gray-50 to-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 bg-indigo-600 rounded-full w-96 h-96"></div>
          <div className="absolute bottom-0 left-0 bg-purple-600 rounded-full w-72 h-72"></div>
        </div>

        <div className="container relative z-10 mx-auto">
          <div className="mb-20 text-center">
            <h2 className="mb-6 text-5xl font-black text-gray-900 md:text-6xl">
              Latest{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Notes
              </span>
            </h2>
            <div className="w-24 h-1 mx-auto mb-6 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600"></div>
            <p className="max-w-2xl mx-auto text-xl leading-relaxed text-gray-600">
              Discover the most recent study materials uploaded by our community of dedicated students.
            </p>
          </div>

          {notesLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="relative">
                <Spinner size="w-16 h-16" />
                <p className="mt-4 font-medium text-gray-600">Loading amazing notes...</p>
              </div>
            </div>
          ) : notesError ? (
            <div className="py-16 text-center">
              <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full">
                <FaBookOpen className="text-3xl text-red-500" />
              </div>
              <p className="text-lg font-medium text-red-500">{notesError}</p>
            </div>
          ) : popularNotes.length === 0 ? (
            <div className="py-16 text-center">
              <div className="flex items-center justify-center w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100">
                <FaBookOpen className="text-5xl text-indigo-600" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">No Notes Yet</h3>
              <p className="max-w-md mx-auto mb-8 text-lg text-gray-600">
                Be the first to upload and share your knowledge with the community!
              </p>
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 px-8 py-4 font-bold text-white transition-all duration-300 transform shadow-xl bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl hover:shadow-2xl hover:scale-105"
              >
                <FaUpload />
                Upload First Note
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {popularNotes.map((note) => (
                  <div key={note.id} className="transition-transform duration-300 transform hover:scale-105">
                    <NoteCard note={note} />
                  </div>
                ))}
              </div>

              <div className="mt-16 text-center">
                <Link
                  to="/note"
                  className="inline-flex items-center gap-3 px-10 py-5 text-lg font-bold text-white transition-all duration-300 transform shadow-2xl group bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl hover:shadow-3xl hover:scale-105 hover:from-indigo-700 hover:to-purple-700"
                >
                  <FaBookOpen className="transition-transform duration-300 group-hover:rotate-12" />
                  View All Notes
                  <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative px-4 py-24 overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 bg-white rounded-full w-96 h-96 mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute bottom-0 right-0 bg-yellow-300 rounded-full w-96 h-96 mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="container relative z-10 mx-auto text-center">
          <h2 className="mb-6 text-4xl font-black text-white md:text-5xl">Ready to Transform Your Studies?</h2>
          <p className="max-w-3xl mx-auto mb-12 text-xl leading-relaxed text-white/90">
            Join thousands of students who are already excelling with NoteBank. Start your journey today!
          </p>

          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
            <Link
              to="/register"
              className="flex items-center gap-3 px-10 py-5 text-lg font-bold text-indigo-600 transition-all duration-300 transform bg-white shadow-2xl group rounded-2xl hover:shadow-3xl hover:scale-105"
            >
              <FaUsers className="transition-transform duration-300 group-hover:scale-110" />
              Join the Community
              <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/note"
              className="flex items-center gap-3 px-10 py-5 text-lg font-bold text-white transition-all duration-300 border-2 border-white group rounded-2xl hover:bg-white hover:text-indigo-600"
            >
              <FaDownload className="transition-transform duration-300 group-hover:scale-110" />
              Browse Notes
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
