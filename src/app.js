//require
const path = require('path')
const express = require('express')
const hbs = require('hbs')   //## require HBS
//API 
const geocode = require('./utils/geocode.js')
const forecast = require('./utils/forecast.js')

const app = express()


//앞서 말했듯이 express를 이용한 views폴더는 꼭 views폴더가 root폴던 안에 위치해있어야하는데
// 이렇게 해서 Custom View folder를 재정의 할 수 있다.


//Define Path for Express Config 
const publicDirectoryPath = path.join(__dirname, '../public')
const viewPath = path.join(__dirname, '../templates/views');  //###변경 
const partialsPath = path.join(__dirname,'../templates/partials'); //###추가 


//Setup Handle Bars Engine and Views Location 
app.set('view engine', 'hbs')
app.set('views',viewPath);  //Custome ViewS!

hbs.registerPartials(partialsPath); //### 추가 

//Setup Static Directory to serve 
app.use(express.static(publicDirectoryPath))



app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Matt Kim'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Matt Kim'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text.',
        title : 'Help',
        name : 'Matt Kim'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address){

        return res.send({
            error: "You must provide an address"
        })
    }
    const address = req.query.address;
    geocode(address,(error,{latitude,longitude,location} = {})=>{
        if(error){
            return res.send({
                error : error
            })
        }
        forecast(latitude,longitude,(error,forecastData)=>{
            if(error){
                return res.send({
                    error : error
                })
            }else{
                res.send({
                    forecast : forecastData,
                    location,
                    adress : req.query.address
                })
            }

        })
    })


})

//query string 
app.get('/product',(req,res)=>{
    if(!req.query.search){
        return res.send({
            
            error : "You must provide a search term"

        })

    }
    res.send({

        products : []

    })
})


app.get('/help/*',(req,res)=>{
    res.render('404',{
        title : '404',
        name : 'Matt Kim',
        errorMessage : 'Help Article Not Found'
    });
})




//It needs to come last
app.get('*',(req, res)=>{ // Route가 없을 시 404 이 발생하는데 * 모든 parameter 받는다
    res.render('404',{

        title : '404',
        errorMessage : 'Page Not Found',
        name : 'Matt Kim'

    });
})


app.listen(3000, () => {

    console.log('Server is up on port 3000.')

})

