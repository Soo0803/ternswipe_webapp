// context/companyFormContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

type ProjectInput = {
  title: string;
  description: string;
  modality?: string;
  location?: string;
  // Algorithm-required fields
  required_skills: string[]; // List of required skills
  hrs_per_week: string; // Hours required per week
  start_date: string; // Project start date (ISO format)
  end_date: string; // Project end date (ISO format)
  capacity: string; // Number of students needed
};

type CompanyFormData = {
  username: string;
  email: string;
  password: string;
  // Canonical professor fields
  professor_name: string;
  university: string;
  description: string;
  website: string;
  team_image: File | null;
  lab_first_image: File | null;
  lab_second_image: File | null;
  lab_third_image: File | null;
  position_description: string;
  // New: multiple projects to create on signup
  projects: ProjectInput[];
};

type CompanyFormContextType = {
  formData: CompanyFormData;
  setFormData: React.Dispatch<React.SetStateAction<CompanyFormData>>;
};

const CompanyFormContext = createContext<CompanyFormContextType | undefined>(undefined);

export const useCompanyForm = () => {
  const context = useContext(CompanyFormContext);
  if (!context) {
    throw new Error('useCompanyForm must be used within a CompanyFormProvider');
  }
  return context;
};

type Props = {
  children: ReactNode;
};

export const CompanyFormProvider = ({ children }: Props) => {
  const [formData, setFormData] = useState<CompanyFormData>({
    username: '',
    email: '',
    password: '',
    professor_name: '',
    university: '',
    description: '',
    website: '',
    team_image: null,
    lab_first_image: null,
    lab_second_image: null,
    lab_third_image: null,
    position_description: '',
    projects: [{
      title: '',
      description: '',
      required_skills: [],
      hrs_per_week: '',
      start_date: '',
      end_date: '',
      capacity: '1',
    }],
  });

  return (
    <CompanyFormContext.Provider value={{ formData, setFormData }}>
      {children}
    </CompanyFormContext.Provider>
  );
};