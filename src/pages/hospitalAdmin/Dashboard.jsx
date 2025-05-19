"use client"

import { useState, useEffect } from "react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from "@/components/ui/card"
import { 
  Building2,
  Users2,
  User,
  Stethoscope,
  Activity,
  UserCog2,
  Clock,
  AlertCircle,
  FlaskConical,
  MapPin,
  Phone,
  Mail,
  Bed,
  Calendar,
  HeartPulse
} from "lucide-react"
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  Label
} from 'recharts'
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];

// Constant hospital data
const hospitalData = {
  name: "Arada Hospital",
  location: "Bole, Addis Ababa",
  contactNumber: "+251 90 909 0909",
  email: "info@aradahospital.com",
  totalBeds: 250,
  departments: ["General Medicine", "Pediatrics", "Surgery", "Cardiology", "Neurology"],
  establishedYear: 2010
};

// Constant user counts
const userCounts = {
  Patient: 1245,
  HospitalAdministrator: 12,
  Admin: 5,
  Doctor: 48,
  Receptionist: 18,
  Triage: 8,
  LabTechnician: 6
};

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalHospitals: 1,
    userCounts: userCounts,
    loading: false,
    error: null,
    lastUpdated: new Date().toLocaleTimeString()
  });

  // Prepare data for charts
  const userTypeData = [
    { name: 'Patients', value: stats.userCounts.Patient, icon: <User className="h-4 w-4" /> },
    { name: 'Hospital Admins', value: stats.userCounts.HospitalAdministrator, icon: <UserCog2 className="h-4 w-4" /> },
    { name: 'System Admins', value: stats.userCounts.Admin, icon: <Users2 className="h-4 w-4" /> },
    { name: 'Doctors', value: stats.userCounts.Doctor, icon: <Stethoscope className="h-4 w-4" /> },
    { name: 'Receptionists', value: stats.userCounts.Receptionist, icon: <User className="h-4 w-4" /> },
    { name: 'Triage', value: stats.userCounts.Triage, icon: <Activity className="h-4 w-4" /> },
    { name: 'Lab Technicians', value: stats.userCounts.LabTechnician, icon: <FlaskConical className="h-4 w-4" /> },
  ].filter(item => item.value > 0);

  const barChartData = [
    { name: 'Patients', count: stats.userCounts.Patient },
    { name: 'Hospital Admins', count: stats.userCounts.HospitalAdministrator },
    { name: 'System Admins', count: stats.userCounts.Admin },
    { name: 'Doctors', count: stats.userCounts.Doctor },
    { name: 'Other Staff', count: stats.userCounts.Receptionist + stats.userCounts.Triage + stats.userCounts.LabTechnician },
  ];

  const refreshData = () => {
    setStats(prev => ({
      ...prev,
      lastUpdated: new Date().toLocaleTimeString()
    }));
  };

  return (
    <div className="p-6 space-y-6 bg-emerald-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-emerald-900 flex items-center gap-2">
            <HeartPulse className="h-6 w-6 text-emerald-600" />
            Hospital Administration Dashboard
          </h1>
          <div className="flex items-center text-sm text-emerald-600 mt-1">
            <Clock className="h-3 w-3 mr-1" />
            Last updated: {stats.lastUpdated}
          </div>
        </div>
        <Button 
          variant="outline" 
          onClick={refreshData}
          className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
        >
          Refresh Data
        </Button>
      </div>

      {/* Stats Grid - Moved to top */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Patients" 
          value={stats.userCounts.Patient} 
          description="Registered patients"
          icon={<User className="h-4 w-4 text-emerald-600" />}
        />

        <StatCard 
          title="Medical Staff" 
          value={stats.userCounts.Doctor} 
          description="Doctors & specialists"
          icon={<Stethoscope className="h-4 w-4 text-emerald-600" />}
        />

        <StatCard 
          title="Support Staff" 
          value={stats.userCounts.Receptionist + stats.userCounts.Triage + stats.userCounts.LabTechnician} 
          description="Hospital support team"
          icon={<UserCog2 className="h-4 w-4 text-emerald-600" />}
        />

        <StatCard 
          title="Administrators" 
          value={stats.userCounts.HospitalAdministrator + stats.userCounts.Admin} 
          description="Hospital management"
          icon={<Users2 className="h-4 w-4 text-emerald-600" />}
        />
      </div>

      {/* Hospital Info Card - Compact Version */}
      <Card className="border-emerald-200">
        <CardHeader className="bg-emerald-100/50 border-b border-emerald-200">
          <CardTitle className="text-emerald-800">Hospital Overview</CardTitle>
          <CardDescription className="text-emerald-600">Key details about {hospitalData.name}</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-2 rounded-full">
                <Building2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-medium text-emerald-800">Hospital Name</h3>
                <p className="text-sm text-emerald-600">{hospitalData.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-2 rounded-full">
                <MapPin className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-medium text-emerald-800">Location</h3>
                <p className="text-sm text-emerald-600">{hospitalData.location}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-2 rounded-full">
                <Phone className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-medium text-emerald-800">Contact</h3>
                <p className="text-sm text-emerald-600">{hospitalData.contactNumber}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-2 rounded-full">
                <Mail className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-medium text-emerald-800">Email</h3>
                <p className="text-sm text-emerald-600">{hospitalData.email}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-2 rounded-full">
                <Bed className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-medium text-emerald-800">Total Beds</h3>
                <p className="text-sm text-emerald-600">{hospitalData.totalBeds}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-2 rounded-full">
                <Calendar className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-medium text-emerald-800">Established</h3>
                <p className="text-sm text-emerald-600">{hospitalData.establishedYear}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-emerald-50 border-t border-emerald-200 p-4">
          <div className="w-full">
            <h4 className="text-sm font-medium text-emerald-800 mb-2">Departments</h4>
            <div className="flex flex-wrap gap-2">
              {hospitalData.departments.map((dept, index) => (
                <Badge 
                  key={index} 
                  variant="outline"
                  className="border-emerald-200 text-emerald-700 bg-emerald-100/50"
                >
                  {dept}
                </Badge>
              ))}
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Charts Row - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-emerald-200">
          <CardHeader className="bg-emerald-100/50 border-b border-emerald-200">
            <CardTitle className="text-emerald-800">User Distribution</CardTitle>
            <CardDescription className="text-emerald-600">Breakdown of user types</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] p-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {userTypeData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      stroke="#fff"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} users`, 'Count']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-emerald-200">
          <CardHeader className="bg-emerald-100/50 border-b border-emerald-200">
            <CardTitle className="text-emerald-800">User Counts</CardTitle>
            <CardDescription className="text-emerald-600">Number of users by category</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] p-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                barSize={40}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d1fae5" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  stroke="#065f46"
                />
                <YAxis stroke="#065f46" />
                <Tooltip />
                <Bar 
                  dataKey="count" 
                  radius={[4, 4, 0, 0]}
                >
                  {barChartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const StatCard = ({ title, value, description, icon }) => (
  <Card className="border-emerald-200 hover:shadow-md transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
      <CardTitle className="text-sm font-medium text-emerald-600">
        {title}
      </CardTitle>
      <div className="h-4 w-4 text-emerald-500">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-emerald-900">{value.toLocaleString()}</div>
      <p className="text-xs text-emerald-600 mt-1">{description}</p>
    </CardContent>
  </Card>
);