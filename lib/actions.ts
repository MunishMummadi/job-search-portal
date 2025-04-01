"use server"

import * as XLSX from "xlsx"
import { saveJobs } from "./jobs"
import type { Job } from "./types"

export async function uploadJobs(formData: FormData) {
  try {
    const file = formData.get("file") as File

    if (!file) {
      throw new Error("No file provided")
    }

    // Convert file to array buffer
    const arrayBuffer = await file.arrayBuffer()

    // Parse Excel file
    const workbook = XLSX.read(arrayBuffer)
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]

    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json<Job>(worksheet)

    // Save jobs to JSON file
    await saveJobs(jsonData)

    return { success: true }
  } catch (error) {
    console.error("Error uploading jobs:", error)
    throw new Error("Failed to upload jobs")
  }
}

