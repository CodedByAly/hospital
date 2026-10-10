export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <a href="#top" className="footer__brand" aria-label="Back to top">
          <img src="/images/logo.png" alt="" width="56" height="56" />
          <span className="wordmark">
            Tak<br />Tawook
          </span>
        </a>
        <p>Sauce. Bite. Repeat.</p>
        <p className="footer__small">© {new Date().getFullYear()} Taktawook</p>
      </div>
    </footer>
  )
}
