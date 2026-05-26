require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Note: BullMQ Workers are initialized when their file is required/imported.
  // We can import them here to ensure they start with the server.
  require('./queues/publish.worker');
});
