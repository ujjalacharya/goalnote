if (process.env.NODE_ENV === 'production') {
    module.exports = {
        mongoURI: 'mongodb://ujjal:qwerty12345@ds233581.mlab.com:33581/goalnote'
    }
} else {
    module.exports = {
        mongoURI: 'mongodb://localhost/vidjoid-dev'
    }
}