if(process.env.NODE_ENV === 'production'){
    module.exports = {
        mongoURI : 'mongodb://users:users123@ds257470.mlab.com:57470/idea-app'
    }
}else{
    module.exports = {
        mongoURI : 'mongodb://localhost:27017/idea-app'
    }

}