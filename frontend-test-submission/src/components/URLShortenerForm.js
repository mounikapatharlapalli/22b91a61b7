import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Box } from '@mui/material';
import { createShortURL } from '../api';

const URLShortenerForm = () => {
  const [urls, setUrls] = useState([{ url: '', validity: '', shortcode: '' }]);
  const [results, setResults] = useState([]);

  const handleChange = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    setUrls(newUrls);
  };

  const handleAdd = () => {
    if (urls.length < 5) setUrls([...urls, { url: '', validity: '', shortcode: '' }]);
  };

  const handleSubmit = async () => {
  const newResults = [];

  for (const item of urls) {
    if (!item.url || !/^https?:\/\/.+/.test(item.url)) {
      newResults.push({ error: "Invalid URL format" });
      continue;
    }

    const payload = {
      url: item.url,
      validity: parseInt(item.validity) || 30,
    };

    if (item.shortcode) {
      payload.shortcode = item.shortcode;
    }

    try {
      const res = await createShortURL(payload);
      newResults.push(res.data);
    } catch (err) {
      newResults.push({ error: err.response?.data?.message || "Request failed" });
    }
  }

  setResults(newResults);
};


  return (
    <Box p={3}>
      <Typography variant="h4">Shorten Your URLs</Typography>
      {urls.map((item, index) => (
        <Grid container spacing={2} key={index} mt={2}>
          <Grid item xs={12} sm={5}>
            <TextField
              label="Original URL"
              fullWidth
              value={item.url}
              onChange={(e) => handleChange(index, 'url', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Validity (minutes)"
              fullWidth
              type="number"
              value={item.validity}
              onChange={(e) => handleChange(index, 'validity', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Custom Shortcode (optional)"
              fullWidth
              value={item.shortcode}
              onChange={(e) => handleChange(index, 'shortcode', e.target.value)}
            />
          </Grid>
        </Grid>
      ))}
      <Box mt={2}>
        <Button onClick={handleAdd} variant="outlined" disabled={urls.length >= 5}>
          + Add More
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ ml: 2 }}>
          Shorten
        </Button>
      </Box>

      <Box mt={4}>
        <Typography variant="h6">Results:</Typography>
        {results.map((res, idx) => (
          <Box key={idx}>
            {res.error ? (
              <Typography color="error">{res.error}</Typography>
            ) : (
              <Typography>
                Short URL: <a href={res.shortUrl} target="_blank" rel="noreferrer">{res.shortUrl}</a><br />
                Expiry: {res.expiry}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default URLShortenerForm;
