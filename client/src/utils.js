const sameDate = (date1, date2) => {
  const d1 = new Date(date1.slice(0, 10));
  const d2 = new Date(date2.slice(0, 10)); // .slice(0,10) => YYYY-MM-DD(-1)
  if (d1.getTime() === d2.getTime()) return true;
  else return false;
};
const formatDate = (date) => {
  const d = new Date(date); // FIX NEEDED
  //return MM/DD/YYY
  return `${d.getUTCMonth() + 1}/${d.getUTCDate()}/${d.getUTCFullYear()}`;
};
const formatTime = (date) => {
  const d = new Date(date); // FIX NEEDED
  // return XX:XX:XX
  return `${d.getHours() < 10 ? `0${d.getHours()}` : d.getHours()}:${
    d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes()
  }:${d.getSeconds() < 10 ? `0${d.getSeconds()}` : d.getSeconds()}`;
};

export const formatWindow = (startDate, endDate) => {
  if (sameDate(startDate, endDate))
    return `${formatDate(startDate)} -- ${formatTime(startDate)} - ${formatTime(
      endDate
    )}`;
  else
    return `${formatDate(startDate)} - ${formatDate(endDate)} -- ${formatTime(
      startDate
    )} - ${formatTime(endDate)}`;
};
