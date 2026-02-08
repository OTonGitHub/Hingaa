import { Activity, ActivityStatus, DbActivity } from '../types';

const formatDate = (value: string | null): string => {
  if (!value) return 'TBD';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'TBD';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

const formatTime = (value: string | null): string => {
  if (!value) return 'TBD';
  const date = new Date(`1970-01-01T${value}`);
  if (Number.isNaN(date.getTime())) return 'TBD';
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
};

const mapStatus = (status: DbActivity['status']): ActivityStatus => {
  if (status === 'open') return ActivityStatus.OPEN;
  if (status === 'completed') return ActivityStatus.COMPLETED;
  return ActivityStatus.REQUEST;
};

export const mapDbActivityToUi = (db: DbActivity, participantCount = 0): Activity => ({
  id: db.id,
  title: db.title,
  description: db.description,
  date: formatDate(db.activity_date),
  time: formatTime(db.activity_time),
  hostName: db.profiles?.full_name || 'Host',
  hostAvatar: db.profiles?.avatar_url || `https://picsum.photos/seed/${db.host_id}/100/100`,
  participants: participantCount,
  participantLimit: db.participant_limit,
  location: db.location_name,
  status: mapStatus(db.status),
  image: db.image_url || `https://picsum.photos/seed/${db.id}/800/600`,
  tags: [db.category]
});
