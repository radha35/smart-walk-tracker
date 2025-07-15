# 🌱 EcoWalk – Smart Walking Tracker (Web App)

EcoWalk is a lightweight, user-friendly web app designed to promote healthy living and environmental awareness. Whether you're going for a real-world walk or simulating a stroll through Mumbai, EcoWalk tracks your steps, distance, calories burned, and more — right from your browser!

---

## 🧠 How It Works

- **Mode Selection**: Choose between **Real GPS Mode** or **Simulate Mode**.
- **Real GPS** uses your actual device’s geolocation to track movement.
- **Simulate Mode** lets you choose a city (e.g., Mumbai) and simulate walking using a "Next Step" button.
- **Canvas Map** visually draws your walking path.
- Tracks:
  - ⏱ Time
  - 🛣 Distance (in meters)
  - 👣 Steps (calculated approx. 1 step per 0.75m)
  - 🔥 Calories burned (0.04 kcal per step)

---

## ✨ Features

✅ Real GPS-based walk tracking  
✅ Simulated location mode  
✅ Visual map with **Canvas API**  
✅ Set a **Step Goal** with a live **Progress Bar**  
✅ 🎯 Achievement Notifications (e.g., 10-min walk completed)  
✅ 📊 Chart to view previous walk history  
✅ 📱 Share your walk stats on **Twitter or WhatsApp**  
✅ 📶 Detect offline/slow internet with **Network Information API**  
✅ 🔐 No login or backend required — fully client-side  
✅ 💾 Saves walk history with **LocalStorage**

---

## 🌐 Web APIs Used

| Web API | Usage |
|--------|-------|
| [📍 Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API) | Tracks your latitude and longitude in real-time |
| [🖼️ Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) | Visualizes the walking path on a canvas |
| [🌐 Network Information API](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API) | Monitors network speed and alerts if slow/offline |

---

## 🎯 Solving Real-World Problems

🌍 **Eco-Friendly Travel**: Encourages walking over short-distance vehicle use  
🏃 **Promotes Fitness**: Tracks and motivates daily step goals  
📱 **Offline Friendly**: Doesn’t rely on internet or mobile data  
🧠 **Educational**: Great demonstration of modern Web APIs  
🆓 **No App Installation**: Works entirely in browser  

---

## 📁 Project Structure

```bash
EcoWalk/
├── index.html           # Main UI
├── style.css            # Styling & layout
├── script.js            # Functionality & API integrations
└── README.md            # Project overview

 📤 Share Example

When the user clicks “Share”, a message like this is generated:

> “I just walked 2.3 km and burned 80 calories using #EcoWalk! 🌱🚶‍♀️”

You can share this message on:

- 🐦 **Twitter**
- 📱 **WhatsApp**
- 📋 **Clipboard for any other app**

---

### 🖼️ Live Demo Screenshot

![EcoWalk Screenshot](C:\Users\91808\Pictures\Screenshots\Screenshot 2025-07-15 111319.png)
