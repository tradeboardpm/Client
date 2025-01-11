import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Terms and Conditions
          </CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing and using this website, you accept and agree to be
                bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
              <p>
                Permission is granted to temporarily download one copy of the
                materials (information or software) on our website for personal,
                non-commercial transitory viewing only.
              </p>
              <p className="mt-4">
                This is the grant of a license, not a transfer of title, and
                under this license you may not:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Transfer the materials to another person</li>
                <li>
                  Attempt to decompile or reverse engineer any software
                  contained on our website
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Disclaimer</h2>
              <p>
                The materials on our website are provided on an 'as is' basis.
                We make no warranties, expressed or implied, and hereby disclaim
                and negate all other warranties including, without limitation,
                implied warranties or conditions of merchantability, fitness for
                a particular purpose, or non-infringement of intellectual
                property or other violation of rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Limitations</h2>
              <p>
                In no event shall our company or its suppliers be liable for any
                damages (including, without limitation, damages for loss of data
                or profit, or due to business interruption) arising out of the
                use or inability to use the materials on our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                5. Revisions and Errata
              </h2>
              <p>
                The materials appearing on our website could include technical,
                typographical, or photographic errors. We do not warrant that
                any of the materials on our website are accurate, complete, or
                current.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Links</h2>
              <p>
                We have not reviewed all of the sites linked to our website and
                are not responsible for the contents of any such linked site.
                The inclusion of any link does not imply endorsement by us of
                the site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Governing Law</h2>
              <p>
                These terms and conditions are governed by and construed in
                accordance with the laws of your country and you irrevocably
                submit to the exclusive jurisdiction of the courts in that
                location.
              </p>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
