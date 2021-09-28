import { Timestamp } from '@firebase/firestore-types';
import { Tag } from './tag.model';
import { User } from './user.model';

export interface Task {
    id: string;
    status: 'New' | 'In Progress' | 'Finished';
    priority: 'Low' | 'Medium' | 'High';
    description: string;
    tags: Tag[];
    createdOn: Timestamp;
    dueDate: Timestamp;
    users: User[];
}