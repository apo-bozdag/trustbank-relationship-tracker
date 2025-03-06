import { Event, RelationshipStatus, DEFAULT_RELATIONSHIP } from '../types';

const STORAGE_KEY = 'relationship_data';
const VISITED_KEY = 'has_visited_before';

// Kullanıcının daha önce uygulamayı ziyaret edip etmediğini kontrol eder
export const hasVisitedBefore = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(VISITED_KEY) === 'true';
};

// Kullanıcının ziyaret ettiğini işaretler
export const markAsVisited = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(VISITED_KEY, 'true');
  }
};

// İlişki verilerini temizler ve ziyaret işaretini kaldırır (tamamen sıfırlama)
export const clearAllData = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(VISITED_KEY);
  }
};

export const getRelationshipData = (): RelationshipStatus => {
  if (typeof window === 'undefined') {
    return DEFAULT_RELATIONSHIP;
  }
  
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : DEFAULT_RELATIONSHIP;
};

export const saveRelationshipData = (data: RelationshipStatus): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    markAsVisited(); // Veri kaydettiğimizde ziyaret edilmiş olarak işaretle
  }
};

export const resetRelationship = (initialCredit: number = 100, initialTrust: number = 0): RelationshipStatus => {
  // Tamamen yeni bir ilişki oluştur ve olaylar için boş bir dizi tanımla
  const newRelationship = {
    credit: initialCredit,
    trust: initialTrust,
    startDate: new Date().toISOString(),
    events: [] // Olayları tamamen temizle
  };
  
  // Verileri localStorage'a kaydet (ilk ziyaret bayrağını koruyarak)
  saveRelationshipData(newRelationship);
  
  return newRelationship;
};

export const addEvent = (
  event: Omit<Event, 'id' | 'date'>,
  currentState: RelationshipStatus
): RelationshipStatus => {
  const newEvent: Event = {
    ...event,
    id: crypto.randomUUID(),
    date: new Date().toISOString()
  };

  const updatedStatus: RelationshipStatus = {
    ...currentState,
    credit: Math.max(0, currentState.credit + event.creditChange),
    trust: Math.max(0, currentState.trust + event.trustChange),
    events: [...currentState.events, newEvent]
  };

  saveRelationshipData(updatedStatus);
  return updatedStatus;
}; 