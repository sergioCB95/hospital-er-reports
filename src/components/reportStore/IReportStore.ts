import Survey from '../../domain/Survey';

interface IReportStore {
  /*
  getEmployeeList: () => Employee[],
  getDays: () => Day[],
  getErRooms: () => ErRoom[],
  saveErSchedule: (erDayScheduleList :ErDaySchedule[]) => void,
   */
  saveOutput: () => Promise<void>,
  getSurveyAnswers: () => Survey[]
}

export default IReportStore;
