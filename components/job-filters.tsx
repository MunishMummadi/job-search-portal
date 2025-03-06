"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function JobFilters({
  locations,
  companies,
  skills,
  selectedLocation,
  selectedCompany,
  selectedSkill,
  query,
}: {
  locations: string[]
  companies: string[]
  skills: string[]
  selectedLocation: string
  selectedCompany: string
  selectedSkill: string
  query: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchQuery, setSearchQuery] = useState(query)
  const [location, setLocation] = useState(selectedLocation)
  const [company, setCompany] = useState(selectedCompany)
  const [skill, setSkill] = useState(selectedSkill)

  // Update the URL with the current filters
  const updateFilters = useCallback(() => {
    const params = new URLSearchParams()

    if (searchQuery) params.set("query", searchQuery)
    if (location) params.set("location", location)
    if (company) params.set("company", company)
    if (skill) params.set("skill", skill)

    // Always reset to page 1 when filters change
    params.set("page", "1")

    router.push(`/?${params.toString()}`)
  }, [searchQuery, location, company, skill, router])

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters()
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("")
    setLocation("")
    setCompany("")
    setSkill("")
    router.push("/")
  }

  // Update filters when select values change
  useEffect(() => {
    // Only update if the values have changed from the URL
    if (location !== selectedLocation || company !== selectedCompany || skill !== selectedSkill) {
      updateFilters()
    }
  }, [location, company, skill, selectedLocation, selectedCompany, selectedSkill, updateFilters])

  const hasActiveFilters = searchQuery || location || company || skill

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Filters</h2>

      <form onSubmit={handleSearch} className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" className="w-full">
          Search
        </Button>
      </form>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Location</label>
          <Select value={location || "all"} onValueChange={(value) => setLocation(value === "all" ? "" : value)}>
            <SelectTrigger>
              <SelectValue placeholder="All locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All locations</SelectItem>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Company</label>
          <Select value={company || "all"} onValueChange={(value) => setCompany(value === "all" ? "" : value)}>
            <SelectTrigger>
              <SelectValue placeholder="All companies" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All companies</SelectItem>
              {companies.map((comp) => (
                <SelectItem key={comp} value={comp}>
                  {comp}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Skills</label>
          <Select value={skill || "all"} onValueChange={(value) => setSkill(value === "all" ? "" : value)}>
            <SelectTrigger>
              <SelectValue placeholder="All skills" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All skills</SelectItem>
              {skills.filter(Boolean).map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700"
          >
            <X size={16} />
            <span>Clear all filters</span>
          </Button>
        </div>
      )}
    </div>
  )
}

