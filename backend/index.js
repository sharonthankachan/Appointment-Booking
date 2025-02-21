const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Error", err));


const appointmentSchema = new mongoose.Schema({
  name: String,
  phone: String,
  date: String, 
  timeSlot: String,
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

const TIME_SLOTS = [
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
];

app.get("/slots", async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: "Date is required" });

  const bookedAppointments = await Appointment.find({ date });
  const bookedSlots = bookedAppointments.map((appt) => appt.timeSlot);

  const availableSlots = TIME_SLOTS.filter((slot) => !bookedSlots.includes(slot));

  res.json(availableSlots);
});

app.post("/book", async (req, res) => {
  const { name, phone, date, timeSlot } = req.body;

  if (!name || !phone || !date || !timeSlot) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const existingAppointment = await Appointment.findOne({ date, timeSlot });
  if (existingAppointment) {
    return res.status(400).json({ error: "This time slot is already booked" });
  }

  const newAppointment = new Appointment({ name, phone, date, timeSlot });
  await newAppointment.save();

  res.json({ message: "Appointment booked successfully!" });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
