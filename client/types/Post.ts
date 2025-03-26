export interface Post {
  id: number;
  title: string;
  content: string;
  postImage: string;
  UserId: number;
  Comments: any[];
  Likes: any[];
  createdAt: string;
  updatedAt: string;
}
