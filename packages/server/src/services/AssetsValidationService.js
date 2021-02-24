import { templates } from '@createvid/common';

import { FILE_ASSETS, DATA_ASSETS } from '../constants/assetTypes';
import ValidationError from '../errors/ValidationError';


class AssetsValidationService {
  static loadConfig(templateId) {
    return templates.getById(templateId).assets;
  }

  static getAvailableFiles(req) {
    return req.files
      ? req.files.reduce((acc, file) => ({
        ...acc,
        [file.fieldname]: true,
      }), {})
      : {};
  }

  static validate(req, res, next) {
    try {
      const assets = AssetsValidationService.loadConfig(req.context.templateId);
      const fileAssets = assets.filter((asset) => FILE_ASSETS.includes(asset.type));
      const dataAssets = assets.filter((asset) => DATA_ASSETS.includes(asset.type));
      const files = AssetsValidationService.getAvailableFiles(req);
      const missingFiles = fileAssets.filter(
        (asset) => asset.required && !files[asset.layerName]
      );
      const missingData = dataAssets.filter(
        (asset) => asset.required && !req.body[asset.layerName]
      );

      if (missingData.length > 0 || missingFiles.length > 0) {
        return next(new ValidationError({
          missingData,
          missingFiles,
        }));
      }
      next();
    } catch (err) {
      next(err);
    }
  }
  static getAsssets(templateId){
    const assets = AssetsValidationService.loadConfig(templateId);
    const fileAssets = assets.filter((asset) => FILE_ASSETS.includes(asset.type));
    const dataAssets = assets.filter((asset) => DATA_ASSETS.includes(asset.type));
    return {fileAssets, dataAssets}
  }
}

export default AssetsValidationService;
