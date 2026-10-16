import { useEffect, useMemo, useState } from 'react';
import { brand, getBranch } from './data/branches';
import { groupsForBranch, shelf } from './data/menu';
import BranchGate from './components/BranchGate';
import Header from './components/Header';
import Shelf3D from './components/Shelf3D';
import Menu from './components/Menu';
import BranchInfo from './components/BranchInfo';

const LAST_KEY = 'boxcafe.branch';
const read = (store, key) => {
  try {
    return window[store].getItem(key);
  } catch {
    return null;
  }
};
const write = (store, key, value) => {
  try {
    window[store].setItem(key, value);
  } catch {
    /* storage blocked: the site still works, it just won't remember */
  }
};

// A table QR code can link straight to a branch, e.g. box-cafe/#zaarour
const hashBranch = () => getBranch(window.location.hash.replace('#', ''))?.id ?? null;

export default function App() {
  const [branchId, setBranchId] = useState(() => hashBranch() ?? read('localStorage', LAST_KEY));
  const [gateOpen, setGateOpen] = useState(() => !hashBranch());
  const [intro] = useState(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    return !reduced && !read('sessionStorage', 'boxcafe.intro');
  });
  const [request, setRequest] = useState(null);
  const branch = getBranch(branchId);
  const groups = useMemo(() => groupsForBranch(branch), [branch]);

  useEffect(() => write('sessionStorage', 'boxcafe.intro', '1'), []);

  const pick = (id) => {
    setBranchId(id);
    write('localStorage', LAST_KEY, id);
    setGateOpen(false);
    window.scrollTo({ top: 0 });
  };

  useEffect(() => {
    document.title = branch && !gateOpen ? `Box Cafe ${branch.name} | Menu` : 'Box Cafe | Menu';
  }, [branch, gateOpen]);

  return (
    <>
      <BranchGate
        open={gateOpen}
        intro={intro}
        current={branchId}
        onPick={pick}
        onClose={branchId ? () => setGateOpen(false) : null}
      />
      <Header branch={branch} onChangeBranch={() => setGateOpen(true)} />
      <main id="top">
        <section className="intro wrap" aria-labelledby="intro-title">
          <div className="intro__text">
            <p className="intro__hand">For the love of coffee...</p>
            <h1 id="intro-title" className="intro__title">
              Box Cafe <span>{branch ? branch.name : 'Menu'}</span>
            </h1>
            <p className="intro__sub">
              {branch?.hours ? branch.hours.join(' · ') : 'Dine-in menu'} &middot; prices in US dollars
            </p>
          </div>
          <Shelf3D items={shelf} onSelect={(item) => setRequest({ category: item.category, t: Date.now() })} />
        </section>
        {branch && <Menu groups={groups} request={request} key={branch.id} />}
      </main>
      {branch && <BranchInfo branch={branch} brand={brand} onChangeBranch={() => setGateOpen(true)} />}
    </>
  );
}
