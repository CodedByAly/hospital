import { useLocation } from 'react-router-dom';

// Thin orange bar that sweeps across the top on every page change.
export default function RouteProgress() {
  const { pathname } = useLocation();
  return <div key={pathname} className="route-progress" aria-hidden="true" />;
}
