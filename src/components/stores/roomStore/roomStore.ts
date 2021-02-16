import Module from '../../../Module';
import { ErRoom } from '../../../domain/ErRoom';
import ErRoomMock from '../../../mocks/ErRoomMock';
import IRoomStore from './IRoomStore';

const roomStore = (): Module<IRoomStore> => {
  const start = async (): Promise<IRoomStore> => {
    const getErRooms = (): ErRoom[] => ErRoomMock();

    return {
      getErRooms,
    };
  };

  return {
    start,
  };
};

export default roomStore;
