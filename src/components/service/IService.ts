import { Employee } from '../../domain/Employee';
import { ErRoom } from '../../domain/ErRoom';

interface IService {
    calcER: () => Promise<Employee[]>,
    getErRooms: () => ErRoom[],
    getMonth: () => Date[]

}

export default IService;
