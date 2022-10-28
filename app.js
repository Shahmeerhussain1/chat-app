import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDTgpzAlC6sszJY9uSrWOqzewgp86K6GLg",
  authDomain: "data-64504.firebaseapp.com",
  projectId: "data-64504",
  storageBucket: "data-64504.appspot.com",
  messagingSenderId: "870525670816",
  appId: "1:870525670816:web:9eba97f0cd3c6601d380c5",
};
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-storage.js";

import {
  doc,
  setDoc,
  getFirestore,
  getDoc,
  query,
  collection,
  where,
  getDocs,
  onSnapshot,
  addDoc,
  orderBy,
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let up_Email = document.getElementById("Email");
let up_Password = document.getElementById("Password");
let sign_up_btn = document.getElementById("sign_up_btn");
let National = document.getElementById("National");
let Number = document.getElementById("Number");
let age = document.getElementById("age");
let Name = document.getElementById("Name");

const auth = getAuth();
if (sign_up_btn) {
  sign_up_btn.addEventListener("click", () => {
    let z =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        up_Email.value
      );
    let f = /^[a-zA-Z ]+$/.test(Name.value);
    let num =
      /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/.test(
        Number.value
      );
    var ge = /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(age.value);
    let country = /^[a-zA-Z ]+$/.test(National.value);
    let pas = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(
      up_Password.value
    );

    if (f == true) {
      if (num == true) {
        if (ge == true) {
          if (country == true) {
            if (z == true) {
              if (pas == true) {
                createUserWithEmailAndPassword(
                  auth,
                  up_Email.value,
                  up_Password.value
                )
                  .then(async (userCredential) => {
                    let uid = userCredential.user.uid;
                    if (userCredential) {
                      console.log(uid);
                      console.log(userCredential);
                      const loader =
                        document.getElementsByClassName("loader")[0];
                      loader.classList.toggle("hidden");
                    }

                    const auth = getAuth();
                    let firDoc = doc(db, "users", userCredential.user.uid);
                    await setDoc(firDoc, {
                      name: Name.value,
                      email: up_Email.value,
                      password: up_Password.value,
                      number: Number.value,
                      nationality: National.value,
                      age: age.value,
                    });
                    if (uid) {
                      console.log(userCredential.user);
                      window.location = "/login/page.html";
                    }
                  })

                  .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorCode);
                    if (errorCode) {
                      swal(errorCode);
                    }
                  });
                sendEmailVerification(auth.currentUser);
                console
                  .log(currentUser)
                  .then(() => {
                    console.log("email sent", userCredential.user.email);
                  })
                  .catch(() => {
                    console.log("email not sent");
                  });
              } else {
                up_Password.style.borderBottomColor = "red";
                let sub4 = document.getElementById("opir");
                sub4.style.display = "block";
                sub4.style.transition = "all 2s";
              }
            } else {
              up_Email.style.borderBottomColor = "red";
              up_Email.style.transition = "all 2s";
            }
          } else {
            National.style.borderBottomColor = "red";
          }
        } else {
          age.style.borderBottomColor = "red";
        }
      } else {
        Number.style.borderBottomColor = "red";
      }
    } else {
      Name.style.borderBottomColor = "red";
    }
  });
}

let sign_in_btn = document.getElementById("sign_in_btn");
if (sign_in_btn) {
  sign_in_btn.addEventListener("click", () => {
    let sinn_in_Email = document.getElementById("sinn_in_Email");
    let sinn_in_Password = document.getElementById("sinn_in_Password");

    const auth = getAuth();

    signInWithEmailAndPassword(
      auth,
      sinn_in_Email.value,
      sinn_in_Password.value
    )
      .then(async (userCredential) => {
        const user = userCredential.user;
        console.log(user.auth.currentUser, "You are logged inn");
        if (user) {
          window.location = "/login/page.html";
        }
        if (userCredential) {
          const loader = document.getElementsByClassName("loader")[0];
          loader.classList.toggle("hidden");
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);

        swal(errorMessage.replace("Firebase: Error (auth/", ""));
      });
  });
}

//chking user
window.onload = async () => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      getUserFromDataBase(user.uid);
    } else {
      console.log("not login");
    }
  });
};

const getUserFromDataBase = async (uid) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    let dta = docSnap.data();

    let o = document.getElementById("o");
    o.innerHTML += `
  <table>
  <tr>
  <th class="pup">Name: </th><td class="pup">${dta.name}<td>
  </tr>
  <tr>
  <th class="pup">Email: </th><td class="pup">${dta.email}<td>
  </tr>
  <tr>
  <th class="pup">Nationality: </th><td class="pup">  ${dta.nationality}<td>
  </tr>
  <tr>
  <th class="pup">Age: </th><td class="pup">${dta.age}<td>
  </tr>
  <tr>
  <th class="pup">Phone: </th><td class="pup">${dta.number}<td>
  </tr>
  </table>
  `;
    getAllUsers(docSnap.data().email, uid, docSnap.data().name);
  } else {
    console.log("documentnot found");
  }
};

const getAllUsers = async (mail, currentuid, name) => {
  // console.log(mail);
  const q = query(collection(db, "users"),
   where("email", "!=", mail));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    var loot_data = doc.data();
    // console.log(loot_data.name);
    let oi = document.getElementById("oi");
    oi.innerHTML += `
        <table class="w_full"><tr onclick='showData("${doc.id}","${loot_data.name}","${currentuid}","${name}")' class="table_row"><td class="pupi">${loot_data.name} </td>
        </table
        `;
  });
};

let unsubscribe ;

