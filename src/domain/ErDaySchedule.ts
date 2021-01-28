import { Employee } from './Employee';
import { ErRoom } from './ErRoom';

export interface ErRoomSchedule {
    room: ErRoom,
    employees: Employee[]
}

export interface ErDaySchedule {
    day: Date,
    roomSchedule: ErRoomSchedule[]
}
