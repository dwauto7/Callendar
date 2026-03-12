export default function TermsOfServicePage() {
  const brandName = "Beacon Horizons Solutions";
  const doingBusinessAs = "Beacon Horizons";
  const supportEmail = "dwautomate7@gmail.com";
  const phone = "(+60)1114399466";
  const lastUpdated = "March 11, 2026";
  const privacyPolicyUrl = "https://callendar-zeta.vercel.app/privacy-policy";
  const siteUrl = "https://callendar-zeta.vercel.app/";

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 font-sans bg-white text-[#595959]">
      <style dangerouslySetInnerHTML={{ __html: `
        .policy-container h1 { font-size: 26px; color: #000; font-weight: bold; margin-bottom: 1rem; }
        .policy-container h2 { font-size: 19px; color: #000; font-weight: bold; margin-top: 2rem; margin-bottom: 1rem; text-transform: uppercase; border-bottom: 1px solid #eee; padding-bottom: 0.5rem; }
        .policy-container h3 { font-size: 17px; color: #000; font-weight: bold; margin-top: 1.5rem; }
        .policy-container a { color: #3030F1; text-decoration: none; }
        .policy-container a:hover { text-decoration: underline; }
        .policy-container ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1rem; }
        .policy-container ol { list-style-type: decimal; margin-left: 1.5rem; margin-bottom: 1rem; }
        .policy-container li { margin-bottom: 0.5rem; line-height: 1.6; }
        .policy-container p { margin-bottom: 1rem; line-height: 1.6; }
        .policy-container hr { margin: 2rem 0; border: 0; border-top: 1px solid #e2e8f0; }
        .policy-container .uppercase-block { text-transform: uppercase; font-size: 13px; line-height: 1.7; }
      `}} />

      <div className="policy-container">
        <h1>TERMS OF SERVICE</h1>
        <p><strong>Last updated: {lastUpdated}</strong></p>

        <hr />

        <section className="my-8">
          <h2>AGREEMENT TO OUR LEGAL TERMS</h2>
          <p>
            We are <strong>{brandName}</strong>, doing business as <strong>{doingBusinessAs}</strong> ("Company," "we," "us," "our"),
            a company registered in Malaysia at Petaling Jaya, Selangor 46400.
          </p>
          <p>
            We operate the website <a href={siteUrl} target="_blank" rel="noopener noreferrer">{siteUrl}</a> (the "Site"),
            as well as any other related products and services that refer or link to these legal terms (the "Legal Terms")
            (collectively, the "Services").
          </p>
          <p>
            Callendar is an AI-powered voice receptionist platform designed for healthcare clinics in Malaysia. The platform enables
            dental and chiropractic clinics to automate phone-based appointment booking, rescheduling, and cancellations using
            artificial intelligence, available 24 hours a day, 7 days a week. Clinic owners access a real-time dashboard to monitor
            bookings, call activity, and patient interactions. The platform integrates with Google Calendar and delivers instant
            WhatsApp notifications to clinic staff upon successful bookings.
          </p>
          <p>
            You can contact us by phone at <strong>{phone}</strong>, email at{" "}
            <a href={`mailto:${supportEmail}`}>{supportEmail}</a>, or by mail to Petaling Jaya, Selangor 46400, Malaysia.
          </p>
          <p>
            These Legal Terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you"),
            and {brandName}, concerning your access to and use of the Services. You agree that by accessing the Services, you have read,
            understood, and agreed to be bound by all of these Legal Terms.{" "}
            <strong>IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES
            AND YOU MUST DISCONTINUE USE IMMEDIATELY.</strong>
          </p>
          <p>
            We will provide you with prior notice of any scheduled changes to the Services you are using. The modified Legal Terms
            will become effective upon posting or notifying you by email. By continuing to use the Services after the effective date
            of any changes, you agree to be bound by the modified terms.
          </p>
          <p>
            The Services are intended for users who are at least 18 years old. Persons under the age of 18 are not permitted to use
            or register for the Services.
          </p>
        </section>

        <hr />

        <h2 id="toc">TABLE OF CONTENTS</h2>
        <ol>
          <li><a href="#services">OUR SERVICES</a></li>
          <li><a href="#ip">INTELLECTUAL PROPERTY RIGHTS</a></li>
          <li><a href="#representations">USER REPRESENTATIONS</a></li>
          <li><a href="#registration">USER REGISTRATION</a></li>
          <li><a href="#payment">PURCHASES AND PAYMENT</a></li>
          <li><a href="#subscriptions">SUBSCRIPTIONS</a></li>
          <li><a href="#prohibited">PROHIBITED ACTIVITIES</a></li>
          <li><a href="#ugc">USER GENERATED CONTRIBUTIONS</a></li>
          <li><a href="#license">CONTRIBUTION LICENSE</a></li>
          <li><a href="#thirdparty">THIRD-PARTY WEBSITES AND CONTENT</a></li>
          <li><a href="#management">SERVICES MANAGEMENT</a></li>
          <li><a href="#privacy">PRIVACY POLICY</a></li>
          <li><a href="#termination">TERM AND TERMINATION</a></li>
          <li><a href="#modifications">MODIFICATIONS AND INTERRUPTIONS</a></li>
          <li><a href="#law">GOVERNING LAW</a></li>
          <li><a href="#disputes">DISPUTE RESOLUTION</a></li>
          <li><a href="#corrections">CORRECTIONS</a></li>
          <li><a href="#disclaimer">DISCLAIMER</a></li>
          <li><a href="#liability">LIMITATIONS OF LIABILITY</a></li>
          <li><a href="#indemnification">INDEMNIFICATION</a></li>
          <li><a href="#userdata">USER DATA</a></li>
          <li><a href="#electronic">ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES</a></li>
          <li><a href="#misc">MISCELLANEOUS</a></li>
          <li><a href="#contact">CONTACT US</a></li>
        </ol>

        <hr />

        <section id="services">
          <h2>1. OUR SERVICES</h2>
          <p>
            The information provided when using the Services is not intended for distribution to or use by any person or entity in
            any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject
            us to any registration requirement within such jurisdiction or country. Accordingly, those persons who choose to access
            the Services from other locations do so on their own initiative and are solely responsible for compliance with local laws,
            if and to the extent local laws are applicable.
          </p>
        </section>

        <section id="ip">
          <h2>2. INTELLECTUAL PROPERTY RIGHTS</h2>
          <h3>Our intellectual property</h3>
          <p>
            We are the owner or the licensee of all intellectual property rights in our Services, including all source code,
            databases, functionality, software, website designs, audio, video, text, photographs, and graphics in the Services
            (collectively, the "Content"), as well as the trademarks, service marks, and logos contained therein (the "Marks").
          </p>
          <p>
            Our Content and Marks are protected by copyright and trademark laws and treaties around the world. The Content and Marks
            are provided in or through the Services "AS IS" for your internal business purpose only.
          </p>
          <h3>Your use of our Services</h3>
          <p>
            Subject to your compliance with these Legal Terms, we grant you a non-exclusive, non-transferable, revocable license to
            access the Services and download or print a copy of any portion of the Content to which you have properly gained access,
            solely for your internal business purpose.
          </p>
          <p>
            Except as set out in this section, no part of the Services and no Content or Marks may be copied, reproduced, aggregated,
            republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or
            otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.
          </p>
          <p>
            Any breach of these Intellectual Property Rights will constitute a material breach of our Legal Terms and your right to
            use our Services will terminate immediately.
          </p>
          <h3>Your submissions</h3>
          <p>
            By directly sending us any question, comment, suggestion, idea, feedback, or other information about the Services
            ("Submissions"), you agree to assign to us all intellectual property rights in such Submission. You agree that we shall
            own this Submission and be entitled to its unrestricted use and dissemination for any lawful purpose, commercial or
            otherwise, without acknowledgment or compensation to you.
          </p>
        </section>

        <section id="representations">
          <h2>3. USER REPRESENTATIONS</h2>
          <p>By using the Services, you represent and warrant that:</p>
          <ul>
            <li>All registration information you submit will be true, accurate, current, and complete.</li>
            <li>You will maintain the accuracy of such information and promptly update it as necessary.</li>
            <li>You have the legal capacity and you agree to comply with these Legal Terms.</li>
            <li>You are not a minor in the jurisdiction in which you reside.</li>
            <li>You will not access the Services through automated or non-human means, whether through a bot, script, or otherwise.</li>
            <li>You will not use the Services for any illegal or unauthorized purpose.</li>
            <li>Your use of the Services will not violate any applicable law or regulation.</li>
          </ul>
        </section>

        <section id="registration">
          <h2>4. USER REGISTRATION</h2>
          <p>
            You may be required to register to use the Services. You agree to keep your password confidential and will be responsible
            for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we
            determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.
          </p>
        </section>

        <section id="payment">
          <h2>5. PURCHASES AND PAYMENT</h2>
          <p>We accept the following forms of payment:</p>
          <ul>
            <li>Bank Transfer</li>
          </ul>
          <p>
            You agree to provide current, complete, and accurate purchase and account information for all purchases made via the
            Services. All payments shall be in <strong>Malaysian Ringgit (MYR)</strong>. We may change prices at any time. We reserve
            the right to correct any errors or mistakes in pricing, even if we have already requested or received payment.
          </p>
        </section>

        <section id="subscriptions">
          <h2>6. SUBSCRIPTIONS</h2>
          <h3>Billing and Renewal</h3>
          <p>
            Your subscription will continue and automatically renew unless canceled. The length of your billing cycle is monthly.
          </p>
          <h3>Cancellation</h3>
          <p>
            <strong>All purchases are non-refundable.</strong> You can cancel your subscription at any time by logging into your
            account. Your cancellation will take effect at the end of the current paid term. If you have any questions or are
            unsatisfied with our Services, please email us at <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.
          </p>
          <h3>Fee Changes</h3>
          <p>
            We may, from time to time, make changes to the subscription fee and will communicate any price changes to you in
            accordance with applicable law.
          </p>
        </section>

        <section id="prohibited">
          <h2>7. PROHIBITED ACTIVITIES</h2>
          <p>
            You may not access or use the Services for any purpose other than that for which we make the Services available.
            As a user of the Services, you agree not to:
          </p>
          <ul>
            <li>Systematically retrieve data or other content from the Services to create or compile a collection, compilation, database, or directory without written permission.</li>
            <li>Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information.</li>
            <li>Circumvent, disable, or otherwise interfere with security-related features of the Services.</li>
            <li>Disparage, tarnish, or otherwise harm us and/or the Services.</li>
            <li>Use any information obtained from the Services to harass, abuse, or harm another person.</li>
            <li>Make improper use of our support services or submit false reports of abuse or misconduct.</li>
            <li>Use the Services in a manner inconsistent with any applicable laws or regulations.</li>
            <li>Upload or transmit viruses, Trojan horses, or other malicious material.</li>
            <li>Engage in any automated use of the system, such as scripts, data mining, robots, or similar tools.</li>
            <li>Attempt to impersonate another user or person.</li>
            <li>Interfere with, disrupt, or create an undue burden on the Services.</li>
            <li>Decipher, decompile, disassemble, or reverse engineer any of the software comprising the Services.</li>
            <li>Use the Services to advertise or offer to sell goods and services.</li>
            <li>Sell or otherwise transfer your profile.</li>
            <li>Attempt to extract source code or copy the Services&apos; software.</li>
            <li>Use the Services as part of any effort to compete with us.</li>
          </ul>
        </section>

        <section id="ugc">
          <h2>8. USER GENERATED CONTRIBUTIONS</h2>
          <p>
            The Services does not currently offer users the ability to submit or post public content. However, we may provide
            you with the opportunity to create, submit, or transmit content and materials to us or on the Services. When you
            create or make available any Contributions, you represent and warrant that your Contributions are accurate, lawful,
            non-defamatory, and do not violate any third party&apos;s rights or applicable law.
          </p>
        </section>

        <section id="license">
          <h2>9. CONTRIBUTION LICENSE</h2>
          <p>
            By submitting suggestions or other feedback regarding the Services, you agree that we can use and share such feedback
            for any purpose without compensation to you. You retain full ownership of all of your Contributions and any intellectual
            property rights associated with your Contributions.
          </p>
        </section>

        <section id="thirdparty">
          <h2>10. THIRD-PARTY WEBSITES AND CONTENT</h2>
          <p>
            The Services may contain links to other websites ("Third-Party Websites") as well as content belonging to or originating
            from third parties ("Third-Party Content"). We are not responsible for any Third-Party Websites or Third-Party Content.
            Inclusion of, linking to, or permitting the use of any Third-Party Websites or content does not imply approval or
            endorsement thereof by us.
          </p>
        </section>

        <section id="management">
          <h2>11. SERVICES MANAGEMENT</h2>
          <p>
            We reserve the right, but not the obligation, to: (1) monitor the Services for violations of these Legal Terms;
            (2) take appropriate legal action against anyone who violates the law or these Legal Terms; (3) refuse, restrict access
            to, limit the availability of, or disable any of your Contributions; and (4) otherwise manage the Services in a manner
            designed to protect our rights and property.
          </p>
        </section>

        <section id="privacy">
          <h2>12. PRIVACY POLICY</h2>
          <p>
            We care about data privacy and security. Please review our Privacy Policy:{" "}
            <a href={privacyPolicyUrl} target="_blank" rel="noopener noreferrer">{privacyPolicyUrl}</a>. By using the Services,
            you agree to be bound by our Privacy Policy, which is incorporated into these Legal Terms.
          </p>
        </section>

        <section id="termination">
          <h2>13. TERM AND TERMINATION</h2>
          <p>
            These Legal Terms shall remain in full force and effect while you use the Services. We reserve the right to deny access
            to and use of the Services to any person for any reason, including breach of any representation, warranty, or covenant
            contained in these Legal Terms. We may terminate your account at any time, without warning, in our sole discretion.
          </p>
          <p>
            If we terminate or suspend your account for any reason, you are prohibited from registering and creating a new account
            under your name, a fake or borrowed name, or the name of any third party.
          </p>
        </section>

        <section id="modifications">
          <h2>14. MODIFICATIONS AND INTERRUPTIONS</h2>
          <p>
            We reserve the right to change, modify, or remove the contents of the Services at any time or for any reason at our
            sole discretion without notice. We cannot guarantee the Services will be available at all times. We shall have no
            liability for any loss, damage, or inconvenience caused by your inability to access or use the Services during any
            downtime or discontinuance.
          </p>
        </section>

        <section id="law">
          <h2>15. GOVERNING LAW</h2>
          <p>
            These Legal Terms shall be governed by and defined following the laws of <strong>Malaysia</strong>. {brandName} and
            yourself irrevocably consent that the courts of Malaysia shall have exclusive jurisdiction to resolve any dispute which
            may arise in connection with these Legal Terms.
          </p>
        </section>

        <section id="disputes">
          <h2>16. DISPUTE RESOLUTION</h2>
          <h3>Informal Negotiations</h3>
          <p>
            The Parties agree to first attempt to negotiate any Dispute informally for at least <strong>thirty (30) days</strong>{" "}
            before initiating arbitration. Such informal negotiations commence upon written notice from one Party to the other Party.
          </p>
          <h3>Binding Arbitration</h3>
          <p>
            Any dispute arising out of or in connection with these Legal Terms shall be referred to and finally resolved by
            arbitration. The seat of arbitration shall be <strong>Petaling Jaya, Malaysia</strong>. The language of the proceedings
            shall be English. The governing law shall be the substantive law of Malaysia.
          </p>
          <h3>Restrictions</h3>
          <p>
            Any arbitration shall be limited to the Dispute between the Parties individually. No arbitration shall be joined with
            any other proceeding, and there is no right or authority for any Dispute to be arbitrated on a class-action basis.
          </p>
        </section>

        <section id="corrections">
          <h2>17. CORRECTIONS</h2>
          <p>
            There may be information on the Services that contains typographical errors, inaccuracies, or omissions. We reserve
            the right to correct any errors, inaccuracies, or omissions and to change or update the information on the Services
            at any time, without prior notice.
          </p>
        </section>

        <section id="disclaimer">
          <h2>18. DISCLAIMER</h2>
          <p className="uppercase-block">
            THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SERVICES WILL BE AT YOUR
            SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING THE IMPLIED
            WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE MAKE NO WARRANTIES OR
            REPRESENTATIONS ABOUT THE ACCURACY OR COMPLETENESS OF THE SERVICES&apos; CONTENT AND WE WILL ASSUME NO LIABILITY OR
            RESPONSIBILITY FOR ANY ERRORS, MISTAKES, OR INACCURACIES OF CONTENT AND MATERIALS.
          </p>
        </section>

        <section id="liability">
          <h2>19. LIMITATIONS OF LIABILITY</h2>
          <p className="uppercase-block">
            IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT,
            INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE,
            LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE SERVICES. NOTWITHSTANDING ANYTHING TO THE CONTRARY
            CONTAINED HEREIN, OUR LIABILITY TO YOU FOR ANY CAUSE WHATSOEVER WILL AT ALL TIMES BE LIMITED TO THE AMOUNT PAID,
            IF ANY, BY YOU TO US DURING THE SIX (6) MONTH PERIOD PRIOR TO ANY CAUSE OF ACTION ARISING.
          </p>
        </section>

        <section id="indemnification">
          <h2>20. INDEMNIFICATION</h2>
          <p>
            You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all of our respective
            officers, agents, partners, and employees, from and against any loss, damage, liability, claim, or demand, including
            reasonable attorneys&apos; fees and expenses, made by any third party due to or arising out of: (1) use of the Services;
            (2) breach of these Legal Terms; (3) any breach of your representations and warranties set forth in these Legal Terms;
            or (4) your violation of the rights of a third party, including intellectual property rights.
          </p>
        </section>

        <section id="userdata">
          <h2>21. USER DATA</h2>
          <p>
            We will maintain certain data that you transmit to the Services for the purpose of managing the performance of the
            Services. Although we perform regular routine backups of data, you are solely responsible for all data that you transmit
            or that relates to any activity you have undertaken using the Services. We shall have no liability to you for any loss
            or corruption of any such data.
          </p>
        </section>

        <section id="electronic">
          <h2>22. ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES</h2>
          <p>
            Visiting the Services, sending us emails, and completing online forms constitute electronic communications. You consent
            to receive electronic communications, and you agree that all agreements, notices, disclosures, and other communications
            we provide to you electronically satisfy any legal requirement that such communication be in writing.
          </p>
        </section>

        <section id="misc">
          <h2>23. MISCELLANEOUS</h2>
          <p>
            These Legal Terms and any policies or operating rules posted by us on the Services constitute the entire agreement and
            understanding between you and us. Our failure to exercise or enforce any right or provision of these Legal Terms shall
            not operate as a waiver of such right or provision. If any provision of these Legal Terms is determined to be unlawful,
            void, or unenforceable, that provision is deemed severable and does not affect the validity of any remaining provisions.
          </p>
        </section>

        <section id="contact">
          <h2>24. CONTACT US</h2>
          <p>In order to resolve a complaint regarding the Services or to receive further information, please contact us at:</p>
          <p>
            <strong>{brandName}</strong><br />
            Petaling Jaya, Selangor 46400<br />
            Malaysia<br />
            Phone: <a href={`tel:${phone}`}>{phone}</a><br />
            Email: <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
          </p>
        </section>
      </div>
    </main>
  );
}
