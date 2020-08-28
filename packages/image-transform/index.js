const gm = require('gm');
const path = require('path');


module.exports =  (job, settings, {input, output, operations, ignoreErrors = false}, type) => {
	settings.logger.log(`[${job.uid}] starting image-transform action`);

	if (!path.isAbsolute(input)) input = path.join(job.workpath, input);
	if (!path.isAbsolute(output)) output = path.join(job.workpath, output);

	return new Promise((resolve, reject) => {
	  try {
      let image = gm(input);
      operations.forEach(op => {
        image = image[op.type](...op.args);
      });
      image.write(output, err => {
        settings.logger.log(`[${job.uid}] stopping image-transform`);
        if (err && !ignoreErrors) return reject(err);
        settings.logger.log(`[${job.uid}] image-transform successful`);
        resolve();
      })
    }catch(err){
      if (err && !ignoreErrors) return reject(err);
      resolve();
    }
  });
};
