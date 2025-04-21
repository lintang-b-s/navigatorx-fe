export function truncateString(str: string, maxLength: number = 30) {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}

export function getArrivalTime(etaMinutes: number) {
  const arrivalDate = new Date(Date.now() + etaMinutes * 60 * 1000);

  let hours = arrivalDate.getHours();
  const minutes = arrivalDate.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  if (hours === 0) hours = 12;

  const minuteStr = minutes.toString().padStart(2, "0");

  return `${hours}:${minuteStr} ${ampm}`;
}
