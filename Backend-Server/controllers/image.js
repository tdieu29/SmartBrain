const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: "0ecb00e894d2410993253b104e5b6378"
});

const handleApiCall = (req, res) => {
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input) 
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json('Unable to work with API'))
}

const handleImage = (req, res, db) => {
    const { userId } = req.body;
    db('users').where('id','=', userId).increment('entries', 1)
    .returning('entries')
    .then(entries => {res.json(entries[0])})
    .catch(err => res.status(400).json('Unable to get entry count'))  
}

module.exports = {
    handleImage,
    handleApiCall
}