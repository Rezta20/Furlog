import { defineStore } from 'pinia';
import pets from 'src/data/pets.json';

export const usePetStore = defineStore('pet', {
  state: () => ({
    list: pets as Array<{
      id: string;
      name: string;
      type: string;
      breed: string;
      age: number;
      owner: { name: string; phone: string };
      tags: string[];
      avatar: string;
    }>,
  }),
  getters: {
    byId: (state) => (id: string) => state.list.find((p) => p.id === id),
  },
});
