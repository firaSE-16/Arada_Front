"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, ChevronLeft, ChevronRight, ArrowRight, User, Calendar, Clock } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
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
      setError("Failed to load patients. Please try again.")
      setPatients([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchPatients()
    }, 500)

    return () => clearTimeout(debounceTimer)
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
      case 'High': return 'destructive'
      case 'Medium': return 'warning'
      case 'Low': return 'secondary'
      default: return 'outline'
    }
  }

  if (error) {
    return (
      <div className="p-6 text-center bg-emerald-50 min-h-screen">
        <div className="mx-auto max-w-md bg-white rounded-lg p-6 shadow-sm border border-emerald-200">
          <h2 className="text-xl font-bold text-destructive mb-4">{error}</h2>
          <Button 
            variant="outline" 
            onClick={fetchPatients}
            className="mt-2 border-emerald-300 text-emerald-700 hover:bg-emerald-100"
          >
            Retry Loading Patients
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto bg-emerald-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-emerald-100 rounded-xl p-6 shadow-sm border border-emerald-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-emerald-900">Unassigned Patients</h1>
            <p className="text-sm text-emerald-700">
              Patients awaiting assignment to healthcare providers
            </p>
          </div>
        </div>
      </div>

      {/* Search and Content Section */}
      <div className="space-y-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-600" />
          <Input
            placeholder="Search patients by name, Fayda ID, or contact..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setPagination({ ...pagination, page: 1 })
            }}
            className="pl-10 bg-white border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* Patients Table Card */}
        <div className="bg-white rounded-xl shadow-sm border border-emerald-200 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-emerald-100/50">
                <TableRow className="hover:bg-emerald-100/50">
                  <TableHead className="w-[35%] text-emerald-900">Patient</TableHead>
                  <TableHead className="text-emerald-900">Details</TableHead>
                  <TableHead className="text-emerald-900">Status</TableHead>
                  <TableHead className="text-emerald-900 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={`skeleton-${i}`} className="hover:bg-emerald-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full bg-emerald-100" />
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-[120px] bg-emerald-100" />
                            <Skeleton className="h-3 w-[80px] bg-emerald-100" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-[100px] bg-emerald-100" />
                          <Skeleton className="h-3 w-[80px] bg-emerald-100" />
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="h-4 w-[80px] bg-emerald-100" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-8 rounded-md bg-emerald-100 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : patients.length > 0 ? (
                  patients.map((patient) => (
                    <TableRow key={patient._id} className="hover:bg-emerald-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-emerald-100 text-emerald-600 font-medium">
                            {patient.patientID?.firstName?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <p className="font-medium text-emerald-900">
                              {patient.patientID?.firstName || 'Unknown'} {patient.patientID?.lastName || ''}
                            </p>
                            <div className="text-xs text-emerald-700">
                              <span className="font-mono bg-emerald-100 px-1.5 py-0.5 rounded">
                                {patient.faydaID}
                              </span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Badge variant={getUrgencyBadgeVariant(patient.triageData?.urgency)} className="capitalize">
                              {patient.triageData?.urgency || 'Unknown'}
                            </Badge>
                            <Badge variant="outline" className="capitalize border-emerald-200 text-emerald-800">
                              {patient.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-emerald-700">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(patient.createdAt).toLocaleDateString()}</span>
                            <Clock className="h-3 w-3 ml-1" />
                            <span>{new Date(patient.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-emerald-800">
                          <User className="h-4 w-4" />
                          <span>{patient.patientID?.gender || 'Unknown'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewPatient(patient._id)}
                          className="hover:bg-emerald-100 text-emerald-600 hover:text-emerald-700"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <Search className="h-10 w-10 text-emerald-400" />
                        <p className="text-emerald-700">No unassigned patients found</p>
                        {searchTerm && (
                          <Button 
                            variant="outline" 
                            onClick={() => setSearchTerm("")}
                            className="border-emerald-300 text-emerald-700 hover:bg-emerald-100"
                          >
                            Clear search filters
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {patients.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-emerald-200">
              <div className="text-sm text-emerald-700">
                Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="font-medium">{pagination.total}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-100"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium text-emerald-800">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-100"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UnassignedPatients