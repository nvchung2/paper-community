import ContactIcon from "@mui/icons-material/ContactPage";
import HeartIcon from "@mui/icons-material/Favorite";
import HomeIcon from "@mui/icons-material/Home";
import InboxIcon from "@mui/icons-material/Inbox";
import BulbIcon from "@mui/icons-material/Lightbulb";
import TagIcon from "@mui/icons-material/Tag";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import { Link } from "react-router-dom";

const menu = [
  {
    Icon: HomeIcon,
    text: "Home",
    to: "/",
  },
  {
    Icon: InboxIcon,
    text: "Reading List",
    to: "/reading-list",
  },
  {
    Icon: TagIcon,
    text: "Tags",
    to: "/tag",
  },
  {
    Icon: BulbIcon,
    text: "FAQ",
    to: "/faq",
  },
  {
    Icon: ContactIcon,
    text: "Contacts",
    to: "/contact",
  },
  {
    Icon: HeartIcon,
    text: "About",
    to: "/about",
  },
];
export default function SideMenu() {
  return (
    <nav>
      <List subheader={<ListSubheader>Paper Community</ListSubheader>}>
        {menu.map((item) => (
          <ListItem key={item.text}>
            <ListItemButton component={Link} to={item.to}>
              <ListItemIcon>
                <item.Icon />
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </nav>
  );
}
