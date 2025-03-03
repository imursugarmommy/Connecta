export interface Post {
  id: number;
  username: string;
  name: string;
  title: string;
  content: string;
  postImage: string;
  UserId: number;
  Comments: any[];
  Likes: any[];
}
