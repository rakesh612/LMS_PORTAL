import express from "express";
import { adminaccess, protectRoute } from "../middleWare/authMiddleWare/protectRoute.js";
import { getIncome, getNoOfStudents, getNoOfInstructors, getNoOfCourses, getPendingRequests, verifyInstructor, rejectInstructor, createAdmin } from "../controllers/adminController.js";
const router = express.Router();
router.use(protectRoute);

router.use(adminaccess);

router.post("/getIncome",getIncome);

router.post("/getNoOfStudents",getNoOfStudents);

router.post("/getNoOfInstructors",getNoOfInstructors);

router.post("/getNoOfCourses",getNoOfCourses);

router.post("/getPendingRequests",getPendingRequests);

router.post('/verifyInstructor', verifyInstructor);

router.post('/rejectInstructor', rejectInstructor);

router.post('/createAdmin', createAdmin);
export default router;