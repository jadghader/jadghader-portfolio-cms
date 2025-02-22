import React, { useState } from "react";
import styled from "styled-components";
import emailjs from "emailjs-com";

// Function to handle form submission
const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const checkMark = `${process.env.PUBLIC_URL}/icons/check-tick.svg`; // Accessing image in public

  const [isSubmitting, setIsSubmitting] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [status, setStatus] = useState("");
  const [showPopup, setShowPopup] = useState(false); // State for the popup

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission using EmailJS
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("Sending...");
    const form = e.target as HTMLFormElement;

    try {
      await emailjs.sendForm(
        "Jadghader",
        "Jadghader",
        form,
        "UBz-q8W2Wwp5dR3if"
      );
      setStatus("Message sent successfully!");
      setFormData({ firstName: "", lastName: "", email: "", message: "" }); // Reset form
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000); // Close popup after 2.5 seconds
    } catch (error) {
      setStatus("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SectionContainer id="contact">
      <LeftBlobShape />
      <RightBlobShape />
      <SectionTitle>Contact Me</SectionTitle>
      <FormWrapper>
        <Form onSubmit={handleSubmit}>
          <InputWrapper>
            <Input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <Input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </InputWrapper>
          <Input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextArea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
          />
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Message"}
          </SubmitButton>
        </Form>
      </FormWrapper>

      {/* Success Popup */}
      {showPopup && (
        <PopupCard>
          <PopupContent>
            <PopupMessage>Message Sent Successfully!</PopupMessage>
            <PopupIcon src={checkMark} alt="Success" />
          </PopupContent>
        </PopupCard>
      )}
    </SectionContainer>
  );
};

export default ContactForm;

// Styled Components
const SectionContainer = styled.section`
  position: relative;
  padding: 60px 20px;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  text-align: center;
  border-bottom: 2px solid ${({ theme }) => theme.accent};
  position: relative;
  overflow: hidden;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 40px;
  color: ${({ theme }) => theme.text};
`;

const FormWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.cardBackground};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const Input = styled.input<{ fullWidth?: boolean }>`
  padding: 15px;
  font-size: 1rem;
  width: ${(props) => (props.fullWidth ? "100%" : "48%")};
  border: 2px solid ${({ theme }) => theme.accent};
  border-radius: 8px;
  outline: none;
  transition: all 0.3s ease;
  background-color: ${({ theme }) => theme.inputBackground};

  &:focus {
    border-color: ${({ theme }) => theme.accentHover};
  }

  &::placeholder {
    color: ${({ theme }) => theme.placeholderColor};
  }

  @media (max-width: 768px) {
    width: 100%; /* Full width for mobile */
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  font-size: 1rem;
  width: 100%;
  height: 150px;
  border: 2px solid ${({ theme }) => theme.accent};
  border-radius: 8px;
  outline: none;
  resize: none;
  transition: all 0.3s ease;
  background-color: ${({ theme }) => theme.inputBackground};

  &:focus {
    border-color: ${({ theme }) => theme.accentHover};
  }

  &::placeholder {
    color: ${({ theme }) => theme.placeholderColor};
  }
`;

const SubmitButton = styled.button`
  padding: 12px 20px;
  font-size: 1rem;
  background-color: ${({ theme }) => theme.accent};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s, background-color 0.3s;

  &:hover {
    transform: scale(1.02);
    background-color: ${({ theme }) => theme.accentHover};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.disabled};
    cursor: not-allowed;
  }
`;

// Success Popup Card
const PopupCard = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  z-index: 3;
  text-align: center;
  opacity: 0;
  animation: fadeIn 1s forwards;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.8);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
`;

const PopupContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PopupMessage = styled.h3`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.inputText};
  margin-bottom: 20px;
`;

const PopupIcon = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  animation: brightnessTransition 1s ease-in-out forwards;

  @keyframes brightnessTransition {
    0% {
      filter: blur(10px);
    }
    100% {
      filter: blur(0);
    }
  }
`;

const LeftBlobShape = styled.div`
  position: absolute;
  top: 20%;
  left: -10%;
  width: 300px;
  height: 300px;
  background-color: ${({ theme }) => theme.accent};
  border-radius: 50%;
  transform: rotate(45deg);
  opacity: 0.1;
  z-index: 0;

  @media (max-width: 768px) {
    display: none;
  }
`;
const RightBlobShape = styled.div`
  position: absolute;
  top: 20%;
  right: -10%;
  width: 300px;
  height: 300px;
  background-color: ${({ theme }) => theme.accent};
  border-radius: 50%;
  transform: rotate(45deg);
  opacity: 0.1;
  z-index: 0;

  @media (max-width: 768px) {
    display: none;
  }
`;
