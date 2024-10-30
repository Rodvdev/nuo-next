import { NextRequest, NextResponse } from 'next/server';
import { applications } from '../../applications'; // Adjust the path to match where your applications array is defined

export async function GET(request: NextRequest) {
  const pathname = new URL(request.url).pathname;
  const id = pathname.split('/').pop(); // Extracts the last part of the path as 'id'

  // Validate if ID is provided
  if (!id) {
      return NextResponse.json({ message: 'ID not provided' }, { status: 400 });
  }

  const applicationId = parseInt(id, 10);

  // Validate if the ID is a valid number
  if (isNaN(applicationId)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
  }

  try {
      // Find the application by its ID in the applications array
      const application = applications.find(app => app.id === applicationId);

      // If no application is found, return 404
      if (!application) {
          return NextResponse.json({ message: 'Application not found' }, { status: 404 });
      }

      // Log the application data to the console
      console.log('Application Data:', application);

      // Return the application data if found
      return NextResponse.json(application, { status: 200 });
  } catch (error) {
      console.error('Error fetching application:', error);
      return NextResponse.json({ message: 'Error fetching application' }, { status: 500 });
  }
}
