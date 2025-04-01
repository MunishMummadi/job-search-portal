import { Suspense } from "react"
import JobSearchHeader from "@/components/job-search-header"
import JobListings from "@/components/job-listings"
import { getJobs } from "@/lib/jobs"

export const dynamic = "force-dynamic" // Disable caching for this page

export default async function Home({
  searchParams,
}: {
  searchParams: {
    query?: string
    location?: string
    company?: string
    page?: string
    skill?: string
  }
}) {
  const jobs = await getJobs()
  const query = searchParams.query || ""
  const location = searchParams.location || ""
  const company = searchParams.company || ""
  const skill = searchParams.skill || ""
  const page = Number(searchParams.page) || 1

  return (
    <main className="min-h-screen bg-gray-50">
      <JobSearchHeader />
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<div className="flex justify-center py-12">Loading jobs...</div>}>
          <JobListings query={query} location={location} company={company} skill={skill} page={page} />
        </Suspense>
      </div>
    </main>
  )
}

