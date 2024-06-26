const express = require('express');
const { BigQuery } = require('@google-cloud/bigquery');
const app = express();
const port = 3100;

// Create a BigQuery client
const bigquery = new BigQuery({
  projectId: 'proyecto-red-movilidad',
  keyFilename: 'proyecto-red-movilidad-dc34f732f034.json',
});

app.get('/health', async (req, res) => {
  res.send('Holi!')
});

app.get('/bigquery-data', async (req, res) => {
  // const query = 'SELECT * FROM `testongDataset.avocado` LIMIT 10';
  const query = 'SELECT * FROM `datos_diarios2.datos_diarios_red_horarios_deduplicated` LIMIT 10';
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
