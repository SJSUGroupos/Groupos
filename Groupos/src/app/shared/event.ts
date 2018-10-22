import { Profile } from './profile';

export class Event {
  id: string;
  name: string;
  class: string;
  time: string;
  location: string;
  organizer: Profile;
}
