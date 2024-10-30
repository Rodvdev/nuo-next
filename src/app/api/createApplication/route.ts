import { NextResponse } from 'next/server';
import { Application } from '../applications'; // Adjust the path based on your project structure

// Ensure global.applications is initialized correctly
globalThis.applications = globalThis.applications || [];

// Access the global applications array
const applications: Application[] = globalThis.applications;

export async function POST(req: Request) {
  try {
    const { formData } = await req.json(); // Parse the incoming request body

    if (!formData) {
      return NextResponse.json({ error: 'Missing formData' }, { status: 400 });
    }

    // Create a new application with an auto-generated ID
    const newApplication: Application = {
      id: applications.length + 1, // Incrementing the id
      formData, // Store the form data
      createdAt: new Date(),
    };

    // Save the application in the global "database"
    applications.push(newApplication);

    // Return a successful response
    return NextResponse.json({ message: 'Application created successfully', application: newApplication }, { status: 201 });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
