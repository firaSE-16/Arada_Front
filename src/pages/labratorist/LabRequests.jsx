import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Button
} from '@mui/material';
import { 
  Search as SearchIcon,
  FilterAlt as FilterIcon,
  ArrowForward as ArrowForwardIcon,
  HourglassEmpty as PendingIcon,
  Build as InProgressIcon,
  CheckCircle as CompletedIcon
} from '@mui/icons-material';
import axios from 'axios';
import { format } from 'date-fns';
const BASE_URL = "http://localhost:7500";

const LabRequests = () => {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Pending');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/api/lab/requests`, {
          params: {
            status: statusFilter,
            search: searchTerm
          },
          withCredentials: true
        });
        setRequests(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching lab requests:', error);
        setLoading(false);
      }
    };
    
    const debounceTimer = setTimeout(() => {
      fetchRequests();
    }, 500);
    
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, statusFilter]);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Pending':
        return { 
          color: 'bg-amber-100 text-amber-800',
          icon: <PendingIcon className="h-4 w-4 mr-1" />
        };
      case 'In Progress':
        return { 
          color: 'bg-blue-100 text-blue-800',
          icon: <InProgressIcon className="h-4 w-4 mr-1" />
        };
      case 'Completed':
        return { 
          color: 'bg-emerald-100 text-emerald-800',
          icon: <CompletedIcon className="h-4 w-4 mr-1" />
        };
      default:
        return { 
          color: 'bg-gray-100 text-gray-800',
          icon: null
        };
    }
  };

  return (
    <div className="p-6 bg-emerald-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Lab Test Requests</h1>
          <p className="text-gray-600">Manage and track laboratory test requests</p>
        </div>
      </div>
      
      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <TextField
              fullWidth
              placeholder="Search patients..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className="text-gray-400" />
                  </InputAdornment>
                ),
                className: "pl-10"
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Requests Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <TableContainer>
          <Table className="min-w-full">
            <TableHead className="bg-gray-50">
              <TableRow>
                <TableCell className="font-medium text-gray-700">Patient</TableCell>
                <TableCell className="font-medium text-gray-700">Fayda ID</TableCell>
                <TableCell className="font-medium text-gray-700">Test Type</TableCell>
                <TableCell className="font-medium text-gray-700">Request Date</TableCell>
                <TableCell className="font-medium text-gray-700">Status</TableCell>
                <TableCell className="font-medium text-gray-700 text-right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center">
                    <CircularProgress className="text-emerald-500" />
                    <p className="mt-2 text-gray-500">Loading requests...</p>
                  </TableCell>
                </TableRow>
              ) : requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-gray-500">
                    No requests found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((request) => {
                  const statusConfig = getStatusConfig(request.status);
                  return (
                    <TableRow 
                      key={request._id} 
                      hover
                      className="hover:bg-gray-50"
                    >
                      <TableCell className="font-medium">
                        {request.patientID?.firstName} {request.patientID?.lastName}
                      </TableCell>
                      <TableCell className="text-gray-600">{request.patientID?.faydaID}</TableCell>
                      <TableCell>{request.testType}</TableCell>
                      <TableCell className="text-gray-600">
                        {format(new Date(request.requestDate), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          {statusConfig.icon}
                          {request.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outlined"
                          size="small"
                          endIcon={<ArrowForwardIcon />}
                          onClick={() => navigate(`/laboratorist/requests/${request._id}`)}
                          className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                        >
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default LabRequests;