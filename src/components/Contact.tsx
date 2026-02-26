import styled from "styled-components";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState, useEffect } from "react";
import emailjs from "emailjs-com";
import {
  gradientTextMixin,
  glassMixin,
  badgeMixin,
  primaryButtonMixin,
  sectionDividerTop,
  sectionDividerBottom,
} from "../styles/mixins";
import { useSiteContent } from "../context/SiteContentContext";
import { ContactSkeletonLayout } from "./SkeletonLoader";
import type { ContactDoc } from "../interfaces/firestore.interface";

// ─── WhatsApp icon (inline SVG since lucide doesn't have it) ─────────────────

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// ─── Styled Components ────────────────────────────────────────────────────────

const Section = styled.section`
  position: relative;
  padding: 7rem 1.5rem;
  background: ${({ theme }) => theme.backgroundAlt};
  overflow: hidden;
  ${sectionDividerTop};
  ${sectionDividerBottom};
`;

const OrbLeft = styled.div`
  position: absolute;
  bottom: 25%;
  left: -5rem;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: ${({ theme }) => theme.gradientOrbA};
  filter: blur(100px);
  pointer-events: none;
  will-change: transform;
  
  @media (max-width: 640px) {
    filter: blur(60px);
    width: 240px;
    height: 240px;
    left: -4rem;
  }
`;

const OrbRight = styled.div`
  position: absolute;
  top: 25%;
  right: -4rem;
  width: 256px;
  height: 256px;
  border-radius: 50%;
  background: ${({ theme }) => theme.gradientOrbB};
  filter: blur(80px);
  pointer-events: none;
  will-change: transform;
  
  @media (max-width: 640px) {
    filter: blur(50px);
    width: 200px;
    height: 200px;
    right: -3rem;
  }
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  position: relative;
`;

const Header = styled(motion.div)`
  text-align: center;
  margin-bottom: 5rem;
`;

const BadgeEl = styled.div`
  ${badgeMixin};
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-size: clamp(2rem, 4vw, 3.25rem);
  font-weight: 800;
  color: ${({ theme }) => theme.foreground};
  margin-bottom: 1rem;
  font-family: "Plus Jakarta Sans", sans-serif;
`;

const GradientWord = styled.span`
  ${gradientTextMixin};
`;

const Subtitle = styled.p`
  font-size: 1.0625rem;
  color: ${({ theme }) => theme.foregroundMuted};
  max-width: 480px;
  margin: 0 auto;
`;

const ContentGrid = styled.div`
  display: grid;
  gap: 3rem;
  align-items: center;

  @media (min-width: 768px) {
    grid-template-columns: 2fr 3fr;
    gap: 3.5rem;
  }
`;

// ── Info column ──

const InfoCol = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const InfoTitle = styled.h3`
  font-size: 1.625rem;
  font-weight: 800;
  color: ${({ theme }) => theme.foreground};
  margin-bottom: 0.75rem;
  font-family: "Plus Jakarta Sans", sans-serif;
`;

const InfoDesc = styled.p`
  font-size: 0.9375rem;
  line-height: 1.75;
  color: ${({ theme }) => theme.foregroundMuted};
  margin-bottom: 2rem;
`;

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InfoItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: default;
`;

const InfoIcon = styled.div<{ $gradStart: string; $gradEnd: string }>`
  width: 46px;
  height: 46px;
  border-radius: 13px;
  background: linear-gradient(
    135deg,
    ${({ $gradStart }) => $gradStart},
    ${({ $gradEnd }) => $gradEnd}
  );
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #fff;
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.22);
  transition: transform 0.2s ease;

  ${InfoItem}:hover & {
    transform: scale(1.1);
  }
`;

const InfoText = styled.div`
  flex: 1;
`;

const InfoLabel = styled.p`
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.foregroundSubtle};
  margin-bottom: 2px;
  font-family: "Plus Jakarta Sans", sans-serif;
`;

const InfoValue = styled.p`
  font-size: 0.9375rem;
  font-weight: 500;
  color: ${({ theme }) => theme.foreground};
