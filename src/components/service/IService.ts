import { Employee } from '../../domain/Employee';
import { ErRoom } from '../../domain/ErRoom';

interface IService {
    calcER: (month: Date[], erRooms: ErRoom[]) => Promise<Employee[]>,
}

export default IService;
