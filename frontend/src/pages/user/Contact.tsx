import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import "./Contact.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const Contact: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    setStatus("loading");

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("EmailJS Error:", err);
      setStatus("error");
    }
  };

  return (
    <>
      <Navbar />

      <div className="contact-container">
        <h1>İletişim</h1>
        <p className="contact-desc">
          Her türlü soru, öneri veya işbirliği için bize mesaj gönderebilirsiniz.  
          En kısa sürede dönüş yapacağız.
        </p>

        <form className="contact-form" onSubmit={sendEmail}>
          {/* Name */}
          <div className="form-group">
            <label>Adınız</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Adınızı giriniz"
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label>E-posta</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="E-posta adresiniz"
            />
          </div>

          {/* Message */}
          <div className="form-group">
            <label>Mesajınız</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              placeholder="Mesajınızı yazınız..."
            ></textarea>
          </div>

          {/* Button */}
          <button type="submit" className="submit-btn" disabled={status === "loading"}>
            {status === "loading" ? "Gönderiliyor..." : "Gönder"}
          </button>

          {/* Status Messages */}
          {status === "success" && (
            <p className="success-msg">Mesajınız başarıyla gönderildi 💛</p>
          )}

          {status === "error" && (
            <p className="error-msg">Mesaj gönderilirken bir hata oluştu ❗</p>
          )}
        </form>
      </div>

      <Footer />
    </>
  );
};

export default Contact;
