import { ticketModel } from "../models/ticket.model.js";

class TicketService {
  async create(ticket) {
    return await ticketModel.create(ticket);
  }

  async getAll() {
    return await ticketModel.find();
  }

  async getById(id) {
    return await ticketModel.findById(id);
  }

  async delete() {
    return await ticketModel.deleteMany();
  }
}

export const ticketService = new TicketService();
