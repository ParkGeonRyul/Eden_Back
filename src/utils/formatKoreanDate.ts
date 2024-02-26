export const formatDate = (date: Date | null | undefined) => {
  if (!date) return null;
  const koreanDate = new Date(date)
    .toLocaleDateString("ko-KR", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\. /g, ".")
    .replace(/\.$/, "");
  return koreanDate;
};
