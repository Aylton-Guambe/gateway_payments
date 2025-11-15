import axios from "axios";

const BASE_URL = process.env.E2P_BASE_URL || "https://e2payments.explicador.co.mz";

type TokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

type C2BPayload = {
  amount: string;
  phone: string;
  reference: string;
};

export class E2PClient {
  private token: { bearer: string; expiresAt: number } | null = null;

  private async fetchToken() {
    console.log("[E2P] Fetching token with:", {
      BASE_URL,
      client_id: process.env.E2P_CLIENT_ID,
    });

    const resp = await axios.post<TokenResponse>(
      `${BASE_URL}/oauth/token`,
      {
        grant_type: "client_credentials",
        client_id: process.env.E2P_CLIENT_ID,
        client_secret: process.env.E2P_CLIENT_SECRET,
      },
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    const data = resp.data;

    const bearer = `${data.token_type} ${data.access_token}`;
    const expiresAt = Date.now() + Number(data.expires_in || 3600) * 1000;

    this.token = { bearer, expiresAt };
    return this.token;
  }

  private async getBearer(): Promise<string> {
    if (this.token && Date.now() < this.token.expiresAt - 5000) {
      return this.token.bearer;
    }
    const t = await this.fetchToken();
    return t.bearer;
  }

  private async headers() {
    return {
      Authorization: await this.getBearer(),
      Accept: "application/json",
      "Content-Type": "application/json",
    };
  }

  async c2b(walletId: string, payload: C2BPayload) {
    const headers = await this.headers();
    const body = {
      client_id: process.env.E2P_CLIENT_ID,
      ...payload,
    };

    const resp = await axios.post(
      `${BASE_URL}/v1/c2b/mpesa-payment/${walletId}`,
      body,
      { headers },
    );

    return resp.data;
  }

  async listMpesaPayments(clientId: string) {
    const headers = await this.headers();
    const body = { client_id: clientId };

    const resp = await axios.post(
      `${BASE_URL}/v1/payments/mpesa/get/all`,
      body,
      { headers },
    );

    return resp.data;
  }
}
