const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const { ReE, ReS } = require('../../helpers/index');

const User = require('../../models').User;

module.exports.getPurchaseHome = async (req, res, next) => {
    try {
        let userSub = req.session.user.subscription
        if (userSub) {
            const subscription = await stripe.subscriptions.retrieve(userSub);
            const start = new Date(subscription.current_period_start * 1000)
            const end = new Date(subscription.current_period_end * 1000)
            return res.render('purchase/home', {
                isAuth: req.session?.user,
                planPage: true,
                isCreator: req.session.user.is_creator,
                isSub: subscription.status == 'active',
                start: `${start.getDate()}/${start.getMonth()}/${start.getFullYear()}`,
                end: `${end.getDate()}/${end.getMonth()}/${end.getFullYear()}`
            })
        } else {
            return res.render('purchase/home', {
                isAuth: req.session?.user,
                planPage: true,
                isCreator: req.session.user.is_creator
            })
        }
    } catch (err) {
        console.log(err)
        return ReE(res, { message: 'something went wrong' }, 400)
        //res.status(400).json({message:'something went wrong'})
    }
}


module.exports.postCreator = async (req, res, next) => {

    try {

        const user = await User.findByPk(req.session.user.id)

        if (!user.stripe_cus_id) {
            const customer = await stripe.customers.create({
                email: req.session.user.email
            })
            user.stripe_cus_id = customer.id
            user.save()
        }


        const session = await stripe.checkout.sessions.create({
            customer: user.stripe_cus_id,
            line_items: [
                {
                    // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                    price: process.env.CREATOR_PRODUCT,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `http://localhost:8000/purchase/creator/success`,
            cancel_url: `http://localhost:8000/purchase/creator/cancel`,
        });
        console.log(session);
        return ReS(res, 'success', { url: session.url }, 200)
    } catch (err) {
        console.log(err)
        return ReE(res, { message: 'something went wrong' }, 400)
        //res.status(400).json({message:'something went wrong'})
    }
}

module.exports.creatorSuccess = async (req, res, next) => {

    try {

        const user = await User.findByPk(req.session.user.id)
        user.is_creator = true
        user.save()

        return res.redirect('/blogs/create')

    } catch (err) {
        console.log(err)
        return ReE(res, { message: 'something went wrong' }, 400)
        //res.status(400).json({message:'something went wrong'})
    }
}

module.exports.postSub = async (req, res, next) => {

    try {

        const user = await User.findByPk(req.session.user.id)

        if (!user.stripe_cus_id) {
            const customer = await stripe.customers.create({
                email: req.session.user.email
            })
            user.stripe_cus_id = customer.id
            await user.save()
        }

        const session = await stripe.checkout.sessions.create({
            customer: user.stripe_cus_id,
            line_items: [
                {
                    price: process.env.GOLD_PRODUCT,
                    quantity: 1
                }
            ],
            mode: 'subscription',
            success_url: `http://localhost:8000/purchase/sub/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:8000/purchase/sub/cancel`,
        });


        console.log('SESSION', session.id);

        return ReS(res, 'success', { url: session.url }, 200)

    } catch (err) {
        console.log(err)
        return ReE(res, { message: 'something went wrong' }, 400)
        //res.status(400).json({message:'something went wrong'})
    }
}


module.exports.subSuccess = async (req, res, next) => {

    try {

        const { session_id } = req.query

        const session = await stripe.checkout.sessions.retrieve(session_id);

        const user = await User.findByPk(req.session.user.id)

        const currentDate = new Date();

        const oneMonthLater = new Date(currentDate);
        oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
        user.subscription_end = oneMonthLater;

        user.subscription = session.subscription
        user.save()

        return res.redirect('/blogs')

    } catch (err) {
        console.log(err)
        return ReE(res, { message: 'something went wrong' }, 400)
        //res.status(400).json({message:'something went wrong'})
    }
}

module.exports.getData = async (req, res, next) => {

    try {

        const subscription = await stripe.subscriptions.retrieve(req.session.user.subscription);
        return res.json(subscription)
    } catch (err) {
        console.log(err)
        return ReE(res, { message: 'something went wrong' }, 400)
        //res.status(400).json({message:'something went wrong'})
    }
}


module.exports.getCancelSubscription = async (req, res, next) => {

    try {
        let userSub = req.session.user.subscription
        if (userSub) {
            const subscription = await stripe.subscriptions.cancel(userSub);

            return res.redirect('/purchase')
        } else {
            return ReE(res, { message: 'No subscription' }, 400)
        }
    } catch (err) {
        console.log(err)
        return ReE(res, { message: 'something went wrong' }, 400)
        //res.status(400).json({message:'something went wrong'})
    }
}