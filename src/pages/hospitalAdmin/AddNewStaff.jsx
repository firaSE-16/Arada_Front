"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BASE_URL } from "@/lib/utils";
import { toast } from "react-toastify";
import ImageUpload from "@/components/ImageUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import getUser from "@/lib/getUser";

const staffSchema = z
  .object({
    role: z.enum(["Doctor", "LabTechnician", "Pharmacist", "Receptionist", "Triage"], {
      required_error: "Please select a role",
    }),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    profilePhoto: z.string().min(1, "Profile Photo is required"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    gender: z.enum(["Male", "Female", "Other"], {
      required_error: "Gender is required",
    }),
    contactNumber: z.string().optional(),
    address: z.string().optional(),
    specialization: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (["Doctor", "LabTechnician", "Pharmacist", "Receptionist", "Triage"].includes(data.role)) {
      if (!data.contactNumber || data.contactNumber.length < 10) {
        ctx.addIssue({
          path: ["contactNumber"],
          code: z.ZodIssueCode.custom,
          message: "Contact number must be at least 10 digits",
        });
      }
      if (!data.address) {
        ctx.addIssue({
          path: ["address"],
          code: z.ZodIssueCode.custom,
          message: "Address is required",
        });
      }
    }
    if (data.role === "Doctor" && !data.specialization) {
      ctx.addIssue({
        path: ["specialization"],
        code: z.ZodIssueCode.custom,
        message: "Specialization is required",
      });
    }
  });

export default function AddStaffForm() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      role: "",
      firstName: "",
      lastName: "",
      email: "",
      profilePhoto: "",
      password: "",
      dateOfBirth: "",
      gender: "",
      contactNumber: "",
      address: "",
      specialization: "",
    },
  });

  const selectedRole = useWatch({
    control: form.control,
    name: "role",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      if (user && user.role === "HospitalAdministrator") {
        setCurrentUser(user);
      }
    };
    fetchUser();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const staffData = {
        ...data,
        ...(data.role !== "Doctor" && { specialization: undefined }),
      };

      const response = await fetch(`${BASE_URL}/hospital-admin/add-staff`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(staffData),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add staff");
      }

      toast.success(`${data.role} added successfully!`);
      form.reset();
    } catch (error) {
      console.error("Error adding staff:", error);
      toast.error(error.message || "Failed to add staff");
    } finally {
      setLoading(false);
    }
  };

  const renderRoleSpecificFields = () => {
    if (!selectedRole) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <FormField
          control={form.control}
          name="contactNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-emerald-800">Contact Number</FormLabel>
              <FormControl>
                <Input 
                  placeholder="+251912345678" 
                  {...field} 
                  className="border-emerald-200 focus:ring-emerald-300"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-emerald-800">Address</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Full address" 
                  {...field} 
                  className="border-emerald-200 focus:ring-emerald-300"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {selectedRole === "Doctor" && (
          <FormField
            control={form.control}
            name="specialization"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-emerald-800">Specialization</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. Cardiology" 
                    {...field} 
                    className="border-emerald-200 focus:ring-emerald-300"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 p-6 bg-emerald-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-emerald-900 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Add New Staff Member
        </h1>
        
        <Card className="mt-6 border-emerald-100 shadow-sm">
          <CardHeader className="bg-emerald-100/50 border-b border-emerald-200">
            <CardTitle className="text-emerald-800">Staff Information</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Basic Info */}
                  <div className="space-y-6">
                    {/* Role Selection */}
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-emerald-800">Role</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-emerald-200 focus:ring-emerald-300">
                                <SelectValue placeholder="Select staff role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="border-emerald-200">
                              <SelectItem value="Doctor" className="hover:bg-emerald-50">Doctor</SelectItem>
                              <SelectItem value="LabTechnician" className="hover:bg-emerald-50">Lab Technician</SelectItem>
                              <SelectItem value="Pharmacist" className="hover:bg-emerald-50">Pharmacist</SelectItem>
                              <SelectItem value="Receptionist" className="hover:bg-emerald-50">Receptionist</SelectItem>
                              <SelectItem value="Triage" className="hover:bg-emerald-50">Triage</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {["firstName", "lastName", "email", "password", "dateOfBirth"].map((fieldName) => (
                        <FormField
                          key={fieldName}
                          control={form.control}
                          name={fieldName}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-emerald-800">
                                {fieldName.replace(/([A-Z])/g, " $1")}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type={fieldName === "password" ? "password" : 
                                       fieldName === "email" ? "email" : 
                                       fieldName === "dateOfBirth" ? "date" : "text"}
                                  placeholder={fieldName}
                                  {...field}
                                  className="border-emerald-200 focus:ring-emerald-300"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}

                      {/* Gender Select */}
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-emerald-800">Gender</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="border-emerald-200 focus:ring-emerald-300">
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="border-emerald-200">
                                <SelectItem value="Male" className="hover:bg-emerald-50">Male</SelectItem>
                                <SelectItem value="Female" className="hover:bg-emerald-50">Female</SelectItem>
                                <SelectItem value="Other" className="hover:bg-emerald-50">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Conditional Fields */}
                    {renderRoleSpecificFields()}
                  </div>

                  {/* Right Column - Profile Photo */}
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="profilePhoto"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-emerald-800">Profile Photo</FormLabel>
                          <div className="border-2 border-dashed border-emerald-200 rounded-lg p-6 flex flex-col items-center justify-center h-full">
                            <FormControl>
                              <ImageUpload 
                                onChange={field.onChange} 
                                value={field.value}
                                className="w-full h-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Adding Staff...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        Add Staff Member
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}