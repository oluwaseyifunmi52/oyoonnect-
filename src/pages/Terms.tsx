import { Link } from 'react-router-dom'
import { SectionHeading } from '../components/ui/SectionHeading'
import { siteConfig } from '../config/site'

export function Terms() {
  return (
    <main className="page">
      <div className="container container--narrow">
        <SectionHeading
          eyebrow="Legal"
          title="Terms & Conditions"
          subtitle="Agreements for using OyoConnect"
        />

        <div className="legal-section">
          <h3>Account Usage</h3>
          <p>
            By accessing and using OyoConnect, you agree to comply with these terms of
            service. Users must be at least 18 years old to use the platform.
          </p>

          <h3>Business Listings</h3>
          <p>
            All business listings must be accurate and truthful. OyoConnect reserves the
            right to remove any listing that violates these terms or contains false
            information.
          </p>

          <h3>User Responsibilities</h3>
          <p>
            Users are responsible for maintaining the security of their accounts and for
            all activities that occur under their account. You must notify OyoConnect
            immediately of any unauthorized use of your account.
          </p>

          <h3>Community Content</h3>
          <p>
            Content posted by users on OyoConnect is the responsibility of such users.
            OyoConnect does not claim ownership of user-generated content. However, by
            posting content, you grant OyoConnect a license to use, modify, and display
            such content on the platform.
          </p>

          <h3>Payments & Wallet/VTU Services</h3>
          <p>
            All transactions on OyoConnect are processed securely. Platform fees and
            payment processing fees apply to all contributions and transactions. Refunds,
            where applicable, are processed according to the platform's policy.
          </p>

          <h3>Prohibited Activities</h3>
          <p>
            The following activities are prohibited on OyoConnect: fraudulent listings,
            scams, unauthorized commercial use, transmission of viruses or malicious
            code, reverse engineering, or any action that interferes with the
            platform's functionality.
          </p>

          <h3>Account Suspension</h3>
          <p>
            OyoConnect reserves the right to suspend or terminate accounts that violate
            these terms, engage in prohibited activities, or misuse the platform.
          </p>

          <h3>Intellectual Property</h3>
          <p>
            OyoConnect's logo, branding, and original content are protected by
            intellectual property laws. Users may not use OyoConnect's trademarks without
            prior written consent.
          </p>

          <h3>Third-Party Services</h3>
          <p>
            OyoConnect may integrate with third-party payment providers and services.
            Use of such services is subject to their own terms and conditions.
          </p>

          <h3>Limitation of Liability</h3>
          <p>
            OyoConnect is not liable for any indirect, incidental, or consequential
            damages arising from the use of the platform or inability to access the
            platform.
          </p>

          <h3>Changes to Terms</h3>
          <p>
            OyoConnect may update these terms from time to time. Users are responsible
            for reviewing the terms periodically. Continued use of the platform constitutes
            acceptance of any changes.
          </p>

          <h3>Contact Information</h3>
          <p>
            For questions about these terms, contact OyoConnect at
            <strong>oyoconnect5@gmail.com</strong> or <strong>+234 816 670 9577</strong>.
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

export default Terms