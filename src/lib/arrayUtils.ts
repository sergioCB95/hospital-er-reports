export const extendedSort = (condition: number, tiebreak: number): number => {
  let result;
  if (condition > 0) {
    result = 1;
  } else if (condition < 0) {
    result = -1;
  } else {
    result = tiebreak;
  }
  return result;
};

export const sortChain = (...args: number[]): number => {
  const first = args.shift();
  return first
    ? extendedSort(first, sortChain(...args))
    : 0;
};

export const shuffleArray = <T>(array: Array<T>): Array<T> => {
  const arr = array;
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
};
