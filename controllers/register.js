const handleRegister = (req, res, db, bcrypt) => {
  const { email, password, name } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json("Invalid Submission");
  }
  const hash = bcrypt.hashSync(password);

  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*")
          .insert({
            email: email,
            name: name,
            joined: new Date(),
          })
          .then((user) => {
            // console.log(user[0]);
            res.json(user[0]);
          })
          .then(trx.commit)
          .catch(trx.rollback);
      })
      .catch((err) => res.status(400).json("unable to register"));
  });
};

module.exports = {
  handleRegister: handleRegister,
};
