
const uuid = require('uuid');
const ContactDB = require('./ContactDBCollection').ContactDB;   

var contacts = [
    { id: uuid.v4() , name:'Tejas' , phone: 9930860936 , isFavourite: true },
    { id: uuid.v4() , name:'Mosh' , phone: 9876543210 , isFavourite: false },
    { id: uuid.v4() , name:'Jarvis' , phone: 9988776655 , isFavourite: false }
];


async function insertDBContact(contact)
{
    const contactDBObj = new ContactDB(contact);
    const mongoResult = await contactDBObj.save();
    return;
}

for(var i = 0 ; i < contacts.length ; i++)
{
    insertDBContact(contacts[i]);
}
