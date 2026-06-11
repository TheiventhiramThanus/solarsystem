import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as fbSignOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, addDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

// ----------------------------------------------------
// 1. Firebase Initialization & Detection
// ----------------------------------------------------
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const isFirebaseConfigured =
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== "YOUR_API_KEY" &&
  firebaseConfig.projectId;

let app, auth, db, storage;
let isMock = true;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    isMock = false;
    console.log("🚀 Connected to Live Firebase successfully!");
  } catch (error) {
    console.error("⚠️ Firebase initialization failed, falling back to Mock Mode:", error);
    isMock = true;
  }
} else {
  console.log("ℹ️ No Firebase credentials detected. Operating in Client-Side Simulation Mode.");
}

// Export mock state indicator
export { isMock };

// ----------------------------------------------------
// 2. Mock Database Seeding & Setup
// ----------------------------------------------------
const MOCK_STORAGE_KEYS = {
  USERS: "solartoolkit_users",
  COMPANIES: "solartoolkit_companies",
  CHECKLISTS: "solartoolkit_checklists",
  RISKS: "solartoolkit_risks",
  DOCUMENTS: "solartoolkit_documents",
  RESOURCES: "solartoolkit_resources",
  UPDATES: "solartoolkit_updates",
  FEEDBACK: "solartoolkit_feedback",
  ACTIVITIES: "solartoolkit_activities",
  NOTIFICATIONS: "solartoolkit_notifications",
  CURRENT_USER: "solartoolkit_current_user"
};

// Default static resources & updates
const DEFAULT_RESOURCES = [
  { resourceId: "res_1", name: "MCS 001 - Installer Certification Standard", purpose: "The core requirements for companies seeking MCS accreditation for microgeneration systems.", url: "https://mcscertified.com/standards-tools-library/", category: "MCS", trustedSource: true },
  { resourceId: "res_2", name: "HSE - Working at Height Regulations 2005", purpose: "Official safety guidelines, risk prevention strategies, and scaffolding standards for solar roof installs.", url: "https://www.hse.gov.uk/work-at-height/index.htm", category: "HSE", trustedSource: true },
  { resourceId: "res_3", name: "IET BS 7671 Amendment 2:2022", purpose: "Requirements for electrical installations, highlighting domestic solar PV cabling, grounding, and battery storage safety.", url: "https://electrical.theiet.org/bs-7671/", category: "DNO", trustedSource: true },
  { resourceId: "res_4", name: "Ofgem - Smart Export Guarantee (SEG) Guide", purpose: "Information on how solar SMEs register installations to enable export tariff payouts for client homeowners.", url: "https://www.ofgem.gov.uk/environmental-programmes/smart-export-guarantee-seg", category: "Ofgem", trustedSource: true },
  { resourceId: "res_5", name: "UK Planning Portal - Solar PV Permitted Development", purpose: "A guide to planning permissions, structural load limitations, and aesthetic conservation area restrictions for solar.", url: "https://www.planningportal.co.uk/info/200130/common_projects/51/solar_panels", category: "Planning Portal", trustedSource: true }
];

const DEFAULT_UPDATES = [
  { updateId: "up_1", title: "BS 7671:2018 IET Wiring Regulations Amendment 3 Draft", category: "Regulatory", description: "Proposing mandatory revisions for domestic PV DC isolator placement and surge protection devices (SPDs). Compliance will be required within six months of final publication.", source: "IET (Institution of Engineering and Technology)", date: new Date("2026-05-15T09:00:00Z").getTime(), createdBy: "Admin" },
  { updateId: "up_2", title: "MCS Schema Updates: Mandatory Roofing Structural Sign-offs", category: "Industry Alert", description: "New MCS rules require that all domestic solar installations have a signed structural assessment demonstrating roof suitability for wind load under MCS 012 guidelines before installation starts.", source: "MCS Accreditation Body", date: new Date("2026-06-01T10:30:00Z").getTime(), createdBy: "Admin" },
  { updateId: "up_3", title: "HSE Scaffolding Inspection Blitz on Solar Installations", category: "Health & Safety", description: "The Health & Safety Executive (HSE) has launched a nationwide safety campaign targeting microgeneration contractors. Site audits will focus on edge protection, harness anchoring, and scaffold inspections.", source: "HSE United Kingdom", date: new Date("2026-05-20T14:00:00Z").getTime(), createdBy: "Admin" }
];

// Preloaded SME Data representing "SolarForce UK Ltd"
const DEMO_COMPANY_ID = "company_solarforce";
const DEMO_OWNER_ID = "user_demo_owner";
const DEMO_OFFICER_ID = "user_demo_officer";

const DEMO_COMPANY = {
  companyId: DEMO_COMPANY_ID,
  companyName: "SolarForce UK Ltd",
  ownerId: DEMO_OWNER_ID,
  industry: "Solar Installation",
  address: "Unit 12, Chester Innovation Park, Chester, CH1 4BJ",
  phone: "+44 (0) 1244 555 782",
  createdAt: new Date("2026-01-15T08:00:00Z").getTime()
};

const DEMO_USERS = [
  { uid: DEMO_OWNER_ID, fullName: "Jeneevan Jeyarasa", email: "owner@solarforce.co.uk", role: "owner", companyId: DEMO_COMPANY_ID, companyName: "SolarForce UK Ltd", status: "active", createdAt: new Date("2026-01-15T08:00:00Z").getTime() },
  { uid: DEMO_OFFICER_ID, fullName: "David Miller", email: "compliance@solarforce.co.uk", role: "officer", companyId: DEMO_COMPANY_ID, companyName: "SolarForce UK Ltd", status: "active", createdAt: new Date("2026-02-01T09:00:00Z").getTime() },
  { uid: "user_demo_admin", fullName: "System Admin", email: "admin@gmail.com", role: "admin", companyId: "", companyName: "Platform Administration", status: "active", createdAt: new Date("2026-01-01T00:00:00Z").getTime() }
];

