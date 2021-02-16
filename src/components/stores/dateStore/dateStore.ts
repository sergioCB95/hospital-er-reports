import Module from '../../../Module';
import IDateStore from './IDateStore';

const dateStore = (): Module<IDateStore> => {
  const start = async (): Promise<IDateStore> => {
    const getMonth = (): Date[] => {
      const monthDays = new Date(2020, 3, 0).getDate();
      return Array(monthDays)
        .fill(0)
        .map((_, i) => (i < (monthDays - 1)
          ? new Date(2020, 2, i + 1)
          : new Date(2020, 3, 0)));
    };

    return {
      getMonth,
    };
  };

  return {
    start,
  };
};

export default dateStore;
