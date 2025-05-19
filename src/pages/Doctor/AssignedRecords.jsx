import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search,
  User,
  Stethoscope,
  Activity,
  ArrowRight,
  Loader2,
  AlertCircle,
  RefreshCw,
  FileText,
  PlusCircle,
  Filter,
  ChevronRight,
  Calendar,
  HeartPulse
} from "lucide-react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { toast } from "react-toastify";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";

const BASE_URL = "http://localhost:7500";

const AssignedRecords = () => {
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [assignedRecords, setAssignedRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const authRes = await fetch(`${BASE_URL}/api/auth/me`, {
          credentials: "include",
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!authRes.ok) throw new Error("Failed to fetch user info");
        const authData = await authRes.json();

        const doctorRes = await fetch(`${BASE_URL}/api/doctors/getStaffAccount/${authData.userId}`, {
          credentials: "include",
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!doctorRes.ok) throw new Error("Failed to fetch doctor information");
        setDoctorInfo(await doctorRes.json());

        const recordsRes = await fetch(`${BASE_URL}/api/doctors/patients`, { 
          credentials: "include",
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!recordsRes.ok) throw new Error("Failed to load patient records");
        
        const recordsData = await recordsRes.json();
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
        })));
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.message);
        toast.error(error.message);
        
        if (error.message.includes("Failed") || error.message.includes("Session")) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const filteredRecords = assignedRecords.filter(record => 
    `${record.firstName} ${record.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (record.faydaID && record.faydaID.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (record.medicalRecordId && record.medicalRecordId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleViewRecord = (patientId) => {
    navigate(`/doctor/records/${patientId}`);
  };

  const getStatusVariant = (status) => {
    switch(status) {
      case 'Active':
      case 'InTreatment':
      case 'In-Treatment':
        return 'default';
      case 'Emergency':
        return 'destructive';
      case 'Discharged':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      setError(null);
      
      const recordsRes = await fetch(`${BASE_URL}/api/doctors/patients`, { 
        credentials: "include",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!recordsRes.ok) throw new Error("Failed to refresh records");
      
      const recordsData = await recordsRes.json();
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
      })));
      toast.success("Records refreshed successfully");
    } catch (error) {
      console.error("Refresh error:", error);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setRefreshing(false);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 p-6">
        <div className="bg-red-100 p-4 rounded-full">
          <AlertCircle className="h-10 w-10 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold">Something went wrong</h2>
        <p className="text-muted-foreground text-center max-w-md">{error}</p>
        <Button onClick={refreshData} disabled={refreshing} className="mt-4">
          {refreshing ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Try Again
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 space-y-8   bg-emerald-50">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border">
              <Skeleton className="h-6 w-24 mb-2" />
              <Skeleton className="h-8 w-full mb-1" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-9 w-24" />
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8  bg-emerald-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Patients</h1>
        </div>
      </div>

  

      {/* Search and Filter */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search patients by name, ID or record number..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
       
        </div>
      </div>

      {/* Patients List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg">Patient Records</h2>
          <p className="text-sm text-gray-500">
            Showing {filteredRecords.length} of {assignedRecords.length} patients
          </p>
        </div>

        {filteredRecords.length > 0 ? (
          <div className="space-y-3">
            {filteredRecords.map((record) => (
              <div 
                key={record.medicalRecordId} 
                className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleViewRecord(record.patientId)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>
                        {record.firstName?.charAt(0)}{record.lastName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">
                        {record.firstName} {record.lastName}
                      </h3>
                      <div className="flex items-center space-x-3 mt-1">
                        <Badge variant={getStatusVariant(record.recordStatus)}>
                          {record.recordStatus}
                        </Badge>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          {record.lastVisit}
                        </div>
                        <div className="text-sm text-gray-500">
                          {record.faydaID || 'No Fayda ID'}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right hidden md:block">
                      <p className="text-sm text-gray-500">Condition</p>
                      <p className="font-medium">{record.condition}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 text-center border border-gray-100">
            <FileText className="h-10 w-10 mx-auto text-gray-400" />
            <h3 className="mt-4 font-medium text-gray-900">
              {searchTerm ? "No patients found" : "No patients assigned"}
            </h3>
            <p className="mt-1 text-gray-500">
              {searchTerm ? "Try adjusting your search" : "You currently have no patients assigned to your care"}
            </p>
            <Button variant="outline" className="mt-4" onClick={() => setSearchTerm('')}>
              {searchTerm ? "Clear search" : "Refresh"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedRecords;