import { Employee } from '../../domain/Employee';
import { Day } from '../../domain/Day';
import { ErRoom } from '../../domain/ErRoom';
import { ErDaySchedule } from '../../domain/ErDaySchedule';

interface IReportStore {
  getEmployeeList: () => Employee[],
  getDays: () => Day[],
  getErRooms: () => ErRoom[],
  saveErSchedule: (erDayScheduleList :ErDaySchedule[]) => void,
  saveOutput: () => Promise<void>
}

export default IReportStore;
