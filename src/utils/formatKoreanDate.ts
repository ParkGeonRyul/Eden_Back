export const formatDate = (date: Date) => {
  const utcDate = new Date(date.toISOString());
  const year = utcDate.getUTCFullYear().toString().slice(-2);
  const month = (utcDate.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = utcDate.getUTCDate().toString().padStart(2, "0");
  return `${year}.${month}.${day}`;
};
