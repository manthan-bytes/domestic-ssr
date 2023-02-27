import { CourseData } from './race-data.interface';
export interface MapCourseDataClass {
  data: MapData;
}
interface MapData {
  fetchRaceByIdOrSlug: MapCourseData;
}
export interface MapCourseData extends CourseData {
  isBlackLoopSelected: boolean;
  start_date: string;
  alias: string;
  showPdf: boolean;
  showBlackLoopToggle: boolean;
  legsDistances: { showBlackLoopToggle: boolean };
}
