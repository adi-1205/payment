const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const sanitizeHtml = require('sanitize-html');

const { ReS, ReE } = require('../../helpers/index');
const Blog = require('../../models').Blog;
const User = require('../../models').User;

module.exports.getBlogs = async (req, res, next) => {
    try {

        const blogs = await Blog.findAll({ raw: true })

        res.render('blogs/read', {
            blogs,
            isAuth: req.session?.user,
            blogPage: true
        })

    } catch (err) {
        console.log(err)
        return ReE(res, { message: 'something went wrong' }, 400)
        //res.status(400).json({message:'something went wrong'})
    }
}
module.exports.getCreateBlog = async (req, res, next) => {

    try {

        if (!req.session.user.is_creator) {
            return res.redirect('/purchase')
        }

        res.render('blogs/create', {
            isAuth: req.session?.user,
            blogPage: true
        })
    } catch (err) {
        console.log(err)
        return ReE(res, { message: 'something went wrong' }, 400)
        //res.status(400).json({message:'something went wrong'})
    }
}

module.exports.postCreateBlog = async (req, res, next) => {

    try {

        const { title, excerpt, body, isPrem } = req.body

        const sanitized = sanitizeHtml(body, {
            allowedTags: ['p', 'h1', 'h2', 'h3', 'em', 'strong', 'u', 'a', 'ol', 'ul', 'li'],
            allowedAttributes: {
                'a': ['href', 'target']
            }
        });

        await Blog.create({
            title,
            excerpt,
            body: sanitized,
            author_id: req.session.user.id,
            url: `https://source.unsplash.com/random?sig=${Math.floor(Math.random() * 10)}`,
            is_premium: isPrem
        })

        return ReS(res, 'blog created', {}, 200)
    } catch (err) {
        console.log(err)
        return ReE(res, { message: 'something went wrong' }, 400)
        //res.status(400).json({message:'something went wrong'})
    }
}

module.exports.getBlog = async (req, res, next) => {

    try {
        let { id } = req.params
        let blog = await Blog.findOne({
            where: {
                id
            },
            include: {
                model: User,
                attributes: ['username']
            },
            raw: true
        })

        if (blog.is_premium) {
            let userSub = req.session.user.subscription
            if (userSub) {
                const subscription = await stripe.subscriptions.retrieve(userSub);
                if(subscription.status != 'active')
                    return res.redirect('/purchase');
            }
        }

        return res.render('blogs/blog', {
            ...blog,
            author: blog['User.username'],
            isAuth: req.session?.user
        })
    } catch (err) {
        console.log(err)
        return ReE(res, { message: 'something went wrong' }, 400)
        //res.status(400).json({message:'something went wrong'})
    }
}