`;

// ── Form column ──

const FormCard = styled(motion.div)`
  ${glassMixin};
  padding: 2.5rem;
  border-radius: 24px;
  box-shadow: ${({ theme }) => theme.shadowCard};
`;

const FormRow = styled.div`
  display: grid;
  gap: 1.25rem;
  margin-bottom: 1.25rem;

  @media (min-width: 480px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 0.8125rem;
  font-weight: 700;
  color: ${({ theme }) => theme.foreground};
  font-family: "Plus Jakarta Sans", sans-serif;
  letter-spacing: 0.01em;
`;

const inputShared = `
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 0.9375rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  font-family: 'Inter', sans-serif;
`;

const Input = styled.input`
  ${inputShared};
  background: ${({ theme }) => theme.backgroundInput};
  border: 1.5px solid ${({ theme }) => theme.borderInput};
  color: ${({ theme }) => theme.foreground};

  &::placeholder {
    color: ${({ theme }) => theme.foregroundSubtle};
  }

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px
      ${({ theme }) =>
        theme.isDark ? "rgba(129,140,248,0.15)" : "rgba(99,102,241,0.12)"};
  }
`;

const Textarea = styled.textarea`
  ${inputShared};
  background: ${({ theme }) => theme.backgroundInput};
  border: 1.5px solid ${({ theme }) => theme.borderInput};
  color: ${({ theme }) => theme.foreground};
  resize: none;
  min-height: 130px;

  &::placeholder {
    color: ${({ theme }) => theme.foregroundSubtle};
  }

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px
      ${({ theme }) =>
        theme.isDark ? "rgba(129,140,248,0.15)" : "rgba(99,102,241,0.12)"};
  }
`;

const SubmitBtn = styled(motion.button)`
  ${primaryButtonMixin};
  width: 100%;
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
`;

const SubmitMessage = styled(motion.div)<{ $isError?: boolean }>`
  padding: 12px 16px;
  border-radius: 12px;
  margin-top: 1rem;
  font-size: 0.9375rem;
  font-weight: 500;
  text-align: center;
  background: ${(props) =>
    props.$isError ? "rgba(239, 68, 68, 0.1)" : "rgba(34, 197, 94, 0.1)"};
  color: ${(props) => (props.$isError ? "#ef4444" : "#22c55e")};
  border: 1px solid
    ${(props) =>
      props.$isError ? "rgba(239, 68, 68, 0.3)" : "rgba(34, 197, 94, 0.3)"};
  margin-top: 0.25rem;
`;

// ─── WhatsApp CTA ───────────────────────────────────────────────────────────────

const WhatsAppBtn = styled(motion.a)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 13px 20px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  font-family: "Plus Jakarta Sans", sans-serif;
  font-weight: 700;
  font-size: 0.9375rem;
  color: #ffffff;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  box-shadow: 0 8px 24px rgba(34, 197, 94, 0.35);
  text-decoration: none;
  transition:
    box-shadow 0.2s ease,
    opacity 0.2s ease;
  margin-top: 1.5rem;

  &:hover {
    opacity: 0.92;
    box-shadow: 0 12px 32px rgba(34, 197, 94, 0.5);
  }
`;

