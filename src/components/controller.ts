import Module from '../Module';
import IService from './service/IService';
import { ErDaySchedule, ErRoomSchedule } from '../domain/ErDaySchedule';
import IReportStore from './reportStore/IReportStore';

const controller = (): Module<any> => {
  const start = async (service: IService, reportStore: IReportStore): Promise<any> => {
    const employees = await service.calcER();
    const month = service.getMonth();
    const erRooms = service.getErRooms();
    const erDayScheduleList = month.map((day): ErDaySchedule => ({
      day,
      roomSchedule: erRooms.map((room): ErRoomSchedule => ({
        room,
        employees: employees.filter((employee) => employee.erDays
          .some((erDay) => erDay.day.getDate() === day.getDate() && erDay.erRoom.id === room.id)),
      })),
    }));
    reportStore.saveEmployeesSchedule(employees, month);
    reportStore.saveErSchedule(erDayScheduleList);
    await reportStore.saveOutput();
  };

  return {
    start,
  };
};

export default controller;
