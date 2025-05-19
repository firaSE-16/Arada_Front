import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Divider
} from '@mui/material';
import { 
  Science as ScienceIcon,
  Person as PersonIcon,
  Save,
  Close
} from '@mui/icons-material';
import axios from 'axios';

const BASE_URL = "http://localhost:7500";

const LabForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    testValue: '',
    normalRange: '',
    interpretation: '',
    notes: '',
    status: 'Pending'
  });

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/api/lab/requests/${id}`, {
          withCredentials: true
        });
        setRequest(res.data);
        setFormData({
          testValue: res.data.results?.testValue || '',
          normalRange: res.data.results?.normalRange || '',
          interpretation: res.data.results?.interpretation || '',
          notes: res.data.results?.notes || '',
          status: res.data.status
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching lab request:', error);
        setLoading(false);
      }
    };
    
    fetchRequest();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await axios.put(`${BASE_URL}/api/lab/requests/${id}`, formData, {
        withCredentials: true
      });
      navigate('/laboratorist/patientList');
    } catch (error) {
      console.error('Error updating lab results:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <CircularProgress className="text-emerald-600" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <Typography variant="h6">Lab request not found</Typography>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-emerald-100 text-emerald-800';
      case 'Completed': return 'bg-emerald-200 text-emerald-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6  bg-emerald-50 min-h-screen max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <ScienceIcon className="h-8 w-8 text-gray-700" />
        <Typography variant="h5" fontWeight="medium" className="text-gray-800">
          Lab Test Results
        </Typography>
      </div>
      
      {/* Patient and Test Info Card */}
      <Card elevation={0} className="mb-6 rounded-lg border border-gray-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <PersonIcon className="text-gray-600" />
                <Typography variant="subtitle1" fontWeight="medium" className="text-gray-800">
                  Patient Details
                </Typography>
              </div>
              <div className="space-y-2 text-gray-700">
                <p><span className="font-medium">Name:</span> {request.patientID?.firstName} {request.patientID?.lastName}</p>
                <p><span className="font-medium">Fayda ID:</span> {request.patientID?.faydaID}</p>
                <p><span className="font-medium">Gender:</span> {request.patientID?.gender}</p>
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ScienceIcon className="text-gray-600" />
                <Typography variant="subtitle1" fontWeight="medium" className="text-gray-800">
                  Test Details
                </Typography>
              </div>
              <div className="space-y-2 text-gray-700">
                <p><span className="font-medium">Test Type:</span> {request.testType}</p>
                <p><span className="font-medium">Requested by:</span> Dr. {request.doctorID?.firstName} {request.doctorID?.lastName}</p>
                <div className="flex items-center">
                  <span className="font-medium mr-2">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Test Results Form */}
      <Card elevation={0} className="rounded-lg border border-gray-200">
        <CardContent className="p-6">
          <Typography variant="subtitle1" fontWeight="medium" className="text-gray-800 mb-6">
            Enter Test Results
          </Typography>
          <Divider className="mb-6" />
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              fullWidth
              label="Test Value"
              name="testValue"
              value={formData.testValue}
              onChange={handleChange}
              variant="outlined"
              size="small"
            />
            
            <TextField
              fullWidth
              label="Normal Range"
              name="normalRange"
              value={formData.normalRange}
              onChange={handleChange}
              variant="outlined"
              size="small"
            />
            
            <TextField
              fullWidth
              label="Interpretation"
              name="interpretation"
              value={formData.interpretation}
              onChange={handleChange}
              variant="outlined"
              size="small"
              multiline
              rows={3}
            />
            
            <TextField
              fullWidth
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              variant="outlined"
              size="small"
              multiline
              rows={3}
            />
            
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                label="Status"
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
            </FormControl>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button 
                variant="outlined"
                onClick={() => navigate('/laboratorist/patientList')}
                startIcon={<Close />}
                className="text-gray-700 border-gray-300"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={submitting}
                startIcon={<Save />}
                className="bg-emerald-600  hover:bg-emerald-700 shadow-none"
              >
                {submitting ? <CircularProgress size={24} className="text-white" /> : 'Save Results'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LabForm;