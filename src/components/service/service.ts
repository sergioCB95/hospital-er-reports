import Module from '../../Module';
import ILogger from '../logger/ILogger';
import IReportStore from '../stores/reportStore/IReportStore';
import IService from './IService';
import { Employee } from '../../domain/Employee';
import { ErRoom } from '../../domain/ErRoom';
import Survey from '../../domain/Survey';
import { shuffleArray, sortChain } from '../../lib/arrayUtils';
import { isNotWeekendDay, isWeekendDay } from '../../lib/dateUtils';

const service = (): Module<IService> => {
  const start = async (logger: ILogger, reportStore: IReportStore): Promise<IService> => {
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

    const calcER = async (month: Date[], erRooms: ErRoom[]): Promise<Employee[]> => {
      const surveys = reportStore.getSurveyAnswers();
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
      calcER,
    };
  };

  return {
    start,
  };
};

export default service;
