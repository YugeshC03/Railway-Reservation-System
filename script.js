document.addEventListener("DOMContentLoaded", async function () {
  const trainList = document.getElementById("trainList");
  // Fetch trains from backend
  const response = await fetch("http://localhost:5000/api/trains");
  const trains = await response.json();
  trainList.innerHTML = ""; // Clear table
  trains.forEach(train => {
      let row = `<tr>
          <td>${train.trainName}</td>
          <td>${train.trainNumber}</td>
          <td>${train.from}</td>
          <td>${train.to}</td>
          <td>${train.journeyDate}</td>
          <td>₹${train.farePerSeat}</td>
          <td><button onclick='bookNow("${train._id}", ${train.farePerSeat})'>Book Now</button></td>
      </tr>`;
      trainList.innerHTML += row;
  });
});
function bookNow(trainId, farePerSeat) {
  localStorage.setItem("selectedTrainId", trainId);
  localStorage.setItem("farePerSeat", farePerSeat);
  window.location.href = "book-now.html";
}

async function confirmBooking() {
  const trainId = localStorage.getItem("selectedTrainId");
  const passengerName = document.getElementById("passengerName").value;
  const seats = parseInt(document.getElementById("seats").value);
  const totalAmount = seats * parseFloat(localStorage.getItem("farePerSeat"));
  const response = await fetch("http://localhost:5000/api/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passengerName, trainId, seats, totalAmount })
  });
  if (response.ok) {
      alert("Booking successful!");
      window.location.href = "ticket.html";
  } else {
      alert("Booking failed. Please try again.");
  }
}
