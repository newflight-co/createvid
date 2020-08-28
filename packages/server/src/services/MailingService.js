import nodemailer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid-transport';
import Mustache from 'mustache';
import fs from 'fs';
import path from 'path';
import { config } from '@createvid/common';

class MailingService {
  constructor() {
    const apiKey = config.mailing.sendgrid_key;

    this.MAIL_TEMPLATES_DIR = path.join(__dirname, '..', 'mail_templates');

    this.templates = {
      one_time_password: {
        subject: 'One time password',
        template: fs.readFileSync(path.join(this.MAIL_TEMPLATES_DIR, 'one_time_password.html')).toString(),
      },
      welcome: {
        subject: 'Welcome on board!',
        template: fs.readFileSync(path.join(this.MAIL_TEMPLATES_DIR, 'welcome.html')).toString(),
      },
    };

    this.transport = nodemailer.createTransport(sendgridTransport({ auth: { api_key: apiKey } }));
    Object.keys(this.templates).forEach((key) => {
      Mustache.parse(this.templates[key].template);
    });
  }

  async sendMail({
    from, to, template, data,
  }) {
    return new Promise((ok, nok) => {
      const message = {
        from,
        to,
        subject: this.templates[template].subject,
        html: Mustache.render(this.templates[template].template, data),
      };
      this.transport.sendMail(message, (err) => {
        if (err) {
          return nok(err);
        }
        return ok();
      });
    });
  }

  sendOneTimePassword(email, code) {
    return this.sendMail({
      from: 'createvid.io <no-reply@createvid.io>',
      to: email,
      template: 'one_time_password',
      data: {
        code,
        application: { name: 'Createvid.io' },
      },
    });
  }

  sendWelcome(email) {
    return this.sendMail({
      from: 'createvid.io <no-reply@createvid.io>',
      to: email,
      template: 'welcome',
      data: {
        application: { name: 'Createvid.io' },
      },
    });
  }
}

export default new MailingService();
