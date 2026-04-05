import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RotateCcw, CheckCheck, ShoppingCart, Plus, Pencil, Trash2, X, Save } from 'lucide-react';
import type { ShoppingItem } from '@/types/shopping';
import { useState } from 'react';

interface ShoppingListProps {
  items: ShoppingItem[];
  onToggleItem: (id: string) => void;
  onReset: () => void;
  onAddItem: (product: string, quantity: string, category: string, emoji: string) => void;
  onEditItem: (id: string, updates: Partial<ShoppingItem>) => void;
  onDeleteItem: (id: string) => void;
  onRestoreDefault: () => void;
  progress: {
    total: number;
    checked: number;
    percentage: number;
  };
}

const EMOJIS: Record<string, string> = {
  'PROTEÍNAS': '🥩',
  'GRASAS': '🥑',
  'VERDURAS': '🥦',
  'EXTRAS': '🍋',
  'CARBOHIDRATOS': '🍠',
  'OPCIONAL': '🍓',
  'LÁCTEOS': '🥛',
  'FRUTAS': '🍎',
  'BEBIDAS': '💧',
  'LIMPIEZA': '🧼',
};

export function ShoppingList({ 
  items, 
  onToggleItem, 
  onReset, 
  onAddItem, 
  onEditItem, 
  onDeleteItem,
  onRestoreDefault,
  progress 
}: ShoppingListProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);
  
  // Form states
  const [newProduct, setNewProduct] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [newCategory, setNewCategory] = useState('PROTEÍNAS');

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  const categoryOrder = Object.keys(groupedItems).sort((a, b) => {
    const order = ['PROTEÍNAS', 'GRASAS', 'VERDURAS', 'EXTRAS', 'CARBOHIDRATOS', 'OPCIONAL'];
    const indexA = order.indexOf(a);
    const indexB = order.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  const handleAddItem = () => {
    if (newProduct.trim() && newQuantity.trim()) {
      const emoji = EMOJIS[newCategory] || '📦';
      onAddItem(newProduct.trim(), newQuantity.trim(), newCategory, emoji);
      setNewProduct('');
      setNewQuantity('');
      setShowAddForm(false);
    }
  };

  const handleEditItem = () => {
    if (editingItem && newProduct.trim() && newQuantity.trim()) {
      const emoji = EMOJIS[newCategory] || '📦';
      onEditItem(editingItem.id, {
        product: newProduct.trim(),
        quantity: newQuantity.trim(),
        category: newCategory,
        emoji
      });
      setEditingItem(null);
      setNewProduct('');
      setNewQuantity('');
    }
  };

  const startEdit = (item: ShoppingItem) => {
    setEditingItem(item);
    setNewProduct(item.product);
    setNewQuantity(item.quantity);
    setNewCategory(item.category);
  };

  const cancelEdit = () => {
    setShowAddForm(false);
    setEditingItem(null);
    setNewProduct('');
    setNewQuantity('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Lista de Compra Max.S/100</h1>
                <p className="text-xs text-gray-500">Semanal</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-green-600">{progress.percentage}%</span>
            </div>
          </div>
          
          <Progress value={progress.percentage} className="h-2 mb-3" />
          
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{progress.checked} de {progress.total} productos</span>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsEditing(!isEditing)}
                className={`h-8 px-2 ${isEditing ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Pencil className="w-4 h-4 mr-1" />
                {isEditing ? 'Listo' : 'Editar'}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onReset}
                className="h-8 px-2 text-gray-500 hover:text-gray-700"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Reiniciar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Add Button */}
      {isEditing && (
        <div className="max-w-md mx-auto px-4 pt-4">
          <Button 
            onClick={() => setShowAddForm(true)}
            className="w-full h-12 bg-green-500 hover:bg-green-600 text-white rounded-xl"
          >
            <Plus className="w-5 h-5 mr-2" />
            Agregar producto
          </Button>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {(showAddForm || editingItem) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingItem ? 'Editar producto' : 'Nuevo producto'}
              </h3>
              <button onClick={cancelEdit} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Producto</label>
                <input
                  type="text"
                  value={newProduct}
                  onChange={(e) => setNewProduct(e.target.value)}
                  placeholder="Ej: Leche"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Cantidad</label>
                <input
                  type="text"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(e.target.value)}
                  placeholder="Ej: 1 litro"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Categoría</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500 bg-white"
                >
                  {Object.keys(EMOJIS).map(cat => (
                    <option key={cat} value={cat}>{EMOJIS[cat]} {cat}</option>
                  ))}
                </select>
              </div>
              
              <Button 
                onClick={editingItem ? handleEditItem : handleAddItem}
                className="w-full h-12 bg-green-500 hover:bg-green-600 text-white rounded-xl mt-2"
              >
                <Save className="w-5 h-5 mr-2" />
                {editingItem ? 'Guardar cambios' : 'Agregar'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* List Content */}
      <main className="max-w-md mx-auto px-4 py-4 pb-32">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No hay productos en la lista</p>
            <Button 
              onClick={onRestoreDefault}
              variant="outline"
              className="mt-4"
            >
              Restaurar lista original
            </Button>
          </div>
        ) : (
          categoryOrder.map((category) => {
            const categoryItems = groupedItems[category];
            if (!categoryItems || categoryItems.length === 0) return null;

            const categoryEmoji = categoryItems[0]?.emoji || '📦';
            const allChecked = categoryItems.every(item => item.checked);

            return (
              <section key={category} className="mb-4">
                <div className="flex items-center gap-2 mb-2 px-1">
                  <span className="text-lg">{categoryEmoji}</span>
                  <h2 className={`text-sm font-semibold uppercase tracking-wide ${allChecked ? 'text-gray-400' : 'text-gray-700'}`}>
                    {category}
                  </h2>
                  <div className="flex-1 h-px bg-gray-200 ml-2" />
                </div>
                
                <div className="space-y-2">
                  {categoryItems.map((item) => (
                    <div
                      key={item.id}
                      className={`
                        group flex items-center gap-3 p-3 bg-white rounded-xl border transition-all
                        ${item.checked 
                          ? 'border-gray-200 bg-gray-50' 
                          : 'border-gray-200 shadow-sm'
                        }
                      `}
                    >
                      <div 
                        onClick={() => !isEditing && onToggleItem(item.id)}
                        className={`
                          w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0
                          ${item.checked 
                            ? 'bg-green-500 border-green-500' 
                            : 'border-gray-300'
                          }
                          ${!isEditing ? 'cursor-pointer hover:border-green-400' : ''}
                        `}
                      >
                        {item.checked && (
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      
                      <div 
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => !isEditing && onToggleItem(item.id)}
                      >
                        <p className={`font-medium truncate transition-all ${item.checked ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                          {item.product}
                        </p>
                        <p className={`text-sm ${item.checked ? 'text-gray-300' : 'text-gray-500'}`}>
                          {item.quantity}
                        </p>
                      </div>

                      {isEditing && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => startEdit(item)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteItem(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          })
        )}
      </main>

      {/* Floating Summary */}
      {progress.checked > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-md mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCheck className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {progress.checked === progress.total 
                      ? '¡Lista completada!' 
                      : `${progress.checked} productos listos`
                    }
                  </p>
                  <p className="text-xs text-gray-500">
                    {progress.total - progress.checked} pendientes
                  </p>
                </div>
              </div>
              {progress.checked === progress.total && (
                <span className="text-2xl">🎉</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
