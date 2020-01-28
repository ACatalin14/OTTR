const Train = require('../models/train');

module.exports = {
    getAll (req, res) {
        Train.find({}, 'number', (err, boards) => {
            this._handleResponse(err, boards, res)
        })
    },
    getById (req, res) {
        Train.findOne({_id: req.params.trainId})
            .exec((err, train) => {
                this._handleResponse(err, train, res)
            })
    },
    _handleResponse (err, data, res) {
        if (err) {
            res.status(400).end()
        } else {
            res.send(data)
        }
    }
};