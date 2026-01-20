export const getFireFreq = (rate: number): number => {
  return Math.round((1000 / rate) * 100) / 100;
};
