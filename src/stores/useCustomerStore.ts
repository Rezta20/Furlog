// src/stores/useCustomerStore.ts
import { defineStore } from 'pinia';
import type { ICustomerForm, ICustomer } from 'src/types/customer';
import customersRaw from 'src/data/customer.json'; // ⬅️ 你需要有這個 JSON 檔案

export const useCustomerStore = defineStore('customer', {
  state: () => {
    let formatted: ICustomer[] = [];

    // 1️⃣ 從 localStorage 讀取
    const saved = localStorage.getItem('customers');
    if (saved) {
      try {
        formatted = JSON.parse(saved);
        console.log('✅ Initialized customers from localStorage');
      } catch (e) {
        console.error('❌ Failed to parse customers from localStorage:', e);
        formatted = [];
      }
    }

    // 2️⃣ fallback 使用預設假資料
    if (!formatted || formatted.length === 0) {
      formatted = customersRaw.map((item) => ({
        ...item,
        // 確保格式正確（可加入預設欄位處理）
        note: item.note ?? '',
      })) as ICustomer[];
      console.log('✅ Initialized customers from raw JSON');
    }

    return {
      list: formatted,
      originList: formatted,
    };
  },

  actions: {
    setList(customers: ICustomer[]) {
      this.list = customers;
      localStorage.setItem('customers', JSON.stringify(customers));
    },

    filterList(query: ICustomerForm) {
      const name = query.name?.toLowerCase().trim() ?? '';
      const phone = query.phone?.trim() ?? '';
      const email = query.email?.toLowerCase().trim() ?? '';

      this.list = this.originList.filter((item) => {
        // 姓名模糊查詢
        if (name && !item.name.toLowerCase().includes(name)) return false;

        // 電話模糊查詢
        if (phone && !item.phone.includes(phone)) return false;

        // 信箱模糊查詢
        if (email && !item.email.toLowerCase().includes(email)) return false;

        // 👇 可在這裡繼續補其他欄位條件（如 created_at、note 等）
        return true;
      });

      // 如果全部欄位都沒填，則回傳完整資料
      if (!name && !phone && !email) {
        this.list = this.originList;
      }
    },

    createCustomer(customer: ICustomer) {
      this.list.push(customer);

      localStorage.setItem('customers', JSON.stringify(this.list));
    },

    updateCustomer(updated: ICustomer) {
      const index = this.list.findIndex((c) => c.id === updated.id);
      if (index !== -1) {
        this.list[index] = updated;
        localStorage.setItem('customers', JSON.stringify(this.list));
      }
    },

    deleteCustomer(id: string) {
      this.list = this.list.filter((c) => c.id !== id);
      localStorage.setItem('customers', JSON.stringify(this.list));
    },

    fetchCustomerDetail(id: string) {
      // 假資料篩選邏輯，實際上你可以改成 fetch 或 axios 請求
      const result = this.list.find((item) => item.id === id);
      return result;
    },
  },
});
