// pages/index.js
import Head from "next/head";
import BenefitsSection from "./BenefitsSection";
import CTASection from "./CTASection";
import IdeaExamplesCarousel from "./IdeaExamplesCarousel";
import PlatformIntroduction from "./PlatformIntroduction";

export default function Home() {
  return (
    <div className={"container"}>
      <Head>
        <title>A Pile of Ideas</title>
        <meta
          name="description"
          content="Share and discover innovative ideas"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        <h1 className="title">Welcome to A Pile of Ideas</h1>

        <PlatformIntroduction />
        <div className="row">
          <div className="col-lg-8">
            <IdeaExamplesCarousel />
          </div>
          <div className="col-lg-4">
            <CTASection />
          </div>
        </div>

        <BenefitsSection />
      </main>

      <footer className={"footer"}>{/* Add your footer content here */}</footer>
    </div>
  );
}
