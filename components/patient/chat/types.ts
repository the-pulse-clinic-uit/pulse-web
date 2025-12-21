export interface Message {
  id: number;
  sender: "patient" | "staff";
  name: string;
  text: string;
  time: string;
}
