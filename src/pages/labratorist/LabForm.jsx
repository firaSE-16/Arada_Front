"use client"

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  User, 
  FlaskConical, 
  Save, 
  X, 
  Loader2 
} from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const BASE_URL = "https://arada-backk.onrender.com"

const LabForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [request, setRequest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    testValue: '',
    normalRange: '',
    interpretation: '',
    notes: '',
    status: 'Pending'
  })

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${BASE_URL}/api/lab/requests/${id}`, {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        setRequest(res.data)
        setFormData({
          testValue: res.data.results?.testValue || '',
          normalRange: res.data.results?.normalRange || '',
          interpretation: res.data.results?.interpretation || '',
          notes: res.data.results?.notes || '',
          status: res.data.status
        })
      } catch (error) {
        console.error('Error fetching lab request:', error)
        toast.error('Failed to load lab request')
      } finally {
        setLoading(false)
      }
    }
    
    fetchRequest()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      await axios.put(`${BASE_URL}/api/lab/requests/${id}`, formData, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      toast.success('Lab results saved successfully')
      navigate('/laboratorist/patientList')
    } catch (error) {
      console.error('Error updating lab results:', error)
      toast.error('Failed to save lab results')
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'In Progress': return 'bg-[#5AC5C8] text-white'
      case 'Completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-50 text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white font-outfit flex justify-center items-center">
        <Loader2 className="h-12 w-12 text-[#5AC5C8] animate-spin" />
      </div>
    )
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-white font-outfit py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800">Lab Request Not Found</h2>
          <button
            onClick={() => navigate('/laboratorist/patientList')}
            className="mt-4 px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition-all transform hover:scale-105"
          >
            Return to Patient List
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white font-outfit py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <FlaskConical className="h-8 w-8 text-[#5AC5C8]" />
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">Lab Result Entry</h1>
            <p className="text-lg text-gray-600 mt-2">Record test results for {request.testType}</p>
          </div>
        </div>

        {/* Patient and Test Info */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-[#5AC5C8]" />
                Patient Information
              </h2>
              <div className="space-y-2 text-gray-700">
                <p><span className="font-medium">Name:</span> {request.patientID?.firstName} {request.patientID?.lastName}</p>
                <p><span className="font-medium">Fayda ID:</span> {request.patientID?.faydaID}</p>
                <p><span className="font-medium">Gender:</span> {request.patientID?.gender}</p>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <FlaskConical className="h-5 w-5 text-[#5AC5C8]" />
                Test Information
              </h2>
              <div className="space-y-2 text-gray-700">
                <p><span className="font-medium">Test Type:</span> {request.testType}</p>
                <p><span className="font-medium">Requested By:</span> Dr. {request.doctorID?.firstName} {request.doctorID?.lastName}</p>
                <div className="flex items-center">
                  <span className="font-medium mr-2">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Test Results Form */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Enter Test Results</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm text-gray-600">Test Value</label>
              <input
                type="text"
                name="testValue"
                value={formData.testValue}
                onChange={handleChange}
                placeholder="Enter test result value..."
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5AC5C8]"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Normal Range</label>
              <input
                type="text"
                name="normalRange"
                value={formData.normalRange}
                onChange={handleChange}
                placeholder="Enter normal range (e.g., 70-100)..."
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5AC5C8]"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Interpretation</label>
              <textarea
                name="interpretation"
                value={formData.interpretation}
                onChange={handleChange}
                placeholder="Provide interpretation of results..."
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5AC5C8] min-h-[100px]"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional notes..."
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5AC5C8] min-h-[100px]"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5AC5C8]"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/laboratorist/patientList')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center gap-2"
              >
                <X className="h-5 w-5" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-[#5AC5C8] text-white rounded-full hover:bg-[#4AB0B3] disabled:bg-[#A0D8DA] transition-all transform hover:scale-105 flex items-center gap-2"
              >
                {submitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Save className="h-5 w-5" />
                )}
                {submitting ? 'Saving...' : 'Save Results'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LabForm