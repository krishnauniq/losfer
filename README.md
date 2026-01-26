# LOSFER - Campus Lost & Found System

**Find What’s Lost. Return What’s Found.**

LOSFER is a modern, secure, and community-driven web application designed exclusively for students to report and recover lost items on campus. It solves the chaos of lost items by providing a centralized digital platform with smart search, real-time alerts, and secure claims.



## 🚀 Key Features

*   **Smart Search:** Quickly find items using keywords, categories, or date filters.
*   **AI-Powered Recognition:** Upload an image of a found item, and our AI (TensorFlow.js) automatically tags and categorizes it.
*   **Secure Claims:** Claim items securely using unique questions or proof of ownership.
*   **QR Code Integration:** Generate specific QR codes for items to streamline the return process.
*   **Community Trust:** Built-in "Trust Score" system to identify reliable finders and verify claims.
*   **Real-time Notifications:** Get alerted immediately when someone finds your lost item or claims an item you found.
*   **Privacy First:** built with strict privacy controls to keep student data safe.

## 🛠 Tech Stack

*   **Frontend:** React.js (Vite/CRA), Tailwind CSS
*   **Backend / Cloud:** Firebase (Auth, Firestore, Storage)
*   **AI / ML:** TensorFlow.js, NSFWJS (Content moderation)
*   **Utilities:** `html5-qrcode` (Scanning), `jspdf` (Reports), `react-router-dom`

## 📦 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/losfer.git
    cd losfer
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env.local` file in the root directory and add your Firebase credentials:
    ```env
    REACT_APP_FIREBASE_API_KEY=your_api_key
    REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
    REACT_APP_FIREBASE_PROJECT_ID=your_project_id
    REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    REACT_APP_FIREBASE_APP_ID=your_app_id
    ```

4.  **Run the application**
    ```bash
    npm start
    ```
    The app will open at `http://localhost:3000`.

## 📱 Mobile App (Coming Soon)

We are currently working on a mobile version of LOSFER using **Capacitor**, which will bring:
*   Native Camera support for faster scanning.
*   Push notifications directly to your phone.
*   Offline access to recent listings.

## 🤝 Contributing

This project is built for the students, by the students. If you'd like to contribute:
1.  Fork the repo.
2.  Create a feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the `LICENSE` file for details.

---

**Contact:** campuslosfer@gmail.com
