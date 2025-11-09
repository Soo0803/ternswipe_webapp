import React, { createContext, useContext, useState, ReactNode } from 'react';

type FormData = {
  given_name: string;
  middle_name: string;
  last_name: string;
  nationality: string;
  age: string;
  language: string;
  graduation_year: string;
  major_chosen: string;
  location: string;
  phone_number: string;
  transcript: File | null;
  resume: File | null;
  username: string;
  email: string;
  password: string;
  // Algorithm-required fields
  headline: string;
  summary: string;
  courses: string[]; // List of courses
  skills: string[]; // List of skills
  skills_text: string; // Text description of skills
  gpa: string; // GPA as string (will be normalized on backend)
  hrs_per_week: string; // Hours available per week
  avail_start: string; // Availability start date (ISO format)
  avail_end: string; // Availability end date (ISO format)
  reliability?: string; // Optional reliability score
};

type StudentFormContextType = {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
};

const StudentFormContext = createContext<StudentFormContextType | undefined>(undefined);

export const useStudentForm = () => {
  const context = useContext(StudentFormContext);
  if (!context) {
    throw new Error('useStudentForm must be used within a StudentFormProvider');
  }
  return context;
};

type Props = {
  children: ReactNode;
};

export const StudentFormProvider = ({ children }: Props) => {
  const [formData, setFormData] = useState<FormData>({
    given_name: '',
    middle_name: '',
    last_name: '',
    nationality: '',
    age: '',
    language: '',
    graduation_year: '',
    major_chosen: '',
    location: '',
    phone_number: '',
    username: '',
    email: '',
    password: '',
    transcript: null,
    resume: null,
    // Algorithm fields
    headline: '',
    summary: '',
    courses: [],
    skills: [],
    skills_text: '',
    gpa: '',
    hrs_per_week: '',
    avail_start: '',
    avail_end: '',
    reliability: '',
  });

  return (
    <StudentFormContext.Provider value={{ formData, setFormData }}>
      {children}
    </StudentFormContext.Provider>
  );
};