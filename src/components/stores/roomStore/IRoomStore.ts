import { ErRoom } from '../../../domain/ErRoom';

interface IRoomStore {
    getErRooms: () => ErRoom[]
}

export default IRoomStore;
