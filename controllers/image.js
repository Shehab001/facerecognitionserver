const Clarifai = require("clarifai");
//const res = require("express/lib/response");

const app = new Clarifai.App({
  apiKey: "374a88a2fbdd4af7994631874115d850",
});

const handleApiCall = (req, res) => {
  //console.log("b");
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.status(400).json("Unable to work with API"));
};

const handleImage = (req, res, db) => {
  const { id } = req.body;

  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      // console.log(entries[0], entries[0].entries);
      return res.json(entries[0].entries);
    })
    .catch((err) => {
      res.status(400).json("unable to fetch");
    });
};

module.exports = {
  handleApiCall,
  handleImage,
};
