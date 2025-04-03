// frontend/src/components/layout/AppLayout.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AppShell, 
  Navbar, 
  Header, 
  Text, 
  MediaQuery, 
  Burger, 
  useMantineTheme,
  UnstyledButton,
  Group,
  Avatar,
  Menu,
  ActionIcon,
  Divider
} from '@mantine/core';
import { useAuth } from '../../context/AuthContext';

// Icônes (vous pouvez les remplacer par des icônes spécifiques)
const DashboardIcon = () => <span>📊</span>;
const ShiftsIcon = () => <span>📅</span>;
const ExchangeIcon = () => <span>🔄</span>;
const ProfileIcon = () => <span>👤</span>;
const AdminIcon = () => <span>⚙️</span>;
const LogoutIcon = () => <span>🚪</span>;

const AppLayout = ({ children }) => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    setOpened(false); // Ferme le menu sur mobile
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!opened}
          width={{ sm: 200, lg: 300 }}
        >
          <Navbar.Section grow>
            <Text size="xl" weight={700} mb="lg">Agent Planning</Text>
            
            <UnstyledButton
              sx={(theme) => ({
                display: 'block',
                width: '100%',
                padding: theme.spacing.xs,
                borderRadius: theme.radius.sm,
                '&:hover': {
                  backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                },
              })}
              onClick={() => handleNavigation('/dashboard')}
            >
              <Group>
                <DashboardIcon />
                <Text>Tableau de bord</Text>
              </Group>
            </UnstyledButton>
            
            <UnstyledButton
              sx={(theme) => ({
                display: 'block',
                width: '100%',
                padding: theme.spacing.xs,
                borderRadius: theme.radius.sm,
                '&:hover': {
                  backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                },
              })}
              onClick={() => handleNavigation('/shifts')}
            >
              <Group>
                <ShiftsIcon />
                <Text>Mes créneaux</Text>
              </Group>
            </UnstyledButton>
            
            <UnstyledButton
              sx={(theme) => ({
                display: 'block',
                width: '100%',
                padding: theme.spacing.xs,
                borderRadius: theme.radius.sm,
                '&:hover': {
                  backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                },
              })}
              onClick={() => handleNavigation('/exchanges')}
            >
              <Group>
                <ExchangeIcon />
                <Text>Échanges</Text>
              </Group>
            </UnstyledButton>
            
            {currentUser?.is_admin && (
              <UnstyledButton
                sx={(theme) => ({
                  display: 'block',
                  width: '100%',
                  padding: theme.spacing.xs,
                  borderRadius: theme.radius.sm,
                  '&:hover': {
                    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                  },
                })}
                onClick={() => handleNavigation('/admin')}
              >
                <Group>
                  <AdminIcon />
                  <Text>Administration</Text>
                </Group>
              </UnstyledButton>
            )}
          </Navbar.Section>
          
          <Navbar.Section>
            <Divider my="sm" />
            <UnstyledButton
              sx={(theme) => ({
                display: 'block',
                width: '100%',
                padding: theme.spacing.xs,
                borderRadius: theme.radius.sm,
                '&:hover': {
                  backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                },
              })}
              onClick={handleLogout}
            >
              <Group>
                <LogoutIcon />
                <Text>Déconnexion</Text>
              </Group>
            </UnstyledButton>
          </Navbar.Section>
        </Navbar>
      }
      header={
        <Header height={70} p="md">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
              />
            </MediaQuery>

            <Text size="lg" weight={700}>Agent Planning</Text>

            <Menu>
              <Menu.Target>
                <UnstyledButton>
                  <Group>
                    <Avatar color="blue" radius="xl">{currentUser?.username?.charAt(0).toUpperCase()}</Avatar>
                    <div>
                      <Text>{currentUser?.username}</Text>
                      <Text size="xs" color="dimmed">
                        {currentUser?.is_admin ? 'Administrateur' : 'Agent'}
                      </Text>
                    </div>
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              
              <Menu.Dropdown>
                <Menu.Item icon={<ProfileIcon />} onClick={() => handleNavigation('/profile')}>
                  Mon profil
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item icon={<LogoutIcon />} onClick={handleLogout}>
                  Déconnexion
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
        </Header>
      }
      styles={(theme) => ({
        main: { 
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] 
        },
      })}
    >
      {children}
    </AppShell>
  );
};

export default AppLayout;