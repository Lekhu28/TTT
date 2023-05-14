import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const App = () => {
  const [histogramData, setHistogramData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://www.terriblytinytales.com/test.txt');
      const data = response.data.toLowerCase().replace(/[^\w\s]/gi, '').split(/\s+/);
      const frequency = data.reduce((acc, curr) => {
        acc[curr] = acc[curr] ? acc[curr] + 1 : 1;
        return acc;
      }, {});
      const sortedFrequency = Object.entries(frequency).sort((a, b) => b[1] - a[1]);
      setHistogramData(sortedFrequency.slice(0, 20).map((d) => ({ word: d[0], frequency: d[1] })));
    } catch (error) {
      console.log(error);
    }
  };

  const handleExport = () => {
    const csvData = histogramData.map((d) => [d.word, d.frequency].join(',')).join('\n');
    const blob = new Blob(['Word,Frequency\n', csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'histogram_data.csv');
  };

  return (
    <div>
      <button onClick={fetchData}>Submit</button>
      {histogramData.length > 0 && (
        <div>
          <BarChart width={800} height={400} data={histogramData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="word" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="frequency" fill="#8884d8" />
          </BarChart>
          <button onClick={handleExport}>Export</button>
        </div>
      )}
    </div>
  );
};

export default App;
