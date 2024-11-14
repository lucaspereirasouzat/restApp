import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

export const customHumanize = (date: Date) => {
    const now = dayjs();
    const targetDate = dayjs(date);
    const diffMilliseconds = targetDate.diff(now); // Difference in milliseconds
    const d = dayjs.duration(diffMilliseconds);

    const context = diffMilliseconds > 0 ? 'after' : 'before';
    return `${d.humanize()} ${context}`;
};