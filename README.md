# 🏢 Apartment Management Portal (APT)

A Node.js and Express.js-based backend for managing apartment services, including user accounts, rent tracking, visitor logs, and maintenance requests.

---

## 🚀 Features

- 👤 User management system
- 🧾 Rent tracking module
- 🚪 Visitor logbook
- 🛠️ Maintenance request management
- 🌐 REST API architecture for frontend integration
- 🔐 Secure environment config via `.env`

---

## 📁 Folder Structure

```
maintenance-backend/
├── models/
│   ├── User.js
│   ├── Request.js
│   ├── Rent.js
│   └── Visitor.js
├── server.js
├── .env
├── package.json
└── package-lock.json
```

---

## 🛠 Tech Stack

| Layer       | Technology       |
|-------------|------------------|
| 🧠 Backend  | Node.js, Express.js |
| 🗄️ Database | (Add your DB here: MongoDB, MySQL, etc.) |
| 🔐 Auth     | JWT / Sessions (if used) |

---

## ⚙️ Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/ShreenFathima/APT.git
   cd APT/maintenance-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Add a `.env` file with environment variables:
   ```env
   PORT=5000
   DB_URI=your-database-uri-here
   ```

4. Start the server:
   ```bash
   node server.js
   ```

---

## 📬 Contact

**Author:** ShreenFathima  
**Email:** shreencheeks@gmail.com  
**GitHub:** [@ShreenFathima](https://github.com/ShreenFathima)