export interface IUser{
 id: string,  
 name: string,
 username: string,
 email: string,
 address: IAddress,
 phone: string,
 }

 export interface IAddress{
    street: string,
    city: string,
    zipcode: string,
 }