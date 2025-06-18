import { getFirestore, collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { app } from '../firebase';

const db = getFirestore(app);
const activitiesCol = collection(db, 'activities');

export async function createActivity(activity) {
  const docRef = await addDoc(activitiesCol, activity);
  return { ...activity, id: docRef.id };
}

export async function getActivities({ className, grade } = {}) {
  let q = activitiesCol;
  if (className && grade) {
    q = query(activitiesCol, where('className', '==', className), where('grade', '==', grade));
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getActivityById(id) {
  const docRef = doc(db, 'activities', id);
  const snapshot = await getDoc(docRef);
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

export async function updateActivity(id, data) {
  const docRef = doc(db, 'activities', id);
  await updateDoc(docRef, data);
}

export async function deleteActivity(id) {
  const docRef = doc(db, 'activities', id);
  await deleteDoc(docRef);
} 