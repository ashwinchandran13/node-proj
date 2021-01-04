const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');
const { result } = require('lodash');

// express app
const app = express();

// Connect to mongo db 
const dbURI = 'mongodb+srv://ashwinchandran13:moonga@cluster0.o1upk.mongodb.net/node-tuts?retryWrites=true&w=majority'; 
mongoose.connect(dbURI, { useUnifiedTopology: true, useNewUrlParser: true })
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

// register view engine
app.set('view engine', 'ejs');


// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}));
app.use(morgan('dev'));

// mongoose and mongo sandbox routes
// to add blogs
// app.get('/add-blog', (req, res) => {
//     const blog = new Blog({
//         title: 'new blog 3',
//         snippet: 'about my newblog',
//         body: 'more about my new blog'
//     });

//     blog.save()
//         .then((result) => {
//             res.send(result)
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// })

// // to get all blogs
// app.get('/all-blogs', (req, res) => {
//     Blog.find()
//         .then((result) => {
//             res.send(result);
//         })
//         .catch((err) => {
//             console.log(err)
//         });
// })

// // to get a single blog

// app.get('/single-blog', (req, res) => {
//     Blog.findById('5fed998c6c43f93962b72a01')
//         .then((result) => {
//             res.send(result)
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// })

// middleware creation
// app.use((req, res, next) => {
//     console.log('New request made:');
//     console.log('host: ', req.hostname);
//     console.log('path: ', req.path);
//     console.log('method: ', req.method);
//     next();
// });


// routes
app.get('/',(req, res) => {
    res.redirect('/blogs');
    //res.send('<p> home page </p>');
    // dummy data
    // const blogs = [
    //     {title: 'Yoshi finds eggs', snippet: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'},
    //     {title: 'Mario finds stars', snippet: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'},
    //     {title: 'How to defeat bowser', snippet: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'},
    // ];
    // res.render('index', { title: 'Home', blogs });
});

// app.use((req, res, next) => {
//     console.log('in the next middleware');
//     next();
// });

app.get('/about',(req, res) => {
    //res.send('<p> about page </p>');
    res.render('about', { title: 'About'});
});

// blog routes
app.get('/blogs', (req, res) => {
    Blog.find().sort({ createdAt: -1 })
        .then((result) => {
            res.render('index', { title: 'All Blogs', blogs: result })
        })
        .catch((err) => {
            console.log(err);
        })
})

app.get('/blogs', (req, res) => {
    const blog = new Blog(req.body);

    blog.save()
     .then((result) => {
         res.redirect('/blogs');
     })
      .catch((err) => {
          console.log(err);
      })
})

app.get('/blogs/create', (req,res) => {
    res.render('create', { title: 'Create Blogs'});
});

app.get('/blogs/:id', (req,res) => {
    const id = req.params.id;
    Blog.findById(id)
        .then(result => {
            res.render('details', { blog: result, title: 'Blog Details'});
        })
        .catch(err => {
            console.log(err);
        })

})

app.delete('/blogs/:id', (req,res) => {
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/blogs' });
        })
        .catch(err => {
            console.log(err)
        })
})


// 404 page, position should always be last of all get
app.use((req, res) => {
    res.status(404).render('404', { title: 'Error Page not found'});
});


