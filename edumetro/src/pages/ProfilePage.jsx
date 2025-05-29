"use client"

import React, { useState, useEffect, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import Button from "@/components/Button"
import { Card, CardContent, CardHeader } from "@/components/card"
import { Badge } from "@/components/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar"
import AuthContext from '../context/AuthContext'
import {
  CheckCircle,
  GraduationCap,
  Award,
  Bookmark,
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

// Mock user data - replace with your actual user context/API
// const mockUser = {
//   username: "johndoe",
//   first_name: "John",
//   last_name: "Doe",
//   email: "john.doe@university.edu",
//   student_id: "STU2024001",
//   mobile_number: "+1 (555) 123-4567",
//   website: "https://johndoe.dev",
//   university: "Stanford University",
//   department: "Computer Science",
//   gender: "Male",
//   birthday: "1998-05-15",
//   skills: ["JavaScript", "React", "Python", "Machine Learning", "Data Analysis"],
//   bio: "Passionate computer science student with a focus on AI and web development. Always eager to learn new technologies and contribute to innovative projects.",
// }

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  // Mock success message trigger
  useEffect(() => {
    // Simulate success message from profile update
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get("updated") === "true") {
      setShowSuccessMessage(true)
      const timer = setTimeout(() => {
        setShowSuccessMessage(false)
        // Clean up URL
        window.history.replaceState({}, "", window.location.pathname)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [])

  const placeholderData = {
    noteRating: "4.8",
    totalNotes: 127,
    bookmarks: 23,
  }

  if (!user) {
    navigate("/login")
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br via-blue-50 to-indigo-50 from-slate-50">
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-slate-800">Profile Dashboard</h1>
          <p className="text-slate-600">Manage your academic profile and preferences</p>
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <Card className="mb-6 bg-emerald-50 border-emerald-200">
            <CardContent className="flex gap-3 items-center p-4">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="font-medium text-emerald-800">Success!</p>
                <p className="text-sm text-emerald-700">Profile updated successfully.</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-6 lg:col-span-1">
            {/* Profile Card */}
            <Card className="overflow-hidden bg-gradient-to-br from-white border-0 shadow-lg to-slate-50">
              <CardContent className="p-6 text-center">
                <div className="relative mb-4">
                  <Avatar className="mx-auto w-32 h-32 border-4 border-white shadow-lg">
                    <AvatarImage src="/placeholder.svg?height=128&width=128" alt={user.username} />
                    <AvatarFallback className="text-2xl font-bold text-white bg-gradient-to-br from-blue-500 to-indigo-600">
                      {user.first_name?.charAt(0)}
                      {user.last_name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <Badge className="px-3 py-1 text-white bg-emerald-500 hover:bg-emerald-600">
                      <Star className="mr-1 w-3 h-3" />
                      {placeholderData.noteRating}
                    </Badge>
                  </div>
                </div>
                <h2 className="mb-1 text-xl font-bold text-slate-800">
                  {user.first_name} {user.last_name}
                </h2>
                <p className="mb-4 text-slate-600">@{user.username}</p>
                <div className="flex gap-4 justify-center text-sm">
                  <div className="text-center">
                    <p className="font-bold text-blue-600">{placeholderData.totalNotes}</p>
                    <p className="text-slate-500">Notes</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-purple-600">{placeholderData.bookmarks}</p>
                    <p className="text-slate-500">Bookmarks</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Education Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex gap-2 items-center">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-slate-800">Education</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-slate-600">University</p>
                  <p className="text-slate-800">{user.university || "Not set"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Department</p>
                  <p className="text-slate-800">{user.department || "Not set"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Student ID</p>
                  <p className="font-mono text-slate-800">{user.student_id || "Not set"}</p>
                </div>
              </CardContent>
            </Card>

            {/* Skills Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex gap-2 items-center">
                  <Award className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-slate-800">Skills</h3>
                </div>
              </CardHeader>
              <CardContent>
                {user.skills && user.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-gradient-to-r from-blue-100 to-purple-100 text-slate-700 hover:from-blue-200 hover:to-purple-200"
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

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 space-y-3">
                <Link to="/bookmarks" className="block">
                  <Button
                    variant="outline"
                    className="gap-2 justify-start w-full hover:bg-blue-50 hover:border-blue-200"
                  >
                    <Bookmark className="w-4 h-4" />
                    View Bookmarks
                  </Button>
                </Link>
                <Link to="/notes" className="block">
                  <Button
                    variant="outline"
                    className="gap-2 justify-start w-full hover:bg-purple-50 hover:border-purple-200"
                  >
                    <BookOpen className="w-4 h-4" />
                    My Notes
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader className="border-b border-slate-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="mb-1 text-2xl font-bold text-slate-800">
                      {user.first_name} {user.last_name}
                    </h2>
                    <p className="text-slate-600">Student Profile</p>
                  </div>
                  <Link to="/profile/edit">
                    <Button className="text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg hover:from-blue-700 hover:to-indigo-700">
                      <Edit3 className="mr-2 w-4 h-4" />
                      Edit Profile
                    </Button>
                  </Link>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-8">
                {/* Bio Section */}
                {user.bio && (
                  <div>
                    <h3 className="flex gap-2 items-center mb-3 text-lg font-semibold text-slate-800">
                      <User className="w-5 h-5 text-blue-600" />
                      About
                    </h3>
                    <p className="leading-relaxed text-slate-700">{user.bio}</p>
                  </div>
                )}

                {/* Contact Information */}
                <div>
                  <h3 className="flex gap-2 items-center mb-4 text-lg font-semibold text-slate-800">
                    <Mail className="w-5 h-5 text-green-600" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="flex gap-3 items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Mail className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">Email</p>
                        <p className="text-slate-800">{user.email || "Not set"}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Phone className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">Mobile</p>
                        <p className="text-slate-800">{user.mobile_number || "Not set"}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-center">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Globe className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">Website</p>
                        <p className="text-slate-800">{user.website || "Not set"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div>
                  <h3 className="flex gap-2 items-center mb-4 text-lg font-semibold text-slate-800">
                    <IdCard className="w-5 h-5 text-orange-600" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="flex gap-3 items-center">
                      <div className="p-2 bg-pink-100 rounded-lg">
                        <User className="w-4 h-4 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">Gender</p>
                        <p className="text-slate-800">{user.gender || "Not set"}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-center">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Calendar className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">Birthday</p>
                        <p className="text-slate-800">
                          {user.birthday
                            ? new Date(user.birthday).toLocaleDateString("en-US", {
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
                <div>
                  <h3 className="flex gap-2 items-center mb-4 text-lg font-semibold text-slate-800">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    Academic Activity
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                      <CardContent className="p-4 text-center">
                        <div className="mb-1 text-2xl font-bold text-blue-700">{placeholderData.totalNotes}</div>
                        <div className="text-sm text-blue-600">Notes Shared</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                      <CardContent className="p-4 text-center">
                        <div className="mb-1 text-2xl font-bold text-purple-700">{placeholderData.bookmarks}</div>
                        <div className="text-sm text-purple-600">Bookmarks</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
                      <CardContent className="p-4 text-center">
                        <div className="mb-1 text-2xl font-bold text-emerald-700">{placeholderData.noteRating}</div>
                        <div className="text-sm text-emerald-600">Avg Rating</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
