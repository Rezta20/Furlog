import type { IPet } from './pet';

export interface IGroomingRecord {
  id: string;
  bookingId: string; // 對應到預約訂單
  petId: string; // 對應到寵物
  groomerId: string; // 美容師
  services: string[]; // 當次服務名稱陣列（也可改成詳細物件）
  photos: string[]; // 上傳的照片網址列表
  mood: 'calm' | 'anxious' | 'aggressive' | 'excited' | 'tired' | 'happy' | 'none'; // 情緒表現
  skinCondition: string; // 皮膚或健康觀察備註
  note: string; // 美容師備註
  createdAt: string; // 建立時間
  nextBookingSuggestion?: string; // 建議下次預約時間（如：2025-07-05）
}
export interface IPetGroomingRecord {
  pet: IPet;
  groomingRecord: IGroomingRecord;
}
