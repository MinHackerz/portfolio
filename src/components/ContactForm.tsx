import { useState } from "react";
import useForm from "@web3forms/react";
import { toast } from "sonner";

const ContactForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { submit } = useForm({
    access_key: "YOUR_ACCESS_KEY",
    onSuccess: (successMessage: string) => {
      toast.success("Message sent successfully!");
      setIsLoading(false);
    },
    onError: (errorMessage: string) => {
      toast.error("Failed to send message. Please try again.");
      setIsLoading(false);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const target = e.target as HTMLFormElement;
    await submit(target);
    target.reset();
  };

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