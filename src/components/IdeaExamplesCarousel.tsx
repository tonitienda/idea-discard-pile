"use client";

// components/IdeaExamplesCarousel.js
import { useState, useEffect } from "react";
import styles from "./carousel.module.css";

export default function IdeaExamplesCarousel() {
  const [currentIdea, setCurrentIdea] = useState(0);
  const ideas = [
    {
      title: "Eco-friendly packaging",
      image: "/images/hero.webp",
      description:
        "Innovative biodegradable packaging solutions to reduce plastic waste and environmental impact.",
    },
    {
      title: "AI-powered personal assistant",
      image: "/images/hero.webp",
      description:
        "A smart AI assistant that learns your habits and preferences to streamline your daily tasks and boost productivity.",
    },
    {
      title: "Urban vertical farming",
      image: "/images/hero.webp",
      description:
        "Efficient vertical farming systems for urban areas to promote local, sustainable food production.",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdea((prevIdea) => (prevIdea + 1) % ideas.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="my-5">
      <h2 className="text-center mb-4">Idea Examples</h2>
      <div className={styles.carouselContainer}>
        {ideas.map((idea, index) => (
          <div
            key={index}
            className={`${styles.carouselItem} ${
              index === currentIdea ? styles.active : ""
            }`}
          >
            <div className={styles.ideaContent}>
              <div className={styles.imageContainer}>
                <img src={idea.image} alt={idea.title} />
              </div>
              <div className={styles.textContainer}>
                <h3>{idea.title}</h3>
                <p>{idea.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
