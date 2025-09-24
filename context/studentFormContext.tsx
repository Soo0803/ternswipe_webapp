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
  });

  return (
    <StudentFormContext.Provider value={{ formData, setFormData }}>
      {children}
    </StudentFormContext.Provider>
  );
};