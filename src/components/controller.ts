import Module from '../Module';
import IService from './service/IService';
import { ErDaySchedule, ErRoomSchedule } from '../domain/ErDaySchedule';
import IReportStore from './stores/reportStore/IReportStore';
import IDateStore from './stores/dateStore/IDateStore';
import IRoomStore from './stores/roomStore/IRoomStore';

const controller = (): Module<void> => {
  const start = async (
    service: IService, reportStore: IReportStore, dateStore: IDateStore, roomStore: IRoomStore
  ): Promise<void> => {
    const month = dateStore.getMonth();
    const erRooms = roomStore.getErRooms();
    const employees = await service.calcER(month, erRooms);
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
