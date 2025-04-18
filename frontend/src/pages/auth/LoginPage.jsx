import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TextInput, 
  PasswordInput, 
  Paper, 
  Title, 
  Container, 
  Button, 
  Text, 
  Alert 
} from '@mantine/core';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      return;
    }
    
    const success = await login(username, password);
    
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <Container size={420} my={40}>
      <Title align="center">Agent Planning</Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Application de gestion des plannings d'agents
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Nom d'utilisateur"
            placeholder="Votre identifiant"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          
          <PasswordInput
            label="Mot de passe"
            placeholder="Votre mot de passe"
            required
            mt="md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          {error && (
            <Alert color="red" mt="md">
              {error}
            </Alert>
          )}
          
          <Button fullWidth mt="xl" type="submit" loading={loading}>
            Se connecter
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default LoginPage;