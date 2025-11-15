import { Router } from "express";
import { PaymentsController } from "../controllers/PaymentsController";

const router = Router();

// POST /payments/mpesa -> inicia pagamento C2B
router.post("/mpesa", PaymentsController.createMpesa);

// GET /payments/history -> hist?rico bruto MPesa vindo do e2Payments
router.get("/history", PaymentsController.listHistory);

export default router;
