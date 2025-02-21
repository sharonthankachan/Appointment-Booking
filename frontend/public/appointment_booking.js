(function () {
    function createBookingWidget(containerId) {
      const container = document.getElementById(containerId);
      if (!container) return;
  
      container.innerHTML = `
        <div id="booking-container">
          <h2>Book an Appointment</h2>
          <label>Select Date:</label>
          <input type="date" id="appointment-date" min="${new Date().toISOString().split('T')[0]}"/>
  
          <label>Available Slots:</label>
          <select id="time-slot">
            <option value="">Select a Slot</option>
          </select>
  
          <label>Your Name:</label>
          <input type="text" id="user-name" placeholder="Enter your name"/>
  
          <label>Phone Number:</label>
          <input type="text" id="user-phone" placeholder="Enter phone number"/>
  
          <button id="book-btn">Book Appointment</button>
          <p id="booking-status"></p>
        </div>
      `;
  
      const dateInput = document.getElementById("appointment-date");
      const slotSelect = document.getElementById("time-slot");
      const bookBtn = document.getElementById("book-btn");
      const statusMessage = document.getElementById("booking-status");
  
      dateInput.addEventListener("change", async () => {
        const selectedDate = dateInput.value;
        slotSelect.innerHTML = '<option value="">Loading...</option>';
  
        try {
          const response = await fetch(`http://localhost:5000/slots?date=${selectedDate}`);
          const slots = await response.json();
          slotSelect.innerHTML = slots.map(slot => `<option value="${slot}">${slot}</option>`).join("");
        } catch (error) {
          slotSelect.innerHTML = '<option value="">Error loading slots</option>';
          console.error("Error fetching slots:", error);
        }
      });
  
      // Handle booking
      bookBtn.addEventListener("click", async () => {
        const name = document.getElementById("user-name").value;
        const phone = document.getElementById("user-phone").value;
        const date = dateInput.value;
        const timeSlot = slotSelect.value;
  
        if (!name || !phone || !date || !timeSlot) {
          statusMessage.innerHTML = "All fields are required!";
          statusMessage.style.color = "red";
          return;
        }
  
        try {
          const response = await fetch("http://localhost:5000/book", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, phone, date, timeSlot }),
          });
  
          const result = await response.json();
          if (response.ok) {
            statusMessage.innerHTML = "Appointment booked successfully!";
            statusMessage.style.color = "green";
          } else {
            statusMessage.innerHTML = result.error;
            statusMessage.style.color = "red";
          }
        } catch (error) {
          statusMessage.innerHTML = "Booking failed!";
          statusMessage.style.color = "red";
          console.error("Booking error:", error);
        }
      });
    }
  
    window.createBookingWidget = createBookingWidget;
  })();
  