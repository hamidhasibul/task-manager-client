import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const axiosIns = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
});

axiosIns.defaults.headers.common["Content-Type"] = "application/json";
