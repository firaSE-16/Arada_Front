"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { BASE_URL } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, Search, User, Stethoscope, Syringe, FlaskConical, Pill, ClipboardList } from "lucide-react";

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch(`${BASE_URL}/hospital-admin/staff`, {
          credentials: "include",
        });
        const data = await response.json();
        setStaff(data);
      } catch (error) {
        console.error("Error fetching staff:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  const filteredStaff = staff.filter((member) => {
    return `${member.firstName} ${member.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "Doctor":
        return "bg-emerald-100 text-emerald-800";
      case "Nurse":
        return "bg-blue-100 text-blue-800";
      case "LabTechnician":
        return "bg-purple-100 text-purple-800";
      case "Pharmacist":
        return "bg-yellow-100 text-yellow-800";
      case "Receptionist":
        return "bg-pink-100 text-pink-800";
      case "Triage":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "Doctor":
        return <Stethoscope className="h-4 w-4 mr-1" />;
      case "Nurse":
        return <Syringe className="h-4 w-4 mr-1" />;
      case "LabTechnician":
        return <FlaskConical className="h-4 w-4 mr-1" />;
      case "Pharmacist":
        return <Pill className="h-4 w-4 mr-1" />;
      case "Receptionist":
        return <ClipboardList className="h-4 w-4 mr-1" />;
      case "Triage":
        return <User className="h-4 w-4 mr-1" />;
      default:
        return <User className="h-4 w-4 mr-1" />;
    }
  };

  return (
    <div className="space-y-6 p-6 bg-emerald-50 min-h-screen">
      <div className="flex items-center gap-3">
        <Users className="h-8 w-8 text-emerald-600" />
        <h1 className="text-2xl font-bold text-emerald-900">Staff Management</h1>
      </div>
      
      {/* Search Control */}
      <div className="bg-white p-4 rounded-lg border border-emerald-200">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500" />
          <Input
            placeholder="Search staff by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-emerald-200 focus:ring-emerald-300"
          />
        </div>
      </div>

      {/* Staff Table */}
      <Card className="border-emerald-200 shadow-sm">
        <CardHeader className="bg-emerald-100/50 border-b border-emerald-200">
          <CardTitle className="text-emerald-800">All Staff Members</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-8">
              <p className="text-emerald-600">Loading staff...</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-emerald-50">
                <TableRow>
                  <TableHead className="w-[200px]">Staff Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((member) => (
                  <TableRow key={member._id} className="hover:bg-emerald-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={member.profilePhoto} />
                          <AvatarFallback className="bg-emerald-100 text-emerald-600">
                            {member.firstName.charAt(0)}
                            {member.lastName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-emerald-900">
                            {member.firstName} {member.lastName}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getRoleBadgeColor(member.role)} flex items-center`}>
                        {getRoleIcon(member.role)}
                        {member.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-emerald-600">
                      {member.email}
                    </TableCell>
                    <TableCell className="text-emerald-600">
                      {member.specialization || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {!loading && filteredStaff.length === 0 && (
            <div className="text-center py-8 text-emerald-600">
              No staff members found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffManagement;