/*
  seedData.js
  -----------------
  Run this script to populate your Firebase Firestore with initial demo data.
  Usage (from repository root):
    node server/src/seedData.js

  Make sure your environment variable `FIREBASE_SERVICE_ACCOUNT_KEY` is set with the
  JSON string of your service account credentials (as used in index.js).
*/

const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  console.error('⚠️  FIREBASE_SERVICE_ACCOUNT_KEY not set. Exiting.');
  process.exit(1);
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
} catch (err) {
  console.error('⚠️  Unable to parse FIREBASE_SERVICE_ACCOUNT_KEY:', err.message);
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Helper to create a timestamp field
const now = admin.firestore.FieldValue.serverTimestamp;

async function createCompany() {
  const companyRef = db.collection('companies').doc();
  const companyData = {
    companyId: companyRef.id,
    companyName: 'SolarForce UK Ltd',
    ownerId: null, // to be filled after creating owner user
    industry: 'Solar Installation',
    address: '123 Solar Road, London, UK',
    phone: '+44 20 7946 0958',
    createdAt: now()
  };
  await companyRef.set(companyData);
  return companyData;
}

async function createUser(fullName, email, password, role, companyId, companyName) {
  // Create Auth user
  const userRecord = await admin.auth().createUser({
    email,
    password,
    displayName: fullName
  });

  const userData = {
    uid: userRecord.uid,
    fullName,
    email,
    role,
    companyId: companyId || null,
    companyName: companyName || null,
    status: 'active',
    createdAt: now()
  };

  await db.collection('users').doc(userRecord.uid).set(userData);
  return userData;
}

async function seedChecklists(companyId, userId) {
  const checklistRef = db.collection('checklists');
  const phases = ['Design', 'Installation', 'Commissioning'];
  const tasks = [
    'Obtain planning permission',
    'Perform site survey',
    'Install mounting structure',
    'Electrical connection',
    'System testing'
  ];
  const batch = db.batch();
  tasks.forEach((task, idx) => {
    const doc = checklistRef.doc();
    batch.set(doc, {
      checklistId: doc.id,
      companyId,
      userId,
      phase: phases[idx % phases.length],
      taskName: task,
      actionRequired: task,
      completed: false,
      updatedAt: now()
    });
  });
  await batch.commit();
}

async function seedRisks(companyId, userId) {
  const risksRef = db.collection('risks');
  const sampleRisks = [
    { complianceArea: 'Electrical', potentialRisk: 'Improper wiring', riskLevel: 'High' },
    { complianceArea: 'Structural', potentialRisk: 'Insufficient foundation', riskLevel: 'Medium' },
    { complianceArea: 'Safety', potentialRisk: 'Missing signage', riskLevel: 'Low' }
  ];
  const batch = db.batch();
  sampleRisks.forEach(risk => {
    const doc = risksRef.doc();
    batch.set(doc, {
      riskId: doc.id,
      companyId,
      ...risk,
      mitigationAction: '',
      status: 'open',
      createdAt: now()
    });
  });
  await batch.commit();
}

async function seedResources() {
  const resourcesRef = db.collection('resources');
    const sample = [
      // Official guidance and standards
      { name: 'MCS Guidance', purpose: 'Installation standards for microgeneration', url: 'https://www.microgenerationcertification.org/mcs', category: 'Guideline', trustedSource: true },
      { name: 'HSE Working at Height', purpose: 'Safety regulations for rooftop work', url: 'https://www.hse.gov.uk/work-at-height/', category: 'Regulation', trustedSource: true },
      { name: 'IET BS 7671', purpose: 'Electrical installation standards (Amendment 3)', url: 'https://www.theiet.org/standards/bs-7671/', category: 'Standard', trustedSource: true },
      { name: 'Ofgem Smart Export Guarantee', purpose: 'Export tariff guidance for solar PV', url: 'https://www.ofgem.gov.uk/environmental-programmes/smart-export-guarantee', category: 'Policy', trustedSource: true },
      { name: 'Planning Portal – Solar PV Permitted Development', purpose: 'Planning permission guidance', url: 'https://www.planningportal.co.uk/info/200130/common_projects/51/solar_panels', category: 'Planning', trustedSource: true },
      { name: 'MCS Scheme Updates 2025', purpose: 'Latest MCS accreditation changes', url: 'https://www.microgenerationcertification.org/mcs-updates-2025', category: 'Update', trustedSource: true }
    ];
  const batch = db.batch();
  sample.forEach(res => {
    const doc = resourcesRef.doc();
    batch.set(doc, { resourceId: doc.id, ...res });
  });
  await batch.commit();
}

async function seedUpdates() {
  const updatesRef = db.collection('updates');
    const sample = [
      // Recent regulatory alerts and funding announcements
      { title: 'MCS Scheme Amendment 2025', category: 'Regulation', description: 'New requirements for installer certification effective Jan 2025.', source: 'MCS', date: admin.firestore.Timestamp.now(), createdBy: 'admin' },
      { title: 'Ofgem Smart Export Guarantee Update', category: 'Policy', description: 'Changes to export tariffs and eligibility criteria.', source: 'Ofgem', date: admin.firestore.Timestamp.now(), createdBy: 'admin' },
      { title: 'HSE Scaffold Safety Alert', category: 'Safety', description: 'Mandatory scaffold edge protection for rooftop PV installations.', source: 'HSE', date: admin.firestore.Timestamp.now(), createdBy: 'admin' },
      { title: 'Funding: UK Green Homes Grant', category: 'Funding', description: 'New grant scheme supporting residential solar PV installations.', source: 'Gov', date: admin.firestore.Timestamp.now(), createdBy: 'admin' }
    ];
  const batch = db.batch();
  sample.forEach(up => {
    const doc = updatesRef.doc();
    batch.set(doc, { updateId: doc.id, ...up, createdAt: now() });
  });
  await batch.commit();
}

async function seedFeedback() {
  const fbRef = db.collection('feedback');
  const sample = [
    { name: 'John Doe', email: 'john@example.com', company: 'SolarForce UK Ltd', type: 'General', message: 'Great platform!', createdAt: now() }
  ];
  const batch = db.batch();
  sample.forEach(fb => {
    const doc = fbRef.doc();
    batch.set(doc, { feedbackId: doc.id, ...fb });
  });
  await batch.commit();
}

async function seedActivities(companyId, userId) {
  const actRef = db.collection('activities');
  const sample = [
    { actionType: 'Login', description: 'User logged in', createdAt: now() },
    { actionType: 'Checklist Update', description: 'Created initial checklist', createdAt: now() }
  ];
  const batch = db.batch();
  sample.forEach(act => {
    const doc = actRef.doc();
    batch.set(doc, { activityId: doc.id, companyId, userId, ...act, createdAt: now() });
  });
  await batch.commit();
}

async function seedNotifications(companyId) {
  const notifRef = db.collection('notifications');
  const sample = [
    { title: 'Upcoming Inspection', message: 'Your compliance inspection is due next month.', type: 'Reminder', read: false },
    { title: 'Regulatory Update', message: 'New grid connection guidelines released.', type: 'Alert', read: false }
  ];
  const batch = db.batch();
  sample.forEach(notif => {
    const doc = notifRef.doc();
    batch.set(doc, { notificationId: doc.id, companyId, ...notif, createdAt: now() });
  });
  await batch.commit();
}

(async () => {
  try {
    console.log('🔧 Starting seed process...');

    // 1️⃣ Create demo company
    const company = await createCompany();
    console.log('🏢 Company created:', company.companyName);

    // 2️⃣ Create admin user (system admin, not tied to a company)
    const adminUser = await createUser('System Admin', 'admin@gmail.com', 'password123456', 'admin');
    console.log('👑 Admin user created:', adminUser.email);

    // 3️⃣ Create SME Owner (owner of the demo company)
    const ownerUser = await createUser('Alice Owner', 'alice.owner@solarforce.co.uk', 'OwnerPass123!', 'owner', company.companyId, company.companyName);
    console.log('👩‍💼 Owner created:', ownerUser.email);
    // Update company with ownerId
    await db.collection('companies').doc(company.companyId).update({ ownerId: ownerUser.uid });

    // 4️⃣ Create a Compliance Officer for the same company
    const officerUser = await createUser('Bob Officer', 'bob.officer@solarforce.co.uk', 'OfficerPass123!', 'officer', company.companyId, company.companyName);
    console.log('🕵️ Officer created:', officerUser.email);

    // 5️⃣ Seed relational data
    await Promise.all([
      seedChecklists(company.companyId, ownerUser.uid),
      seedRisks(company.companyId, ownerUser.uid),
      seedResources(),
      seedUpdates(),
      seedFeedback(),
      seedActivities(company.companyId, ownerUser.uid),
      seedNotifications(company.companyId)
    ]);

    console.log('✅ Seeding complete!');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
})();
