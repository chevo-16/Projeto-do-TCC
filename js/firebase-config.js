import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBegLynE1KAaymLQANO7xwJ5vrBZma-iBs",
  authDomain: "tcc-buenao.firebaseapp.com",
  projectId: "tcc-buenao",
  storageBucket: "tcc-buenao.firebasestorage.app",
  messagingSenderId: "194277889709",
  appId: "1:194277889709:web:09318c198ea06e76325824",
  measurementId: "G-VCJ2CGC8MP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export async function fazerLoginGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const userRef = doc(db, "usuarios", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        nome: user.displayName,
        email: user.email,
        carrinho: [],
        curtidas: [],
        compras: []
      });
    }

    window.location.href = "index02.html";
  } catch (error) {
    console.error("Erro no login do Google:", error);
    alert("Erro ao conectar com o Google.");
  }
}