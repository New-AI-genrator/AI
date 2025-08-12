import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - AI Tools Directory',
  description: 'Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicy() {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="prose max-w-none">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
      <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      
      <section className="mb-8">
        <p className="mb-4">
          Welcome to AI Tools Directory. We respect your privacy and are committed to protecting your personal data. 
          This privacy policy will inform you about how we look after your personal data when you visit our website 
          and tell you about your privacy rights and how the law protects you.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Information We Collect</h2>
        <p className="mb-4">We may collect, use, store, and transfer different kinds of personal data about you, including:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Identity Data:</strong> First name, last name, username, or similar identifier.</li>
          <li><strong>Contact Data:</strong> Email address.</li>
          <li><strong>Technical Data:</strong> Internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
          <li><strong>Usage Data:</strong> Information about how you use our website, products, and services.</li>
          <li><strong>Marketing and Communications Data:</strong> Your preferences in receiving marketing from us and our third parties and your communication preferences.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. How We Use Your Data</h2>
        <p className="mb-4">We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>To register you as a new user.</li>
          <li>To manage our relationship with you.</li>
          <li>To administer and protect our business and this website (including troubleshooting, data analysis, testing, system maintenance, support, reporting, and hosting of data).</li>
          <li>To deliver relevant website content and advertisements to you.</li>
          <li>To use data analytics to improve our website, products/services, marketing, customer relationships, and experiences.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Data Security</h2>
        <p className="mb-4">
          We have implemented appropriate security measures to prevent your personal data from being accidentally lost, 
          used, or accessed in an unauthorized way, altered, or disclosed. We limit access to your personal data to 
          those employees, agents, contractors, and other third parties who have a business need to know.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Your Legal Rights</h2>
        <p className="mb-4">Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Request access to your personal data.</li>
          <li>Request correction of your personal data.</li>
          <li>Request erasure of your personal data.</li>
          <li>Object to processing of your personal data.</li>
          <li>Request restriction of processing your personal data.</li>
          <li>Request transfer of your personal data.</li>
          <li>Right to withdraw consent.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Third-Party Links</h2>
        <p className="mb-4">
          This website may include links to third-party websites, plug-ins, and applications. Clicking on those links 
          or enabling those connections may allow third parties to collect or share data about you. We do not control 
          these third-party websites and are not responsible for their privacy statements.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Cookies</h2>
        <p className="mb-4">
          Our website uses cookies to distinguish you from other users of our website. This helps us to provide you 
          with a good experience when you browse our website and also allows us to improve our site.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Changes to This Privacy Policy</h2>
        <p className="mb-4">
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
          Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <p className="mb-2">Email: privacy@aitoolsdirectory.com</p>
        <p>Mailing Address: [Your Company Address]</p>
      </section>
    </div>
  );
}
