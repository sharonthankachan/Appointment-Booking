import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./BookAppointment.css"; 
import Swal from 'sweetalert2';

const BookAppointment = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchAvailableSlots = async (date) => {
    try {
      const formattedDate = date.toISOString().split("T")[0];
      const response = await fetch(`http://localhost:5000/slots?date=${formattedDate}`);
      if (!response.ok) throw new Error("Failed to fetch slots");

      const data = await response.json();
      setAvailableSlots(data);
    } catch (error) {
      console.error("Error fetching slots", error);
    }
  };

  const handleBooking = async () => {
    if (!name || !phone || !selectedSlot || !selectedDate) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          date: selectedDate.toISOString().split("T")[0],
          timeSlot: selectedSlot,
        }),
      });

      if (!response.ok) throw new Error("Failed to book appointment");

      Swal.fire({
        title: 'Success!',
        text: "Appointment booked successfully!",
        icon: 'success',
        timer:2000
      })
      setName("");
      setPhone("");
      setSelectedSlot("");
    } catch (error) {
      console.error("Error booking appointment", error);
      alert("Failed to book appointment");
    }
  };

  return (
    <div className="booking-container">
      <h2 className="title">Book an Appointment</h2>

      <div className="input-group">
        <label>Select Date</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          className="date-picker"
          dateFormat="yyyy-MM-dd"
          minDate={new Date()}
        />
      </div>

      {availableSlots.length > 0 && (
        <div className="input-group">
          <label>Available Time Slots</label>
          <div className="slots-container">
            {availableSlots.map((slot) => (
              <button
                key={slot}
                className={`slot-btn ${selectedSlot === slot ? "selected" : ""}`}
                onClick={() => setSelectedSlot(slot)}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="input-group">
        <label>Your Name</label>
        <input
          type="text"
          className="input-field"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Phone Number</label>
        <input
          type="text"
          className="input-field"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <button onClick={handleBooking} className="submit-btn">
        Book Appointment
      </button>
    </div>
  );
};

export default BookAppointment;
