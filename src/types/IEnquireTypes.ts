export interface IEnquire {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: Date;
}