const DEFAULT_CHECKLISTS = [
  // Phase 1
  { checklistId: "chk_1", companyId: DEMO_COMPANY_ID, userId: DEMO_OWNER_ID, phase: "Phase 1: Registration & Accreditations", taskName: "Obtain MCS Accreditation", actionRequired: "Submit company quality management handbook, undergo site inspection, and secure certificate code.", completed: true, updatedAt: new Date("2026-02-10T11:00:00Z").getTime() },
  { checklistId: "chk_2", companyId: DEMO_COMPANY_ID, userId: DEMO_OWNER_ID, phase: "Phase 1: Registration & Accreditations", taskName: "Register with RECC / HIES Consumer Code", actionRequired: "Join a recognized consumer protection code to cover deposits, guarantee protection, and provide mediation services.", completed: true, updatedAt: new Date("2026-02-12T15:30:00Z").getTime() },
  { checklistId: "chk_3", companyId: DEMO_COMPANY_ID, userId: DEMO_OWNER_ID, phase: "Phase 1: Registration & Accreditations", taskName: "NICEIC / NAPIT Electrical Body Enrolment", actionRequired: "Enrol company and qualified supervisors with an electrical Competent Person Scheme (CPS) for building regulation self-certification.", completed: true, updatedAt: new Date("2026-02-15T10:00:00Z").getTime() },
  { checklistId: "chk_4", companyId: DEMO_COMPANY_ID, userId: DEMO_OWNER_ID, phase: "Phase 1: Registration & Accreditations", taskName: "Secure Public & Product Liability Insurance", actionRequired: "Ensure minimum £2,000,000 indemnity limit to cover roof damages, electrical failures, and structural incidents.", completed: true, updatedAt: new Date("2026-01-16T12:00:00Z").getTime() },
  
  // Phase 2
  { checklistId: "chk_5", companyId: DEMO_COMPANY_ID, userId: DEMO_OWNER_ID, phase: "Phase 2: Health & Safety / Pre-Installation", taskName: "Draft Risk Assessment & Method Statement (RAMS)", actionRequired: "Conduct scaffolding height safety, heavy lift solar weight, and AC/DC isolation risk analysis before every job.", completed: true, updatedAt: new Date("2026-03-05T09:00:00Z").getTime() },
  { checklistId: "chk_6", companyId: DEMO_COMPANY_ID, userId: DEMO_OWNER_ID, phase: "Phase 2: Health & Safety / Pre-Installation", taskName: "Perform Structural Load Roofing Check", actionRequired: "Engage structural engineer or use MCS 012 calculators to verify roof rafters can sustain panel dead load and local wind loads.", completed: false, updatedAt: new Date("2026-03-05T09:00:00Z").getTime() },
  { checklistId: "chk_7", companyId: DEMO_COMPANY_ID, userId: DEMO_OWNER_ID, phase: "Phase 2: Health & Safety / Pre-Installation", taskName: "Deliver CDM 2015 Pre-Construction Information", actionRequired: "Establish site rules, identify storage zones, outline fire assembly points, and brief sub-contractors.", completed: true, updatedAt: new Date("2026-03-10T14:00:00Z").getTime() },
  
  // Phase 3
  { checklistId: "chk_8", companyId: DEMO_COMPANY_ID, userId: DEMO_OWNER_ID, phase: "Phase 3: Installation Standards (BS 7671)", taskName: "Ensure MCS 012 Certified Mounting Brackets", actionRequired: "Verify roof hooks match roof tile type and have wind-uplift test certificates to avoid future slate shearing.", completed: true, updatedAt: new Date("2026-03-20T16:00:00Z").getTime() },
  { checklistId: "chk_9", companyId: DEMO_COMPANY_ID, userId: DEMO_OWNER_ID, phase: "Phase 3: Installation Standards (BS 7671)", taskName: "DC Cable Sizing & UV Protected Conduit Routing", actionRequired: "Route DC strings in flame-retardant UV-stable conduits. Minimize DC runs to prevent voltage drop and arc-faults.", completed: false, updatedAt: new Date("2026-03-20T16:00:00Z").getTime() },
  { checklistId: "chk_10", companyId: DEMO_COMPANY_ID, userId: DEMO_OWNER_ID, phase: "Phase 3: Installation Standards (BS 7671)", taskName: "Apply Regulatory Warning & Fire Labels", actionRequired: "Affix 'Dual Supply' labels at consumer unit, solar AC isolator, DC isolators, and inverter cabinet to warn emergency responders.", completed: false, updatedAt: new Date("2026-03-21T10:00:00Z").getTime() },
  
  // Phase 4
  { checklistId: "chk_11", companyId: DEMO_COMPANY_ID, userId: DEMO_OWNER_ID, phase: "Phase 4: Commissioning & DNO Notification", taskName: "Submit G98 / G99 Grid Notification to DNO", actionRequired: "Submit form to local Distribution Network Operator (DNO) within 28 days of commissioning (G98 for small systems).", completed: false, updatedAt: new Date("2026-03-25T11:00:00Z").getTime() },
  { checklistId: "chk_12", companyId: DEMO_COMPANY_ID, userId: DEMO_OWNER_ID, phase: "Phase 4: Commissioning & DNO Notification", taskName: "Generate MCS Installation Certificate", actionRequired: "Enter compliance details on central MCS registry, pay fee, and issue certificate to client.", completed: false, updatedAt: new Date("2026-03-25T11:00:00Z").getTime() },
  { checklistId: "chk_13", companyId: DEMO_COMPANY_ID, userId: DEMO_OWNER_ID, phase: "Phase 4: Commissioning & DNO Notification", taskName: "Compile Client Handover Pack", actionRequired: "Deliver MCS Certificate, Electrical Installation Certificate (EIC), structural report, product warranties, and user guides.", completed: false, updatedAt: new Date("2026-03-26T14:00:00Z").getTime() }
];

