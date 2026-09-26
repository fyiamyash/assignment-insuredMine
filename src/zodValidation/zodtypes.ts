import z from "zod";

export const MessageBody = z.object({
  message: z.string().min(1, "Message cannot be empty"),

  date: z
    .string()
    .regex(/^\d{2}-\d{2}-\d{2}$/, "Date must be in mm-dd-yy format")
    .refine((val) => {
      const [mm, dd, yy] = val.split("-").map(Number);
      if (mm === undefined || dd === undefined || yy === undefined) {
        return false;
      }
      if (mm < 1 || mm > 12) return false;
      if (dd < 1 || dd > 31) return false;

      const fullYear = 2000 + yy;
      const d = new Date(fullYear, mm - 1, dd);
      return d.getFullYear() === fullYear && d.getMonth() === mm - 1 && d.getDate() === dd;
    }, "Invalid date"),

  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:mm 24-hour format"),
});

export const IncomingBodyType = z.object({
  username: z.string().min(3),
});
