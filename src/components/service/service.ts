import Module from '../../Module';
import ILogger from '../logger/ILogger';
import IReportStore from '../reportStore/IReportStore';
import IService from './IService';
import { Employee } from '../../domain/Employee';
import { ErRoom } from '../../domain/ErRoom';
import ErRoomMock from '../../mocks/ErRoomMock';
import Survey from '../../domain/Survey';
import { shuffleArray, sortChain } from '../../lib/arrayUtils';

const service = (): Module<IService> => {
  const start = async (logger: ILogger, reportStore: IReportStore): Promise<IService> => {
    const getErRooms = (): ErRoom[] => ErRoomMock();

    const isWeekendDay = (date: Date) => date.getDay() % 6 === 0;

    const isNotWeekendDay = (date: Date) => date.getDay() % 6 !== 0;

    const getMonth = (): Date[] => {
      const monthDays = new Date(2020, 3, 0).getDate();
      return Array(monthDays)
        .fill(0)
        .map((_, i) => (i < (monthDays - 1)
          ? new Date(2020, 2, i + 1)
          : new Date(2020, 3, 0)));
    };

    const getMonthERHours = (month: Date[], erRooms: ErRoom[]): number => {
      const weekDays = month.filter(isNotWeekendDay);
      const weekHours = erRooms
        .filter((room) => !room.onlyWeekends)
        .reduce((acc, curr) => acc + (curr.hours * curr.size), 0) * weekDays.length;

      const weekendDays = month.filter(isWeekendDay);
      const weekendHours = erRooms
        .reduce((acc, curr) => acc + (curr.hours * curr.size), 0) * weekendDays.length;

      return weekHours + weekendHours;
    };

    const addErDay = (employee: Employee, day: Date, room: ErRoom, isWeekend = false) => {
      const employeeCopy = employee;
      employeeCopy.erDays.push({ day, erRoom: room });
      if (isWeekend) employeeCopy.erWeekendHours += room.hours;
      employeeCopy.erHours += room.hours;
    };

    const weekendSort = (a: Employee, b: Employee) => sortChain(
      a.erWeekendHours - b.erWeekendHours,
      b.survey.blockedWeekendDays.length - a.survey.blockedWeekendDays.length,
      b.survey.blockedDays.length - a.survey.blockedDays.length,
    );

    const notWeekendSort = (a: Employee, b: Employee) => sortChain(
      a.erHours - b.erHours,
      b.survey.blockedDays.length - a.survey.blockedDays.length,
    );

    const getAvailableEmployeesWithLessHours = (
      employees: Employee[], date: Date, num: number, isWeekend: boolean,
    ) => shuffleArray(employees)
      .sort(isWeekend ? weekendSort : notWeekendSort)
      .filter((employee) => !(employee.erDays
        // They are already in ER or were the day before (rest day)
        .some((erDay) => erDay.day === date || (erDay.day.getDate() + 1) === date.getDate())
        // They blocked that day
        || employee.survey.blockedDays.some((day) => day === date.getDate())
        // They blocked that (weekend) day
        || employee.survey.blockedWeekendDays.flat().some((day) => day === date.getDate())))
      .slice(0, num);

    const scheduleDays = (
      employees: Employee[], days: Date[], erRooms: ErRoom[], isWeekend: boolean,
    ) => days.forEach((day) => {
      erRooms.forEach((room) => {
        const selectedEmployees = getAvailableEmployeesWithLessHours(
          employees, day, room.size, isWeekend,
        );
        selectedEmployees.forEach((employee) => addErDay(employee, day, room, isWeekend));
      });
    });

    const surveyToEmployee = (survey: Survey): Employee => ({
      email: survey.email,
      name: survey.name,
      erDays: [],
      survey,
      erHours: 0,
      erWeekendHours: 0,
    });

    const calcER = async (): Promise<Employee[]> => {
      const surveys = reportStore.getSurveyAnswers();
      const month = getMonth();
      const erRooms = getErRooms();
      const employees: Employee[] = surveys.map(surveyToEmployee);

      // Scheduling weekends
      scheduleDays(
        employees,
        month.filter(isWeekendDay),
        erRooms,
        true,
      );

      // Scheduling no weekend days
      scheduleDays(
        employees,
        month.filter(isNotWeekendDay),
        erRooms.filter((room) => !room.onlyWeekends),
        false,
      );
      return employees;
    };

    return {
      getErRooms,
      getMonth,
      calcER,
    };
  };

  return {
    start,
  };
};

export default service;
