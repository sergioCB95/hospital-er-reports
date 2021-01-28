import Survey from '../../domain/Survey';
import { ErDaySchedule } from '../../domain/ErDaySchedule';
import { Employee } from '../../domain/Employee';

interface IReportStore {
  saveEmployeesSchedule: (employees :Employee[], days: Date[]) => void,
  saveErSchedule: (erDayScheduleList :ErDaySchedule[]) => void,
  saveOutput: () => Promise<void>,
  getSurveyAnswers: () => Survey[]
}

export default IReportStore;
