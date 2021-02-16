import initLogger from './components/logger/logger';
import initInputProvider from './components/inputProvider/inputProvider';
import initExcel from './components/excel/excel';
import initReportStore from './components/stores/reportStore/reportStore';
import initController from './components/controller';
import initService from './components/service/service';
import initDateStore from './components/stores/dateStore/dateStore';
import initRoomStore from './components/stores/roomStore/roomStore';

const system = () => {
  const start = async () => {
    try {
      const logger = await initLogger().start();
      const inputProvider = await initInputProvider().start();
      const excel = await initExcel().start();
      const reportStore = await initReportStore().start(excel, inputProvider);
      const dateStore = await initDateStore().start();
      const roomStore = await initRoomStore().start();
      const service = await initService().start(logger, reportStore);
      await initController().start(service, reportStore, dateStore, roomStore);
    } catch (err) {
      console.log(err);
    }
  };

  return {
    start,
  };
};

export default system;
