import { NextResponse } from 'next/server';
import { Application } from '../../applications'; // Adjust the path as needed

// Ensure the global applications array is correctly initialized
globalThis.applications = globalThis.applications || [];

// Access the global applications array
const applications: Application[] = globalThis.applications;

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    // Extract the dynamic id from params
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Application ID is missing' }, { status: 400 });
    }

    // Convert the id to a number
    const applicationId = parseInt(id, 10);

    // Find the application by its ID
    const application = applications.find((app) => app.id === applicationId);

    // If the application is not found, return 404
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Log the application data
    console.log('Application Data:', application);

    // Return the found application
    return NextResponse.json({ message: 'Application retrieved successfully', application }, { status: 200 });
  } catch (error) {
    console.error('Error retrieving application:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
