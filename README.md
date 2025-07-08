# 🛠 Pair Up Backend

This is the **backend API** for PairUp — a modern Tinder‑like dating app.
Built with:
- **Node.js + Express**
- **MongoDB**
- **Socket.io** for realtime chat
- **Razorpay** for premium payments
---

## ✨ Features

✅ User authentication (signup & login)  
✅ Send / accept / reject interests  
✅ Match logic  
✅ Realtime messaging with Socket.io  
✅ Premium subscription via Razorpay

## 📦 Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/mohdjalalmk/pair-up.git
cd pair-up
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Create a `.env` file with the following variables:

```env
MONGO_URI=your_mongodb_connection_string
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
S3_BUCKET_NAME=...
JWT_SECRET=...
```

### 4️⃣ Run the server

```bash
npm run dev
```

The server will start on `http://localhost:8080` by default.

---

## ⚙️ Tech Stack

* Node.js
* Express.js
* MongoDB & Mongoose
* AWS S3 (for user profile storage)
* dotenv, cors, cookie-parser

---

## ✏️ Author

**Mohamed Jalal M K**

MIT License

> 🌟 Feel free to fork, star, and contribute!
