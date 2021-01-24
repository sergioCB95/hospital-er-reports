import { Day } from './Day';
import { Employee } from './Employee';
import { ErRoom } from './ErRoom';

export interface ErRoomSchedule {
    room: ErRoom,
    employees: Employee[]
}

export interface ErDaySchedule {
    day: Day,
    roomSchedule: ErRoomSchedule[]
}
