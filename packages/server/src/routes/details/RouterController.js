import express from 'express';
import { config, logger } from '@createvid/common';

class RouterController {
  async createRouter() {
    const router = new express.Router();
    await this.install(router);
    router.use(this.handleError.bind(this));
    return router;
  }

  async install() {
    throw new Error('Method not implemented!');
  }

  putParamInContext(contextName) {
    return (req, res, next, id) => {
      req.context = req.context || {};
      req.context[contextName] = id;
      next();
    };
  }

  // eslint-disable-next-line complexity
  handleError(err, req, res, next) {
    logger.error(err);
    if (err.previousError) {
      logger.error(err.previousError);
    }
    if (err.createvid) {
      res.status(err.statusCode || 500).json(err);
    } else {
      res.status(err.statusCode || 500).json({ message: err.message });
    }
  }

  forwardError(func) {
    return async (req, res, next) => {
      try {
        await func(req, res, next);
      } catch (err) {
        next(err);
      }
    };
  }
}


export default RouterController;

