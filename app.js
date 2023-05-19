require("dotenv").config();
const PORT = process.env.PORT || 8800;
const express = require("express");
const app = express();
const morgan = require("morgan");
const registerRoute = require('./router/register');
const routesRoute = require("./router/routes/addNewRoute");
const flightRoute = require("./router/flights/addNewFlights");
const bookingRoute = require("./router/bookings/addBooking");
app.use(morgan());
app.use(express.json());
app.use('/auth',registerRoute);
app.use('/admin', routesRoute);
app.use('/admin', flightRoute);
app.use('/user', bookingRoute);

app.listen(PORT, () => {
  console.log(`Server Started on PORT ${PORT}`);
});
