"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Search, ChevronLeft, ChevronRight, User, Calendar, Clock } from "lucide-react"
import axios from "axios"
import { BASE_URL } from "@/lib/utils"

const UnassignedPatients = () => {
  const navigate = useNavigate()
  const [patients, setPatients] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  })
  const [error, setError] = useState(null)
  const debounceTimer = useRef(null)

  const fetchPatients = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get(`${BASE_URL}/triage/unassigned`, {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          search: searchTerm
        },
        withCredentials: true
      })
      
      setPatients(response.data.patients || [])
      setPagination({
        ...pagination,
        total: response.data.total || 0,
        pages: response.data.pages || 1
      })
    } catch (err) {
      console.error("Failed to fetch patients:", err)
      setError("Unable to load patient data. Please retry.")
      setPatients([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }
    
    debounceTimer.current = setTimeout(() => {
      fetchPatients()
    }, 500)

    return () => clearTimeout(debounceTimer.current)
  }, [searchTerm, pagination.page])

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.pages) {
      setPagination({ ...pagination, page: newPage })
    }
  }

  const handleViewPatient = (patientId) => {
    navigate(`/triage/process/${patientId}`)
  }

  const getUrgencyBadgeVariant = (urgency) => {
    switch (urgency) {
      case 'High': return 'bg-red-100 text-red-800 border-red-300'
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'Low': return 'bg-gray-100 text-gray-800 border-gray-300'
      default: return 'bg-gray-50 text-gray-600 border-gray-200'
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-outfit px-4">
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center shadow-lg max-w-md">
          <div className="inline-block p-4 bg-red-50 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{error}</h2>
          <button 
            onClick={fetchPatients}
            className="px-6 py-3 bg-[#5AC5C8] text-white rounded-full hover:bg-[#4AB0B3] transition-all transform hover:scale-105"
          >
            Retry Loading
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 font-outfit">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-semibold text-gray-800">Pending Patient Assignments</h1>
          <p className="text-lg text-gray-600 mt-2">View and assign patients to healthcare providers</p>
        </div>

        {/* Search Section */}
        <div className="relative mb-10">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-[#5AC5C8]" />
          <input
            placeholder="Search by patient name, ID, or contact..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setPagination({ ...pagination, page: 1 })
            }}
            className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#5AC5C8] transition-all"
          />
        </div>

        {/* Patients Section */}
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
              </div>
            ))}
          </div>
        ) : patients.length > 0 ? (
          <>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">Available Patients</h2>
              <span className="text-gray-600 text-lg">{pagination.total} {pagination.total === 1 ? 'patient' : 'patients'} found</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {patients.map((patient) => (
                <div 
                  key={patient._id} 
                  className="border border-gray-200 rounded-lg p-6 bg-white shadow-lg hover:shadow-xl transition-all transform hover:scale-102 cursor-pointer"
                  onClick={() => handleViewPatient(patient._id)}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[#5AC5C8] text-white font-semibold text-lg">
                      {patient.patientID?.firstName?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {patient.patientID?.firstName || 'Unknown'} {patient.patientID?.lastName || ''}
                      </h3>
                      <span className="inline-block mt-1 px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded-full">
                        ID: {patient.faydaID}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm text-gray-600 mb-4">
                    <div className="flex justify-between">
                      <span>Urgency</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getUrgencyBadgeVariant(patient.triageData?.urgency)}`}>
                        {patient.triageData?.urgency || 'Unknown'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status</span>
                      <span className="px-2 py-1 text-xs border border-gray-200 rounded-full text-gray-800">
                        {patient.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Registered</span>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Calendar className="h-4 w-4 text-[#5AC5C8]" />
                        <span>{new Date(patient.createdAt).toLocaleDateString()}</span>
                        <Clock className="h-4 w-4 text-[#5AC5C8]" />
                        <span>{new Date(patient.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span>Gender</span>
                      <span className="flex items-center gap-1 text-gray-800">
                        <User className="h-4 w-4 text-[#5AC5C8]" />
                        {patient.patientID?.gender || 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination */}
            {patients.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
                <div className="text-lg text-gray-600">
                  Showing {(pagination.page - 1) * pagination.limit + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="p-2 bg-[#5AC5C8] text-white rounded-full hover:bg-[#4AB0B3] disabled:bg-[#A0D8DA] transition-all transform hover:scale-105"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="text-lg font-medium text-gray-800">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="p-2 bg-[#5AC5C8] text-white rounded-full hover:bg-[#4AB0B3] disabled:bg-[#A0D8DA] transition-all transform hover:scale-105"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 border border-gray-200 rounded-lg bg-gray-50">
            <Search className="h-12 w-12 text-[#5AC5C8] mb-4" />
            <p className="text-lg text-gray-600 mb-4">
              {searchTerm ? 'No unassigned patients match your search' : 'No unassigned patients available'}
            </p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
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

export default UnassignedPatients