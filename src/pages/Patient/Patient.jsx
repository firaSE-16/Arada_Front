import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Rating,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Tab,
  Tabs,
  Chip,
  useTheme,
  useMediaQuery,
  styled
} from "@mui/material";
import {
  MedicalInformation,
  Medication,
  Person,
  RateReview,
  LocalHospital,
  Favorite,
  MonitorHeart,
  MedicalServices,
  Assignment,
  Reviews,
  ContactEmergency
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const BASE_URL = "http://localhost:7500/api";

// Custom theme with #5AC5C8 as primary color
const theme = createTheme({
  palette: {
    primary: {
      main: '#5AC5C8',
      contrastText: '#fff',
    },
    secondary: {
      main: '#FF7E79',
    },
    background: {
      default: '#f8fafc',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
    },
  },
});

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.08)',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px 0 rgba(0,0,0,0.12)',
  },
}));

const StatusChip = styled(Chip)(({ status }) => ({
  backgroundColor: 
    status === "Emergency" ? '#FF5252' :
    status === "Active" ? '#4CAF50' :
    status === "In-Treatment" ? '#FF9800' :
    '#9E9E9E',
  color: '#fff',
  fontWeight: '600',
}));

const PatientDashboard = () => {
  const [patient, setPatient] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [review, setReview] = useState({
    rating: 5,
    comment: "",
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const navigate = useNavigate();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);
        
        // Get patient info
        const authRes = await fetch(`${BASE_URL}/auth/me`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!authRes.ok) {
          throw new Error("Failed to authenticate");
        }

        const authData = await authRes.json();
        const patientId = authData.userId;

        // Fetch all patient data in parallel
        const [patientRes, recordsRes, prescriptionsRes, doctorRes] =
          await Promise.all([
            fetch(`${BASE_URL}/user/${patientId}`, {
              credentials: "include",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }),
            fetch(`${BASE_URL}/user/${patientId}/medical-records`, {
              credentials: "include",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }),
            fetch(`${BASE_URL}/user/${patientId}/prescriptions`, {
              credentials: "include",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }),
            fetch(`${BASE_URL}/user/${patientId}/doctor`, {
              credentials: "include",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }),
          ]);

        // Check all responses
        if (!patientRes.ok) throw new Error("Failed to fetch patient data");
        if (!recordsRes.ok) throw new Error("Failed to fetch medical records");
        if (!prescriptionsRes.ok)
          throw new Error("Failed to fetch prescriptions");

        const patientData = await patientRes.json();
        const recordsData = await recordsRes.json();
        const prescriptionsData = await prescriptionsRes.json();
        const doctorData = doctorRes.ok ? await doctorRes.json() : null;

        setPatient(patientData);
        setMedicalRecords(recordsData);
        setPrescriptions(prescriptionsData);
        setDoctor(doctorData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Error fetching patient data:", err);
      }
    };

    fetchPatientData();
  }, []);

  const handleReviewSubmit = async () => {
    if (!doctor || !review.rating) return;

    try {
      setSubmittingReview(true);
      const response = await fetch(
        `${BASE_URL}/user/${patient._id}/reviews`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            doctorId: doctor._id,
            rating: review.rating,
            comment: review.comment,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      const updatedDoctor = await response.json();
      setDoctor(updatedDoctor);
      setReview({ rating: 5, comment: "" });
      setSubmittingReview(false);
    } catch (err) {
      setError(err.message);
      setSubmittingReview(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress size={60} color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ borderRadius: '12px' }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!patient) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning" sx={{ borderRadius: '12px' }}>
          Patient data not found
        </Alert>
      </Container>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Patient Profile Header */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            mb: 4, 
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #5AC5C8 0%, #88D8E0 100%)',
            color: 'white',
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3} display="flex" justifyContent={isMobile ? "center" : "flex-start"}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  fontSize: 48,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  mb: 2,
                  border: '3px solid white',
                }}
              >
                {patient.firstName.charAt(0)}
                {patient.lastName.charAt(0)}
              </Avatar>
            </Grid>
            <Grid item xs={12} md={9}>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                {patient.firstName} {patient.lastName}
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={2} alignItems="center" mb={2}>
                <Chip 
                  label={patient.gender} 
                  sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    fontWeight: 600 
                  }} 
                />
                <Chip 
                  label={`${patient.age} years`} 
                  sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    fontWeight: 600 
                  }} 
                />
                {patient.bloodGroup && (
                  <Chip 
                    label={`Blood Group: ${patient.bloodGroup}`} 
                    sx={{ 
                      backgroundColor: 'rgba(255,255,255,0.2)', 
                      color: 'white',
                      fontWeight: 600 
                    }} 
                  />
                )}
                <StatusChip 
                  label={patient.status} 
                  status={patient.status}
                  size="small"
                />
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <ContactEmergency sx={{ mr: 1 }} />
                    <Typography variant="subtitle1">
                      <strong>Fayda ID:</strong> {patient.faydaID}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Person sx={{ mr: 1 }} />
                    <Typography variant="subtitle1">
                      <strong>Contact:</strong> {patient.contactNumber}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">
                    <strong>Emergency Contact:</strong> {patient.emergencyContact.name} ({patient.emergencyContact.relation}) - {patient.emergencyContact.phone}
                  </Typography>
                </Grid>
                {patient.medicalHistory && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      <strong>Medical History:</strong> {patient.medicalHistory}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StyledCard>
              <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <MedicalInformation />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Medical Records
                  </Typography>
                  <Typography variant="h5" fontWeight={600}>
                    {medicalRecords.length}
                  </Typography>
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StyledCard>
              <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                  <Medication />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Prescriptions
                  </Typography>
                  <Typography variant="h5" fontWeight={600}>
                    {prescriptions.length}
                  </Typography>
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StyledCard>
              <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <MonitorHeart />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Current Status
                  </Typography>
                  <Typography variant="h5" fontWeight={600}>
                    {patient.status}
                  </Typography>
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StyledCard>
              <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <MedicalServices />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Assigned Doctor
                  </Typography>
                  <Typography variant="h5" fontWeight={600}>
                    {doctor ? 'Yes' : 'None'}
                  </Typography>
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>

        {/* Main Content Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons="auto"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab
              label="Medical Records"
              icon={<MedicalInformation />}
              iconPosition="start"
              sx={{ minHeight: 60 }}
            />
            <Tab 
              label="Prescriptions" 
              icon={<Medication />} 
              iconPosition="start" 
              sx={{ minHeight: 60 }}
            />
            <Tab 
              label="Doctor" 
              icon={<Person />} 
              iconPosition="start" 
              sx={{ minHeight: 60 }}
            />
            {doctor && (
              <Tab 
                label="Review Doctor" 
                icon={<RateReview />} 
                iconPosition="start" 
                sx={{ minHeight: 60 }}
              />
            )}
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box sx={{ pt: 2 }}>
          {/* Medical Records Tab */}
          {activeTab === 0 && (
            <Box>
              <Typography variant="h5" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <MedicalInformation sx={{ mr: 1, color: 'primary.main' }} />
                Medical Records
              </Typography>
              {medicalRecords.length === 0 ? (
                <StyledCard>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Assignment sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      No medical records found
                    </Typography>
                  </CardContent>
                </StyledCard>
              ) : (
                <Grid container spacing={3}>
                  {medicalRecords.map((record) => (
                    <Grid item xs={12} key={record._id}>
                      <StyledCard>
                        <CardHeader
                          avatar={
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              <LocalHospital />
                            </Avatar>
                          }
                          title={
                            <Typography variant="h6">
                              {"Arada Hospital"}
                            </Typography>
                          }
                          subheader={
                            <Box display="flex" alignItems="center" mt={0.5}>
                              <Chip 
                                label={record.status} 
                                size="small" 
                                sx={{ 
                                  backgroundColor: 
                                    record.status === "Emergency" ? '#FF5252' :
                                    record.status === "Completed" ? '#4CAF50' :
                                    '#5AC5C8',
                                  color: 'white',
                                  mr: 1
                                }} 
                              />
                              <Typography variant="body2" color="text.secondary">
                                {new Date(record.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                          }
                        />
                        <CardContent>
                          <Grid container spacing={2}>
                            {record.currentDoctor && (
                              <Grid item xs={12} sm={6}>
                                <Box display="flex" alignItems="center">
                                  <Avatar 
                                    sx={{ 
                                      width: 40, 
                                      height: 40, 
                                      mr: 2,
                                      bgcolor: 'primary.light'
                                    }}
                                  >
                                    {record.currentDoctor.firstName.charAt(0)}
                                  </Avatar>
                                  <Box>
                                    <Typography variant="subtitle1" fontWeight={500}>
                                      Dr. {record.currentDoctor.firstName} {record.currentDoctor.lastName}
                                    </Typography>
                                    <Typography variant="body2" color="primary.main">
                                      {record.currentDoctor.specialization}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>
                            )}
                            {record.triageData && (
                              <>
                                <Grid item xs={12}>
                                  <Divider sx={{ my: 1 }} />
                                  <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <MonitorHeart sx={{ mr: 1, color: 'secondary.main' }} />
                                    Triage Information
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <Typography variant="subtitle2" fontWeight={500} gutterBottom>
                                    Chief Complaint
                                  </Typography>
                                  <Paper 
                                    variant="outlined" 
                                    sx={{ 
                                      p: 2, 
                                      mb: 2, 
                                      borderRadius: '8px',
                                      backgroundColor: 'background.paper'
                                    }}
                                  >
                                    {record.triageData.chiefComplaint}
                                  </Paper>
                                  
                                  <Box display="flex" alignItems="center" mb={2}>
                                    <Typography variant="subtitle2" fontWeight={500} sx={{ mr: 1 }}>
                                      Urgency:
                                    </Typography>
                                    <Chip 
                                      label={record.triageData.urgency} 
                                      size="small"
                                      sx={{ 
                                        backgroundColor: 
                                          record.triageData.urgency === "Emergency" ? '#FF5252' :
                                          record.triageData.urgency === "High" ? '#FF9800' :
                                          '#5AC5C8',
                                        color: 'white'
                                      }} 
                                    />
                                  </Box>
                                  
                                  {record.triageData.staffID && (
                                    <Box display="flex" alignItems="center">
                                      <Avatar 
                                        sx={{ 
                                          width: 32, 
                                          height: 32, 
                                          mr: 1,
                                          bgcolor: 'primary.light',
                                          fontSize: 14
                                        }}
                                      >
                                        {record.triageData.staffID.firstName.charAt(0)}
                                      </Avatar>
                                      <Typography variant="body2">
                                        {record.triageData.staffID.firstName} {record.triageData.staffID.lastName}
                                      </Typography>
                                    </Box>
                                  )}
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <Typography variant="subtitle2" fontWeight={500} gutterBottom>
                                    Vitals
                                  </Typography>
                                  <Paper 
                                    variant="outlined" 
                                    sx={{ 
                                      p: 2, 
                                      borderRadius: '8px',
                                      backgroundColor: 'background.paper'
                                    }}
                                  >
                                    <Grid container spacing={1}>
                                      {record.triageData.vitals.bloodPressure && (
                                        <Grid item xs={6}>
                                          <Typography variant="body2">
                                            <strong>BP:</strong> {record.triageData.vitals.bloodPressure}
                                          </Typography>
                                        </Grid>
                                      )}
                                      {record.triageData.vitals.heartRate && (
                                        <Grid item xs={6}>
                                          <Typography variant="body2">
                                            <strong>HR:</strong> {record.triageData.vitals.heartRate} bpm
                                          </Typography>
                                        </Grid>
                                      )}
                                      {record.triageData.vitals.temperature && (
                                        <Grid item xs={6}>
                                          <Typography variant="body2">
                                            <strong>Temp:</strong> {record.triageData.vitals.temperature}°C
                                          </Typography>
                                        </Grid>
                                      )}
                                      {record.triageData.vitals.oxygenSaturation && (
                                        <Grid item xs={6}>
                                          <Typography variant="body2">
                                            <strong>SpO2:</strong> {record.triageData.vitals.oxygenSaturation}%
                                          </Typography>
                                        </Grid>
                                      )}
                                    </Grid>
                                  </Paper>
                                </Grid>
                              </>
                            )}
                            {record.doctorNotes && (
                              <>
                                <Grid item xs={12}>
                                  <Divider sx={{ my: 1 }} />
                                  <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <MedicalInformation sx={{ mr: 1, color: 'primary.main' }} />
                                    Doctor's Notes
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <Typography variant="subtitle2" fontWeight={500} gutterBottom>
                                    Diagnosis
                                  </Typography>
                                  <Paper 
                                    variant="outlined" 
                                    sx={{ 
                                      p: 2, 
                                      mb: 2, 
                                      borderRadius: '8px',
                                      backgroundColor: 'background.paper'
                                    }}
                                  >
                                    {record.doctorNotes.diagnosis || "Not specified"}
                                  </Paper>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <Typography variant="subtitle2" fontWeight={500} gutterBottom>
                                    Treatment Plan
                                  </Typography>
                                  <Paper 
                                    variant="outlined" 
                                    sx={{ 
                                      p: 2, 
                                      borderRadius: '8px',
                                      backgroundColor: 'background.paper'
                                    }}
                                  >
                                    {record.doctorNotes.treatmentPlan || "Not specified"}
                                  </Paper>
                                </Grid>
                              </>
                            )}
                          </Grid>
                        </CardContent>
                      </StyledCard>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}

          {/* Prescriptions Tab */}
          {activeTab === 1 && (
            <Box>
              <Typography variant="h5" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <Medication sx={{ mr: 1, color: 'primary.main' }} />
                Prescriptions
              </Typography>
              {prescriptions.length === 0 ? (
                <StyledCard>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <MedicalServices sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      No prescriptions found
                    </Typography>
                  </CardContent>
                </StyledCard>
              ) : (
                <Grid container spacing={3}>
                  {prescriptions.map((prescription) => (
                    <Grid item xs={12} sm={6} lg={4} key={prescription._id}>
                      <StyledCard sx={{
                        borderLeft: prescription.isFilled ? '4px solid #4CAF50' : '4px solid #FF9800'
                      }}>
                        <CardHeader
                          avatar={
                            <Avatar sx={{ bgcolor: 'secondary.light' }}>
                              <Medication />
                            </Avatar>
                          }
                          title={
                            <Typography variant="subtitle1" fontWeight={600}>
                              Prescribed by Dr. {prescription.doctorID.firstName} {prescription.doctorID.lastName}
                            </Typography>
                          }
                          subheader={
                            <Typography variant="body2" color="text.secondary">
                              {new Date(prescription.datePrescribed).toLocaleDateString()}
                            </Typography>
                          }
                          action={
                            <Chip 
                              label={prescription.isFilled ? 'Filled' : 'Pending'} 
                              size="small"
                              sx={{ 
                                backgroundColor: prescription.isFilled ? '#4CAF50' : '#FF9800',
                                color: 'white'
                              }} 
                            />
                          }
                        />
                        <CardContent>
                          <List disablePadding>
                            {prescription.medicineList.map((medicine, index) => (
                              <ListItem 
                                key={index} 
                                disableGutters
                                sx={{
                                  py: 1,
                                  borderBottom: index < prescription.medicineList.length - 1 ? '1px dashed rgba(0,0,0,0.1)' : 'none'
                                }}
                              >
                                <ListItemAvatar>
                                  <Avatar 
                                    sx={{ 
                                      width: 28, 
                                      height: 28, 
                                      bgcolor: 'primary.light',
                                      fontSize: 14
                                    }}
                                  >
                                    {index + 1}
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                  primary={
                                    <Typography fontWeight={500}>
                                      {medicine.name}
                                    </Typography>
                                  }
                                  secondary={
                                    <Box component="span">
                                      <Typography variant="body2" component="span">
                                        {medicine.dosage}
                                      </Typography>
                                      <Typography variant="body2" component="span" sx={{ mx: 1 }}>•</Typography>
                                      <Typography variant="body2" component="span">
                                        {medicine.frequency}
                                      </Typography>
                                      <Typography variant="body2" component="span" sx={{ mx: 1 }}>•</Typography>
                                      <Typography variant="body2" component="span">
                                        {medicine.duration}
                                      </Typography>
                                    </Box>
                                  }
                                />
                              </ListItem>
                            ))}
                          </List>
                        </CardContent>
                      </StyledCard>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}

          {/* Doctor Tab */}
          {activeTab === 2 && (
            <Box>
              <Typography variant="h5" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <Person sx={{ mr: 1, color: 'primary.main' }} />
                Assigned Doctor
              </Typography>
              {!doctor ? (
                <StyledCard>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                   
                    <Typography variant="h6" color="text.secondary">
                      No doctor currently assigned
                    </Typography>
                  </CardContent>
                </StyledCard>
              ) : (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={5}>
                    <StyledCard>
                      <CardContent>
                        <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" p={2}>
                          <Avatar
                            sx={{
                              width: 120,
                              height: 120,
                              fontSize: 48,
                              bgcolor: 'primary.main',
                              mb: 3,
                            }}
                          >
                            {doctor.firstName.charAt(0)}
                            {doctor.lastName.charAt(0)}
                          </Avatar>
                          <Typography variant="h5" fontWeight={600} gutterBottom>
                            Dr. {doctor.firstName} {doctor.lastName}
                          </Typography>
                          <Chip 
                            label={doctor.specialization} 
                            color="primary" 
                            sx={{ mb: 2 }} 
                          />
                          
                          <Box width="100%" mb={3}>
                            <Box display="flex" justifyContent="center" mb={1}>
                              <Rating
                                value={
                                  doctor.reviews.reduce(
                                    (acc, review) => acc + review.rating,
                                    0
                                  ) / doctor.reviews.length || 0
                                }
                                precision={0.1}
                                readOnly
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {doctor.reviews.length} reviews • {(
                                doctor.reviews.reduce(
                                  (acc, review) => acc + review.rating,
                                  0
                                ) / doctor.reviews.length || 0
                              ).toFixed(1)} average rating
                            </Typography>
                          </Box>
                          
                          <Box width="100%" textAlign="left">
                            <Box display="flex" alignItems="center" mb={2}>
                              <ContactEmergency sx={{ mr: 2, color: 'primary.main' }} />
                              <Typography>
                                <strong>Contact:</strong> {doctor.contactNumber}
                              </Typography>
                            </Box>
                            <Box display="flex" alignItems="flex-start" mb={2}>
                              <Assignment sx={{ mr: 2, color: 'primary.main' }} />
                              <Typography>
                                <strong>Address:</strong> {doctor.address}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </StyledCard>
                  </Grid>
                  <Grid item xs={12} md={7}>
                    <StyledCard>
                      <CardHeader 
                        title={
                          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                            <Reviews sx={{ mr: 1, color: 'primary.main' }} />
                            Patient Reviews
                          </Typography>
                        }
                      />
                      <CardContent sx={{ pt: 0 }}>
                        {doctor.reviews.length === 0 ? (
                          <Box textAlign="center" py={4}>
                            <Reviews sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                              No reviews yet
                            </Typography>
                          </Box>
                        ) : (
                          <List disablePadding>
                            {doctor.reviews.map((review, index) => (
                              <React.Fragment key={index}>
                                <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                                  <ListItemAvatar>
                                    <Avatar>
                                      {review.patientID?.firstName?.charAt(0) || "P"}
                                    </Avatar>
                                  </ListItemAvatar>
                                  <ListItemText
                                    primary={
                                      <Box>
                                        <Box display="flex" alignItems="center" mb={0.5}>
                                          <Rating
                                            value={review.rating}
                                            readOnly
                                            size="small"
                                          />
                                          <Typography
                                            component="span"
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ ml: 1 }}
                                          >
                                            {review.patientID
                                              ? `${review.patientID.firstName} ${review.patientID.lastName}`
                                              : "Anonymous"}
                                          </Typography>
                                        </Box>
                                        {review.comment && (
                                          <Paper 
                                            variant="outlined" 
                                            sx={{ 
                                              p: 2, 
                                              mt: 1,
                                              borderRadius: '8px',
                                              backgroundColor: 'background.paper'
                                            }}
                                          >
                                            <Typography variant="body2">
                                              {review.comment}
                                            </Typography>
                                          </Paper>
                                        )}
                                      </Box>
                                    }
                                  />
                                </ListItem>
                                {index < doctor.reviews.length - 1 && (
                                  <Divider variant="inset" component="li" />
                                )}
                              </React.Fragment>
                            ))}
                          </List>
                        )}
                      </CardContent>
                    </StyledCard>
                  </Grid>
                </Grid>
              )}
            </Box>
          )}

          {/* Review Doctor Tab */}
          {activeTab === 3 && doctor && (
            <Box>
              <Typography variant="h5" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <RateReview sx={{ mr: 1, color: 'primary.main' }} />
                Review Dr. {doctor.firstName} {doctor.lastName}
              </Typography>
              <StyledCard sx={{ maxWidth: 800, mx: 'auto' }}>
                <CardContent sx={{ p: 4 }}>
                  <Grid container spacing={4}>
                    <Grid item xs={12} md={5}>
                      <Box display="flex" flexDirection="column" alignItems="center">
                        <Avatar
                          sx={{
                            width: 100,
                            height: 100,
                            fontSize: 40,
                            bgcolor: 'primary.main',
                            mb: 3,
                          }}
                        >
                          {doctor.firstName.charAt(0)}
                          {doctor.lastName.charAt(0)}
                        </Avatar>
                        <Typography variant="h6" fontWeight={600} textAlign="center">
                          Dr. {doctor.firstName} {doctor.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" textAlign="center" mb={2}>
                          {doctor.specialization}
                        </Typography>
                        <Rating
                          value={
                            doctor.reviews.reduce(
                              (acc, review) => acc + review.rating,
                              0
                            ) / doctor.reviews.length || 0
                          }
                          precision={0.1}
                          readOnly
                          size="large"
                        />
                        <Typography variant="body2" color="text.secondary">
                          {doctor.reviews.length} reviews
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={7}>
                      <Box mb={3}>
                        <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                          How would you rate your experience?
                        </Typography>
                        <Rating
                          value={review.rating}
                          onChange={(event, newValue) => {
                            setReview({ ...review, rating: newValue });
                          }}
                          size="large"
                        />
                      </Box>
                      <Box mb={3}>
                        <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                          Share your feedback (optional)
                        </Typography>
                        <TextField
                          multiline
                          rows={4}
                          fullWidth
                          variant="outlined"
                          placeholder="How was your experience with this doctor?"
                          value={review.comment}
                          onChange={(e) =>
                            setReview({ ...review, comment: e.target.value })
                          }
                        />
                      </Box>
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        onClick={handleReviewSubmit}
                        disabled={submittingReview}
                        startIcon={
                          submittingReview ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            <Favorite />
                          )
                        }
                        sx={{ height: 48 }}
                      >
                        {submittingReview ? "Submitting..." : "Submit Review"}
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </StyledCard>
            </Box>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default PatientDashboard;