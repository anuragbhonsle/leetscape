import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Github, Mail, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Feedback = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "",
    message: "",
  });

  // Auto-scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.message.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter your feedback message.",
        variant: "destructive",
      });
      return;
    }

    // Create email content
    const subject = `LeetScape Feedback: ${
      formData.type || "General Feedback"
    }`;
    const body = `
Name: ${formData.name || "Not provided"}
Email: ${formData.email || "Not provided"}
Type: ${formData.type || "General Feedback"}

Message:
${formData.message}

---
Sent from LeetScape Feedback Form
    `.trim();

    // Open email client with pre-filled content
    const mailtoLink = `mailto:anuragkbhonsle@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);

    // Show success message
    toast({
      title: "Feedback Sent!",
      description:
        "Your email client should open with the feedback pre-filled. If it doesn't, please email us directly.",
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      type: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen pt-4 pb-10 px-16 md:px-32">
      <div className="max-w-6xl mx-auto">
        <div className="card-glass">
          <h1 className="text-3xl font-bold mb-6 text-gradient">Feedback</h1>

          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
              <p className="text-muted-foreground mb-6">
                Your feedback helps make LeetScape better. Whether you have a
                bug report, feature request, or just want to share your
                thoughts, we'd love to hear from you.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Contact Methods */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Email
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-3">
                    Send us a direct email for general inquiries or support.
                  </p>
                  <a
                    href="mailto:anuragkbhonsle@gmail.com"
                    className="text-primary hover:underline font-medium"
                  >
                    anuragkbhonsle@gmail.com
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Github className="h-5 w-5" />
                    GitHub Issues
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-3">
                    Report bugs or request features through GitHub issues.
                  </p>
                  <a
                    href="https://github.com/anuragbhonsle/leetscape/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    Open Issue
                  </a>
                </CardContent>
              </Card>
            </div>

            {/* Quick Feedback Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Quick Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name (Optional)</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your name"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="type">Feedback Type</Label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    >
                      <option value="">Select type...</option>
                      <option value="Bug Report">Bug Report</option>
                      <option value="Feature Request">Feature Request</option>
                      <option value="Improvement Suggestion">
                        Improvement Suggestion
                      </option>
                      <option value="General Feedback">General Feedback</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us what you think..."
                      className="mt-1 min-h-[120px]"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Send Feedback
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Common Feedback Topics */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Common Topics</h3>
              <div className="space-y-3">
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-medium mb-2">Bug Reports</h4>
                  <p className="text-sm text-muted-foreground">
                    Found something that's not working? Include steps to
                    reproduce and what you expected to happen.
                  </p>
                </div>

                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-medium mb-2">Feature Requests</h4>
                  <p className="text-sm text-muted-foreground">
                    Have an idea for a new feature? Describe how it would help
                    your workflow.
                  </p>
                </div>

                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-medium mb-2">Performance</h4>
                  <p className="text-sm text-muted-foreground">
                    Experiencing slow loading or lag? Let us know your device
                    and browser details.
                  </p>
                </div>
              </div>
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

export default Feedback;
