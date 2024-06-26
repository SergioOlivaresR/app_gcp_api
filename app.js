const express = require('express');
const { BigQuery } = require('@google-cloud/bigquery');
const app = express();
const port = 3100;

// Create a BigQuery client
const bigquery = new BigQuery({
  projectId: 'indigo-anchor-339414',
  keyFilename: '/etc/secrets/indigo-anchor-339414-3d1e5e19e9af.json',
});

app.get('/health', async (req, res) => {
  res.send('Holi!')
});

app.get('/bigquery-data', async (req, res) => {
  const query = 'SELECT * FROM `testongDataset.avocado` LIMIT 10';
  const options = {
    query: query,
    location: 'US', 
  };

  try {
    const [job] = await bigquery.createQueryJob(options);
    const [rows] = await job.getQueryResults();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error querying BigQuery' + err);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
