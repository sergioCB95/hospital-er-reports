import {
  Cell, CellValue, Column, Row, Worksheet,
} from 'exceljs';
import Module from '../../Module';
import { Employee, EmployeeERDay } from '../../domain/Employee';
import IReportStore from './IReportStore';
import { Day } from '../../domain/Day';
import { ErRoom } from '../../domain/ErRoom';
import ErRoomMock from '../../mocks/ErRoomMock';
import { ErDaySchedule } from '../../domain/ErDaySchedule';
import IExcel from '../excel/IExcel';
import IInputProvider from '../inputProvider/IInputProvider';

const reportStore = (): Module<IReportStore> => {
  const start = async (excel: IExcel, inputProvider: IInputProvider): Promise<IReportStore> => {
    const tables = await excel.loadInput(inputProvider.inputFilePath);

    const saveOutput = () => excel.saveOutput(inputProvider.outputFilePath);

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
      const employee: Employee = { name: '', erDays: [] };
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
        const employeesPerErRoom = roomSchedule.flatMap((erRoomSchedule) => {
          const result = erRoomSchedule.employees.map((employee) => employee.name);
          const left = erRoomSchedule.room.size - result.length;
          for (let i = 0; i < left; i += 1) {
            result.push('');
          }
          return result;
        });
        ws.addRow([day.numberDay, day.weekDay, ...employeesPerErRoom]);
      });
      ws.columns = autosizeColumns(ws);
    };

    return {
      getEmployeeList,
      getDays,
      getErRooms,
      saveErSchedule,
      saveOutput,
    };
  };

  return {
    start,
  };
};

export default reportStore;
