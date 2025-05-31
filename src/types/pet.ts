// src/types/pet.ts
export interface IPet {
  id: string;
  customer_id: string;
  name: string;
  petType: '狗' | '貓' | '其他';
  petBreed: string;
  petGender: '公' | '母';
  petAge: number;
  petWeight: number;
  petNote: string;
  isAttack: boolean;
  attackNote?: string;
  healthReminder?: string;
  created_at: string;
  updated_at: string;
}

export interface IPetForm {
  name?: string;
  petType?: '狗' | '貓' | '其他';
  petBreed?: string;
  petGender?: '公' | '母';
}
