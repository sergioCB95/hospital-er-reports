import { ErRoom } from '../domain/ErRoom';

const ErRoomMock = (): ErRoom[] => ([
  {
    id: 'AT',
    name: 'SALA A TARDE',
    size: 4,
    onlyWeekends: false,
    hours: 17,
  },
  {
    id: 'BT',
    name: 'SALA B TARDE',
    size: 3,
    onlyWeekends: false,
    hours: 17,
  },
  {
    id: 'AM',
    name: 'SALA A MAÑANA',
    size: 4,
    onlyWeekends: true,
    hours: 7,
  },
  {
    id: 'BM',
    name: 'SALA B MAÑANA',
    size: 3,
    onlyWeekends: true,
    hours: 7,
  },
]);

export default ErRoomMock;
