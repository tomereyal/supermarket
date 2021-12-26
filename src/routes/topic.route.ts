import express from "express";
import controller from "../controllers/topic.controller";

const router = express.Router();

router.get("/", controller.getAllTopics);
router.post("/create", controller.createTopic);

export = router;
