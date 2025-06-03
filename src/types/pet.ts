// src/types/pet.ts
export interface IPet {
  id: string;
  customer_id: string;
  name: string;
  petType: 'dog' | 'cat' | 'other';
  petBreed: string;
  petGender: 'male' | 'female';
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
  petType?: 'dog' | 'cat' | 'other';
  petBreed?: string;
  petGender?: 'male' | 'female';
}
