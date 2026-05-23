module.exports = (roles) => {

  return (
    req,
    res,
    next
  ) => {

    console.log(
      "USER ROLE:",
      req.user.role
    );

    if (
      !roles.includes(
        req.user.role
      )
    ) {

      return res.status(403).json({
        message:
          "Access denied",
      });
    }

    next();
  };
};