import { Application } from "@/app/api/applications"; // Adjust the path as needed

declare global {
  var applications: Application[];  // Declare global.applications
}
