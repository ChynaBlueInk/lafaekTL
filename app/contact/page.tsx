"use client"

import type React from "react"
import Image from "next/image"
import { useState } from "react"
import { Mail, Phone, MapPin, Send } from "lucide-react"

import { Button } from "@/components/button"
import { Card } from "@/components/Card"
import { Input } from "@/components/input"
import { Textarea } from "@/components/textarea"
import { useLanguage } from "@/lib/LanguageContext"


export default function ContactPage() {
  const { language } = useLanguage()
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
        title: "Contact Lafaek",
        subtitle: "We’d love to hear from you",
        description: "Reach out with your questions, ideas, or partnership opportunities.",
      },
      contactInfo: {
        title: "Contact Information",
        email: "info@lafaek.tl",
        phone: "+670 1234 5678",
        address: "Dili, Timor-Leste",
      },
      form: {
        title: "Send Us a Message",
        nameLabel: "Your Name",
        emailLabel: "Your Email",
        inquiryTypeLabel: "What is your inquiry about?",
        inquiryPlaceholder: "Select an option",
        inquiryOptions: [
          { value: "general", label: "General Inquiry" },
          { value: "magazine", label: "Magazine Subscription" },
          { value: "collaboration", label: "Collaboration" },
        ],
        subjectLabel: "Subject",
        messageLabel: "Message",
        submitButton: "Send Message",
        submitting: "Sending...",
        success: "Thank you! Your message has been sent.",
        error: "Oops! Something went wrong. Please try again.",
      },
    },
    tet: {
      hero: {
        title: "Kontaktu Lafaek",
        subtitle: "Favor ida tau ami hatene",
        description: "Hatama ita-nia pergunta, ideia ka proposta ba parceira.",
      },
      contactInfo: {
        title: "Informasaun Kontaktu",
        email: "info@lafaek.tl",
        phone: "+670 1234 5678",
        address: "Dili, Timor-Leste",
      },
      form: {
        title: "Hatudu Mensajen Ba Ami",
        nameLabel: "Ita-nia Naran",
        emailLabel: "Ita-nia Imel",
        inquiryTypeLabel: "Asuntu sa mak ita-nia pergunta?",
        inquiryPlaceholder: "Hili asuntu",
        inquiryOptions: [
          { value: "general", label: "Pergunta Geral" },
          { value: "magazine", label: "Subscrisaun Revista" },
          { value: "collaboration", label: "Kola ko'alia" },
        ],
        subjectLabel: "Asuntu",
        messageLabel: "Mensajen",
        submitButton: "Hatudu Mensajen",
        submitting: "Hatudu hela...",
        success: "Obrigadu! Ita-nia mensajen hetan ona.",
        error: "Deskulpa! Iha problema. Bolu fali.",
      },
    },
  }

  const t = contactContent[language]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, inquiryType: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormStatus("submitting")
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log("Form Data Submitted:", formData)
      setFormStatus("success")
      setFormData({ name: "", email: "", subject: "", message: "", inquiryType: "" })
    } catch (error) {
      console.error("Form submission error:", error)
      setFormStatus("error")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      <main className="flex-grow">
        <section className="py-20 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{t.hero.title}</h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">{t.hero.subtitle}</p>
            <p className="text-lg opacity-80 max-w-4xl mx-auto mt-4">{t.hero.description}</p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-blue-700 mb-6">{t.contactInfo.title}</h2>
              <div className="flex items-center space-x-4 text-gray-700 text-lg">
                <Mail className="h-6 w-6 text-purple-600" /><span>{t.contactInfo.email}</span>
              </div>
              <div className="flex items-center space-x-4 text-gray-700 text-lg">
                <Phone className="h-6 w-6 text-purple-600" /><span>{t.contactInfo.phone}</span>
              </div>
              <div className="flex items-center space-x-4 text-gray-700 text-lg">
                <MapPin className="h-6 w-6 text-purple-600" /><span>{t.contactInfo.address}</span>
              </div>
              <div className="mt-8">
                <Image src="/placeholder.svg" alt="Lafaek Office" width={500} height={300} className="rounded-lg shadow-lg" priority />
              </div>
            </div>

            <Card className="bg-white/90 backdrop-blur-sm border-2 border-purple-200 shadow-lg p-8">
              <h2 className="text-3xl font-bold text-purple-700 mb-6">{t.form.title}</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="name">{t.form.nameLabel}</label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="email">{t.form.emailLabel}</label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">{t.form.inquiryTypeLabel}</label>
                  <select
                    name="inquiryType"
                    id="inquiryType"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-green-600"
                    value={formData.inquiryType}
                    onChange={handleSelectChange}
                    required
                  >
                    <option value="">{t.form.inquiryPlaceholder}</option>
                    {t.form.inquiryOptions.map((opt: { value: string, label: string }) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="subject">{t.form.subjectLabel}</label>
                  <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} required />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="message">{t.form.messageLabel}</label>
                  <Textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={5} required />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 rounded-lg" disabled={formStatus === "submitting"}>
                  {formStatus === "submitting" ? t.form.submitting : t.form.submitButton}
                  <Send className="ml-2 h-5 w-5" />
                </Button>
                {formStatus === "success" && <p className="text-green-600 text-center">{t.form.success}</p>}
                {formStatus === "error" && <p className="text-red-600 text-center">{t.form.error}</p>}
              </form>
            </Card>
          </div>
        </section>
      </main>

    </div>
  )
}
