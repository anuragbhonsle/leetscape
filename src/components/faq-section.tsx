import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const faqs = [
  {
    question: "What is LeetScape?",
    answer:
      "A clean, organized companion to track your LeetCode grind without distraction. We help you stay focused and consistent in your interview preparation journey.",
  },
  {
    question: "Is this affiliated with LeetCode?",
    answer:
      "Nope! We just love their problems — this is an unofficial companion tool designed to enhance your LeetCode experience.",
  },
  {
    question: "Can I sync problems from my real LeetCode account?",
    answer:
      "Not for now — but we plan to support that in the future. Currently, you can manually track your progress and add notes for problems you've solved.",
  },
  {
    question: "Is it free?",
    answer:
      "Yes, and always will be. We believe that everyone should have access to quality tools for interview preparation.",
  },
  {
    question: "How do I track my progress?",
    answer:
      "Simply mark problems as solved when you complete them, add your notes and insights, and watch your progress grow over time with our visual tracking tools.",
  },
  {
    question: "Can I filter problems by company?",
    answer:
      "Absolutely! You can filter problems by company, difficulty, topic, and more to focus your practice on what matters most for your interview prep.",
  },
];

export function FAQSection() {
  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-bold">Frequently Asked Questions</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Got questions? We've got answers. Here are some common questions
            about LeetScape.
          </p>
        </div>

        <Card className="max-w-4xl mx-auto card-gradient border-border">
          <CardContent className="p-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
