"use client";
import React from "react";
import AwesomeSlider from "react-awesome-slider";
import "react-awesome-slider/dist/styles.css";

const ideas = [
  {
    text: "Sustainable clothing line with upcycled materials.",
    image: "/images/hero.webp",
    color: "#333",
  },
  {
    text: "DIY robotics kit for kids and hobbyists.",
    image: "/images/hero.webp",
    color: "#333",
  },
  {
    text: "Portable solar charger for mobile devices.",
    image: "/images/hero.webp",
    color: "#333",
  },
  // Add more ideas and corresponding images here
];

function ExampleIdeaSlider() {
  return (
    <AwesomeSlider>
      {ideas.map((idea, index) => (
        <div
          key={index}
          style={{
            backgroundImage: `url(${idea.image})`,
            height: "100%",
            width: "100%",
          }}
        >
          <h2 style={{ color: idea.color, fontWeight: "bold" }}>{idea.text}</h2>
        </div>
      ))}
    </AwesomeSlider>
  );
}

export default ExampleIdeaSlider;
