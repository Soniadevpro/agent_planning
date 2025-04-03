
import { useAuth } from '../../context/AuthContext';
import { 
  Title, 
  Text, 
  Card, 
  SimpleGrid, 
  Group, 
  Badge, 
  useMantineTheme,
  Button,
  Paper,
  Divider
} from '@mantine/core';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const theme = useMantineTheme();

  // Ces données seraient normalement récupérées depuis l'API
  const stats = {
    shiftsToday: 2,
    shiftsWeek: 8,
    pendingExchanges: 1,
    messagesUnread: 3
  };

  return (
    <>
      <Title order={1} mb="lg">Tableau de bord</Title>
      
      <Paper p="md" withBorder mb="xl">
        <Group position="apart">
          <div>
            <Text size="xl">Bienvenue, {currentUser?.username} !</Text>
            <Text color="dimmed">Voici un résumé de votre planning et de vos activités.</Text>
          </div>
          <Badge size="lg" color={currentUser?.is_admin ? 'blue' : 'green'}>
            {currentUser?.is_admin ? 'Administrateur' : 'Agent'}
          </Badge>
        </Group>
      </Paper>
      
      <SimpleGrid cols={4} breakpoints={[
        { maxWidth: theme.breakpoints.md, cols: 2 },
        { maxWidth: theme.breakpoints.sm, cols: 1 }
      ]}>
        <Card withBorder p="lg" radius="md">
          <Group position="apart">
            <Text weight={500}>Créneaux aujourd'hui</Text>
            <Badge size="lg" color="blue">{stats.shiftsToday}</Badge>
          </Group>
          <Text size="sm" color="dimmed" mt="md">
            Vous avez {stats.shiftsToday} créneau(x) planifié(s) aujourd'hui.
          </Text>
          <Button variant="light" fullWidth mt="md">
            Voir mon planning du jour
          </Button>
        </Card>
        
        <Card withBorder p="lg" radius="md">
          <Group position="apart">
            <Text weight={500}>Créneaux cette semaine</Text>
            <Badge size="lg" color="cyan">{stats.shiftsWeek}</Badge>
          </Group>
          <Text size="sm" color="dimmed" mt="md">
            Vous avez {stats.shiftsWeek} créneau(x) planifié(s) cette semaine.
          </Text>
          <Button variant="light" fullWidth mt="md">
            Voir mon planning hebdomadaire
          </Button>
        </Card>
        
        <Card withBorder p="lg" radius="md">
          <Group position="apart">
            <Text weight={500}>Demandes d'échange</Text>
            <Badge size="lg" color="orange">{stats.pendingExchanges}</Badge>
          </Group>
          <Text size="sm" color="dimmed" mt="md">
            Vous avez {stats.pendingExchanges} demande(s) d'échange en attente.
          </Text>
          <Button variant="light" fullWidth mt="md">
            Gérer mes échanges
          </Button>
        </Card>
        
        <Card withBorder p="lg" radius="md">
          <Group position="apart">
            <Text weight={500}>Messages non lus</Text>
            <Badge size="lg" color="red">{stats.messagesUnread}</Badge>
          </Group>
          <Text size="sm" color="dimmed" mt="md">
            Vous avez {stats.messagesUnread} message(s) non lu(s).
          </Text>
          <Button variant="light" fullWidth mt="md">
            Voir ma messagerie
          </Button>
        </Card>
      </SimpleGrid>
      
      <Divider my="xl" />
      
      <Title order={2} mb="lg">Actions rapides</Title>
      
      <SimpleGrid cols={3} breakpoints={[
        { maxWidth: theme.breakpoints.md, cols: 2 },
        { maxWidth: theme.breakpoints.sm, cols: 1 }
      ]}>
        <Button size="lg" variant="outline">Voir mon planning</Button>
        <Button size="lg" variant="outline">Demander un échange</Button>
        <Button size="lg" variant="outline">Mettre à jour mon profil</Button>
      </SimpleGrid>
    </>
  );
};

export default DashboardPage;