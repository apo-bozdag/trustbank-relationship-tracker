'use client';

import { Event } from '../types';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { motion } from 'framer-motion';

interface EventListProps {
  events: Event[];
}

export default function EventList({ events }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Henüz Olay Yok</h3>
        <p className="text-gray-500 dark:text-gray-400">İlişkinize ait olayları ekleyerek takip etmeye başlayın.</p>
      </div>
    );
  }

  // Olayları tarihe göre sırala (en yeni en üstte)
  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Animasyon varyantları
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="overflow-hidden">
      <div className="sm:rounded-md">
        <motion.ul 
          className="divide-y divide-gray-200 dark:divide-gray-700"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {sortedEvents.map((event, index) => (
            <motion.li 
              key={event.id}
              variants={item}
              className={`relative hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors duration-200 ${
                index === 0 ? 'bg-gray-50/50 dark:bg-slate-800/50' : ''
              }`}
            >
              <div className="px-4 py-5 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                      event.type === 'positive' 
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
                        : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                    }`}>
                      {event.type === 'positive' ? (
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                      ) : (
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {event.description}
                      </h4>
                      <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <span>
                          {format(new Date(event.date), 'dd MMMM yyyy, HH:mm', { locale: tr })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <div className="text-right">
                      <div className={`text-sm font-medium ${
                        event.creditChange >= 0 ? 'text-primary-600 dark:text-primary-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {event.creditChange >= 0 ? '+' : ''}{event.creditChange} kredi
                      </div>
                      <div className={`text-sm font-medium ${
                        event.trustChange >= 0 ? 'text-secondary-600 dark:text-secondary-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {event.trustChange >= 0 ? '+' : ''}{event.trustChange} güven
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </div>
  );
} 