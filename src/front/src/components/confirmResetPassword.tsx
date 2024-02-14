import { useState, useRef } from 'react';
import { Card } from './ui/card';
import styles from './style/twoFA.module.css';
import stylesButton from './style/profile.module.css';
import { Button } from './ui/button';
import apolloClient from './apolloclient';
import { gql } from '@apollo/client';
import { Input } from './ui/input';

const ConfirmResetPasswordForm = (props: {code: string}) => {
  const code = props.code;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = formRef.current;
    setError('');
    
    if (!form) {
      console.error('Form reference is null');
      return;
    }

    if (!username) {
      setError('Username is required');
      return;
    }

    if (!password) {
      setError('Password is required');
      return;
    }

    if (!password2) {
      setError('Password confirmation is required');
      return;
    }

    if (password !== password2) {
      setError('Password dont match');
      return;
    }

    try {
      setIsSubmitting(true);
      apolloClient.mutate({
        mutation: gql`
        mutation resetPassword($user: String!, $code: String!, $password: String!){
          resetPassword(user: $user, code: $code, password: $password)
        }
        `,
        variables: {
            user: username,
            code: code,
            password: password,
        },
      });
      setIsSubmitting(false);
      setSuccessMessage('Password changed successfully!');
      setUsername('');
      setPassword('');
      setPassword2('');
    } catch (error) {
      setIsSubmitting(false);
      setError('Failed to change password');
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.twoFACard}>
        <div className={styles.contentContainer}>
          <h1 style={{ marginBottom: "30px" }}>Change Password</h1>
          <form onSubmit={handleSubmit} ref={formRef}> {/* Use formRef here */}
            <div>
              <Input type="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} style={{ marginBottom: "30px" }}/>
            </div>
            <div>
              <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ marginBottom: "30px" }}/>
            </div>
            <div>
              <Input type="password" placeholder="Password verification" value={password2} onChange={(e) => setPassword2(e.target.value)} style={{ marginBottom: "30px" }}/>
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

export default ConfirmResetPasswordForm;