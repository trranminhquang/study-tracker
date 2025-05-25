import { SiteHandler } from "./site.interface";
import { KhanAcademyHandler } from "./khanacademy";
import { W3SchoolsHandler } from "./w3schools";

export const siteHandlers: SiteHandler[] = [
  new KhanAcademyHandler(),
  new W3SchoolsHandler(),
];
