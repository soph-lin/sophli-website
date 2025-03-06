// Format date from MM/YYYY to Month Year
export function formatDate(dateStr: string) {
  if (dateStr === "Present") {
    return "Present";
  }
  const [month, year] = dateStr.split("/");
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return date.toLocaleString("en-us", { month: "short", year: "numeric" });
}
