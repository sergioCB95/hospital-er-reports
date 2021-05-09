import { ErRoom } from '../domain/ErRoom';

const ErRoomMock = (): ErRoom[] => ([
  {
    id: 'AT',
    name: 'SALA A TARDE',
    size: 4,
  },
  {
    id: 'BT',
    name: 'SALA B TARDE',
    size: 3,
  },
  {
    id: 'AM',
    name: 'SALA A MAÑANA',
    size: 4,
  },
  {
    id: 'BM',
    name: 'SALA B MAÑANA',
    size: 3,
  },
  {
    id: 'UPA',
    name: 'UPA',
    size: 1,
  },{
    id: 'UPAm',
    name: 'UPAm',
    size: 1,
  },
]);

export default ErRoomMock;
