import React, { ChangeEvent, FormEvent, useState } from "react";
import { styled, InputBase, IconButton } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useHistory } from "react-router";

const Search = styled("form")(({ theme }) => ({
  position: "relative",
  borderRadius: 10,
  border: theme.border,
  overflow: "hidden",
}));

const SearchInput = styled(InputBase)(({ theme }) => ({
  width: "100%",
  "& .MuiInputBase-input": {
    width: "100%",
    padding: theme.spacing(1, 3.8, 1, 1),
    color: theme.palette.text.primary,
  },
}));
const SearchButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  right: theme.spacing(1),
  top: "50%",
  transform: "translateY(-50%)",
  "&:hover": {
    background: "none",
  },
}));
export default function SearchBox() {
  const [search, setSearch] = useState("");
  const history = useHistory();
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!search) return;
    history.push({
      pathname: "/search",
      search: new URLSearchParams({ q: search }).toString(),
    });
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  return (
    <Search
      sx={{
        flexGrow: 1,
      }}
      onSubmit={handleSubmit}
    >
      <SearchInput
        value={search}
        onChange={handleChange}
        name="q"
        placeholder="Tìm kiếm..."
      />
      <SearchButton type="submit" disableRipple edge="end" color="primary">
        <SearchIcon />
      </SearchButton>
    </Search>
  );
}
