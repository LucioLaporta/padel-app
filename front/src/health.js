fetch("http://localhost:3000/api/health")
  .then(res => res.json())
  .then(data => {
    console.log("Respuesta backend:", data);
    document.body.innerHTML = <pre>${JSON.stringify(data, null, 2)}</pre>;
  })
  .catch(err => console.error("Error:", err));