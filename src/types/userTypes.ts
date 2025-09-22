export interface IUser{
 _id?: string,  
 name?: string,
 username?: string,
 email?: string,
 address?: IAddress,
 phone?: string,
 role?:string
 }

 export interface IAddress{
    street?: string,
    city?: string,
    zipcode?: string,
 }