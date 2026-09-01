import { z } from "zod";

export const dotOnlyName = /^\.+$/;

export const safeName = z.string()
  .min(1)
  .max(255)
  .regex(/^[^<>:"/\\|?*\x00-\x1F]+$/, "Name contains forbidden characters")
  .regex(/^(?!\.+$)/, "Name cannot consist only of dots");

export const filterOptions = z.enum(["All", "Pictures", "Videos", "Documents", "Other"]);
export const folderIdType = z.number().nullable();
export const folderStackIDsType = z.array(z.number());