const express = require('express');

const router = express.Router();

const authRequire = `Authentication requires that the existing user should supply ` + 
    `their username and password as basic HTTP authentication`;

const errorType = `Error message will be in <b>error</b>, optionally there could be an <b>errorData</b><br>\n`+
    `<pre>`+
    `{\n`+
    `    "error": "No such author",\n`+
    `    "errorData": {\n`+
    `        "login": "sdf"\n`+
    `    }\n`+
    `}\n`+
    `</pre>\n`;

const errorForbidden = `Without permission: Code: 403. Data: <br><pre>`+
    `{\n`+
    `   "error": "Forbidden"\n`+
    `}<br></pre>`;

const classes = [
    {
        title: "User personal info",
        resources: [
            {
                title: "Show information about me",
                url: "/me",
                method: "GET",
                auth: authRequire,
                params: "none",
                data: "none",
                success: 
                    `Code: 200<br/>Content: <pre>`+
                    `{\n`+
                    `    "login": "jano4ek_thms",\n`+
                    `    "role": 0,\n`+
                    `    "fullname": "Jason Thompson",\n`+
                    `    "email": "fax@examplle.com",\n`+
                    `    "phone": "+380333333333",\n`+
                    `    "registered": "2018-05-13T10:25:19.000Z",\n`+
                    `    "avaUrl": "https://res.cloudinary.com",\n`+
                    `    "bio": "biograph",\n`+
                    `    "isDisabled": false,\n`+
                    `    "registries": [],\n`+
                    `    "upcomingInvoices": []\n`+
                    `}</pre>`,
                error: `Without auth: Code: 401<br/>`
            }
        ]
    },
    {
        title: "Invoices",
        resources: [
            {
                title: "Show all invoices",
                url: "/invoices?limit=:limit&page=:page&query=:query&type=:type&author=:author",
                method: "GET",
                auth: authRequire + `<br><i>Admin can see all invoices, standarts users - only theirs</i>`,
                params: "You can use some options to filter:<br><b>page</b> - show requested page from request. default: 1."+
                    "<br><b>limit</b> - how much invoices will view on page. default: 4"+
                    "<br>search options: <b>type</b> - type of searh (num | description | location), <b>query</b> - search query<br>"+
                    "option for admin: <b>author</b> - login of a user to filter invoices by it",
                data: "none",
                success: "In success there will be all info in <b>data</b> and requested params. <b>totalCount</b> - number of all invoices, <b>totalPages</b> - number of all pages<b><br>Data:<pre>"+
                `{\n`+
                `    "data": [\n`+
                `        {\n`+
                `            "number": 528095,\n`+
                `            "recipient": "jano4ek_thms",\n`+
                `            "description": "furniture",\n`+
                `            "departure": "2018-10-11T00:00:00.000Z",\n`+
                `            "arrival": "2018-10-15T00:00:00.000Z",\n`+
                `            "location": "Kyiv",\n`+
                `            "weight": 37.51,\n`+
                `            "cost": 2423.79,\n`+
                `            "photoPath": "https://res.cloudinary.com",\n`+
                `            "registry": 16399,\n`+
                `            "links": [  ]\n`+
                `        }\n`+
                `    ],\n`+
                `    "limit": 1,\n`+
                `    "page": 1,\n`+
                `    "totalCount": 17,\n`+
                `    "totalPages": 17,\n`+
                `    "links": []\n`+
                `}`,
                error: "Without auth: Code: 401<br/>"+ errorForbidden + errorType + "Also other codes as 400, 500 with <b>error</b> in body"
            },
            {
                title: "Show invoice by number",
                url: "/invoices/:number",
                method: "GET",
                auth: authRequire + `<br><i>Admin can see all invoices, standarts users - created by them and as a recipient</i>`,
                params: "<b>number</b> - number of invoice",
                data: "none",
                success: "In success there will be all info in <b>data</b>. <br>Data:<pre>\n"+
`{
    "data": {
        "number": 528096,
        "recipient": "white_stripes",
        "description": "cabel",
        "departure": "2018-11-07T00:00:00.000Z",
        "arrival": "2018-11-11T00:00:00.000Z",
        "location": "NYC",
        "weight": 0.643,
        "cost": 1245.39,
        "photoPath": "https://res.cloudinary.com/",
        "registry": 16400,
        "sender": "jano4ek_thms"
    },
    "links": [
        {
            "rel": "udpate self",
            "method": "PUT",
            "href": "/api/v1/invoices/528096"
        }
    ]
}`,
                error: "Without auth: Code: 401<br/>"+ errorForbidden + errorType + "Also other codes as 400, 500 with <b>error</b> in body"
            },
            {
                title: "Create invoice",
                url: "/invoices",
                method: "POST",
                auth: authRequire + `<br><i>Admin can create invoice in all registries, standarts users - in their owns</i>`,
                params: "none",
                data: `<pre>{
    "description": "some decsr",
    "registryNum":  16403,
    "recipientLogin": "a_krava",
    "departure": "12.12.2018",
    "location": "kyiv",
    "weight": 23.43,
    "cost": 345.5,
    "photoUrl": "/some/url/path.png"
}</pre>`,
                success: "In success there will be code 201, and created invoice in <b>data</b>. <br>Data:<pre>\n"+
`{
    "data": {
        "number": 528162,
        "recipient": "a_krava",
        "description": "some decsr",
        "departure": "2018-12-11T22:00:00.000Z",
        "arrival": "2018-12-15T22:00:00.000Z",
        "location": "kyiv",
        "weight": 23.43,
        "cost": 345.5,
        "photoPath": "/some/url/path.png"
    },
    "links": [{
        "rel": "self",
        "method": "GET",
        "href": "/api/v1/invoices/528162"
    }]
}`,
                error: "Without auth: Code: 401<br/>"+ errorForbidden + errorType + "Also other codes as 400, 500 with <b>error</b> in body"
            },
            {
                title: "Update invoice",
                url: "/invoices/:number",
                method: "PUT",
                auth: authRequire + `<br><i>Admin can edit invoice in all registries, standarts users - in their owns</i>`,
                params: "<b>number</b> - number of invoice",
                data: `Some fields, which you want to update in invoice. Example:<br><pre>
{
    "description": "some decsr",
    "cost": 345.5,
    "photoUrl": "/some/url/path.png"
}</pre>`,
                success: "In success there will be code 200 (OK), and updated invoice in <b>data</b>. <br>Data:<pre>\n"+
`{
    "data": {
        "number": 528162,
        "recipient": "a_krava",
        "description": "some decsr",
        "departure": "2018-12-11T22:00:00.000Z",
        "arrival": "2018-12-15T22:00:00.000Z",
        "location": "kyiv",
        "weight": 23.43,
        "cost": 345.5,
        "photoPath": "/some/url/path.png"
    },
    "links": []
}`,
                error: "Without auth: Code: 401<br/>"+ errorForbidden + errorType + "Also other codes as 400, 500 with <b>error</b> in body"
            },
            {
                title: "Delete invoice",
                url: "/invoices/:number",
                method: "DELETE",
                auth: authRequire + `<br><i>Admin can delete invoice in all registries, standarts users - in their owns</i>`,
                params: "<b>number</b> - number of invoice",
                data: `none`,
                success: "In success there will be code 204 and empty body",
                error: "Without auth: Code: 401<br/>"+ errorForbidden + errorType + "Also other codes as 400, 500 with <b>error</b> in body"
            }
        ]
    },
    {
        title: "Registries",
        resources: [
            {
                title: "Show all registries",
                url: "/registries?limit=:limit&page=:page&query=:query&author=:author",
                method: "GET",
                auth: authRequire + `<br><i>Admin can see all registries, standarts users - only theirs</i>`,
                params: "You can use some options to filter:<br><b>page</b> - show requested page from request. default: 1."+
                    "<br><b>limit</b> - how much invoices will view on page. default: 4"+
                    "<br><b>query</b> - search query<br>"  +
                    "option for admin: <b>author</b> - login of a user to filter registries by it",
                data: "none",
                success: "In success there will be all info in <b>data</b> and requested params. <b>totalCount</b> - number of all registries, <b>totalPages</b> - number of all pages<b><br>Data:<pre>"+
`{
    "data": [
        {
            "name": "work",
            "number": 16400,
            "description": "just for work staff",
            "created": "2018-11-02T23:17:42.899Z",
            "user": "jano4ek_thms",
            "invoices": [
                528096,
                528114
            ],
            "links": []
        }
    ],
    "limit": 4,
    "page": 1,
    "totalCount": 4,
    "totalPages": 1,
    "links": [
        {
            "rel": "create registry",
            "method": "POST",
            "href": "/api/v1/registries/"
        }
    ]
}`,
                error: "Without auth: Code: 401<br/>"+ errorForbidden + errorType + "Also other codes as 400, 500 with <b>error</b> in body"
            },
            {
                title: "Show registry by number",
                url: "/registries/:number",
                method: "GET",
                auth: authRequire + `<br><i>Admin can see all registries, standarts users - created by them</i>`,
                params: "<b>number</b> - number of registry",
                data: "none",
                success: "In success there will be all info in <b>data</b>. <br>Data:<pre>\n"+
`{
    "data": {
        "name": "cards",
        "number": 16407,
        "description": "just for fan",
        "created": "2018-11-02T23:56:32.703Z",
        "user": "jano4ek_thms",
        "invoices": [
            528124
        ]
    },
    "links": [
        {
            "rel": "udpate self",
            "method": "PUT",
            "href": "/api/v1/registries/16407"
        }
    ]
}`,
                error: "Without auth: Code: 401<br/>"+ errorForbidden + errorType + "Also other codes as 400, 500 with <b>error</b> in body"
            },
            {
                title: "Create registry",
                url: "/registries",
                method: "POST",
                auth: authRequire + `<br><i>Admin can create registry for all users, standarts users - for themselves</i>`,
                params: "none",
                data: `<pre>{
    "userLogin": "jano4ek_thms",
    "description": "description",
    "name": "Name here"
}</pre>`,
                success: "In success there will be code 201, and created registry in <b>data</b>. <br>Data:<pre>\n"+
`{
    "data": {
        "name": "some",
        "number": 16445,
        "description": "hmmmmmm",
        "created": "2018-11-16T23:41:20.836Z",
        "user": "jano4ek_thms",
        "invoices": []
    },
    "links": [
        {
            "rel": "self",
            "method": "GET",
            "href": "/api/v1/registries/16445"
        }
    ]
}`,
                error: "Without auth: Code: 401<br/>"+ errorForbidden + errorType + "Also other codes as 400, 500 with <b>error</b> in body"
            },
            {
                title: "Update registry",
                url: "/registries/:number",
                method: "PUT",
                auth: authRequire + `<br><i>Admin can edit registy for all users, standarts users - their owns</i>`,
                params: "<b>number</b> - number of registry",
                data: `Some fields, which you want to update in registry.<br><b>Attention!</b> Standart users are fobirdden to set the field <i>userLogin</i>. Example:<br><pre>
{
    "description": "some decsr"
}</pre>`,
                success: "In success there will be code 200 (OK), and updated registry in <b>data</b>. <br>Data:<pre>\n"+
`{
    "data": {
        "name": "SOME NAME",
        "number": 16400,
        "description": "some sdata",
        "created": "2018-11-02T23:17:42.899Z",
        "user": "jano4ek_thms",
        "invoices": [
            528096,
            528114
        ]
    },
    "links": []
}`,
                error: "Without auth: Code: 401<br/>"+ errorForbidden + errorType + "Also other codes as 400, 500 with <b>error</b> in body"
            },
            {
                title: "Delete registry",
                url: "/registries/:number",
                method: "DELETE",
                auth: authRequire + `<br><i>Admin can delete registry of all users, standarts users - their owns</i>`,
                params: "<b>number</b> - number of registry",
                data: `none`,
                success: "In success there will be code 204 and empty body",
                error: "Without auth: Code: 401<br/>"+ errorForbidden + errorType + "Also other codes as 400, 500 with <b>error</b> in body"
            }
        ]
    },
    {
        title: "Users",
        resources: [
            {
                title: "Show all users",
                url: "/users?limit=:limit&page=:page",
                method: "GET",
                auth: authRequire + `<br><b>Standart users are fobirdden to see all users</b>`,
                params: "You can use some options to filter:<br><b>page</b> - show requested page from request. default: 1."+
                    "<br><b>limit</b> - how much invoices will view on page. default: 4",
                data: "none",
                success: "In success there will be all info in <b>data</b> and requested params. <b>totalCount</b> - number of all registries, <b>totalPages</b> - number of all pages<b><br>Data:<pre>"+
`{
    "data": [
        {
            "login": "sevenArmy2013",
            "role": 1,
            "fullname": "John Doe",
            "email": "hr@startup.org",
            "phone": "+380444444444",
            "registered": "2018-09-19T10:05:19.000Z",
            "avaUrl": "https://res.cloudinary.com",
            "bio": "Видатний ....",
            "isDisabled": false,
            "registries": [
                16399
            ],
            "upcomingInvoices": [
                528097,
                528124
            ],
            "links": []
        }
    ],
    "limit": 1,
    "page": 1,
    "totalCount": 6,
    "totalPages": 6,
    "links": []
}`,
                error: "Without auth: Code: 401<br/>"+ errorForbidden + errorType + "Also other codes as 400, 500 with <b>error</b> in body"
            },
            {
                title: "Show user by login",
                url: "/users/:login",
                method: "GET",
                auth: authRequire + `<br><i>Only Admin can see profile of all users</i>`,
                params: "<b>login</b> - user login",
                data: "none",
                success: "In success there will be all info in <b>data</b>. <br>Data:<pre>\n"+
`{
    "data": {
        "login": "white_stripes",
        "role": 1,
        "fullname": "Meg White",
        "email": "sample@site.ua",
        "phone": "+380222222222",
        "registered": "2016-01-18T14:09:39.000Z",
        "avaUrl": "https://res.cloudinary.com/",
        "bio": "...",
        "isDisabled": false,
        "registries": [
            {
                "name": "aliexpress",
                "number": 16401,
                "description": "orders from online shopping",
                "created": "2018-11-02T23:22:06.509Z",
                "invoices": []
            }
        ],
        "upcomingInvoices": [
            {
                "number": 528102,
                "description": "skateX board",
                "departure": "2018-06-06T00:00:00.000Z",
                "arrival": "2018-06-10T00:00:00.000Z",
                "location": "Kyiv",
                "weight": 3634,
                "cost": 463.46,
                "photoPath": "https://res.cloudinary.com"
            }
        ]
    },
    "links": []
}`,
                error: "Without auth: Code: 401<br/>"+ errorForbidden + errorType + "Also other codes as 400, 500 with <b>error</b> in body"
            },
            {
                title: "Create user",
                url: "/users",
                method: "POST",
                auth: "none",
                params: "none",
                data: `<i>Fields <b>avaUrl</b> and <b>bio</b> are not required</i>. User role: standart<pre>{
    "login": "TUTs",
    "pasw": "12345678",
    "fullname": "name person",
    "email": "tut@true.com",
    "phone": "+380000000000",
    "avaUrl": "im.png",
    "bio": "bios...."
}</pre>`,
                success: "In success there will be code 201, and created user in <b>data</b>. <br>Data:<pre>\n"+
`{
    "data": {
        "login": "some_login",
        "role": 0,
        "fullname": "name person",
        "email": "tut@true.com",
        "phone": "+380000000000",
        "registered": "2018-11-17T01:13:01.906Z",
        "avaUrl": "/images/userpic.png",
        "bio": "text here",
        "isDisabled": false,
        "registries": [],
        "upcomingInvoices": []
    },
    "links": [
        {
            "rel": "self",
            "method": "GET",
            "href": "/api/v1/me"
        }
    ]
}`,
                error: "Without auth: Code: 401<br/>"+ errorForbidden + errorType + "Also other codes as 400, 500 with <b>error</b> in body"
            },
            {
                title: "Update user",
                url: "/users/:login",
                method: "PUT",
                auth: authRequire + `<br>All users can edit only personal profile. <i>Only admin can edit role for all users (except of himself)</i>`,
                params: "<b>login</b> - user login",
                data: `Bio and avaUrl are not required.<br>Login couldn't be changed.<br>Some fields, which you want to update in your profile. Example:<br><pre>
{
    "fullname": "A Krava",
    "bio": "hmmm"
}</pre>`,
                success: "In success there will be code 200 (OK), and updated profile in <b>data</b>. <br>Data:<pre>\n"+
`{
    "data": {
        "login": "a_krava",
        "role": 0,
        "fullname": "A Krava",
        "email": "sdfs@sdfsdfsdf.sdfsd",
        "phone": "+380000456780",
        "registered": "2018-11-12T19:54:12.266Z",
        "avaUrl": "https://res.cloudinary.com",
        "bio": "hmmm",
        "isDisabled": false,
        "registries": [],
        "upcomingInvoices": []
    }
}`,
                error: "Without auth: Code: 401<br/>"+ errorForbidden + errorType + "Also other codes as 400, 500 with <b>error</b> in body"
            },
            {
                title: "Delete user",
                url: "/users/:login",
                method: "DELETE",
                auth: authRequire + `<br><i>Admin can delete everyone (except of himself), standarts users - only themselves</i>`,
                params: "<b>login</b> - user login",
                data: `none`,
                success: "In success there will be code 204 and empty body",
                error: "Without auth: Code: 401<br/>"+ errorForbidden + errorType + "Also other codes as 400, 500 with <b>error</b> in body"
            }
        ]
    }
];

router.get('/', (req, res) => {
    res.render('developer', {
        title: "REST API v1 documentation",
        breadcrumbs: [{text: 'API v1 documentation'}],
        classes
    });
});

module.exports = router;