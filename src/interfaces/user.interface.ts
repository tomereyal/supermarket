export default interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address: { city: string; street: string };
  isAdmin: boolean;
}
