import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { useAuth } from '../Context/AuthContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const FriendProfile = () => {
  const [chartData, setChartData] = useState(null);
  const [userRank, setUserRank] = useState(null);
  const [completedGoals, setCompletedGoals] = useState(null);
  const {currentUser} = useAuth();

  useEffect(() => {
    axios.get('http://localhost:3006/analytics/top-winners')
      .then((res) => {
        const names = res.data.map(item => item.name);
        const goals = res.data.map(item => item.completedGoals);

        setChartData({
          labels: names,
          datasets: [
            {
              label: 'Completed Goals',
              data: goals,
              backgroundColor: function(context) {
                const gradient = context.chart.ctx.createLinearGradient(0, 100, 0, 400);
                gradient.addColorStop(0, '#a78bfa'); // light purple
                gradient.addColorStop(1, '#7e5bef'); // darker purple
                return gradient;
              },
              borderRadius: 6,
              hoverBackgroundColor: '#a78bfa', // prevent grey hover
            },
          ],
        });
      })
      .catch((err) => {
        console.error("Error fetching top winners:", err);
      });
      //fetch user rank
      axios.get(`http://localhost:3006/analytics/rank/${currentUser._id}`)
      .then(res => setUserRank(res.data.rank))
      .catch(err => console.error("Error fetching user rank:", err));
      //fetch total no. of completed goals 
      // Fetch user's completed goals 
    axios.get(`http://localhost:3006/analytics/completed-goals/${currentUser._id}`)
      .then(res => setCompletedGoals(res.data.completedGoals))
      .catch(err => console.error("Error fetching completed goals:", err));
  }, [currentUser._id]);

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold text-center mb-4">🏆 Top 3 Goal Winners</h2>
      {chartData ? (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: '#f3f4f6',
                titleColor: '#111827',
                bodyColor: '#374151',
              },
            },
            scales: {
              x: {
                ticks: { color: '#6b7280', font: { size: 14 } },
                grid: { display: false },
              },
              y: {
                ticks: { color: '#6b7280', font: { size: 14 } },
                grid: { color: '#333333' },
              },
            },
          }}
        />
      ) : (
        <p>Loading...</p>
      )}

        <div className="mt-6 bg-gray-800 p-4 rounded-xl flex items-center shadow-md">
        <img
          src={currentUser?.profilePic}
          alt="User"
          className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-gray-600"
        />
        <div>
          <p className="text-gray-300 text-sm">Your Rank:</p>
          <p className="text-white text-lg font-semibold">{userRank !== null ? `#${userRank}` : 'Loading...'}</p>
          <p className="text-gray-300 mt-1 text-sm">Total Completed Goals:</p>
          <p className="text-white text-md font-medium">{completedGoals !== null ? completedGoals : 'Loading...'}</p>
        </div>
      </div>

    </div>
  );
};

export default FriendProfile;
