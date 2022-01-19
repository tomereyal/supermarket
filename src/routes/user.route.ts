import express from "express";
import controller from "../controllers/user.controller";

const router = express.Router();

router.post("/getUser", controller.getUser);
router.post("/register", controller.register);
router.post("/isEmailTaken", controller.isEmailTaken);

export = router;
