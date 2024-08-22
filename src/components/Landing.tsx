import "./landing.css";

// FIXME: Find better ideas to display
const ExampleIdeas = [
  "A website that helps you find the perfect book to read next",
  "An app that helps you find the perfect gift for someone",
  "A website that helps you find the perfect recipe for any occasion",
  "An app that helps you find the perfect movie to watch next",
  "A website that helps you find the perfect vacation spot",
  "An app that helps you find the perfect workout routine",
  "A website that helps you find the perfect restaurant to eat at",
  "An app that helps you find the perfect outfit for any occasion",
  "A website that helps you find the perfect pet for your family",
  "An app that helps you find the perfect job for you",
];

export default function Landing() {
  return (
    <div className="container-fluid">
      <div className="row h-100">
        <div className="col-md-7 d-flex align-items-center justify-content-center bg-light">
          <div className="row">
            <h1>IDEA DISCARD PILE</h1>
            <h2>Where Ideas Find Their Second Chance</h2>
            <h5>
              Whether you’re letting go of a thought or searching for your next
              spark of inspiration,
              <b className="text-success">Idea Discard Pile</b> is the place
              where ideas are shared, revived, and reimagined.
            </h5>
            <p>
              Got an idea that didn’t quite take off? Don’t let it gather
              dust—share it here and see where it might lead. Whether it’s a
              wild brainstorm, an unfinished concept, or a side project you
              couldn’t complete, your ideas deserve a second look.{" "}
            </p>
            <p>
              Or maybe you’re looking for inspiration? Explore a treasure trove
              of discarded thoughts and half-baked plans from other creatives.
            </p>
            <p>
              Whether you need a fresh idea to kickstart a new project or just
              want to see what others are thinking, you’ll find plenty of
              inspiration here. Join today to share, explore, and breathe new
              life into ideas that deserve another chance.
            </p>
            <div className="row" style={{ paddingTop: 48 }}>
              <div className="example-ideas mb-5">
                {ExampleIdeas.map((idea, index) => (
                  <div key={index} style={{ animationDelay: `${4 * index}s` }}>
                    <h2>{idea}</h2>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-5 d-flex align-items-center justify-content-center bg-white">
          <div className="d-grid gap-2">
            <a href="/api/auth/login">
              <button
                className="btn btn-lg btn-success"
                style={{ height: 100, width: 200 }}
              >
                Join the Idea Pile
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
