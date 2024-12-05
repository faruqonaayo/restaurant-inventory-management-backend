// importing model
import { validationResult } from "express-validator";
import { DryItem, FreshItem, FrozenItem } from "../models/item.js";
import Order from "../models/order.js";

export async function putItem(req, res, next) {
  try {
    const { errors } = validationResult(req);

    if (errors.length > 0) {
      return res.status(422).json({
        message: errors[0].msg,
        statusCode: 422,
      });
    }

    let newItem;
    let isItemExist;

    if (req.body.type.toLowerCase() === "frozen") {
      // checking if item with the name already exists
      isItemExist = await FrozenItem.findOne({ name: req.body.name });

      if (isItemExist) {
        return res.status(409).json({
          message: "Frozen item with the name already exists",
          statusCode: 409,
        });
      }

      // creating a new item
      newItem = new FrozenItem({
        name: req.body.name,
        unitPrice: req.body.unitPrice,
        storageLocation: req.body.storageLocation,
        minimumTemperature: req.body.minimumTemperature,
      });
    } else if (req.body.type.toLowerCase() === "fresh") {
      // checking if item with the name already exists
      isItemExist = await FreshItem.findOne({ name: req.body.name });
      if (isItemExist) {
        return res.status(409).json({
          message: "Fresh item with the name already exists",
          statusCode: 409,
        });
      }

      // creating a new item
      newItem = new FreshItem({
        name: req.body.name,
        unitPrice: req.body.unitPrice,
        storageLocation: req.body.storageLocation,
        isOrganic: req.body.isOrganic,
      });
    } else if (req.body.type.toLowerCase() === "dry") {
      // checking if item with the name already exists
      isItemExist = await DryItem.findOne({ name: req.body.name });
      if (isItemExist) {
        return res.status(409).json({
          message: "Dry item with the name already exists",
          statusCode: 409,
        });
      }

      // creating a new item
      newItem = new DryItem({
        name: req.body.name,
        unitPrice: req.body.unitPrice,
        storageLocation: req.body.storageLocation,
        packagingType: req.body.packagingType,
      });
    }

    await newItem.save();

    return res
      .status(201)
      .json({ message: "Item created successfully", statusCode: 201 });
  } catch (error) {
    next(error);
  }
}

export async function getAllItems(req, res, next) {
  try {
    const allFrozen = await FrozenItem.find({});
    const allFresh = await FreshItem.find({});
    const allDry = await DryItem.find({});

    // container to contain all of the items
    let allItems = [...allDry, ...allFresh, ...allFrozen];

    return res.status(201).json({
      message: "All items fetched successfully",
      items: allItems,
      statusCode: 201,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllFresh(req, res, next) {
  try {
    // fetchin all the fresh items from the database
    const allFresh = await FreshItem.find({});

    return res.status(201).json({
      message: "All fresh items fetched successfully",
      items: allFresh,
      statusCode: 201,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllDry(req, res, next) {
  try {
    // fetchin all the dry items from the database
    const allDry = await DryItem.find({});

    return res.status(201).json({
      message: "All dry items fetched successfully",
      items: allDry,
      statusCode: 201,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllFrozen(req, res, next) {
  try {
    // fetchin all the frozen items from the database
    const allFrozen = await FrozenItem.find({});

    return res.status(201).json({
      message: "All frozen items fetched successfully",
      items: allFrozen,
      statusCode: 201,
    });
  } catch (error) {
    next(error);
  }
}

export async function getFreshItem(req, res, next) {
  try {
    // fetching a fresh item by id in the database
    const freshItem = await FreshItem.findById(req.params.id);

    return res.status(201).json({
      message: "Fresh item fetched successfully",
      item: freshItem,
      statusCode: 201,
    });
  } catch (error) {
    next(error);
  }
}

export async function getDryItem(req, res, next) {
  try {
    // fetching a dry item by id in the database
    const dryItem = await DryItem.findById(req.params.id);

    return res.status(201).json({
      message: "Dry item fetched successfully",
      item: dryItem,
      statusCode: 201,
    });
  } catch (error) {
    next(error);
  }
}

export async function getFrozenItem(req, res, next) {
  try {
    // fetching a fresh item by id in the database
    const frozenItem = await FrozenItem.findById(req.params.id);

    return res.status(201).json({
      message: "Frozen item fetched successfully",
      item: frozenItem,
      statusCode: 201,
    });
  } catch (error) {
    next(error);
  }
}

export async function putOrder(req, res, next) {
  try {
    const { errors } = validationResult(req);

    if (errors.length > 0) {
      return res.status(422).json({
        message: errors[0].msg,
        statusCode: 422,
      });
    }

    let itemToOrder;

    if (req.body.itemType === "frozen") {
      itemToOrder = await FrozenItem.findOne({ _id: req.body.itemId });
    } else if (req.body.itemType === "dry") {
      itemToOrder = await DryItem.findOne({ _id: req.body.itemId });
    } else if (req.body.itemType === "frozen") {
      itemToOrder = await FreshItem.findOne({ _id: req.body.itemId });
    }

    // checking if the item to order exists in the database
    if (!itemToOrder) {
      return res.status(422).json({
        message: "No such item exist in the database",
        statusCode: 422,
      });
    }

    // creating a new order
    const newOrder = new Order({
      orderDate: new Date().toISOString(),
      itemId: req.body.itemId,
      itemType: req.body.itemType,
      unitPrice: itemToOrder.unitPrice,
      quantity: req.body.quantity,
      totalPrice: itemToOrder.unitPrice * req.body.quantity,
      expectedDeliveryDate: req.body.expectedDeliveryDate,
      expectedExpiryDate: req.body.expectedExpiryDate,
    });

    await newOrder.save();

    return res
      .status(201)
      .json({ message: "Order placed successfully", statusCode: 201 });
  } catch (error) {
    next(error);
  }
}

export async function checkOrder(req, res, next) {
  try {
    const isOrderExist = await Order.findOne({ _id: req.body.orderId });
    if (!isOrderExist) {
      return res.status(422).json({
        message: "No such order exist in the database",
        statusCode: 422,
      });
    }

    // changing the value of the order status
    const currentOrderStatus = isOrderExist.status;
    isOrderExist.status = !currentOrderStatus;

    await isOrderExist.save();

    return res
      .status(200)
      .json({ message: "Order updated successfully", statusCode: 200 });
  } catch (error) {
    next(error);
  }
}

export async function getAllOrders(req, res, next) {
  try {
    // fetching all orders in the database
    const allOrders = await Order.find({});

    return res.status(200).json({
      message: "All orders updated successfully",
      orders: allOrders,
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
}
