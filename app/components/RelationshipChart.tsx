'use client';

import { useState, useEffect } from 'react';
import { RelationshipStatus } from '../types';
import { format, parseISO, addDays, differenceInDays, isAfter } from 'date-fns';
import { tr } from 'date-fns/locale';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

// Boş veri durumu
function EmptyChart() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center text-gray-500 dark:text-gray-400">
        <svg className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
        <p>Seçilen zaman aralığında veri bulunmuyor</p>
      </div>
    </div>
  );
}

// Özel tooltip bileşeni
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 p-3 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

// Ana bileşen
interface RelationshipChartProps {
  relationship: RelationshipStatus;
}

export default function RelationshipChart({ relationship }: RelationshipChartProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'month' | 'week'>('all');
  const [chartData, setChartData] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Client tarafında olduğumuzu kontrol et
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Periyot değiştiğinde ya da ilişki verisi değiştiğinde grafiği güncelle
  useEffect(() => {
    // Veriyi hazırla
    if (isClient) {
      prepareChartData(relationship, activeTab);
    }
  }, [relationship, activeTab, isClient]);

  // Recharts için veri hazırlama
  const prepareChartData = (
    relationship: RelationshipStatus, 
    period: 'all' | 'month' | 'week',
  ) => {
    // Eğer olay yoksa sadece başlangıç değerini göster
    if (!relationship.events.length) {
      const startDate = parseISO(relationship.startDate);
      
      setChartData([{
        date: format(startDate, 'dd MMM', { locale: tr }),
        Kredi: relationship.credit,
        Güven: relationship.trust
      }]);
      return;
    }

    // Olayları tarihe göre sırala (eskiden yeniye)
    const sortedEvents = [...relationship.events].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Filtreleme için zaman aralığı belirle
    const now = new Date();
    let filterDate = new Date(0); // Başlangıç tarihi (1970)
    
    if (period === 'week') {
      filterDate = addDays(now, -7); // Son 7 gün
    } else if (period === 'month') {
      filterDate = addDays(now, -30); // Son 30 gün
    }
    
    // Başlangıç değerlerini ekle
    const startDate = parseISO(relationship.startDate);
    
    const dataPoints: {
      date: Date;
      formattedDate: string;
      Kredi: number;
      Güven: number;
    }[] = [];
    
    // Başlangıç noktası (sadece zaman aralığı içindeyse veya tüm zamanı görüntülüyorsak)
    if (period === 'all' || isAfter(startDate, filterDate)) {
      dataPoints.push({
        date: startDate,
        formattedDate: format(startDate, 'dd MMM', { locale: tr }),
        Kredi: relationship.credit, // Başlangıçta kullanıcının seçtiği kredi değeri
        Güven: relationship.trust // Başlangıçta kullanıcının seçtiği güven değeri
      });
    }

    // Hiç olay yoksa başlangıç değerlerini göster ve çık
    if (sortedEvents.length === 0) {
      setChartData(dataPoints.map(point => ({
        date: point.formattedDate,
        Kredi: point.Kredi,
        Güven: point.Güven
      })));
      return;
    }

    // Başlangıç kredi ve güven değerleri 
    let currentCredit = relationship.credit;
    let currentTrust = relationship.trust;
    
    // Filtrelenen olaylar öncesindeki son durumu hesapla
    const filteredEvents = sortedEvents.filter(event => isAfter(new Date(event.date), filterDate));
    const preFilteredEvents = sortedEvents.filter(event => !isAfter(new Date(event.date), filterDate));
    
    // Filtrelenen olaylar öncesindeki son durumu hesapla (başlangıç değerlerine göre değişimleri hesapla)
    preFilteredEvents.forEach(event => {
      currentCredit += event.creditChange;
      currentTrust += event.trustChange;
    });
    
    // Filtrelenen zaman aralığı başlangıcında bir veri noktası ekle
    if (period !== 'all' && preFilteredEvents.length > 0) {
      dataPoints.push({
        date: filterDate,
        formattedDate: format(filterDate, 'dd MMM', { locale: tr }),
        Kredi: currentCredit,
        Güven: currentTrust
      });
    }
    
    // Filtrelenen olayları ekle
    filteredEvents.forEach(event => {
      currentCredit += event.creditChange;
      currentTrust += event.trustChange;
      
      const eventDate = parseISO(event.date);
      dataPoints.push({
        date: eventDate,
        formattedDate: format(eventDate, 'dd MMM', { locale: tr }),
        Kredi: currentCredit,
        Güven: currentTrust
      });
    });
    
    // Bugünkü durumu ekle (son olaydan sonra değişiklik yoksa)
    const lastPoint = dataPoints[dataPoints.length - 1];
    if (lastPoint && differenceInDays(now, lastPoint.date) > 0) {
      dataPoints.push({
        date: now,
        formattedDate: format(now, 'dd MMM', { locale: tr }),
        Kredi: currentCredit,
        Güven: currentTrust
      });
    }
    
    // Veri noktası yoksa boş grafik göster
    if (dataPoints.length === 0) {
      setChartData([]);
      return;
    }

    // Recharts için veri formatını oluştur
    setChartData(dataPoints.map(point => ({
      date: point.formattedDate,
      Kredi: point.Kredi,
      Güven: point.Güven
    })));
  };

  // Sekme butonu bileşeni
  const TabButton = ({ label, value, currentValue, onClick }: { 
    label: string, 
    value: 'all' | 'month' | 'week', 
    currentValue: string, 
    onClick: (value: 'all' | 'month' | 'week') => void 
  }) => (
    <button
      className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
        currentValue === value 
          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' 
          : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
      }`}
      onClick={() => onClick(value)}
    >
      {label}
    </button>
  );

  // Henüz client tarafında değilse, yükleme göstergesi
  if (!isClient) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end space-x-2 mb-4 opacity-50">
          <TabButton label="Tüm Zamanlar" value="all" currentValue={activeTab} onClick={setActiveTab} />
          <TabButton label="Son 30 Gün" value="month" currentValue={activeTab} onClick={setActiveTab} />
          <TabButton label="Son 7 Gün" value="week" currentValue={activeTab} onClick={setActiveTab} />
        </div>
        
        <motion.div 
          className="h-64 md:h-80 bg-white dark:bg-slate-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-500 dark:text-gray-400">Grafik yükleniyor...</p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end space-x-2 mb-4">
        <TabButton label="Tüm Zamanlar" value="all" currentValue={activeTab} onClick={setActiveTab} />
        <TabButton label="Son 30 Gün" value="month" currentValue={activeTab} onClick={setActiveTab} />
        <TabButton label="Son 7 Gün" value="week" currentValue={activeTab} onClick={setActiveTab} />
      </div>
      
      <motion.div 
        className="h-64 md:h-80 bg-white dark:bg-slate-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700"
        key={activeTab} // Sekme değişiminde animasyonu tetikle
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {chartData && chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 5,
                right: 20,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="Kredi" 
                stroke="#6366f1" 
                fill="rgba(99, 102, 241, 0.1)" 
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
              <Area 
                type="monotone" 
                dataKey="Güven" 
                stroke="#14b8a6" 
                fill="rgba(20, 184, 166, 0.1)" 
                strokeWidth={2}
                activeDot={{ r: 8 }} 
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChart />
        )}
      </motion.div>
    </div>
  );
} 