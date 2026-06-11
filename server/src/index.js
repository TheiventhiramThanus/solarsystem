const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const admin = require("firebase-admin");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ----------------------------------------------------
// Firebase Admin SDK Initialization
// ----------------------------------------------------
let isFirebaseAdminInitialized = false;

// Load service account key from a local JSON file
try {
  // 👉 Update the path if your serviceAccountKey.json is located elsewhere
  const serviceAccount = require("./serviceAccountKey.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  isFirebaseAdminInitialized = true;
  console.log("🔒 Firebase Admin SDK initialized successfully.");
} catch (error) {
  console.error("⚠️ Failed to initialize Firebase Admin SDK:", error.message);
}
// ----------------------------------------------------

// Admin route to create a Compliance Officer user
app.post("/api/admin/create-officer", async (req, res) => {
  const { companyId, companyName, fullName, email, password } = req.body;

  if (!fullName || !email || !password || !companyId) {
    return res.status(400).json({ message: "Missing required officer credentials." });
  }

  try {
    if (isFirebaseAdminInitialized) {
      // Create user in Firebase Authentication using Admin SDK
      const userRecord = await admin.auth().createUser({
        email: email,
        password: password,
        displayName: fullName
      });

      // Write user details to Firestore
      const db = admin.firestore();
      const userData = {
        uid: userRecord.uid,
        fullName,
        email,
        role: "officer",
        companyId,
        companyName,
        status: "active",
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };

      await db.collection("users").doc(userRecord.uid).set(userData);

      return res.status(201).json(userData);
    } else {
      // Simulated officer creation fallback
      console.log(`[SIMULATION] Creating Officer Account - Name: ${fullName}, Email: ${email}, Company: ${companyName}`);
      const mockOfficer = {
        uid: "user_officer_" + Date.now(),
        fullName,
        email,
        role: "officer",
        companyId,
        companyName,
        status: "active",
        createdAt: Date.now()
      };
      return res.status(201).json(mockOfficer);
    }
  } catch (error) {
    console.error("Error creating officer:", error);
    return res.status(500).json({ message: error.message || "Failed to create officer account." });
  }
});

// Admin route to toggle user status (suspend/activate)
app.post("/api/admin/set-status", async (req, res) => {
  const { uid, status } = req.body; // status: "active" | "suspended"

  if (!uid || !status) {
    return res.status(400).json({ message: "Missing user ID or status." });
  }

  try {
    if (isFirebaseAdminInitialized) {
      const db = admin.firestore();
      
      // Update Firestore user document
      await db.collection("users").doc(uid).update({ status });

      // If suspended, we revoke the user's refresh tokens in Firebase Auth so they are instantly signed out
      if (status === "suspended") {
        await admin.auth().revokeRefreshTokens(uid);
      }

      return res.status(200).json({ uid, status });
    } else {
      console.log(`[SIMULATION] Setting user ${uid} status to ${status}`);
      return res.status(200).json({ uid, status });
    }
  } catch (error) {
    console.error("Error setting user status:", error);
    return res.status(500).json({ message: error.message || "Failed to modify user status." });
  }
});

// Root check endpoint
app.get("/", (req, res) => {
  res.json({
    status: "healthy",
    message: "UK Solar SME Toolkit Backend API",
    mode: isFirebaseAdminInitialized ? "Firebase Live" : "Offline Simulation"
  });
});

// Start listening
app.listen(PORT, () => {
  console.log(`🚀 Express server running on port http://localhost:${PORT}`);
});
