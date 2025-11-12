import { createContext, useEffect, useState, type ReactNode } from "react";
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  type User 
} from "firebase/auth";
import { db } from "../firebase/firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

// Tipovi
type UserProfile = {
  name: string;
  email: string;
  createdAt: any;
}

type AuthContextType = {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

// Provider komponenta
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = getAuth();
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Praćenje auth stanja
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      // Učitaj korisnikov profil iz Firestore
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data() as UserProfile);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  // Login funkcija
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged će automatski ažurirati state
  };

  // Signup funkcija + upis korisnika u Firestore
  const signup = async (email: string, password: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Upis u Firestore users kolekciju
    await setDoc(doc(db, "users", firebaseUser.uid), {
      name,
      email,
      createdAt: serverTimestamp(),
    });
    // onAuthStateChanged će automatski ažurirati state
  };

  // Logout funkcija
  const logout = async () => {
    await signOut(auth);
    // onAuthStateChanged će automatski ažurirati state
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
