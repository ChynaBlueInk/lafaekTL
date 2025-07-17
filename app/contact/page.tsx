"use client"

import type React from "react"
import Image from "next/image";

import { useState } from "react"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import { Navigation } from "@/components/Navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Label } from "@/components/ui/Label"
import { Select } from "@/components/ui/Select"

export default function ContactPage() {
  const [language, setLanguage] = useState<"en" | "tet">("en")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    inquiryType: "",
  })
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")

  const contactContent = {
    en: {
      hero: {
        title: "Contact Us",
        subtitle: "We'd love to hear from you!",
        description:
          "Whether you have a question, feedback, or just want to say hello, feel free to reach out. Our team is here to help.",
      },
      contactInfo: {
        title: "Our Contact Information",
        email: "info@lafaeklearningmedia.org",
        phone: "+670 7712 3456",
        address: "Dili, Timor-Leste",
      },
      form: {
        title: "Send Us a Message",
        nameLabel: "Your Name",
        emailLabel: "Your Email",
        subjectLabel: "Subject",
        messageLabel: "Your Message",
        inquiryTypeLabel: "Type of Inquiry",
        inquiryOptions: [
          { value: "general", label: "General Inquiry" },
          { value: "partnership", label: "Partnership" },
          { value: "feedback", label: "Feedback" },
          { value: "support", label: "Support" },
          { value: "other", label: "Other" },
        ],
        inquiryPlaceholder: "Select an inquiry type",
        submitButton: "Send Message",
        submitting: "Sending...",
        success: "Message sent successfully! We'll get back to you soon.",
        error: "Failed to send message. Please try again later.",
      },
    },
    tet: {
      hero: {
        title: "Kontaktu Ami",
        subtitle: "Ami hakarak rona husi ita!",
        description:
          "Se ita iha pergunta, feedback, ka hakarak dehan olá, sente livre atu kontaktu ami. Ami-nia ekipa iha ne'e atu ajuda.",
      },
      contactInfo: {
        title: "Ami-nia Informasaun Kontaktu",
        email: "info@lafaeklearningmedia.org",
        phone: "+670 7712 3456",
        address: "Dili, Timor-Leste",
      },
      form: {
        title: "Haruka Mensajen ba Ami",
        nameLabel: "Ita-nia Naran",
        emailLabel: "Ita-nia Email",
        subjectLabel: "Asuntu",
        messageLabel: "Ita-nia Mensajen",
        inquiryTypeLabel: "Tipu Kestionamentu",
        inquiryOptions: [
          { value: "general", label: "Kestionamentu Jerál" },
          { value: "partnership", label: "Parceria" },
          { value: "feedback", label: "Feedback" },
          { value: "support", label: "Suporta" },
          { value: "other", label: "Seluk" },
        ],
        inquiryPlaceholder: "Hili tipu kestionamentu",
        submitButton: "Haruka Mensajen",
        submitting: "Haruka...",
        success: "Mensajen haruka ho susesu! Ami sei kontaktu ita lalais.",
        error: "La konsege haruka mensajen. Favór koko fali ikus mai.",
      },
    },
  }

  const t = contactContent[language]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, inquiryType: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormStatus("submitting")

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log("Form Data Submitted:", formData)
      setFormStatus("success")
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        inquiryType: "",
      })
    } catch (error) {
      console.error("Form submission error:", error)
      setFormStatus("error")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation language={language} onLanguageChange={setLanguage} />

      <main>
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{t.hero.title}</h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">{t.hero.subtitle}</p>
            <p className="text-lg opacity-80 max-w-4xl mx-auto mt-4">{t.hero.description}</p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-blue-700 mb-6">{t.contactInfo.title}</h2>
              <div className="flex items-center space-x-4 text-gray-700 text-lg">
                <Mail className="h-6 w-6 text-purple-600" />
                <span>{t.contactInfo.email}</span>
              </div>
              <div className="flex items-center space-x-4 text-gray-700 text-lg">
                <Phone className="h-6 w-6 text-purple-600" />
                <span>{t.contactInfo.phone}</span>
              </div>
              <div className="flex items-center space-x-4 text-gray-700 text-lg">
                <MapPin className="h-6 w-6 text-purple-600" />
                <span>{t.contactInfo.address}</span>
              </div>
             <div className="mt-8">
  <Image
    src="/placeholder.svg"
    alt="Lafaek Learning Media Office"
    width={500}
    height={300}
    className="rounded-lg shadow-lg"
    priority
  />
</div>
            </div>

            {/* Contact Form */}
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-purple-200 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-purple-700 mb-6">{t.form.title}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">{t.form.nameLabel}</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">{t.form.emailLabel}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="inquiryType">{t.form.inquiryTypeLabel}</Label>
                    <Select
                      id="inquiryType"
                      name="inquiryType"
                      options={t.form.inquiryOptions}
                      placeholder={t.form.inquiryPlaceholder}
                      onValueChange={handleSelectChange}
                      value={formData.inquiryType}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">{t.form.subjectLabel}</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">{t.form.messageLabel}</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="mt-1"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 rounded-lg"
                    disabled={formStatus === "submitting"}
                  >
                    {formStatus === "submitting" ? t.form.submitting : t.form.submitButton}
                    <Send className="ml-2 h-5 w-5" />
                  </Button>
                  {formStatus === "success" && <p className="text-green-600 text-center mt-4">{t.form.success}</p>}
                  {formStatus === "error" && <p className="text-red-600 text-center mt-4">{t.form.error}</p>}
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">&copy; 2024 Lafaek Learning Media. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
