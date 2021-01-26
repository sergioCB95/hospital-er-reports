import initLogger from './components/logger/logger';
import initInputProvider from './components/inputProvider/inputProvider';
import initExcel from './components/excel/excel';
import initReportStore from './components/reportStore/reportStore';
import initController from './components/controller';

const system = () => {
  const start = async () => {
    try {
      const logger = await initLogger().start();
      const inputProvider = await initInputProvider().start();
      const excel = await initExcel().start();
      const reportReader = await initReportStore().start(excel, inputProvider);
      await initController().start(logger, reportReader);
    } catch (err) {
      console.log(err);
    }
  };

  return {
    start,
  };
};

export default system;
