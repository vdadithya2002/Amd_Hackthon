import PageContainer from "./PageContainer";

export default function Footer() {
  return (
    <footer className="site-footer">
      <PageContainer>
        <div className="footer-shell">
          <a href="/learn">Learn more</a>
          <a href="/">Privacy</a>
          <a href="/">GitHub / Project</a>
        </div>
      </PageContainer>
    </footer>
  );
}
