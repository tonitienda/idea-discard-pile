"use client";

// components/IdeaExamplesCarousel.js
import { useState, useEffect } from "react";
import styles from "./carousel.module.css";

export default function IdeaExamplesCarousel() {
  const [currentIdea, setCurrentIdea] = useState(0);
  const ideas = [
    // {
    //   title: "Color-changing clothing line",
    //   image: "/images/hero.webp",
    //   description:
    //     "A clothing line that adjusts its color based on the temperature or UV exposure.",
    // },
    {
      title: "Space debris recycling satellite",
      image:
        "https://res.cloudinary.com/ddkok43g3/image/upload/t_Square/v1724445525/spacex-VBNb52J8Trk-unsplash_sot6ig.jpg",
      //credit: "Photo by <a href="https://unsplash.com/@spacex?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">SpaceX</a> on <a href="https://unsplash.com/photos/a-space-satellite-hovering-above-the-coastline-VBNb52J8Trk?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>,"
      description:
        "A satellite that collects space debris and recycles it into raw materials for 3D printing in space.",
    },
    {
      title: "Smart fridge recipe assistant",
      image:
        "https://res.cloudinary.com/ddkok43g3/image/upload/t_Square/v1724446327/brooke-lark-jUPOXXRNdcA-unsplash_vdffec.jpg",
      // credit: "Photo by <a href="https://unsplash.com/@brookelark?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Brooke Lark</a> on <a href="https://unsplash.com/photos/poached-egg-with-vegetables-and-tomatoes-on-blue-plate-jUPOXXRNdcA?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>",
      description:
        "A smart kitchen appliance that scans your fridge and suggests recipes based on the ingredients you have.",
    },
    {
      title: "Modular car design",
      image:
        "https://res.cloudinary.com/ddkok43g3/image/upload/t_Square/v1724446487/theodor-vasile-bV0XvbRPvM0-unsplash_gtdq8p.jpg",
      // credit: "Photo by <a href="https://unsplash.com/@theodorrr?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Theodor Vasile</a> on <a href="https://unsplash.com/photos/white-and-black-porsche-911-on-road-bV0XvbRPvM0?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>"
      description:
        "A modular car that allows users to swap out components like seats, dashboards, and storage areas to customize for different needs.",
    },
    {
      title: "Home gardening robot",
      image:
        "https://res.cloudinary.com/ddkok43g3/image/upload/t_Square/v1724448969/cj-dayrit-GS5zb9JqWuY-unsplash_oohrgp.jpg",
      // credit: "Photo by <a href="https://unsplash.com/@cjred?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">CJ Dayrit</a> on <a href="https://unsplash.com/photos/wizard-of-oz-tin-man-GS5zb9JqWuY?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>",
      description:
        "A home robot that automates gardening tasks like planting, watering, and weeding.",
    },
    {
      title: "Chore gamification app",
      image:
        "https://res.cloudinary.com/ddkok43g3/image/upload/t_Square/v1724449158/eduard-uY2kic9wlmc-unsplash_luoqx7.jpg",
      // credit: "Photo by <a href="https://unsplash.com/@eduardmilitaru?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">eduard</a> on <a href="https://unsplash.com/photos/empty-spiral-staircase-near-white-wooden-door-uY2kic9wlmc?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>",
      description:
        "An app that gamifies daily chores by allowing users to earn points and rewards for completing tasks at home.",
    },
    // {
    //   title: "Historical VR game",
    //   image: "/images/hero.webp",
    //   description:
    //     "A virtual reality game that teaches historical events by placing players in key moments of history.",
    // },
    // {
    //   title: "Hydration monitoring wearable",
    //   image: "/images/hero.webp",
    //   description:
    //     "A wearable device that monitors hydration levels and alerts you when you need to drink more water.",
    // },
    // {
    //   title: "Virtual mentorship platform",
    //   image: "/images/hero.webp",
    //   description:
    //     "An online platform that connects students with industry professionals for virtual mentorship and career advice.",
    // },
    {
      title: "Drone crop monitoring system",
      image:
        "https://res.cloudinary.com/ddkok43g3/image/upload/t_Square/v1724449287/david-henrichs-72AYEEBJpz4-unsplash_xp99ju.jpg",
      // credits: "Photo by <a href="https://unsplash.com/@davidhenrichs?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">david henrichs</a> on <a href="https://unsplash.com/photos/shallow-focus-photography-of-quadcopter-72AYEEBJpz4?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>",
      description:
        "A drone system that monitors crop health and automatically applies fertilizers or pesticides only where needed.",
    },
    // {
    //   title: "Solar-powered roadways",
    //   image: "/images/hero.webp",
    //   description:
    //     "Solar-powered roadways that generate electricity while providing real-time traffic updates and alerts.",
    // },
    // {
    //   title: "Recycled plastic building material",
    //   image: "/images/hero.webp",
    //   description:
    //     "A building material made from recycled plastics that is both strong and environmentally friendly.",
    // },
    // {
    //   title: "AI-powered fitness app",
    //   image: "/images/hero.webp",
    //   description:
    //     "A fitness app that adjusts workout plans based on your current mood, energy levels, and weather conditions.",
    // },
    // {
    //   title: "Underground delivery network",
    //   image: "/images/hero.webp",
    //   description:
    //     "A network of autonomous delivery vehicles that use underground tunnels to avoid traffic and reduce delivery times.",
    // },
    // {
    //   title: "Temperature-sensitive beverage",
    //   image: "/images/hero.webp",
    //   description:
    //     "A beverage that changes flavor based on the temperature it’s served at, offering a different experience when hot or cold.",
    // },
    // {
    //   title: "Interactive storytelling platform",
    //   image: "/images/hero.webp",
    //   description:
    //     "An interactive storytelling platform where users can influence the outcome of stories based on collective voting.",
    // },
    // {
    //   title: "AR-based virtual fitting room",
    //   image: "/images/hero.webp",
    //   description:
    //     "A virtual fitting room that uses augmented reality to let customers try on clothes online before purchasing.",
    // },
    // {
    //   title: "CO2 emissions capture device",
    //   image: "/images/hero.webp",
    //   description:
    //     " A device that captures and repurposes CO2 emissions from industrial sites into usable materials like concrete or plastic.",
    // },
    // {
    //   title: "AI-powered financial advisor",
    //   image: "/images/hero.webp",
    //   description:
    //     "An AI-powered financial advisor that helps users manage their investments and savings based on real-time data.",
    // },
    // {
    //   title: "Personalized travel itinerary app",
    //   image: "/images/hero.webp",
    //   description:
    //     "An app that curates personalized travel itineraries based on your interests, budget, and past travel experiences.",
    // },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdea((prevIdea) => (prevIdea + 1) % ideas.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="my-5">
      {
        // <h2 className="text-center mb-4">Idea Examples</h2>
      }
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
