"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search, User, Stethoscope, Activity, ArrowRight, Loader2, AlertCircle, RefreshCw, FileText, Calendar, HeartPulse } from "lucide-react"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const BASE_URL = "https://arada-backk.onrender.com"

const AssignedRecords = () => {
  const [doctorInfo, setDoctorInfo] = useState(null)
  const [assignedRecords, setAssignedRecords] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const authRes = await fetch(`${BASE_URL}/api/auth/me`, {
          credentials: "include",
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (!authRes.ok) throw new Error("Failed to fetch user info")
        const authData = await authRes.json()

        const doctorRes = await fetch(`${BASE_URL}/api/doctors/getStaffAccount/${authData.userId}`, {
          credentials: "include",
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        
        if (!doctorRes.ok) throw new Error("Failed to fetch doctor information")
        setDoctorInfo(await doctorRes.json())

        const recordsRes = await fetch(`${BASE_URL}/api/doctors/patients`, { 
          credentials: "include",
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        
        if (!recordsRes.ok) throw new Error("Failed to load patient records")
        
        const recordsData = await recordsRes.json()
        setAssignedRecords(recordsData.data.map(record => ({
          ...record.patientID,
          patientId: record._id,
          medicalRecordId: record.medicalRecordId,
          recordStatus: record.status,
          firstName: record.firstName,
          lastName: record.lastName,
          faydaID: record.faydaID,
          gender: record.gender,
          age: record.age,
          lastVisit: record.updatedAt ? new Date(record.updatedAt).toLocaleDateString() : 'N/A',
          condition: record.condition || 'Not specified'
        })))
      } catch (error) {
        console.error("Fetch error:", error)
        setError(error.message)
        toast.error(error.message)
        
        if (error.message.includes("Failed") || error.message.includes("Session")) {
          localStorage.removeItem('token')
          navigate('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [navigate])

  const filteredRecords = assignedRecords.filter(record => 
    `${record.firstName} ${record.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (record.faydaID && record.faydaID.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (record.medicalRecordId && record.medicalRecordId.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleViewRecord = (patientId) => {
    navigate(`/doctor/records/${patientId}`)
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active':
      case 'InTreatment':
      case 'In-Treatment':
        return 'bg-[#5AC5C8] text-white'
      case 'Emergency':
        return 'bg-red-100 text-red-800'
      case 'Discharged':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-50 text-gray-600'
    }
  }

  const refreshData = async () => {
    try {
      setRefreshing(true)
      setError(null)
      
      const recordsRes = await fetch(`${BASE_URL}/api/doctors/patients`, { 
        credentials: "include",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (!recordsRes.ok) throw new Error("Failed to refresh records")
      
      const recordsData = await recordsRes.json()
      setAssignedRecords(recordsData.data.map(record => ({
        ...record.patientID,
        patientId: record._id,
        medicalRecordId: record.medicalRecordId,
        recordStatus: record.status,
        firstName: record.firstName,
        lastName: record.lastName,
        faydaID: record.faydaID,
        gender: record.gender,
        age: record.age,
        lastVisit: record.updatedAt ? new Date(record.updatedAt).toLocaleDateString() : 'N/A',
        condition: record.condition || 'Not specified'
      })))
      toast.success("Records refreshed successfully")
    } catch (error) {
      console.error("Refresh error:", error)
      setError(error.message)
      toast.error(error.message)
    } finally {
      setRefreshing(false)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white font-outfit flex flex-col items-center justify-center p-6">
        <div className="bg-red-50 p-4 rounded-full mb-4">
          <AlertCircle className="h-12 w-12 text-red-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800">An Error Occurred</h2>
        <p className="text-gray-600 text-center max-w-md mt-2">{error}</p>
        <button
          onClick={refreshData}
          disabled={refreshing}
          className="mt-6 px-6 py-3 bg-[#5AC5C8] text-white rounded-full hover:bg-[#4AB0B3] disabled:bg-[#A0D8DA] transition-all transform hover:scale-105 flex items-center gap-2"
        >
          {refreshing ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <RefreshCw className="h-5 w-5" />
          )}
          Try Again
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white font-outfit py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-2">
              <div className="h-8 w-48 bg-gray-100 animate-pulse rounded-lg"></div>
              <div className="h-4 w-64 bg-gray-100 animate-pulse rounded-lg"></div>
            </div>
            <div className="h-10 w-32 bg-gray-100 animate-pulse rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-100 animate-pulse rounded-lg p-6 h-64"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white font-outfit py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-4xl font-semibold text-gray-800">Assigned Patients</h1>
            <p className="text-lg text-gray-600 mt-2">Manage your current patient records</p>
          </div>
          <button
            onClick={refreshData}
            disabled={refreshing}
            className="px-6 py-3 bg-[#5AC5C8] text-white rounded-full hover:bg-[#4AB0B3] disabled:bg-[#A0D8DA] transition-all transform hover:scale-105 flex items-center gap-2"
          >
            {refreshing ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <RefreshCw className="h-5 w-5" />
            )}
            Refresh
          </button>
        </div>

        {/* Search */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#5AC5C8]" />
            <input
              type="search"
              placeholder="Search by patient name, Fayda ID, or record number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5AC5C8]"
            />
          </div>
        </div>

        {/* Patient Grid */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Patient List</h2>
            <p className="text-sm text-gray-600">Showing {filteredRecords.length} of {assignedRecords.length} patients</p>
          </div>
          {filteredRecords.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecords.map((record) => (
                <div
                  key={record.medicalRecordId}
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => handleViewRecord(record.patientId)}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-[#5AC5C8] text-white flex items-center justify-center text-lg font-medium">
                      {record.firstName?.charAt(0)}{record.lastName?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {record.firstName} {record.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">{record.faydaID || 'No Fayda ID'}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">Status</p>
                      <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(record.recordStatus)}`}>
                        {record.recordStatus}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">Last Visit</p>
                      <p className="text-sm text-gray-800 flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-[#5AC5C8]" />
                        {record.lastVisit}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">Condition</p>
                      <p className="text-sm text-gray-800">{record.condition}</p>
                    </div>
                  </div>
                  <button
                    className="w-full mt-4 px-4 py-2 bg-[#5AC5C8] text-white rounded-full hover:bg-[#4AB0B3] transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    View Details
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center shadow-lg">
              <FileText className="h-12 w-12 mx-auto text-[#5AC5C8]" />
              <h3 className="mt-4 text-xl font-semibold text-gray-800">
                {searchTerm ? "No Patients Found" : "No Assigned Patients"}
              </h3>
              <p className="mt-2 text-gray-600">
                {searchTerm ? "Try adjusting your search terms" : "You currently have no patients assigned"}
              </p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition-all transform hover:scale-105"
              >
                {searchTerm ? "Clear Search" : "Refresh"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AssignedRecords