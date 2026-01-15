fetch("http://localhost:3000/api/health")
  .then(res => res.json())
  .then(data => console.log("Respuesta backend:", data))
  .catch(err => console.error(err));