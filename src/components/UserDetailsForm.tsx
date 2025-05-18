
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format, parse, isValid } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface UserFormData {
  name: string;
  parentName: string;
  age: number;
  dob: Date | null;
}

interface UserDetailsFormProps {
  onFormSubmit: (data: UserFormData) => void;
}

const UserDetailsForm: React.FC<UserDetailsFormProps> = ({ onFormSubmit }) => {
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    parentName: "",
    age: 0,
    dob: null,
  });
  
  const [dobInputValue, setDobInputValue] = useState<string>("");
  const [errors, setErrors] = useState<Partial<Record<keyof UserFormData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "age") {
      const ageValue = parseInt(value);
      setFormData({ ...formData, [name]: isNaN(ageValue) ? 0 : ageValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error when user types
    if (errors[name as keyof UserFormData]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData({ ...formData, dob: date });
      setDobInputValue(format(date, "yyyy-MM-dd"));
      
      // Calculate age based on DOB
      calculateAge(date);
      
      if (errors.dob) {
        setErrors({ ...errors, dob: undefined });
      }
    }
  };
  
  const handleDobInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDobInputValue(value);
    
    // Try to parse the date from the input value
    try {
      const parsedDate = parse(value, "yyyy-MM-dd", new Date());
      if (isValid(parsedDate) && parsedDate <= new Date()) {
        setFormData({ ...formData, dob: parsedDate });
        calculateAge(parsedDate);
        
        if (errors.dob) {
          setErrors({ ...errors, dob: undefined });
        }
      }
    } catch (error) {
      console.log("Invalid date format");
    }
  };
  
  const calculateAge = (date: Date) => {
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const m = today.getMonth() - date.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
      age--;
    }
    setFormData(prev => ({ ...prev, age }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserFormData, string>> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.parentName.trim()) {
      newErrors.parentName = "Parent name is required";
    }
    
    if (formData.age <= 0) {
      newErrors.age = "Age must be greater than 0";
    }
    
    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onFormSubmit(formData);
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">User Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="Enter full name"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="parentName">Parent's Name</Label>
            <Input 
              id="parentName" 
              name="parentName" 
              value={formData.parentName} 
              onChange={handleChange} 
              placeholder="Enter parent's name"
              className={errors.parentName ? "border-red-500" : ""}
            />
            {errors.parentName && <p className="text-sm text-red-500">{errors.parentName}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <div className="flex space-x-2">
                <Input
                  id="dob"
                  name="dob"
                  type="date"
                  value={dobInputValue}
                  onChange={handleDobInputChange}
                  className={errors.dob ? "border-red-500" : ""}
                  max={format(new Date(), "yyyy-MM-dd")}
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("px-3", errors.dob ? "border-red-500" : "")}
                    >
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.dob || undefined}
                      onSelect={handleDateChange}
                      disabled={(date) =>
                        date > new Date()
                      }
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {errors.dob && <p className="text-sm text-red-500">{errors.dob}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input 
                id="age" 
                name="age" 
                type="number" 
                value={formData.age || ''} 
                onChange={handleChange} 
                placeholder="Age"
                className={errors.age ? "border-red-500" : ""}
                readOnly
              />
              {errors.age && <p className="text-sm text-red-500">{errors.age}</p>}
            </div>
          </div>

          <Separator className="my-4" />
          
          <Button type="submit" className="w-full">
            Continue to Measurement
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserDetailsForm;
