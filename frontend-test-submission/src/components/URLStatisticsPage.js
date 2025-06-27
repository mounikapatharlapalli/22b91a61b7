import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { getStats } from '../api';

const URLStatisticsPage = () => {
  const [code, setCode] = useState('');
  const [data, setData] = useState(null);

  const handleFetch = async () => {
    try {
      const res = await getStats(code);
      setData(res.data);
    } catch (err) {
      setData({ error: err.response?.data?.message || 'Error' });
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4">Get URL Statistics</Typography>
      <Box mt={2}>
        <TextField
          label="Shortcode"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          sx={{ mr: 2 }}
        />
        <Button variant="contained" onClick={handleFetch}>Get Stats</Button>
      </Box>

      <Box mt={4}>
        {data?.error && <Typography color="error">{data.error}</Typography>}
        {data && !data.error && (
          <>
            <Typography>Short URL: {data.shortUrl}</Typography>
            <Typography>Expiry: {data.expiry}</Typography>
            <Typography>Total Clicks: {data.totalClicks}</Typography>
            <Typography variant="h6">Click Details:</Typography>
            {data.clickDetails.map((click, i) => (
              <Box key={i}>
                <Typography>- {click.timestamp} | {click.referer} | {click.location}</Typography>
              </Box>
            ))}
          </>
        )}
      </Box>
    </Box>
  );
};

export default URLStatisticsPage;
