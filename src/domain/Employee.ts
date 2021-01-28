import Survey from './Survey';
import { ErRoom } from './ErRoom';

export interface EmployeeERDay {
    day: Date,
    erRoom: ErRoom,
}

export interface Employee {
    email: string,
    name: string,
    erDays: EmployeeERDay[],
    erHours: number,
    erWeekendHours: number,
    survey: Survey,
}
