export type EventType = 'positive' | 'negative';

export interface Event {
  id: string;
  type: EventType;
  description: string;
  creditChange: number;
  trustChange: number;
  date: string;
}

export interface RelationshipStatus {
  credit: number;
  trust: number;
  startDate: string;
  events: Event[];
}

export const DEFAULT_RELATIONSHIP: RelationshipStatus = {
  credit: 100,
  trust: 0,
  startDate: new Date().toISOString(),
  events: []
}; 