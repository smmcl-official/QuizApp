const express = require('express');
const path = require('path');
const app = express();
const port = 3000; // You can change the port if needed
const ipAddress = '192.168.18.17'; // Replace with your IP address

// Serve static files (HTML, CSS, JS, JSON)
app.use(express.static(path.join(__dirname)));

// Start the server
app.listen(port, ipAddress, () => {
  console.log(`Server running at http://${ipAddress}:${port}`);
});