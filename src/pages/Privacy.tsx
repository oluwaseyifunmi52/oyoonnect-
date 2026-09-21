import { Link } from 'react-router-dom'
import { SectionHeading } from '../components/ui/SectionHeading'
import { siteConfig } from '../config/site'

export function Privacy() {
  return (
    <main className="page">
      <div className="container container--narrow">
        <SectionHeading
          eyebrow="Legal"
          title="Privacy Policy"
          subtitle="How OyoConnect handles your information"
        />

        <div className="legal-section">
          <h3>Information Collected</h3>
          <p>
            OyoConnect collects information that users provide on the platform,
            including account information (name, email, phone number), business
            information (business name, category, location), and transaction
            information for wallet and VTU services.
          </p>

          <h3>Account Information</h3>
          <p>
            When you create an account, OyoCollect collects your name, email address,
            and phone number. This information is used to create and manage your account.
          </p>

          <h3>Business Information</h3>
          <p>
            Businesses that register on OyoConnect provide business name, category,
            location, contact details, and description. This information is visible to
            other users on the platform.
          </p>

          <h3>Device/Browser Information</h3>
          <p>
            OyoConnect automatically collects certain information about the device and
            browser you use to access the platform, including IP address, browser type,
            operating system, and page visit patterns.
          </p>

          <h3>Location Information</h3>
          <p>
            If you enable location services, OyoConnect may use your location to provide
            relevant local business listings and services. Location information is used
            to improve the relevance of search results and recommendations.
          </p>

          <h3>Transaction Information</h3>
          <p>
            For wallet and VTU services, OyoConnect collects transaction information
            including amounts, dates, service providers, and payment references. This
            information is used to process transactions and maintain transaction history.
          </p>

          <h3>How Information Is Used</h3>
          <p>
            OyoConnect uses collected information to: provide and maintain the platform,
            improve user experience, process transactions, send administrative
            communications, and analyze how the platform is used.
          </p>

          <h3>Data Sharing</h3>
          <p>
            OyoConnect does not sell user data to third parties. Information may be
            shared with: payment service providers for transaction processing, service
            providers for platform operations, and authorities when required by law or
            for fraud prevention.
          </p>

          <h3>Payment Providers</h3>
          <p>
            Transaction information may be shared with payment service providers
            (including Paystack and other approved providers) solely for the purpose of
            processing payments and detecting fraud.
          </p>

          <h3>Cookies & Storage</h3>
          <p>
            OyoConnect uses cookies and similar tracking technologies to enhance user
            experience, analyze platform usage, and deliver targeted content. Users can
            manage cookie preferences through their browser settings.
          </p>

          <h3>Data Security</h3>
          <p>
            OyoConnect employs reasonable security measures to protect user information.
            However, no transmission over the internet or electronic storage is 100%
            secure, and OyoConnect cannot guarantee absolute security.
          </p>

          <h3>Data Retention</h3>
          <p>
            OyoConnect retains user data for as long as the account is active or as
            needed to provide the service, comply with legal obligations, resolve
            disputes, and enforce agreements.
          </p>

          <h3>User Rights</h3>
          <p>
            Users may request access to their personal data, request correction of
            inaccurate data, request deletion of their account and data, and opt out of
            certain data processing activities.
          </p>

          <h3>Account/Data Deletion</h3>
          <p>
            Users may request account deletion by contacting OyoConnect at
            <strong>oyoconnect5@gmail.com</strong>. Account deletion is irreversible and
            will remove all associated data from the platform, though some records may
            be retained for legal compliance purposes.
          </p>
        </div>

        <div className="legal-footer">
          <p>&copy; {new Date().getFullYear()} OyoConnect. All rights reserved.</p>
          <p>Oyo State, Nigeria</p>
        </div>
      </div>
    </main>
  )
}

export default Privacy