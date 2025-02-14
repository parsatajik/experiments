export interface ChatModel {
  id: string;
  name: string;
  description: string;
  contextLength: number;
  parameters: string;
}

export const chatModels: ChatModel[] = [
  {
    id: "Llama-3.2-1B-Instruct-q4f32_1-MLC",
    name: "Llama 3.2 1B Instruct",
    description: "Fast, lightweight model good for basic tasks",
    contextLength: 2048,
    parameters: "1B",
  },
  {
    id: "Llama-2-7b-chat-q4f32_1-MLC",
    name: "Llama 2 7B Chat",
    description: "Balanced model for general conversation",
    contextLength: 4096,
    parameters: "7B",
  },
  {
    id: "Mistral-7B-Instruct-v0.2-q4f32_1-MLC",
    name: "Mistral 7B Instruct",
    description: "High-quality instruction following",
    contextLength: 8192,
    parameters: "7B",
  },
];
