"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { Search, Stethoscope, HeartPulse, Thermometer, Gauge, Activity, User, ChevronLeft } from "lucide-react"
import axios from "axios"
import { BASE_URL } from "@/lib/utils"
import "react-toastify/dist/ReactToastify.css"

const ProcessPatient = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [patient, setPatient] = useState(null)
  const [doctors, setDoctors] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    vitals: {
      bloodPressure: "",
      heartRate: "",
      temperature: "",
      oxygenSaturation: ""
    },
    diagnosis: "",
    urgency: "Medium",
    doctorId: ""
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        const patientRes = await axios.get(`${BASE_URL}/triage/patients/${id}`, {
          withCredentials: true
        })
        
        if (patientRes.data?.success) {
          setPatient(patientRes.data.data)
        }

        const doctorsRes = await axios.get(`${BASE_URL}/triage/doctors`, {
          params: { search: searchTerm },
          withCredentials: true
        })
        
        if (doctorsRes.data?.success) {
          setDoctors(doctorsRes.data.doctors)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Unable to load patient or doctor information")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, searchTerm])

  const handleVitalsChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      vitals: {
        ...prev.vitals,
        [field]: value
      }
    }))
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const response = await axios.post(
        `${BASE_URL}/triage/process`,
        {
          recordId: id,
          ...formData
        },
        { withCredentials: true }
      )

      if (response.data?.success) {
        toast.success("Patient triage completed and assigned")
        navigate("/triage/unassigned")
      }
    } catch (error) {
      console.error("Error processing patient:", error)
      toast.error(error.response?.data?.message || "Failed to process patient")
    } finally {
      setLoading(false)
    }
  }

  if (loading && !patient) {
    return (
      <div className="min-h-screen bg-white py-12 px-4 font-outfit">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 w-[200px] bg-gray-100 animate-pulse rounded-lg mb-6"></div>
          <div className="space-y-6">
            <div className="h-[100px] w-full bg-gray-100 animate-pulse rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-10 w-full bg-gray-100 animate-pulse rounded-lg"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-[120px] w-full bg-gray-100 animate-pulse rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-outfit px-4">
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center shadow-lg max-w-md">
          <Search className="h-12 w-12 text-[#5AC5C8] mb-4 mx-auto" />
          <p className="text-lg text-gray-600">Patient record not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 font-outfit">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-4xl font-semibold text-gray-800">Triage Patient</h1>
            <p className="text-lg text-gray-600 mt-2">Assess and assign patient to a doctor</p>
          </div>
          <button 
            onClick={() => navigate('/triage/unassigned')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition-all transform hover:scale-105"
          >
            <ChevronLeft className="inline-block h-5 w-5 mr-2" />
            Back to Unassigned
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center gap-6">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#5AC5C8] text-white font-semibold text-2xl">
                {patient.firstName?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  {patient.firstName || 'Unknown'} {patient.lastName || ''}
                </h2>
                <div className="flex flex-wrap gap-3 mt-2">
                  <span className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded-full">
                    ID: {patient.faydaID || 'N/A'}
                  </span>
                  <span className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded-full">
                    {patient.gender || '--'}
                  </span>
                  <span className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded-full">
                    {patient.age ? `${patient.age} yrs` : 'Age N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Patient Info Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <User className="h-5 w-5 text-[#5AC5C8]" />
                Patient Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Contact Details</h4>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Phone:</span> {patient.contactNumber || '--'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Registered:</span> {new Date(patient.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Emergency Contact</h4>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Name:</span> {patient.emergencyContact?.name || '--'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Phone:</span> {patient.emergencyContact?.phone || '--'}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Medical Details</h4>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Blood Group:</span> {patient.bloodGroup || '--'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Allergies:</span> {patient.allergies || 'None'}
                  </p>
                </div>
              </div>
            </div>

            {/* Triage Assessment Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-[#5AC5C8]" />
                Triage Assessment
              </h3>
              {/* Vitals */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-[#5AC5C8]" />
                  Vital Signs
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Blood Pressure (mmHg)</label>
                    <input
                      placeholder="e.g. 120/80"
                      value={formData.vitals.bloodPressure}
                      onChange={(e) => handleVitalsChange('bloodPressure', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5AC5C8]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Heart Rate (bpm)</label>
                    <input
                      type="number"
                      placeholder="e.g. 72"
                      value={formData.vitals.heartRate}
                      onChange={(e) => handleVitalsChange('heartRate', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5AC5C8]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Temperature (°C)</label>
                    <input
                      type="number"
                      placeholder="e.g. 36.5"
                      value={formData.vitals.temperature}
                      onChange={(e) => handleVitalsChange('temperature', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5AC5C8]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Oxygen Saturation (%)</label>
                    <input
                      type="number"
                      placeholder="e.g. 98"
                      value={formData.vitals.oxygenSaturation}
                      onChange={(e) => handleVitalsChange('oxygenSaturation', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5AC5C8]"
                    />
                  </div>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                <label className="text-sm font-medium text-gray-600">Initial Diagnosis</label>
                <textarea
                  placeholder="Provide preliminary diagnosis"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5AC5C8] min-h-[120px]"
                />
              </div>

              {/* Urgency */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                <label className="text-sm font-medium text-gray-600">Urgency Level</label>
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData({...formData, urgency: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5AC5C8]"
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              {/* Doctor Assignment */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                <label className="text-sm font-medium text-gray-600">Assign to Doctor</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#5AC5C8]" />
                  <select
                    value={formData.doctorId}
                    onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5AC5C8]"
                  >
                    <option value="">Select a doctor</option>
                    {doctors.map(doctor => (
                      <option key={doctor._id} value={doctor._id}>
                        Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative mt-2">
                  <input
                    placeholder="Search doctors by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5AC5C8]"
                  />
                </div>
                {doctors.length === 0 && searchTerm && (
                  <p className="text-sm text-gray-600 mt-2">No doctors found</p>
                )}
              </div>
            </div>
          </div>

          <div className="p-8 border-t border-gray-200 flex justify-end">
            <button 
              onClick={handleSubmit}
              disabled={loading || !formData.doctorId}
              className="px-6 py-3 bg-[#5AC5C8] text-white rounded-full hover:bg-[#4AB0B3] disabled:bg-[#A0D8DA] transition-all transform hover:scale-105"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Complete & Assign"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProcessPatient