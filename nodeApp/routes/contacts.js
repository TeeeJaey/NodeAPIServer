
const express = require('express'); 
const Joi = require('joi');             // Request validation
const router = express.Router();
const uuid = require('uuid');

router.use(express.json());

var contacts = [
    { id: uuid.v4() , name:'Tejas' , phone: '9930860936' },
    { id: uuid.v4() , name:'Mosh' , phone: '9876543210' },
    { id: uuid.v4() , name:'Jarvis' , phone: '9988776655' }
];

function validateContact(contact) 
{
    const schema = Joi.object({
        name : Joi.string().min(3).required(),
        phone : Joi.string().min(6).required()
    });
    return schema.validate(contact); 
}

function getContact(id) 
{
    return contacts.find(x => x.id == id);
}

//#region "Get Request"

router.get('/getAllContacts', function(req,res)
{
    res.send(contacts);
});

router.get('/getAContact/:id', function(req,res)
{
    var contact = getContact(req.params.id);
    if(!contact)
        res.status(404).send("Error 404 : The contact with given ID was not found !");
    else
        res.send( contact );
});
//#endregion

//#region "Post Request"

router.post('/newContact', function(req,res)
{ 
    var validation = validateContact(req.body);
    if(validation.error)
        res.status(400).send(validation.error.details[0].message);
    else
    {
        var contact = {
            id: uuid.v4(),
            name: req.body.name,
            phone: req.body.phone,
        };
    
        contacts.push(contact);
        res.send(contacts);
    }
    return;
});

//#endregion

//#region "Put Request"

router.put('/updateContact/:id', function(req,res)
{
    var contact = getContact(req.params.id);
    if(!contact)
        res.status(404).send("Error 404 : The contact with given ID was not found !");
    else
    {
        var validation = validateContact(req.body);
        if(validation.error)
            res.status(400).send(validation.error.details[0].message);
        else
        {
            contact.name = req.body.name;
            contact.phone = req.body.phone;
            res.send(contacts);
        }
    }
    return;
});

//#endregion

//#region "Delete Request"
router.delete('/removeContact/:id', function(req,res)
{		
    var contact = getContact(req.params.id);
    if(!contact)
        res.status(404).send("Error 404 : The contact with given ID was not found !");
    else
    {
        contacts.splice(contacts.indexOf(contact) , 1);
        res.send( contacts );
    }
    return;
});
//#endregion


module.exports = router;