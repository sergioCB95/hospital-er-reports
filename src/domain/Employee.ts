import { Day } from './Day';

export interface EmployeeERDay {
    day: Day,
    erRoom: string,
}

export interface Employee {
    name: string,
    erDays: EmployeeERDay[],
}
