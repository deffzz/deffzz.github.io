body {
  font-family: Arial, sans-serif;
  padding: 20px;
  background: #f5f5f5;
}

h1 {
  text-align: center;
}

.upload-section, .note-section {
  margin: 20px auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  max-width: 500px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

textarea {
  width: 100%;
  height: 150px;
  margin-top: 10px;
}

input, button {
  display: block;
  margin-top: 10px;
  width: 100%;
  padding: 10px;
}
4. /public/script.js
js
Copiar
Editar
function uploadFile() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  if (!file) return alert('Selecciona un archivo');

  const formData = new FormData();
  formData.append('file', file);

  fetch('/upload', {
    method: 'POST',
    body: formData
  })
  .then(res => res.json())
  .then(data => alert(data.message))
  .catch(err => console.error(err));
}

function saveNote() {
  const title = document.getElementById('noteTitle').value;
  const content = document.getElementById('noteContent').value;

  if (!title || !content) return alert('Completa el título y contenido');

  fetch('/save-note', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title, content })
  })
  .then(res => res.json())
  .then(data => alert(data.message))
  .catch(err => console.error(err));
}