export default interface authStateType {
  user?: userType;
  orders?: [];
  withdraw?: [];
  deposits?: [];
}

export type userType = {
  _id?: string;
  role?: number;
  email?: string;
  image?: string;
  name?: string;
};
