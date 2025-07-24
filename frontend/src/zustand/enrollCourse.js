import { create } from "zustand";
import useAuthStore from "./authStore";
const useEnrollStore = create((set) => ({
  loading: false,
  error: null,
  enrollCourse: async (courseId, price, user) => {
    set({ loading: true, error: null });
    try {
      const loadRazorpayScript = () => {
        return new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      const res = await loadRazorpayScript();
      if (!res) {
        alert("Razorpay SDK failed to load");
        set({ loading: false });
        return false;
      }

      // Step 1: Create Razorpay order
      const orderRes = await fetch(
        `/api/payments/createPayment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            price: price, // in INR
            userId: user._id, // demo user
            courseId: courseId, // demo course
          }),
        }
      );

      const { order } = await orderRes.json();

      // Step 2: Configure Razorpay
      return new Promise((resolve) => {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY, // replace with your key
          amount: order.amount,
          currency: "INR",
          name: "EduCore",
          description: "Buy Course",
          order_id: order.id,
          handler: async function (response) {
            const verifyRes = await fetch(
              `/api/payments/verifyPaymentAndEnroll`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  userId: user._id,
                  courseId: courseId,
                  price: order.amount / 100,
                }),
              }
            );

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              alert("✅ Payment successful!");

              // ✅ Re-fetch latest user with updated enrolledCourses
              const { initialize } = useAuthStore.getState();
              await initialize();

              set({ loading: false });
              resolve(true);
            }
            else {
              alert("❌ Payment verification failed!");
              set({ loading: false });
              resolve(false);
            }
          },
          theme: {
            color: "#3399cc",
          },
          modal: {
            ondismiss: function () {
              set({ loading: false });
              resolve(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
}));

export default useEnrollStore;
