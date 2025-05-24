export interface ICustomer {
  id: string;
  name: string;
  phone: string;
  email: string;
  note?: string;
  created_at: string;
  updated_at?: string;
}

export interface ICustomerForm {
  name?: string;
  phone?: string;
  email?: string;
}
