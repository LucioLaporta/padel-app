const healthCheck = (req, res) => {
  res.json({
    status: "ok",
    message: "Backend funcionando correctamente 🚀"
  });
};

module.exports = { healthCheck };