export interface PaymentProvider {
  prepare(input: { checkoutKey: string; amount: number }): Promise<{ status: "PENDING" }>;
}

export const paymentProvider: PaymentProvider = {
  async prepare() { return { status: "PENDING" }; },
};
