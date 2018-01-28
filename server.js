const express = require('express'),
			bodyParser = require('body-parser'),
			Sequelize = require('sequelize')

const sequelize = new Sequelize('c9', 'root', '', {
	dialect : 'mysql'
})

const Parcare = sequelize.define('parcare',{
  strada:{
    allowNull:false,
    type:Sequelize.STRING
  },
  numarStrada: {
    allowNull: false,
    type: Sequelize.INTEGER,
    validate: {
      isNumeric: true
    }
  },
  oras:{
    allowNull:false,
    type:Sequelize.STRING
  },
  numarLocuri:{
    allowNull:false,
    type: Sequelize.INTEGER,
    validate: {
      isNumeric: true
    }
  },
dimensiuneLoc:{
allowNull:false,
    type:Sequelize.REAL,
    validate:{
      isNumeric: true
    }
}
})

const Masina=sequelize.define('masina',{
  numarInmatriculare:{
    allowNull:false,
    type:Sequelize.STRING,
    validate : {
     len : [6,7]
}  
},
  lungime:{
allowNull:false,
    type:Sequelize.REAL,
    validate:{
      isNumeric: true
    }
},

latime:{
   allowNull:false,
    type:Sequelize.REAL,
    validate:{
      isNumeric: true
    }
}
})

Parcare.hasMany(Masina,{
  foreighKey: 'parcareID'
})
Masina.belongsTo(Parcare,{
  foreighKey: 'parcareID'
})

const app = express()
app.use(bodyParser.json())

app.get('/create', (req, res, next) => {
	sequelize.sync({force : true})
		.then(() => res.status(201).send('created'))
		.catch((err) => next(err))
})

app.get('/parcari', (req, res, next) => {
	Parcare.findAll()
		.then((parcari) => res.status(200).send(parcari))
		.catch((err) => next(err))
})

app.post('/parcari', (req, res, next) => {
	Parcare.create(req.body)
		.then(() => res.status(201).send('created'))
		.catch((err) => next(err))
})


app.get('/parcare/:id',(req,res)=>{
  Parcare
  .find({
    where:{
      id: req.params.id
    }
  })
  .then((parcare)=>{
    res.status(200).send(parcare)
  })
  .catch((error)=>{
    console.warn(error)
    res.status(500).send('error')
  })
})
app.get('/parcari/:strada',(req,res)=>{
  Parcare
  .find({
    where:{
      strada: req.params.strada
    }
  })
  .then((parcare)=>{
    res.status(200).send(parcare)
  })
  .catch((error)=>{
    console.warn(error)
    res.status(500).send('error')
  })
})

app.put('/parcari/:id',(req,res)=>{
  Parcare
  .find({
    where:{
      id: req.params.id
    }
  })
  .then((parcare)=>{
    return parcare.updateAttributes(req.body)
  })
  .then(()=>{
    res.status(201).send('modified')
  })
  .catch((error)=>{
    console.warn(error)
    res.status(500).send('error')
  })
})

app.get('/masini',(req,res)=>{
  Masina.findAll()
	.then((masini) => res.status(200).send(masini))
	.catch((error)=>{
    console.warn(error)
    res.status(500).send('error')
  })
})

app.post('/masini',(req,res)=>{
  Masina
  .create(req.body)
  .then(()=>{
    res.status(201).send('created')
  })
  .catch((error)=>{
    console.warn(error)
    res.status(500).send('error')
  })
})
app.get('/masini/:parcareId',(req,res)=>{
  Masina
  .findAll({
    where:{
      parcareId: req.params.parcareId
    }
  })
  .then((masini)=>{
    res.status(200).send(masini)
  })
  .catch((error)=>{
    console.warn(error)
    res.status(500).send('error')
  })
})

app.delete('/masini/:id', (req, res) => {
  Masina
    .find({
      where: {
        id: req.params.id
      }
    })
    .then((masina) => {
      return masina.destroy()
    })
    .then(() => {
      res.status(201).send('removed')
    })
    .catch((error) => {
      console.warn(error)
      res.status(500).send('error')
    })
})

app.put('/masini/:id',(req,res)=>{
  Masina
  .find({
    where:{
      id: req.params.id
    }
  })
  .then((masina)=>{
    return masina.updateAttributes(req.body)
  })
  .then(()=>{
    res.status(201).send('modified')
  })
  .catch((error)=>{
    console.warn(error)
    res.status(500).send('error')
  })
})

app.listen(8080)
