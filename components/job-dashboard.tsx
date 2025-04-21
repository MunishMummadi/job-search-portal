"use client"

import * as React from "react"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  Legend,
} from "recharts"
import { ArrowUpRight, Briefcase, Building, DollarSign, Globe2, LayoutDashboard, MapPin, Settings, Search, Loader2 } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThemeToggle } from "@/components/theme-toggle"
import type { Job, JobAnalytics } from "@/lib/types"
import {
  extractSalary,
  extractRemoteType,
  getJobsByMonth,
  getJobsByTitle,
  getJobsByLocation,
  getJobsByRemoteType,
  extractSkills,
  getAverageSalaryByTitle,
  calculateJobAnalytics,
} from "@/lib/dashboard-utils"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"]

interface JobDashboardProps {
  className?: string
  jsonPath?: string
}

export default function JobDashboard({ className, jsonPath = "/api/dashboard/jobs" }: JobDashboardProps) {
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [jobs, setJobs] = React.useState<Job[]>([])
  const [analytics, setAnalytics] = React.useState<JobAnalytics>({
    totalJobs: 0,
    averageSalary: "N/A",
    topLocation: "N/A",
    topLocationPercentage: "0%",
    activeJobs: 0,
  })

  // Data for charts
  const [monthlyJobData, setMonthlyJobData] = React.useState([])
  const [jobTypeData, setJobTypeData] = React.useState([])
  const [locationData, setLocationData] = React.useState([])
  const [remoteWorkData, setRemoteWorkData] = React.useState([])
  const [skillsData, setSkillsData] = React.useState([])
  const [salaryData, setSalaryData] = React.useState([])

  // Function to use fallback sample data
  const [isUsingFallbackData, setIsUsingFallbackData] = React.useState(false)

  const [isFallbackDataUsed, setIsFallbackDataUsedState] = React.useState(false);

  const useFallbackData = React.useCallback(() => {
    // Sample fallback data
    const fallbackData = [
      {
        Title: "Machine Learning Engineer",
        Description:
          "Role Description:\nWe are seeking a Machine Learning Engineer with approximately 5 years of experience in the field. The ideal candidate will have a strong foundation in low-level machine learning skills, data science, and advanced AI techniques. You will be working with Large Language Models (LLMs), Retrieval-Augmented Generation (RAG), and other state-of-the-art toolchains. Salary: $120,000 - $150,000",
        Location: "Austin, Texas, United States",
        Company_Name: "Statt",
        Company_Logo: "/placeholder.svg?height=400&width=400",
        Created_At: "2024-10-22 18:15:23",
        Job_State: "LISTED",
      },
      {
        Title: "Machine Learning Software Engineer",
        Description:
          "Compensation: $120,000 - $140,000/year\n\nLocation: Onsite - Oklahoma City, OK\n\nPosition: Machine Learning Software Engineer",
        Location: "Oklahoma City, Oklahoma, United States",
        Company_Name: "Inceed",
        Company_Logo: "/placeholder.svg?height=400&width=400",
        Created_At: "2025-02-05 18:53:31",
        Job_State: "LISTED",
      },
      {
        Title: "Machine Learning Engineer",
        Description: "Machine Learning Engineer (Temporary Contract) Location: 100% RemotePay Rate: $90-110/hour",
        Location: "United States",
        Company_Name: "Synchro",
        Company_Logo: "/placeholder.svg?height=400&width=400",
        Created_At: "2024-11-27 18:31:01",
        Job_State: "LISTED",
      },
      {
        Title: "AI Research Scientist",
        Description:
          "Looking for an AI Research Scientist with experience in deep learning. Salary range: $150,000 - $180,000",
        Location: "San Francisco, California, United States",
        Company_Name: "TechCorp",
        Company_Logo: "/placeholder.svg?height=400&width=400",
        Created_At: "2025-01-15 10:00:00",
        Job_State: "LISTED",
      },
      {
        Title: "Data Scientist",
        Description: "Data Scientist position with focus on machine learning models. Salary: $110,000 - $140,000",
        Location: "New York, New York, United States",
        Company_Name: "DataWorks",
        Company_Logo: "/placeholder.svg?height=400&width=400",
        Created_At: "2025-01-20 14:30:00",
        Job_State: "LISTED",
      },
    ]

    const processedJobs = fallbackData.map((job: Job) => ({
      ...job,
      salary: extractSalary(job),
      remote_type: extractRemoteType(job),
    }))

    setJobs(processedJobs)

    // Calculate analytics
    const jobAnalytics = calculateJobAnalytics(processedJobs)
    setAnalytics(jobAnalytics)

    // Prepare chart data
    setMonthlyJobData(getJobsByMonth(processedJobs))
    setJobTypeData(getJobsByTitle(processedJobs))
    setLocationData(getJobsByLocation(processedJobs))
    setRemoteWorkData(getJobsByRemoteType(processedJobs))
    setSkillsData(extractSkills(processedJobs))
    setSalaryData(getAverageSalaryByTitle(processedJobs))

    setError("Could not load external data. Using sample data instead.")
    setIsUsingFallbackData(true)
    setIsFallbackDataUsedState(true);
  }, [
    setJobs,
    setAnalytics,
    setMonthlyJobData,
    setJobTypeData,
    setLocationData,
    setRemoteWorkData,
    setSkillsData,
    setSalaryData,
    setError,
  ])

  // Load data from JSON file
  React.useEffect(() => {
    async function loadJobData() {
      try {
        setIsLoading(true)

        // Try to fetch the JSON file
        const response = await fetch(jsonPath)

        // Check if the response is OK and is JSON
        if (!response.ok) {
          throw new Error(`Failed to load job data: ${response.status} ${response.statusText}`)
        }

        // Check the content type to ensure it's JSON
        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          console.warn(`Expected JSON but got ${contentType}. Falling back to sample data.`)
          // Use fallback data
          useFallbackData()
          return
        }

        const data = await response.json()

        // Process the data
        const processedJobs = data.map((job: Job) => ({
          ...job,
          salary: extractSalary(job),
          remote_type: extractRemoteType(job),
        }))

        setJobs(processedJobs)

        // Calculate analytics
        const jobAnalytics = calculateJobAnalytics(processedJobs)
        setAnalytics(jobAnalytics)

        // Prepare chart data
        setMonthlyJobData(getJobsByMonth(processedJobs))
        setJobTypeData(getJobsByTitle(processedJobs))
        setLocationData(getJobsByLocation(processedJobs))
        setRemoteWorkData(getJobsByRemoteType(processedJobs))
        setSkillsData(extractSkills(processedJobs))
        setSalaryData(getAverageSalaryByTitle(processedJobs))

        setError(null)
        setIsUsingFallbackData(false)
        setIsFallbackDataUsedState(false);
      } catch (err) {
        console.error("Error loading job data:", err)
        console.log("Falling back to sample data due to error")
        // Use fallback data on error
        useFallbackData()
      } finally {
        setIsLoading(false)
      }
    }

    loadJobData()
  }, [jsonPath, useFallbackData])

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading job market data...</p>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-background text-foreground ${className}`}>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">AI Job Market Dashboard</h2>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <Button>
            <Settings className="mr-2 h-4 w-4" /> Settings
          </Button>
        </div>
      </div>
      {isUsingFallbackData && (
        <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 p-3 rounded-md my-4">
          Note: Using sample data. {error}
        </div>
      )}
      <Tabs defaultValue="overview" className="space-y-4 mt-6">
        <TabsList>
          <TabsTrigger value="overview">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <Globe2 className="mr-2 h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="job-details">
            <Briefcase className="mr-2 h-4 w-4" />
            Job Details
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Job Listings</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalJobs}</div>
                <p className="text-xs text-muted-foreground">From {jobs.length} analyzed listings</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.averageSalary}</div>
                <p className="text-xs text-muted-foreground">Based on available salary data</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Location</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.topLocation}</div>
                <p className="text-xs text-muted-foreground">{analytics.topLocationPercentage} of all listings</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.activeJobs}</div>
                <p className="text-xs text-muted-foreground">Currently listed positions</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Job Postings Over Time</CardTitle>
                <CardDescription>Monthly job listings for AI and ML positions</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={monthlyJobData}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip />
                    <Bar dataKey="count" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Job Type Distribution</CardTitle>
                <CardDescription>Breakdown of AI and ML job categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={jobTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {jobTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Location Distribution</CardTitle>
                <CardDescription>Job listings by state</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={locationData} layout="vertical">
                    <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip />
                    <Bar dataKey="count" fill="currentColor" radius={[0, 4, 4, 0]} className="fill-primary" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Remote Work Distribution</CardTitle>
                <CardDescription>Breakdown of remote, hybrid, and on-site positions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={remoteWorkData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {remoteWorkData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Salary Trends</CardTitle>
              <CardDescription>Average salary by job title</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salaryData}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value / 1000}k`}
                  />
                  <Tooltip formatter={(value) => [`${value.toLocaleString()}`, "Average Salary"]} />
                  <Bar dataKey="salary" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Job Details Tab */}
        <TabsContent value="job-details" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Skills in Demand</CardTitle>
                <CardDescription>Most requested skills in job listings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {skillsData.map((skill: any) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span>{skill.name}</span>
                        </div>
                        <span className="text-primary">{skill.count}%</span>
                      </div>
                      <Progress value={skill.count} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent Job Listings</CardTitle>
                <CardDescription>Latest AI and ML positions</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px]">
                  {jobs.slice(0, 5).map((job, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 border-b">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={job.Company_Logo || "/placeholder.svg?height=40&width=40"}
                          alt={job.Company_Name}
                        />
                        <AvatarFallback>{job.Company_Name?.substring(0, 2) || "JD"}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium leading-none">{job.Title}</h4>
                        <p className="text-sm text-muted-foreground">{job.Company_Name}</p>
                        <div className="flex items-center space-x-2 text-xs">
                          <Badge variant="outline" className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{job.Location?.split(",")[0] || "Unknown"}</span>
                          </Badge>
                          {job.salary && (
                            <Badge variant="outline" className="flex items-center space-x-1">
                              <DollarSign className="h-3 w-3" />
                              <span>{job.salary}</span>
                            </Badge>
                          )}
                          <Badge variant="outline" className="flex items-center space-x-1">
                            <Building className="h-3 w-3" />
                            <span>{job.remote_type}</span>
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
              <CardFooter className="border-t p-4">
                <Button variant="outline" className="w-full">
                  <Search className="mr-2 h-4 w-4" />
                  View All Jobs
                </Button>
              </CardFooter>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Job Posting Timeline</CardTitle>
              <CardDescription>Number of new job listings over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyJobData}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="currentColor"
                    strokeWidth={2}
                    dot={true}
                    className="stroke-primary"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
