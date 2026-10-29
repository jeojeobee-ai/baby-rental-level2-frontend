export type Category = 'MOBILITY' | 'SLEEP' | 'FEEDING' | 'PLAY';
export type Condition = 'GOOD' | 'FAIR' | 'NEEDS_REPAIR';
export type Method = 'STEAM' | 'UV' | 'WASH';
export type Result = 'PASS' | 'FAIL';
export type ItemStatus =
  | 'AVAILABLE'
  | 'RENTED'
  | 'AWAITING_SANITIZATION'
  | 'NEEDS_RESANITIZATION'
  | 'NEEDS_REPAIR';

export interface Item {
  id: number;
  code: string;
  name: string;
  category: Category;
  minAgeMonths: number;
  maxAgeMonths: number;
  condition: Condition;
  memo: string | null;
  brand: string | null;
  modelName: string | null;
  purchasedAt: string | null;
  imageUrl: string | null;
  status: ItemStatus;
  lastSanitizedAt: string | null;
  hasPendingRequest: boolean;
}

export interface Rental {
  id: number;
  guardianName: string;
  guardianPhone: string;
  childAgeMonths: number;
  rentedAt: string;
  dueDate: string;
  returnedAt: string | null;
}

export interface Sanitization {
  id: number;
  sanitizedAt: string;
  staffName: string;
  method: Method;
  result: Result;
  memo: string | null;
}

export type RequestStatus = 'PENDING' | 'APPROVED' | 'CANCELLED';

export interface RentalRequest {
  id: number;
  itemId: number;
  item?: { id: number; code: string; name: string };
  guardianName: string;
  guardianPhone: string;
  childAgeMonths: number;
  durationDays: number;
  status: RequestStatus;
  approvedAt: string | null;
  cancelledAt: string | null;
  rentalId: number | null;
  createdAt: string;
  elapsedDays: number;
}

export interface Stats {
  totalItems: number;
  rented: number;
  available: number;
}

export interface ItemDetail extends Item {
  requests: RentalRequest[];
  rentals: Rental[];
  sanitizations: Sanitization[];
}
