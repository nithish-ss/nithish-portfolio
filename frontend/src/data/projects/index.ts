import type { Project } from "../types";
import { project as olist } from "./olist-customer-satisfaction";
import { project as diner } from "./dannys-diner-sql";

// Order here is the display order and the previous/next order.
export const projects: Project[] = [olist, diner];
/** Projects that show an Interactive Demo button (those with a `demo` config). */
export const demoProjects = projects.filter((p) => p.demo);
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
