const express = require(`express`);
const morgan = require(`morgan`);
const mongoose = require(`mongoose`);
const blogRoutes = require(`./routes/blogRoutes`);
const { render } = require("ejs");
const app = express();
const port = 3000;
require(`dotenv`).config();
const connectionString = process.env.DATABASE_URI;
mongoose.connect(connectionString)
    .then((result) => {
        app.listen(port, () => {
            console.log(`server running in port ${port}`);
        });
    })
    .catch((err) => { console.log(err) });

app.set(`view engine`, `ejs`);

app.use(express.json());
app.use(express.static(`public`));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(`dev`));

app.get(`/add-blog`, (req, res) => {
    const blog = new Blog({
        title: `new blog2`,
        snippet: `about`,
        body: `most better fckn about`
    })
    blog.save()
        .then((result) => res.send(result))
        .catch((err) => console.log(err));
});

app.get(`/all-blogs`, (req, res) => {
    Blog.find()
        .then((result) => {
            res.send(result)
        })
        .catch((err) => console.log(err));
});

app.get(`/single-blog`, (req, res) => {
    Blog.findById(`655134fd9578ef4823073dc1`)
        .then((result) => res.send(result))
        .catch((err) => console.log(err));
});

app.get(`/`, (req, res) => {
    res.redirect(`/blogs`);
});

app.get(`/about`, (req, res) => {
    res.render(`about`, { title: `ab` });
});

app.use(`/blogs`, blogRoutes);

// 404
app.use((req, res) => {
    res.status(404).render(`404`, { title: `404` });
});