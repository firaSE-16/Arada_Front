"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Search, UserPlus, BookOpenText, ArrowRight } from "lucide-react"
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
    <div className="min-h-screen bg-white py-12 px-4 font-outfit">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-semibold text-gray-800">Patient Management</h1>
            <p className="text-lg text-gray-600 mt-2">Find and manage patient profiles</p>
          </div>
          <button 
            onClick={handleNewRegistration} 
            className="w-full sm:w-auto px-6 py-3 bg-[#5AC5C8] text-white rounded-full hover:bg-[#4AB0B3] transition-all transform hover:scale-105"
          >
            <UserPlus className="inline-block h-5 w-5 mr-2" />
            Add New Patient
          </button>
        </div>

        {/* Search Section */}
        <div className="relative mb-10">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-[#5AC5C8]" />
          <input
            placeholder="Enter patient ID, name, or phone number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#5AC5C8] transition-all"
          />
        </div>

        {/* Results Section */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={`skeleton-${i}`} className="border border-gray-200 rounded-lg p-6 bg-white shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-100 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-[150px] bg-gray-100 animate-pulse"></div>
                    <div className="h-3 w-[100px] bg-gray-100 animate-pulse"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-100 animate-pulse"></div>
                  <div className="h-4 w-full bg-gray-100 animate-pulse"></div>
                  <div className="h-4 w-full bg-gray-100 animate-pulse"></div>
                </div>
                <div className="h-10 w-full mt-4 rounded-full bg-gray-100 animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : patients.length > 0 ? (
          <>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">Patient Results</h2>
              <span className="text-gray-600 text-lg">{patients.length} {patients.length === 1 ? 'patient' : 'patients'} found</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {patients.map((patient) => (
                <div 
                  key={patient.faydaID} 
                  className="border border-gray-200 rounded-lg p-6 bg-white shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[#5AC5C8] text-white font-semibold text-lg">
                      {patient.firstName.charAt(0).toUpperCase()}{patient.lastName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{patient.firstName} {patient.lastName}</h3>
                      <p className="text-sm text-gray-600">ID: {patient.faydaID}</p>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm text-gray-600 mb-4">
                    <div className="flex justify-between">
                      <span>Date of Birth</span>
                      <span className="text-gray-800">{moment(patient.dateOfBirth).format('DD MMM YYYY')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gender</span>
                      <span className="px-2 py-1 text-xs border border-gray-200 rounded-full capitalize">{patient.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Contact</span>
                      <span className="text-gray-800">{patient.contactNumber}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handlePatientSelect(patient.faydaID)}
                    className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition-all transform hover:scale-105"
                  >
                    View Profile
                    <ArrowRight className="inline-block ml-2 h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 border border-gray-200 rounded-lg bg-gray-50">
            <Search className="h-12 w-12 text-[#5AC5C8] mb-4" />
            <p className="text-lg text-gray-600 mb-4">
              {searchQuery.length >= 3 ? 
                'No patients match your search' : 
                'Enter a search term to find patients'}
            </p>
            {searchQuery.length >= 3 && (
              <button 
                onClick={() => setSearchQuery("")}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition-all transform hover:scale-105"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default PatientRegistration