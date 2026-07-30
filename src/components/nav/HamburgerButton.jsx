export default function HamburgerButton({ isOpen, toggle }) {
  return (
    <button
      onClick={toggle}
      className={`nav-ham ${isOpen ? "is-open" : ""}`}
      title="Open / Close Menu"
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      <div className="nav-ham-lines">
        <span className={`nav-ham-line nav-ham-line-1 ${isOpen ? "is-open" : ""}`} />
        <span className={`nav-ham-line nav-ham-line-2 ${isOpen ? "is-open" : ""}`} />
      </div>
    </button>
  );
}
