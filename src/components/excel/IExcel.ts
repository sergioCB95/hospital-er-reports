import { Workbook } from 'exceljs';
import ExcelTables from '../../domain/ExcelTables';

interface IExcel {
    wb: Workbook,
    loadInput: (inputFilePath: string) => Promise<ExcelTables>,
    saveOutput: (outputFilePath: string) => Promise<void>
}

export default IExcel;
