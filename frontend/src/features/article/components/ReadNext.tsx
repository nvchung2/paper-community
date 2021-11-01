import {
  Avatar,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Skeleton,
} from "@mui/material";
import { formatDate } from "lib/utils";
import { Link } from "react-router-dom";
import { useRecommendations } from "../services/useArticle";
interface Props {
  articleId: string;
}
export default function ReadNext({ articleId }: Props) {
  const articles = useRecommendations({ id: articleId });
  return (
    <List disablePadding>
      {articles.isSuccess
        ? articles.data.map((a) => (
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
        : [...Array(5)].map((v, i) => (
            <ListItemButton key={i}>
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
          ))}
    </List>
  );
}
