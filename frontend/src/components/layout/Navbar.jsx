import PageContainer from "./PageContainer";

const links = [
  { href: "/", label: "Home" },
  { href: "/teach", label: "Teach" },
  { href: "/history", label: "History" },
  { href: "/learn", label: "Learn" },
  { href: "/demo", label: "Demo" },
];

export default function Navbar() {
  return (
    <header className="site-header">
      <PageContainer>
        <div className="nav-shell">
          <a className="brand" href="/">
            <span className="brand-logo">SP</span>
            <span>Student PhishGuard</span>
          </a>
          <nav className="nav-links">
            {links.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <button className="nav-profile" type="button">
            Profile
          </button>
        </div>
      </PageContainer>
    </header>
  );
}
