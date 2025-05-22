"use client"

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Search, 
  Loader2, 
  Clock, 
  Wrench, 
  CheckCircle, 
  ArrowRight 
} from 'lucide-react'
import axios from 'axios'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const BASE_URL = "https://arada-backk.onrender.com"

const LabRequests = () => {
  const [requests, setRequests] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('Pending')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${BASE_URL}/api/lab/requests`, {
          params: {
            status: statusFilter,
            search: searchTerm
          },
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        setRequests(res.data)
      } catch (error) {
        console.error('Error fetching lab requests:', error)
        toast.error('Failed to load lab requests')
      } finally {
        setLoading(false)
      }
    }
    
    const debounceTimer = setTimeout(() => {
      fetchRequests()
    }, 500)
    
    return () => clearTimeout(debounceTimer)
  }, [searchTerm, statusFilter])

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Pending':
        return { 
          color: 'bg-yellow-100 text-yellow-800',
          icon: <Clock className="h-4 w-4 mr-1" />
        }
      case 'In Progress':
        return { 
          color: 'bg-[#5AC5C8] text-white',
          icon: <Wrench className="h-4 w-4 mr-1" />
        }
      case 'Completed':
        return { 
          color: 'bg-gray-100 text-gray-800',
          icon: <CheckCircle className="h-4 w-4 mr-1" />
        }
      default:
        return { 
          color: 'bg-gray-50 text-gray-600',
          icon: null
        }
    }
  }

  return (
    <div className="min-h-screen bg-white font-outfit py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-semibold text-gray-800">Laboratory Requests</h1>
          <p className="text-lg text-gray-600 mt-2">Track and manage lab test requests</p>
        </div>

        {/* Filters Section */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#5AC5C8]" />
              <input
                type="text"
                placeholder="Search by patient name or Fayda ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5AC5C8]"
              />
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-48 p-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5AC5C8]"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="">All</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Patient</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Fayda ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Test Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Request Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <Loader2 className="h-8 w-8 text-[#5AC5C8] animate-spin mx-auto" />
                    <p className="mt-2 text-gray-600">Loading requests...</p>
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-600">
                    No requests found matching your criteria
                  </td>
                </tr>
              ) : (
                requests.map((request) => {
                  const statusConfig = getStatusConfig(request.status)
                  return (
                    <tr 
                      key={request._id} 
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/laboratorist/requests/${request._id}`)}
                    >
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {request.patientID?.firstName} {request.patientID?.lastName}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{request.patientID?.faydaID}</td>
                      <td className="px-6 py-4 text-gray-800">{request.testType}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {format(new Date(request.requestDate), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
                          {statusConfig.icon}
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/laboratorist/requests/${request._id}`)
                          }}
                          className="px-4 py-2 border border-[#5AC5C8] text-[#5AC5C8] rounded-full hover:bg-[#5AC5C8] hover:text-white transition-all transform hover:scale-105"
                        >
                          <span className="flex items-center gap-2">
                            Details
                            <ArrowRight className="h-4 w-4" />
                          </span>
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default LabRequests