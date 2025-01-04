import { useState } from "react";
import useForm from "@web3forms/react";

const ContactForm = () => {
  const [result, setResult] = useState("");
  const { submit } = useForm({
    access_key: "YOUR_ACCESS_KEY",
    onSuccess: (successMessage: string) => {
      setResult(successMessage);
    },
    onError: (errorMessage: string) => {
      setResult(errorMessage);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    await submit(target);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <input
        type="text"
        name="name"
        required
        placeholder="Your Name"
        className="w-full p-2 border border-primary/20 rounded focus:border-primary bg-transparent text-primary"
      />
      <input
        type="email"
        name="email"
        required
        placeholder="Your Email"
        className="w-full p-2 border border-primary/20 rounded focus:border-primary bg-transparent text-primary"
      />
      <textarea
        name="message"
        required
        placeholder="Your Message"
        rows={4}
        className="w-full p-2 border border-primary/20 rounded focus:border-primary bg-transparent text-primary"
      />
      <button
        type="submit"
        className="w-full p-2 bg-primary text-white rounded hover:bg-secondary transition-colors"
      >
        Send Message
      </button>
      {result && <p className="text-primary mt-4">{result}</p>}
    </form>
  );
};

export default ContactForm;