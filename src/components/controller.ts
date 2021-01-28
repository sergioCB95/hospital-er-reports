import Module from '../Module';
import ILogger from './logger/ILogger';
import IReportStore from './reportStore/IReportStore';
import IService from './service/IService';

const controller = (): Module<any> => {
  const start = async (service: IService): Promise<any> => {
    await service.calcER();
    /*
    const days = reportStore.getDays();
    const erRooms = reportStore.getErRooms();
    const employees = reportStore.getEmployeeList();
    const erDayScheduleList = days.map((day): ErDaySchedule => ({
      day,
      roomSchedule: erRooms.map((room): ErRoomSchedule => ({
        room,
        employees: employees.filter((employee) => employee.erDays
          .some((erDay) => erDay.day.numberDay === day.numberDay && erDay.erRoom === room.id)),
      })),
    }));
    reportStore.saveErSchedule(erDayScheduleList);
    await reportStore.saveOutput();
   */
  };

  return {
    start,
  };
};

export default controller;
