import { Calendar, MapPin, Building, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import type { Job } from "@/lib/types"

export default function JobCard({ job }: { job: Job }) {
  // Format date
  const formattedDate = job["Created At"]
    ? new Date(job["Created At"]).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A"

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 hidden sm:block">
            {job["Company Logo"] ? (
              <Image
                src={job["Company Logo"] || "/placeholder.svg?height=64&width=64"}
                alt={`${job["Company Name"]} logo`}
                width={64}
                height={64}
                className="rounded-md object-contain"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                <Building className="text-gray-400" size={24} />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <h3 className="text-xl font-semibold text-gray-800">{job.Title}</h3>
              <Badge variant="outline" className="w-fit">
                {job["Job State"] || "Active"}
              </Badge>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-2 text-sm text-gray-500 mb-4">
              {job["Company Name"] && (
                <div className="flex items-center gap-1">
                  <Building size={16} />
                  <span>{job["Company Name"]}</span>
                </div>
              )}

              {job.Location && (
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  <span>{job.Location}</span>
                </div>
              )}

              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>Posted {formattedDate}</span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-600 line-clamp-3">
                {job["Primary Description"] || job.Description?.substring(0, 200) + "..." || "No description available"}
              </p>
            </div>

            {job.Skill && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Skills:</h4>
                <div className="flex flex-wrap gap-2">
                  {job.Skill.split(",").map((skill, index) => (
                    <Badge key={index} variant="secondary" className="font-normal">
                      {skill.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button asChild variant="outline" className="gap-1">
                <a href={job["Detail URL"]} target="_blank" rel="noopener noreferrer">
                  <span>View Job</span>
                  <ExternalLink size={16} />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

