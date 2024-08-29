import { format } from "date-fns";

export default function DateComponent({ date }) {
  // Ensure consistent formatting
  const formattedDate = format(new Date(date), "yyyy/MM/dd HH:mm:ss");

  return <>{formattedDate}</>;
}
