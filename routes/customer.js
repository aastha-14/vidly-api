const express = require("express");
const router = express.Router();
const { Customer, validate } = require("../models/customer");

router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find();
    if (!customers) return res.status(404).json({ msg: "No customers found." });
    res.json({ customers });
  } catch (e) {
    res.status(400).json({ msg: `${e.message}` });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ msg: "No customer found." });
    res.json({ customer });
  } catch (e) {
    res.status(400).json({ msg: `${e.message}` });
  }
});
router.post("/", async (req, res) => {
  try {
    const result = validate(req.body);

    if (result.error)
      return res.status(400).json(result.error.details[0].message);
    let customer;
    // Adding to db
    if (result.value.isGold) {
      customer = await new Customer({
        name: result.value.name,
        phone: result.value.phone,
        isGold: result.value.isGold,
      });
    } else {
      customer = await new Customer({
        name: result.value.name,
        phone: result.value.phone,
      });
    }
    await customer.save();
    res.json({ customer });
  } catch (e) {
    res.status(400).json({ msg: `${e.message}` });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const result = validate(req.body);

    if (result.error)
      return res.status(400).json(result.error.details[0].message);
    let customer;
    if (result.value.isGold) {
      customer = await Customer.findByIdAndUpdate(req.params.id, {
        name: result.value.name,
        phone: result.value.phone,
        isGold: result.value.isGold,
      });
    } else {
      customer = await Customer.findByIdAndUpdate(req.params.id, {
        name: result.value.name,
        phone: result.value.phone,
      });
    }
    res.json({ customer });
  } catch (e) {
    res.status(400).json({ msg: `${e.message}` });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer)
      return res.status(404).json({ msg: "customer does not exists" });

    res.json({ msg: "Customer deleted" });
  } catch (e) {
    res.status(400).json({ msg: `${e.message}` });
  }
});

module.exports = router;
