import { ErRoom } from '../domain/ErRoom';

export const isWeekendDay = (date: Date) => date.getDay() % 6 === 0;

export const isNotWeekendDay = (date: Date) => date.getDay() % 6 !== 0;

export const getMonthERHours = (month: Date[], erRooms: ErRoom[]): number => {
  const weekDays = month.filter(isNotWeekendDay);
  const weekHours = erRooms
    .filter((room) => !room.onlyWeekends)
    .reduce((acc, curr) => acc + (curr.hours * curr.size), 0) * weekDays.length;

  const weekendDays = month.filter(isWeekendDay);
  const weekendHours = erRooms
    .reduce((acc, curr) => acc + (curr.hours * curr.size), 0) * weekendDays.length;

  return weekHours + weekendHours;
};
