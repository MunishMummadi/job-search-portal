import { getJobs } from "@/lib/jobs"
import JobCard from "@/components/job-card"
import JobFilters from "@/components/job-filters"
import Pagination from "@/components/pagination"
import { redirect } from "next/navigation"

export default async function JobListings({
  query,
  location,
  company,
  skill,
  page,
}: {
  query: string
  location: string
  company: string
  skill: string
  page: number
}) {
  const jobs = await getJobs()

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

    // Skill matching
    const matchesSkill = !skill || (job.Skill && job.Skill === skill)

    return matchesQuery && matchesLocation && matchesCompany && matchesSkill
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

    redirect(`/?${params.toString()}`)
  }

  const startIndex = (page - 1) * itemsPerPage
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage)

  console.log(
    `Showing jobs ${paginatedJobs.length > 0 ? startIndex + 1 : 0} to ${startIndex + paginatedJobs.length} of ${filteredJobs.length}`,
  )

  // Get unique locations and companies for filters
  const locations = Array.from(new Set(jobs.map((job) => job.Location).filter(Boolean)))
  const companies = Array.from(new Set(jobs.map((job) => job["Company Name"]).filter(Boolean)))
  const skills = Array.from(new Set(jobs.map((job) => job.Skill).filter(Boolean)))

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

