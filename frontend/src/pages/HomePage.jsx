import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import PageContainer from "../components/layout/PageContainer";

const scenarios = [
  { title: "Fake scholarship emails", copy: "Spot urgent payment traps before you lose money." },
  { title: "Fake job offers", copy: "Detect credential-harvesting internship scams quickly." },
  { title: "Fake professor messages", copy: "Verify impersonation attempts using simple checks." },
  { title: "Malicious assignment downloads", copy: "Avoid file-based attacks hidden as class material." },
];

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <section className="hero-band">
        <PageContainer>
          <div className="hero-card">
            <h1>Student PhishGuard</h1>
            <p>Learn to spot phishing and scams while you browse.</p>
            <div className="hero-actions">
              <a className="btn-primary" href="/">Install Chrome extension</a>
              <a className="btn-secondary" href="#how">See how it works</a>
            </div>
          </div>
        </PageContainer>
      </section>

      <section id="how" className="section">
        <PageContainer>
          <h2>How it works</h2>
          <div className="step-grid">
            <article className="panel"><strong>1.</strong> You open a link or email.</article>
            <article className="panel"><strong>2.</strong> Gemini agents quietly check for threats.</article>
            <article className="panel"><strong>3.</strong> If risky, you get simple explanation + quiz.</article>
          </div>
        </PageContainer>
      </section>

      <section className="section">
        <PageContainer>
          <h2>Student-centric scenarios</h2>
          <div className="card-grid">
            {scenarios.map((item) => (
              <article key={item.title} className="panel">
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </PageContainer>
      </section>

      <section className="section">
        <PageContainer>
          <h2>Product previews</h2>
          <div className="card-grid two">
            <article className="panel">
              <h3>Extension warning banner</h3>
              <p>Students see instant warning right on suspicious pages.</p>
            </article>
            <article className="panel">
              <h3>Teach page report</h3>
              <p>Clear reason, tips, and one-question learning quiz.</p>
            </article>
          </div>
        </PageContainer>
      </section>
      <Footer />
    </div>
  );
}
