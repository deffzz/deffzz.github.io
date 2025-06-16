import './styles.css';
import { auth, provider, signInWithPopup, signOut, storage, ref, uploadBytes, listAll, getDownloadURL } from './firebase.js';

const appDiv = document.getElementById('app');

const render = (user) => {
  if (!user) {
    appDiv.innerHTML = `
      <button id="loginBtn" class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition">
        Iniciar sesión con Google
      </button>`;
    document.getElementById('loginBtn').onclick = async () => {
      try {
        await signInWithPopup(auth, provider);
        render(auth.currentUser);
      } catch (e) {
        alert('Error al iniciar sesión');
      }
    };
  } else {
    appDiv.innerHTML = `
      <div class="max-w-lg w-full bg-white p-6 rounded-lg shadow-lg space-y-4">
        <div class="flex justify-between">
          <div>Hola, <strong>${user.displayName}</strong></div>
          <button id="logoutBtn" class="text-red-500 hover:text-red-700">Cerrar sesión</button>
        </div>
        <hr>
        <input type="file" id="fileInput" class="block w-full text-gray-700">
        <button id="uploadBtn" class="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
          Subir archivo
        </button>
        <hr>
        <div>
          <h2 class="text-lg font-semibold mb-2">Archivos para descargar:</h2>
          <ul id="fileList" class="list-disc list-inside space-y-1 text-blue-600"></ul>
        </div>
      </div>`;

    document.getElementById('logoutBtn').onclick = () => {
      signOut(auth).then(() => render(null));
    };

    document.getElementById('uploadBtn').onclick = async () => {
      const f = document.getElementById('fileInput').files[0];
      if (!f) return alert('Selecciona un archivo');
      const stRef = ref(storage, `archivos/${f.name}`);
      await uploadBytes(stRef, f);
      alert('Subido con éxito');
      loadFiles();
    };

    async function loadFiles() {
      const list = await listAll(ref(storage, 'archivos/'));
      const urls = await Promise.all(list.items.map(i => getDownloadURL(i)));
      const ul = document.getElementById('fileList');
      ul.innerHTML = urls.map(u =>
        `<li><a href="${u}" download class="hover:underline">Descargar ${u.split('/').pop()}</a></li>`
      ).join('');
    }

    loadFiles();
  }
};

auth.onAuthStateChanged(user => render(user));
render(auth.currentUser);