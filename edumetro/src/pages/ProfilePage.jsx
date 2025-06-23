"use client"

import { useState, useEffect, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import Button from "@/components/Button"
import { Card, CardContent, CardHeader } from "@/components/Card"
import { Badge } from "@/components/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar"
import AuthContext from "../context/AuthContext"
import { getMyNotes, getBookmarkedNotes } from "../utils/api" // API ফাংশন ইম্পোর্ট করুন
import {
  CheckCircle,
  GraduationCap,
  Award,
  User,
  Mail,
  Phone,
  Globe,
  BadgeIcon as IdCard,
  Calendar,
  Star,
  Edit3,
  BookOpen,
} from "lucide-react"

export default function ProfilePage() {
  const navigate = useNavigate()

  const { user, isLoading: authLoading } = useContext(AuthContext)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  // ডাইনামিক ডেটা এবং লোডিং স্টেটের জন্য
  const [stats, setStats] = useState({
    averageRating: 0,
    totalNotes: 0,
    totalBookmarks: 0,
    totalLikes: 0,
    totalReviews: 0,
  })
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchUserStats = async () => {
      setStatsLoading(true)
      try {
        const [myNotesResponse, bookmarkedNotesResponse] = await Promise.all([
          getMyNotes({ page_size: 1000 }),
          getBookmarkedNotes({ page_size: 1 }),
        ])

        // Defensive coding: API থেকে আসা results অ্যারে আছে কিনা তা পরীক্ষা করা
        const myNotes = myNotesResponse?.data?.results || []
        const totalBookmarks = bookmarkedNotesResponse?.data?.count || 0

        // myNotes একটি অ্যারে কিনা তা নিশ্চিত করা, না হলে ক্র্যাশ এড়ানো
        if (!Array.isArray(myNotes)) {
          console.error("API response for myNotes is not an array:", myNotes)
          throw new Error("Invalid data structure for notes.")
        }

        let totalLikes = 0
        let totalReviews = 0
        let totalStarsSum = 0
        let notesWithRatings = 0

        myNotes.forEach((note) => {
          // প্রতিটি property আছে কিনা তা পরীক্ষা করে যোগ করা হচ্ছে
          totalLikes += note?.likes_count || 0
          totalReviews += note?.star_ratings?.length || 0
          if (note?.average_rating && note.average_rating > 0) {
            totalStarsSum += note.average_rating
            notesWithRatings++
          }
        })

        const averageRating = notesWithRatings > 0 ? totalStarsSum / notesWithRatings : 0

        setStats({
          averageRating: averageRating.toFixed(1),
          totalNotes: myNotesResponse?.data?.count || 0,
          totalBookmarks: totalBookmarks,
          totalLikes: totalLikes,
          totalReviews: totalReviews,
        })
      } catch (error) {
        console.error("Failed to fetch user stats:", error)
        // এখানে একটি টোস্ট নোটিফিকেশন দেখানো যেতে পারে ব্যবহারকারীকে জানানোর জন্য
        // toast.error("Could not load your academic stats.");
      } finally {
        setStatsLoading(false)
      }
    }

    fetchUserStats()
  }, [user])

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get("updated") === "true") {
      setShowSuccessMessage(true)
      const timer = setTimeout(() => {
        setShowSuccessMessage(false)
        window.history.replaceState({}, "", window.location.pathname)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [])

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 animate-pulse">
        <div className="p-8 shadow-2xl bg-white/20 backdrop-blur-lg rounded-2xl">
          <p className="text-xl font-semibold text-white animate-bounce">Loading Profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    navigate("/login")
    return null
  }

  const {
    username,
    first_name,
    last_name,
    email,
    student_id,
    department,
    profile_picture_url,
    bio,
    mobile_number,
    university,
    website,
    birthday,
    gender,
    skills,
  } = user

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#837CEE] via-[#DAADEC] to-[#5FFBF1] animate-gradient-x">
      <style jsx>{`
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes fadeInLeft {
      from {
        opacity: 0;
        transform: translateX(-30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    @keyframes fadeInRight {
      from {
        opacity: 0;
        transform: translateX(30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.9);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    
    .animate-fadeInUp {
      animation: fadeInUp 0.6s ease-out forwards;
    }
    
    .animate-fadeInLeft {
      animation: fadeInLeft 0.8s ease-out forwards;
    }
    
    .animate-fadeInRight {
      animation: fadeInRight 0.8s ease-out forwards;
    }
    
    .animate-scaleIn {
      animation: scaleIn 0.5s ease-out forwards;
    }
    
    .animate-delay-100 {
      animation-delay: 0.1s;
    }
    
    .animate-delay-200 {
      animation-delay: 0.2s;
    }
    
    .animate-delay-300 {
      animation-delay: 0.3s;
    }
    
    .animate-delay-400 {
      animation-delay: 0.4s;
    }
    
    .animate-delay-500 {
      animation-delay: 0.5s;
    }
    
    .animate-delay-600 {
      animation-delay: 0.6s;
    }
    
    .animate-delay-700 {
      animation-delay: 0.7s;
    }
    
    .animate-delay-800 {
      animation-delay: 0.8s;
    }
  `}</style>
      <div className="min-h-screen pt-8 bg-gradient-to-br from-[#BDC6F5] via-[#DAADEC] to-[#B2E3E2] backdrop-blur-sm">
        <div className="container px-4 py-8 mx-auto max-w-7xl">
          {/* Header */}
          <div className="pt-8 mb-8 transition-all duration-500 ease-out transform opacity-0 hover:scale-105 animate-fadeInUp">
            <div className="p-8 transition-all duration-300 border shadow-2xl bg-gradient-to-r from-violet-600/5 via-purple-600/10 to-fuchsia-600/10 backdrop-blur-lg rounded-3xl border-white/20 hover:shadow-purple-500/25">
              <h1 className="text-4xl font-extrabold text-transparent bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text animate-pulse">
                Profile{" "}
                <span className="text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text">
                  Dashboard
                </span>
              </h1>
              <div className="w-32 h-1 mt-4 mb-2 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-pulse"></div>
              <p className="max-w-3xl text-2xl leading-relaxed text-gray-700">
                Welcome back,{" "}
                <span className="font-bold text-transparent uppercase bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text animate-bounce">
                  {first_name}
                </span>
                !
              </p>
            </div>
          </div>

          {/* Success Message */}
          {showSuccessMessage && (
            <div className="mb-6 transform opacity-0 animate-slideInDown animate-scaleIn">
              <Card
                className="transition-all duration-300 shadow-xl bg-gradient-to-r from-emerald-400/20 to-green-400/20 border-emerald-300/50 backdrop-blur-lg hover:shadow-emerald-500/25"
                padding={false}
              >
                <CardContent className="flex items-center gap-3 p-4">
                  <CheckCircle className="w-5 h-5 text-emerald-600 animate-spin" />
                  <div>
                    <p className="font-medium text-emerald-800">Success!</p>
                    <p className="text-sm text-emerald-700">Profile updated successfully.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Column */}
            <div className="space-y-6 opacity-0 lg:col-span-1 animate-fadeInLeft">
              {/* Profile Card */}
              <div className="transition-all duration-500 ease-out transform opacity-0 hover:scale-105 hover:rotate-1 animate-scaleIn animate-delay-200">
                <Card className="overflow-hidden transition-all duration-300 border border-0 shadow-2xl bg-gradient-to-br from-purple-500/20 via-blue-500/15 to-pink-500/20 backdrop-blur-lg border-white/20 hover:shadow-purple-500/25">
                  <CardContent className="p-6 text-center">
                    <div className="relative mb-4 group">
                      <div className="absolute inset-0 transition-opacity duration-300 rounded-full opacity-75 bg-gradient-to-r from-purple-400 to-pink-400 blur-lg group-hover:opacity-100 animate-pulse"></div>
                      <Avatar className="relative w-32 h-32 mx-auto transition-all duration-300 transform border-4 border-white shadow-2xl hover:shadow-purple-500/50 hover:scale-110">
                        <AvatarImage src={profile_picture_url || "/placeholder.svg"} alt={username} />
                        <AvatarFallback className="text-2xl font-bold text-white bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 animate-gradient-x">
                          {first_name?.charAt(0)}
                          {last_name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute transform -translate-x-1/2 -bottom-2 animate-bounce left-3 right-3">
                        <Badge className="px-3 py-1 text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 hover:shadow-emerald-500/50">
                          <Star className="w-3 h-3 mr-1 animate-spin" />
                          {statsLoading ? "..." : stats.averageRating}
                        </Badge>
                      </div>
                    </div>
                    <h2 className="mb-1 text-xl font-bold text-transparent bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text">
                      {first_name} {last_name}
                    </h2>
                    <p className="mb-4 text-slate-600">@{username}</p>
                    <div className="flex justify-center gap-4 text-sm">
                      <div className="p-3 text-center transition-all duration-300 transform bg-gradient-to-br from-blue-500/15 to-blue-600/20 rounded-xl hover:from-blue-500/25 hover:to-blue-600/30 hover:scale-110">
                        <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text">
                          {statsLoading ? "..." : stats.totalNotes}
                        </p>
                        <p className="text-slate-500">Notes</p>
                      </div>
                      <div className="p-3 text-center transition-all duration-300 transform bg-gradient-to-br from-purple-500/15 to-purple-600/20 rounded-xl hover:from-purple-500/25 hover:to-purple-600/30 hover:scale-110">
                        <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text">
                          {statsLoading ? "..." : stats.totalBookmarks}
                        </p>
                        <p className="text-slate-500">Bookmarks</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Education Card */}
              <div className="transition-all duration-500 ease-out transform opacity-0 hover:scale-105 hover:-rotate-1 animate-fadeInUp animate-delay-400">
                <Card className="transition-all duration-300 border border-0 shadow-2xl bg-gradient-to-br from-cyan-500/20 via-blue-500/15 to-indigo-500/20 backdrop-blur-lg border-white/20 hover:shadow-blue-500/25">
                  <CardHeader className="pb-3 rounded-t-lg bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse">
                        <GraduationCap className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-transparent bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text">
                        Education
                      </h3>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 p-3 transition-all duration-300 rounded-lg bg-gradient-to-r from-blue-400/10 to-indigo-400/15 hover:from-blue-500/20 hover:to-indigo-500/25">
                      <div className="p-2 rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-indigo-500">
                        <GraduationCap className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">University</p>
                        <p className="font-semibold text-slate-800">{university || "Not set"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 transition-all duration-300 rounded-lg bg-gradient-to-r from-indigo-400/10 to-purple-400/15 hover:from-indigo-500/20 hover:to-purple-500/25">
                      <div className="p-2 rounded-lg shadow-lg bg-gradient-to-r from-indigo-500 to-purple-500">
                        <BookOpen className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">Department</p>
                        <p className="font-semibold text-slate-800">{department || "Not set"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 transition-all duration-300 rounded-lg bg-gradient-to-r from-purple-400/10 to-pink-400/15 hover:from-purple-500/20 hover:to-pink-500/25">
                      <div className="p-2 rounded-lg shadow-lg bg-gradient-to-r from-purple-500 to-pink-500">
                        <IdCard className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">Student ID</p>
                        <p className="font-mono font-bold text-slate-800">{student_id || "Not set"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Skills Card */}
              <div className="transition-all duration-500 ease-out transform opacity-0 hover:scale-105 hover:rotate-1 animate-fadeInUp animate-delay-600">
                <Card className="transition-all duration-300 border border-0 shadow-2xl bg-gradient-to-br from-purple-500/20 via-pink-500/15 to-rose-500/20 backdrop-blur-lg border-white/20 hover:shadow-purple-500/25">
                  <CardHeader className="pb-3 rounded-t-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse">
                        <Award className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-transparent bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text">
                        Skills
                      </h3>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {skills && skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="transition-all duration-300 transform shadow-lg bg-gradient-to-r from-blue-100/70 via-purple-100/70 to-pink-100/70 text-slate-700 hover:from-blue-200/90 hover:via-purple-200/90 hover:to-pink-200/90 hover:scale-110 hover:shadow-purple-500/25 animate-fadeIn"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">No skills added yet.</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="transition-all duration-500 ease-out transform opacity-0 hover:scale-105 animate-fadeInUp animate-delay-800">
                <Card className="transition-all duration-300 border border-0 shadow-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/15 to-cyan-500/20 backdrop-blur-lg border-white/20 hover:shadow-emerald-500/25">
                  <CardContent className="p-4 space-y-3">
                    <Link to="/my-notes" className="block">
                      <Button
                        variant="outline"
                        className="justify-start w-full gap-2 text-white transition-all duration-300 transform shadow-lg bg-gradient-to-r from-[#CC39D1] to-[#342FEE] hover:from-[#3950D1] hover:to-[#3BF0EC]   hover:scale-105 "
                      >
                        <BookOpen className="inline w-4 h-4 mr-3 text-white" />
                        My Notes
                      </Button>
                    </Link>
                    <Link to="/notes" className="block">
                      <Button
                        variant="outline"
                        className="justify-start w-full gap-2 text-white transition-all duration-300 transform shadow-lg bg-gradient-to-r from-[#CC39D1] to-[#342FEE] hover:from-[#3950D1] hover:to-[#3BF0EC]   hover:scale-105"
                      >
                        <BookOpen className="inline w-4 h-4 mr-3 text-white" />
                        My Bookmarks
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 transform hover:scale-[1.02] transition-all duration-500 ease-out opacity-0 animate-fadeInRight animate-delay-300">
              <Card className="transition-all duration-300 border border-0 shadow-2xl bg-gradient-to-br from-slate-800/10 via-gray-700/5 to-zinc-600/10 backdrop-blur-lg border-white/20 hover:shadow-slate-500/25">
                <CardHeader className="rounded-t-lg bg-gradient-to-r from-slate-500/10 via-gray-500/10 to-zinc-500/10">
                  <div className="flex items-start justify-between">
                    <div className="transition-all duration-300 transform hover:scale-105">
                      <h2 className="mb-1 text-2xl font-bold text-transparent bg-gradient-to-r from-slate-800 via-gray-700 to-slate-600 bg-clip-text">
                        {first_name} {last_name}
                      </h2>
                      <p className="text-slate-600">Student Profile</p>
                    </div>
                    <Link to="/profile/edit">
                      <div className="transition-all duration-300 transform hover:scale-110 hover:rotate-3">
                        <Button className="px-6 py-5 text-white transition-all duration-300 shadow-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 hover:shadow-purple-500/50 animate-pulse">
                          <div className="flex items-center">
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit Profile
                          </div>
                        </Button>
                      </div>
                    </Link>
                  </div>
                </CardHeader>

                <CardContent className="space-y-8">
                  {/* Bio Section */}
                  {bio && (
                    <div className="p-6 transition-all duration-300 transform opacity-0 bg-gradient-to-r from-blue-500/15 via-indigo-500/10 to-purple-500/15 rounded-2xl hover:from-blue-500/25 hover:via-indigo-500/20 hover:to-purple-500/25 hover:scale-105 animate-fadeInUp animate-delay-500">
                      <h3 className="flex items-center gap-2 mb-3 text-lg font-semibold text-transparent bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text">
                        <div className="p-2 rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-indigo-500">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        About
                      </h3>
                      <p className="font-medium leading-relaxed text-slate-700">{bio}</p>
                    </div>
                  )}

                  {/* Contact Information */}
                  <div className="p-6 transition-all duration-300 transform opacity-0 bg-gradient-to-r from-green-500/15 via-emerald-500/10 to-teal-500/15 rounded-2xl hover:from-green-500/25 hover:via-emerald-500/20 hover:to-teal-500/25 hover:scale-105 animate-fadeInUp animate-delay-600">
                    <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-transparent bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text">
                      <div className="p-2 rounded-lg shadow-lg bg-gradient-to-r from-green-500 to-emerald-500 animate-pulse">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="flex items-center gap-3 p-4 transition-all duration-300 transform bg-gradient-to-r from-blue-500/15 to-blue-600/20 rounded-xl hover:from-blue-500/25 hover:to-blue-600/30 hover:scale-105">
                        <div className="p-2 rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-blue-600">
                          <Mail className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600">Email</p>
                          <p className="font-semibold text-slate-800">{email || "Not set"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 transition-all duration-300 transform bg-gradient-to-r from-green-500/15 to-green-600/20 rounded-xl hover:from-green-500/25 hover:to-green-600/30 hover:scale-105">
                        <div className="p-2 rounded-lg shadow-lg bg-gradient-to-r from-green-500 to-green-600">
                          <Phone className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600">Mobile</p>
                          <p className="font-semibold text-slate-800">{mobile_number || "Not set"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 transition-all duration-300 transform bg-gradient-to-r from-purple-500/15 to-purple-600/20 rounded-xl hover:from-purple-500/25 hover:to-purple-600/30 hover:scale-105">
                        <div className="p-2 rounded-lg shadow-lg bg-gradient-to-r from-purple-500 to-purple-600">
                          <Globe className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600">Website</p>
                          <p className="font-semibold text-slate-800">{website || "Not set"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Basic Information */}
                  <div className="p-6 transition-all duration-300 transform opacity-0 bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-yellow-500/15 rounded-2xl hover:from-orange-500/25 hover:via-amber-500/20 hover:to-yellow-500/25 hover:scale-105 animate-fadeInUp animate-delay-700">
                    <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-transparent bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text">
                      <div className="p-2 rounded-lg shadow-lg bg-gradient-to-r from-orange-500 to-amber-500 animate-pulse">
                        <IdCard className="w-5 h-5 text-white" />
                      </div>
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="flex items-center gap-3 p-4 transition-all duration-300 transform bg-gradient-to-r from-pink-500/15 to-pink-600/20 rounded-xl hover:from-pink-500/25 hover:to-pink-600/30 hover:scale-105">
                        <div className="p-2 rounded-lg shadow-lg bg-gradient-to-r from-pink-500 to-pink-600">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600">Gender</p>
                          <p className="font-semibold text-slate-800">{gender || "Not set"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 transition-all duration-300 transform bg-gradient-to-r from-yellow-500/15 to-yellow-600/20 rounded-xl hover:from-yellow-500/25 hover:to-yellow-600/30 hover:scale-105">
                        <div className="p-2 rounded-lg shadow-lg bg-gradient-to-r from-yellow-500 to-yellow-600">
                          <Calendar className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600">Birthday</p>
                          <p className="font-semibold text-slate-800">
                            {birthday
                              ? new Date(birthday).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                              : "Not set"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Academic Stats */}
                  <div className="p-6 transition-all duration-300 transform opacity-0 bg-gradient-to-r from-indigo-500/15 via-purple-500/10 to-pink-500/15 rounded-2xl hover:from-indigo-500/25 hover:via-purple-500/20 hover:to-pink-500/25 hover:scale-105 animate-fadeInUp animate-delay-800">
                    <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-transparent bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text">
                      <div className="p-2 rounded-lg shadow-lg bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      Academic Activity
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                      <div className="transition-all duration-300 transform hover:scale-110 hover:rotate-3">
                        <Card
                          className="h-full transition-all duration-300 shadow-xl border-blue-200/50 bg-gradient-to-br from-blue-100/70 via-blue-50/50 to-cyan-50/70 backdrop-blur-sm hover:shadow-blue-500/25"
                          padding={false}
                        >
                          <CardContent className="p-4 text-center">
                            <div className="mb-1 text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text animate-pulse">
                              {statsLoading ? "..." : stats.totalNotes}
                            </div>
                            <div className="text-sm font-semibold text-blue-600">Notes Uploaded</div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="transition-all duration-300 transform hover:scale-110 hover:-rotate-3">
                        <Card
                          className="h-full transition-all duration-300 shadow-xl border-purple-200/50 bg-gradient-to-br from-purple-100/70 via-purple-50/50 to-pink-50/70 backdrop-blur-sm hover:shadow-purple-500/25"
                          padding={false}
                        >
                          <CardContent className="p-4 text-center">
                            <div className="mb-1 text-2xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text animate-pulse">
                              {statsLoading ? "..." : stats.totalBookmarks}
                            </div>
                            <div className="text-sm font-semibold text-purple-600">Bookmarks</div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="transition-all duration-300 transform hover:scale-110 hover:rotate-3">
                        <Card
                          className="h-full transition-all duration-300 shadow-xl border-red-200/50 bg-gradient-to-br from-red-100/70 via-pink-50/50 to-rose-50/70 backdrop-blur-sm hover:shadow-red-500/25"
                          padding={false}
                        >
                          <CardContent className="p-4 text-center">
                            <div className="mb-1 text-2xl font-bold text-transparent bg-gradient-to-r from-red-600 to-rose-800 bg-clip-text animate-pulse">
                              {statsLoading ? "..." : stats.totalLikes}
                            </div>
                            <div className="text-sm font-semibold text-red-600">Total Likes</div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="transition-all duration-300 transform hover:scale-110 hover:-rotate-3">
                        <Card
                          className="h-full transition-all duration-300 shadow-xl border-orange-200/50 bg-gradient-to-br from-orange-100/70 via-amber-50/50 to-yellow-50/70 backdrop-blur-sm hover:shadow-orange-500/25"
                          padding={false}
                        >
                          <CardContent className="p-4 text-center">
                            <div className="mb-1 text-2xl font-bold text-transparent bg-gradient-to-r from-orange-600 to-amber-800 bg-clip-text animate-pulse">
                              {statsLoading ? "..." : stats.totalReviews}
                            </div>
                            <div className="text-sm font-semibold text-orange-600">Total Reviews</div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="transition-all duration-300 transform hover:scale-110 hover:rotate-3">
                        <Card
                          className="h-full transition-all duration-300 shadow-xl bg-gradient-to-br from-emerald-100/70 via-emerald-50/50 to-green-50/70 border-emerald-200/50 backdrop-blur-sm hover:shadow-emerald-500/25"
                          padding={false}
                        >
                          <CardContent className="p-4 text-center">
                            <div className="mb-1 text-2xl font-bold text-transparent bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text animate-pulse">
                              {statsLoading ? "..." : stats.averageRating}
                            </div>
                            <div className="text-sm font-semibold text-emerald-600">Avg. Rating</div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
