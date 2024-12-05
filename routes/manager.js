// 3rd party modules
import express from "express";
import { body } from "express-validator";

// importing custom controllers
import * as managerController from "../controllers/manager.js";

// express router app
const router = express.Router();

// routes middleware
// route to create a new item to be added to the inventory
router.put(
  "/item",
  [
    body("name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Item should be a minimum of 2 characters"),
    body("unitPrice")
      .custom((value, { req }) => {
        if (value >= 0) {
          return true;
        }
        throw new Error("Unit price less than zero");
      })
      .withMessage("Unit price should be greater or equal to zero"),
    body("storageLocation")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Storage Location should be a minimum of 2 characters"),
    body("type")
      .trim()
      .toLowerCase()
      .custom((value, { req }) => {
        //   checking that the type provided is valid
        if (value === "frozen" || value === "dry" || value === "fresh") {
          return true;
        }
        throw new Error("Invalid item type");
      })
      .withMessage("Invalid item type")
      .custom((value, { req }) => {
        // checking if each item unique property is not available
        if (
          value === "frozen" &&
          (req.body.minimumTemperature === undefined ||
            req.body.minimumTemperature === null)
        ) {
          throw new Error("Minimum temperature field is missing");
        } else if (
          value === "dry" &&
          (req.body.packagingType === undefined ||
            req.body.packagingType === null)
        ) {
          throw new Error("Packaging type field is missing");
        } else if (
          value === "fresh" &&
          (req.body.isOrganic === undefined || req.body.isOrganic === null)
        ) {
          throw new Error("Is organic field is missing");
        } else {
          return true;
        }
      }),
  ],
  managerController.putItem
);

// route to get all inventory items
router.get("/items/all", managerController.getAllItems);

// route to get all fresh items
router.get("/items/fresh", managerController.getAllFresh);

// route to get all dry items
router.get("/items/dry", managerController.getAllDry);

// route to get all frozen items
router.get("/items/frozen", managerController.getAllFrozen);

// route to get a specific fresh item
router.get("/item/fresh/:id", managerController.getFreshItem);

// route to get a specific dry item
router.get("/item/dry/:id", managerController.getDryItem);

// route to get a specific frozen item
router.get("/item//frozen/:id", managerController.getFrozenItem);

// route to place an order
router.put(
  "/order",
  [
    body("itemType")
      .trim()
      .toLowerCase()
      .custom((value, { req }) => {
        //   checking that the type provided is valid
        if (value === "frozen" || value === "dry" || value === "fresh") {
          return true;
        }
        throw new Error("Invalid item type");
      }),
    body("quantity")
      .isNumeric()
      .withMessage("quantity must be a number")
      .custom((value, { req }) => {
        // checking if quantity is a positive number
        if (value > 0) {
          return true;
        }
        throw new Error("Quantity is negative");
      })
      .withMessage("Quantity must be greater than zero"),
    body("expectedDeliveryDate")
      .isDate()
      .withMessage("Expected delivery date must be valid"),
    body("expectedExpiryDate")
      .isDate()
      .withMessage("Expected expiry date must be valid"),
  ],
  managerController.putOrder
);

// route to check an order
router.post("/order/check", managerController.checkOrder);

// route to view all orders
router.get("/orders", managerController.getAllOrders);

export default router;
