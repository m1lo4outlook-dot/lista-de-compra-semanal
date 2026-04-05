export interface ShoppingItem {
  id: string;
  category: string;
  emoji: string;
  product: string;
  quantity: string;
  checked: boolean;
}

export interface CategoryGroup {
  category: string;
  emoji: string;
  items: ShoppingItem[];
}
