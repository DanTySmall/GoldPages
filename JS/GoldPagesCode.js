const urlBase = 'http://64.23.240.154/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
const ids = []

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/GoldLogin.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "Incorrect Username or Password";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doRegister() {
    let newFirstName = document.getElementById("firstName").value;
    let newLastName = document.getElementById("lastName").value;
    let newUsername = document.getElementById("username").value;
    let newPassword = document.getElementById("password").value;
    document.getElementById("registerResult").innerHTML = "";

    let tmp = { firstName: newFirstName, lastName: newLastName, username: newUsername, password: newPassword };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/GoldRegister.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("registerResult").innerHTML = "User has been registered";
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("registerResult").innerHTML = err.message;
    }
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Welcome, " + firstName + " " + lastName + "!";
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function showTable() {
    var x = document.getElementById("addMe");
    var contacts = document.getElementById("contactsTable")
    if (x.style.display === "none") {
        x.style.display = "block";
        contacts.style.display = "none";
    } else {
        x.style.display = "none";
        contacts.style.display = "block";
    }
}

function addContact() {
    let newFirstName = document.getElementById("firstName").value;
    let newLastName = document.getElementById("lastName").value;
    let newPhoneNumber = document.getElementById("phoneNumber").value;
    let newEmail = document.getElementById("email").value;
    document.getElementById("contactAddResult").innerHTML = "";

    let tmp = { firstName: newFirstName, lastName: newLastName, phoneNumber: newPhoneNumber, email: newEmail, userId: userId };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/GoldAdd.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("contactAddResult").innerHTML = "Contact has been added";
                // Clear input fields in form 
                document.getElementById("addMe").reset();
                 // Wait for 5 seconds before reloading contacts and switching view
                 setTimeout(function() {
                    loadContacts(); //reload
                    showTable();    //switch back
                }, 5000); // 5000 milliseconds = 5 seconds
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("contactAddResult").innerHTML = err.message;
    }
}

function searchContact() {
    let srch = document.getElementById("searchText").value;
    document.getElementById("contactSearchResult").innerHTML = "";

    let contactList = "";

    let tmp = { search: srch, userId: userId };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/GoldSearchContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
                let jsonObject = JSON.parse(xhr.responseText);

                for (let i = 0; i < jsonObject.results.length; i++) {
                    contactList += jsonObject.results[i].firstName + " " + jsonObject.results[i].lastName + " " + jsonObject.results[i].phoneNumber + " " + jsonObject.results[i].email;
                    if (i < jsonObject.results.length - 1) {
                        contactList += "<br />\r\n";
                    }
                }

                document.getElementsByTagName("p")[0].innerHTML = contactList;
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("contactSearchResult").innerHTML = err.message;
    }
}

function editContact() {
    let contactId = document.getElementById("contactId").value;
    let newFirstName = document.getElementById("firstName").value;
    let newLastName = document.getElementById("lastName").value;
    let newPhoneNumber = document.getElementById("phoneNumber").value;
    let newEmail = document.getElementById("email").value;
    document.getElementById("contactEditResult").innerHTML = "";

    let tmp = { contactId: contactId, firstName: newFirstName, lastName: newLastName, phoneNumber: newPhoneNumber, email: newEmail, userId: userId };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/GoldEditContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("contactEditResult").innerHTML = "Contact has been updated";
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("contactEditResult").innerHTML = err.message;
    }
}

function deleteContact() {
    let contactId = document.getElementById("contactId").value;
    document.getElementById("contactDeleteResult").innerHTML = "";

    let tmp = { contactId: contactId, userId: userId };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/GoldDelete.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("contactDeleteResult").innerHTML = "Contact has been deleted";
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("contactDeleteResult").innerHTML = err.message;
    }
}

function clickLogin() {
    var log = document.getElementById("login");
    var reg = document.getElementById("signup");
    var but = document.getElementById("btn");

    log.style.left = "-400px";
    reg.style.left = "0px";
    but.style.left = "130px";
}

function clickRegister() {

    var log = document.getElementById("login");
    var reg = document.getElementById("signup");
    var but = document.getElementById("btn");

    reg.style.left = "-400px";
    log.style.left = "0px";
    but.style.left = "0px";

}

