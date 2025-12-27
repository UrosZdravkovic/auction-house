import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

/**
 * Count all users in the system (Admin only)
 */
export const countAllUsers = async (): Promise<number> => {
  try {
    const snapshot = await getDocs(collection(db, 'users'));
    return snapshot.size;
  } catch (error) {
    console.error('Error counting users:', error);
    return 0;
  }
};