const DEFAULT_RISKS = [
  { riskId: "r_1", companyId: DEMO_COMPANY_ID, complianceArea: "Health & Safety", potentialRisk: "Falls from height during roof installation due to wind or loose ladders.", riskLevel: "High", mitigationAction: "Mandatory scaffold edge protection, safety harness anchor points, and stop-work wind speed rules (>25mph).", status: "Mitigated", createdAt: new Date("2026-02-05T09:00:00Z").getTime() },
  { riskId: "r_2", companyId: DEMO_COMPANY_ID, complianceArea: "Electrical Standards", potentialRisk: "DC arc faulting in loft spaces causing fire hazards from poorly crimped MC4 plugs.", riskLevel: "High", mitigationAction: "Use manufacturer-matched MC4 crimping tools, inspect terminations using thermal cameras, and implement in-line DC fuses.", status: "Mitigated", createdAt: new Date("2026-02-10T10:30:00Z").getTime() },
  { riskId: "r_3", companyId: DEMO_COMPANY_ID, complianceArea: "Structural Integrity", potentialRisk: "Roof structure sagging or tile cracking under dead load of PV arrays.", riskLevel: "Medium", mitigationAction: "Mandatory structural pre-assessment calculations. Replace damaged clay tiles with metal flashing replacements.", status: "Reviewed", createdAt: new Date("2026-03-01T15:00:00Z").getTime() },
  { riskId: "r_4", companyId: DEMO_COMPANY_ID, complianceArea: "Grid Connection", potentialRisk: "DNO delays in G99 approval blocking installation commissioning for commercial projects.", riskLevel: "Medium", mitigationAction: "Submit G99 connection request during feasibility stage, before ordering equipment or signing final client contracts.", status: "Open", createdAt: new Date("2026-03-12T11:00:00Z").getTime() }
];

const DEFAULT_DOCUMENTS = [
  { documentId: "doc_1", companyId: DEMO_COMPANY_ID, userId: DEMO_OWNER_ID, documentName: "Public_Liability_Insurance_2026.pdf", documentType: "insurance", fileUrl: "virtual://insurance_cert", uploadedAt: new Date("2026-01-16T12:00:00Z").getTime() },
  { documentId: "doc_2", companyId: DEMO_COMPANY_ID, userId: DEMO_OWNER_ID, documentName: "MCS_Installer_Accreditation_Certificate.pdf", documentType: "mcs-certificate", fileUrl: "virtual://mcs_cert", uploadedAt: new Date("2026-02-10T11:00:00Z").getTime() },
  { documentId: "doc_3", companyId: DEMO_COMPANY_ID, userId: DEMO_OWNER_ID, documentName: "NICEIC_Enrolment_Confirmation.pdf", documentType: "electrical-certificate", fileUrl: "virtual://niceic_cert", uploadedAt: new Date("2026-02-15T10:00:00Z").getTime() },
  { documentId: "doc_4", companyId: DEMO_COMPANY_ID, userId: DEMO_OWNER_ID, documentName: "RAMS_Standard_PV_Roof_Scaffold.pdf", documentType: "risk-assessment", fileUrl: "virtual://rams_roof", uploadedAt: new Date("2026-03-05T09:00:00Z").getTime() }
];

const DEFAULT_ACTIVITIES = [
  { activityId: "act_1", userId: DEMO_OWNER_ID, companyId: DEMO_COMPANY_ID, actionType: "Login", description: "SME Owner Jeneevan Jeyarasa signed in.", createdAt: new Date("2026-06-10T08:00:00Z").getTime() },
  { activityId: "act_2", userId: DEMO_OWNER_ID, companyId: DEMO_COMPANY_ID, actionType: "Checklist Update", description: "Checked off task: Obtain MCS Accreditation", createdAt: new Date("2026-02-10T11:00:00Z").getTime() },
  { activityId: "act_3", userId: DEMO_OWNER_ID, companyId: DEMO_COMPANY_ID, actionType: "Document Upload", description: "Uploaded document: Public_Liability_Insurance_2026.pdf", createdAt: new Date("2026-01-16T12:00:00Z").getTime() },
  { activityId: "act_4", userId: DEMO_OWNER_ID, companyId: DEMO_COMPANY_ID, actionType: "Risk Updates", description: "Created risk entry: Falls from height during roof installation.", createdAt: new Date("2026-02-05T09:00:00Z").getTime() },
  { activityId: "act_5", userId: DEMO_OFFICER_ID, companyId: DEMO_COMPANY_ID, actionType: "Checklist Update", description: "Compliance Officer David Miller marked 'RAMS drafting' completed.", createdAt: new Date("2026-03-05T09:00:00Z").getTime() }
];

const DEFAULT_NOTIFICATIONS = [
  { notificationId: "n_1", companyId: DEMO_COMPANY_ID, title: "MCS Scheme Audit Scheduled", message: "Annual office and site compliance inspection scheduled for June 24, 2026.", type: "review", read: false, createdAt: new Date("2026-06-08T09:00:00Z").getTime() },
  { notificationId: "n_2", companyId: DEMO_COMPANY_ID, title: "Insurance Expiry Warning", message: "Your Public Liability Policy expires in 45 days. Review coverage options.", type: "renewal", read: false, createdAt: new Date("2026-06-05T10:30:00Z").getTime() },
  { notificationId: "n_3", companyId: DEMO_COMPANY_ID, title: "Regulatory Alert: BS 7671 Amendment 3", message: "A draft amendment for domestic PV DC isolators has been published. Read updates.", type: "alert", read: true, createdAt: new Date("2026-05-15T09:05:00Z").getTime() }
];

