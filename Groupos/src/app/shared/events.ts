import { Event } from './event';
import { PROFILES } from './profiles';

export const EVENTS: Event[] = [
  {
    id: '0',
    name: 'Midterm Study Session',
    class: 'CMPE 131',
    time: 'Monday 2/29 at 14:00',
    location: 'Library',
    organizer: PROFILES[0],
    members: null
  },
  {
    id: '1',
    name: 'Midterm Study Session',
    class: 'CMPE 146',
    time: 'Tuesday 4/30 at 16:00',
    location: 'Library',
    organizer: PROFILES[0],
    members: null
  }
];
