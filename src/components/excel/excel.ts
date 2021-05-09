import { Workbook } from 'exceljs';
import Module from '../../Module';
import IExcel from './IExcel';
import ExcelTables from '../../domain/ExcelTables';

const excel = (): Module<IExcel> => {
  const start = async (): Promise<IExcel> => {
    const wb = new Workbook();

    const loadInput = async (inputFilePath: string): Promise<ExcelTables> => {
      await wb.xlsx.readFile(inputFilePath);

      return {
        employeesVsErs: wb.getWorksheet(1),
        daysVsEmployees: wb.getWorksheet('3. Guardias por salas (URG)') || wb.addWorksheet('3. Guardias por salas (URG)'),
      } as const;
    };

    const saveOutput = (outputFilePath: string): Promise<void> => wb.xlsx.writeFile(outputFilePath);

    return {
      wb,
      loadInput,
      saveOutput,
    };
  };

  return {
    start,
  };
};

export default excel;
