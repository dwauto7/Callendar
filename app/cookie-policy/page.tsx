export default function CookiePolicyPage() {
  const brandName = "Beacon Horizons Solutions";
  const supportEmail = "dwautomate7@gmail.com";
  const phone = "(+60)1114399466";
  const lastUpdated = "March 11, 2026";
  const websiteUrl = "https://callendar-zeta.vercel.app";

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 font-sans bg-white text-[#595959]">
      <style dangerouslySetInnerHTML={{ __html: `
        .policy-container h1 { font-size: 26px; color: #000; font-weight: bold; margin-bottom: 1rem; }
        .policy-container h2 { font-size: 19px; color: #000; font-weight: bold; margin-top: 2rem; margin-bottom: 1rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem; }
        .policy-container h3 { font-size: 17px; color: #000; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.5rem; }
        .policy-container a { color: #3030F1; text-decoration: none; }
        .policy-container a:hover { text-decoration: underline; }
        .policy-container ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1rem; }
        .policy-container li { margin-bottom: 0.5rem; line-height: 1.6; }
        .policy-container p { margin-bottom: 1rem; line-height: 1.6; }
        .policy-container hr { margin: 2rem 0; border: 0; border-top: 1px solid #e2e8f0; }
        .cookie-table { width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; font-size: 13px; }
        .cookie-table th { background: #f7f7f7; text-align: left; padding: 8px 12px; border: 1px solid #ddd; font-weight: bold; color: #000; }
        .cookie-table td { padding: 8px 12px; border: 1px solid #ddd; vertical-align: top; }
        .cookie-table tr:nth-child(even) { background: #fafafa; }
      `}} />

      <div className="policy-container">
        <h1>COOKIE POLICY</h1>
        <p><strong>Last updated: {lastUpdated}</strong></p>

        <hr />

        <p>
          This Cookie Policy explains how <strong>{brandName}</strong> ("Company," "we," "us," and "our") uses cookies
          and similar technologies to recognize you when you visit our website at{" "}
          <a href={websiteUrl} target="_blank" rel="noopener noreferrer">{websiteUrl}</a> ("Website"). It explains what
          these technologies are and why we use them, as well as your rights to control our use of them.
        </p>
        <p>
          In some cases we may use cookies to collect personal information, or that becomes personal information if we
          combine it with other information.
        </p>

        <hr />

        <h2>What are cookies?</h2>
        <p>
          Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies
          are widely used by website owners in order to make their websites work, or to work more efficiently, as well as
          to provide reporting information.
        </p>
        <p>
          Cookies set by the website owner (in this case, {brandName}) are called "first-party cookies." Cookies set by
          parties other than the website owner are called "third-party cookies." Third-party cookies enable third-party
          features or functionality to be provided on or through the website (e.g., advertising, interactive content, and
          analytics). The parties that set these third-party cookies can recognize your computer both when it visits the
          website in question and also when it visits certain other websites.
        </p>

        <h2>Why do we use cookies?</h2>
        <p>
          We use first- and third-party cookies for several reasons. Some cookies are required for technical reasons in
          order for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other
          cookies also enable us to track and target the interests of our users to enhance the experience on our Online
          Properties. Third parties serve cookies through our Website for advertising, analytics, and other purposes.
        </p>

        <h2>How can I control cookies?</h2>
        <p>
          You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting
          your preferences in the Cookie Preference Center. The Cookie Preference Center allows you to select which
          categories of cookies you accept or reject. Essential cookies cannot be rejected as they are strictly necessary
          to provide you with services.
        </p>
        <p>
          If you choose to reject cookies, you may still use our Website though your access to some functionality and
          areas of our Website may be restricted. You may also set or amend your web browser controls to accept or refuse
          cookies.
        </p>

        <h2>Cookies we use</h2>

        <h3>Analytics and customization cookies</h3>
        <p>
          These cookies collect information that is used either in aggregate form to help us understand how our Website is
          being used or how effective our marketing campaigns are, or to help us customize our Website for you.
        </p>

        <table className="cookie-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Purpose</th>
              <th>Provider</th>
              <th>Service</th>
              <th>Type</th>
              <th>Expires</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>_ga</td>
              <td>Records a particular ID used to come up with data about website usage by the user</td>
              <td>.callendar.vercel.app</td>
              <td>Google Analytics</td>
              <td>http_cookie</td>
              <td>~400 days</td>
            </tr>
            <tr>
              <td>_ga_#</td>
              <td>Used to distinguish individual users by means of designation of a randomly generated number as client identifier</td>
              <td>.callendar.vercel.app</td>
              <td>Google Analytics</td>
              <td>http_cookie</td>
              <td>~400 days</td>
            </tr>
            <tr>
              <td>s7</td>
              <td>Gather data regarding site usage and user behavior on the website</td>
              <td>callendar.vercel.app</td>
              <td>Adobe Analytics</td>
              <td>html_local_storage</td>
              <td>Persistent</td>
            </tr>
          </tbody>
        </table>

        <h3>Unclassified cookies</h3>
        <p>
          These are cookies that have not yet been categorized. We are in the process of classifying these cookies with
          the help of their providers.
        </p>

        <table className="cookie-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Provider</th>
              <th>Type</th>
              <th>Expires</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>bare-mux-path</td>
              <td>callendar.vercel.app</td>
              <td>html_local_storage</td>
              <td>Persistent</td>
            </tr>
          </tbody>
        </table>

        <h2>How can I control cookies on my browser?</h2>
        <p>
          As the means by which you can refuse cookies through your web browser controls vary from browser to browser, you
          should visit your browser&apos;s help menu for more information. You can manage cookies on the most popular browsers:
        </p>
        <ul>
          <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Chrome</a></li>
          <li><a href="https://support.microsoft.com/en-us/windows/delete-and-manage-cookies" target="_blank" rel="noopener noreferrer">Internet Explorer / Edge</a></li>
          <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer">Firefox</a></li>
          <li><a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
          <li><a href="https://help.opera.com/en/latest/web-preferences/" target="_blank" rel="noopener noreferrer">Opera</a></li>
        </ul>
        <p>In addition, most advertising networks offer you a way to opt out of targeted advertising:</p>
        <ul>
          <li><a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer">Digital Advertising Alliance</a></li>
          <li><a href="https://youradchoices.ca/" target="_blank" rel="noopener noreferrer">Digital Advertising Alliance of Canada</a></li>
          <li><a href="https://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer">European Interactive Digital Advertising Alliance</a></li>
        </ul>

        <h2>What about other tracking technologies, like web beacons?</h2>
        <p>
          Cookies are not the only way to recognize or track visitors to a website. We may use other, similar technologies
          from time to time, like web beacons (sometimes called "tracking pixels" or "clear gifs"). These are tiny graphics
          files that contain a unique identifier that enables us to recognize when someone has visited our Website or opened
          an email including them.
        </p>

        <h2>Do you serve targeted advertising?</h2>
        <p>
          Third parties may serve cookies on your computer or mobile device to serve advertising through our Website. These
          companies may use information about your visits to this and other websites in order to provide relevant
          advertisements about goods and services that you may be interested in. The information collected through this
          process does not enable us or them to identify your name, contact details, or other details that directly identify
          you unless you choose to provide these.
        </p>

        <h2>How often will you update this Cookie Policy?</h2>
        <p>
          We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we
          use or for other operational, legal, or regulatory reasons. Please therefore revisit this Cookie Policy regularly
          to stay informed about our use of cookies and related technologies.
        </p>
        <p>The date at the top of this Cookie Policy indicates when it was last updated.</p>

        <h2>Where can I get further information?</h2>
        <p>
          If you have any questions about our use of cookies or other technologies, please contact us at:
        </p>
        <p>
          <strong>{brandName}</strong><br />
          Petaling Jaya, Selangor 46400<br />
          Malaysia<br />
          Phone: <a href={`tel:${phone}`}>{phone}</a><br />
          Email: <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
        </p>
      </div>
    </main>
  );
}
