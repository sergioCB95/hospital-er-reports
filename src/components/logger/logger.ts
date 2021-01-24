import Module from '../../Module';
import ILogger from './ILogger';

const controller = (): Module<ILogger> => {
  const start = async (): Promise<ILogger> => {
    const log = (text: any): void => {
      console.log(text);
    };

    return {
      log,
    };
  };

  return {
    start,
  };
};

export default controller;
