"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { format, isValid } from "date-fns"
import { toast } from "react-toastify"
import { ChevronLeft, User, ClipboardList, FileText, Stethoscope, Activity, HeartPulse, Thermometer, Loader2, Play, Plus, X, Pill, FlaskConical, FileWarning, ClipboardCheck, AlertCircle, Clock, CheckCircle2 } from "lucide-react"
import "react-toastify/dist/ReactToastify.css"

const BASE_URL = "https://arada-backk.onrender.com/api/doctors"

// Helper function to safely format dates
const safeFormat = (date, formatStr) => {
  if (!date) return "N/A"
  const d = new Date(date)
  return isValid(d) ? format(d, formatStr) : "Invalid date"
}

const PatientDetail = () => {
  const { patientId } = useParams()
  const navigate = useNavigate()
  const [faydaID, setFaydaID] = useState(null)
  const [patient, setPatient] = useState(null)
  const [medicalHistory, setMedicalHistory] = useState([])
  const [currentRecord, setCurrentRecord] = useState(null)
  const [prescriptions, setPrescriptions] = useState([])
  const [labRequests, setLabRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeSection, setActiveSection] = useState("profile")

  // Form states
  const [recordForm, setRecordForm] = useState({
    diagnosis: "",
    treatmentPlan: "",
    vitals: {
      bloodPressure: "",
      heartRate: "",
      oxygenSaturation: ""
    }
  })

  const [prescriptionForm, setPrescriptionForm] = useState({
    medicineList: [{ name: "", dosage: "", frequency: "", duration: "" }],
    instructions: ""
  })

  const [labForm, setLabForm] = useState({
    testType: "",
    instructions: "",
    urgency: "Normal"
  })

  const fetchCentralMedicalHistory = async (id) => {
    if (!id) return
    try {
      const historyRes = await fetch(`https://mediconnet-backend.onrender.com/api/central-history/records/${id}`, {
        credentials: "include",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (!historyRes.ok) throw new Error("Failed to fetch medical history")
      const historyData = await historyRes.json()
      setMedicalHistory(historyData.patient.records || [])
    } catch (error) {
      console.error("Error fetching medical history:", error)
    }
  }

  const fetchPatientData = async () => {
    try {
      setIsLoading(true)
      const patientRes = await fetch(`${BASE_URL}/patients/${patientId}/profile`, {
        credentials: "include",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (!patientRes.ok) throw new Error("Failed to fetch patient profile")
      const patientData = await patientRes.json()

      setPatient(patientData.data.patient)
      setCurrentRecord(patientData.data.currentVisit)

      const fetchedFaydaID = patientData.data.patient.basicInfo.faydaID
      setFaydaID(fetchedFaydaID)
      console.log("Fayda ID fetched:", fetchedFaydaID)

      await fetchCentralMedicalHistory(fetchedFaydaID)

      if (patientData.data.currentVisit) {
        const recordId = patientData.data.currentVisit.recordId

        const prescriptionsRes = await fetch(`${BASE_URL}/records/${recordId}/prescriptions`, {
          credentials: "include",
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (!prescriptionsRes.ok) throw new Error("Failed to fetch prescriptions")
        const prescriptionsData = await prescriptionsRes.json()
        setPrescriptions(prescriptionsData.data || [])

        const labsRes = await fetch(`${BASE_URL}/records/${recordId}/lab-requests`, {
          credentials: "include",
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (!labsRes.ok) throw new Error("Failed to fetch lab requests")
        const labsData = await labsRes.json()
        setLabRequests(labsData.data || [])
      }

      if (patientData.data.currentVisit?.status === "InTreatment") {
        setRecordForm({
          diagnosis: patientData.data.currentVisit.doctorNotes?.diagnosis || "",
          treatmentPlan: patientData.data.currentVisit.doctorNotes?.treatmentPlan || "",
          vitals: patientData.data.currentVisit.triageData?.vitals || {
            bloodPressure: "",
            heartRate: "",
            oxygenSaturation: ""
          }
        })
      }
    } catch (error) {
      console.error("Fetch error:", error)
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPatientData()
  }, [patientId])

  const handleBack = () => navigate(-1)

  const startTreatment = async () => {
    try {
      if (!currentRecord) return
      console.log("Starting treatment for record ID:", currentRecord, currentRecord.recordId, currentRecord._id)
      setIsSubmitting(true)
      const response = await fetch(
        `${BASE_URL}/records/${currentRecord.recordId || currentRecord._id}/start-treatment`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to start treatment")
      }
      const data = await response.json()
      setCurrentRecord(data.data)
      toast.success("Treatment started successfully")
      fetchPatientData()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRecordSubmit = async (e) => {
    e.preventDefault()
    if (!currentRecord) return
    setIsSubmitting(true)
    try {
      const response = await fetch(
        `${BASE_URL}/records/${currentRecord.recordId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            diagnosis: recordForm.diagnosis,
            treatmentPlan: recordForm.treatmentPlan,
            vitals: recordForm.vitals
          })
        }
      )
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update record")
      }
      const data = await response.json()
      setCurrentRecord(data.data)
      toast.success("Medical record updated successfully")
      fetchPatientData()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddMedicine = () => {
    setPrescriptionForm(prev => ({
      ...prev,
      medicineList: [...prev.medicineList, { name: "", dosage: "", frequency: "", duration: "" }]
    }))
  }

  const handleRemoveMedicine = (index) => {
    if (prescriptionForm.medicineList.length > 1) {
      setPrescriptionForm(prev => ({
        ...prev,
        medicineList: prev.medicineList.filter((_, i) => i !== index)
      }))
    }
  }

  const handleMedicineChange = (index, field, value) => {
    const newMedicines = [...prescriptionForm.medicineList]
    newMedicines[index][field] = value
    setPrescriptionForm(prev => ({ ...prev, medicineList: newMedicines }))
  }

  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault()
    if (!currentRecord) return
    setIsSubmitting(true)
    console.log("Submitting prescription for record ID:", currentRecord)
    try {
      const response = await fetch(
        `${BASE_URL}/records/${currentRecord.recordId || currentRecord._id}/prescriptions`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            medicines: prescriptionForm.medicineList.filter(
              med => med.name && med.dosage && med.frequency && med.duration
            ),
            instructions: prescriptionForm.instructions
          })
        }
      )
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create prescription")
      }
      const data = await response.json()
      setPrescriptions([data.data, ...prescriptions])
      setPrescriptionForm({
        medicineList: [{ name: "", dosage: "", frequency: "", duration: "" }],
        instructions: ""
      })
      toast.success("Prescription created successfully")
      fetchPatientData()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLabRequestSubmit = async (e) => {
    e.preventDefault()
    if (!currentRecord) return
    setIsSubmitting(true)
    try {
      const response = await fetch(
        `${BASE_URL}/records/${currentRecord.recordId}/lab-requests`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            testType: labForm.testType,
            instructions: labForm.instructions,
            urgency: labForm.urgency
          })
        }
      )
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create lab request")
      }
      const data = await response.json()
      setLabRequests([data.data, ...labRequests])
      setLabForm({
        testType: "",
        instructions: "",
        urgency: "Normal"
      })
      toast.success("Lab request created successfully")
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white py-12 px-4 font-outfit">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-10 w-10 bg-gray-100 animate-pulse rounded-full"></div>
            <div className="h-8 w-[200px] bg-gray-100 animate-pulse rounded-lg"></div>
          </div>
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 w-full bg-gray-100 animate-pulse rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!patient) {
    navigate("/doctor/assigned-records")
    return null
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 font-outfit">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-4xl font-semibold text-gray-800">Patient Overview</h1>
            <p className="text-lg text-gray-600 mt-2">Medical profile for {patient.basicInfo.firstName} {patient.basicInfo.lastName}</p>
          </div>
          <button 
            onClick={handleBack}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition-all transform hover:scale-105"
          >
            <ChevronLeft className="inline-block h-5 w-5 mr-2" />
            Back
          </button>
        </div>

        {/* Patient Information */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg mb-6">
          <button 
            onClick={() => setActiveSection(activeSection === "profile" ? "" : "profile")} 
            className="w-full p-6 flex justify-between items-center border-b border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <User className="h-5 w-5 text-[#5AC5C8]" />
              Patient Information
            </h2>
            <svg className={`h-5 w-5 text-gray-600 transform ${activeSection === "profile" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {activeSection === "profile" && (
            <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-medium text-gray-800">{patient.basicInfo.firstName} {patient.basicInfo.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fayda ID</p>
                  <p className="font-medium text-gray-800">{patient.basicInfo.faydaID}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Gender</p>
                  <p className="font-medium text-gray-800 capitalize">{patient.basicInfo.gender?.toLowerCase()}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Date of Birth</p>
                  <p className="font-medium text-gray-800">{safeFormat(patient.basicInfo.dateOfBirth, "PPP")}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Age</p>
                  <p className="font-medium text-gray-800">{patient.basicInfo.age || "N/A"} years</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Blood Group</p>
                  <p className="font-medium text-gray-800">{patient.basicInfo.bloodGroup || "Not specified"}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`px-3 py-1 text-sm rounded-full ${patient.basicInfo.status === "Active" ? "bg-[#5AC5C8] text-white" : patient.basicInfo.status === "InTreatment" ? "bg-gray-100 text-gray-800" : "bg-red-100 text-red-800"}`}>
                    {patient.basicInfo.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contact Number</p>
                  <p className="font-medium text-gray-800">{patient.basicInfo.contactNumber || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium text-gray-800">{patient.basicInfo.address || "N/A"}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Emergency Contact */}
        {patient.emergencyContact && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg mb-6">
            <button 
              onClick={() => setActiveSection(activeSection === "emergency" ? "" : "emergency")} 
              className="w-full p-6 flex justify-between items-center border-b border-gray-200"
            >
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <User className="h-5 w-5 text-[#5AC5C8]" />
                Emergency Contact
              </h2>
              <svg className={`h-5 w-5 text-gray-600 transform ${activeSection === "emergency" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {activeSection === "emergency" && (
              <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium text-gray-800">{patient.emergencyContact.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Relationship</p>
                  <p className="font-medium text-gray-800 capitalize">{patient.emergencyContact.relation.toLowerCase()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone Number</p>
                  <p className="font-medium text-gray-800">{patient.emergencyContact.phone}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Current Record */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg mb-6">
          <button 
            onClick={() => setActiveSection(activeSection === "records" ? "" : "records")} 
            className="w-full p-6 flex justify-between items-center border-b border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-[#5AC5C8]" />
              Current Medical Record
            </h2>
            <svg className={`h-5 w-5 text-gray-600 transform ${activeSection === "records" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {activeSection === "records" && (
            <div className="p-6 space-y-6">
              {currentRecord ? (
                <>
                  {/* Current Record Status */}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Created on {safeFormat(currentRecord.createdAt, "PPPp")}</p>
                      <p className="text-sm text-gray-600 mt-1">Status: <span className={`px-3 py-1 text-sm rounded-full ${currentRecord.status === "InTreatment" ? "bg-[#5AC5C8] text-white" : currentRecord.status === "Assigned" ? "bg-gray-100 text-gray-800" : "bg-green-100 text-green-800"}`}>{currentRecord.status === "InTreatment" ? "In Treatment" : currentRecord.status === "Completed" ? "Completed" : currentRecord.status}</span></p>
                    </div>
                  </div>

                  {/* Triage Information */}
                  {currentRecord.triageData && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-3">
                        <Stethoscope className="h-5 w-5 text-[#5AC5C8]" />
                        Triage Assessment
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">Completed by {currentRecord.triageData.triageOfficer?.name || "Triage Officer"} on {safeFormat(currentRecord.triageData.completedAt, "PPPp")}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-gray-600">Urgency Level</p>
                          <span className={`px-3 py-1 text-sm rounded-full ${currentRecord.triageData.urgency === "High" ? "bg-red-100 text-red-800" : currentRecord.triageData.urgency === "Medium" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`}>
                            {currentRecord.triageData.urgency}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Chief Complaint</p>
                          <p className="text-sm text-gray-800">{currentRecord.triageData.chiefComplaint || "Not specified"}</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">Initial Vitals</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div className="bg-white p-3 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-2 text-gray-600 text-xs">
                              <Activity className="h-4 w-4 text-[#5AC5C8]" />
                              Blood Pressure
                            </div>
                            <p className="font-medium text-gray-800 mt-1">{currentRecord.triageData.vitals?.bloodPressure || "N/A"}</p>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-2 text-gray-600 text-xs">
                              <HeartPulse className="h-4 w-4 text-[#5AC5C8]" />
                              Heart Rate
                            </div>
                            <p className="font-medium text-gray-800 mt-1">{currentRecord.triageData.vitals?.heartRate ? `${currentRecord.triageData.vitals.heartRate} bpm` : "N/A"}</p>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-2 text-gray-600 text-xs">
                              <Thermometer className="h-4 w-4 text-[#5AC5C8]" />
                              Temperature
                            </div>
                            <p className="font-medium text-gray-800 mt-1">{currentRecord.triageData.vitals?.temperature ? `${currentRecord.triageData.vitals.temperature}°C` : "N/A"}</p>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-2 text-gray-600 text-xs">
                              <Activity className="h-4 w-4 text-[#5AC5C8]" />
                              Oxygen Sat.
                            </div>
                            <p className="font-medium text-gray-800 mt-1">{currentRecord.triageData.vitals?.oxygenSaturation ? `${currentRecord.triageData.vitals.oxygenSaturation}%` : "N/A"}</p>
                          </div>
                        </div>
                      </div>
                      {currentRecord.triageData.notes && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-600 mb-2">Triage Notes</p>
                          <p className="text-sm text-gray-800">{currentRecord.triageData.notes}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Doctor's Assessment */}
                  {currentRecord.status === "InTreatment" && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-3">
                        <User className="h-5 w-5 text-[#5AC5C8]" />
                        Doctor's Assessment
                      </h3>
                      <form onSubmit={handleRecordSubmit} className="space-y-6">
                        <div>
                          <label className="text-sm text-gray-600">Diagnosis *</label>
                          <textarea
                            placeholder="Enter primary diagnosis..."
                            value={recordForm.diagnosis}
                            onChange={(e) => setRecordForm({ ...recordForm, diagnosis: e.target.value })}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5AC5C8] min-h-[120px]"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Treatment Plan *</label>
                          <textarea
                            placeholder="Describe the treatment plan..."
                            value={recordForm.treatmentPlan}
                            onChange={(e) => setRecordForm({ ...recordForm, treatmentPlan: e.target.value })}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5AC5C8] min-h-[120px]"
                          />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Current Vitals</p>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="text-xs text-gray-600">Blood Pressure</label>
                              <input
                                placeholder="e.g., 120/80"
                                value={recordForm.vitals.bloodPressure}
                                onChange={(e) => setRecordForm({ ...recordForm, vitals: { ...recordForm.vitals, bloodPressure: e.target.value } })}
                                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5AC5C8]"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-600">Heart Rate (bpm)</label>
                              <input
                                type="number"
                                placeholder="e.g., 72"
                                value={recordForm.vitals.heartRate}
                                onChange={(e) => setRecordForm({ ...recordForm, vitals: { ...recordForm.vitals, heartRate: e.target.value } })}
                                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5AC5C8]"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-600">Oxygen Saturation (%)</label>
                              <input
                                type="number"
                                placeholder="e.g., 98"
                                value={recordForm.vitals.oxygenSaturation}
                                onChange={(e) => setRecordForm({ ...recordForm, vitals: { ...recordForm.vitals, oxygenSaturation: e.target.value } })}
                                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5AC5C8]"
                              />
                            </div>
                          </div>
                        </div>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-6 py-3 bg-[#5AC5C8] text-white rounded-full hover:bg-[#4AB0B3] disabled:bg-[#A0D8DA] transition-all transform hover:scale-105"
                        >
                          {isSubmitting ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="h-5 w-5 animate-spin" />
                              Updating...
                            </span>
                          ) : (
                            "Save Assessment"
                          )}
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Start Treatment */}
                  {currentRecord.status === "Assigned" && (
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <AlertCircle className="h-12 w-12 text-[#5AC5C8] mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Ready for Treatment</h3>
                      <p className="text-gray-600 mb-4">Review the triage information and begin treatment when ready.</p>
                      <button
                        onClick={startTreatment}
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-[#5AC5C8] text-white rounded-full hover:bg-[#4AB0B3] disabled:bg-[#A0D8DA] transition-all transform hover:scale-105"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Starting...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Play className="h-5 w-5" />
                            Begin Treatment
                          </span>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Prescriptions */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-3">
                      <Pill className="h-5 w-5 text-[#5AC5C8]" />
                      Prescriptions
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">{prescriptions.length} prescription(s) for this visit</p>
                    {currentRecord.status === "InTreatment" && (
                      <form onSubmit={handlePrescriptionSubmit} className="space-y-6 mb-8">
                        {prescriptionForm.medicineList.map((medicine, index) => (
                          <div key={`medicine-${index}`} className="bg-white p-4 rounded-lg border border-gray-200 relative">
                            {prescriptionForm.medicineList.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveMedicine(index)}
                                className="absolute top-2 right-2 p-1 text-gray-600 hover:text-gray-800"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="text-xs text-gray-600">Medicine Name *</label>
                                <input
                                  placeholder="e.g., Amoxicillin"
                                  value={medicine.name}
                                  onChange={(e) => handleMedicineChange(index, "name", e.target.value)}
                                  required
                                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5AC5C8]"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-gray-600">Dosage *</label>
                                <input
                                  placeholder="e.g., 500mg"
                                  value={medicine.dosage}
                                  onChange={(e) => handleMedicineChange(index, "dosage", e.target.value)}
                                  required
                                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5AC5C8]"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-gray-600">Frequency *</label>
                                <input
                                  placeholder="e.g., Twice daily"
                                  value={medicine.frequency}
                                  onChange={(e) => handleMedicineChange(index, "frequency", e.target.value)}
                                  required
                                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5AC5C8]"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-gray-600">Duration *</label>
                                <input
                                  placeholder="e.g., 7 days"
                                  value={medicine.duration}
                                  onChange={(e) => handleMedicineChange(index, "duration", e.target.value)}
                                  required
                                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5AC5C8]"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={handleAddMedicine}
                          className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105"
                        >
                          <Plus className="inline-block h-5 w-5 mr-2" />
                          Add Another Medication
                        </button>
                        <div className="mt-4">
                          <label className="text-xs text-gray-600">Additional Instructions</label>
                          <textarea
                            placeholder="Special instructions for the patient..."
                            value={prescriptionForm.instructions}
                            onChange={(e) => setPrescriptionForm({ ...prescriptionForm, instructions: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5AC5C8] min-h-[100px]"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-6 py-3 bg-[#5AC5C8] text-white rounded-full hover:bg-[#4AB0B3] disabled:bg-[#A0D8DA] transition-all transform hover:scale-105"
                        >
                          {isSubmitting ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="h-5 w-5 animate-spin" />
                              Creating...
                            </span>
                          ) : (
                            "Create Prescription"
                          )}
                        </button>
                      </form>
                    )}
                    <div className="space-y-4">
                      {prescriptions.length > 0 ? (
                        prescriptions.map((prescription) => (
                          <div key={prescription._id} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="text-sm font-medium text-gray-800">{safeFormat(prescription.datePrescribed, "PPPp")}</p>
                                <p className="text-sm text-gray-600">Prescribed by Dr. {prescription.doctorID?.firstName} {prescription.doctorID?.lastName}</p>
                              </div>
                              <span className={`px-3 py-1 text-sm rounded-full ${prescription.isFilled ? "bg-[#5AC5C8] text-white" : "bg-gray-100 text-gray-800"}`}>
                                {prescription.isFilled ? "Filled" : "Pending"}
                              </span>
                            </div>
                            <div className="space-y-3">
                              {prescription.medicineList?.map((medicine, idx) => (
                                <div key={`med-${prescription._id}-${idx}`} className="bg-gray-50 p-3 rounded-lg">
                                  <div className="flex justify-between items-start">
                                    <p className="font-medium text-gray-800">{medicine.name}</p>
                                    <p className="text-sm text-gray-600">{medicine.dosage}</p>
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1">Take {medicine.frequency} for {medicine.duration}</p>
                                </div>
                              ))}
                            </div>
                            {prescription.instructions && (
                              <div className="mt-4">
                                <p className="text-sm font-medium text-gray-700">Instructions</p>
                                <p className="text-sm text-gray-600">{prescription.instructions}</p>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12">
                          <Pill className="h-12 w-12 text-[#5AC5C8]" />
                          <p className="text-lg text-gray-600 mt-2">No prescriptions for this visit</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Lab Requests */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-3">
                      <FlaskConical className="h-5 w-5 text-[#5AC5C8]" />
                      Lab Requests
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">{labRequests.length} request(s) for this visit</p>
                    {currentRecord?.status === "InTreatment" && (
                      <form onSubmit={handleLabRequestSubmit} className="space-y-6 mb-8">
                        <div>
                          <label className="text-xs text-gray-600">Test Type *</label>
                          <input
                            placeholder="e.g., Complete Blood Count"
                            value={labForm.testType}
                            onChange={(e) => setLabForm({ ...labForm, testType: e.target.value })}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5AC5C8]"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">Priority</label>
                          <select
                            value={labForm.urgency}
                            onChange={(e) => setLabForm({ ...labForm, urgency: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5AC5C8]"
                          >
                            <option value="Normal">Normal</option>
                            <option value="Urgent">Urgent</option>
                            <option value="STAT">STAT (Immediate)</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">Instructions</label>
                          <textarea
                            placeholder="Special instructions for the lab..."
                            value={labForm.instructions}
                            onChange={(e) => setLabForm({ ...labForm, instructions: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5AC5C8] min-h-[100px]"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-6 py-3 bg-[#5AC5C8] text-white rounded-full hover:bg-[#4AB0B3] disabled:bg-[#A0D8DA] transition-all transform hover:scale-105"
                        >
                          {isSubmitting ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="h-5 w-5 animate-spin" />
                              Submitting...
                            </span>
                          ) : (
                            "Create Lab Request"
                          )}
                        </button>
                      </form>
                    )}
                    <div className="space-y-4">
                      {labRequests.length > 0 ? (
                        labRequests.map((request) => (
                          <div key={request._id} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="text-sm font-medium text-gray-800">{request.testType}</p>
                                <p className="text-sm text-gray-600">Requested on {safeFormat(request.requestDate, "PPP")}{request.completionDate && ` • Completed on ${safeFormat(request.completionDate, "PPP")}`}</p>
                              </div>
                              <span className={`px-3 py-1 text-sm rounded-full ${request.status === "Completed" ? "bg-[#5AC5C8] text-white" : request.status === "In Progress" ? "bg-gray-100 text-gray-800" : "bg-gray-50 text-gray-600"}`}>
                                {request.status}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-gray-600">Priority</p>
                                <span className={`px-3 py-1 text-sm rounded-full ${request.urgency === "Urgent" ? "bg-yellow-100 text-yellow-800" : request.urgency === "STAT" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}`}>
                                  {request.urgency}
                                </span>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600">Requested By</p>
                                <p className="text-sm text-gray-800">Dr. {request.doctorID?.firstName} {request.doctorID?.lastName}</p>
                              </div>
                            </div>
                            {request.instructions && (
                              <div className="mt-4">
                                <p className="text-xs text-gray-600">Instructions</p>
                                <p className="text-sm text-gray-800">{request.instructions}</p>
                              </div>
                            )}
                            {request.results && (
                              <div className="mt-4">
                                <p className="text-xs text-gray-600">Results</p>
                                {typeof request.results === "string" ? (
                                  <p className="text-sm text-gray-800">{request.results}</p>
                                ) : (
                                  <div className="text-sm text-gray-800 space-y-2">
                                    {Object.entries(request.results).map(([key, value]) => (
                                      <div key={key} className="flex justify-between">
                                        <span>{key}:</span>
                                        <span className="font-medium">{value}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12">
                          <FlaskConical className="h-12 w-12 text-[#5AC5C8]" />
                          <p className="text-lg text-gray-600 mt-2">No lab requests for this visit</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <FileWarning className="h-12 w-12 text-[#5AC5C8]" />
                  <p className="text-lg text-gray-600 mt-2">No active medical record found</p>
                  <button
                    onClick={() => navigate("/doctor/assigned-records")}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 mt-4"
                  >
                    View Assigned Patients
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Medical History */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg">
          <button 
            onClick={() => setActiveSection(activeSection === "history" ? "" : "history")} 
            className="w-full p-6 flex justify-between items-center border-b border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#5AC5C8]" />
              Central Medical History
            </h2>
            <svg className={`h-5 w-5 text-gray-600 transform ${activeSection === "history" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {activeSection === "history" && (
            <div className="p-6 space-y-6">
              {medicalHistory.length > 0 ? (
                medicalHistory.map((record, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{record.hospitalID ? `Hospital ID: ${record.hospitalID}` : "Central Record"}</p>
                        {record.date && <p className="text-sm text-gray-600">{safeFormat(new Date(record.date), "PPP")}</p>}
                      </div>
                    </div>
                    {record?.doctorNotes && (
                      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                          <User className="h-4 w-4 text-[#5AC5C8]" />
                          Doctor's Notes
                        </h3>
                        {record.doctorNotes.diagnosis && (
                          <div className="mb-2">
                            <p className="text-xs text-gray-600">Diagnosis</p>
                            <p className="text-sm text-gray-800">{record.doctorNotes.diagnosis}</p>
                          </div>
                        )}
                        {record.doctorNotes.treatmentPlan && (
                          <div>
                            <p className="text-xs text-gray-600">Treatment Plan</p>
                            <p className="text-sm text-gray-800">{record.doctorNotes.treatmentPlan}</p>
                          </div>
                        )}
                      </div>
                    )}
                    {Array.isArray(record.labResults) && record.labResults.length > 0 && (
                      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                          <FlaskConical className="h-4 w-4 text-[#5AC5C8]" />
                          Lab Results
                        </h3>
                        {record.labResults.map((lab, idx) => (
                          <div key={idx} className="pb-2 mb-2 border-b border-gray-200 last:border-0 last:pb-0 last:mb-0">
                            <div className="flex justify-between">
                              <p className="text-sm font-medium text-gray-800">{lab.testName || "Unnamed Test"}</p>
                              {lab.date && <p className="text-xs text-gray-600">{safeFormat(new Date(lab.date), "PP")}</p>}
                            </div>
                            <p className="text-sm text-gray-800">{lab.result || "No result provided"}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {Array.isArray(record.prescription) && record.prescription.length > 0 && (
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                          <Pill className="h-4 w-4 text-[#5AC5C8]" />
                          Prescriptions
                        </h3>
                        {record.prescription.map((med, idx) => (
                          <div key={idx} className="pb-2 mb-2 border-b border-gray-200 last:border-0 last:pb-0 last:mb-0">
                            <div className="flex justify-between">
                              <p className="text-sm font-medium text-gray-800">{med.medicationName || "Unnamed"}</p>
                              <p className="text-xs text-gray-600">{med.dosage || "N/A"}</p>
                            </div>
                            <div className="flex gap-4 mt-1">
                              <p className="text-xs text-gray-600">Frequency: {med.frequency || "-"}</p>
                              <p className="text-xs text-gray-600">Duration: {med.duration || "-"}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-[#5AC5C8]" />
                  <p className="text-lg text-gray-600 mt-2">No medical history found in central records</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PatientDetail