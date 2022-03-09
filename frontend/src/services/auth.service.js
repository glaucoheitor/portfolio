import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { query, getDocs, collection, where, addDoc } from "firebase/firestore";
import { firebaseApp, firebaseDB, auth } from "./firebase.service";

const URL =
  process.env.NODE_ENV !== "production"
    ? process.env.REACT_APP_LOCAL_BACKEND
    : process.env.REACT_APP_BACKEND;

export const verifyUser = async (authData) => {
  try {
    const { data } = await fetch(URL + "/graphql", {
      method: "POST",
      body: JSON.stringify({ query: `query {verifyUser}` }),
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " + (await authData?.user?.auth?.currentUser?.getIdToken()),
      },
    }).then((res) => res.json());

    return data.verifyUser;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const login = async (email, password) => {
  const requestBody = {
    query: `
        query {
          login(email:"${email}",password:"${password}") {
            userId
            token
            tokenExpiration
          }
        }`,
  };

  try {
    const { data, errors } = await fetch(URL + "/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());

    if (!data) throw new Error(errors[0].message);
    return {
      error: false,
      ...data?.login,
    };
  } catch (error) {
    return { error };
  }
};

const logInWithGoogle = async () => {
  const googleProvider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    return { error };
  }
};

const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    return { error };
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await addDoc(collection(firebaseDB, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
  } catch (error) {
    return { error };
  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: false };
  } catch (error) {
    return { error };
  }
};

const getUserId = async ({ uid, providerData, auth }) => {
  try {
    if (!providerData || !providerData.length) throw Error("No providerData.");

    const userQuery = Object.entries(providerData[0])
      .map(([key, value]) => (key !== "uid" ? `${key}: "${value}"` : null))
      .filter((e) => e);

    const token = await auth?.currentUser?.getIdToken();

    const { data } = await fetch(URL + "/graphql", {
      method: "POST",
      body: JSON.stringify({
        query: `query {
          getUserId(user: { uid: "${uid}", ${userQuery.join(",")} })
        }`,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }).then((res) => res.json());

    return data.getUserId;
  } catch (e) {
    console.error(e);
    return false;
  }
};

const logout = () => {
  signOut(auth);
};

export {
  auth,
  logInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  getUserId,
};
