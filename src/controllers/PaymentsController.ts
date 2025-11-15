import type { Request, Response } from "express";
import { PaymentsService } from "../services/PaymentsService";

const service = new PaymentsService();

export class PaymentsController {
  static async createMpesa(req: Request, res: Response) {
    try {
      const { orderId, amount, msisdn, walletId } = req.body;

      if (!orderId || !amount || !msisdn) {
        return res.status(400).json({
          ok: false,
          error: "Campos obrigat?rios: orderId, amount, msisdn",
        });
      }

      const parsedAmount = Number(amount);
      if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({
          ok: false,
          error: "amount inv?lido",
        });
      }

      const result = await service.createMpesaPayment({
        orderId: String(orderId),
        amount: parsedAmount,
        msisdn: String(msisdn),
        walletId: walletId ? String(walletId) : undefined,
      });

      return res.status(201).json({
        ok: true,
        ...result,
      });
    } catch (err: any) {
      console.error("createMpesa error:", err?.response?.data || err);
      return res.status(502).json({
        ok: false,
        error: err?.response?.data || err?.message || "Erro ao contactar e2Payments",
      });
    }
  }

  static async listHistory(_req: Request, res: Response) {
    try {
      const data = await service.listMpesaPayments();
      return res.json({
        ok: true,
        data,
      });
    } catch (err: any) {
      console.error("listHistory error:", err?.response?.data || err);
      return res.status(502).json({
        ok: false,
        error: err?.response?.data || err?.message || "Erro ao contactar e2Payments",
      });
    }
  }
}
