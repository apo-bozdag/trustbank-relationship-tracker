'use client';

import { useState, useEffect } from 'react';
import { Event, RelationshipStatus } from './types';
import { getRelationshipData, addEvent, resetRelationship, hasVisitedBefore, markAsVisited } from './services/relationshipService';
import RelationshipChart from './components/RelationshipChart';
import EventList from './components/EventList';
import AddEventForm from './components/AddEventForm';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [relationship, setRelationship] = useState<RelationshipStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [initialCredit, setInitialCredit] = useState(100);
  const [initialTrust, setInitialTrust] = useState(0);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    // İlk yüklenmede verileri localStorage'dan al
    const data = getRelationshipData();
    setRelationship(data);
    
    // Kullanıcının ilk ziyareti mi kontrol et
    const firstVisit = !hasVisitedBefore();
    setIsFirstVisit(firstVisit);
    
    // İlk ziyaretse sıfırlama modalını göster
    if (firstVisit) {
      setShowConfirmReset(true);
    } else {
      markAsVisited(); // Ziyaret edildi olarak işaretle
    }
    
    setLoading(false);
  }, []);

  const handleAddEvent = (event: Omit<Event, 'id' | 'date'>) => {
    if (!relationship) return;
    const updatedRelationship = addEvent(event, relationship);
    setRelationship(updatedRelationship);
  };

  const handleResetRelationship = () => {
    const newRelationship = resetRelationship(initialCredit, initialTrust);
    setRelationship(newRelationship);
    setShowConfirmReset(false);
    markAsVisited(); // Ziyaret edildi olarak işaretle
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!relationship) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center p-8 max-w-md card">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h2 className="text-xl font-bold mb-2">Veri Yüklenirken Hata Oluştu</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">İlişki verilerinize erişilemiyor.</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Yeniden Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 pt-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="card mb-6 border-t-4 border-t-primary-500 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary-100 rounded-full opacity-30"></div>
          <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-secondary-100 rounded-full opacity-30"></div>
          
          <div className="flex justify-between items-center mb-6 relative z-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mevcut Durum</h2>
              <p className="text-gray-600 dark:text-gray-400">
                <span className="inline-flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  Başlangıç: {new Date(relationship.startDate).toLocaleDateString('tr-TR')}
                </span>
              </p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowConfirmReset(true)}
              className="btn-danger"
            >
              Sıfırla
            </motion.button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <motion.div 
              className="stat-card bg-gradient-to-br from-primary-50 to-white dark:from-slate-800 dark:to-slate-900 p-6 rounded-xl border border-primary-100 dark:border-primary-900 relative overflow-hidden"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute right-0 top-0 h-24 w-24 bg-primary-100 dark:bg-primary-900/20 rounded-bl-full"></div>
              <h3 className="text-lg font-medium text-primary-800 dark:text-primary-300 mb-1">Kredi</h3>
              <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 tracking-tight">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={relationship.credit}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {relationship.credit}
                  </motion.span>
                </AnimatePresence>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Başlangıç değeri: {initialCredit}</p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
                <motion.div 
                  className="bg-primary-600 dark:bg-primary-500 rounded-full h-2"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, relationship.credit)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                ></motion.div>
              </div>
            </motion.div>
            
            <motion.div 
              className="stat-card bg-gradient-to-br from-secondary-50 to-white dark:from-slate-800 dark:to-slate-900 p-6 rounded-xl border border-secondary-100 dark:border-secondary-900 relative overflow-hidden"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute right-0 top-0 h-24 w-24 bg-secondary-100 dark:bg-secondary-900/20 rounded-bl-full"></div>
              <h3 className="text-lg font-medium text-secondary-800 dark:text-secondary-300 mb-1">Güven</h3>
              <div className="text-4xl font-bold text-secondary-600 dark:text-secondary-400 tracking-tight">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={relationship.trust}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {relationship.trust}
                  </motion.span>
                </AnimatePresence>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Başlangıç değeri: {initialTrust}</p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
                <motion.div 
                  className="bg-secondary-600 dark:bg-secondary-500 rounded-full h-2"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, relationship.trust)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                ></motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div 
          className="card border-t-4 border-t-primary-500"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="card-header flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Yeni Olay Ekle
          </h2>
          <AddEventForm onAddEvent={handleAddEvent} />
        </motion.div>
        
        <motion.div 
          className="card border-t-4 border-t-secondary-500"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="card-header flex items-center">
            <svg className="w-5 h-5 mr-2 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
            </svg>
            Grafik
          </h2>
          <RelationshipChart relationship={relationship} />
        </motion.div>
      </div>
      
      <motion.div 
        className="card border-t-4 border-t-gray-500"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="card-header flex items-center">
          <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          Olay Geçmişi
        </h2>
        <EventList events={relationship.events} />
      </motion.div>
      
      {/* Sıfırlama Onay Modalı */}
      {showConfirmReset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-sm w-full shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="text-center mb-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 mb-4">
                {isFirstVisit ? (
                  <svg className="h-6 w-6 text-primary-600 dark:text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                  </svg>
                ) : (
                  <svg className="h-6 w-6 text-red-600 dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                )}
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {isFirstVisit ? 'İlişki Başlangıç Değerlerini Ayarla' : 'İlişkiyi Sıfırla'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {isFirstVisit 
                  ? 'İlişkinizin başlangıç değerlerini belirleyebilirsiniz.' 
                  : 'Tüm ilişki verileri sıfırlanacak ve olay geçmişi silinecek. Bu işlem geri alınamaz.'}
              </p>
              
              <div className="space-y-3 mb-4">
                <div>
                  <label htmlFor="initialCredit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left mb-1">
                    Başlangıç Kredi Değeri
                  </label>
                  <input
                    type="number"
                    id="initialCredit"
                    value={initialCredit}
                    onChange={(e) => setInitialCredit(Number(e.target.value))}
                    className="form-input"
                    min="0"
                  />
                </div>
                
                <div>
                  <label htmlFor="initialTrust" className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left mb-1">
                    Başlangıç Güven Değeri
                  </label>
                  <input
                    type="number"
                    id="initialTrust"
                    value={initialTrust}
                    onChange={(e) => setInitialTrust(Number(e.target.value))}
                    className="form-input"
                    min="0"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center space-x-4 mt-6">
              {!isFirstVisit && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowConfirmReset(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  İptal
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleResetRelationship}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isFirstVisit 
                    ? 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500' 
                    : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                }`}
              >
                {isFirstVisit ? 'Başla' : 'Evet, Sıfırla'}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
