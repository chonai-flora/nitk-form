import firebaseApp from '.';
import { FormStatus } from '../types';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import {
  doc, collection, getDocs, setDoc, updateDoc, Timestamp, getFirestore, DocumentData
} from 'firebase/firestore';

// Initialize firestore
const db = getFirestore(firebaseApp);

// Pass your reCAPTCHA v3 site key (public key) to activate(). Make sure this
// key is the counterpart to the secret key you set in the Firebase console.
const appCheck = initializeAppCheck(firebaseApp, {
  provider: new ReCaptchaV3Provider(''),

  // Optional argument. If true, the SDK automatically refreshes App Check
  // tokens as needed.
  isTokenAutoRefreshEnabled: true
});

// Get capacities of the course
const getCapacities = async (title: string): Promise<DocumentData | null> => {
  const ref = collection(db, 'door-capacities');
  const snapshot = await getDocs(ref);
  const doc = snapshot.docs.find((doc) => doc.id === title);
  return snapshot.empty
    ? null
    : doc?.data()!;
};

// Submit applicant's information
const submit = async (title: string, schedule: string, grade: string, name: string, email: string, memo: string): Promise<FormStatus> => {
  const status = await updateCapacities(title, schedule);
  if (status === 'failed') {
    return status;
  }
  try {
    const date = new Date();
    const ref = collection(db, 'door-applicants');
    const snapshot = await getDocs(ref);
    const data = snapshot.docs.find((doc) => doc.id === title)?.data();
    const users = data![schedule];
    users.push(
      {
        name: name,
        grade: grade,
        email: email,
        memo: memo,
        submitted_at: Timestamp.fromDate(date)
      }
    );

    switch (schedule) {
      case '10:30':
        await updateDoc(doc(ref, title), { '10:30': users });
        break;
      case '11:00':
        await updateDoc(doc(ref, title), { '11:00': users });
        break;
      case '11:30':
        await updateDoc(doc(ref, title), { '11:30': users });
        break;
      case '12:00':
        await updateDoc(doc(ref, title), { '12:00': users });
        break;
      case '12:30':
        await updateDoc(doc(ref, title), { '12:30': users });
        break;
      case '13:00':
        await updateDoc(doc(ref, title), { '13:00': users });
        break;
      case '13:30':
        await updateDoc(doc(ref, title), { '13:30': users });
        break;
      case '14:00':
        await updateDoc(doc(ref, title), { '14:00': users });
        break;
      case '14:30':
        await updateDoc(doc(ref, title), { '14:30': users });
        break;
      case '15:00':
        await updateDoc(doc(ref, title), { '15:00': users });
        break;
      case '15:30':
        await updateDoc(doc(ref, title), { '15:30': users });
        break;
      case '16:00':
        await updateDoc(doc(ref, title), { '16:00': users });
        break;
      default:
        break;
    }
    
    console.log("Successfully submitted.");
    return status;
  } catch (err) {
    console.log("Failed to submit.");
    console.log(err);
    return 'failed';
  }
};

// Reduce the capacity by one
const updateCapacities = async (title: string, schedule: string): Promise<FormStatus> => {
  const capacities = await getCapacities(title);
  if (capacities![schedule] <= 0) {
    return 'failed';
  }
  
  capacities![schedule] = capacities![schedule] - 1;
  try {
    const ref = doc(collection(db, 'door-capacities'), title);
    await setDoc(ref, { ...(capacities!) });

    return 'succeeded';
  } catch (err) {
    console.log(err);
    return 'failed';
  }
};

export { getCapacities, submit };