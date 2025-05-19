import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "@/lib/utils";
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";

// Login schema
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  role: z.enum(["Patient", "HospitalAdministrator", "Receptionist", "Doctor", "Triage", "LabTechnician", "Pharmacist"], 
    { required_error: "Role is required" }
  ),
});

// Signup schemas
const personalInfoSchema = z.object({
  faydaID: z.string().min(1, "Fayda ID is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.date(),
  gender: z.enum(["Male", "Female", "Other"]),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const contactInfoSchema = z.object({
  contactNumber: z.string().min(10, "Valid phone number is required").max(15),
  address: z.string().min(1, "Address is required"),
  emergencyContact: z.object({
    name: z.string().min(1, "Emergency contact name is required"),
    relation: z.string().min(1, "Relation is required"),
    phone: z.string().min(10, "Valid emergency phone number is required"),
  }),
});

const medicalInfoSchema = z.object({
  medicalHistory: z.string().optional(),
});

function AuthCard() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);
  

  // Login form
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      role: undefined,
    },
  });

  // Signup forms
  const personalForm = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      faydaID: "",
      firstName: "",
      lastName: "",
      dateOfBirth: new Date(),
      gender: undefined,
      email: "",
      password: "",
    },
  });

  const contactForm = useForm({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: {
      contactNumber: "",
      address: "",
      emergencyContact: {
        name: "",
        relation: "",
        phone: "",
      },
    },
  });

  const medicalForm = useForm({
    resolver: zodResolver(medicalInfoSchema),
    defaultValues: {
      medicalHistory: "",
    },
  });

  const handleLogin = async (data) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: data.username,
          password: data.password,
          role: data.role,
        }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.msg || "Login failed");
      }
      const navigateToDashboard = (role) => {
  switch(role) {
    case "Patient":
      return "/user";
    case "Admin":
      return "/admin/dashboard";
    case "HospitalAdministrator":
      return "/hospital-admin/dashboard";
    case "Receptionist":
      return "/receptionist/registration";
    case "Doctor":
      return "/doctor/assigned-records";
    case "Triage":
      return "/triage/unassigned";
    case "LabTechnician":
      return "/laboratorist/patientList";
    default:
      return "/"; // Fallback to home for unknown roles
  }
};

// Usage in your code:
if (responseData.role === "Patient") {
  navigate("/user");
} else {
  navigate(navigateToDashboard(responseData.role));
}



      toast.success("Login successful");  
      
    } catch (error) {
      toast.error(error.message);
      console.error("Login Error:", error);
    }
  };

  const handleSignup = async () => {
    try {
      const personalData = personalForm.getValues();
      const contactData = contactForm.getValues();
      const medicalData = medicalForm.getValues();

      const patientData = {
        ...personalData,
        ...contactData,
        ...medicalData,
        dateOfBirth: format(personalData.dateOfBirth, "yyyy-MM-dd"),
        status: "Active"
      };

      const res = await fetch(`${BASE_URL}/user/register-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      toast.success("Registration successful!");
      setIsLogin(true);
      setStep(1);
    } catch (error) {
      toast.error(error.message);
      console.error("Registration Error:", error);
    }
  };

  const renderLoginForm = () => (
    <Form {...loginForm}>
      <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-6">
        <FormField
          control={loginForm.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your username" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={loginForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} placeholder="••••••••" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={loginForm.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Patient">User</SelectItem>
                  <SelectItem value="HospitalAdministrator">Hospital Admin</SelectItem>
                  <SelectItem value="Receptionist">Receptionist</SelectItem>
                  <SelectItem value="Doctor">Doctor</SelectItem>
                  <SelectItem value="Triage">Triage</SelectItem>
                  <SelectItem value="LabTechnician">Lab Technician</SelectItem>
                  <SelectItem value="Pharmacist">Pharmacist</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </form>
    </Form>
  );

  const renderSignupForm = () => (
    <>
      {step === 1 && (
        <Form {...personalForm}>
          <form onSubmit={personalForm.handleSubmit(() => setStep(2))} className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
            
            <FormField
              control={personalForm.control}
              name="faydaID"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fayda ID</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter Fayda ID" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={personalForm.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="First name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={personalForm.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Last name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={personalForm.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline">
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={personalForm.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={personalForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} placeholder="example@gmail.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={personalForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} placeholder="••••••••" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsLogin(true)}
              >
                Back to Login
              </Button>
              <Button type="submit">Next: Contact Info</Button>
            </div>
          </form>
        </Form>
      )}

      {step === 2 && (
        <Form {...contactForm}>
          <form onSubmit={contactForm.handleSubmit(() => setStep(3))} className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
            
            <FormField
              control={contactForm.control}
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="+251..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={contactForm.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Full address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h4 className="font-medium">Emergency Contact</h4>
              <FormField
                control={contactForm.control}
                name="emergencyContact.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Emergency contact name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={contactForm.control}
                name="emergencyContact.relation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relation</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Relationship to patient" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={contactForm.control}
                name="emergencyContact.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Emergency phone number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button type="submit">Next: Medical Info</Button>
            </div>
          </form>
        </Form>
      )}

      {step === 3 && (
        <Form {...medicalForm}>
          <form onSubmit={medicalForm.handleSubmit(handleSignup)} className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Medical Information</h3>
            
            <FormField
              control={medicalForm.control}
              name="medicalHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medical History (Optional)</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      className="flex w-full rounded-md border border-input px-3 py-2 text-sm min-h-[100px]"
                      placeholder="Any known medical conditions, allergies, etc."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(2)}
              >
                Back
              </Button>
              <Button type="submit">Complete Registration</Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );

  return (
    <div className="w-full max-w-lg p-10 bg-white rounded-2xl shadow-lg">
      <h2 className="text-4xl font-bold text-[#04353D] mb-8 text-center">
        {isLogin ? "Welcome Back!" : "Create Your Account"}
      </h2>

      {isLogin ? renderLoginForm() : renderSignupForm()}

      <div className="mt-6 text-center">
        {isLogin ? (
          <p className="text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => {
                setIsLogin(false);
                setStep(1);
              }}
              className="text-[#5AC5C8] font-semibold hover:underline"
            >
              Sign Up
            </button>
          </p>
        ) : step === 1 && (
          <p className="text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => setIsLogin(true)}
              className="text-[#5AC5C8] font-semibold hover:underline"
            >
              Log In
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

export default AuthCard;