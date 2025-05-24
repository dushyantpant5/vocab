function getLast7FormattedDates(): string[] {
  const days: string[] = [];
  const today = new Date();

  for (let i = 7; i >= 1; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    // Format: "21 May"
    const formatted = d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });

    days.push(formatted);
  }

  return days;
}
export { getLast7FormattedDates };
