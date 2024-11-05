import nodemailer from "nodemailer";
import { config } from "../config/config.js";
import winstonLogger from "./winston.util.js";

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.mailer.host,
      port: config.mailer.port,
      auth: config.mailer.auth,
    });
    this.from = config.mailer.from;
  }

  getMessageTemplate(type, mail, amount, products, name) {
    let body = `<h1>Hola ${name},</h1>`;

    switch (type) {
      case "buy":
        body += `
          <p style="font-size: 16px; color: green;">¡Gracias por tu compra!</p>
          <p style="font-size: 16px;">Tu pedido ha sido recibido y está siendo procesado.</p>
          <p style="font-size: 16px;">Monto total: $${amount}</p>
          <p style="font-size: 16px;">Detalles de los productos:</p>
          <ul>`;

        products.forEach((product) => {
          body += `<li>${product.name}: ${product.quantity} x $${product.price}</li>`;
        });

        body += `</ul>
          <p style="font-size: 16px;">Si tienes alguna pregunta, no dudes en contactarnos.</p>
          `;
        break;

      case "welcome":
        body += `        
          <p style="font-size: 16px;">¡Bienvenido a nuestro servicio!</p>
          <p style="font-size: 16px;">Estamos emocionados de tenerte con nosotros.</p>
          <p style="font-size: 16px;">Si tienes alguna pregunta, no dudes en contactarnos.</p>
          `;
        break;

      default:
        body += `        
          <p style="font-size: 16px;">Gracias por tu mensaje.</p>
          `;
    }

    body += `        
    <p style="font-size: 16px;">¡Gracias por elegirnos y felices compras!</p>
      `;

    return body;
  }

  async sendMail({ to, subject, type, amount, products, name }) {
    try {
      const html = this.getMessageTemplate(type, to, amount, products, name);

      const info = await this.transporter.sendMail({
        from: this.from,
        to,
        subject,
        html,
      });
      winstonLogger.info("Email sent:", info);
    } catch (error) {
      winstonLogger.fatal("Error sending email:", error);
    }
  }
}

export const mailService = new MailService();
