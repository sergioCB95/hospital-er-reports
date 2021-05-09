import Module from '../Module';
import ILogger from './logger/ILogger';
import IReportStore from './reportStore/IReportStore';
import { ErDaySchedule, ErRoomSchedule } from '../domain/ErDaySchedule';
import { ErRoom } from '../domain/ErRoom';
import { EmployeeERDay } from '../domain/Employee';

const controller = (): Module<any> => {
  const isComposedBy = (erRooms: ErRoom[], erDay: EmployeeERDay, room: ErRoom): boolean => {
    const foundRoom = erRooms.find((erRoom) => erRoom.id === erDay.erRoom);
    return !!(foundRoom && foundRoom.composedBy
        && foundRoom.composedBy.find((composedRoom) => composedRoom === room.id));
  };

  const start = async (logger: ILogger, reportStore: IReportStore): Promise<any> => {
    const days = reportStore.getDays();
    const erRooms = reportStore.getErRooms();
    const employees = reportStore.getEmployeeList();
    const erDayScheduleList = days.map((day): ErDaySchedule => ({
      day,
      roomSchedule: erRooms.map((room): ErRoomSchedule => ({
        room,
        employees: employees.filter((employee) => employee.erDays
          .some((erDay) => erDay.day.numberDay === day.numberDay
              && (erDay.erRoom === room.id || isComposedBy(erRooms, erDay, room)))),
      })),
    }));
    reportStore.saveErSchedule(erDayScheduleList);
    await reportStore.saveOutput();
  };

  return {
    start,
  };
};

export default controller;
