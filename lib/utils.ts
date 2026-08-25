import dayjs from "dayjs";

export function formatCurrency(value: number, currency: string = "USD") {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch (err) {
    console.error(err);

    const formattedValue = value.toFixed(2);
    return `$${formattedValue}`;
  }
}

export function formatSubscriptionDateTime(value?: string): string {
  if (!value) return "Not Provided";

  const parsedDate = dayjs(value);
  return parsedDate.isValid()
    ? parsedDate.format("DD/MM/YYYY")
    : "Not Provided";
}

export function formatStatusLabel(value?: string): string {
  if (!value) return "Unknown";

  return value.charAt(0).toUpperCase() + value.slice(1);
}