const DEFAULT_FEEDBACK = [
  { feedbackId: "fb_1", name: "Sarah Jenkins", email: "sjenkins@solarsolutions.co.uk", company: "Solar Solutions Ltd", type: "Feature Request", message: "We would love to see an integration with electrical calculation software (like Amtech) to directly fetch design sheets into the document center.", createdAt: new Date("2026-06-02T11:00:00Z").getTime() },
  { feedbackId: "fb_2", name: "Mark Peterson", email: "mpeterson@eco-power.co.uk", company: "EcoPower Contractors", type: "General Query", message: "Does this compliance checklist fully align with the latest MCS Solar PV Installer Standards (v1.6)? Thank you for the academic work.", createdAt: new Date("2026-06-04T15:30:00Z").getTime() }
];

// Initialize LocalStorage Collections if they do not exist
const initLocalStorage = () => {
  const getOrSet = (key, defaultVal) => {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(defaultVal));
    }
  };
  
  getOrSet(MOCK_STORAGE_KEYS.USERS, DEMO_USERS);
  getOrSet(MOCK_STORAGE_KEYS.COMPANIES, [DEMO_COMPANY]);
  getOrSet(MOCK_STORAGE_KEYS.CHECKLISTS, DEFAULT_CHECKLISTS);
  getOrSet(MOCK_STORAGE_KEYS.RISKS, DEFAULT_RISKS);
  getOrSet(MOCK_STORAGE_KEYS.DOCUMENTS, DEFAULT_DOCUMENTS);
  getOrSet(MOCK_STORAGE_KEYS.RESOURCES, DEFAULT_RESOURCES);
  getOrSet(MOCK_STORAGE_KEYS.UPDATES, DEFAULT_UPDATES);
  getOrSet(MOCK_STORAGE_KEYS.FEEDBACK, DEFAULT_FEEDBACK);
  getOrSet(MOCK_STORAGE_KEYS.ACTIVITIES, DEFAULT_ACTIVITIES);
  getOrSet(MOCK_STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
  
  // Set default visitor state if current user empty
  if (!localStorage.getItem(MOCK_STORAGE_KEYS.CURRENT_USER)) {
    localStorage.setItem(MOCK_STORAGE_KEYS.CURRENT_USER, JSON.stringify(null));
  }
};

if (isMock) {
  initLocalStorage();
}

