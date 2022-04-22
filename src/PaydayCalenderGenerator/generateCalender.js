import ical from 'ical-generator';
import moment from 'moment';

// eslint-disable-next-line no-unused-vars
export function generateCalendar(state) {
  const calendar = ical({ name: 'my first iCal' });
  calendar.createEvent({
    start: moment(),
    end: moment().add(1, 'hour'),
    summary: 'Example Event',
    description: 'It works ;)',
    location: 'my room',
    url: 'http://sebbo.net/',
  });
  return calendar.toString();
}
