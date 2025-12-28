// pages/phonePeCallback.jsx
import { useRouter } from "next/router";
import { useEffect } from "react";
import axios from "axios";

export default function phonePeCallback() {
  const { orderId } = useRouter().query;

  useEffect(() => {
    if (!orderId) return;

    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/status?id=${orderId}`).finally(() => {
      window.parent.postMessage("PHONEPE_DONE", "*");
    });
  }, [orderId]);

  return <p>Verifying payment…</p>;
}
