import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import DOMPurify from "dompurify";
import "./Contact.css";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";
import { Helmet } from "react-helmet-async";

const Contact: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    website: "" // Honeypot
  });

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const [startTime] = useState(Date.now());

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    // 🛡️ 1. Honeypot kontrolü
    if (form.website.length > 0) {
      //console.warn("Bot engellendi (honeypot).");
      setStatus("error");
      return;
    }

    // 🛡️ 2. Bot timer — 0.8 saniyeden hızlı form gönderilmez
    if (Date.now() - startTime < 800) {
      //console.warn("Bot engellendi (timer).");
      setStatus("error");
      return;
    }

    // 🛡️ 3. Rate limit — 15 saniyede 1 defa gönderilebilir
    const last = localStorage.getItem("last_sent");
    if (last && Date.now() - Number(last) < 15000) {
      alert("Lütfen tekrar göndermeden önce birkaç saniye bekleyiniz.");
      setStatus("error");
      return;
    }
    localStorage.setItem("last_sent", Date.now().toString());

    // 🛡️ 4. Email doğrulama (regex)
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    if (!emailValid) {
      alert("Lütfen geçerli bir e-posta adresi giriniz.");
      setStatus("error");
      return;
    }

    // 🛡️ 5. Mesaj çok uzun olamaz (spam koruması)
    if (form.message.length > 2000) {
      alert("Mesaj çok uzun (max 2000 karakter).");
      setStatus("error");
      return;
    }

    // 🛡️ 6. XSS sanitize
    const clean = {
      name: DOMPurify.sanitize(form.name),
      email: DOMPurify.sanitize(form.email),
      message: DOMPurify.sanitize(form.message)
    };

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID!,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID!,
        {
          from_name: clean.name,
          from_email: clean.email,
          message: clean.message
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY!
      );

      setStatus("success");
      setForm({ name: "", email: "", message: "", website: "" });
    } catch (err) {
      console.error("EmailJS Error:", err);
      setStatus("error");
    }
  };

  return (
    <>
    <Helmet>
      <title>İletişim | Españolize </title>
      <meta name="description" content="Bizimle iletişime geçin! Sorularınızı, önerilerinizi veya destek taleplerinizi buradan bize ulaştırabilirsiniz. Hızlı ve güvenli yanıt garantisi."></meta>
      <meta property="og:title" content="İletişim | Españolize " />
      <meta property="og:description" content="Bizimle iletişime geçin! Sorularınızı, önerilerinizi veya destek taleplerinizi buradan bize ulaştırabilirsiniz." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="http://localhost:5173/iletisim" />
    </Helmet>
      <Navbar />

      <div className="contact-container">
        <h1>İletişim</h1>
        <p className="contact-desc">
          Her türlü soru, öneri veya işbirliği için bize mesaj gönderebilirsiniz.
          En kısa sürede dönüş yapacağız.
        </p>

        <form className="contact-form" onSubmit={sendEmail}>
          {/* 🛡️ Honeypot (gizli input) */}
          <input
            type="text"
            name="website"
            value={form.website}
            onChange={handleChange}
            style={{ display: "none" }}
          />

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

          <button
            type="submit"
            className="submit-btn"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Gönderiliyor..." : "Gönder"}
          </button>

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
