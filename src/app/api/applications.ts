import { FormData } from "@/types/types"; // Adjust the path to your FormData type

// Define the Application interface
export interface Application {
  id: number;
  formData: FormData;
  createdAt: Date;
}

// Initialize the global applications array if it doesn't exist
global.applications = global.applications || [];

// Export the global applications array, typed correctly as Application[]
export const applications: Application[] = global.applications;
