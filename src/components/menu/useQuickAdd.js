import { useCart } from '../../context/CartContext';
import { useUI } from '../../context/UIContext';
import { flyToCart } from '../../lib/flyToCart';
import { needsChoices } from '../../lib/pricing';

// One tap from the menu list: adds a single portion, or opens the dish
// when it has choices that must be made first.
export function useQuickAdd() {
  const { add } = useCart();
  const { openItem, showToast } = useUI();

  return (item, sourceEl) => {
    if (item.price == null) return;
    if (needsChoices(item)) {
      openItem(item.id);
      return;
    }
    add(item.id, 1);
    flyToCart(sourceEl);
    showToast(`${item.name} added to your order`);
  };
}
