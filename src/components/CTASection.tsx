// components/CTASection.js
export default function CTASection() {
  return (
    <section className="text-center my-5">
      <h2 className="mb-4">Ready to Turn Ideas into Reality?</h2>
      {
        // TODO - Add a list of texts for the button:
        // Share your idea
        // Get inspired
        // Start collaborating
        // And iterate over the list to render a button for each text
      }
      <a href="/api/auth/login">
        <button className="btn btn-primary btn-lg">Share Your Idea</button>
      </a>
    </section>
  );
}
