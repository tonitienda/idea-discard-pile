// components/BenefitsSection.js
export default function BenefitsSection() {
  return (
    <section className="my-5">
      <h2 className="text-center mb-4">Benefits</h2>
      <div className="row">
        <div className="col-md-4">
          <h3>Find Inspiration</h3>
          <p>Discover unique ideas from innovators around the world.</p>
        </div>
        <div className="col-md-4">
          <h3>Share Your Vision</h3>
          <p>
            Give your discarded ideas a new life by sharing them with our
            community.
          </p>
        </div>
        <div className="col-md-4">
          <h3>Collaborate</h3>
          <p>Connect with like-minded individuals to bring ideas to reality.</p>
        </div>
      </div>
    </section>
  );
}
