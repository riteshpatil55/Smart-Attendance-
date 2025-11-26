# Smart-Attendance-
A Smart Attendance System of Students with voice recognition.
# 🎤 Voice Recognition Attendance System

A web-based student attendance system using the **Web Speech API**.

✔ Mark attendance by speaking student name  
✔ Stores records in browser `localStorage`  
✔ CSV Export for easy submission  
✔ Works on Chrome Desktop + Android with HTTPS

---

## 🚀 How to Use

1️⃣ Upload this folder to a Public GitHub Repository  
2️⃣ Go to **Settings → Pages**  
3️⃣ Enable **Deploy from branch: main → root**  
4️⃣ Access your Live HTTPS URL  
5️⃣ Open the website in Chrome  
6️⃣ Click **🎤 Start Listening** → Speak Student Name  
7️⃣ Export CSV for attendance report 📥

---

## ⚠ Requirements

| Feature | Browser Support |
|--------|----------------|
| Microphone | Chrome + HTTPS (or localhost) |
| Web Speech API | Best on Chrome |

---

## ✏️ Editing Student List
click on **Student Database → Edit** and click **Save DB**.

Format:
```json
[
  {"name": "John Doe", "usn": "1CD23CS001"},
  {"name": "Jane", "usn": "1CD23CS002"}
]
