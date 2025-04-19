"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/context/useAuth"
import { ArrowLeft } from "lucide-react"

export default function EditProfile() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    bio: user || "",
    website: user || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault()
    router.push("/profile")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user) {
    router.push("/login")
    return null
  }

  return (
    <div className="max-w-4xl mx-auto bg-gray-50 min-h-screen">
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center">
            <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold ml-4">Edit profile</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto mt-6 px-4">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              name="bio"
              value={formData.fullName}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tell something about yourself"
            />
            <p className="text-xs text-gray-500 mt-1">{formData.fullName}/80</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input
              type="url"
              name="website"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 font-medium"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  )
}

