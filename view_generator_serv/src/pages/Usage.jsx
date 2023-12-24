import React, { useState, useEffect } from 'react';
import { Box, Heading, Select } from '@chakra-ui/react';
import Chart from 'react-apexcharts';

const Usage = () => {
  const [usageData, setUsageData] = useState([]);
  const [filterOption, setFilterOption] = useState('monthly'); // Default filter option

  useEffect(() => {
    // Simulate fetching usage data from the server based on the filter option
    const mockData = {
      monthly: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        data: [30, 45, 60, 25, 50, 75], // Placeholder data for monthly usage
      },
      daily: {
        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
        data: [10, 20, 15, 30, 25], // Placeholder data for daily usage
      },
    };

    setUsageData(mockData[filterOption]);
  }, [filterOption]);

  const handleFilterChange = (event) => {
    setFilterOption(event.target.value);
  };

  const chartOptions = {
    xaxis: {
      categories: usageData.labels,
    },
    yaxis: {
      title: {
        text: 'Usage',
      },
    },
  };

  return (
    <Box>
      <Heading as="h1" mb={4}>
        Usage Statistics
      </Heading>

      <Box mb={4}>
        <label htmlFor="filter">Filter by:</label>
        <Select id="filter" value={filterOption} onChange={handleFilterChange} ml={2}>
          <option value="monthly">Monthly</option>
          <option value="daily">Daily</option>
        </Select>
      </Box>

      {/* Display Bandwidth Usage */}
      <Box mb={4}>
        <Heading as="h2" mb={2}>
          Bandwidth Usage
        </Heading>
        <Chart options={chartOptions} series={[{ name: 'Bandwidth', data: usageData.data }]} type="line" height={350} />
      </Box>

      {/* Display Storage Usage */}
      <Box mb={4}>
        <Heading as="h2" mb={2}>
          Storage Usage
        </Heading>
        <Chart options={chartOptions} series={[{ name: 'Storage', data: usageData.data }]} type="line" height={350} />
      </Box>

      {/* Display Cost Usage */}
      <Box>
        <Heading as="h2" mb={2}>
          Cost Usage
        </Heading>
        <Chart options={chartOptions} series={[{ name: 'Cost', data: usageData.data }]} type="line" height={350} />
      </Box>
    </Box>
  );
};

export default Usage;
