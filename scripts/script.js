let firebaseConfig = {
  apiKey: "AIzaSyCYYSBqHQDUxztzwlNFtZ3isBb4zkXQqu4",
  authDomain: "thiagoferronatto-github-io.firebaseapp.com",
  databaseURL: "https://thiagoferronatto-github-io.firebaseio.com",
  projectId: "thiagoferronatto-github-io",
  storageBucket: "thiagoferronatto-github-io.appspot.com",
  messagingSenderId: "999725544141",
  appId: "1:999725544141:web:48f37f699609cc132b6f84",
  measurementId: "G-N2KXPSPRY2"
};
firebase.initializeApp(firebaseConfig);

let db = firebase.firestore();

db.collection("nomes").onSnapshot(() => {
  nomes = "";
  db.collection("nomes").get().then(querySnapshot => {
    querySnapshot.forEach(doc => {
      nomes += "<em>" + doc.get("nome") + "</em><br/>";
    });
  }).then(() => {
    document.getElementById("lista").innerHTML = nomes;
  }).catch(erro => {
    alert("O serviço não está disponível nesse momento. Volte mais tarde. Ou não, você que sabe.");
    window.close();
  });
});

function nomeSubmetido() {
  let n = document.getElementById("nome").value;

  if (n.length > 0) {
    db.collection("nomes").add({ nome: n })
      .then(docRef => {
        document.getElementById("nome").value = "";
      }).catch(erro => {
        alert("Desculpa, não deu. Tente novamente mais tarde. Ou não, você que sabe.");
      });
  } else {
    alert("A caixa de texto não pode estar vazia.");
  }
}