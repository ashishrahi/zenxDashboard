export interface IBlog {
  _id: string;
  title: string;
  category: string;
  content: string;
  publishedDate: string;
  author: string; // add this
  description?: string;
  link?: string;
  image?: string;
  tags?: string[];
}
