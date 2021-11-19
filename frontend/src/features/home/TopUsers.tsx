import {
  Avatar,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Skeleton,
} from "@mui/material";
import ContentLoader from "components/ContentLoader";
import { useTopUsers } from "features/profile/services";
import { Link } from "react-router-dom";
export default function TopUsers() {
  const users = useTopUsers();
  return (
    <List
      disablePadding
      subheader={<ListSubheader>#Top tác giả</ListSubheader>}
      sx={{
        border: (theme) => theme.border,
        borderRadius: 1,
        overflow: "hidden",
        mb: 2,
      }}
    >
      {users.isSuccess ? (
        users.data.map((user) => (
          <ListItemButton
            sx={{
              borderTop: (theme) => theme.border,
            }}
            alignItems="flex-start"
            component={Link}
            to={`/profile/${user.id}/articles`}
            key={user.id}
          >
            <ListItemAvatar>
              <Avatar src={user.avatar} />
            </ListItemAvatar>
            <ListItemText
              primary={`@${user.name}`}
              secondary={`${user.followersCount} người theo dõi`}
            />
          </ListItemButton>
        ))
      ) : (
        <ContentLoader count={5}>
          <ListItemButton
            sx={{
              borderTop: (theme) => theme.border,
            }}
            alignItems="flex-start"
          >
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
      )}
    </List>
  );
}
