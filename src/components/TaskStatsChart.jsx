"use client"
import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const TaskStatsChart = () => {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/tasks/stats', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch task stats');
        }

        const data = await res.json();
        setStats(data);  // Set the task stats in state
        setLoading(false);  // Stop loading
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Chart data setup
  const chartData = {
    labels: ['Completed', 'Pending', 'In Progress'],
    datasets: [
      {
        label: 'Task Statuses',
        data: [stats.completed, stats.pending, stats.inProgress],
        backgroundColor: ['#4CAF50', '#FFC107', '#FF5722'],
        borderColor: ['#388E3C', '#FF8F00', '#D32F2F'],
        borderWidth: 1,
      },
    ],
  };

  // Show loading or error message
  if (loading) {
    return <p>Loading task stats...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="py-4 bg-white dark:bg-gray-800">
      <h3 className='text-xl font-semibold my-4 ml-4'>Task Status Distribution</h3>
      <Pie data={chartData} />
    </div>
  );
};

export default TaskStatsChart;