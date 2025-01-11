import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                1. Information We Collect
              </h2>
              <p>
                We collect information that you provide directly to us,
                information we obtain automatically when you visit our website,
                and information from other sources.
              </p>
              <h3 className="text-xl font-semibold mt-4 mb-2">
                Personal Information
              </h3>
              <p>
                When you use our services, we may collect the following types of
                information:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Name and contact information</li>
                <li>Account credentials</li>
                <li>Payment information</li>
                <li>Communication preferences</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                2. How We Use Your Information
              </h2>
              <p>
                We use the information we collect for various purposes,
                including:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Providing and maintaining our services</li>
                <li>Processing your transactions</li>
                <li>Sending you marketing communications</li>
                <li>Improving our services</li>
                <li>Detecting and preventing fraud</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                3. Information Sharing
              </h2>
              <p>We may share your information with:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Service providers and business partners</li>
                <li>Legal authorities when required by law</li>
                <li>Other parties with your consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures
                to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
              <p>
                You have certain rights regarding your personal information,
                including:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Right to access your personal information</li>
                <li>Right to correct inaccurate information</li>
                <li>Right to request deletion of your information</li>
                <li>Right to object to processing</li>
                <li>Right to data portability</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                6. Cookies and Tracking
              </h2>
              <p>
                We use cookies and similar tracking technologies to collect
                information about your browsing activities on our website. You
                can control cookies through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us at:
                <br />
                Email: privacy@example.com
                <br />
                Address: [Your Company Address]
              </p>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
