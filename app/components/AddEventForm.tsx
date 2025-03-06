'use client';

import { useState } from 'react';
import { Event, EventType } from '../types';
import { motion } from 'framer-motion';

interface AddEventFormProps {
  onAddEvent: (event: Omit<Event, 'id' | 'date'>) => void;
}

export default function AddEventForm({ onAddEvent }: AddEventFormProps) {
  const [type, setType] = useState<EventType>('positive');
  const [description, setDescription] = useState('');
  const [creditChange, setCreditChange] = useState(0);
  const [trustChange, setTrustChange] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description) return;
    
    setIsSubmitting(true);
    
    // Olayın türüne göre değişim değerlerini ayarla
    const finalCreditChange = type === 'positive' ? Math.abs(creditChange) : -Math.abs(creditChange);
    const finalTrustChange = type === 'positive' ? Math.abs(trustChange) : -Math.abs(trustChange);
    
    onAddEvent({
      type,
      description,
      creditChange: finalCreditChange,
      trustChange: finalTrustChange
    });
    
    // Başarı mesajını göster
    setSuccessMessage('Olay başarıyla eklendi!');
    
    // Formu sıfırla
    setDescription('');
    setCreditChange(0);
    setTrustChange(0);
    setIsSubmitting(false);
    
    // 3 saniye sonra başarı mesajını kaldır
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {successMessage && (
        <motion.div 
          className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">{successMessage}</p>
            </div>
          </div>
        </motion.div>
      )}
      
      <div className="mb-6">
        <label className="form-label">Olay Türü</label>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <motion.div 
            className={`relative rounded-lg overflow-hidden cursor-pointer ${
              type === 'positive' ? 'ring-2 ring-primary-500' : 'border border-gray-200 dark:border-gray-700'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setType('positive')}
          >
            <input
              type="radio"
              className="sr-only"
              name="event-type"
              value="positive"
              checked={type === 'positive'}
              onChange={() => setType('positive')}
            />
            <div className={`p-4 text-center ${
              type === 'positive' 
                ? 'bg-primary-50 dark:bg-primary-900/30' 
                : 'bg-gray-50 dark:bg-gray-800'
            }`}>
              <svg className="w-8 h-8 mx-auto text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              <div className={`mt-2 font-medium ${
                type === 'positive' 
                  ? 'text-primary-700 dark:text-primary-300' 
                  : 'text-gray-700 dark:text-gray-300'
              }`}>
                Olumlu
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className={`relative rounded-lg overflow-hidden cursor-pointer ${
              type === 'negative' ? 'ring-2 ring-red-500' : 'border border-gray-200 dark:border-gray-700'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setType('negative')}
          >
            <input
              type="radio"
              className="sr-only"
              name="event-type"
              value="negative"
              checked={type === 'negative'}
              onChange={() => setType('negative')}
            />
            <div className={`p-4 text-center ${
              type === 'negative' 
                ? 'bg-red-50 dark:bg-red-900/30' 
                : 'bg-gray-50 dark:bg-gray-800'
            }`}>
              <svg className="w-8 h-8 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2" />
              </svg>
              <div className={`mt-2 font-medium ${
                type === 'negative' 
                  ? 'text-red-700 dark:text-red-300' 
                  : 'text-gray-700 dark:text-gray-300'
              }`}>
                Olumsuz
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <div>
        <label htmlFor="description" className="form-label">
          Açıklama
        </label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-input"
          placeholder="Olayı kısaca açıklayın"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="creditChange" className="form-label">
            Kredi Değişimi
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">{type === 'positive' ? '+' : '-'}</span>
            </div>
            <input
              type="number"
              id="creditChange"
              value={creditChange}
              onChange={(e) => setCreditChange(Number(e.target.value))}
              className="form-input pl-7"
              min="0"
              required
              placeholder="0"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">puan</span>
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="trustChange" className="form-label">
            Güven Değişimi
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">{type === 'positive' ? '+' : '-'}</span>
            </div>
            <input
              type="number"
              id="trustChange"
              value={trustChange}
              onChange={(e) => setTrustChange(Number(e.target.value))}
              className="form-input pl-7"
              min="0"
              required
              placeholder="0"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">puan</span>
            </div>
          </div>
        </div>
      </div>
      
      <motion.button
        type="submit"
        className="w-full btn-primary mt-6"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="inline-flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            İşleniyor...
          </span>
        ) : (
          <span className="inline-flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Olay Ekle
          </span>
        )}
      </motion.button>
    </form>
  );
} 