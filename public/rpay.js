function getMonthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

const currentDate = new Date();
const currentMonthKey = getMonthKey(currentDate);
const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
const nextMonthKey = getMonthKey(nextMonthDate);

const user = JSON.parse(localStorage.getItem("residentUser"));
if (!user) {
  alert("❌ Please log in again.");
  window.location.href = "login.html";
}

const paidKey = `paidMonths_${user._id}`;
let paidMonths = JSON.parse(localStorage.getItem(paidKey)) || [];

const historyList = document.querySelector(".history-list");
const isAfter2nd = currentDate.getDate() >= 2;
let currentStatus = "Paid";

// ✅ Fetch user-specific payment history from backend
async function loadRemotePaidMonths() {
  try {
    const res = await fetch(`http://localhost:5000/api/rent/user/${user._id}`);
    const data = await res.json();

    paidMonths = data.map(entry => getMonthKey(new Date(entry.paymentDate)));
    localStorage.setItem(paidKey, JSON.stringify(paidMonths));

    renderHistory();
  } catch (e) {
    console.warn("❌ Couldn’t sync rent history. Showing offline data.");
    renderHistory();
  }
}

function renderHistory() {
  historyList.innerHTML = "";

  currentStatus = paidMonths.includes(currentMonthKey)
    ? "Paid"
    : isAfter2nd ? "Due" : "Upcoming";

  historyList.innerHTML += `
    <div class="history-item">
      <span>${new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toLocaleDateString("en-GB", { month: 'short', year: 'numeric' })}</span>
      <span>₹20,000</span>
      <span class="status-${currentStatus.toLowerCase()}">${currentStatus}</span>
    </div>
  `;

  if (currentStatus === "Paid") {
    historyList.innerHTML += `
      <div class="history-item">
        <span>${nextMonthDate.toLocaleDateString("en-GB", { month: 'short', year: 'numeric' })}</span>
        <span>₹20,000</span>
        <span class="status-due">Upcoming</span>
      </div>
    `;
  }
}

function showQR() {
  if (!isAfter2nd) {
    alert("⚠️ You can pay rent only after the 2nd of this month.");
    return;
  }

  if (paidMonths.includes(currentMonthKey)) {
    alert("✅ Rent already paid for this month.");
    return;
  }

  document.getElementById("upiSection").style.display = "block";
}

async function hideQR() {
  document.getElementById("upiSection").style.display = "none";

  const residentId = user._id;
  const { username, phone, block } = user;

  if (!paidMonths.includes(currentMonthKey)) {
    paidMonths.push(currentMonthKey);
    localStorage.setItem(paidKey, JSON.stringify(paidMonths));
  }

  const paymentDate = new Date().toISOString().split("T")[0];

  const paymentData = {
    residentId,
    residentName: username,
    phone,
    block,
    amount: 20000,
    paymentDate,
    status: "Paid"
  };

  try {
    const res = await fetch("http://localhost:5000/api/rent/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(paymentData)
    });

    if (!res.ok) throw new Error("Failed to add payment to backend");

    alert("✅ Rent marked as paid and submitted!");
    location.reload();

  } catch (err) {
    console.error("❌ Error submitting rent:", err);
    alert("❌ Payment saved locally, but failed to sync with backend.");
  }
}

// ✅ On load
loadRemotePaidMonths();
document.getElementById('logoutBtn').addEventListener('click', () => {
      localStorage.clear();
      window.location.href = "login.html";
    });
