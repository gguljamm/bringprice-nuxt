// time format 00:00 am (+0)
const isIncludeTimeFilter = (flightTime, timeRange) => {
  const time = flightTime.split('T')[1].split(':');
  const flightTimeMinute = (time[0] * 60) + parseInt(time[1], 10);
  // console.log(timeRange.min <= flightTimeMinute && timeRange.max >= flightTimeMinute);
  return timeRange.start <= flightTimeMinute
  && timeRange.end >= flightTimeMinute;
};

export default {
  isIncludeTimeFilter,
};
