import { useState, useRef } from 'react';
import { Card } from './ui/card';
import styles from './style/twoFA.module.css';
import stylesButton from './style/profile.module.css';
import emailjs from '@emailjs/browser';
import { Button } from './ui/button';

const ResetPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const EMAILJS_PUBLIC = "v1I8S1MLb-IWwOU4a";
  emailjs.init(EMAILJS_PUBLIC);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = formRef.current;

    if (!form) {
      console.error('Form reference is null');
      return;
    }

    if (!email) {
      setError('Email is required');
      return;
    }

    try {
      setIsSubmitting(true);

      
      /*if (!process.env.EMAILJS_SERVICE || !process.env.EMAILJS_TEMPLATE) {
        console.log("EMAILJS_SERVICE: ", process.env.EMAILJS_SERVICE);
        console.log("EMAILJS_TEMPLATE: ", process.env.EMAILJS_TEMPLATE);
        throw new Error('Missing EMAILJS env variables');
      }*/
      const EMAILJS_SERVICE="service_a062qcp";
      const EMAILJS_TEMPLATE="template_pksiwcb";
      emailjs.send(
        EMAILJS_SERVICE,
        EMAILJS_TEMPLATE,
       {
        userName: "userToto",
        link: "http://www.google.ch",
        userEmail: "alain.huber91@gmail.com",
        });
      setIsSubmitting(false);
      setSuccessMessage('Reset Password email sent successfully!');
      setEmail('');
    } catch (error) {
      setIsSubmitting(false);
      setError('Failed to send reset password email');
      console.error('Failed to send reset password email:', error);
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.twoFACard}>
        <div className={styles.contentContainer}>
          <h1 style={{ marginBottom: "30px" }}>Reset Password</h1>
          <form onSubmit={handleSubmit} ref={formRef}> {/* Use formRef here */}
            <div>
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Button className={stylesButton.button} style={{ marginTop: "30px" }} type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send'}
              </Button>
              {error && <div>{error}</div>}
              {successMessage && <div>{successMessage}</div>}
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default ResetPasswordForm;