const WhatsAppPulse = styled.span`
  position: relative;
  display: flex;
  align-items: center;

  &::before {
    content: "";
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.35);
    animation: wapulse 1.8s ease-in-out infinite;
  }

  @keyframes wapulse {
    0%,
    100% {
      transform: scale(1);
      opacity: 0.5;
    }
    50% {
      transform: scale(1.5);
      opacity: 0;
    }
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────

export function Contact() {
  const { docs, loaded } = useSiteContent();
  const contactData = (docs.contact as ContactDoc | null) || null;
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // Initialize EmailJS
    const publicKey =
      process.env.REACT_APP_EMAILJS_PUBLIC_KEY || "";
    emailjs.init(publicKey);
  }, []);

  if (!loaded || !contactData) {
    return (
      <Section id="contact">
        <OrbLeft />
        <OrbRight />
        <Container>
          <Header>
            <BadgeEl>Contact</BadgeEl>
            <Title>
              Let's <GradientWord>Work Together</GradientWord>
            </Title>
          </Header>
          <ContentGrid>
            <ContactSkeletonLayout includeInfo={true} />
          </ContentGrid>
        </Container>
      </Section>
    );
  }

  const displayData = contactData;

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: displayData.email || "N/A",
      gs: "#6366f1",
      ge: "#8b5cf6",
    },
    {
      icon: Phone,
      label: "Phone",
      value: displayData.phone || "N/A",
      gs: "#3b82f6",
      ge: "#6366f1",
    },
    {
      icon: MapPin,
      label: "Location",
      value: displayData.location || "N/A",
      gs: "#8b5cf6",
      ge: "#d946ef",
    },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");
    setIsError(false);

    const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;

    if (!serviceId || !templateId) {
      setIsError(true);
      setSubmitMessage(
        "The contact form is temporarily unavailable. Please reach out via email or WhatsApp."
      );
      setIsSubmitting(false);
      return;
    }

    try {
      await emailjs.send(serviceId, templateId, {
        to_email: `${displayData.formSubmissionEmail}`,
        from_name: form.name,
        from_email: form.email,
        subject: form.subject,
        message: form.message,
      });

      setSubmitMessage("✓ Thank you! Your message has been sent successfully.");
      setIsError(false);
      setForm({ name: "", email: "", subject: "", message: "" });

      setTimeout(() => setSubmitMessage(""), 5000);
    } catch (error) {
      console.error("Error sending email:", error);
      setSubmitMessage("✗ Failed to send message. Please try again.");
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const phoneForWa = displayData.phone?.replace(/\s/g, "");
  const hasWhatsApp = Boolean(phoneForWa);

  return (
    <Section id="contact">
      <OrbLeft />
      <OrbRight />

      <Container>
        <Header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <BadgeEl>Contact</BadgeEl>
          <Title>
            Let's <GradientWord>Work Together</GradientWord>
          </Title>
          <Subtitle>{displayData.subtitle}</Subtitle>
        </Header>

        <ContentGrid>
          {/* Info */}
          <InfoCol
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <InfoTitle>Get In Touch</InfoTitle>
            <InfoDesc>{displayData.description}</InfoDesc>

            <InfoList>
              {contactInfo.map((item) => (
                <InfoItem key={item.label} whileHover={{ x: 4 }}>
                  <InfoIcon $gradStart={item.gs} $gradEnd={item.ge}>
                    <item.icon size={20} />
                  </InfoIcon>
                  <InfoText>
                    <InfoLabel>{item.label}</InfoLabel>
                    <InfoValue>{item.value}</InfoValue>
                  </InfoText>
                </InfoItem>
              ))}

              {/* WhatsApp CTA */}
              {hasWhatsApp && (
                <WhatsAppBtn
                  href={`https://wa.me/${phoneForWa}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <WhatsAppPulse>
                    <WhatsAppIcon />
                  </WhatsAppPulse>
                  Chat on WhatsApp
                </WhatsAppBtn>
              )}
            </InfoList>
          </InfoCol>

          {/* Form */}
          <FormCard
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <form onSubmit={handleSubmit}>
              <FormRow>
                <FieldGroup>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </FieldGroup>
                <FieldGroup>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </FieldGroup>
              </FormRow>

              <FieldGroup style={{ marginBottom: "1.25rem" }}>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="How can I help?"
                  value={form.subject}
                  onChange={handleChange}
                  required
                />
              </FieldGroup>

              <FieldGroup style={{ marginBottom: "1.75rem" }}>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell me about your project..."
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </FieldGroup>

              <SubmitBtn
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
              >
                <Send size={18} />
                {isSubmitting ? "Sending..." : "Send Message"}
              </SubmitBtn>
              {submitMessage && (
                <SubmitMessage
                  $isError={isError}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {submitMessage}
                </SubmitMessage>
              )}
            </form>
          </FormCard>
        </ContentGrid>
      </Container>
    </Section>
  );
}
