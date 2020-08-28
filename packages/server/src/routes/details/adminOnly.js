import AccessDenied from '../../errors/AccessDenied';

export default (req, res, next) => {
  if (req.user.admin) return next();
  next(new AccessDenied('Access denied'));
};
