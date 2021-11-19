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
    text: "Trang chủ",
    to: "/",
  },
  {
    Icon: InboxIcon,
    text: "Lưu trữ",
    to: "/reading-list",
  },
  {
    Icon: TagIcon,
    text: "Danh sách thẻ",
    to: "/tag",
  },
  {
    Icon: BulbIcon,
    text: "Câu hỏi thường gặp",
    to: "/faq",
  },
  {
    Icon: ContactIcon,
    text: "Liên hệ",
    to: "/contact",
  },
  {
    Icon: HeartIcon,
    text: "Về chúng tôi",
    to: "/about",
  },
];
interface Props {
  onItemClick?: () => any;
}
export default function SideMenu({ onItemClick }: Props) {
  return (
    <nav>
      <List subheader={<ListSubheader>Paper Community</ListSubheader>}>
        {menu.map((item) => (
          <ListItem key={item.text}>
            <ListItemButton component={Link} to={item.to} onClick={onItemClick}>
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
