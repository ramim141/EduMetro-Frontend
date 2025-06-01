"use client"

import { FaUsers, FaBookOpen, FaGraduationCap, FaUniversity } from "react-icons/fa"

const StrengthSection = () => {
 

  return (
    <section className="relative px-4 py-20 mx-auto overflow-hidden lg:py-32 bg-gradient-to-br from-indigo-50 via-white to-purple-50 ">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute rounded-full w-80 h-80 bg-gradient-to-br from-indigo-400 to-purple-500 top-10 right-10 blur-3xl animate-pulse"></div>
        <div className="absolute rounded-full w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-500 bottom-10 left-10 blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute w-64 h-64 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 top-1/2 left-1/2 blur-2xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-20 text-center lg:mb-28">
          <div className="inline-flex items-center gap-2 px-6 py-3 mb-8 rounded-full shadow-lg bg-gradient-to-r from-indigo-100 to-purple-100">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
            <p className="text-sm font-bold tracking-wider text-indigo-700 uppercase">Our Impact</p>
          </div>
          <h2 className="mb-8 text-5xl font-black leading-tight text-gray-900 lg:text-7xl xl:text-7xl">
            Strength in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-pulse">
              Numbers
            </span>
          </h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mx-auto mb-10 shadow-lg"></div>
          <p className="max-w-4xl mx-auto text-xl font-medium leading-relaxed text-gray-700 lg:text-2xl">
            Join our thriving community of students and educators sharing knowledge and achieving academic excellence
            together.
            <span className="block mt-3 font-semibold text-indigo-600">Your success is our mission.</span>
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {/* Active Students */}
          <div className="relative p-8 transition-all duration-500 transform border shadow-xl group lg:p-10 bg-white/90 backdrop-blur-sm rounded-3xl hover:shadow-2xl hover:-translate-y-3 border-white/50">
            <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-3xl group-hover:opacity-100"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center justify-center w-20 h-20 transition-all duration-300 shadow-xl bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl group-hover:shadow-2xl group-hover:scale-110">
                  <FaUsers className="m-4 text-4xl text-white" />
                </div>
                <div>
                  <h3 className="text-4xl font-black text-transparent lg:text-4xl bg-gradient-to-br from-blue-600 to-indigo-700 bg-clip-text">
                    100+
                  </h3>
                  <p className="text-lg font-bold text-gray-800 transition-colors duration-300 group-hover:text-blue-600">
                    Active Students
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-600">Growing daily</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="w-4/5 h-2 transition-all duration-1000 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 group-hover:w-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Learning Content */}
          <div className="relative p-8 transition-all duration-500 transform border shadow-xl group lg:p-10 bg-white/90 backdrop-blur-sm rounded-3xl hover:shadow-2xl hover:-translate-y-3 border-white/50">
            <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 rounded-3xl group-hover:opacity-100"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-6 mb-6">

                <div className="flex items-center justify-center w-20 h-20 transition-all duration-300 shadow-xl bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl group-hover:shadow-2xl group-hover:scale-110">
                   <FaBookOpen className="m-4 text-5xl text-white" />
                </div>
              
                <div>
                  <h3 className="text-4xl font-black text-transparent lg:text-4xl bg-gradient-to-br from-emerald-600 to-green-700 bg-clip-text">
                    1000+
                  </h3>
                  <p className="text-lg font-bold text-gray-800 transition-colors duration-300 group-hover:text-emerald-600">
                    Learning Content
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-600">Updated weekly</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="w-5/6 h-2 transition-all duration-1000 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 group-hover:w-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Courses */}
          <div className="relative p-8 transition-all duration-500 transform border shadow-xl group lg:p-10 bg-white/90 backdrop-blur-sm rounded-3xl hover:shadow-2xl hover:-translate-y-3 border-white/50">
            <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-br from-purple-500/5 to-violet-500/5 rounded-3xl group-hover:opacity-100"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center justify-center w-20 h-20 transition-all duration-300 shadow-xl bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl group-hover:shadow-2xl group-hover:scale-110">
                  <FaGraduationCap className="text-5xl text-white" />
                </div>
                <div>
                  <h3 className="text-4xl font-black text-transparent lg:text-4xl bg-gradient-to-br from-purple-600 to-violet-700 bg-clip-text">
                    45+
                  </h3>
                  <p className="text-lg font-bold text-gray-800 transition-colors duration-300 group-hover:text-purple-600">
                    Courses
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-600">Expanding</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="w-3/4 h-2 transition-all duration-1000 rounded-full bg-gradient-to-r from-purple-500 to-violet-600 group-hover:w-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Departments */}
          <div className="relative p-8 transition-all duration-500 transform border shadow-xl group lg:p-10 bg-white/90 backdrop-blur-sm rounded-3xl hover:shadow-2xl hover:-translate-y-3 border-white/50">
            <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 rounded-3xl group-hover:opacity-100"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center justify-center w-20 h-20 transition-all duration-300 shadow-xl bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl group-hover:shadow-2xl group-hover:scale-110">
                  <FaUniversity className="m-4 text-4xl text-white" />
                </div>
                <div>
                  <h3 className="text-4xl font-black text-transparent lg:text-4xl bg-gradient-to-br from-orange-600 to-red-700 bg-clip-text">
                    10+
                  </h3>
                  <p className="text-lg font-bold text-gray-800 transition-colors duration-300 group-hover:text-orange-600">
                    Departments
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-600">Comprehensive</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="w-4/5 h-2 transition-all duration-1000 rounded-full bg-gradient-to-r from-orange-500 to-red-600 group-hover:w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      
      </div>
    </section>
  )
}

export default StrengthSection
