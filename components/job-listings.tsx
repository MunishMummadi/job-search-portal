import { getJobs } from "@/lib/jobs"
import JobCard from "@/components/job-card"
import JobFilters from "@/components/job-filters"
import Pagination from "@/components/pagination"
import { redirect } from "next/navigation"

// Helper function to extract and normalize salary from text
function extractSalary(text: string | undefined | null): number | null {
  if (!text) return null

  // Regex to find salary patterns like $120,000, $120k, 120000/year, etc.
  const salaryRegex = /(\$?\d{1,3}(?:,\d{3})*(?:k)?)(?:\s*(?:-|to)\s*\$?(\d{1,3}(?:,\d{3})*(?:k)?))?/i
  const match = text.match(salaryRegex)

  if (match && match[1]) {
    let salaryStr = match[1].replace(/[^\d.]/g, "")
    if (match[1].toLowerCase().includes("k")) {
      salaryStr += "000"
    }
    const salary = parseInt(salaryStr, 10)
    // Consider annual salary - adjust if per hour/month is detected (basic check)
    if (!/hour|month/i.test(text)) {
      return salary
    }
  }
  return null
}

// Helper function to escape special characters for RegExp
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\\]]/g, '\\$&'); // $& means the whole matched string
}

// Define a list of common skills to check for
const COMMON_SKILLS = [
  "Python", "JavaScript", "React", "Node.js", "TypeScript", "Java", "C#", "C++",
  "SQL", "NoSQL", "PostgreSQL", "MySQL", "MongoDB",
  "AWS", "Azure", "Google Cloud", "GCP", "Docker", "Kubernetes",
  "Machine Learning", "Deep Learning", "AI", "Data Science", "TensorFlow", "PyTorch",
  "HTML", "CSS", "Angular", "Vue.js", "Next.js",
  "Software Engineer", "Backend", "Frontend", "Full Stack",
  "DevOps", "Linux", "Git", "Agile",
  // Add more relevant skills as needed
];

export default async function JobListings({
  query,
  location,
  company,
  skill,
  minSalary,
  page,
}: {
  query: string
  location: string
  company: string
  skill: string
  minSalary: string
  page: number
}) {
  const jobs = await getJobs()
  const numericMinSalary = parseInt(minSalary, 10) || 0

  console.log(`Total jobs loaded: ${jobs.length}`)

  // Filter jobs based on search parameters
  const filteredJobs = jobs.filter((job) => {
    // Search query matching in title or description
    const matchesQuery =
      !query ||
      (job.Title && job.Title.toLowerCase().includes(query.toLowerCase())) ||
      (job.Description && job.Description.toLowerCase().includes(query.toLowerCase()))

    // Location matching
    const matchesLocation = !location || (job.Location && job.Location === location)

    // Company matching
    const matchesCompany = !company || (job["Company Name"] && job["Company Name"] === company)

    // Skill matching - check Title and Description
    const matchesSkill =
      !skill ||
      (job.Title && job.Title.toLowerCase().includes(skill.toLowerCase())) ||
      (job.Description && job.Description.toLowerCase().includes(skill.toLowerCase()))

    // Salary matching
    const jobSalary = extractSalary(job.Description)
    const matchesSalary =
      !numericMinSalary || (jobSalary !== null && jobSalary >= numericMinSalary)

    return matchesQuery && matchesLocation && matchesCompany && matchesSkill && matchesSalary
  })

  console.log(`Filtered jobs: ${filteredJobs.length}`)

  // Pagination - show more jobs per page
  const itemsPerPage = 20
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage)

  // Redirect to page 1 if the requested page is out of range
  if (page > totalPages && totalPages > 0) {
    // Build the redirect URL with all current filters
    const params = new URLSearchParams()
    if (query) params.set("query", query)
    if (location) params.set("location", location)
    if (company) params.set("company", company)
    if (skill) params.set("skill", skill)
    params.set("page", "1")
    if (minSalary) params.set("minSalary", minSalary)

    redirect(`/?${params.toString()}`)
  }

  const startIndex = (page - 1) * itemsPerPage
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage)

  console.log(
    `Showing jobs ${paginatedJobs.length > 0 ? startIndex + 1 : 0} to ${startIndex + paginatedJobs.length} of ${filteredJobs.length}`,
  )

  // Get unique locations, companies, and skills for filters
  const locations = Array.from(
    new Set(jobs.map((job) => job.Location).filter(Boolean))
  ) as string[]
  const companies = Array.from(
    new Set(jobs.map((job) => job["Company Name"]).filter(Boolean))
  ) as string[]

  // Extract relevant skills from job descriptions and titles based on COMMON_SKILLS
  const foundSkills = new Set<string>()
  jobs.forEach((job) => {
    const textToSearch = `${job.Title?.toLowerCase() || ""} ${job.Description?.toLowerCase() || ""}`
    COMMON_SKILLS.forEach((skill) => {
      // Escape special characters in skill name for regex
      const lowerSkill = skill.toLowerCase()
      const escapedSkill = escapeRegExp(lowerSkill)
      const regexString = `\\b${escapedSkill}\\b`
      console.log(`DEBUG: Skill='${skill}', Escaped='${escapedSkill}', RegexString='${regexString}'`);
      try {
        // Use word boundary check to avoid partial matches (e.g., 'react' in 'reactive')
        const regex = new RegExp(regexString)
        if (regex.test(textToSearch)) {
          foundSkills.add(skill) // Add the original case skill
        }
      } catch (e) {
        console.error(`ERROR: Failed to create RegExp for skill: '${skill}'`, e);
      }
    })
  })
  const skills = Array.from(foundSkills).sort() // Sort skills alphabetically

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
        <JobFilters
          locations={locations}
          companies={companies}
          skills={skills}
          selectedLocation={location}
          selectedCompany={company}
          selectedSkill={skill}
          query={query}
          selectedMinSalary={minSalary}
        />
      </div>
      <div className="lg:col-span-3">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">{filteredJobs.length} Jobs Found</h2>
            <div className="text-sm text-gray-500">
              {filteredJobs.length > 0 ? (
                <span>
                  Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredJobs.length)} of{" "}
                  {filteredJobs.length}
                </span>
              ) : (
                <span>No jobs to display</span>
              )}
            </div>
          </div>
        </div>

        {paginatedJobs.length > 0 ? (
          <div className="space-y-4">
            {paginatedJobs.map((job, index) => (
              <JobCard key={index} job={job} />
            ))}

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              query={query}
              location={location}
              company={company}
              skill={skill}
              minSalary={minSalary}
            />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h3 className="text-lg font-medium text-gray-800 mb-2">No jobs found</h3>
            <p className="text-gray-500">
              {filteredJobs.length > 0
                ? "Try going back to page 1"
                : "Try adjusting your search filters to find more results"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
