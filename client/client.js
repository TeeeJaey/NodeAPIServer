
const contactApiUrl = "http://localhost:3000/api/contacts/"; 

var phoneBook = [];
var updateID = "";
var currentOperation = "add";

var mainContentVue = new Vue();       // to put data in HTML 

function refreshPhoneBook(contacts)
{
    phoneBook = [];
    for(var i = 0; i < contacts.length; i += 1)
    {
        contacts[i].seq = i+1;
        phoneBook.push(contacts[i]); 
    }

    mainContentVue.phoneBook = phoneBook;
    mainContentVue.phoneBookEmpty = phoneBook.length==0,
    
    console.log(phoneBook);
}

 
function makeContactsAPICall(method,URL,body)
{
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open(method, URL,true);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.onload = function() 
    {
        if (this.readyState == 4 && this.status == 200) 
        {
            mainContentVue.serverOnline = true;
            refreshPhoneBook(JSON.parse(this.response));
        }
        else
        {
            mainContentVue.serverOnline = false;
            console.error(this.responseText);
        }
    };
    xmlhttp.send(body);
    return;
}

function validateForm()
{
    var formName = $("#contactCard_formName").val();
    var formPhone = $("#contactCard_formPhone").val();
    
    const onlyNumbers = new RegExp("^[0-9]*$");
    const onlyAlphabets = new RegExp("^[A-Za-z]+$");
    
    if(onlyAlphabets.test(formName) && formPhone.length > 2 && onlyNumbers.test(formPhone) && formPhone.length > 8 )
    {
        $("#contactCard_FormSubmit").prop('disabled', false); 
    }
    else
        $("#contactCard_FormSubmit").prop('disabled', true);
        
    return;
}



function toggleFavourite(isFavourite)
{
    currentOperation = "upd";

    var updContact = phoneBook.find(x => x.id == updateID);
    updContact.isFavourite = isFavourite;

    const contact = {
        name : updContact.name,
        phone : updContact.phone,
        isFavourite : updContact.isFavourite
    };

    makeContactsAPICall("PUT", contactApiUrl + "updateContact/" + updateID , JSON.stringify(contact)); 
    return;
}

$(document).ready(function()
{

    mainContentVue = new Vue({
        el: '#mainContent',
        data: {
            logedIn : false,
            registered : true,
            serverOnline : false,
            phoneBook : [],
            phoneBookEmpty : phoneBook.length==0,
            loginUser : null,
            formError : null
        }
    }); 

    var loggedInUser = sessionStorage.getItem("NodeApiApp_LogedIn");
    if( loggedInUser != null && loggedInUser != "")
    {
        mainContentVue.logedIn = true;
        mainContentVue.loginUser = loggedInUser.split('@')[0] ;
        makeContactsAPICall("GET", contactApiUrl + "getAllContacts");
    }

    $(document.body).on('click',"#contactCard_FormSubmit", function()
    {
        const contact = {
            name : $("#contactCard_formName").val(),
            phone : $("#contactCard_formPhone").val()
        } 
    
        if(currentOperation == "upd")
        {
            makeContactsAPICall("PUT", contactApiUrl + "updateContact/" + updateID , JSON.stringify(contact)); 
        }
        else
        {
            makeContactsAPICall("POST", contactApiUrl + "newContact"  , JSON.stringify(contact)); 
        } 
        $('#contactCardModal').modal('hide');
    });

    $(document.body).on('click',"#btnNewContact", function()
    {
        $("#contactCard_formName").val("");
        $("#contactCard_formPhone").val("");
        currentOperation = "add";

        validateForm();
        $('#contactCardModal').modal();
    });

    $("#contactCardModal").keyup(function()
    {
        validateForm();
    });

    $(document.body).on('click','.btnUpdate', function()
    {
        updateID = this.parentElement.parentElement.id;
        currentOperation = "upd";

        var updContact = phoneBook.find(x => x.id == updateID);
        $("#contactCard_formName").val(updContact.name);
        $("#contactCard_formPhone").val(updContact.phone);
        
        validateForm();
        $('#contactCardModal').modal();
    });

    $(document.body).on('click','.btnDelete', function()
    {
        const id = this.parentElement.parentElement.id;
        makeContactsAPICall("DELETE", contactApiUrl + "removeContact/" + id); 
    });

    $(document.body).on('click','.fa-star', function()
    {
        updateID = this.parentElement.parentElement.id;
        toggleFavourite(false);
    });

    $(document.body).on('click','.fa-star-o', function()
    {
        updateID = this.parentElement.parentElement.id;
        toggleFavourite(true);
    });
    
});
