"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ChevronLeft, ClipboardList, User, Phone, Calendar, MapPin, HeartPulse } from "lucide-react"
import axios from "axios"
import { BASE_URL } from "@/lib/utils"
import moment from "moment"

const RegisteredPatient = () => {
  const { faydaID } = useParams()
  const navigate = useNavigate()
  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [medicalHistory, setMedicalHistory] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientRes = await axios.get(`${BASE_URL}/reception/patient/${faydaID}`, {
          withCredentials: true
        })

        if (patientRes.data.success) {
          setPatient(patientRes.data.patient)
          setMedicalHistory(patientRes.data.patient.medicalHistory || "")
        } else {
          throw new Error(patientRes.data.message || "Failed to fetch patient")
        }
      } catch (err) {
        console.error('Error:', err)
        setError(err.message)
        navigate('/receptionist/registration')
      } finally {
        setLoading(false)
      }
    }

    if (faydaID) {
      fetchData()
    } else {
      setError("No patient ID provided")
      navigate('/receptionist/registration')
    }
  }, [faydaID, navigate])

  const handleSubmit = async () => {
    if (!patient) return

    setSubmitting(true)
    try {
      const response = await axios.post(
        `${BASE_URL}/reception/register-patient`,
        {
          ...patient,
          faydaID,
          medicalHistory,
          dateOfBirth: moment(patient.dateOfBirth).format('YYYY-MM-DD')
        },
        { withCredentials: true }
      )

      if (response.data.success) {
        navigate('/receptionist/registration')
      } else {
        throw new Error(response.data.message || "Registration failed")
      }
    } catch (error) {
      console.error('Error:', error)
      setError(error.response?.data?.message || error.message || "Failed to initiate record")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-outfit">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#5AC5C8] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg text-gray-600">Loading patient information...</p>
        </div>
      </div>
    )
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
          <p className="text-lg text-gray-700 mb-6">{error}</p>
          <button 
            onClick={() => navigate('/receptionist/registration')}
            className="inline-flex items-center px-6 py-3 bg-[#5AC5C8] text-white rounded-full hover:bg-[#4AB0B3] transition-all transform hover:scale-105"
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Return to Search
          </button>
        </div>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-outfit px-4">
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center shadow-lg max-w-md">
          <div className="inline-block p-4 bg-gray-50 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-lg text-gray-700 mb-6">Patient not found</p>
          <button 
            onClick={() => navigate('/receptionist/registration')}
            className="inline-flex items-center px-6 py-3 bg-[#5AC5C8] text-white rounded-full hover:bg-[#4AB0B3] transition-all transform hover:scale-105"
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Return to Search
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 font-outfit">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
          <div>
            <h1 className="text-4xl font-semibold text-gray-800">Patient Record</h1>
            <p className="text-lg text-gray-600 mt-2">Review and initiate medical record for the patient</p>
          </div>
          <button 
            onClick={() => navigate('/receptionist/registration')}
            className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition-all transform hover:scale-105"
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Back to Search
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="p-8 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="h-16 w-16 rounded-full bg-[#5AC5C8] text-white font-semibold text-2xl flex items-center justify-center">
                  {patient.firstName.charAt(0).toUpperCase()}{patient.lastName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">{patient.firstName} {patient.lastName}</h2>
                  <span className="inline-block mt-2 px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded-full">
                    ID: {patient.faydaID}
                  </span>
                </div>
              </div>
              <span className="inline-block px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded-full">
                Arada Hospital
              </span>
            </div>
          </div>

          <div className="p-8 space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <label className="flex items-center gap-2 text-gray-600 text-lg font-medium">
                  <Calendar className="h-5 w-5 text-[#5AC5C8]" />
                  Date of Birth
                </label>
                <input 
                  value={moment(patient.dateOfBirth).format('DD MMM YYYY')} 
                  readOnly 
                  className="mt-2 w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-lg"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-gray-600 text-lg font-medium">
                  <User className="h-5 w-5 text-[#5AC5C8]" />
                  Gender
                </label>
                <input 
                  value={patient.gender} 
                  readOnly 
                  className="mt-2 w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-lg"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-gray-600 text-lg font-medium">
                  <Phone className="h-5 w-5 text-[#5AC5C8]" />
                  Contact Number
                </label>
                <input 
                  value={patient.contactNumber} 
                  readOnly 
                  className="mt-2 w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-lg"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-gray-600 text-lg font-medium">
                  <MapPin className="h-5 w-5 text-[#5AC5C8]" />
                  Address
                </label>
                <input 
                  value={patient.address} 
                  readOnly 
                  className="mt-2 w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-lg"
                />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <HeartPulse className="h-6 w-6 text-[#5AC5C8]" />
                Emergency Contact
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="text-gray-600 text-lg font-medium">Name</label>
                  <input 
                    value={patient.emergencyContact?.name || 'Not provided'} 
                    readOnly 
                    className="mt-2 w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-lg"
                  />
                </div>
                <div>
                  <label className="text-gray-600 text-lg font-medium">Relationship</label>
                  <input 
                    value={patient.emergencyContact?.relation || 'Not provided'} 
                    readOnly 
                    className="mt-2 w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-lg"
                  />
                </div>
                <div>
                  <label className="text-gray-600 text-lg font-medium">Phone</label>
                  <input 
                    value={patient.emergencyContact?.phone || 'Not provided'} 
                    readOnly 
                    className="mt-2 w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-lg"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-600 text-lg font-medium">
                <ClipboardList className="h-5 w-5 text-[#5AC5C8]" />
                Medical History
              </label>
              <textarea
                value={medicalHistory}
                onChange={(e) => setMedicalHistory(e.target.value)}
                placeholder="Enter patient's medical history"
                className="mt-2 w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-lg min-h-[120px]"
              />
            </div>
          </div>

          <div className="p-8 border-t border-gray-200 flex justify-end">
            <button 
              onClick={handleSubmit} 
              disabled={submitting}
              className="px-6 py-3 bg-[#5AC5C8] text-white rounded-full hover:bg-[#4AB0B3] transition-all transform hover:scale-105 disabled:bg-[#A0D8DA]"
            >
              {submitting ? 'Processing...' : 'Initiate Medical Record'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisteredPatient