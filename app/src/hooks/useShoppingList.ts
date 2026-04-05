import { useState, useEffect } from 'react';
import type { ShoppingItem } from '@/types/shopping';

const initialItems: ShoppingItem[] = [
  { id: '1', category: 'PROTEÍNAS', emoji: '🥚', product: 'Huevos', quantity: '18–20 unidades', checked: false },
  { id: '2', category: 'PROTEÍNAS', emoji: '🥩', product: 'Pollo', quantity: '1 kg', checked: false },
  { id: '3', category: 'PROTEÍNAS', emoji: '🥩', product: 'Carne de res', quantity: '400 g', checked: false },
  { id: '4', category: 'PROTEÍNAS', emoji: '🐟', product: 'Caballa enlatada', quantity: '3 latas', checked: false },
  { id: '5', category: 'PROTEÍNAS', emoji: '🐟', product: 'Sardinas enlatadas o atún enlatado', quantity: '1 lata', checked: false },
  { id: '6', category: 'GRASAS', emoji: '🥑', product: 'Palta', quantity: '3 unidades', checked: false },
  { id: '7', category: 'VERDURAS', emoji: '🥦', product: 'Lechuga', quantity: '1 unidad', checked: false },
  { id: '8', category: 'VERDURAS', emoji: '🥦', product: 'Tomate', quantity: '4 unidades', checked: false },
  { id: '9', category: 'VERDURAS', emoji: '🥦', product: 'Zanahoria', quantity: '½ kg', checked: false },
  { id: '10', category: 'VERDURAS', emoji: '🥦', product: 'Col (repollo)', quantity: '1 unidad', checked: false },
  { id: '11', category: 'VERDURAS', emoji: '🥦', product: 'Pepino', quantity: '2 unidades', checked: false },
  { id: '12', category: 'EXTRAS', emoji: '🍋', product: 'Limón', quantity: '10 unidades', checked: false },
  { id: '13', category: 'CARBOHIDRATOS', emoji: '🍠', product: 'Camote', quantity: '1 kg', checked: false },
  { id: '14', category: 'OPCIONAL', emoji: '🍓', product: 'Fresa', quantity: '500 g', checked: false },
];

export function useShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('shoppingList');
      return saved ? JSON.parse(saved) : initialItems;
    }
    return initialItems;
  });

  useEffect(() => {
    localStorage.setItem('shoppingList', JSON.stringify(items));
  }, [items]);

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const resetList = () => {
    setItems(initialItems.map(item => ({ ...item, checked: false })));
  };

  const clearAll = () => {
    setItems(prev => prev.map(item => ({ ...item, checked: true })));
  };

  // Agregar nuevo producto
  const addItem = (product: string, quantity: string, category: string, emoji: string) => {
    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      category,
      emoji,
      product,
      quantity,
      checked: false
    };
    setItems(prev => [...prev, newItem]);
  };

  // Editar producto existente
  const editItem = (id: string, updates: Partial<ShoppingItem>) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  // Eliminar producto
  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  // Restaurar lista original
  const restoreDefault = () => {
    setItems(initialItems.map(item => ({ ...item, checked: false })));
  };

  const progress = {
    total: items.length,
    checked: items.filter(item => item.checked).length,
    percentage: Math.round((items.filter(item => item.checked).length / items.length) * 100)
  };

  return { items, toggleItem, resetList, clearAll, addItem, editItem, deleteItem, restoreDefault, progress };
}
