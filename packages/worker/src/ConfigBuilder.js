/* eslint-disable no-param-reassign */
import { storage, templates, config, logger } from '@createvid/common';
import path from 'path';
import fileUrl from 'file-url';
import fs from 'fs';
import Bluebird from 'bluebird';


export const TEMP_DIR = config.render_temp_dir;
export const TEMPLATES_DIR = config.templates_directory;

class ConfigBuilder {
  constructor(taskId) {
    this.mkdir = Bluebird.promisify(fs.mkdir);
    this.readFile = Bluebird.promisify(fs.readFile);
    this.taskId = taskId;
    this.templateId = undefined;
    this.request = undefined;
    this.output = undefined;
  }

  async loadRequest() {
    const TASK_DIR = path.join(TEMP_DIR, this.taskId);
    const TASK_DATA = path.join(TASK_DIR, 'data.json');
    await this.mkdir(path.join(TASK_DIR, 'assets'), { recursive: true });
    await storage.download(`${this.taskId}/data.json`, TASK_DATA);
    const content = await this.readFile(TASK_DATA);
    this.request = JSON.parse(content.toString());
    this.templateId = this.request.templateId;
    return this.request;
  }

  async downloadFileAsset(asset) {
    const { assetList } = this.request;
    if (!assetList || assetList.includes(asset.layerName)) {
      const assetPath = `${this.taskId}/assets/${asset.layerName}`;
      const assetPathWin = path.join(this.taskId, '/assets/', asset.layerName);
      await storage.download(assetPath, path.join(TEMP_DIR, assetPathWin));
      asset.src = fileUrl(path.join(TEMP_DIR, assetPathWin));
    } else {
      asset.remove = true;
    }
  }

  async prepareAssets(assets) {
    await Promise.all(assets.map(async (asset) => {
      if (['text', 'colour', 'data'].includes(asset.type)) {
        asset.type = 'data';
        asset.value = this.request.data[asset.layerName];
        if (asset.titleField) {
          this.request.title = asset.value;
        }
      } else {
        await this.downloadFileAsset(asset);
      }
    }));
  }

  async prepareTemplate(template) {
    template.src = fileUrl(path.join(TEMPLATES_DIR, template.src));
  }

  async preparePostrenderAction(postrender) {
    const last = postrender[postrender.length - 1];
    last.output = path.join(TEMP_DIR, `${this.taskId}_${last.output}`);
    this.output = last.output;
  }

  async prepareActions(actions) {
    await this.preparePostrenderAction(actions.postrender);
  }

  filterAssets(assets) {
    return assets.filter((asset) => !asset.remove);
  }

  async prepare() {
    await this.loadRequest();
    const template = templates.getById(this.templateId);
    await this.prepareAssets(template.assets);
    template.assets = this.filterAssets(template.assets);
    await this.prepareTemplate(template.template);
    await this.prepareActions(template.actions);
    return template;
  }
}

export default ConfigBuilder;
