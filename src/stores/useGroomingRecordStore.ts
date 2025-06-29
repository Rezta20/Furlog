// src/stores/useGroomingRecordStore.ts
import { defineStore } from 'pinia';
import type { IGroomingRecord } from '../types/groomingRecord';
import groomingRecordsRaw from 'src/data/groomingRecord.json';
import type { IBooking } from '../types/booking';
import type { IPetGroomingRecord } from '../types/groomingRecord';
import { getNowDateTimeString } from '../utils/datetime';

// └─ 你需要先建立一個 data/groomingRecords.json，內容可參考範例資料

export const useGroomingRecordStore = defineStore('groomingRecord', {
  state: () => {
    let formatted: IGroomingRecord[] = [];

    // 1️⃣ 優先從 localStorage 讀取
    const saved = localStorage.getItem('groomingRecords');
    if (saved) {
      try {
        formatted = JSON.parse(saved);
        console.log('✅ Initialized groomingRecords from localStorage');
      } catch (e) {
        console.error('❌ Failed to parse groomingRecords from localStorage:', e);
        formatted = [];
      }
    }

    // 2️⃣ fallback 使用預設 JSON 檔案
    if (!formatted || formatted.length === 0) {
      formatted = groomingRecordsRaw.map((item) => ({
        ...item,
        services: Array.isArray(item.services) ? item.services : [],
        photos: Array.isArray(item.photos) ? item.photos : [],
        mood: item.mood ?? 'calm',
        skinCondition: item.skinCondition ?? '',
        note: item.note ?? '',
        nextBookingSuggestion: item.nextBookingSuggestion ?? '',
      })) as IGroomingRecord[];
      localStorage.setItem('groomingRecords', JSON.stringify(formatted));
      console.log('✅ Initialized groomingRecords from raw JSON');
    }

    return {
      list: formatted,
      originList: formatted,
    };
  },
  actions: {
    setList(records: IGroomingRecord[]) {
      this.list = records;
      localStorage.setItem('groomingRecords', JSON.stringify(this.list));
    },

    // 依照條件篩選（例如依 petId）
    filterByPet(petId: string) {
      this.list = this.originList.filter((r: IGroomingRecord) => r.petId === petId);
    },

    // 新增美容紀錄
    createRecord(record: IGroomingRecord) {
      this.list.push(record);
      localStorage.setItem('groomingRecords', JSON.stringify(this.list));
    },

    // 更新美容紀錄
    updateRecord(updated: IGroomingRecord) {
      const index = this.list.findIndex((r: IGroomingRecord) => r.id === updated.id);
      if (index !== -1) {
        this.list[index] = updated;
        localStorage.setItem('groomingRecords', JSON.stringify(this.list));
      }
    },

    // 刪除美容紀錄
    deleteRecord(recordId: string) {
      this.list = this.list.filter((r: IGroomingRecord) => r.id !== recordId);
      localStorage.setItem('groomingRecords', JSON.stringify(this.list));
    },

    // 取得單筆紀錄
    fetchRecordDetail(recordId: string) {
      return this.list.find((r: IGroomingRecord) => r.id === recordId);
    },

    // 取得某隻寵物所有紀錄（可用於寵物詳情頁面）
    fetchByPetId(petId: string) {
      return this.originList
        .filter((r: IGroomingRecord) => r.petId === petId)
        .sort((a: { createdAt: string }, b: { createdAt: string }) =>
          b.createdAt.localeCompare(a.createdAt),
        );
    },

    initPetGroomingRecords(booking: IBooking, bookingId: string): IPetGroomingRecord[] {
      return booking.pet.map((pet) => {
        const existing = this.list.find((r) => r.petId === pet.id && r.bookingId === bookingId);

        return {
          pet,
          groomingRecord: existing || {
            id: '',
            petId: pet.id,
            bookingId: bookingId,
            groomerId: '',
            services: [],
            photos: [],
            mood: 'none',
            skinCondition: '',
            note: '',
            createdAt: getNowDateTimeString(),
            updatedAt: getNowDateTimeString(),
          },
        };
      });
    },
    saveGroomingRecord(records: IPetGroomingRecord[]) {
      const updatedPets: string[] = [];
      const createdPets: string[] = [];

      records.forEach(({ pet, groomingRecord }) => {
        groomingRecord.updatedAt = getNowDateTimeString();

        if (groomingRecord.id) {
          this.updateRecord(groomingRecord);
          updatedPets.push(pet.name);
        } else {
          groomingRecord.createdAt = getNowDateTimeString();
          this.createRecord(groomingRecord);
          createdPets.push(pet.name);
        }
      });

      return { updatedPets, createdPets };
    },
  },
});
