const express = require('express')
const router = express.Router()
const BorrowerController = require('../controller/borrowerController')

// API for money-lending
router.post("/money-lending", BorrowerController.loanRequest)


module.exports = router