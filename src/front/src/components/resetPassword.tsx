import { useState, useRef } from 'react';
import { Card } from './ui/card';
import styles from './style/twoFA.module.css';
import stylesButton from './style/profile.module.css';
import { Button } from './ui/button';
import apolloClient from './apolloclient';
import { gql } from '@apollo/client';
import { Input } from './ui/input';

const ResetPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

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
      apolloClient.mutate({
        mutation: gql`
        mutation generatePasswordReset($email: String!){
          generatePasswordReset(email: $email)
        }
        `,
        variables: {
            email: email,
        },
      });
      setIsSubmitting(false);
      setSuccessMessage('Reset Password email sent successfully!');
      setEmail('');
    } catch (error) {
      setIsSubmitting(false);
      setError('Failed to send reset password email');
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.twoFACard}>
        <div className={styles.contentContainer}>
          <h1 style={{ marginBottom: "30px" }}>Reset Password</h1>
          <form onSubmit={handleSubmit} ref={formRef}> {/* Use formRef here */}
            <div>
              <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Button className={stylesButton.button} style={{ marginTop: "30px" }} type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send'}
              </Button>
              {error && <div style ={{ marginTop: "30px"}}>{error}</div>}
              {successMessage && <div style ={{ marginTop: "30px"}}>{successMessage}</div>}
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default ResetPasswordForm;