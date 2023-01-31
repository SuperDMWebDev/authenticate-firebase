// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
} from 'firebase/auth';
import {
  getFirestore,
  query,
  collection,
  getDocs,
  addDoc,
  where,
  setDoc,
  updateDoc,
  doc,
  Firestore,
} from 'firebase/firestore';
const firebaseConfig = {
  apiKey: 'AIzaSyBj3oUPrIq0RrHELp32QTSFrW5kEJ9ZVKk',
  authDomain: 'app-store-91b90.firebaseapp.com',
  projectId: 'app-store-91b90',
  storageBucket: 'app-store-91b90.appspot.com',
  messagingSenderId: '112925054383',
  appId: '1:112925054383:web:6908d9ee7c223bfdd54b5a',
  measurementId: 'G-XMVCE3CCKD',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/contacts.readonly');
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, 'users'), where('uid', '==', user.uid));
    const docs = await getDocs(q);
    if (user) {
      const result = await user.getIdToken();
      console.log('set session token ', result);
      sessionStorage.setItem('accessToken', result);
    }
    if (docs.docs.length > 0) {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        emailVerified: user.emailVerified,
        authProvider: 'google',
      });
    }
  } catch (err) {
    console.error('err', err);
  }
};
const changeProfile = async (user, name) => {
  try {
    console.log('changeProfile ', user, name);
    const q = query(collection(db, 'users'), where('uid', '==', user.uid));
    await updateProfile(user, { displayName: name });
  } catch (err) {
    console.error('err ', err);
  }
};

const logInWithEmailAndPassword = async (email, password) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const user = res.user;
    const q = query(collection(db, 'users'), where('uid', '==', user.uid));
    const docs = await getDocs(q);
    if (user) {
      user.getIdToken().then((result) => {
        sessionStorage.setItem('accessToken', result);
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await updateProfile(user, { displayName: name });
    await setDoc(doc(db, `users`, user.uid), {
      name: name,
      email: user.email,
      emailVerified: user.emailVerified,
      authProvider: 'local',
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert('Check your email to check password!');
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  signOut(auth);
};

export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  changeProfile,
};
