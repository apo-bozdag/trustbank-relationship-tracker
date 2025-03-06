'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { RelationshipStatus } from '../types';
import { format, parseISO, addDays, differenceInDays } from 'date-fns';
import { tr } from 'date-fns/locale';
import { motion } from 'framer-motion';
import type { ChartData, ChartOptions } from 'chart.js';

// Chart.js bileşenlerini dynamic import ile sadece client tarafında yükle
const LineChart = dynamic(
  () => import('react-chartjs-2').then(mod => {
    // Chart.js'i sadece client tarafında import et ve kaydet
    import('chart.js').then(ChartJS => {
      const { 
        Chart, 
        CategoryScale, 
        LinearScale, 
        PointElement, 
        LineElement, 
        Title, 
        Tooltip, 
        Legend,
        Filler 
      } = ChartJS;
      
      // Chart.js bileşenlerini kaydet
      Chart.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend,
        Filler
      );
    });
    return mod.Line;
  }),
  { ssr: false } // SSR'yi devre dışı bırak
);

interface RelationshipChartProps {
  relationship: RelationshipStatus;
}

export default function RelationshipChart({ relationship }: RelationshipChartProps) {
  const [chartData, setChartData] = useState<ChartData<'line'>>({
    labels: [],
    datasets: []
  });
  const [activeTab, setActiveTab] = useState<'all' | 'month' | 'week'>('all');
  const [isClient, setIsClient] = useState(false);
  const chartRef = useRef<any>(null);

  // Client tarafında olduğumuzu kontrol et
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      // Grafik verisini hazırla
      prepareChartData(relationship, activeTab);
    }
  }, [relationship, activeTab, isClient]);

  const prepareChartData = (relationship: RelationshipStatus, period: 'all' | 'month' | 'week') => {
    if (!relationship.events.length) {
      // Henüz olay yoksa, sadece başlangıç değerini göster
      const startDate = parseISO(relationship.startDate);
      
      const labels = [
        format(startDate, 'dd MMM', { locale: tr })
      ];
      
      setChartData({
        labels,
        datasets: [
          {
            label: 'Kredi',
            data: [relationship.credit],
            borderColor: 'rgb(99, 102, 241)',
            backgroundColor: 'rgba(99, 102, 241, 0.5)',
            borderWidth: 3,
            pointRadius: 5,
            pointBackgroundColor: 'rgb(99, 102, 241)',
            tension: 0.3,
            fill: {
              target: 'origin',
              above: 'rgba(99, 102, 241, 0.1)'
            }
          },
          {
            label: 'Güven',
            data: [relationship.trust],
            borderColor: 'rgb(20, 184, 166)',
            backgroundColor: 'rgba(20, 184, 166, 0.5)',
            borderWidth: 3,
            pointRadius: 5,
            pointBackgroundColor: 'rgb(20, 184, 166)',
            tension: 0.3,
            fill: {
              target: 'origin',
              above: 'rgba(20, 184, 166, 0.1)'
            }
          },
        ],
      });
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
      credit: number;
      trust: number;
    }[] = [];
    
    // Başlangıç noktası (sadece zaman aralığı içindeyse veya tüm zamanı görüntülüyorsak)
    if (period === 'all' || startDate >= filterDate) {
      dataPoints.push({
        date: startDate,
        credit: relationship.credit, // Başlangıçta kullanıcının seçtiği kredi değeri
        trust: relationship.trust // Başlangıçta kullanıcının seçtiği güven değeri
      });
    }

    // Hiç olay yoksa başlangıç değerlerini göster ve çık
    if (sortedEvents.length === 0) {
      const labels = dataPoints.map(point => 
        format(point.date, 'dd MMM', { locale: tr })
      );
      
      setChartData({
        labels,
        datasets: [
          {
            label: 'Kredi',
            data: dataPoints.map(point => point.credit),
            borderColor: 'rgb(99, 102, 241)',
            backgroundColor: 'rgba(99, 102, 241, 0.5)',
            borderWidth: 3,
            pointRadius: 5,
            pointBackgroundColor: 'rgb(99, 102, 241)',
            tension: 0.3,
            fill: {
              target: 'origin',
              above: 'rgba(99, 102, 241, 0.1)'
            }
          },
          {
            label: 'Güven',
            data: dataPoints.map(point => point.trust),
            borderColor: 'rgb(20, 184, 166)',
            backgroundColor: 'rgba(20, 184, 166, 0.5)',
            borderWidth: 3,
            pointRadius: 5,
            pointBackgroundColor: 'rgb(20, 184, 166)',
            tension: 0.3,
            fill: {
              target: 'origin',
              above: 'rgba(20, 184, 166, 0.1)'
            }
          },
        ],
      });
      return;
    }

    // Başlangıç kredi ve güven değerleri 
    let currentCredit = relationship.credit;
    let currentTrust = relationship.trust;
    
    // Filtrelenen olaylar öncesindeki son durumu hesapla
    const filteredEvents = sortedEvents.filter(event => new Date(event.date) >= filterDate);
    const preFilteredEvents = sortedEvents.filter(event => new Date(event.date) < filterDate);
    
    // Filtrelenen olaylar öncesindeki son durumu hesapla (başlangıç değerlerine göre değişimleri hesapla)
    preFilteredEvents.forEach(event => {
      currentCredit += event.creditChange;
      currentTrust += event.trustChange;
    });
    
    // Filtrelenen zaman aralığı başlangıcında bir veri noktası ekle
    if (period !== 'all' && preFilteredEvents.length > 0) {
      dataPoints.push({
        date: filterDate,
        credit: currentCredit,
        trust: currentTrust
      });
    }
    
    // Filtrelenen olayları ekle
    filteredEvents.forEach(event => {
      currentCredit += event.creditChange;
      currentTrust += event.trustChange;
      
      dataPoints.push({
        date: parseISO(event.date),
        credit: currentCredit,
        trust: currentTrust
      });
    });
    
    // Bugünkü durumu ekle (son olaydan sonra değişiklik yoksa)
    const lastPoint = dataPoints[dataPoints.length - 1];
    if (lastPoint && differenceInDays(now, lastPoint.date) > 0) {
      dataPoints.push({
        date: now,
        credit: currentCredit,
        trust: currentTrust
      });
    }
    
    // Veri noktası yoksa boş grafik göster
    if (dataPoints.length === 0) {
      setChartData({
        labels: [],
        datasets: []
      });
      return;
    }

    // Grafik verilerini oluştur
    const labels = dataPoints.map(point => 
      format(point.date, 'dd MMM', { locale: tr })
    );
    
    setChartData({
      labels,
      datasets: [
        {
          label: 'Kredi',
          data: dataPoints.map(point => point.credit),
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: 'rgba(99, 102, 241, 0.5)',
          borderWidth: 3,
          pointRadius: 5,
          pointBackgroundColor: 'rgb(99, 102, 241)',
          tension: 0.3,
          fill: {
            target: 'origin',
            above: 'rgba(99, 102, 241, 0.1)'
          }
        },
        {
          label: 'Güven',
          data: dataPoints.map(point => point.trust),
          borderColor: 'rgb(20, 184, 166)',
          backgroundColor: 'rgba(20, 184, 166, 0.5)',
          borderWidth: 3,
          pointRadius: 5,
          pointBackgroundColor: 'rgb(20, 184, 166)',
          tension: 0.3,
          fill: {
            target: 'origin',
            above: 'rgba(20, 184, 166, 0.1)'
          }
        },
      ],
    });
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 10,
          boxHeight: 10,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        titleColor: '#1f2937',
        bodyColor: '#4b5563',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value}`;
          }
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    elements: {
      line: {
        borderWidth: 3,
        borderJoinStyle: 'round'
      },
      point: {
        hoverRadius: 8,
        hoverBorderWidth: 2
      }
    }
  };

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

  // İlk renderda henüz client tarafında değilsek veya veri hazır değilse, loading göster
  if (!isClient) {
    return (
      <div className="h-64 md:h-80 bg-white dark:bg-slate-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500 dark:text-gray-400">Grafik yükleniyor...</p>
        </div>
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
        {chartData.labels?.length ? (
          <LineChart data={chartData} options={options} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              <p>Seçilen zaman aralığında veri bulunmuyor</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
} 