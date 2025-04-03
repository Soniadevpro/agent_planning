import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AppShell, 
  Text, 
  useMantineTheme,
  UnstyledButton,
  Group,
  Avatar,
  Menu,
  Burger,
  Divider
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
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
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleNavigation = (path) => {
    navigate(path);
    setOpened(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{ 
        width: 250, 
        breakpoint: 'sm', 
        collapsed: { mobile: !opened } 
      }}
      padding="md"
    >
      <AppShell.Header>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          height: '100%',
          padding: '0 15px'
        }}>
          {isMobile && (
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              size="sm"
              color={theme.colors.gray[6]}
            />
          )}

          <Text size="lg" fw={700}>Agent Planning</Text>

          <Menu>
            <Menu.Target>
              <UnstyledButton>
                <Group>
                  <Avatar color="blue" radius="xl">
                    {currentUser?.username?.charAt(0).toUpperCase()}
                  </Avatar>
                  <div>
                    <Text>{currentUser?.username}</Text>
                    <Text size="xs" c="dimmed">
                      {currentUser?.is_admin ? 'Administrateur' : 'Agent'}
                    </Text>
                  </div>
                </Group>
              </UnstyledButton>
            </Menu.Target>
            
            <Menu.Dropdown>
              <Menu.Item 
                leftSection={<ProfileIcon />} 
                onClick={() => handleNavigation('/profile')}
              >
                Mon profil
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item 
                leftSection={<LogoutIcon />} 
                onClick={handleLogout}
              >
                Déconnexion
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section grow>
          <Text size="xl" fw={700} mb="lg">Agent Planning</Text>
          
          <UnstyledButton
            onClick={() => handleNavigation('/dashboard')}
            p="xs"
            style={{ width: '100%', borderRadius: theme.radius.sm }}
            _hover={{ backgroundColor: theme.colors.gray[0] }}
          >
            <Group>
              <DashboardIcon />
              <Text>Tableau de bord</Text>
            </Group>
          </UnstyledButton>
          
          <UnstyledButton
            onClick={() => handleNavigation('/shifts')}
            p="xs"
            style={{ width: '100%', borderRadius: theme.radius.sm }}
            _hover={{ backgroundColor: theme.colors.gray[0] }}
          >
            <Group>
              <ShiftsIcon />
              <Text>Mes créneaux</Text>
            </Group>
          </UnstyledButton>
          
          <UnstyledButton
            onClick={() => handleNavigation('/exchanges')}
            p="xs"
            style={{ width: '100%', borderRadius: theme.radius.sm }}
            _hover={{ backgroundColor: theme.colors.gray[0] }}
          >
            <Group>
              <ExchangeIcon />
              <Text>Échanges</Text>
            </Group>
          </UnstyledButton>
          
          {currentUser?.is_admin && (
            <UnstyledButton
              onClick={() => handleNavigation('/admin')}
              p="xs"
              style={{ width: '100%', borderRadius: theme.radius.sm }}
              _hover={{ backgroundColor: theme.colors.gray[0] }}
            >
              <Group>
                <AdminIcon />
                <Text>Administration</Text>
              </Group>
            </UnstyledButton>
          )}
        </AppShell.Section>
        
        <AppShell.Section>
          <Divider my="sm" />
          <UnstyledButton
            onClick={handleLogout}
            p="xs"
            style={{ width: '100%', borderRadius: theme.radius.sm }}
            _hover={{ backgroundColor: theme.colors.gray[0] }}
          >
            <Group>
              <LogoutIcon />
              <Text>Déconnexion</Text>
            </Group>
          </UnstyledButton>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
};

export default AppLayout;