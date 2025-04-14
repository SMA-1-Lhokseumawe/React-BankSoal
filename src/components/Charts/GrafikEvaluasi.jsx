import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, Sector
} from 'recharts';
import axios from 'axios';

const GrafikEvaluasi = () => {
  // State untuk menyimpan data chart
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [nilai, setNilai] = useState([]);

  // Warna untuk tiap level
  const COLORS = {
    Low: '#ff8042',
    Medium: '#00c49f',
    High: '#0088fe'
  };

  useEffect(() => {
    // Fetch data nilai dari API
    getNilai();
  }, []);

  // Mendapatkan data nilai dari API
  const getNilai = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get("http://localhost:5000/nilai", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setNilai(response.data);
      processChartData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Memproses data dari API untuk digunakan di chart
  const processChartData = (nilaiData) => {
    // Inisialisasi data untuk distribusi per hari
    const dayMap = {
      0: 'Minggu',
      1: 'Senin',
      2: 'Selasa',
      3: 'Rabu',
      4: 'Kamis',
      5: 'Jumat',
      6: 'Sabtu'
    };
    
    // Inisialisasi struktur data untuk bar chart
    const dayData = Object.values(dayMap).map(day => ({
      name: day,
      Low: 0,
      Medium: 0,
      High: 0
    }));
    
    // Inisialisasi data untuk pie chart
    const levelCounts = {
      Low: 0,
      Medium: 0,
      High: 0
    };

    // Iterasi data nilai untuk mengisi data chart
    nilaiData.forEach(item => {
      // Ambil hari dari createdAt
      const date = new Date(item.createdAt);
      const dayOfWeek = dayMap[date.getDay()];
      
      // Increment nilai sesuai level dan hari
      const dayIndex = Object.values(dayMap).indexOf(dayOfWeek);
      if (dayIndex !== -1) {
        dayData[dayIndex][item.level] += 1;
      }
      
      // Increment nilai untuk total per level
      if (levelCounts.hasOwnProperty(item.level)) {
        levelCounts[item.level] += 1;
      }
    });

    // Format data untuk pie chart
    const pieChartData = Object.keys(levelCounts).map(level => ({
      name: level,
      value: levelCounts[level],
      fill: COLORS[level]
    }));

    setBarData(dayData);
    setPieData(pieChartData);
  };

  // Fungsi untuk animasi active sector pada pie chart
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  // Render active shape dengan animasi pada pie chart
  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  
    return (
      <g>
        <text x={cx} y={cy} dy={-20} textAnchor="middle" fill={fill} className="text-lg font-semibold">
          {payload.name}
        </text>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#333" className="text-sm">
          {value} Siswa
        </text>
        <text x={cx} y={cy} dy={25} textAnchor="middle" fill="#999" className="text-xs">
          {`(${(percent * 100).toFixed(1)}%)`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={innerRadius - 5}
          outerRadius={innerRadius - 2}
          fill={fill}
        />
      </g>
    );
  };

  // Custom tooltip untuk bar chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-300 shadow-md rounded">
          <p className="font-semibold text-gray-800">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.fill }}>
              {`${entry.name}: ${entry.value} Siswa`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mb-8">
      <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          Grafik Tingkat Evaluasi Kemampuan Siswa
        </h2>
        
        <div className="flex flex-col lg:flex-row">
          {/* Bar Chart */}
          <div className="lg:w-2/3 mb-6 lg:mb-0">
            <h3 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">
              Distribusi Tingkat Kemampuan per Hari
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="Low" name="Rendah" fill={COLORS.Low} />
                  <Bar dataKey="Medium" name="Sedang" fill={COLORS.Medium} />
                  <Bar dataKey="High" name="Tinggi" fill={COLORS.High} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Pie Chart */}
          <div className="lg:w-1/3 lg:pl-4">
            <h3 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">
              Distribusi Total Tingkat Kemampuan
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend 
                    payload={
                      pieData.map(item => ({
                        value: `${item.name} (${item.value})`,
                        type: 'circle',
                        color: item.fill,
                      }))
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium">Catatan:</span> Data yang ditampilkan menunjukkan evaluasi tingkat kemampuan siswa dalam mengerjakan soal-soal yang diberikan.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GrafikEvaluasi;