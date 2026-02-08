
export enum ActivityStatus {
  OPEN = 'OPEN JOIN',
  REQUEST = 'REQUEST ACCESS',
  COMPLETED = 'COMPLETED',
  AWAITING_APPROVAL = 'AWAITING APPROVAL',
  CONFIRMED = 'CONFIRMED'
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  hostName: string;
  hostAvatar: string;
  participants: number;
  participantLimit: number;
  location: string;
  status: ActivityStatus;
  image: string;
  tags: string[];
}

export interface Message {
  id: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isSelf: boolean;
  image?: string;
}

export interface Group {
  id: string;
  name: string;
  memberCount: number;
  activeCount: number;
  avatar: string;
  isActive: boolean;
}
