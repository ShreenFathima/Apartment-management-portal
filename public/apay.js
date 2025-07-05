async function fetchRentPayments() {
  try {
    const res = await fetch("http://localhost:5000/api/rent");
    const payments = await res.json();

    const tbody = document.getElementById("paymentTableBody");
    tbody.innerHTML = "";

    let totalAmount = 0;

    payments.forEach(payment => {
      totalAmount += payment.amount;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${payment.residentName}</td>
        <td>${payment.phone}</td>
        <td>${payment.block}</td>
        <td>₹${payment.amount}</td>
        <td>${formatDate(payment.paymentDate)}</td>
        <td><span class="status status-${payment.status.toLowerCase()}">${payment.status}</span></td>
        <td>
          <button class="mark-paid" onclick="markPaid('${payment._id}', this)">Mark as Paid</button>
          <button class="remove-btn" onclick="removePayment('${payment._id}', this)">Remove</button>
        </td>
      `;
      tbody.appendChild(row);
    });

    // ✅ Update dashboard cards
    document.getElementById("totalRentCollected").textContent = `₹${totalAmount.toLocaleString()}`;
    document.getElementById("totalResidents").textContent = payments.length;

  } catch (error) {
    console.error("❌ Error fetching rent payments:", error);
  }
}
