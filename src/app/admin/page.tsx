"use client";

import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  // Fake data for users
  const [userStats, setUserStats] = useState({
    totalUsers: 1200,
    recentUsers: 20,
    dailyUserCounts: [5, 10, 15, 12, 8, 7, 20],
  });

  const [premiumUSersStats, setPremiumUsersStats] = useState({
    totalUsers: 1200,
    recentUsers: 20,
    dailyUserCounts: [5, 10, 15, 12, 8, 7, 20],
  });

  // Fake data for ideas
  const [ideaStats, setIdeaStats] = useState({
    totalIdeas: 450,
    recentIdeas: 30,
    dailyIdeaCounts: [10, 15, 12, 25, 30, 22, 16],
  });

  // Fake data for interactions
  const [interactionStats, setInteractionStats] = useState({
    totalLikes: 1000,
    totalDislikes: 200,
    totalInspiring: 150,
    totalToWork: 100,
    dailyInteractions: {
      likes: [50, 60, 40, 70, 55, 45, 75],
      dislikes: [10, 20, 15, 5, 25, 10, 15],
      inspiring: [20, 25, 18, 22, 30, 28, 35],
      towork: [15, 17, 14, 19, 20, 17, 15],
    },
  });

  return (
    <div className="row">
      <h1>Admin Dashboard</h1>

      <section className="col-lg-6">
        <h2>Users</h2>
        <p>Total Users: {userStats.totalUsers}</p>
        <Line
          data={{
            labels: [
              "Day 1",
              "Day 2",
              "Day 3",
              "Day 4",
              "Day 5",
              "Day 6",
              "Day 7",
            ],
            datasets: [
              {
                label: "Users Registered Per Day",
                data: userStats.dailyUserCounts,
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                fill: true,
              },
            ],
          }}
        />
      </section>

      <section className="col-lg-6">
        <h2>Premium Users</h2>
        <p>Total: {userStats.totalUsers}</p>
        <Line
          data={{
            labels: [
              "Day 1",
              "Day 2",
              "Day 3",
              "Day 4",
              "Day 5",
              "Day 6",
              "Day 7",
            ],
            datasets: [
              {
                label: "Users Registered Per Day",
                data: premiumUSersStats.dailyUserCounts,
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                fill: true,
              },
            ],
          }}
        />
      </section>

      <section className="col-lg-6">
        <h2>Ideas</h2>
        <p>Total Ideas: {ideaStats.totalIdeas}</p>
        <Line
          data={{
            labels: [
              "Day 1",
              "Day 2",
              "Day 3",
              "Day 4",
              "Day 5",
              "Day 6",
              "Day 7",
            ],
            datasets: [
              {
                label: "Ideas Added Per Day",
                data: ideaStats.dailyIdeaCounts,
                borderColor: "rgba(54, 162, 235, 1)",
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                fill: true,
              },
            ],
          }}
        />
      </section>

      <section className="col-lg-6">
        <h2>Interactions</h2>
        <p>Total Likes: {interactionStats.totalLikes}</p>
        <p>Total Dislikes: {interactionStats.totalDislikes}</p>
        <p>Total Inspiring: {interactionStats.totalInspiring}</p>
        <p>Total To Work: {interactionStats.totalToWork}</p>
        <Line
          data={{
            labels: [
              "Day 1",
              "Day 2",
              "Day 3",
              "Day 4",
              "Day 5",
              "Day 6",
              "Day 7",
            ],
            datasets: [
              {
                label: "Likes Per Day",
                data: interactionStats.dailyInteractions.likes,
                borderColor: "rgba(255, 99, 132, 1)",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                fill: true,
              },
              {
                label: "Dislikes Per Day",
                data: interactionStats.dailyInteractions.dislikes,
                borderColor: "rgba(255, 159, 64, 1)",
                backgroundColor: "rgba(255, 159, 64, 0.2)",
                fill: true,
              },
              {
                label: "Inspiring Per Day",
                data: interactionStats.dailyInteractions.inspiring,
                borderColor: "rgba(153, 102, 255, 1)",
                backgroundColor: "rgba(153, 102, 255, 0.2)",
                fill: true,
              },
              {
                label: "To Work Per Day",
                data: interactionStats.dailyInteractions.towork,
                borderColor: "rgba(102, 255, 153, 1)",
                backgroundColor: "rgba(102, 255, 153, 0.2)",
                fill: true,
              },
            ],
          }}
        />
      </section>
    </div>
  );
};

export default AdminDashboard;
