import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Button } from "../../components/ui/button"
import { Edit, Trash2, Users } from "lucide-react"

const EditViewStaff = () => {
  // Sample staff data
  const staffData = [
    {
      id: 1,
      name: "Dr. John Smith",
      email: "john.smith@mediconet.com",
      role: "Doctor",
      department: "Cardiology",
      status: "Active",
    },
    {
      id: 2,
      name: "Nurse Mary Johnson",
      email: "mary.johnson@mediconet.com",
      role: "Nurse",
      department: "Pediatrics",
      status: "Active",
    },
    {
      id: 3,
      name: "Dr. Sarah Williams",
      email: "sarah.williams@mediconet.com",
      role: "Doctor",
      department: "Neurology",
      status: "Active",
    },
    {
      id: 4,
      name: "James Brown",
      email: "james.brown@mediconet.com",
      role: "Receptionist",
      department: "Front Desk",
      status: "Inactive",
    },
  ]

  return (
    <div className="space-y-6 p-6 bg-emerald-50 min-h-screen">
      <div className="flex items-center gap-3">
        <Users className="h-8 w-8 text-emerald-600" />
        <h1 className="text-2xl font-bold text-emerald-900">Staff Management</h1>
      </div>
      
      <Card className="border-emerald-200 shadow-sm">
        <CardHeader className="bg-emerald-100/50 border-b border-emerald-200">
          <div className="flex items-center justify-between">
            <CardTitle className="text-emerald-800">Staff Directory</CardTitle>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Add New Staff
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-emerald-50">
              <TableRow>
                <TableHead className="text-emerald-800">Name</TableHead>
                <TableHead className="text-emerald-800">Email</TableHead>
                <TableHead className="text-emerald-800">Role</TableHead>
                <TableHead className="text-emerald-800">Department</TableHead>
                <TableHead className="text-emerald-800">Status</TableHead>
                <TableHead className="text-emerald-800 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffData.map((staff) => (
                <TableRow key={staff.id} className="hover:bg-emerald-50/50">
                  <TableCell className="font-medium">{staff.name}</TableCell>
                  <TableCell className="text-emerald-600">{staff.email}</TableCell>
                  <TableCell>{staff.role}</TableCell>
                  <TableCell>{staff.department}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        staff.status === "Active" 
                          ? "bg-emerald-100 text-emerald-800" 
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {staff.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default EditViewStaff