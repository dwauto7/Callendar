export default function PrivacyPolicyPage() {
  const brandName = "Beacon Horizons Solutions";
  const doingBusinessAs = "Beacon Horizons";
  const supportEmail = "dwautomate7@gmail.com";
  const adminEmail = "admin@beaconhorizons.com";
  const lastUpdated = "March 11, 2026";
  const siteUrl = "https://callendar-zeta.vercel.app/";
  const dsarUrl = "https://app.termly.io/dsar/6284c694-5dc1-457f-923b-4533ad8f0a3f";

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 font-sans bg-white text-[#595959]">
      <style dangerouslySetInnerHTML={{ __html: `
        .policy-container h1 { font-size: 26px; color: #000; font-weight: bold; margin-bottom: 1rem; }
        .policy-container h2 { font-size: 19px; color: #000; font-weight: bold; margin-top: 2rem; margin-bottom: 1rem; text-transform: uppercase; border-bottom: 1px solid #eee; padding-bottom: 0.5rem; }
        .policy-container h3 { font-size: 17px; color: #000; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.5rem; }
        .policy-container a { color: #3030F1; text-decoration: none; }
        .policy-container a:hover { text-decoration: underline; }
        .policy-container ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1rem; }
        .policy-container ol { list-style-type: decimal; margin-left: 1.5rem; margin-bottom: 1rem; }
        .policy-container li { margin-bottom: 0.5rem; line-height: 1.6; }
        .policy-container p { margin-bottom: 1rem; line-height: 1.6; }
        .policy-container hr { margin: 2rem 0; border: 0; border-top: 1px solid #e2e8f0; }
      `}} />

      <div className="policy-container">
        <h1>PRIVACY POLICY</h1>
        <p><strong>Last updated: {lastUpdated}</strong></p>

        <hr />

        <p>
          This Privacy Notice for <strong>{brandName}</strong> (doing business as <strong>{doingBusinessAs}</strong>)
          ("<strong>we</strong>," "<strong>us</strong>," or "<strong>our</strong>"), describes how and why we might access,
          collect, store, use, and/or share ("<strong>process</strong>") your personal information when you use our
          services ("<strong>Services</strong>"), including when you:
        </p>
        <ul>
          <li>Visit our website at <a href={siteUrl} target="_blank" rel="noopener noreferrer">{siteUrl}</a> or any website of ours that links to this Privacy Notice</li>
          <li>Engage with us in other related ways, including any marketing or events</li>
        </ul>
        <p>
          <strong>Questions or concerns?</strong> Reading this Privacy Notice will help you understand your privacy rights
          and choices. We are responsible for making decisions about how your personal information is processed. If you do
          not agree with our policies and practices, please do not use our Services. If you still have any questions or
          concerns, please contact us at <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.
        </p>

        <hr />

        <h2>SUMMARY OF KEY POINTS</h2>
        <p>
          This summary provides key points from our Privacy Notice. You can find more details about any of these topics
          by using our table of contents below.
        </p>
        <p><strong>What personal information do we process?</strong> When you visit, use, or navigate our Services, we may
          process personal information depending on how you interact with us and the Services, the choices you make, and
          the products and features you use.</p>
        <p><strong>Do we process any sensitive personal information?</strong> We do not process sensitive personal information.</p>
        <p><strong>Do we collect any information from third parties?</strong> We do not collect any information from third parties.</p>
        <p><strong>How do we process your information?</strong> We process your information to provide, improve, and
          administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We
          may also process your information for other purposes with your consent.</p>
        <p><strong>In what situations and with which parties do we share personal information?</strong> We may share
          information in specific situations and with specific third parties.</p>
        <p><strong>How do we keep your information safe?</strong> We have adequate organizational and technical processes
          and procedures in place to protect your personal information. However, no electronic transmission over the
          internet or information storage technology can be guaranteed to be 100% secure.</p>
        <p><strong>What are your rights?</strong> Depending on where you are located geographically, the applicable
          privacy law may mean you have certain rights regarding your personal information.</p>
        <p><strong>How do you exercise your rights?</strong> The easiest way to exercise your rights is by submitting a{" "}
          <a href={dsarUrl} target="_blank" rel="noopener noreferrer">data subject access request</a>, or by contacting
          us. We will consider and act upon any request in accordance with applicable data protection laws.</p>

        <hr />

        <h2 id="toc">TABLE OF CONTENTS</h2>
        <ol>
          <li><a href="#infocollect">WHAT INFORMATION DO WE COLLECT?</a></li>
          <li><a href="#infouse">HOW DO WE PROCESS YOUR INFORMATION?</a></li>
          <li><a href="#whoshare">WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</a></li>
          <li><a href="#cookies">DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</a></li>
          <li><a href="#ai">DO WE OFFER ARTIFICIAL INTELLIGENCE-BASED PRODUCTS?</a></li>
          <li><a href="#sociallogins">HOW DO WE HANDLE YOUR SOCIAL LOGINS?</a></li>
          <li><a href="#inforetain">HOW LONG DO WE KEEP YOUR INFORMATION?</a></li>
          <li><a href="#infosafe">HOW DO WE KEEP YOUR INFORMATION SAFE?</a></li>
          <li><a href="#infominors">DO WE COLLECT INFORMATION FROM MINORS?</a></li>
          <li><a href="#privacyrights">WHAT ARE YOUR PRIVACY RIGHTS?</a></li>
          <li><a href="#DNT">CONTROLS FOR DO-NOT-TRACK FEATURES</a></li>
          <li><a href="#policyupdates">DO WE MAKE UPDATES TO THIS NOTICE?</a></li>
          <li><a href="#contact">HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</a></li>
          <li><a href="#request">HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</a></li>
        </ol>

        <hr />

        <section id="infocollect">
          <h2>1. WHAT INFORMATION DO WE COLLECT?</h2>
          <h3>Personal information you disclose to us</h3>
          <p><em><strong>In Short:</strong> We collect personal information that you provide to us.</em></p>
          <p>
            We collect personal information that you voluntarily provide to us when you register on the Services, express
            an interest in obtaining information about us or our products and Services, when you participate in activities
            on the Services, or otherwise when you contact us.
          </p>
          <p><strong>Personal Information Provided by You.</strong> The personal information we collect may include:</p>
          <ul>
            <li>Names</li>
            <li>Phone numbers</li>
            <li>Email addresses</li>
            <li>Passwords</li>
            <li>Usernames</li>
            <li>Contact preferences</li>
            <li>Contact or authentication data</li>
          </ul>
          <p><strong>Sensitive Information.</strong> We do not process sensitive information.</p>
          <p>
            <strong>Social Media Login Data.</strong> We may provide you with the option to register with us using your
            existing social media account details, like your Facebook, X, or other social media account. If you choose to
            register in this way, we will collect certain profile information about you from the social media provider, as
            described in the section called{" "}
            <a href="#sociallogins">"HOW DO WE HANDLE YOUR SOCIAL LOGINS?"</a> below.
          </p>
          <p>
            All personal information that you provide to us must be true, complete, and accurate, and you must notify us
            of any changes to such personal information.
          </p>

          <h3>Information automatically collected</h3>
          <p>
            <em><strong>In Short:</strong> Some information — such as your Internet Protocol (IP) address and/or browser
            and device characteristics — is collected automatically when you visit our Services.</em>
          </p>
          <p>
            We automatically collect certain information when you visit, use, or navigate the Services. This information
            does not reveal your specific identity but may include device and usage information, such as your IP address,
            browser and device characteristics, operating system, language preferences, referring URLs, device name,
            country, location, information about how and when you use our Services, and other technical information.
          </p>
          <p>
            Like many businesses, we also collect information through cookies and similar technologies. You can find out
            more about this in our Cookie Notice:{" "}
            <a href="/cookie-policy">Cookie Policy</a>.
          </p>
          <p>The information we collect includes:</p>
          <ul>
            <li>
              <strong>Log and Usage Data.</strong> Log and usage data is service-related, diagnostic, usage, and
              performance information our servers automatically collect when you access or use our Services. This may
              include your IP address, device information, browser type, and settings and information about your activity
              in the Services.
            </li>
            <li>
              <strong>Device Data.</strong> We collect device data such as information about your computer, phone, tablet,
              or other device you use to access the Services, including your IP address, device and application
              identification numbers, location, browser type, hardware model, Internet service provider, operating system,
              and system configuration information.
            </li>
          </ul>

          <h3>Google API</h3>
          <p>
            Our use of information received from Google APIs will adhere to{" "}
            <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer">
              Google API Services User Data Policy
            </a>
            , including the{" "}
            <a href="https://developers.google.com/terms/api-services-user-data-policy#limited-use" target="_blank" rel="noopener noreferrer">
              Limited Use requirements
            </a>.
          </p>
        </section>

        <section id="infouse">
          <h2>2. HOW DO WE PROCESS YOUR INFORMATION?</h2>
          <p>
            <em><strong>In Short:</strong> We process your information to provide, improve, and administer our Services,
            communicate with you, for security and fraud prevention, and to comply with law. We may also process your
            information for other purposes with your consent.</em>
          </p>
          <p>We process your personal information for a variety of reasons, including:</p>
          <ul>
            <li><strong>To facilitate account creation and authentication and otherwise manage user accounts.</strong></li>
            <li><strong>To deliver and facilitate delivery of services to the user.</strong></li>
            <li><strong>To respond to user inquiries/offer support to users.</strong></li>
            <li><strong>To send administrative information to you.</strong> Including details about our products and services, changes to our terms and policies.</li>
            <li><strong>To request feedback.</strong> We may process your information to request feedback and to contact you about your use of our Services.</li>
            <li><strong>To send you marketing and promotional communications.</strong> You can opt out of our marketing emails at any time.</li>
            <li><strong>To protect our Services.</strong> Including fraud monitoring and prevention.</li>
            <li><strong>To evaluate and improve our Services, products, marketing, and your experience.</strong></li>
            <li><strong>To identify usage trends.</strong> To better understand how our Services are being used.</li>
            <li><strong>To comply with our legal obligations.</strong> Including responding to legal requests and exercising our legal rights.</li>
          </ul>
        </section>

        <section id="whoshare">
          <h2>3. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</h2>
          <p>
            <em><strong>In Short:</strong> We may share information in specific situations described in this section
            and/or with the following third parties.</em>
          </p>
          <p>
            We may share your data with third-party vendors, service providers, contractors, or agents who perform
            services for us or on our behalf. The third parties we may share personal information with include:
          </p>
          <ul>
            <li><strong>Advertising &amp; Lead Generation:</strong> Google AdSense</li>
            <li><strong>AI Service Providers:</strong> OpenAI</li>
            <li><strong>Third-Party Account Connections:</strong> Google account</li>
            <li><strong>Cloud Computing:</strong> Google Cloud Platform</li>
            <li><strong>Communications:</strong> Twilio</li>
            <li><strong>Data Backup &amp; Security:</strong> Google Drive Backup</li>
            <li><strong>Infrastructure Optimization:</strong> Termly.io and Google Cloud Storage</li>
            <li><strong>Invoice &amp; Billing:</strong> Stripe</li>
            <li><strong>Social Media &amp; Advertising:</strong> Instagram, Twitter, and Facebook advertising</li>
            <li><strong>User Authentication:</strong> Google Sign-In</li>
            <li><strong>Web Analytics:</strong> Google Analytics</li>
            <li><strong>Performance Monitoring:</strong> Sentry</li>
            <li><strong>AI Voice Agent:</strong> Retell AI</li>
            <li><strong>Workflow Automation:</strong> n8n.io</li>
            <li><strong>Database &amp; Authentication:</strong> Supabase</li>
            <li><strong>Web Hosting:</strong> Vercel</li>
          </ul>
          <p>
            We also may need to share your personal information in connection with any merger, sale of company assets,
            financing, or acquisition of all or a portion of our business to another company.
          </p>
        </section>

        <section id="cookies">
          <h2>4. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</h2>
          <p>
            <em><strong>In Short:</strong> We may use cookies and other tracking technologies to collect and store your information.</em>
          </p>
          <p>
            We may use cookies and similar tracking technologies (like web beacons and pixels) to gather information when
            you interact with our Services. Some online tracking technologies help us maintain the security of our
            Services and your account, prevent crashes, fix bugs, save your preferences, and assist with basic site
            functions.
          </p>
          <p>
            Specific information about how we use such technologies and how you can refuse certain cookies is set out in
            our <a href="/cookie-policy">Cookie Policy</a>.
          </p>
        </section>

        <section id="ai">
          <h2>5. DO WE OFFER ARTIFICIAL INTELLIGENCE-BASED PRODUCTS?</h2>
          <p>
            <em><strong>In Short:</strong> We offer products, features, or tools powered by artificial intelligence,
            machine learning, or similar technologies.</em>
          </p>
          <p>
            As part of our Services, we offer products, features, or tools powered by artificial intelligence, machine
            learning, or similar technologies (collectively, "AI Products"). These tools are designed to enhance your
            experience and provide you with innovative solutions.
          </p>
          <h3>Use of AI Technologies</h3>
          <p>
            We provide the AI Products through third-party service providers ("AI Service Providers"), including
            ElevenLabs, Cartesia, Deepgram, Google Cloud AI, and OpenAI. Your input, output, and personal information
            will be shared with and processed by these AI Service Providers. You must not use the AI Products in any way
            that violates the terms or policies of any AI Service Provider.
          </p>
          <h3>Our AI Products</h3>
          <p>Our AI Products are designed for the following functions:</p>
          <ul>
            <li>AI automation</li>
            <li>AI deployment</li>
            <li>AI applications</li>
          </ul>
          <h3>How We Process Your Data Using AI</h3>
          <p>
            All personal information processed using our AI Products is handled in line with our Privacy Notice and our
            agreement with third parties. This ensures high security and safeguards your personal information throughout
            the process.
          </p>
          <h3>How to Opt Out</h3>
          <p>To opt out, you can contact us using the contact information provided in this notice.</p>
        </section>

        <section id="sociallogins">
          <h2>6. HOW DO WE HANDLE YOUR SOCIAL LOGINS?</h2>
          <p>
            <em><strong>In Short:</strong> If you choose to register or log in to our Services using a social media
            account, we may have access to certain information about you.</em>
          </p>
          <p>
            Our Services offer you the ability to register and log in using your third-party social media account details
            (like your Facebook or X logins). Where you choose to do this, we will receive certain profile information
            about you from your social media provider, including your name, email address, friends list, and profile
            picture, as well as other information you choose to make public.
          </p>
          <p>
            We will use the information we receive only for the purposes described in this Privacy Notice. We recommend
            that you review the privacy notice of any social media provider to understand how they collect, use, and share
            your personal information.
          </p>
        </section>

        <section id="inforetain">
          <h2>7. HOW LONG DO WE KEEP YOUR INFORMATION?</h2>
          <p>
            <em><strong>In Short:</strong> We keep your information for as long as necessary to fulfill the purposes
            outlined in this Privacy Notice unless otherwise required by law.</em>
          </p>
          <p>
            We will only keep your personal information for as long as it is necessary for the purposes set out in this
            Privacy Notice, unless a longer retention period is required or permitted by law. No purpose in this notice
            will require us keeping your personal information for longer than the period of time in which users have an
            account with us.
          </p>
          <p>
            When we have no ongoing legitimate business need to process your personal information, we will either delete
            or anonymize such information, or securely store your personal information and isolate it from any further
            processing until deletion is possible.
          </p>
        </section>

        <section id="infosafe">
          <h2>8. HOW DO WE KEEP YOUR INFORMATION SAFE?</h2>
          <p>
            <em><strong>In Short:</strong> We aim to protect your personal information through a system of organizational
            and technical security measures.</em>
          </p>
          <p>
            We have implemented appropriate and reasonable technical and organizational security measures designed to
            protect the security of any personal information we process. However, despite our safeguards and efforts to
            secure your information, no electronic transmission over the Internet or information storage technology can be
            guaranteed to be 100% secure. You should only access the Services within a secure environment.
          </p>
        </section>

        <section id="infominors">
          <h2>9. DO WE COLLECT INFORMATION FROM MINORS?</h2>
          <p>
            <em><strong>In Short:</strong> We do not knowingly collect data from or market to children under 18 years of age.</em>
          </p>
          <p>
            We do not knowingly collect, solicit data from, or market to children under 18 years of age, nor do we
            knowingly sell such personal information. By using the Services, you represent that you are at least 18 or
            that you are the parent or guardian of such a minor and consent to such minor dependent&apos;s use of the
            Services. If you become aware of any data we may have collected from children under age 18, please contact us
            at <a href={`mailto:${adminEmail}`}>{adminEmail}</a>.
          </p>
        </section>

        <section id="privacyrights">
          <h2>10. WHAT ARE YOUR PRIVACY RIGHTS?</h2>
          <p>
            <em><strong>In Short:</strong> You may review, change, or terminate your account at any time, depending on
            your country, province, or state of residence.</em>
          </p>
          <p>
            <strong><u>Withdrawing your consent:</u></strong> If we are relying on your consent to process your personal
            information, you have the right to withdraw your consent at any time by contacting us using the contact
            details provided in the section{" "}
            <a href="#contact">"HOW CAN YOU CONTACT US ABOUT THIS NOTICE?"</a> below.
          </p>
          <p>
            <strong><u>Opting out of marketing and promotional communications:</u></strong> You can unsubscribe from our
            marketing and promotional communications at any time by clicking on the unsubscribe link in the emails that
            we send, or by contacting us. You will then be removed from the marketing lists. However, we may still
            communicate with you for service-related or administrative purposes.
          </p>
          <h3>Account Information</h3>
          <p>If you would at any time like to review or change the information in your account or terminate your account, you can:</p>
          <ul>
            <li>Log in to your account settings and update your user account.</li>
          </ul>
          <p>
            Upon your request to terminate your account, we will deactivate or delete your account and information from
            our active databases. However, we may retain some information in our files to prevent fraud, troubleshoot
            problems, assist with any investigations, enforce our legal terms and/or comply with applicable legal
            requirements.
          </p>
          <p>
            <strong><u>Cookies and similar technologies:</u></strong> Most web browsers are set to accept cookies by
            default. If you prefer, you can choose to set your browser to remove cookies and to reject cookies. For
            further information, please see our <a href="/cookie-policy">Cookie Policy</a>.
          </p>
          <p>
            If you have questions or comments about your privacy rights, you may email us at{" "}
            <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.
          </p>
        </section>

        <section id="DNT">
          <h2>11. CONTROLS FOR DO-NOT-TRACK FEATURES</h2>
          <p>
            Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ("DNT")
            feature or setting you can activate to signal your privacy preference not to have data about your online
            browsing activities monitored and collected. At this stage, no uniform technology standard for recognizing
            and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals
            or any other mechanism that automatically communicates your choice not to be tracked online. If a standard
            for online tracking is adopted that we must follow in the future, we will inform you about that practice in a
            revised version of this Privacy Notice.
          </p>
        </section>

        <section id="policyupdates">
          <h2>12. DO WE MAKE UPDATES TO THIS NOTICE?</h2>
          <p>
            <em><strong>In Short:</strong> Yes, we will update this notice as necessary to stay compliant with relevant laws.</em>
          </p>
          <p>
            We may update this Privacy Notice from time to time. The updated version will be indicated by an updated
            "Revised" date at the top of this Privacy Notice. If we make material changes to this Privacy Notice, we may
            notify you either by prominently posting a notice of such changes or by directly sending you a notification.
            We encourage you to review this Privacy Notice frequently to be informed of how we are protecting your
            information.
          </p>
        </section>

        <section id="contact">
          <h2>13. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</h2>
          <p>
            If you have questions or comments about this notice, you may email us at{" "}
            <a href={`mailto:${adminEmail}`}>{adminEmail}</a> or contact us by post at:
          </p>
          <p>
            <strong>{brandName}</strong><br />
            Petaling Jaya, Selangor 46400<br />
            Malaysia
          </p>
        </section>

        <section id="request">
          <h2>14. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</h2>
          <p>
            Based on the applicable laws of your country, you may have the right to request access to the personal
            information we collect from you, details about how we have processed it, correct inaccuracies, or delete your
            personal information. You may also have the right to withdraw your consent to our processing of your personal
            information. These rights may be limited in some circumstances by applicable law. To request to review,
            update, or delete your personal information, please fill out and submit a{" "}
            <a href={dsarUrl} target="_blank" rel="noopener noreferrer">data subject access request</a>.
          </p>
        </section>

      </div>
    </main>
  );
}