function validLoginForm(logName, logPass) {

    var logNameErr = logPassErr = true;

    if (logName == "") {
        console.log("USERNAME IS BLANK");
    }
    else {
        var regex = /(?=.*[a-zA-Z])[a-zA-Z0-9-_]{3,18}$/;

        if (regex.test(logName) == false) {
            console.log("USERNAME IS NOT VALID");
        }

        else {

            console.log("USERNAME IS VALID");
            logNameErr = false;
        }
    }

    if (logPass == "") {
        console.log("PASSWORD IS BLANK");
        logPassErr = true;
    }
    else {
        var regex = /(?=.*\d)(?=.*[A-Za-z])(?=.*[!@#$%^&*]).{8,32}/;

        if (regex.test(logPass) == false) {
            console.log("PASSWORD IS NOT VALID");
        }

        else {

            console.log("PASSWORD IS VALID");
            logPassErr = false;
        }
    }

    if ((logNameErr || logPassErr) == true) {
        return false;
    }
    return true;

}

function validSignUpForm(fName, lName, user, pass) {

    var fNameErr = lNameErr = userErr = passErr = true;

    if (fName == "") {
        console.log("FIRST NAME IS BLANK");
    }
    else {
        console.log("first name IS VALID");
        fNameErr = false;
    }

    if (lName == "") {
        console.log("LAST NAME IS BLANK");
    }
    else {
        console.log("LAST name IS VALID");
        lNameErr = false;
    }

    if (user == "") {
        console.log("USERNAME IS BLANK");
    }
    else {
        var regex = /(?=.*[a-zA-Z])([a-zA-Z0-9-_]).{3,18}$/;

        if (regex.test(user) == false) {
            console.log("USERNAME IS NOT VALID");
        }

        else {

            console.log("USERNAME IS VALID");
            userErr = false;
        }
    }

    if (pass == "") {
        console.log("PASSWORD IS BLANK");
    }
    else {
        var regex = /(?=.*\d)(?=.*[A-Za-z])(?=.*[!@#$%^&*]).{8,32}/;

        if (regex.test(pass) == false) {
            console.log("PASSWORD IS NOT VALID");
        }

        else {

            console.log("PASSWORD IS VALID");
            passErr = false;
        }
    }

    if ((fNameErr || lNameErr || userErr || passErr) == true) {
        return false;

    }

    return true;
}

function validAddContact(firstName, lastName, phone, email) {

    var fNameErr = lNameErr = phoneErr = emailErr = true;

    if (firstName == "") {
        console.log("FIRST NAME IS BLANK");
    }
    else {
        console.log("first name IS VALID");
        fNameErr = false;
    }

    if (lastName == "") {
        console.log("LAST NAME IS BLANK");
    }
    else {
        console.log("LAST name IS VALID");
        lNameErr = false;
    }

    if (phone == "") {
        console.log("PHONE IS BLANK");
    }
    else {
        var regex = /^[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;

        if (regex.test(phone) == false) {
            console.log("PHONE IS NOT VALID");
        }

        else {

            console.log("PHONE IS VALID");
            phoneErr = false;
        }
    }

    if (email == "") {
        console.log("EMAIL IS BLANK");
    }
    else {
        var regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

        if (regex.test(email) == false) {
            console.log("EMAIL IS NOT VALID");
        }

        else {

            console.log("EMAIL IS VALID");
            emailErr = false;
        }
    }

    if ((phoneErr || emailErr || fNameErr || lNameErr) == true) {
        return false;

    }

    return true;

}

/*Load all contacts (only activated when button pressed) */
function loadContacts() {
    let tmp = {
        search: "",
        userId: userId
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/GoldSearchContacts.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error) {
                    console.log(jsonObject.error);
                    return;
                }
                let text = "<table border='1'>"
                for (let i = 0; i < jsonObject.results.length; i++) {
                    ids[i] = jsonObject.results[i].ID
                    text += "<tr id='row" + i + "'>"
                    text += "<td id='first_Name" + i + "'><span>" + jsonObject.results[i].FirstName + "</span></td>";
                    text += "<td id='last_Name" + i + "'><span>" + jsonObject.results[i].LastName + "</span></td>";
                    text += "<td id='email" + i + "'><span>" + jsonObject.results[i].EmailAddress + "</span></td>";
                    text += "<td id='phone" + i + "'><span>" + jsonObject.results[i].PhoneNumber + "</span></td>";
                    text += "<td>" +
                        "<button type='button' id='edit_button" + i + "' class='w3-button w3-circle w3-lime' onclick='edit_row(" + i + ")'>" + "<span class='glyphicon glyphicon-edit'></span>" + "</button>" +
                        "<button type='button' id='save_button" + i + "' value='Save' class='w3-button w3-circle w3-lime' onclick='save_row(" + i + ")' style='display: none'>" + "<span class='glyphicon glyphicon-saved'></span>" + "</button>" +
                        "<button type='button' onclick='delete_row(" + i + ")' class='w3-button w3-circle w3-amber'>" + "<span class='glyphicon glyphicon-trash'></span> " + "</button>" + "</td>";
                    text += "<tr/>"
                }
                text += "</table>"
                document.getElementById("tbody").innerHTML = text;
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}
