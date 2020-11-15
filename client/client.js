
const contactApiUrl = "http://localhost:3000/api/contacts/";

var phoneBook = [];
var updateID = "";
var currentOperation = "add";

function refreshPhoneBook(contacts)
{
    phoneBook = [];
    var seq = 1;
    $("#contactContainer").empty();

    for(var i = 0; i < contacts.length; i += 1)
    {
        phoneBook.push(contacts[i]);

        var contact = $("#contactList").clone().attr("id",contacts[i].id);
        contact.children(".seq").text(seq);
        contact.children(".name").text(contacts[i].name);
        contact.children(".phone").text(contacts[i].phone);
        contact.css('display','');
        
        contact.appendTo("#contactContainer");
        $("<br>").appendTo("#contactContainer");

        seq += 1;
    }

    console.log(phoneBook);
}

function makeAPICall(method,URL,body)
{
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open(method, URL,true);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.onload = function() 
    {
        if (this.readyState == 4 && this.status == 200) 
        {
            refreshPhoneBook(JSON.parse(this.response));
        }
        else
        {
            console.error(this.responseText);
        }
    };
    xmlhttp.send(body);
    return;
}

function validateForm()
{
    var formName = $(".formName").val();
    var formPhone = $(".formPhone").val();
    
    const onlyNumbers = new RegExp("^[0-9]*$");
    const onlyAlphabets = new RegExp("^[A-Za-z]+$");
    
    if(onlyAlphabets.test(formName) && formPhone.length > 2 && onlyNumbers.test(formPhone) && formPhone.length > 8 )
    {
        $(".formSubmit").prop('disabled', false); 
    }
    else
        $(".formSubmit").prop('disabled', true);
        
    return;
}


$(document).ready(function()
{

    $(document.body).on('click',"#submit", function()
    {
        const contact = {
            name : $(".formName").val(),
            phone : $(".formPhone").val()
        } 
    
        if(currentOperation == "upd")
        {
            makeAPICall("PUT", contactApiUrl + "updateContact/" + updateID , JSON.stringify(contact)); 
        }
        else
        {
            makeAPICall("POST", contactApiUrl + "newContact"  , JSON.stringify(contact)); 
        } 
        $('#contactCardModal').modal('hide');
    });

    $(document.body).on('click',"#btnNewContact", function()
    {
        $(".formName").val("");
        $(".formPhone").val("");
        currentOperation = "add";

        validateForm();
        $('#contactCardModal').modal();
    });

    $("input").keyup( function()
    {
        validateForm();
    });

    $(document.body).on('click','.btnUpdate', function()
    {
        updateID = this.parentElement.parentElement.id;
        currentOperation = "upd";

        var updContact = phoneBook.find(x => x.id == updateID);
        $(".formName").val(updContact.name);
        $(".formPhone").val(updContact.phone);
        
        validateForm();
        $('#contactCardModal').modal();
    });

    $(document.body).on('click','.btnDelete', function()
    {
        const id = this.parentElement.parentElement.id;
        makeAPICall("DELETE", contactApiUrl + "removeContact/" + id); 
    });

    makeAPICall("GET", contactApiUrl + "getAllContacts");
});
