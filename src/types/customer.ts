export interface ICustomer {
  id: string;
  name: string;
  phone: string;
  email: string;
  note?: string;
}

export interface ICustomerForm {
  name?: string;
  phone?: string;
  email?: string;
}
