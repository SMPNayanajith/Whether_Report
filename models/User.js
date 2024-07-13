const weatherDataSchema = new mongoose.Schema({
    date: { type: String, required: true },
    time: { type: String, required: true },
    weather: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    location: { type: String, required: true },
    weatherData: [weatherDataSchema],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
