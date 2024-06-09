const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        // add brand field with default value and required as false
        brand: {
            type: String,
            default: 'Gears',
            required: false,
        },
        description: {
            type: String,
            required: false,
        },
        price: {
            type: Number,
            required: false,
            min: 0,
        },
        category: {
            type: String,
            required: false,
        },
        type: {
            type: String,
            enum: ['sellable', 'rentable'],
            default: 'sellable',
        },
        imageUrl: {
            type: String,
            required: false,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
        rentalInfo: {
            rentalPricePerDay: {
                type: Number,
                default: 0, // You can adjust the default based on your needs
                // required: function () {
                //     return this.type === 'rentable';
                // },
            },
            rentalDeposit: {
                type: Number,
                default: 0, // You can adjust the default based on your needs
                // required: function () {
                //     return this.type === 'rentable';
                // },
            },
            rentalPeriod: {
                type: String,
                enum: ['day', 'week', 'month'],
                default: 'day', // You can adjust the default based on your needs
            },
            // Add more rental-specific fields as needed
        },
    },
    {
        timestamps: true,
    }
);


// Pre-save hook to update the `updatedAt` field
productSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
  });
  
  // Virtual field to calculate rental cost
  productSchema.virtual('rentalCost').get(function () {
    if (this.type === 'rentable') {
      return this.rentalInfo.rentalPricePerDay;
    }
    return 0;
  });
  
  // Method to calculate the total rental cost
  productSchema.methods.calculateRentalCost = function (rentalStartDate, rentalEndDate) {
    const durationInMilliseconds = rentalEndDate - rentalStartDate;
    const durationInDays = durationInMilliseconds / (1000 * 60 * 60 * 24); // Convert milliseconds to days
    const dailyRentalRate = this.rentalInfo.rentalPricePerDay;
    const totalCost = dailyRentalRate * durationInDays;
    return totalCost;
  };

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
