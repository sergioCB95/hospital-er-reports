import fs from 'fs';
import Module from '../../Module';
import IInputProvider from './IInputProvider';

const inputProvider = (): Module<IInputProvider> => {
  const start = async (): Promise<IInputProvider> => {
    const inputFilePath = process.argv[2];
    const outputFilePath = process.argv[3];

    if (!inputFilePath || !outputFilePath) {
      throw Error('You must add 2 arguments: an input file and an output file');
    }

    if (!inputFilePath.endsWith('.xlsx') || !outputFilePath.endsWith('.xlsx')) {
      throw Error('Input files must be .xlsx');
    }

    const inputStat = await fs.promises.lstat(inputFilePath);

    if (!inputStat.isFile()) {
      throw Error('Input arguments are not valid file paths');
    }

    return {
      inputFilePath,
      outputFilePath,
    };
  };

  return {
    start,
  };
};

export default inputProvider;
