import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import URLShortenerForm from './components/URLShortenerForm';
import URLStatisticsPage from './components/URLStatisticsPage';

function App() {
  const [tab, setTab] = React.useState(0);

  return (
    <Box>
      <Tabs value={tab} onChange={(e, newVal) => setTab(newVal)} centered>
        <Tab label="Shorten URLs" />
        <Tab label="View Statistics" />
      </Tabs>
      {tab === 0 && <URLShortenerForm />}
      {tab === 1 && <URLStatisticsPage />}
    </Box>
  );
}

export default App;
