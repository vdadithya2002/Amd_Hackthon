import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import PageContainer from "../components/layout/PageContainer";

export default function LearnPage() {
  return (
    <div>
      <Navbar />
      <section className="section">
        <PageContainer>
          <h1>Learn / Resources</h1>
          <div className="card-grid">
            <article className="panel"><h3>How to check a URL</h3><p>5 quick checks before you sign in.</p></article>
            <article className="panel"><h3>How to read sender address</h3><p>Spot fake domains in scholarship/job emails.</p></article>
            <article className="panel"><h3>Campus safety checklist</h3><p>Simple habits to avoid phishing and scams.</p></article>
          </div>
        </PageContainer>
      </section>
      <Footer />
    </div>
  );
}
