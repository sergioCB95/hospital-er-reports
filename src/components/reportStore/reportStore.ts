import { Row } from 'exceljs';
import Module from '../../Module';
import IReportStore from './IReportStore';
import IExcel from '../excel/IExcel';
import IInputProvider from '../inputProvider/IInputProvider';
import Survey from '../../domain/Survey';

const reportStore = (): Module<IReportStore> => {
  const start = async (excel: IExcel, inputProvider: IInputProvider): Promise<IReportStore> => {
    const tables = await excel.loadInput(inputProvider.inputFilePath);

    const saveOutput = () => excel.saveOutput(inputProvider.outputFilePath);

    /*
    const getEmployeeERDays = (
      row: Row, numberDays: CellValue[], weekDays: CellValue[],
    ): EmployeeERDay[] => {
      const erDays: EmployeeERDay[] = [];
      row.eachCell((cell: Cell, col: number) => {
        if (col > 1 || cell.text.length < 1) {
          erDays.push({
            day: {
              numberDay: <string>numberDays[col],
              weekDay: <string>weekDays[col],
            },
            erRoom: cell.text,
          });
        }
      });
      return erDays;
    };

    const rowToEmployee = (row: Row, numberDays: CellValue[], weekDays: CellValue[]): Employee => {
      const employee: Employee = { name: '', email: '', erDays: [], erHours: 0, erWeekendHours: 0 };
      employee.name = <string>row.getCell(1).value;
      employee.erDays = getEmployeeERDays(row, numberDays, weekDays);
      return employee;
    };

    const getEmployeeList = (): Employee[] => {
      const employeeList: Employee[] = [];
      const ws = tables.employeesVsErs;
      const numberDays = <CellValue[]>ws.getRow(1).values;
      const weekDays = <CellValue[]>ws.getRow(2).values;
      ws.eachRow((row: Row, index: number) => {
        if (index > 2) {
          const employee = rowToEmployee(row, numberDays, weekDays);
          employeeList.push(employee);
        }
      });
      return employeeList;
    };

    const getDays = (): Day[] => {
      const dayList: Day[] = [];
      const ws = tables.employeesVsErs;
      const numberDays = <CellValue[]>ws.getRow(1).values;
      const weekDays = <CellValue[]>ws.getRow(2).values;
      numberDays.forEach((value, i) => dayList
        .push({ numberDay: <string>value, weekDay: <string>weekDays[i] }));
      return dayList;
    };

    const getErRooms = (): ErRoom[] => ErRoomMock();

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

    const saveErSchedule = (erDayScheduleList :ErDaySchedule[]): void => {
      const ws = tables.daysVsEmployees;
      const erRoomHeader = erDayScheduleList[0].roomSchedule
        .flatMap((roomSchedule) => Array(roomSchedule.room.size).fill(roomSchedule.room.name));
      ws.addRow(['', '', ...erRoomHeader]);
      erDayScheduleList.forEach(({ day, roomSchedule }) => {
        const employeesPerErRoom = roomSchedule.flatMap((erRoomSchedule) => erRoomSchedule
          .employees.map((employee) => employee.name));
        ws.addRow([day.numberDay, day.weekDay, ...employeesPerErRoom]);
      });
      ws.columns = autosizeColumns(ws);
    };
     */

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
          surveyList.push(rowToSurvey(row));
        }
      });
      return surveyList;
    };

    return {
      /*
      getEmployeeList,
      getDays,
      getErRooms,
      saveErSchedule,
       */
      saveOutput,
      getSurveyAnswers,
    };
  };

  return {
    start,
  };
};

export default reportStore;
