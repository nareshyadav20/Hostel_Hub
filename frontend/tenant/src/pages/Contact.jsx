import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Phone, Mail, MapPin, Send, CheckCircle } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
    }
  };

  return (
    <div className="contact-page-elite">



      <main className="contact-main-wrap">
        <div className="contact-container contact-split-grid">
          
          {/* Left Column: Context & Methods */}
          <div className="contact-left-content">
            <span className="contact-eyebrow">Contact Us</span>
            <h1 className="contact-title">Let's start a<br/><span className="contact-title-accent">conversation.</span></h1>
            <p className="contact-subtitle">
              Have questions about our premium properties, lease terms, or want to schedule a private tour? We're here to help.
            </p>

            <div className="contact-methods-list">
              <div className="method-item">
                <div className="method-icon"><Phone size={20}/></div>
                <div className="method-details">
                  <span>Call or WhatsApp</span>
                  <strong>+91 75693 83323</strong>
                </div>
              </div>
              <div className="method-item">
                <div className="method-icon"><Mail size={20}/></div>
                <div className="method-details">
                  <span>Email Support</span>
                  <strong>support@livora.com</strong>
                </div>
              </div>
              <div className="method-item">
                <div className="method-icon"><MapPin size={20}/></div>
                <div className="method-details">
                  <span>Headquarters</span>
                  <strong>Cyber Towers, Hitech City, Hyderabad</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="contact-right-content">
            {submitted ? (
              <div className="success-card">
                <div className="success-icon"><CheckCircle size={48}/></div>
                <h3>Message Sent!</h3>
                <p>Thank you for reaching out. We will get back to you within 2 hours.</p>
                <button className="success-btn" onClick={() => { setSubmitted(false); setFormData({name:'',email:'',phone:'',message:''}); }}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="contact-form-card" onSubmit={handleSubmit}>
                <div className="form-field">
                  <label>Full Name *</label>
                  <input name="name" value={formData.name} onChange={handleChange} placeholder="Rahul Sharma" required className="elite-input"/>
                </div>
                
                <div className="form-field">
                  <label>Email Address *</label>
                  <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="rahul@example.com" required className="elite-input"/>
                </div>

                <div className="form-field">
                  <label>Phone Number <span className="opt">(Optional)</span></label>
                  <input name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" className="elite-input"/>
                </div>

                <div className="form-field">
                  <label>Message *</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} placeholder="How can we help you?" rows={4} required className="elite-input" style={{resize:'none'}}/>
                </div>

                <button type="submit" className="form-submit-btn">
                  <Send size={16}/> Send Message
                </button>
              </form>
            )}
          </div>

        </div>
      </main>



    </div>
  );
};

export default Contact;
