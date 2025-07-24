import express from "express";
import { createPayment, verifyPaymentAndEnroll   } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/createPayment", createPayment);
router.post("/verifyPaymentAndEnroll", verifyPaymentAndEnroll ); 

export default router;