// ----------------------------------------------------
// 3. Unified Authentication Interface
// ----------------------------------------------------
export const authService = {
  signUp: async (fullName, email, password, companyName, role = "owner") => {
    if (isMock) {
      const users = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEYS.USERS));
      const companies = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEYS.COMPANIES));
      
      const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (emailExists) throw new Error("Email address already registered.");
      
      const uid = "user_" + Date.now();
      
        // Determine role handling
        if (role === "admin") {
          // Admin user with fixed credentials
          const adminEmail = "admin@gmail.com";
          const newUser = {
            uid,
            fullName,
            email: adminEmail,
            role: "admin",
            companyId: "",
            companyName: "Platform Administration",
            status: "active",
            createdAt: Date.now()
          };
          users.push(newUser);
          localStorage.setItem(MOCK_STORAGE_KEYS.USERS, JSON.stringify(users));
          localStorage.setItem(MOCK_STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
          return newUser;
        }
      
      // Non-admin roles (owner/officer)
      const companyId = "company_" + Date.now();
      const newCompany = {
        companyId,
        companyName,
        ownerId: uid,
        industry: "Solar Installation",
        address: "Address Pending Registration",
        phone: "Phone Pending Registration",
        createdAt: Date.now()
      };
      
      const newUser = {
        uid,
        fullName,
        email,
        role,
        companyId,
        companyName,
        status: "active",
        createdAt: Date.now()
      };
      
      users.push(newUser);
      companies.push(newCompany);
      
      localStorage.setItem(MOCK_STORAGE_KEYS.USERS, JSON.stringify(users));
      localStorage.setItem(MOCK_STORAGE_KEYS.COMPANIES, JSON.stringify(companies));
      
      // Initialize checklist for this new company
      const checklists = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEYS.CHECKLISTS));
      const newChecklists = DEFAULT_CHECKLISTS.map((c, i) => ({
        ...c,
        checklistId: `chk_new_${uid}_${i}`,
        companyId,
        userId: uid,
        completed: false,
        updatedAt: Date.now()
      }));
      localStorage.setItem(MOCK_STORAGE_KEYS.CHECKLISTS, JSON.stringify([...checklists, ...newChecklists]));
      
      // Initialize default notifications
      const notifications = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEYS.NOTIFICATIONS));
      const newNotifications = DEFAULT_NOTIFICATIONS.map((n, i) => ({
        ...n,
        notificationId: `notif_new_${uid}_${i}`,
        companyId,
        read: false,
        createdAt: Date.now()
      }));
      localStorage.setItem(MOCK_STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([...notifications, ...newNotifications]));

      localStorage.setItem(MOCK_STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
      return newUser;
    } else {
      // Firebase Live Sign Up
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      const companyId = role === "admin" ? "" : "company_" + uid;
      
      const userData = {
        uid,
        fullName,
        email,
        role,
        companyId,
        companyName: role === "admin" ? "Platform Administration" : companyName,
        status: "active",
        createdAt: Date.now()
      };
      
      await setDoc(doc(db, "users", uid), userData);

      if (role !== "admin") {
        const companyData = {
          companyId,
          companyName,
          ownerId: uid,
          industry: "Solar Installation",
          address: "Address Pending Registration",
          phone: "Phone Pending Registration",
          createdAt: Date.now()
        };
        await setDoc(doc(db, "companies", companyId), companyData);
        
        // Seed firestore checklist
        for (const item of DEFAULT_CHECKLISTS) {
          const checkId = `chk_${uid}_${Math.random().toString(36).substr(2, 9)}`;
          await setDoc(doc(db, "checklists", checkId), {
            ...item,
            checklistId: checkId,
            companyId,
            userId: uid,
            completed: false,
            updatedAt: Date.now()
          });
        }
        
        // Seed firestore notifications
        for (const item of DEFAULT_NOTIFICATIONS) {
          const notifId = `notif_${uid}_${Math.random().toString(36).substr(2, 9)}`;
          await setDoc(doc(db, "notifications", notifId), {
            ...item,
            notificationId: notifId,
            companyId,
            read: false,
            createdAt: Date.now()
          });
        }
      }
      
      return userData;
    }
  },
  
  signIn: async (email, password) => {
    if (isMock) {
      const users = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEYS.USERS));
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!user) throw new Error("Invalid email or password.");
      if (user.status === "suspended") throw new Error("This account is suspended. Contact administrator.");
      
      // Quick plain password verification for presentation demo purposes
      if (email === "admin@gmail.com" && password === "password123456") {
        // Allow admin demo login with preset credentials
        localStorage.setItem(MOCK_STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        return user;
      }
      
      if (password !== "password" && password !== "admin123") {
        if (email !== "owner@solarforce.co.uk" && email !== "compliance@solarforce.co.uk" && email !== "admin@gmail.com") {
          // Allow any password for new self-registered mock accounts to prevent presentation failure
        } else {
          throw new Error("Invalid password. Use 'password' for demo accounts.");
        }
      }
      
      localStorage.setItem(MOCK_STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      
      // Log login activity
      const companyId = user.companyId || "";
      const activities = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEYS.ACTIVITIES));
      activities.push({
        activityId: "act_" + Date.now(),
        userId: user.uid,
        companyId,
        actionType: "Login",
        description: `${user.fullName} (${user.role}) successfully logged in.`,
        createdAt: Date.now()
      });
      localStorage.setItem(MOCK_STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));

      return user;
    } else {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDocRef = doc(db, "users", userCredential.user.uid);
      let userDoc = await getDoc(userDocRef);
      // If user document does not exist (e.g., admin default login), create a minimal record
      if (!userDoc.exists()) {
        const fallbackUser = {
          uid: userCredential.user.uid,
          fullName: "Admin User",
          email,
          role: email === "admin@gmail.com" ? "admin" : "owner",
          companyId: "",
          companyName: "Platform Administration",
          status: "active",
          createdAt: Date.now()
        };
        await setDoc(userDocRef, fallbackUser);
        userDoc = { exists: () => true, data: () => fallbackUser };
      }
      const userData = userDoc.data();
      if (userData.status === "suspended") throw new Error("This account is suspended. Contact administrator.");

      // Log login activity
      await addDoc(collection(db, "activities"), {
        activityId: "act_" + Date.now(),
        userId: userData.uid,
        companyId: userData.companyId || "",
        actionType: "Login",
        description: `${userData.fullName} (${userData.role}) successfully logged in.`,
        createdAt: Date.now()
      });

      return userData;
    }
  },
  
  signOut: async () => {
    if (isMock) {
      localStorage.setItem(MOCK_STORAGE_KEYS.CURRENT_USER, JSON.stringify(null));
      return null;
    } else {
      await fbSignOut(auth);
      return null;
    }
  },
  
  getCurrentUser: () => {
    if (isMock) {
      return JSON.parse(localStorage.getItem(MOCK_STORAGE_KEYS.CURRENT_USER));
    } else {
      const user = auth.currentUser;
      if (!user) return null;
      return user;
    }
  },
  
  onAuthStateChangedListener: (callback) => {
    if (isMock) {
      // Mock triggers immediately on subscription
      const user = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEYS.CURRENT_USER));
      callback(user);
      
      // Poll storage for login state updates (to support dashboard switches)
      const interval = setInterval(() => {
        const currentUser = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEYS.CURRENT_USER));
        callback(currentUser);
      }, 800);
      return () => clearInterval(interval);
    } else {
      return onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            callback(userDoc.data());
          } else {
            callback(null);
          }
        } else {
          callback(null);
        }
      });
    }
  },
  
  // Custom sign in helper for Demo Mode Switcher
  forceDemoLogin: (role) => {
    if (isMock) {
      const users = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEYS.USERS));
      let targetUser = users.find(u => u.role === role);
      if (!targetUser) {
        if (role === "admin") targetUser = users.find(u => u.email === "admin@toolkit.co.uk");
        else if (role === "owner") targetUser = users.find(u => u.email === "owner@solarforce.co.uk");
        else targetUser = users.find(u => u.email === "compliance@solarforce.co.uk");
      }
      localStorage.setItem(MOCK_STORAGE_KEYS.CURRENT_USER, JSON.stringify(targetUser));
      return targetUser;
    }
    return null;
  }
};

