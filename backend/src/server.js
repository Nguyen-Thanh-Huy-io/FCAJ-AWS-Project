require('dotenv').config();
const app = require('./app');
const postSchedulerService = require('./services/workspace/post-scheduler.service');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // Start the background scheduler for scheduled posts
  postSchedulerService.start();
});
