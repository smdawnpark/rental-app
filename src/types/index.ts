export interface Item {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  status: 'available' | 'rented';
  borrower?: string;
  rentedAt?: Date;
  dueDate?: Date;
}

export interface RentalHistory {
  id: string;
  itemId: string;
  itemName: string;
  borrower: string;
  rentedAt: Date;
  returnedAt?: Date;
  status: 'active' | 'returned';
}
