import { Row, Worksheet, Column } from 'exceljs';
import Module from '../../Module';
import IReportStore from './IReportStore';
import IExcel from '../excel/IExcel';
import IInputProvider from '../inputProvider/IInputProvider';
import Survey from '../../domain/Survey';
import { ErDaySchedule } from '../../domain/ErDaySchedule';
import { Employee } from '../../domain/Employee';

const reportStore = (): Module<IReportStore> => {
  const start = async (excel: IExcel, inputProvider: IInputProvider): Promise<IReportStore> => {
    const tables = await excel.loadInput(inputProvider.inputFilePath);

    const saveOutput = () => excel.saveOutput(inputProvider.outputFilePath);

    const autosizeColumns = (ws: Worksheet): Column[] => ws.columns.map((column) => {
      let dataMax = 0;
      column.values.forEach((columnCell) => {
        const columnLength = (<string>columnCell).length;
        dataMax = columnLength > dataMax ? columnLength : dataMax;
      });
      return {
        ...column,
        width: dataMax < 10 ? 10 : dataMax,
      };
    });

    const saveEmployeesSchedule = (employees :Employee[], days: Date[]): void => {
      const ws = tables.employeesVsErs;
      ws.addRow(['', '', ...days.map((day) => day.getDate())]);
      ws.addRow(['', '', ...days.map(() => '')]);
      const employeesSpecialities: string[] = [];
      employees.forEach((employee) => {
        if (!employeesSpecialities
          .some((speciality) => speciality === employee.survey.speciality)) {
          employeesSpecialities.push(employee.survey.speciality);
        }
      });
      employeesSpecialities.sort().forEach((speciality) => {
        ws.addRow([speciality]);
        const specialityEmployees = employees
          .filter((employee) => speciality === employee.survey.speciality);
        specialityEmployees.forEach((employee) => ws
          .addRow([
            employee.name,
            employee.survey.timestamp,
            ...days.map((day) => {
              let value = '';
              const foundEr = employee.erDays
                .find((erDay) => erDay.day.getDate() === day.getDate());
              const foundBlockedDay = employee.survey.blockedDays
                .find((blockedDay) => blockedDay === day.getDate())
                    || employee.survey.blockedWeekendDays.flat()
                      .find((blockedDay) => blockedDay === day.getDate());
              value += foundEr ? foundEr.erRoom.id : '';
              value += foundBlockedDay ? 'blocked' : '';
              return value;
            }),
          ]));
      });
      ws.columns = autosizeColumns(ws);
    };

    const saveErSchedule = (erDayScheduleList :ErDaySchedule[]): void => {
      const ws = tables.daysVsEmployees;
      const erRoomHeader = erDayScheduleList[0].roomSchedule
        .flatMap((roomSchedule) => Array(roomSchedule.room.size).fill(roomSchedule.room.name));
      ws.addRow(['', '', ...erRoomHeader]);
      erDayScheduleList.forEach(({ day, roomSchedule }) => {
        const employeesPerErRoom = roomSchedule.flatMap((erRoomSchedule) => erRoomSchedule
          .employees.map((employee) => employee.name));
        ws.addRow([day.getDate(), '', ...employeesPerErRoom]);
      });
      ws.columns = autosizeColumns(ws);
    };

    const mapDayLists = (daysString: string): number[] => daysString
      .split(',')
      .map((a) => a.trim())
      .filter((a) => a)
      .map((a) => Number(a));

    const mapWeekendDayLists = (daysString: string): number[][] => daysString
      .split(',')
      .map((a) => a.trim())
      .filter((a) => a)
      .map((a) => a.split('-').map((b) => Number(b)));

    const rowToSurvey = (row: Row): Survey => ({
      email: row.getCell(2).text,
      name: row.getCell(3).text,
      speciality: row.getCell(4).text,
      blockedDays: mapDayLists(row.getCell(5).text),
      blockedWeekendDays: mapWeekendDayLists(row.getCell(6).text),
      specialityER: mapDayLists(row.getCell(7).text),
      holidayLeave: mapDayLists(row.getCell(8).text),
      comments: row.getCell(9).text,
      timestamp: new Date(row.getCell(1).text),
    });

    const getSurveyAnswers = () => {
      const surveyList: Survey[] = [];
      const table = excel.wb.getWorksheet(1);
      table.eachRow((row, index) => {
        if (index > 1) {
          const newSurvey = rowToSurvey(row);
          const alreadySurveyIndex = surveyList
            .findIndex((survey) => newSurvey.email === survey.email);
          if (alreadySurveyIndex < 0) {
            surveyList.push(newSurvey);
          } else if (surveyList[alreadySurveyIndex].timestamp < newSurvey.timestamp) {
            surveyList[alreadySurveyIndex] = newSurvey;
          }
        }
      });
      return surveyList;
    };

    return {
      /*
      getEmployeeList,
      getDays,
      getErRooms,
       */
      saveEmployeesSchedule,
      saveErSchedule,
      saveOutput,
      getSurveyAnswers,
    };
  };

  return {
    start,
  };
};

export default reportStore;
