const express = require('express');
const app = express();
const PORT = 3000;

const exphbs = require('express-handlebars');

app.engine('handlebars',
    exphbs({ defaultLayout: 'main' })
);

app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/about', (req, res) => {
    res.render('about');
})


app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`)
})