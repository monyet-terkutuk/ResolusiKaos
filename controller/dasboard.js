const express = require("express");
const router = express.Router();
const Transaction = require('../model/transaction'); // Import the Transaction model correctly
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

// Get summary dashboard
router.get(
    "/summary",
    catchAsyncErrors(async (req, res, next) => {
      try {
        const transactionCount = await Transaction.aggregate([
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 }
            }
          },
          {
            $project: {
              status: "$_id",
              count: 1,
              _id: 0
            }
          }
        ]);

        const summary = {
          Paid: 0,
          Processed: 0,
          Shipped: 0,
          Success: 0,
          Unpaid: 0
        };

        transactionCount.forEach(item => {
          if (item.status === "Belum Dibayar") summary.Unpaid = item.count;
          if (item.status === "Dibayar") summary.Paid = item.count;
          if (item.status === "Diproses") summary.Processed = item.count;
          if (item.status === "Dikirim") summary.Shipped = item.count;
          if (item.status === "Selesai") summary.Success = item.count;
        });

        res.status(200).json({
          code: 200,
          success: true,
          data: summary,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    })
);

module.exports = router;
