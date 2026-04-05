import { ShoppingList } from '@/sections/ShoppingList';
import { useShoppingList } from '@/hooks/useShoppingList';

function App() {
  const { items, toggleItem, resetList, addItem, editItem, deleteItem, restoreDefault, progress } = useShoppingList();

  return (
    <ShoppingList
      items={items}
      onToggleItem={toggleItem}
      onReset={resetList}
      onAddItem={addItem}
      onEditItem={editItem}
      onDeleteItem={deleteItem}
      onRestoreDefault={restoreDefault}
      progress={progress}
    />
  );
}

export default App;
