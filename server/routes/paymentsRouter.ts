import express from "express";

import ctrl from "../controllers/payments";
import { validate } from "../middlewares/validate";
import { paymentSchema } from "../schemas/paymentSchema";
import { checkAuth } from "../middlewares/checkAuth";
import { checkRoles } from "../middlewares/checkRoles";
import { ROLE } from "../utils/role";
import { checkPermission } from "../middlewares/checkPermissions";

const router = express.Router();
router.get(
  "/",
  checkAuth,
  checkRoles(ROLE.ADMIN, ROLE.USER),
  checkPermission("READ"),
  ctrl.getAllPayments
);
router.post(
  "/",
  validate(paymentSchema),
  checkAuth,
  checkRoles(ROLE.ADMIN, ROLE.USER),
  checkPermission("CREATE"),
  ctrl.addPayment
);
router.get(
  "/:paymentId",
  checkAuth,
  checkRoles(ROLE.ADMIN, ROLE.USER),
  checkPermission("READ"),
  ctrl.getPayment
);
router.delete(
  "/:paymentId",
  checkAuth,
  checkRoles(ROLE.ADMIN),
  checkPermission("DELETE"),
  ctrl.removePayment
);

export default router;
