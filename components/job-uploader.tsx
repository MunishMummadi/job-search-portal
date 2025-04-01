"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileUp, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { uploadJobs } from "@/lib/actions"
import { useRouter } from "next/navigation"

export default function JobUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.name.endsWith(".xlsx")) {
        setFile(selectedFile)
        setError(null)
      } else {
        setError("Please select an Excel (.xlsx) file")
        setFile(null)
      }
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      await uploadJobs(formData)
      setSuccess(true)
      setTimeout(() => {
        router.refresh()
      }, 1500)
    } catch (err) {
      setError("Failed to upload file. Please try again.")
      console.error(err)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="p-4 bg-primary/10 rounded-full">
          <Upload size={32} className="text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800">Upload Job Data</h3>
        <p className="text-gray-500 text-center text-sm">Upload your Excel (.xlsx) file containing job listings</p>

        <div className="w-full mt-4">
          <label
            htmlFor="file-upload"
            className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-primary focus:outline-none"
          >
            <div className="flex flex-col items-center space-y-2">
              {file ? (
                <>
                  <Check size={24} className="text-green-500" />
                  <span className="font-medium text-gray-600">{file.name}</span>
                </>
              ) : (
                <>
                  <FileUp size={24} className="text-gray-500" />
                  <span className="font-medium text-gray-600">Click to select a file</span>
                </>
              )}
            </div>
            <input id="file-upload" type="file" className="hidden" accept=".xlsx" onChange={handleFileChange} />
          </label>
        </div>

        {error && (
          <div className="flex items-center text-red-500 text-sm gap-1">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center text-green-500 text-sm gap-1">
            <Check size={16} />
            <span>File uploaded successfully!</span>
          </div>
        )}

        <Button onClick={handleUpload} disabled={!file || isUploading || success} className="w-full">
          {isUploading ? "Uploading..." : "Upload File"}
        </Button>
      </div>
    </div>
  )
}

