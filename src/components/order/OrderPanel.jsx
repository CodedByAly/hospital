import { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useUI } from '../../context/UIContext';
import { load, save } from '../../lib/storage';
import Sheet from '../Sheet';
import CartStep from './CartStep';
import DetailsStep from './DetailsStep';
import ConfirmationStep from './ConfirmationStep';
import './Order.css';

const LAST_ORDER_KEY = 'talia.lastOrder.v1';

export default function OrderPanel() {
  const { orderOpen, closeOrder } = useUI();
  const cart = useCart();
  const [step, setStep] = useState('cart');
  const [lastOrder, setLastOrder] = useState(() => load(LAST_ORDER_KEY, null));

  // Every time the panel opens, start from the order list (or the receipt if nothing new was added).
  useEffect(() => {
    if (orderOpen) setStep((s) => (s === 'done' && cart.count === 0 ? 'done' : 'cart'));
    // only react to opening
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderOpen]);

  const placeOrder = (order) => {
    save(LAST_ORDER_KEY, order);
    setLastOrder(order);
    cart.clear();
    setStep('done');
  };

  return (
    <Sheet open={orderOpen} onClose={closeOrder} variant="drawer" labelledBy="order-title" className="sheet--order">
      <div className={`order order--${step}`}>
        {step === 'cart' && (
          <CartStep
            onNext={() => setStep('details')}
            onClose={closeOrder}
            lastOrder={lastOrder}
            onShowLast={() => setStep('done')}
          />
        )}
        {step === 'details' && <DetailsStep onBack={() => setStep('cart')} onClose={closeOrder} onPlace={placeOrder} />}
        {step === 'done' && lastOrder && (
          <ConfirmationStep
            order={lastOrder}
            onClose={closeOrder}
            onNew={() => {
              setStep('cart');
              closeOrder();
              document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        )}
      </div>
    </Sheet>
  );
}
