import mongoose from 'mongoose';

const nutritionLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    mealType: {
        type: String,
        enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Post-Workout'],
        required: [true, 'Please select a meal type']
    },
    foodItems: [{
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        unit: { type: String, default: 'g' },
        calories: { type: Number, required: true },
        protein: { type: Number, default: 0 },
        carbs: { type: Number, default: 0 },
        fats: { type: Number, default: 0 }
    }],
    totalCalories: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Middleware to calculate total calories before saving
nutritionLogSchema.pre('save', async function() {
    this.totalCalories = this.foodItems.reduce((acc, item) => acc + Number(item.calories), 0);
});

const NutritionLog = mongoose.model('NutritionLog', nutritionLogSchema);

export default NutritionLog;
