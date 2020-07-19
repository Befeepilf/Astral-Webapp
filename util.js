import isToday from 'date-fns/isToday';
import isTomorrow from 'date-fns/isTomorrow';
import format from 'date-fns/format';

export function dateToDayName(date) {
    if(isToday(date)) return "Today";
    else if(isTomorrow(date)) return "Tomorrow";
    
    return format(date, 'iiii');
}