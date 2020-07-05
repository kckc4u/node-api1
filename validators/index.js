exports.validatePost = (req, res, next) => {

    // title
    req.check('title', 'Title cannot be empty').notEmpty();
    req.check('title', 'Title must be between 4 to 150 characters').isLength({
        min: 4,
        max: 150
    });

    // body
    req.check('body', 'Body cannot be empty').notEmpty();
    req.check('body', 'Body must be between 4 to 150 characters').isLength({
        min: 4,
        max: 150
    });

    let errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map((error) => error.msg )[0];
        return res.status(400).json({error: firstError});
    }

    // procced to execute next middleware
    next();
}

exports.validateUser = (req, res, next) => {
    req.check('name', 'Name cannot be empty').notEmpty();

    req.check('email', 'Email must be between 4 to 32 charcters')
    .matches(/.+\@.+\..+/)
    .withMessage("Please provide correct email!")
    .isLength({
        min: 4,
        max: 32
    });

    req.check('password', 'password is required').notEmpty();
    
    req.check('password')
    .isLength({min: 6})
    .withMessage('Password must contain at least 6 characters.')
    .matches(/\d/)
    .withMessage("Password must contain a number");

    // validate form and get errors
    var errors = req.validationErrors();

    if (errors) {
        const firstError = errors.map(err => err.msg)[0];
        return res.status(400).json({error: firstError});
    }

    // execute next middleware
    next();
}