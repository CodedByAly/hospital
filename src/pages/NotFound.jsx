import { Link } from 'react-router-dom';
import { LogoMark } from '../components/Logo';
import useDocumentMeta from '../hooks/useDocumentMeta';

export default function NotFound() {
  useDocumentMeta('Page not found');
  return (
    <div className="not-found container">
      <LogoMark className="not-found__mark" />
      <h1 className="display h2">This page isn’t on the menu</h1>
      <p className="lede">The link may be old or mistyped.</p>
      <div className="not-found__ctas">
        <Link to="/menu" className="btn btn--dark">
          See the menu
        </Link>
        <Link to="/" className="btn btn--ghost">
          Home
        </Link>
      </div>
    </div>
  );
}
