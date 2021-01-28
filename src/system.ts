import initLogger from './components/logger/logger';
import initInputProvider from './components/inputProvider/inputProvider';
import initExcel from './components/excel/excel';
import initReportStore from './components/reportStore/reportStore';
import initController from './components/controller';
import initService from './components/service/service';

const system = () => {
  const start = async () => {
    try {
      const logger = await initLogger().start();
      const inputProvider = await initInputProvider().start();
      const excel = await initExcel().start();
      const reportStore = await initReportStore().start(excel, inputProvider);
      const service = await initService().start(logger, reportStore);
      await initController().start(service, reportStore);
    } catch (err) {
      console.log(err);
    }
  };

  return {
    start,
  };
};

export default system;
