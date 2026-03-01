import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, Legend);

/**
 * ChartComponent
 * Renders the Chart.js Line Graph for click analytics data.
 * Receives pre-formatted chartData and chartOptions as props.
 */
function ChartComponent({ chartData }) {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#ffffff',
        titleColor: '#111827',
        bodyColor: '#3b82f6',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        displayColors: false,
      }
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { color: '#6b7280', font: { size: 12 } }
      },
      y: {
        grid: { color: '#e5e7eb', drawBorder: false },
        ticks: { color: '#6b7280', font: { size: 12 }, stepSize: 1 },
        beginAtZero: true
      }
    }
  };

  return (
    <div className="chart-container" style={{ position: 'relative', height: '250px', width: '100%', flex: 1 }}>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}

export default ChartComponent;
