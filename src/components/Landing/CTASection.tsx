"use client";
import { useState, useEffect } from "react";

const captions = ["Share your idea", "Get inspired", "Start collaborating"];

// components/CTASection.js
export default function CTASection() {
  const [currentCaption, setCurrentCaption] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCaption((prevIdea) => (prevIdea + 1) % captions.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="text-center my-5">
      {
        // <h2 className="mb-4">Ready to Turn Ideas into Reality?</h2>
      }
      <div style={{ marginTop: "auto", marginBottom: "auto" }}>
        <a href="/api/auth/login">
          <button
            className="btn btn-primary btn-lg"
            style={{
              width: 300,
              height: 150,
              fontSize: "1.8rem",
              wordSpacing: 10,
              lineHeight: "2.5rem",
            }}
          >
            {captions[currentCaption]}
          </button>
        </a>
      </div>
    </section>
  );
}
