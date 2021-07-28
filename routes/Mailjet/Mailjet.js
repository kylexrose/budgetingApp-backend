const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {createTempId, deleteTempId} = require('../tempIds/Controller/tempIdController')
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
          "HTMLPart":`<h3>Hey ${req.body.firstName}, please click <a href=
              ${process.env.BASE_URL + "/reset-password" + `?token=${jwtToken}`}>here</a> to reset your password.</h3>`,
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