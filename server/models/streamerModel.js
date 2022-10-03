const mongoose = require('mongoose');

const streamerSchema = mongoose.Schema(
    {
        text: {
            type: String,
            required: [true, 'Please add Streamer name'],
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Streamer', streamerSchema);