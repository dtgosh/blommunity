export * from "./errors";
export * from "./jwt";
export * from "./enums";

export interface CurrentAdmin {
  id: string;
  name: string;
  email: string | null;
  role: import("./enums").Role;
}
