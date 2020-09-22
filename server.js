const express=require('express')
const app=express()
const pg=require('pg')
const superagent=require('superagent')
const methodOverride=require('method-override')







require('dotenv').config();

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('./public'));
app.set('view engine', 'ejs');
const  PORT=process.env.PORT||3300
const client = new pg.Client(process.env.DATABASE_URL);

app.get("/",homeHelder)
function homeHelder(req,res) {
    
    let url=`https://api.covid19api.com/world/total`
    superagent.get(url).then((data)=>{
 
        res.render("./page/index",{card1:data.body})
    })
    
}
app.get("/countryresult",CountryResultHelder)
function CountryResultHelder(req,res) {
    // console.log(req.query);
   const {country,startdate,enddate}= req.query
    let url=`https://api.covid19api.com/country/${country}/status/confirmed?from=${startdate}&to=${enddate}`
 
    superagent.get(url).then((data)=>{


        res.render("./page/countryresult",{card2:data.body})
    })
    
}
app.get("/allcountry",allcountryHelder)
function allcountryHelder(req,res) {

    let url=`https://api.covid19api.com/summary`
    console.log(url);
    superagent.get(url).then((data)=>{
       
        let obj=data.body.Countries.map((element)=>{
            return new Cad(element)
        })
     
        res.render("./page/allcountry",{card3:obj})
    })
    
}
function Cad(obj2) {
    this.country=obj2.Country
    this.countryCode=obj2.CountryCode
    this.confirmed_cases=obj2.TotalConfirmed
    this.death_cases=obj2.TotalDeaths
    this.Rrecoverd_cases=obj2.TotalRecovered
    this.date=obj2.Date



    
}
app.get("/add",addHelder)
function addHelder(req,res) {
    console.log(req.query);
let {country,confirmed_cases,death_cases,Rrecoverd_cases}=req.query
    let sql=`INSERT INTO cards (country,confirmed_cases,death_cases ,Rrecoverd_cases)
    VALUES ($1,$2,$3,$4);`
    // console.log(url);
    console.log(sql);
    let safe=[country,confirmed_cases,death_cases,Rrecoverd_cases]
 client.query(sql,safe).then((data)=>{
        console.log(data.rows);
       
      
        // res.redirect ("/myrecord")
    })
    
}

app.get("/country/:id",detailesHelder)
function detailesHelder(req,res) {
    let safe=[req.params ]

    let sql=`SELECT * FORM cards where id=$1`
    // console.log(url);

 client.query(sql,safe).then((data)=>{
        console.log(data.rows);
      
        res.render("./page/detailes",{card4:obj})
    })
    
}
app.get("/myrecord",myrecordHelder)
function myrecordHelder(req,res) {
    // let safe=[req.params ]

    let sql=`SELECT * FROM cards `
    // console.log(url);

 client.query(sql).then((data)=>{
        console.log(data.rows);
       
      
        res.render("./page/myrecord",{card4:data.rows})
    })
    
}

app.delete("/delete/:id",deleteHelder)
function deleteHelder(req,res) {
    let safe=[req.params ]

    let sql=`DELETE FROM cards WHERE id=$1; `
    // console.log(url);

 client.query(sql,safe).then((data)=>{
       
       
      
             res.redirect ("/myrecord")
    })
    
}















client.connect().then(()=>{
    app.listen(PORT,()=>{
        console.log(`listing to ${PORT}` );
    })
})


