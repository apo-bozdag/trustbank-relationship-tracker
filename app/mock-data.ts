import { RelationshipStatus, Event } from './types';
import { format, subDays, subWeeks, subMonths, addHours } from 'date-fns';

// İlk tanışma tarihini 6 ay öncesine ayarlayalım
const START_DATE = subMonths(new Date(), 6).toISOString();

// Gerçekçi örnek olaylar oluşturalım
const createExampleEvents = (): Event[] => {
  return [
    // Pozitif olaylar
    {
      id: "1",
      type: "positive",
      description: "Doğum günümde sürpriz organizasyon yaptı",
      creditChange: 25,
      trustChange: 18,
      date: subMonths(new Date(), 5).toISOString()
    },
    {
      id: "2",
      type: "positive",
      description: "Hastayken yemeğimi yaptı ve ilaçlarımı getirdi",
      creditChange: 30,
      trustChange: 15,
      date: subMonths(new Date(), 4).toISOString()
    },
    {
      id: "3",
      type: "negative",
      description: "Randevumuzda 1 saat geç kaldı",
      creditChange: -15,
      trustChange: -10,
      date: subMonths(new Date(), 3).toISOString()
    },
    {
      id: "4", 
      type: "positive",
      description: "Zor zamanımda bana destek oldu",
      creditChange: 40,
      trustChange: 35,
      date: subMonths(new Date(), 2).toISOString()
    },
    {
      id: "5",
      type: "negative",
      description: "Arkadaşlarıyla buluşacağız dedi ama gelmedi",
      creditChange: -20,
      trustChange: -25,
      date: subMonths(new Date(), 1).toISOString()
    },
    {
      id: "6",
      type: "positive",
      description: "İş görüşmemden önce motive edici mesaj attı",
      creditChange: 15,
      trustChange: 10,
      date: subWeeks(new Date(), 3).toISOString()
    },
    {
      id: "7",
      type: "negative",
      description: "Ailesiyle tanıştırmayı sürekli erteliyor",
      creditChange: -10,
      trustChange: -20,
      date: subWeeks(new Date(), 2).toISOString()
    },
    {
      id: "8",
      type: "positive",
      description: "Terfi almamı kutlamak için özel yemek hazırladı",
      creditChange: 35,
      trustChange: 20,
      date: subWeeks(new Date(), 1).toISOString()
    },
    {
      id: "9",
      type: "positive",
      description: "Kötü gününde yanına gittiğimde çok mutlu oldu",
      creditChange: 25,
      trustChange: 30,
      date: subDays(new Date(), 5).toISOString()
    },
    {
      id: "10",
      type: "negative",
      description: "Arkadaşlarımla olan planımı iptal etmemi istedi",
      creditChange: -15,
      trustChange: -5,
      date: subDays(new Date(), 2).toISOString()
    },
    {
      id: "11",
      type: "positive",
      description: "Sabah kahvemi hazırlamış ve masaya not bırakmış",
      creditChange: 20,
      trustChange: 15,
      date: addHours(new Date(), -12).toISOString()
    }
  ];
};

// Grafik için ilginç bir hikaye oluşturacak veri seti
export const generateMockData = (): RelationshipStatus => {
  const events = createExampleEvents();
  
  // Olayları tarihe göre sıralayalım
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Kredi ve güven değerlerini hesaplayalım
  let currentCredit = 100;
  let currentTrust = 0;
  
  sortedEvents.forEach(event => {
    currentCredit += event.creditChange;
    currentTrust += event.trustChange;
  });
  
  return {
    credit: currentCredit,
    trust: currentTrust,
    startDate: START_DATE,
    events: sortedEvents
  };
};

// LocalStorage'a kaydet
export const loadMockData = (): void => {
  if (typeof window !== 'undefined') {
    const mockData = generateMockData();
    localStorage.setItem('relationship_data', JSON.stringify(mockData));
    console.log('✅ Mock veriler başarıyla yüklendi!');
    console.log(`💳 Mevcut Kredi: ${mockData.credit}`);
    console.log(`🤝 Mevcut Güven: ${mockData.trust}`);
  }
};

export const clearMockData = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('relationship_data');
    console.log('🗑️ Mock veriler silindi!');
  }
}; 