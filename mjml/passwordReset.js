const mjml2html = require("mjml");

const htmlOutput = mjml2html(`<mjml>
  <mj-body background-color="#f8f8f8" color="#797e82" font-family="Open Sans, Helvetica, Arial, sans-serif">
    <mj-section background-color="#ffffff" background-repeat="repeat" padding-bottom="0px" padding-left="0px" padding-right="0px" padding-top="0px" padding="20px 0" text-align="center" vertical-align="top">
    </mj-section>
    <mj-section background-color="#ffffff" background-repeat="repeat" background-size="auto" padding-bottom="0px" padding-top="0px" padding="20px 0" text-align="center" vertical-align="top">
      <mj-column>
        <mj-image align="center" alt="" type="Unit" border="none" height="auto" href="" padding-bottom="0px" padding-left="50px" padding-right="50px" padding-top="40px" padding="10px 25px" src="http://9pl9.mjt.lu/tplimg/9pl9/b/yvys/t65sr.png" target="_blank" title="" width="300px"></mj-image>
      </mj-column>
    </mj-section>
    <mj-section background-color="#ffffff" background-repeat="repeat" background-size="auto" padding-bottom="70px" padding-top="30px" padding="20px 0px 20px 0px" text-align="center" vertical-align="top">
      <mj-column>
        <mj-text align="left" color="#797e82" font-family="Open Sans, Helvetica, Arial, sans-serif" font-size="13px" line-height="22px" padding-bottom="0px" padding-left="50px" padding-right="50px" padding-top="0px" padding="0px 25px 0px 25px">
          <h1 style="text-align:center; color: #000000; line-height:32px">Forgot your password?</h1>
        </mj-text>
        <mj-text align="left" color="#797e82" font-family="Open Sans, Helvetica, Arial, sans-serif" font-size="13px" line-height="22px" padding-bottom="0px" padding-left="50px" padding-right="50px" padding-top="0px" padding="0px 25px 0px 25px">
          <p style="margin: 10px 0; text-align: center;">Not to worry, let&apos;s get you a new one.</p>
        </mj-text>
        <mj-button align="center" background-color="#FFFFFF" border-radius="100px" border="none" color="#222" font-family="Open Sans, Helvetica, Arial, sans-serif" font-size="13px" font-weight="normal" href="{{resetLink}}" inner-padding="15px 25px 15px 25px" padding-bottom="10px" padding-top="20px" padding="10px 25px" text-decoration="none" text-transform="none" vertical-align="middle"><b style="font-weight:700"><b style="font-weight:700">Reset password</b></b></mj-button>
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
          <p style="margin: 10px 0;">C<a target="_blank" rel="noopener noreferrer" style="color:inherit; text-decoration:none" href="[[UNSUB_LINK_EN]]">lick <span style="color:#FFFFFF"><u>here</u></span> to unsubscribe</a>.<br /><span style="font-size:10px">Created by&nbsp;</span><a target="_blank" rel="noopener noreferrer" style="font-size:10px; color:inherit; text-decoration: none" href="https://www.mailjet.com/?utm_source=saas_email_templates&amp;utm_medium=logo_footer_email&amp;utm_campaign=password_reset"><span style="color:#FFFFFF"><u>Mailjet</u></span></a></p>
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`);

module.exports = htmlOutput;
