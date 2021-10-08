const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {createTempId, deleteTempId} = require('../tempIds/Controller/tempIdController')

let BASE_URL = process.env.NODE_ENV === "development" 
? "http://localhost:3000" 
: "brutalbudget.kylexrose.com"

const mailjet = require ('node-mailjet')
    .connect(
        process.env.MAILJET_API, 
        process.env.MAILJET_SECRET_KEY
        )



router.post("/reset-password", createTempId, (req, res, next)=>{
    let jwtToken = jwt.sign(
        {
            _id : res.locals.tempId
        },
        process.env.PRIVATE_JWT_KEY_RESET,
        {
            expiresIn: "30m",
        }
    );

    const request = mailjet.post("send", {'version': 'v3.1'})
    .request({
      "Messages":[
        {
          "From": {
            "Email": "kyle.rose@codeimmersives.com",
            "Name": "Brutal Budget"
          },
          "To": [
            {
              "Email": `${req.body.email}`,
              "Name": `${req.body.firstName} ${req.body.lastName}`
            }
          ],
          "Subject": "Brutal Budget Password Reset",
          "TextPart": "",
          "HTMLPart":`
          <div style="background-image: linear-gradient(to bottom right,#f3d2b5,#f2b8a3);
          height: 100%;
          margin: 0%;
          background-repeat: no-repeat;
          background-attachment: fixed;">
        
      <div className="navbar" style="background-color: #f28c8f}, height: 75px,
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: white;">
                      <div className="menuIcon">
                          <img src={menu} alt=""/>
                      </div>
                      <Link to="/overview" className="logoContainer" style="display: flex;
          align-items: center;
          justify-content: center;
          width: 300px;">
            
                          <p style="font-size: 20pt;">Brutal Budget.</p>
                      </Link>
                      <div className="right-side-nav">
                      </div>
                  </div>
                  <h3>Hey ${req.body.firstName}, please click <a href=
                    ${BASE_URL + "/reset-password" + `?token=${jwtToken}`}>here</a> to reset your password.</h3>
      </div>`,
          "CustomID": "AppGettingStartedTest"
        }
      ]
    })
    request
      .then((result) => {
        console.log(result.body);
      })
      .catch((err) => {
        console.log(err.statusCode)
      })
    res.json({message: "email sent"})
})
        
module.exports = router