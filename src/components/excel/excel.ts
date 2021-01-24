import { Workbook } from 'exceljs';
import { join } from 'path';
import Module from '../../Module';
import IExcel from './IExcel';

const excel = (): Module<IExcel> => {
  const wb = new Workbook();

  const start = async (): Promise<any> => {
    const filePath = process.argv[2];
    await wb.xlsx.readFile(filePath);

    const tables = {
      employeesVsErs: wb.getWorksheet('1. Guardias por personas'),
      daysVsEmployees: wb.getWorksheet('3. Guardias por salas (URG)') || wb.addWorksheet('3. Guardias por salas (URG)'),
    } as const;

    return {
      wb,
      tables,
    };
  };

  const stop = async (): Promise<void> => {
    await wb.xlsx.writeFile(join(__dirname, 'output.xlsx'));
  };

  return {
    start,
    stop,
  };
};

export default excel;
