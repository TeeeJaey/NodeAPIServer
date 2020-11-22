
const userApiUrl = "http://localhost:3000/api/users/";

function logIn(userEmail)
{
    sessionStorage.setItem("NodeApiApp_LogedIn",userEmail);
    mainContentVue.logedIn = true;
    mainContentVue.loginUser = userEmail.split('@')[0] ;
    makeContactsAPICall("GET", contactApiUrl + "getAllContacts");
    return;
}

function makeUsersAPICall(method,URL,body)
{
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open(method, URL,true);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.onload = function() 
    {
        if (this.readyState == 4 && this.status == 200) 
        {
            mainContentVue.serverOnline = true;
            const res = JSON.parse(this.response);
            if(res.logIn)
                logIn(res.user);
        }
        else
        {
            mainContentVue.serverOnline = false;
            console.error(this.responseText);
            mainContentVue.formError = this.responseText;
        }
    };
    xmlhttp.send(body);
}

$(document).ready(function()
{

    // sessionStorage.setItem("NodeApiApp_LogedIn",true);

    $(document.body).on('click',"#register_Switch", function()
    {
        mainContentVue.registered = false;
    });
    $(document.body).on('click',"#logIn_Switch", function()
    {
        mainContentVue.registered = true;
    });

    $(document.body).on('click',"#btnLogOut", function()
    {
        sessionStorage.removeItem("NodeApiApp_LogedIn");
        mainContentVue.logedIn = false;
        mainContentVue.registered = true;
        mainContentVue.formError = null;
    });

    
    $(document.body).on('click','#logIn_FormSubmit', async function()
    {  
        var formEmail = $("#logIn_FormEmail").val();
        var formPassword = $("#logIn_FormPassword").val();
        
        if(formEmail!="" && formPassword!="")
        {
            var authUser = {email: formEmail , password: formPassword};
            makeUsersAPICall("POST", userApiUrl + "authUser", JSON.stringify(authUser));
        }
        else
        {
            mainContentVue.formError = "Please fill in Email and Password";
        }
    });

    $(document.body).on('click','#register_FormSubmit', async function()
    {  
        var formEmail = $("#register_formEmail").val();
        var formName = $("#register_formName").val();
        var formPassword = $("#register_formPassword").val();
        var formConfPassword = $("#register_formConfPassword").val();
        
        if(formEmail!="" && formPassword!="")
        {
            if(formPassword != formConfPassword)
            {
                mainContentVue.formError = "Passwords do not match";
            }
            else
            {
                var authUser = {name: formName, email: formEmail , password: formPassword};
                makeUsersAPICall("POST", userApiUrl + "newUser", JSON.stringify(authUser));
            }
        }
        else
        {
            mainContentVue.formError = "Please fill in Email and Password";
        }
    });

});