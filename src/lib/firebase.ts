import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXT3H0JL5uhZCVjPD9slVkk7I3XpVtoMA",
  authDomain: "leettracker-12844.firebaseapp.com",
  projectId: "leettracker-12844",
  storageBucket: "leettracker-12844.firebasestorage.app",
  messagingSenderId: "926518178030",
  appId: "1:926518178030:web:96e8440640349b7f9583ff",
  measurementId: "G-9QMY0HSRXN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics (only in browser environment)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Authentication functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// User data management
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  customUsername?: string;
  photoURL?: string;
  createdAt: Date;
  lastLoginAt: Date;
}

export const createUserProfile = async (
  user: User,
  customUsername?: string
) => {
  const userRef = doc(db, "users", user.uid);

  const userProfile: UserProfile = {
    uid: user.uid,
    email: user.email || "",
    displayName: user.displayName || "",
    customUsername: customUsername || user.displayName || "",
    photoURL: user.photoURL || "",
    createdAt: new Date(),
    lastLoginAt: new Date(),
  };

  await setDoc(userRef, userProfile);
  return userProfile;
};

export const getUserProfile = async (
  uid: string
): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
};

export const updateUserProfile = async (
  uid: string,
  updates: Partial<UserProfile>
) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    ...updates,
    lastLoginAt: new Date(),
  });
};

// User progress tracking
export interface UserProgress {
  uid: string;
  problemId: number;
  problemTitle: string;
  solved: boolean;
  bookmarked: boolean;
  solvedAt?: Date;
  bookmarkedAt?: Date;
}

export const markProblemSolved = async (
  uid: string,
  problemId: number,
  problemTitle: string,
  solved: boolean
) => {
  try {
    const progressRef = doc(db, "userProgress", `${uid}_${problemId}`);

    if (solved) {
      await setDoc(progressRef, {
        uid,
        problemId,
        problemTitle,
        solved: true,
        bookmarked: false,
        solvedAt: new Date(),
      });
    } else {
      // Remove the solved status
      await setDoc(progressRef, {
        uid,
        problemId,
        problemTitle,
        solved: false,
        bookmarked: false,
      });
    }
  } catch (error) {
    console.error("Error marking problem solved:", error);
    console.error("Error details:", {
      uid,
      problemId,
      problemTitle,
      solved,
      error: error instanceof Error ? error.message : String(error),
    });
    throw new Error(
      `Failed to update problem status: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

export const toggleProblemBookmark = async (
  uid: string,
  problemId: number,
  problemTitle: string,
  bookmarked: boolean
) => {
  try {
    const progressRef = doc(db, "userProgress", `${uid}_${problemId}`);

    if (bookmarked) {
      await setDoc(progressRef, {
        uid,
        problemId,
        problemTitle,
        solved: false,
        bookmarked: true,
        bookmarkedAt: new Date(),
      });
    } else {
      // Remove the bookmark
      await setDoc(progressRef, {
        uid,
        problemId,
        problemTitle,
        solved: false,
        bookmarked: false,
      });
    }
  } catch (error) {
    console.error("Error toggling problem bookmark:", error);
    console.error("Error details:", {
      uid,
      problemId,
      problemTitle,
      bookmarked,
      error: error instanceof Error ? error.message : String(error),
    });
    throw new Error(
      `Failed to update bookmark status: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

export const getUserProblemProgress = async (
  uid: string,
  problemId: number
): Promise<UserProgress | null> => {
  try {
    const progressRef = doc(db, "userProgress", `${uid}_${problemId}`);
    const progressSnap = await getDoc(progressRef);

    if (progressSnap.exists()) {
      return progressSnap.data() as UserProgress;
    }
    return null;
  } catch (error) {
    console.error("Error getting user problem progress:", error);
    return null;
  }
};

export const getAllUserProgress = async (
  uid: string
): Promise<UserProgress[]> => {
  try {
    const progressQuery = query(
      collection(db, "userProgress"),
      where("uid", "==", uid)
    );
    const querySnapshot = await getDocs(progressQuery);

    return querySnapshot.docs.map((doc) => doc.data() as UserProgress);
  } catch (error) {
    console.error("Error getting all user progress:", error);
    return [];
  }
};

export interface UserNote {
  uid: string;
  noteId: string;
  problemId: number;
  problemTitle: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Notes functions
export const createUserNote = async (
  uid: string,
  problemId: number,
  problemTitle: string,
  content: string,
  tags: string[]
): Promise<void> => {
  try {
    const noteId = `${uid}_${problemId}`;
    const noteData: UserNote = {
      uid,
      noteId,
      problemId,
      problemTitle,
      content,
      tags,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, "userNotes", noteId), noteData);
  } catch (error) {
    console.error("Error creating note:", error);
    throw new Error(
      `Failed to create note: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

export const updateUserNote = async (
  uid: string,
  problemId: number,
  content: string,
  tags: string[]
): Promise<void> => {
  try {
    const noteId = `${uid}_${problemId}`;
    const noteRef = doc(db, "userNotes", noteId);

    await updateDoc(noteRef, {
      content,
      tags,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating note:", error);
    throw new Error(
      `Failed to update note: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

export const deleteUserNote = async (
  uid: string,
  problemId: number
): Promise<void> => {
  try {
    const noteId = `${uid}_${problemId}`;
    await deleteDoc(doc(db, "userNotes", noteId));
  } catch (error) {
    console.error("Error deleting note:", error);
    throw new Error(
      `Failed to delete note: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

export const getUserNote = async (
  uid: string,
  problemId: number
): Promise<UserNote | null> => {
  try {
    const noteId = `${uid}_${problemId}`;
    const noteDoc = await getDoc(doc(db, "userNotes", noteId));

    if (noteDoc.exists()) {
      return noteDoc.data() as UserNote;
    }
    return null;
  } catch (error) {
    console.error("Error getting note:", error);
    throw new Error(
      `Failed to get note: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

export const getAllUserNotes = async (uid: string): Promise<UserNote[]> => {
  try {
    const notesQuery = query(
      collection(db, "userNotes"),
      where("uid", "==", uid)
    );

    const querySnapshot = await getDocs(notesQuery);
    const notes: UserNote[] = [];

    querySnapshot.forEach((doc) => {
      notes.push(doc.data() as UserNote);
    });

    return notes.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  } catch (error) {
    console.error("Error getting all notes:", error);
    throw new Error(
      `Failed to get notes: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

// Auth state listener
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export default app;
