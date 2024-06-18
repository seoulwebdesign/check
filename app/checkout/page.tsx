"use client";

import { useEffect, useRef, useState } from "react";
import { PaymentWidgetInstance, loadPaymentWidget, ANONYMOUS } from "@tosspayments/payment-widget-sdk";
import { nanoid } from "nanoid";
import { useQuery } from "@tanstack/react-query";

const clientKey = "test_gck_ZLKGPx4M3MnLKEZ1JKpRVBaWypv1";
const customerKey = nanoid();

const Checkout = () => {
  const { data: paymentWidget } = usePaymentWidget(clientKey, customerKey);
  const paymentMethodsWidgetRef = useRef<ReturnType<PaymentWidgetInstance["renderPaymentMethods"]> | null>(null);
  const agreementsWidgetRef = useRef<ReturnType<PaymentWidgetInstance["renderAgreement"]> | null>(null);
  const [price, setPrice] = useState(50000);
  const [paymentMethodsWidgetReady, isPaymentMethodsWidgetReady] = useState(false);
  const [customer, setCustomer] = useState({ name: '', email: '' });
  const [product, setProduct] = useState({ id: '', name: '', price: 50000 });

  useEffect(() => {
    if (paymentWidget == null) {
      return;
    }

    const paymentMethodsWidget = paymentWidget.renderPaymentMethods("#payment-widget", { value: price }, { variantKey: "DEFAULT" });
    paymentWidget.renderAgreement("#agreement", { variantKey: "AGREEMENT" });

    paymentMethodsWidget.on("ready", () => {
      paymentMethodsWidgetRef.current = paymentMethodsWidget;
      isPaymentMethodsWidgetReady(true);
    });
  }, [paymentWidget]);

  useEffect(() => {
    const paymentMethodsWidget = paymentMethodsWidgetRef.current;
    if (paymentMethodsWidget == null) {
      return;
    }
    paymentMethodsWidget.updateAmount(price);
  }, [price]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer, product }),
      });

      if (paymentWidget) {
        await paymentWidget.requestPayment({
          orderId: nanoid(),
          orderName: product.name,
          customerName: customer.name,
          customerEmail: customer.email,
          successUrl: `${window.location.origin}/success`,
          failUrl: `${window.location.origin}/fail`,
        });
      }
    } catch (error) {
      console.error('Payment request failed', error);
    }
  };

  return (
    <main>
      <div className="wrapper">
        <form onSubmit={handleSubmit} className="box_section">
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Customer Name</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={customer.name}
              onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Customer Email</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded"
              value={customer.email}
              onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Product ID</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={product.id}
              onChange={(e) => setProduct({ ...product, id: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Product Name</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Product Price</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded"
              value={product.price}
              onChange={(e) => {
                const newPrice = parseInt(e.target.value, 10);
                setProduct({ ...product, price: newPrice });
                setPrice(newPrice);
              }}
              required
            />
          </div>

          <div id="payment-widget" style={{ width: "100%" }} />
          <div id="agreement" style={{ width: "100%" }} />

          <button
            className="button"
            style={{ marginTop: "30px" }}
            disabled={!paymentMethodsWidgetReady}
            type="submit"
          >
            결제하기
          </button>
        </form>
      </div>
    </main>
  );
};

function usePaymentWidget(clientKey: string, customerKey: string) {
  return useQuery({
    queryKey: ["payment-widget", clientKey, customerKey],
    queryFn: () => loadPaymentWidget(clientKey, customerKey),
  });
}

export default Checkout;
