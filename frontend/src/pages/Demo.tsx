import { Navigate } from "react-router-dom";
import { demoProjects } from "../data/projects";

/** Old /demo URL: opens the first demo as a modal on the home page instead of a separate page. */
export default function DemoRedirect() {
  const first = demoProjects[0];
  return <Navigate to={first ? `/?demo=${first.slug}` : "/"} replace />;
}
