import { Post } from "./Post";

export interface User {
  id: number;
  email: string;
  username: string;
  name: string;
  password: string;
  profileImage: string;
  createdAt: string;
  updatedAt: string;
}