// ----------------------------------------------------
// 4. Unified Firestore Database & Storage Services
// ----------------------------------------------------
export const dbService = {
  // Companies
  getCompany: async (companyId) => {
    if (isMock) {
      const companies = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEYS.COMPANIES));
      return companies.find(c => c.companyId === companyId) || null;
    } else {
      const companyDoc = await getDoc(doc(db, "companies", companyId));
      return companyDoc.exists() ? companyDoc.data() : null;
    }
  },
  
  updateCompany: async (companyId, data) => {
    if (isMock) {
      const companies = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEYS.COMPANIES));
      const idx = companies.findIndex(c => c.companyId === companyId);
      if (idx > -1) {
        companies[idx] = { ...companies[idx], ...data };
        localStorage.setItem(MOCK_STORAGE_KEYS.COMPANIES, JSON.stringify(companies));
        return companies[idx];
      }
      return null;
    } else {
      const ref = doc(db, "companies", companyId);
      await updateDoc(ref, data);
      return data;
    }
  },
  
  // Checklists
  getChecklists: async (companyId) => {
    if (isMock) {
      const checklists = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEYS.CHECKLISTS));
      return checklists.filter(c => c.companyId === companyId);
    } else {
      const q = query(collection(db, "checklists"), where("companyId", "==", companyId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => d.data());
    }
  },
  
  toggleChecklistTask: async (checklistId, completed, userId, userName) => {
    if (isMock) {
      const checklists = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEYS.CHECKLISTS));
      const idx = checklists.findIndex(c => c.checklistId === checklistId);
      if (idx > -1) {
        checklists[idx].completed = completed;
        checklists[idx].updatedAt = Date.now();
        localStorage.setItem(MOCK_STORAGE_KEYS.CHECKLISTS, JSON.stringify(checklists));
        
        // Log Activity
        const activities = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEYS.ACTIVITIES));
        activities.push({
          activityId: "act_" + Date.now(),
          userId,
          companyId: checklists[idx].companyId,
          actionType: "Checklist Update",
          description: `${userName} marked task '${checklists[idx].taskName}' as ${completed ? 'completed' : 'incomplete'}.`,
          createdAt: Date.now()
        });
        localStorage.setItem(MOCK_STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
        
        return checklists[idx];
      }
      return null;
    } else {
      const q = query(collection(db, "checklists"), where("checklistId", "==", checklistId));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      const docRef = snapshot.docs[0].ref;
      const taskData = snapshot.docs[0].data();
      
      await updateDoc(docRef, { completed, updatedAt: Date.now() });
      
      await addDoc(collection(db, "activities"), {
        activityId: "act_" + Date.now(),
        userId,
        companyId: taskData.companyId,
        actionType: "Checklist Update",
        description: `${userName} marked task '${taskData.taskName}' as ${completed ? 'completed' : 'incomplete'}.`,
        createdAt: Date.now()
      });
      
      return { ...taskData, completed };
    }
  },
  
  // Risks
  getRisks: async (companyId) => {
    if (isMock) {
      const risks = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEYS.RISKS));
      return risks.filter(r => r.companyId === companyId);
    } else {
      const q = query(collection(db, "risks"), where("companyId", "==", companyId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => d.data());
    }
  },
  
  addRisk: async (companyId, riskData, userId, userName) => {
    if (isMock) {
      const risks = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEYS.RISKS));
      const newRisk = {
        riskId: "risk_" + Date.now(),
        companyId,
        ...riskData,
        createdAt: Date.now()
      };
      risks.push(newRisk);
      localStorage.setItem(MOCK_STORAGE_KEYS.RISKS, JSON.stringify(risks));
      
      // Log Activity
      const activities = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEYS.ACTIVITIES));
      activities.push({
        activityId: "act_" + Date.now(),
        userId,
        companyId,
        actionType: "Risk Updates",
        description: `${userName} added risk: '${riskData.potentialRisk}'.`,
        createdAt: Date.now()
      });
      localStorage.setItem(MOCK_STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));

      return newRisk;
    } else {
      const newRisk = {
        riskId: "risk_" + Date.now(),
        companyId,
        ...riskData,
        createdAt: Date.now()
      };
      await addDoc(collection(db, "risks"), newRisk);
      
      await addDoc(collection(db, "activities"), {
        activityId: "act_" + Date.now(),
        userId,
        companyId,
        actionType: "Risk Updates",
        description: `${userName} added risk: '${riskData.potentialRisk}'.`,
        createdAt: Date.now()
      });

      return newRisk;
    }
  },
  
  updateRisk: async (riskId, riskData, userId, userName) => {
    if (isMock) {
      const risks = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEYS.RISKS));
      const idx = risks.findIndex(r => r.riskId === riskId);
      if (idx > -1) {
        risks[idx] = { ...risks[idx], ...riskData };
        localStorage.setItem(MOCK_STORAGE_KEYS.RISKS, JSON.stringify(risks));
        
        // Log Activity
        const activities = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEYS.ACTIVITIES));
        activities.push({
          activityId: "act_" + Date.now(),
          userId,
          companyId: risks[idx].companyId,
          actionType: "Risk Updates",
          description: `${userName} updated risk status to '${riskData.status}' for: '${risks[idx].potentialRisk}'.`,
          createdAt: Date.now()
        });
        localStorage.setItem(MOCK_STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
        
        return risks[idx];
      }
      return null;
    } else {
      const q = query(collection(db, "risks"), where("riskId", "==", riskId));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      const docRef = snapshot.docs[0].ref;
      const originalRisk = snapshot.docs[0].data();
      
      await updateDoc(docRef, riskData);
      
      await addDoc(collection(db, "activities"), {
        activityId: "act_" + Date.now(),
        userId,
        companyId: originalRisk.companyId,
        actionType: "Risk Updates",
        description: `${userName} updated risk status to '${riskData.status}' for: '${originalRisk.potentialRisk}'.`,
        createdAt: Date.now()
      });
      
      return { ...originalRisk, ...riskData };
    }
  },

  deleteRisk: async (riskId) => {
    if (isMock) {
      const risks = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEYS.RISKS));
      const filtered = risks.filter(r => r.riskId !== riskId);
      localStorage.setItem(MOCK_STORAGE_KEYS.RISKS, JSON.stringify(filtered));
      return true;
    } else {
      const q = query(collection(db, "risks"), where("riskId", "==", riskId));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return false;
      await deleteDoc(snapshot.docs[0].ref);
      return true;
    }
  },

  // Documents
  getDocuments: async (companyId) => {
    if (isMock) {
      const docs = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEYS.DOCUMENTS));
      return docs.filter(d => d.companyId === companyId);
    } else {
      const q = query(collection(db, "documents"), where("companyId", "==", companyId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => d.data());
    }
  },
  
  uploadDocument: async (companyId, fileInfo, userId, userName) => {
    if (isMock) {
      // Simulate storage upload
      const documents = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEYS.DOCUMENTS));
      const newDoc = {
        documentId: "doc_" + Date.now(),
        companyId,
        userId,
        documentName: fileInfo.name,
        documentType: fileInfo.type,
        fileUrl: fileInfo.url || "virtual://file_uploaded_" + Date.now(),
        uploadedAt: Date.now()
      };
      documents.push(newDoc);
      localStorage.setItem(MOCK_STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
      
      // Log Activity
      const activities = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEYS.ACTIVITIES));
      activities.push({
        activityId: "act_" + Date.now(),
        userId,
        companyId,
        actionType: "Document Upload",
        description: `${userName} uploaded compliance document: '${fileInfo.name}'.`,
        createdAt: Date.now()
      });
      localStorage.setItem(MOCK_STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));

      return newDoc;
    } else {
      // In live mode, file uploading must handle Firebase Storage
      // For demonstration, we assume `fileInfo` contains a File object or blob.
      const storageRef = ref(storage, `documents/${companyId}/${fileInfo.type}/${fileInfo.fileObject.name}`);
      const uploadResult = await uploadBytes(storageRef, fileInfo.fileObject);
      const fileUrl = await getDownloadURL(uploadResult.ref);
      
      const newDoc = {
        documentId: "doc_" + Date.now(),
        companyId,
        userId,
        documentName: fileInfo.fileObject.name,
        documentType: fileInfo.type,
        fileUrl,
        uploadedAt: Date.now()
      };
      
      await addDoc(collection(db, "documents"), newDoc);
      
      await addDoc(collection(db, "activities"), {
        activityId: "act_" + Date.now(),
        userId,
        companyId,
        actionType: "Document Upload",
        description: `${userName} uploaded compliance document: '${fileInfo.fileObject.name}'.`,
        createdAt: Date.now()
      });

      return newDoc;
    }
  },

  deleteDocument: async (documentId, documentName, companyId, documentType) => {
    if (isMock) {
      const docs = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEYS.DOCUMENTS));
      const filtered = docs.filter(d => d.documentId !== documentId);
      localStorage.setItem(MOCK_STORAGE_KEYS.DOCUMENTS, JSON.stringify(filtered));
      return true;
    } else {
      const q = query(collection(db, "documents"), where("documentId", "==", documentId));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return false;
      await deleteDoc(snapshot.docs[0].ref);
      
      try {
        const fileStorageRef = ref(storage, `documents/${companyId}/${documentType}/${documentName}`);
        await deleteObject(fileStorageRef);
      } catch (err) {
        console.warn("Storage deletion warning (file might not exist in bucket):", err);
      }
      return true;
    }
  },
  
  // Resources & Updates (Publicly readable)
  getResources: async () => {
    if (isMock) {
      return JSON.parse(localStorage.getItem(MOCK_STORAGE_KEYS.RESOURCES)) || DEFAULT_RESOURCES;
    } else {
      try {
        const snapshot = await getDocs(collection(db, "resources"));
        let results = snapshot.docs.map(d => d.data());
        if (results.length === 0) {
          // Auto-seed Firestore with defaults
          console.log("📦 Resources collection empty – auto-seeding...");
          for (const res of DEFAULT_RESOURCES) {
            await addDoc(collection(db, "resources"), res);
          }
          return [...DEFAULT_RESOURCES];
        }
        return results;
      } catch (err) {
        console.warn("⚠️ Firestore resources fetch failed, returning defaults:", err.message);
        return [...DEFAULT_RESOURCES];
      }
    }
  },
  
  addResource: async (resourceData) => {
    const newRes = {
      resourceId: "res_" + Date.now(),
      ...resourceData,
      trustedSource: true
    };
    if (isMock) {
      const resources = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEYS.RESOURCES));
      resources.push(newRes);
      localStorage.setItem(MOCK_STORAGE_KEYS.RESOURCES, JSON.stringify(resources));
    } else {
      await addDoc(collection(db, "resources"), newRes);
    }
    return newRes;
  },

  deleteResource: async (resourceId) => {
    if (isMock) {
      const resources = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEYS.RESOURCES));
      const filtered = resources.filter(r => r.resourceId !== resourceId);
      localStorage.setItem(MOCK_STORAGE_KEYS.RESOURCES, JSON.stringify(filtered));
      return true;
    } else {
      const q = query(collection(db, "resources"), where("resourceId", "==", resourceId));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return false;
      await deleteDoc(snapshot.docs[0].ref);
      return true;
    }
  },
  
  getUpdates: async () => {
    if (isMock) {
      const updates = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEYS.UPDATES)) || DEFAULT_UPDATES;
      return updates.sort((a, b) => b.date - a.date);
    } else {
      try {
        const snapshot = await getDocs(collection(db, "updates"));
        let results = snapshot.docs.map(d => d.data());
        if (results.length === 0) {
          // Auto-seed Firestore with defaults
          console.log("📦 Updates collection empty – auto-seeding...");
          for (const up of DEFAULT_UPDATES) {
            await addDoc(collection(db, "updates"), up);
          }
          return [...DEFAULT_UPDATES].sort((a, b) => b.date - a.date);
        }
        return results.sort((a, b) => b.date - a.date);
      } catch (err) {
        console.warn("⚠️ Firestore updates fetch failed, returning defaults:", err.message);
        return [...DEFAULT_UPDATES].sort((a, b) => b.date - a.date);
      }
    }
  },
  
  addUpdate: async (updateData, adminId) => {
    const newUp = {
      updateId: "up_" + Date.now(),
      ...updateData,
      date: Date.now(),
      createdBy: adminId
    };
    if (isMock) {
      const updates = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEYS.UPDATES));
      updates.push(newUp);
      localStorage.setItem(MOCK_STORAGE_KEYS.UPDATES, JSON.stringify(updates));
    } else {
      await addDoc(collection(db, "updates"), newUp);
    }
    return newUp;
  },

  deleteUpdate: async (updateId) => {
    if (isMock) {
      const updates = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEYS.UPDATES));
      const filtered = updates.filter(u => u.updateId !== updateId);
      localStorage.setItem(MOCK_STORAGE_KEYS.UPDATES, JSON.stringify(filtered));
      return true;
    } else {
      const q = query(collection(db, "updates"), where("updateId", "==", updateId));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return false;
      await deleteDoc(snapshot.docs[0].ref);
      return true;
    }
  },
  
  // Feedback
  getFeedback: async () => {
    if (isMock) {
      return JSON.parse(localStorage.getItem(MOCK_STORAGE_KEYS.FEEDBACK));
    } else {
      const snapshot = await getDocs(collection(db, "feedback"));
      return snapshot.docs.map(d => d.data()).sort((a, b) => b.createdAt - a.createdAt);
    }
  },
  
  submitFeedback: async (feedbackData) => {
    const newFb = {
      feedbackId: "fb_" + Date.now(),
      ...feedbackData,
      createdAt: Date.now()
    };
    if (isMock) {
      const feedback = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEYS.FEEDBACK));
      feedback.push(newFb);
      localStorage.setItem(MOCK_STORAGE_KEYS.FEEDBACK, JSON.stringify(feedback));
    } else {
      await addDoc(collection(db, "feedback"), newFb);
    }
    return newFb;
  },
  
  // Activities (Audit Trail)
  getActivities: async (companyId) => {
    if (isMock) {
      const acts = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEYS.ACTIVITIES));
      if (!companyId) return acts.sort((a, b) => b.createdAt - a.createdAt);
      return acts.filter(a => a.companyId === companyId).sort((a, b) => b.createdAt - a.createdAt);
    } else {
      let q = collection(db, "activities");
      if (companyId) {
        q = query(q, where("companyId", "==", companyId));
      }
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => d.data()).sort((a, b) => b.createdAt - a.createdAt);
    }
  },
  
  logActivity: async (userId, companyId, actionType, description) => {
    const act = {
      activityId: "act_" + Date.now(),
      userId,
      companyId,
      actionType,
      description,
      createdAt: Date.now()
    };
    if (isMock) {
      const acts = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEYS.ACTIVITIES));
      acts.push(act);
      localStorage.setItem(MOCK_STORAGE_KEYS.ACTIVITIES, JSON.stringify(acts));
    } else {
      await addDoc(collection(db, "activities"), act);
    }
    return act;
  },
  
  // Notifications
  getNotifications: async (companyId) => {
    if (isMock) {
      const notifs = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEYS.NOTIFICATIONS));
      return notifs.filter(n => n.companyId === companyId).sort((a, b) => b.createdAt - a.createdAt);
    } else {
      const q = query(collection(db, "notifications"), where("companyId", "==", companyId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => d.data()).sort((a, b) => b.createdAt - a.createdAt);
    }
  },
  
  markNotificationRead: async (notificationId) => {
    if (isMock) {
      const notifs = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEYS.NOTIFICATIONS));
      const idx = notifs.findIndex(n => n.notificationId === notificationId);
      if (idx > -1) {
        notifs[idx].read = true;
        localStorage.setItem(MOCK_STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
        return notifs[idx];
      }
      return null;
    } else {
      const q = query(collection(db, "notifications"), where("notificationId", "==", notificationId));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      await updateDoc(snapshot.docs[0].ref, { read: true });
      return { read: true };
    }
  },
  
  // Admin Operations (Users & Companies)
  getAdminUsers: async () => {
    if (isMock) {
      return JSON.parse(localStorage.getItem(MOCK_STORAGE_KEYS.USERS));
    } else {
      const snapshot = await getDocs(collection(db, "users"));
      return snapshot.docs.map(d => d.data());
    }
  },

  getAdminCompanies: async () => {
    if (isMock) {
      return JSON.parse(localStorage.getItem(MOCK_STORAGE_KEYS.COMPANIES));
    } else {
      const snapshot = await getDocs(collection(db, "companies"));
      return snapshot.docs.map(d => d.data());
    }
  },
  
  setUserStatus: async (uid, status) => {
    if (isMock) {
      const users = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEYS.USERS));
      const idx = users.findIndex(u => u.uid === uid);
      if (idx > -1) {
        users[idx].status = status;
        localStorage.setItem(MOCK_STORAGE_KEYS.USERS, JSON.stringify(users));
        return users[idx];
      }
      return null;
    } else {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, { status });
      return { uid, status };
    }
  },

  // Admin creating Compliance Officer for Owner
  createComplianceOfficer: async (companyId, companyName, fullName, email, password) => {
    if (isMock) {
      const users = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEYS.USERS));
      const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (emailExists) throw new Error("Email already in use.");
      
      const newOfficer = {
        uid: "user_officer_" + Date.now(),
        fullName,
        email,
        role: "officer",
        companyId,
        companyName,
        status: "active",
        createdAt: Date.now()
      };
      
      users.push(newOfficer);
      localStorage.setItem(MOCK_STORAGE_KEYS.USERS, JSON.stringify(users));
      return newOfficer;
    } else {
      // Direct user creation requires either Express Admin SDK or a firebase cloud function.
      // We will make a post request to the Node/Express backend which handles this using Firebase Admin SDK!
      const response = await fetch("/api/admin/create-officer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ companyId, companyName, fullName, email, password })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create officer account via server.");
      }
      return await response.json();
    }
  },

  resetDemoData: () => {
    if (isMock) {
      localStorage.removeItem(MOCK_STORAGE_KEYS.USERS);
      localStorage.removeItem(MOCK_STORAGE_KEYS.COMPANIES);
      localStorage.removeItem(MOCK_STORAGE_KEYS.CHECKLISTS);
      localStorage.removeItem(MOCK_STORAGE_KEYS.RISKS);
      localStorage.removeItem(MOCK_STORAGE_KEYS.DOCUMENTS);
      localStorage.removeItem(MOCK_STORAGE_KEYS.RESOURCES);
      localStorage.removeItem(MOCK_STORAGE_KEYS.UPDATES);
      localStorage.removeItem(MOCK_STORAGE_KEYS.FEEDBACK);
      localStorage.removeItem(MOCK_STORAGE_KEYS.ACTIVITIES);
      localStorage.removeItem(MOCK_STORAGE_KEYS.NOTIFICATIONS);
      localStorage.removeItem(MOCK_STORAGE_KEYS.CURRENT_USER);
      initLocalStorage();
      return true;
    }
    return false;
  }
};
