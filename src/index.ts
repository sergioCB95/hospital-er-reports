import initController from './components/controller';
import initLogger from './components/logger/logger';
import initExcel from './components/excel/excel';
import initReportStore from './components/reportStore/reportStore';
import initInputProvider from './components/inputProvider/inputProvider';

(async () => {
  const logger = await initLogger().start();
  const inputProvider = await initInputProvider().start();
  const excelModule = await initExcel();
  const excel = await excelModule.start();
  const reportReader = await initReportStore().start(excel, inputProvider);
  await initController().start(logger, reportReader);
  if (excelModule.stop) await excelModule.stop();
})();
