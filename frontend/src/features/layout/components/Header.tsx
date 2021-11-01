import { DarkModeOutlined, LightModeOutlined } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import BellIcon from "@mui/icons-material/NotificationsOutlined";
import SearchIcon from "@mui/icons-material/Search";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  Link as MuiLink,
  Menu,
  MenuItem,
  styled,
  Toolbar,
} from "@mui/material";
import { UserPreview } from "features/profile/types";
import { SearchBox } from "features/search";
import { useThemeMode } from "hooks/useThemeMode";
import { useState } from "react";
import { Link } from "react-router-dom";
import SideMenu from "./SideMenu";
interface Props {
  user?: UserPreview;
  onLogout?: () => any;
  notificationsCount?: number;
}
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  borderBottom: theme.border,
  color: theme.palette.text.primary,
  backdropFilter: "blur(10px)",
}));

export default function Header({ user, onLogout, notificationsCount }: Props) {
  const { mode, toggleMode } = useThemeMode();
  const [drawer, toggleDrawer] = useState(false);
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const menuOpen = Boolean(anchor);
  const handleMenuClose = () => {
    setAnchor(null);
  };
  return (
    <>
      <StyledAppBar position="fixed" elevation={0}>
        <Container>
          <Toolbar sx={{ padding: 0 }}>
            <IconButton
              color="inherit"
              edge="start"
              sx={{ display: { xs: "inline-flex", md: "none" } }}
              onClick={() => toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <MuiLink component={Link} to="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                style={{ fill: "currentColor" }}
              >
                <path d="M20.563 3.34a1.002 1.002 0 0 0-.989-.079l-17 8a1 1 0 0 0 .026 1.821L8 15.445v6.722l5.836-4.168 4.764 2.084a1 1 0 0 0 1.399-.85l1-15a1.005 1.005 0 0 0-.436-.893zm-2.466 14.34-5.269-2.306L16 9.167l-7.649 4.25-2.932-1.283 13.471-6.34-.793 11.886z"></path>
              </svg>
            </MuiLink>
            <Box
              sx={{
                display: { xs: "none", md: "inline-block" },
                flexGrow: 1,
                maxWidth: 300,
                ml: 1,
              }}
            >
              <SearchBox />
            </Box>
            <Box
              sx={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              {user && (
                <Button
                  variant="contained"
                  sx={{
                    textTransform: "none",
                    display: { xs: "none", md: "inline-block" },
                  }}
                  component={Link}
                  to="/article/new"
                >
                  Create Post
                </Button>
              )}
              <IconButton
                color="inherit"
                sx={{ display: { xs: "inline-flex", md: "none" } }}
                component={Link}
                to="/search"
              >
                <SearchIcon />
              </IconButton>
              {user && (
                <IconButton color="inherit" component={Link} to="/notification">
                  <Badge badgeContent={notificationsCount} color="primary">
                    <BellIcon />
                  </Badge>
                </IconButton>
              )}
              <IconButton color="inherit" onClick={toggleMode}>
                {mode ? <LightModeOutlined /> : <DarkModeOutlined />}
              </IconButton>
              {!user && (
                <Button variant="contained" component={Link} to="/login">
                  Login
                </Button>
              )}
              {user && (
                <>
                  <Avatar
                    src={user.avatar}
                    sx={{
                      border: 1,
                      borderColor: "primary.main",
                    }}
                    onClick={(e) => setAnchor(e.currentTarget)}
                  />
                  <Menu
                    anchorEl={anchor}
                    open={menuOpen}
                    onClose={() => setAnchor(null)}
                  >
                    <MenuItem
                      onClick={handleMenuClose}
                      component={Link}
                      to={`/profile/${user.id}/articles`}
                    >
                      Profile
                    </MenuItem>
                    <MenuItem
                      onClick={handleMenuClose}
                      component={Link}
                      to="/article/new"
                    >
                      Create Post
                    </MenuItem>
                    <MenuItem
                      onClick={handleMenuClose}
                      component={Link}
                      to="/reading-list"
                    >
                      Reading List
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        onLogout && onLogout();
                      }}
                    >
                      Sign Out
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </StyledAppBar>
      <Drawer
        anchor="left"
        open={drawer}
        onClose={() => toggleDrawer(false)}
        sx={{ "& .MuiDrawer-paper": { width: 320 } }}
        ModalProps={{ keepMounted: true }}
      >
        <Toolbar
          sx={{ justifyContent: "flex-end" }}
          onClick={() => toggleDrawer(false)}
        >
          <IconButton>
            <CloseIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <SideMenu />
      </Drawer>
    </>
  );
}
