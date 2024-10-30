import { NextResponse } from 'next/server';
import { Application } from '../../applications'; // Ajusta la ruta según tu estructura

// Asegúrate de que el array global applications esté inicializado correctamente
globalThis.applications = globalThis.applications || [];

// Accede al array global applications
const applications: Application[] = globalThis.applications;

export async function GET(req: Request, context: { params: { id: string } }) {
  try {
    // Desenvuelve los params
    const { id } = await context.params;

    // Convierte el id a un número
    const applicationId = parseInt(id, 10);

    // Busca la aplicación por su ID
    const application = applications.find((app) => app.id === applicationId);

    // Si no se encuentra la aplicación, devuelve 404
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Muestra todos los datos de la aplicación en la consola
    console.log('Application Data:', application);

    // Devuelve la aplicación encontrada
    return NextResponse.json({ message: 'Application retrieved successfully', application }, { status: 200 });
  } catch (error) {
    console.error('Error retrieving application:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
