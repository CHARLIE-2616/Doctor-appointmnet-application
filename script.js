document.addEventListener('DOMContentLoaded', () => {
  const doctors = [
      { name: 'Dr. Sanjay', totalSlots: 16, availableSlots: 16, bookedSlots: 0, slots: {} },
      { name: 'Dr. Saisri', totalSlots: 16, availableSlots: 16, bookedSlots: 0, slots: {} },
  ];

  const appointments = [];
  let appointmentId = 1;

  const doctorSelect = document.getElementById('doctor-select');
  doctors.forEach((doctor, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = doctor.name;
      doctorSelect.appendChild(option);
  });

  // Generate time slots
  const timeSlots = [];
  for (let hour = 9; hour <= 16; hour++) {
      timeSlots.push(`${hour}:00`, `${hour}:30`);
  }

  const timeSelect = document.getElementById('appointment-time');
  timeSlots.forEach(slot => {
      const option = document.createElement('option');
      option.value = slot;
      option.textContent = slot;
      timeSelect.appendChild(option);
  });

  const bookingForm = document.getElementById('booking-form');
  bookingForm.addEventListener('submit', event => {
      event.preventDefault();
      const patientName = document.getElementById('patient-name').value;
      const doctorIndex = document.getElementById('doctor-select').value;
      const appointmentDate = document.getElementById('appointment-date').value;
      const appointmentTime = document.getElementById('appointment-time').value;

      const doctor = doctors[doctorIndex];

      if (!doctor.slots[appointmentDate]) {
          doctor.slots[appointmentDate] = timeSlots.reduce((acc, slot) => {
              acc[slot] = true;
              return acc;
          }, {});
      }

      if (doctor.slots[appointmentDate][appointmentTime]) {
          appointments.push({
              id: appointmentId++,
              patientName,
              doctorName: doctor.name,
              date: appointmentDate,
              time: appointmentTime,
          });

          doctor.slots[appointmentDate][appointmentTime] = false;
          doctor.availableSlots--;
          doctor.bookedSlots++;

          updateDoctorDisplay();
          alert('Appointment booked successfully!');
          bookingForm.reset();
      } else {
          alert('Selected time slot is already booked.');
      }
  });

  const cancelForm = document.getElementById('cancel-form');
  cancelForm.addEventListener('submit', event => {
      event.preventDefault();
      const appointmentId = parseInt(document.getElementById('appointment-id').value, 10);
      const appointmentIndex = appointments.findIndex(app => app.id === appointmentId);

      if (appointmentIndex >= 0) {
          const appointment = appointments[appointmentIndex];
          const doctor = doctors.find(doc => doc.name === appointment.doctorName);

          appointments.splice(appointmentIndex, 1);
          doctor.slots[appointment.date][appointment.time] = true;
          doctor.availableSlots++;
          doctor.bookedSlots--;

          updateDoctorDisplay();
          alert('Appointment canceled successfully!');
          cancelForm.reset();
      } else {
          alert('Invalid appointment ID.');
      }
  });

  const viewAppointmentsBtn = document.getElementById('view-appointments-btn');
  viewAppointmentsBtn.addEventListener('click', () => {
      const appointmentList = document.getElementById('appointment-list');
      appointmentList.innerHTML = '';

      appointments.forEach(app => {
          const li = document.createElement('li');
          li.textContent = `ID: ${app.id}, Patient: ${app.patientName}, Doctor: ${app.doctorName}, Date: ${app.date}, Time: ${app.time}`;
          appointmentList.appendChild(li);
      });
  });

  const viewSlotsBtn = document.getElementById('view-slots-btn');
  viewSlotsBtn.addEventListener('click', () => {
      const viewDate = document.getElementById('view-date').value;
      if (!viewDate) {
          alert('Please select a date to view available slots.');
          return;
      }
      const slotsContainer = document.getElementById('slots-container');
      slotsContainer.innerHTML = '';

      doctors.forEach(doctor => {
          const doctorSlots = doctor.slots[viewDate] || timeSlots.reduce((acc, slot) => {
              acc[slot] = true;
              return acc;
          }, {});

          const doctorCard = document.createElement('div');
          doctorCard.className = 'doctor-card';
          doctorCard.innerHTML = `
              <h3>${doctor.name}</h3>
              <table class="slot-table">
                  <thead>
                      <tr>
                          <th>Time Slot</th>
                          <th>Status</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${generateSlotRowsForDate(doctorSlots)}
                  </tbody>
              </table>
          `;
          slotsContainer.appendChild(doctorCard);
      });
  });

  function generateSlotRowsForDate(slots) {
      let rows = '';
      for (let time in slots) {
          const slotClass = slots[time] ? 'slot-available' : 'slot-booked';
          rows += `
              <tr>
                  <td>${time}</td>
                  <td class="${slotClass}">${slots[time] ? 'Available' : 'Booked'}</td>
              </tr>
          `;
      }
      return rows;
  }

  function updateDoctorDisplay() {
      const doctorsContainer = document.getElementById('doctors-container');
      doctorsContainer.innerHTML = '';

      doctors.forEach(doctor => {
          const doctorCard = document.createElement('div');
          doctorCard.className = 'doctor-card';
          doctorCard.innerHTML = `
              <h3>${doctor.name}</h3>
              <p>Total Slots: ${doctor.totalSlots}</p>
              <p>Available Slots: ${doctor.availableSlots}</p>
              <p>Booked Slots: ${doctor.bookedSlots}</p>
          `;
          doctorsContainer.appendChild(doctorCard);
      });
  }

  updateDoctorDisplay();
});
