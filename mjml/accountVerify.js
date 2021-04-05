const mjml2html = require("mjml");

const htmlOutput = mjml2html(`<mjml owa="desktop" version="4.3.0">
  <mj-head>
    <mj-font href="https://fonts.googleapis.com/css?family=Montserrat" name="Montserrat"></mj-font>
    <mj-font href="https://fonts.googleapis.com/css?family=Raleway" name="Raleway"></mj-font>
    <mj-font href="https://fonts.googleapis.com/css?family=Open Sans" name="Open Sans"></mj-font>
    <mj-preview></mj-preview>
  </mj-head>
  <mj-body background-color="#f8f8f8" color="#797e82" font-family="Open Sans, Helvetica, Arial, sans-serif">
    <mj-section background-repeat="repeat" background-size="auto" padding-bottom="0px" padding-top="0px" padding="20px 0px 20px 0px" text-align="center" vertical-align="top">
      <mj-column>
        <mj-text align="left" color="#797e82" font-family="Open Sans, Helvetica, Arial, sans-serif" font-size="11px" line-height="22px" padding-bottom="0px" padding-top="0px" padding="0px 0px 0px 25px">
          <p style="text-align: center; margin: 10px 0;">Lorem ipsum dolor sit&nbsp;| <a target="_blank" rel="noopener noreferrer" href="#"></a><span style="color:#797e82; text-decoration: underline"> View online version</span></p>
        </mj-text>
      </mj-column>
    </mj-section>
    <mj-section background-color="#ffffff" background-repeat="repeat" padding-bottom="0px" padding-left="0px" padding-right="0px" padding-top="0px" padding="20px 0" text-align="center" vertical-align="top">
      <mj-column>
        <mj-divider border-color="#FFFFFF" border-style="solid" border-width="7px" padding-bottom="40px" padding-left="0px" padding-right="0px" padding-top="0px" padding="10px 25px" width="100%"></mj-divider>
        <mj-image align="center" alt="" border="none" href="" type="Unit" padding-bottom="0px" padding-top="0px" padding="10px 25px" src="/saas-templates-creator/static/img/mjml.png" target="_blank" title="" height="auto" width="110px"></mj-image>
      </mj-column>
    </mj-section>
    <mj-section background-color="#ffffff" background-repeat="repeat" background-size="auto" padding-bottom="0px" padding-top="0px" padding="20px 0" text-align="center" vertical-align="top">
      <mj-column>
        <mj-image align="center" alt="" border="none" height="auto" type="Unit" href="" padding-bottom="0px" padding-left="50px" padding-right="50px" padding-top="40px" padding="10px 25px" src="http://9pl9.mjt.lu/tplimg/9pl9/b/ygjj/t65lu.png" target="_blank" title="" width="300px"></mj-image>
      </mj-column>
    </mj-section>
    <mj-section background-color="#ffffff" background-repeat="repeat" background-size="auto" padding-bottom="70px" padding-top="30px" padding="20px 0px 20px 0px" text-align="center" vertical-align="top">
      <mj-column>
        <mj-text align="left" color="#797e82" font-family="Open Sans, Helvetica, Arial, sans-serif" font-size="13px" line-height="22px" padding-bottom="0px" padding-left="50px" padding-right="50px" padding-top="0px" padding="0px 25px 0px 25px">
          <h1 style="text-align:center; color: #000000; line-height:32px">You&apos;re almost there!</h1>
        </mj-text>
        <mj-text align="left" color="#797e82" font-family="Open Sans, Helvetica, Arial, sans-serif" font-size="13px" line-height="22px" padding-bottom="0px" padding-left="50px" padding-right="50px" padding-top="0px" padding="0px 25px 0px 25px">
          <p style="margin: 10px 0; text-align: center;">Hi {{name}}, Thank you for signing up to Embark.&nbsp;</p>
          <p style="margin: 10px 0; text-align: center;">To confirm your account, simply click on the button below:</p>
        </mj-text>
        <mj-button align="center" background-color="#FFFFFF" border-radius="100px" border="none" color="#222" font-family="Open Sans, Helvetica, Arial, sans-serif" font-size="13px" font-weight="normal" href="{{verifyLink}}" inner-padding="15px 25px 15px 25px" padding-bottom="20px" padding-top="20px" padding="10px 25px" text-decoration="none" text-transform="none" vertical-align="middle"><b style="font-weight:700"><b style="font-weight:700">Activate My Account</b></b></mj-button>
        <mj-text align="left" color="#797e82" font-family="Open Sans, Helvetica, Arial, sans-serif" font-size="13px" line-height="22px" padding-bottom="0px" padding-left="50px" padding-right="50px" padding-top="0px" padding="0px 25px 0px 25px">
          <p style="margin: 10px 0; text-align: center;">If the link doesn't work, copy this URL into your browser: <a target="_blank" rel="noopener noreferrer" href="{{verifyLink}}" style="color:#FFFFFF">{{verifyLink}}</a></p>
          <p style="margin: 10px 0; text-align: center;"><i style="font-style:normal"><b style="font-weight:700">Welcome!</b></i></p>
        </mj-text>
      </mj-column>
    </mj-section>
    <mj-section background-repeat="repeat" background-size="auto" padding-bottom="0px" padding-top="20px" padding="20px 0px 20px 0px" text-align="center" vertical-align="top">
      <mj-column>
        <mj-social align="center" border-radius="6px" font-family="Ubuntu, Helvetica, Arial, sans-serif" font-size="13px" icon-size="30" line-height="22px" mode="horizontal" padding-bottom="0px" padding="10px 25px" text-decoration="none" text-mode="true">
          <mj-social-element background-color="#FFFFFF" name="facebook-noshare" src="http://www.mailjet.com/saas-templates-creator/static/img/facebook_black.png"></mj-social-element>
          <mj-social-element background-color="#FFFFFF" name="twitter-noshare" src="http://www.mailjet.com/saas-templates-creator/static/img/twitter_black.png"></mj-social-element>
          <mj-social-element background-color="#FFFFFF" name="linkedin-noshare" src="http://www.mailjet.com/saas-templates-creator/static/img/linkedin_black.png"></mj-social-element>
        </mj-social>
        <mj-text align="center" color="#797e82" font-family="Open Sans, Helvetica, Arial, sans-serif" font-size="11px" line-height="22px" padding-bottom="0px" padding-top="0px" padding="0px 20px 0px 20px">
          <p style="margin: 10px 0;"><a target="_blank" rel="noopener noreferrer" style="color:#FFFFFF" href="#"><span style="color:#FFFFFF">Page 1</span></a><span style="color:#797e82">&nbsp; &nbsp;|&nbsp; &nbsp;</span><a target="_blank" rel="noopener noreferrer" style="color:#FFFFFF" href="#"><span style="color:#FFFFFF">Page 2</span></a><span style="color:#797e82">&nbsp; &nbsp;|&nbsp; &nbsp;</span><a target="_blank" rel="noopener noreferrer" style="color:#FFFFFF" href="#"><span style="color:#FFFFFF">Page 3</span></a></p>
          <p style="margin: 10px 0;">C<a target="_blank" rel="noopener noreferrer" style="color:inherit; text-decoration:none" href="[[UNSUB_LINK_EN]]">lick <span style="color:#FFFFFF"><u>here</u></span> to unsubscribe</a>.<br /><span style="font-size:10px">Created by&nbsp;</span><a target="_blank" rel="noopener noreferrer" style="font-size:10px; color:inherit; text-decoration: none" href="https://www.mailjet.com/?utm_source=saas_email_templates&amp;utm_medium=logo_footer_email&amp;utm_campaign=account_activation"><span style="color:#FFFFFF"><u>Mailjet</u></span></a></p>
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`);

module.exports = htmlOutput;
