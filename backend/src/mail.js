const sgMail = require('@sendgrid/mail');
const http = require('https');

const options = {
  method: 'GET',
  hostname: 'api.sendgrid.com',
  port: null,
  path: '/v3/templates/d-daeddbe44cfd45a9806de02f4a3555e4',
  headers: {
    authorization:
      'Bearer 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'
  }
};

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const makeANiceEmail = text => `
  <div className="email style="
    border: 1px solid black;
    padding: 20px;
    font-family: sans-serif;
    line-height: 2;
    font-size: 20px;
  ">
    <h2>Hello there!!</h2>
    <p>${text}</p>
  </div>
`;

exports.makeANiceEmail = makeANiceEmail;
exports.sgMail = sgMail;
exports.options = options;
