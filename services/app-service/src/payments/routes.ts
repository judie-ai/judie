import { Request, Response, Router } from "express";
import {
  errorPassthrough,
  handleValidationErrors,
  requireAuth,
} from "../utils/express.js";
import UnauthorizedError from "../utils/errors/UnauthorizedError.js";
import {
  checkout,
  createCustomer,
  getCustomer,
  getCustomerSubscriptions,
} from "./service.js";
import { body, param } from "express-validator";
import NotFoundError from "../utils/errors/NotFoundError.js";

const router = Router();

router.get(
  "/:customerId",
  [param("customerId").exists().isString()],
  requireAuth,
  errorPassthrough(handleValidationErrors),
  errorPassthrough(async (req: Request, res: Response) => {
    const customerId = req.params.customerId;
    const session = req.session;
    if (!session.userId) {
      throw new UnauthorizedError("No user id found in session");
    }
    const customer = await getCustomer(customerId);
    if (!customer) {
      throw new NotFoundError("Customer not found");
    }

    res.status(200).json({
      data: customer,
    });
  })
);

router.get(
  "/:customerId/subscriptions",
  [param("customerId").exists().isString()],
  requireAuth,
  errorPassthrough(handleValidationErrors),
  errorPassthrough(async (req: Request, res: Response) => {
    const customerId = req.params.customerId;
    const session = req.session;
    if (!session.userId) {
      throw new UnauthorizedError("No user id found in session");
    }
    const customerSubscriptions = await getCustomerSubscriptions(customerId);
    if (!customerSubscriptions) {
      throw new NotFoundError("Customer Subscription not found");
    }

    res.status(200).json({
      data: customerSubscriptions,
    });
  })
);

router.post(
  "/customer",
  requireAuth,
  errorPassthrough(async (req: Request, res: Response) => {
    const session = req.session;
    if (!session.userId) {
      throw new UnauthorizedError("No user id found in session");
    }

    // Create Stripe customer for user
    const customerId = await createCustomer(session.userId);

    res.status(200).json({
      data: {
        customerId,
      },
    });
  })
);

router.post(
  "/checkout-session",
  [body("currentUrl").exists().isString()],
  requireAuth,
  errorPassthrough(handleValidationErrors),
  errorPassthrough(async (req: Request, res: Response) => {
    const session = req.session;
    if (!session.userId) {
      throw new UnauthorizedError("No user id found in session");
    }

    // Create Stripe Checkout Session for user
    const checkoutSession = await checkout(
      session.userId,
      req.body.currentUrl
        ? `${req.body.currentUrl}?${
            req.body.currentUrl.includes("?id=") ? "&paid=true" : "?paid=true"
          }`
        : `${req.headers.origin}/chat?paid=true`,
      req.body.currentUrl || `${req.headers.origin}/chat`
    );

    res.status(200).json({
      data: checkoutSession.url,
    });
  })
);

export default router;
