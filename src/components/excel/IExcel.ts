import { Workbook, Worksheet } from 'exceljs';

interface IExcel {
    wb: Workbook,
    tables: Worksheet[],
}

export default IExcel;
