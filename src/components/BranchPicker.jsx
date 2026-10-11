import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { branches } from '../config/site.js';
import { useShop } from '../context/ShopContext.jsx';
import { formatPhone } from '../lib/format.js';
import Dialog from './Dialog.jsx';
import Icon from './Icon.jsx';
import Logo from './Logo.jsx';
import './BranchPicker.css';

/*
 * Asks first-time visitors which branch they're ordering from (once the splash
 * has finished). The choice is remembered, shown in the header, and used to
 * prefill checkout. Visitors can still change it at any time.
 */
export default function BranchPicker() {
  const { branchId, setBranchId, branchPickerOpen, openBranchPicker, closeBranchPicker } = useShop();
  const { pathname } = useLocation();
  const asked = useRef(false);
  const titleRef = useRef(null);

  useEffect(() => {
    if (asked.current || branchId || pathname.startsWith('/order/')) return undefined;
    const splash = document.getElementById('splash');
    const timer = setTimeout(() => {
      asked.current = true;
      openBranchPicker();
    }, splash ? 1700 : 350);
    return () => clearTimeout(timer);
  }, [branchId, pathname, openBranchPicker]);

  const choose = (id) => {
    setBranchId(id);
    closeBranchPicker();
  };

  return (
    <Dialog open={branchPickerOpen} onClose={closeBranchPicker} labelledBy="branch-picker-title" className="branch-picker-dialog" initialFocusRef={titleRef}>
      <div className="bp">
        <div className="bp__head">
          <Logo className="bp__logo" />
          <h2 id="branch-picker-title" className="bp__title" ref={titleRef} tabIndex={-1}>Choose your branch</h2>
        </div>
        <ul className="bp__list">
          {branches.map((b, i) => (
            <li key={b.id} style={{ '--i': i }}>
              <button type="button" className={`bp__opt ${branchId === b.id ? 'is-current' : ''}`} onClick={() => choose(b.id)}>
                <span className="bp__pin">
                  <Icon name="pin" size={22} />
                </span>
                <span className="bp__text">
                  {b.area !== b.name && <span className="bp__area">{b.area}</span>}
                  <span className="bp__name">{b.name}</span>
                  <span className="bp__meta">{b.address}</span>
                  <span className="bp__meta bp__phone">{formatPhone(b.phone)}</span>
                </span>
                <Icon name={branchId === b.id ? 'check' : 'arrowRight'} size={20} className="bp__go" />
              </button>
            </li>
          ))}
        </ul>
        <button type="button" className="text-btn bp__later" onClick={closeBranchPicker}>
          Later
        </button>
      </div>
    </Dialog>
  );
}
