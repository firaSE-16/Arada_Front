"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, UserPlus, BookOpenText } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import axios from "axios"
import { BASE_URL } from "@/lib/utils"
import moment from "moment"

const PatientRegistration = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(false)
  const searchTimeout = useRef(null)

  useEffect(() => {
    if (searchQuery.length >= 3) {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current)
      }
      
      searchTimeout.current = setTimeout(() => {
        handleSearch()
      }, 500)
    }

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current)
      }
    }
  }, [searchQuery])

  const handleSearch = async () => {
    if (searchQuery.length < 3) {
      setPatients([])
      return
    }

    setLoading(true)
    try {
      const response = await axios.get(`${BASE_URL}/reception/search-patients`, {
        params: { query: searchQuery },
        withCredentials: true
      })

      if (response.data.success) {
        setPatients(response.data.patients)
      } else {
        console.error(response.data.message || 'Search failed')
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePatientSelect = (faydaID) => {
    navigate(`/receptionist/registered/${faydaID}`)
  }

  const handleNewRegistration = () => {
    navigate("/receptionist/newRegistration")
  }

  return (
    <div className="p-6 max-w-6xl mx-auto bg-emerald-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <BookOpenText className="h-8 w-8 text-emerald-600" />
          <h1 className="text-2xl font-bold text-emerald-800">Patient Registry</h1>
        </div>
        <Button 
          onClick={handleNewRegistration} 
          className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          New Registration
        </Button>
      </div>

      <div className="relative mb-8 bg-white rounded-lg shadow-sm border border-emerald-100">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-500" />
        <Input
          placeholder="Search patients by ID, name or phone number (min 3 characters)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 border-0 focus-visible:ring-2 focus-visible:ring-emerald-200"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={`skeleton-${i}`} className="border border-emerald-100 rounded-lg p-4 bg-white shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="h-12 w-12 rounded-full bg-emerald-100" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[150px] bg-emerald-100" />
                  <Skeleton className="h-3 w-[100px] bg-emerald-100" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full bg-emerald-100" />
                <Skeleton className="h-4 w-full bg-emerald-100" />
                <Skeleton className="h-4 w-full bg-emerald-100" />
              </div>
              <Skeleton className="h-9 w-full mt-4 rounded-md bg-emerald-100" />
            </div>
          ))}
        </div>
      ) : patients.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {patients.map((patient) => (
              <div 
                key={patient.faydaID} 
                className="border border-emerald-100 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 text-emerald-800 font-medium text-lg">
                    {patient.firstName.charAt(0).toUpperCase()}{patient.lastName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-medium text-lg text-emerald-900">{patient.firstName} {patient.lastName}</h3>
                    <p className="text-sm text-emerald-600">ID: {patient.faydaID}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-emerald-600">Date of Birth</span>
                    <span className="text-emerald-900">{moment(patient.dateOfBirth).format('DD MMM YYYY')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-600">Gender</span>
                    <Badge 
                      variant={patient.gender === 'Female' ? 'default' : 'outline'}
                      className="capitalize px-2 py-0.5 text-xs bg-emerald-100 text-emerald-800 border-emerald-200"
                    >
                      {patient.gender}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-600">Contact</span>
                    <span className="text-emerald-900">{patient.contactNumber}</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                  onClick={() => handlePatientSelect(patient.faydaID)}
                >
                  View Details
                </Button>
              </div>
            ))}
          </div>
          <div className="text-sm text-emerald-600 text-center">
            Showing {patients.length} {patients.length === 1 ? 'patient' : 'patients'}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 border border-emerald-100 rounded-lg bg-white shadow-sm">
          <Search className="h-12 w-12 text-emerald-400 mb-4" />
          <p className="text-emerald-600 text-lg mb-4">
            {searchQuery.length >= 3 ? 
              'No matching patients found' : 
              'Search for patients to begin (minimum 3 characters)'}
          </p>
          {searchQuery.length >= 3 && (
            <Button 
              variant="outline" 
              onClick={() => setSearchQuery("")}
              className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            >
              Clear search
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default PatientRegistration