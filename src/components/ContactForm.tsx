import React, { useState } from "react";
import useForm from "@web3forms/react";
import { toast } from "sonner";

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface SubmitResponse {
  success: boolean;
  message: string;
}

const ContactForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });

  const { submit } = useForm<SubmitResponse>({
    access_key: "5c1122d0-3a1b-4b7c-ba09-048c8f317862",
    settings: {
      allowedOrigins: "*",
    },
    onSuccess: (successMessage: string) => {
      toast.success(successMessage || "Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
      setIsLoading(false);
      setIsSubmitted(true);
    },
    onError: (errorMessage: string) => {
      toast.error(errorMessage || "Failed to send message. Please try again.");
      setIsLoading(false);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await submit({
        ...formData,
        success: true
      });
      // Success and error cases are handled by onSuccess and onError callbacks
    } catch (error) {
      console.error("Form submission error:", error);
      // Error is handled by onError callback
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-md mx-auto text-center space-y-4 p-6 bg-green-50 rounded-lg">
        <h3 className="text-xl font-semibold text-green-700">Thank you for your message!</h3>
        <p className="text-green-600">We'll get back to you as soon as possible.</p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-light text-text">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-3 bg-transparent border border-gray-200 rounded-lg focus:border-accent focus:ring-1 focus:ring-accent text-text"
          placeholder="John Doe"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-light text-text">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 bg-transparent border border-gray-200 rounded-lg focus:border-accent focus:ring-1 focus:ring-accent text-text"
          placeholder="john@example.com"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-light text-text">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={4}
          className="w-full p-3 bg-transparent border border-gray-200 rounded-lg focus:border-accent focus:ring-1 focus:ring-accent text-text resize-none"
          placeholder="Your message..."
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full p-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
      >
        {isLoading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
};

export default ContactForm;