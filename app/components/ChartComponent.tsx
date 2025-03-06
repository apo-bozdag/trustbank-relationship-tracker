'use client';

import { useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Chart.js bileşenlerini kaydet
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartComponentProps {
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
      tension?: number;
      fill?: any;
      pointRadius?: number;
      pointBackgroundColor?: string;
    }>;
  };
  options: any;
}

export default function ChartComponent({ data, options }: ChartComponentProps) {
  // Sadece client tarafında çalıştığından emin olalım
  useEffect(() => {
    // ChartJS'in client tarafında olduğunu garantile
  }, []);

  return <Line data={data} options={options} />;
} 