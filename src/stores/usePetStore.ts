import { defineStore } from 'pinia';
import type { IPet, IPetForm } from 'src/types/pet';
import petsRaw from '../data/pets.json'; // ⬅️ 你需要放上面提供的寵物資料為 pet.json

export const usePetStore = defineStore('pet', {
  state: () => {
    let formatted: IPet[] = [];

    // 1️⃣ 優先從 localStorage 讀取
    const saved = localStorage.getItem('pets');
    if (saved) {
      try {
        formatted = JSON.parse(saved);
        console.log('✅ Initialized pets from localStorage');
      } catch (e) {
        console.error('❌ Failed to parse pets from localStorage:', e);
        formatted = [];
      }
    }

    // 2️⃣ fallback 使用預設 JSON 檔案
    if (!formatted || formatted.length === 0) {
      formatted = petsRaw.map((item) => ({
        ...item,
        petNote: item.petNote ?? '',
        attackNote: item.attackNote ?? '',
        healthReminder: item.healthReminder ?? '',
      })) as IPet[];
      console.log('✅ Initialized pets from raw JSON');
    }

    return {
      list: formatted,
      originList: formatted,
    };
  },

  actions: {
    setList(pets: IPet[]) {
      this.list = pets;
      localStorage.setItem('pets', JSON.stringify(pets));
    },

    filterList(query: IPetForm) {
      const name = query.name?.toLowerCase().trim() ?? '';
      const petType = query.petType ?? '';
      const petBreed = query.petBreed?.toLowerCase().trim() ?? '';
      const petGender = query.petGender ?? '';

      this.list = this.originList.filter((item) => {
        if (name && !item.name.toLowerCase().includes(name)) return false;
        if (petType && item.petType !== petType) return false;
        if (petBreed && !item.petBreed.toLowerCase().includes(petBreed)) return false;
        if (petGender && item.petGender !== petGender) return false;

        return true;
      });

      if (!name && !petType && !petBreed && !petGender) {
        this.list = this.originList;
      }
    },

    createPet(pet: IPet) {
      this.list.push(pet);
      localStorage.setItem('pets', JSON.stringify(this.list));
    },

    updatePet(updated: IPet) {
      const index = this.list.findIndex((p) => p.id === updated.id);
      if (index !== -1) {
        this.list[index] = updated;
        localStorage.setItem('pets', JSON.stringify(this.list));
      }
    },

    deletePet(id: string) {
      this.list = this.list.filter((p) => p.id !== id);
      localStorage.setItem('pets', JSON.stringify(this.list));
    },

    fetchPetDetail(id: string) {
      return this.list.find((item) => item.id === id);
    },
  },
});