let showData = (ids, nnames, currentids, currentnames) => {

  if (unsubscribe) {
    unsubscribe();
    // console.log(unsubscribe())
  }

  let heading_enter = document.getElementById("head_name");
  heading_enter.innerHTML = nnames;
  let show = document.getElementById("msgs")
  let chatid;
  if(currentids < ids){
    chatid = `${currentids}${ids}`
  }else{
    chatid = `${ids}${currentids}`

  }
  let send_btns = document.getElementById("send_btns")


  loadchat(chatid ,currentids)
  send_btns.addEventListener("click",async ()=>{
  let show = document.getElementById("msgs")
  console.log(show);
  let allMessages = document.getElementById("almessages");
  if(show.value != ""){
      allMessages.innerHTML = ""
    await addDoc(collection(db, "messages"), {
      receiver_name: nnames,
      sender_name: currentnames,
      receiver_id: ids,
      sender_id: currentids,
      message: show.value,
      chat_id: chatid,
      timestamp: new Date(),
    })} 
    // hatao()
    show.value = ""
    show.innerHTML = ""

})

};
const loadchat =  (chatid , currentids)=>{
  try {
    const q = query(
      collection(db, "messages"),
      where("chat_id", "==", chatid),
      orderBy("timestamp", "asc")
    );
    let allMessages = document.getElementById("almessages");
    unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let className =
          doc.data().sender_id == currentids ? "my-message" : "user-message";
          allMessages.innerHTML += 
        `<li class="${className}"><span class="bcolr"> ${doc.data().message}</span></li>`;
      }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

const hatao =()=>{
  let show = document.getElementById("msgs")
  show.value = ""

}


const remove = ()=>{
  // let shows = document.getElementById("msgs")
  // shows.innerText = ""
  let file_upload = document.getElementById("file_upload")

  if(file_upload.files){
    console.log(file_upload.files)
    let shows = document.getElementById("shows");
  
    // shows.style.backgroundColor = "white"
    shows.innerHTML = `
    <img src="${file_upload.files}" alt="">
     `
  }
  else{
    console.log("not done")
  }} 



window.showData = showData




  // const q = query(collection(db, "messages"), where("chat_id", "==", chatid));
  // let almessages = document.getElementById("almessages")

// const querySnapshot = await getDocs(q);
// querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  // almessages.innerHTML += `<li>${doc.data().message}</li>`
  // console.log(doc.id, " => ", );
    
  
    // heading_enter.innerHTML = "jkvtvyum";
//chking user
// window.onload = () => {
//   onAuthStateChanged(auth, async (user) => {
//    if(user){
//     console.log(user.uid);
//     const docRef = doc(db, "users", user.uid);
//     const docSnap = await getDoc(docRef)
//     if (docSnap.exists()) {
//       let dta = docSnap.data();
//       console.log(dta)
//       let o = document.getElementById("o");

//       o.innerHTML += `
//   <table>
//   <tr>
//   <th class="pup">Name: </th><td class="pup">${dta.name}<td>
//   </tr>
//   <tr>
//   <th class="pup">Email: </th><td class="pup">${dta.email}<td>
//   </tr>
//   <tr>
//   <th class="pup">Nationality: </th><td class="pup">  ${dta.nationality}<td>
//   </tr>
//   <tr>
//   <th class="pup">Age: </th><td class="pup">${dta.age}<td>
//   </tr>
//   <tr>
//   <th class="pup">Phone: </th><td class="pup">${dta.number}<td>
//   </tr>
//   </table>
//   `;
//   getAllUsers(dta.email, user.uid, dta.name);

//   const getAllUsers = async (email, currentId, currentName) => {
//      const querySnapshot = await getDocs(q)
//      querySnapshot.forEach((doc) => {
//        let dy = doc.data();
//        if (dy) {
//           let oi = document.getElementById("oi");
//           oi.innerHTML += `
//       <table>
//       <tr ><td class="pupi">${dy.name} <button onclick="showData("${
//         doc.id
//       }","${
//         doc.data().name
//       }","${currentId}","${currentName}")" id="ano" class=" btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">Chat</button></td> </tr>
//       </table
//       `;
//    let heading_enter = document.getElementById("heading_enter");
//           heading_enter.innerHTML += `${dy.name}`;
//         }
//       }) ;  }

//       let showData = (id, name, currentId, currentName)=>{
//         let ano = document.getElementById("ano")
//         let heading_enter = document.getElementById("heading_enter")
//         heading_enter.innerHTML = name
//       }

//     }

//     if (!user) {
//       const uid = user.Name;
//       const uid2 = user.email;
//       console.log(user);
//       console.log(uid2);
//       window.location = "/index.html";
//     }};
//   });
// };

//signout
var logout_ = document.getElementById("logout_");
if (logout_) {
  logout_.addEventListener("click", () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        window.location = "/index.html";
        console.log("Successfull");
      })
      .catch((error) => {
      });
  });
}

// window.onload = async ()=>{
// console.log(auth)
// const docRef = doc(db, 'user', );
// const docSnap = await getDoc(docRef);

// if (docSnap.exists()) {
//   console.log("Document data:", docSnap.data());
// } else {
// doc.data() will be undefined in this case
//   console.log("No such document!");
// }

// }

// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
//   // Your web app's Firebase configuration
//   const firebaseConfig = {
//     apiKey: "AIzaSyDF0aUfBCSwy9IDXHxqQWpI8tzwIAuoj5Y",
//     authDomain: "learning-6aaa4.firebaseapp.com",
//     projectId: "learning-6aaa4",
//     storageBucket: "learning-6aaa4.appspot.com",
//     messagingSenderId: "202086806761",
//     appId: "1:202086806761:web:0544a889578ba4f8922c78"
//   };

//   // Initialize Firebase
//   const app = initializeApp(firebaseConfig);
