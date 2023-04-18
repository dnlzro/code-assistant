export type PartResponse = {
  success: boolean;
  data: string;
};

export type FullResponse = {
  explanation?: PartResponse;
  confidence?: PartResponse;
  assumptions?: PartResponse;
  resources?: PartResponse;
};

export type Message = {
  role: "user" | "assistant";
  content: string;
};
