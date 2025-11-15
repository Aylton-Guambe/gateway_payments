import { E2PClient } from "../integrations/e2p/E2PClient";

export class PaymentsService {
  private e2p = new E2PClient();

  /**
   * Inicia um pagamento MPesa C2B via e2Payments.
   * N?o grava nada em BD ? apenas devolve os dados da opera??o.
   */
  async createMpesaPayment(params: {
    orderId: string;
    amount: number;
    msisdn: string;
    walletId?: string;
  }) {
    const { orderId, amount, msisdn, walletId } = params;

    const chosenWallet = walletId || process.env.E2P_WALLET_ID;
    if (!chosenWallet) {
      throw new Error("Wallet ID n?o configurado (E2P_WALLET_ID).");
    }

    const reference = String(orderId).replace(/\s+/g, "");

    const providerResp = await this.e2p.c2b(chosenWallet, {
      amount: String(amount),
      phone: String(msisdn),
      reference,
    });

    return {
      orderId: String(orderId),
      amount,
      msisdn: String(msisdn),
      walletId: chosenWallet,
      reference,
      providerResp,
    };
  }

  /**
   * Hist?rico bruto de pagamentos MPesa directamente do e2Payments.
   */
  async listMpesaPayments() {
    const clientId = process.env.E2P_CLIENT_ID;
    if (!clientId) {
      throw new Error("E2P_CLIENT_ID n?o configurado.");
    }

    const data = await this.e2p.listMpesaPayments(clientId);
    return data;
  }
}
