import JobDashboard from "@/components/job-dashboard"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Job Market Dashboard | Job Search Portal",
  description: "Analytics and insights for the AI and ML job market",
}

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-6">
      <JobDashboard jsonPath="/api/dashboard/jobs" />
    </div>
  )
}