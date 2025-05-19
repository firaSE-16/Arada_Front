import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Button } from "../../components/ui/button"
import { Eye, FileText, Users } from "lucide-react"

const ViewRecords = () => {
  // Sample patient data
  const patientData = [
    {
      id: "P097777",
      name: "Abdi Abdi",
      age: 45,
      gender: "Male",
      lastVisit: "2024-12-31",
      doctor: "Dr. John Smith",
    },
    {
      id: "P097778",
      name: "Sarah Johnson",
      age: 32,
      gender: "Female",
      lastVisit: "2024-12-30",
      doctor: "Dr. Mary Williams",
    },
    {
      id: "P097779",
      name: "James Wilson",
      age: 28,
      gender: "Male",
      lastVisit: "2024-12-29",
      doctor: "Dr. Robert Brown",
    },
    {
      id: "P097780",
      name: "Emily Davis",
      age: 56,
      gender: "Female",
      lastVisit: "2024-12-28",
      doctor: "Dr. Sarah Williams",
    },
  ]

  return (
    <div className="space-y-6 p-6 bg-emerald-50 min-h-screen">
      <div className="flex items-center gap-3">
        <Users className="h-8 w-8 text-emerald-600" />
        <h1 className="text-2xl font-bold text-emerald-900">Patient Records</h1>
      </div>

      <Card className="border-emerald-200 shadow-sm">
        <CardHeader className="bg-emerald-100/50 border-b border-emerald-200">
          <CardTitle className="text-emerald-800">Patient Information</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-emerald-50">
              <TableRow>
                <TableHead className="text-emerald-800">Patient ID</TableHead>
                <TableHead className="text-emerald-800">Name</TableHead>
                <TableHead className="text-emerald-800">Age</TableHead>
                <TableHead className="text-emerald-800">Gender</TableHead>
                <TableHead className="text-emerald-800">Last Visit</TableHead>
                <TableHead className="text-emerald-800">Doctor</TableHead>
                <TableHead className="text-emerald-800 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patientData.map((patient) => (
                <TableRow key={patient.id} className="hover:bg-emerald-50/50">
                  <TableCell className="font-medium">{patient.id}</TableCell>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      patient.gender === "Male" 
                        ? "bg-blue-100 text-blue-800" 
                        : "bg-pink-100 text-pink-800"
                    }`}>
                      {patient.gender}
                    </span>
                  </TableCell>
                  <TableCell>{patient.lastVisit}</TableCell>
                  <TableCell>{patient.doctor}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        History
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

export default ViewRecords