const catchAsync = (fn) => (req, res, next) => {
  return fn(req, res, next).catch(
    (err) => res.status(500).json({ error: err.message })
    // return fn(req, res, next).catch((err) => next(err));
  );
};

module.exports = catchAsync;
