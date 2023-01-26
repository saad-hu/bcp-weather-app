let UserModel = require('../models/userModel');

const guestCities = ['karachi', 'islamabad', 'lahore', 'quetta', 'peshawar'];


async function signUp(req, res) {
    let user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
        try {
            let newUser = await UserModel.create({ ...req.body, userCities: guestCities });
            res.status(200).json(newUser);
        } catch (err) {
            res.status(400).json({ error: err.message })
        }
    }
    else {
        res.status(400).json({ error: `An account with email id '${user.email}' already exists` })
    }
}


async function login(req, res) {
    let user = await UserModel.findOne({ email: req.body.email, password: req.body.password });
    if (user) {
        res.status(200).json(user);
    }
    else {
        res.status(400).json({ error: `No such user. Check email or passowrd.` })
    }
}

module.exports = {
    signUp,
    login
}