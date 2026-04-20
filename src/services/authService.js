import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "./firebase";

const DEMO_USER_KEY = "study-pulse-demo-user";
const demoAuthListeners = new Set();

function readDemoUser() {
  const rawValue = localStorage.getItem(DEMO_USER_KEY);
  return rawValue ? JSON.parse(rawValue) : null;
}

function writeDemoUser(user) {
  localStorage.setItem(DEMO_USER_KEY, JSON.stringify(user));
  notifyDemoAuthListeners(user);
}

function notifyDemoAuthListeners(user) {
  demoAuthListeners.forEach((listener) => listener(user));
}

export function listenToAuthChanges(callback) {
  if (!isFirebaseConfigured) {
    callback(readDemoUser());
    demoAuthListeners.add(callback);

    return () => {
      demoAuthListeners.delete(callback);
    };
  }

  return onAuthStateChanged(auth, callback);
}

export async function signup({ name, email, password }) {
  if (!isFirebaseConfigured) {
    const demoUser = {
      uid: `demo-${email}`,
      email,
      displayName: name || email.split("@")[0]
    };
    writeDemoUser(demoUser);
    return demoUser;
  }

  const credential = await createUserWithEmailAndPassword(auth, email, password);

  // The display name makes the dashboard feel personal without storing extra profile data.
  if (name) {
    await updateProfile(credential.user, { displayName: name });
  }

  return credential.user;
}

export async function login({ email, password }) {
  if (!isFirebaseConfigured) {
    const demoUser = readDemoUser();

    if (!demoUser || demoUser.email !== email) {
      throw new Error("Demo mode is active. Sign up once with any email to create a local account.");
    }

    notifyDemoAuthListeners(demoUser);
    return demoUser;
  }

  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export function logout() {
  if (!isFirebaseConfigured) {
    localStorage.removeItem(DEMO_USER_KEY);
    notifyDemoAuthListeners(null);
    return Promise.resolve();
  }

  return signOut(auth);
}
