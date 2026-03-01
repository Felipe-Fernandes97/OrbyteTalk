import { User } from './user.model';

export type ConversationType = 'direct' | 'group';

export interface Conversation {
  id: string;
  type: ConversationType;
  participants: User[];
  groupName?: string;
  lastMessage?: string;
}
