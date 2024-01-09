const { sign, verify } = require("jsonwebtoken");

const createTokens = (user) => {
  const accessToken = sign(
    { username: user.username, id: user.id },
    "jwtsecretkey",
    {expiresIn: "1h"}
  );

  return accessToken;
};

const validateToken = (req, res, next) => {
  const accessToken = req.cookies["token"] ? req.cookies["token"] : req.body.accessToken; 
  if (!accessToken)
    return res.status(400).json({ error: "User not Authenticated!" });

  try {
    const validToken = verify(accessToken, "jwtsecretkey");
    console.log(validToken)
    if (validToken) {
      req.authenticated = true;
      return next();
    }
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

module.exports = { createTokens, validateToken };