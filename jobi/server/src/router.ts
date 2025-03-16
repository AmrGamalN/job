import express, { Request, Response } from "express";
const router = express();
router.use("/health-check", (req: Request, res: Response) => {
  console.log("Server is running");
  res.status(200).send("Server is up and running");
});

router.use();
export default router;
