const { Schema, model } = require('mongoose');


const StorageSchema = Schema({
    url: {
        type: String
    },
    filename: {
        type: String,
    },

},
{
    timestamps: true,
    versionkey: false
}
);

module.exports = model('storages', StorageSchema );