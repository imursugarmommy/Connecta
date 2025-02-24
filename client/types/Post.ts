export interface Post {
  id: number;
  username: string;
  title: string;
  content: string;
  UserId: number;
  Comments: any[];
  Likes: any[];
}
