import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function JobSearchHeader() {
  return (
    <header className="bg-primary text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="focus:outline-none">
              <h1 className="text-2xl md:text-3xl font-bold">Job Search Portal</h1>
              <p className="text-primary-foreground/80 mt-1">Find your next career opportunity</p>
            </Link>
          </div>
          <Button variant="secondary" className="flex items-center gap-2" asChild>
            <Link href="/?page=1">
              <Search size={18} />
              <span>Browse All Jobs</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

