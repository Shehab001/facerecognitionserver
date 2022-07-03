const handleSignin = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json("Invalid Submission");
  }
  db.select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      //console.log(isValid);

      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then((user) => {
            res.json(user[0]);
            //console.log(user[0]);
          })
          .catch((err) => res.status(400).json("unable"));
      } else {
        res.status(400).json("unable to fetch");
      }
    })
    .catch((err) => res.status(400).json("wrong credential"));
};

module.exports = {
  handleSignin: handleSignin,
};
