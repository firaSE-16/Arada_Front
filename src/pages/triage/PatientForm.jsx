import React, { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { ChevronLeft, Search, Stethoscope, HeartPulse, Thermometer, Gauge, Activity, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import axios from "axios"
import { BASE_URL } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
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
        toast.error("Failed to fetch patient or doctor data")
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
        toast.success("Patient processed and assigned successfully")
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
      <div className="p-6 bg-emerald-50 min-h-screen">
        <Skeleton className="h-8 w-[200px] mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-[120px] w-full rounded-lg" />
          ))}
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-[180px] w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="p-6 bg-emerald-50 min-h-screen">
        <div className="flex items-center justify-center py-12">
          <p className="text-lg text-emerald-600">Patient not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-emerald-50 min-h-screen max-w-4xl mx-auto">
      <Card className="border-emerald-200 shadow-lg">
        <CardHeader className="bg-emerald-100/50 border-b border-emerald-200">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center h-14 w-14 rounded-full bg-emerald-100 text-emerald-600 font-medium text-xl">
              {patient.firstName?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-emerald-900">
                {patient.firstName || 'Unknown'} {patient.lastName || ''}
              </h2>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary" className="font-mono bg-emerald-100 text-emerald-800">
                  {patient.faydaID || 'N/A'}
                </Badge>
                <Badge variant="outline" className="border-emerald-200 text-emerald-700">
                  {patient.gender || '--'}
                </Badge>
                <Badge variant="outline" className="border-emerald-200 text-emerald-700">
                  {patient.age ? `${patient.age} yrs` : 'Age N/A'}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {/* Patient Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg border border-emerald-100">
              <h3 className="text-sm font-medium text-emerald-800 mb-3 flex items-center gap-2">
                <User className="h-4 w-4 text-emerald-600" />
                Basic Information
              </h3>
              <div className="space-y-2 text-sm text-emerald-700">
                <p><span className="font-medium">Contact:</span> {patient.contactNumber || '--'}</p>
                <p><span className="font-medium">Registered:</span> {new Date(patient.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-emerald-100">
              <h3 className="text-sm font-medium text-emerald-800 mb-3 flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-600" />
                Emergency Contact
              </h3>
              <div className="space-y-2 text-sm text-emerald-700">
                <p><span className="font-medium">Name:</span> {patient.emergencyContact?.name || '--'}</p>
                <p><span className="font-medium">Phone:</span> {patient.emergencyContact?.phone || '--'}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-emerald-100">
              <h3 className="text-sm font-medium text-emerald-800 mb-3 flex items-center gap-2">
                <HeartPulse className="h-4 w-4 text-emerald-600" />
                Medical Information
              </h3>
              <div className="space-y-2 text-sm text-emerald-700">
                <p><span className="font-medium">Blood Group:</span> {patient.bloodGroup || '--'}</p>
                <p><span className="font-medium">Allergies:</span> {patient.allergies || 'None'}</p>
              </div>
            </div>
          </div>

          {/* Triage Assessment Section - Single Column Layout */}
          <div className="mt-6 space-y-6">
            <h3 className="text-lg font-semibold text-emerald-900 flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-emerald-600" />
              Triage Assessment
            </h3>
            
            {/* Vitals Section */}
            <div className="bg-white p-4 rounded-lg border border-emerald-100 space-y-4">
              <h4 className="text-sm font-medium text-emerald-800 flex items-center gap-2">
                <Gauge className="h-4 w-4 text-emerald-600" />
                Vital Signs
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-emerald-700">Blood Pressure</label>
                  <Input
                    placeholder="e.g. 120/80"
                    value={formData.vitals.bloodPressure}
                    onChange={(e) => handleVitalsChange('bloodPressure', e.target.value)}
                    className="border-emerald-200 focus:ring-emerald-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-emerald-700">Heart Rate (bpm)</label>
                  <Input
                    type="number"
                    placeholder="e.g. 72"
                    value={formData.vitals.heartRate}
                    onChange={(e) => handleVitalsChange('heartRate', e.target.value)}
                    className="border-emerald-200 focus:ring-emerald-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-emerald-700">Temperature (°C)</label>
                  <Input
                    type="number"
                    placeholder="e.g. 36.5"
                    value={formData.vitals.temperature}
                    onChange={(e) => handleVitalsChange('temperature', e.target.value)}
                    className="border-emerald-200 focus:ring-emerald-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-emerald-700">Oxygen Saturation (%)</label>
                  <Input
                    type="number"
                    placeholder="e.g. 98"
                    value={formData.vitals.oxygenSaturation}
                    onChange={(e) => handleVitalsChange('oxygenSaturation', e.target.value)}
                    className="border-emerald-200 focus:ring-emerald-300"
                  />
                </div>
              </div>
            </div>

            {/* Diagnosis Section */}
            <div className="bg-white p-4 rounded-lg border border-emerald-100 space-y-4">
              <label className="text-sm font-medium text-emerald-700">Preliminary Diagnosis</label>
              <Textarea
                placeholder="Enter initial diagnosis"
                value={formData.diagnosis}
                onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                className="min-h-[120px] border-emerald-200 focus:ring-emerald-300"
              />
            </div>

            {/* Urgency */}
            <div className="bg-white p-4 rounded-lg border border-emerald-100 space-y-4">
              <label className="text-sm font-medium text-emerald-700">Urgency Level</label>
              <Select
                value={formData.urgency}
                onValueChange={(value) => setFormData({...formData, urgency: value})}
              >
                <SelectTrigger className="border-emerald-200 focus:ring-emerald-300">
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent className="border-emerald-200">
                  <SelectItem value="Low" className="hover:bg-emerald-50">Low Priority</SelectItem>
                  <SelectItem value="Medium" className="hover:bg-emerald-50">Medium Priority</SelectItem>
                  <SelectItem value="High" className="hover:bg-emerald-50">High Priority</SelectItem>
                  <SelectItem value="Critical" className="hover:bg-emerald-50">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Doctor Assignment */}
            <div className="bg-white p-4 rounded-lg border border-emerald-100 space-y-4">
              <label className="text-sm font-medium text-emerald-700">Assign to Doctor</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-500" />
                <Select
                  value={formData.doctorId}
                  onValueChange={(value) => setFormData({...formData, doctorId: value})}
                >
                  <SelectTrigger className="pl-10 border-emerald-200 focus:ring-emerald-300">
                    <SelectValue placeholder="Search and select doctor" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] overflow-y-auto border-emerald-200">
                    <div className="px-3 py-2 sticky top-0 bg-white z-10 border-b border-emerald-200">
                      <Input
                        placeholder="Search doctors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border-emerald-200 focus:ring-emerald-300"
                      />
                    </div>
                    {doctors.map(doctor => (
                      <SelectItem key={doctor._id} value={doctor._id} className="hover:bg-emerald-50">
                        <div className="flex items-center gap-2">
                          <Stethoscope className="h-4 w-4 text-emerald-600" />
                          <span>Dr. {doctor.firstName} {doctor.lastName}</span>
                          <Badge variant="outline" className="ml-auto border-emerald-200 text-emerald-700">
                            {doctor.specialization}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                    {doctors.length === 0 && (
                      <div className="px-3 py-2 text-sm text-emerald-600">
                        No doctors found
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end border-t border-emerald-200 p-6">
          <Button 
            onClick={handleSubmit}
            disabled={loading || !formData.doctorId}
            className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[200px]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Complete Triage & Assign"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default ProcessPatient