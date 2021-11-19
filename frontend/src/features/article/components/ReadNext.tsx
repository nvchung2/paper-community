import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Skeleton,
} from "@mui/material";
import ContentLoader from "components/ContentLoader";
import { formatDate } from "lib/utils";
import { Link } from "react-router-dom";
import { Article } from "../types";
interface Props {
  articles: Article[];
}
export function ReadNextSkeleton() {
  return (
    <List disablePadding>
      <ContentLoader count={5}>
        <ListItemButton>
          <ListItemAvatar>
            <Avatar>
              <Skeleton variant="circular" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={<Skeleton />}
            secondary={<Skeleton width="60%" />}
          />
        </ListItemButton>
      </ContentLoader>
    </List>
  );
}
export default function ReadNext({ articles }: Props) {
  return (
    <List disablePadding>
      {articles.length == 0 ? (
        <ListItem>
          <ListItemText
            primary="<Không có bài viết nào>"
            primaryTypographyProps={{ color: "GrayText" }}
          />
        </ListItem>
      ) : (
        articles.map((a) => (
          <ListItemButton key={a.id} component={Link} to={`/article/${a.id}`}>
            <ListItemAvatar>
              <Avatar src={a.author.avatar} />
            </ListItemAvatar>
            <ListItemText
              primary={a.title}
              secondary={`${a.author.name} - ${formatDate(a.createdTime)}`}
            />
          </ListItemButton>
        ))
      )}
    </List>
  );
}
