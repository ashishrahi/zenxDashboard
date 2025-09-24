export interface IDashboard {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
   totalEnquire: number;
}
export interface SectionCardsProps {
  dashBoard?: IDashboard;
}