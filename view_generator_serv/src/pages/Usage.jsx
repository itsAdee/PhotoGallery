import React, { useState, useEffect } from 'react';
import { Box, Heading, Select } from '@chakra-ui/react';
import Chart from 'react-apexcharts';
import { useAuthContext } from '../hooks/useAuthContext';
import axios from 'axios';

const Usage = () => {
  const [usageData, setUsageData] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [requestUsageData, setRequestUsageData] = useState([]);
  const [filterOption, setFilterOption] = useState('year'); // Default filter option
  const { user } = useAuthContext();

  useEffect(() => {
    fetchAggregatedBandwidthData();
    fetchRequestUsageData();
  }, [filterOption]); // Only re-run the effect if filterOption changes

  const handleFilterChange = (event) => {
    setFilterOption(event.target.value);
  };

  const fetchAggregatedBandwidthData = async () => {
    setDisabled(true);

    let type = "month";

    if (filterOption === "monthly") { type = "month"; }
    else if (filterOption === "daily") { type = "day"; }
    else if (filterOption === "yearly") { type = "year"; }

    try {
      const response = await axios.get(`http://photogallery.com/api/usageMntr/usage/user/${user._id}/${type}`);
      console.log(response.data);
      setUsageData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setDisabled(false);
    }
  };

  const chartOptions = {
    chart: {
      type: 'bar',
    },
    xaxis: {
      categories: usageData ? usageData.map(data => {
        if (data._id) {
          if (filterOption === 'monthly') {
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return `${monthNames[data._id.month - 1]}-${data._id.year}`;
          } else if (filterOption === 'yearly') {
            return `${data._id.year}`;
          } else if (filterOption === 'daily') {
            return `${data._id.day}-${data._id.month}-${data._id.year}`;
          }
        }
        return '';
      }) : [],
    },
    yaxis: {
      title: {
        text: 'Usage',
      },
      labels: {
        formatter: function (value) {
          return Math.floor(value); // This will round down the value to the nearest whole number
        }
      }
    },
    tooltip: {
      y: {
        formatter: function (value) {
          if (value > 1000000) {
            return `${(value / 1000000).toFixed(3)} MB`; // This will limit the value to 3 decimal places
          } else if (value > 1000) {
            return `${(value / 1000).toFixed(3)} KB`; // This will limit the value to 3 decimal places
          } else {
            return `${value} Bytes`;
          }
        }
      }
    },
  };

  const series = [
    {
      name: 'Upload',
      data: usageData ? usageData.map(data => data.uploadBandwidth) : [],
    },
    {
      name: 'Download',
      data: usageData ? usageData.map(data => data.downloadBandwidth) : [],
    },
  ];

  {/* Request Usage */ }
  const fetchRequestUsageData = async () => { // New function
    setDisabled(true);

    try {
      const response = await axios.get(`http://photogallery.com/api/usageMntr/usage/user/${user._id}/today`);
      setRequestUsageData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setDisabled(false);
    }
  };
  const requestChartOptions = { // New chart options
    chart: {
      type: 'line',
    },
    xaxis: {
      categories: requestUsageData ? requestUsageData.map(data => new Date(data.createdAt).toLocaleTimeString()) : [],
    },
    yaxis: {
      title: {
        text: 'Used Bandwidth',
      },
    },
    tooltip: {
      y: {
        formatter: function (value, { series, seriesIndex, dataPointIndex, w }) {
          if (value > 1000000) {
            return `${(value / 1000000).toFixed(3)} MB (${requestUsageData[dataPointIndex].requestType})`; // This will limit the value to 3 decimal places
          } else if (value > 1000) {
            return `${(value / 1000).toFixed(3)} KB (${requestUsageData[dataPointIndex].requestType})`; // This will limit the value to 3 decimal places
          } else {
            return `${value} Bytes (${requestUsageData[dataPointIndex].requestType})`;
          }
        }
      }
    },
  };

  const requestSeries = [ // New series
    {
      name: 'Used Bandwidth',
      data: requestUsageData ? requestUsageData.map(data => data.usedBandwidth) : [],
    },
  ];

  return (
    <Box>
      <Heading as="h1" mb={4}>
        Usage Statistics
      </Heading>

      <Box mb={4}>
        <label htmlFor="filter">Filter by:</label>
        <Select id="filter" value={filterOption} onChange={handleFilterChange} ml={2} isDisabled={disabled}>
          <option value="monthly">Monthly</option>
          <option value="daily">Daily</option>
          <option value="yearly">Yearly</option>
        </Select>
      </Box>

      {/* Display Bandwidth Usage */}
      <Box mb={4}>
        <Heading as="h2" mb={2}>
          Bandwidth Usage
        </Heading>
        <Chart options={chartOptions} series={series} type="bar" height={350} />
      </Box>

      {/* Display Request Usage */}
      <Box mb={4}>
        <Heading as="h2" mb={2}>
          Request Usage
        </Heading>
        <Chart options={requestChartOptions} series={requestSeries} type="line" height={350} />
      </Box>
    </Box>
  );
};

export default Usage;