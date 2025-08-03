import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Privacy = () => {
  // Auto-scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-4 pb-10 px-16 md:px-32">
      <div className="max-w-6xl mx-auto">
        <div className="card-glass">
          <h1 className="text-3xl font-bold mb-6 text-gradient">
            Privacy Policy
          </h1>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-3">Data Collection</h2>
              <p className="text-muted-foreground mb-4">
                LeetScape collects minimal data to provide you with a
                personalized experience. We use Firebase Authentication and
                Firestore to store your information securely.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  Google account information (name, email) for authentication
                </li>
                <li>Custom username you choose during sign-up</li>
                <li>Problem-solving progress (solved/bookmarked problems)</li>
                <li>Personal notes you create for each problem</li>
                <li>Usage analytics to improve the application</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">
                How We Use Your Data
              </h2>
              <p className="text-muted-foreground mb-4">
                Your data is used exclusively to provide and improve LeetScape's
                functionality:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Track your progress across different problems</li>
                <li>Display personalized statistics and achievements</li>
                <li>Save and retrieve your notes for each problem</li>
                <li>Provide a seamless authentication experience</li>
                <li>Improve application performance and user experience</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Data Security</h2>
              <p className="text-muted-foreground mb-4">
                We prioritize the security of your data:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  All data is stored securely in Firebase (Google's
                  infrastructure)
                </li>
                <li>Authentication is handled by Google's secure systems</li>
                <li>Data is encrypted in transit and at rest</li>
                <li>We never share your personal data with third parties</li>
                <li>You can delete your account and data at any time</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Your Rights</h2>
              <p className="text-muted-foreground mb-4">
                You have full control over your data:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Access all your stored data through the application</li>
                <li>Update your username and profile information</li>
                <li>Delete individual notes or problem progress</li>
                <li>Request complete account deletion</li>
                <li>Export your data for backup purposes</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">
                Contact Information
              </h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about this privacy policy or need to
                request data deletion, please contact us:
              </p>
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  <strong>Email:</strong> anuragkbhonsle@gmail.com
                </p>
                <p className="text-muted-foreground">
                  <strong>GitHub:</strong>{" "}
                  <a
                    href="https://github.com/anuragbhonsle"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @anuragbhonsle
                  </a>
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">
                Updates to This Policy
              </h2>
              <p className="text-muted-foreground">
                This privacy policy may be updated from time to time. We will
                notify users of any changes through the application or via
                email. Your continued use of LeetScape after any changes
                constitutes acceptance of the updated policy.
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Link to="/">
              <Button className="bg-primary hover:bg-primary/80">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
