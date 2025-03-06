import path from "path"
import fs from "fs"
import type { Job } from "./types"

// Path to the JSON file in the repository
const JSON_FILE_PATH = path.join(process.cwd(), "data", "jobs.json")

// Cache the jobs data to avoid reading the file on every request
let jobsCache: Job[] | null = null

export async function getJobs(): Promise<Job[]> {
  // Clear cache to ensure we always get fresh data during development
  jobsCache = null

  try {
    // Check if the JSON file exists
    if (!fs.existsSync(JSON_FILE_PATH)) {
      console.error("JSON file not found at path:", JSON_FILE_PATH)
      return []
    }

    // Read the JSON file
    const data = fs.readFileSync(JSON_FILE_PATH, "utf8")

    try {
      const jobs = JSON.parse(data) as Job[]
      console.log(`Successfully loaded ${jobs.length} jobs from JSON file`)
      return jobs
    } catch (parseError) {
      console.error("Error parsing JSON data:", parseError)
      return []
    }
  } catch (error) {
    console.error("Error reading jobs data:", error)
    return []
  }
}

export async function saveJobs(jobs: Job[]): Promise<void> {
  try {
    // Write the JSON file
    fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(jobs, null, 2), "utf8")

    // Clear the cache
    jobsCache = null

    console.log(`Successfully saved ${jobs.length} jobs to JSON file`)
  } catch (error) {
    console.error("Error saving jobs data:", error)
    throw new Error("Failed to save jobs data")
  }
}

