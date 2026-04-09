import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Chip,
  Tooltip,
  Typography,
  TextField,
  InputAdornment,
  Skeleton,
  TablePagination,
  Avatar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const fetchAll = useCallback((pg, size, q) => {
    setLoading(true);
    api
      .get("/user/get-all", { params: { page: pg, size, search: q } })
      .then((r) => {
        setUsers(r.data.data.content || []);
        setTotalElements(r.data.data.totalElements || 0);
      })
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchAll(page, rowsPerPage, search);
  }, [page, rowsPerPage, search, fetchAll]);

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(t);
  }, [searchInput]);

  const handleDelete = (id) => {
    if (!window.confirm("Delete this user?")) return;
    api
      .delete(`/user/${id}`)
      .then(() => {
        toast.success("User deleted");
        fetchAll(page, rowsPerPage, search);
      })
      .catch((e) => toast.error(e.message));
  };

  // generate avatar initials
  const initials = (u) =>
    `${u.firstname?.[0] || ""}${u.lastname?.[0] || ""}`.toUpperCase();

  return (
    <Box>
      <PageHeader
        title="Users"
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/users/new")}
          >
            Add User
          </Button>
        }
      />

      <Card>
        <CardContent sx={{ pb: "0 !important" }}>
          <TextField
            placeholder="Search by name, email or phone..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            size="small"
            sx={{ mb: 2, width: 320 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TableContainer
            component={Paper}
            elevation={0}
            sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  {["#", "User", "Email", "Phone", "Roles", "Actions"].map(
                    (h) => (
                      <TableCell key={h}>{h}</TableCell>
                    ),
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  [...Array(rowsPerPage)].map((_, i) => (
                    <TableRow key={i}>
                      {[...Array(6)].map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      align="center"
                      sx={{ py: 5, color: "text.secondary" }}
                    >
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((u, idx) => (
                    <TableRow key={u.id} hover>
                      <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: "#1a237e",
                              fontSize: "0.75rem",
                            }}
                          >
                            {initials(u)}
                          </Avatar>
                          <Box>
                            <Typography fontWeight={600} fontSize="0.85rem">
                              {u.firstname} {u.lastname}
                            </Typography>
                            <Typography
                              fontSize="0.75rem"
                              color="text.secondary"
                            >
                              @{u.username || u.email?.split("@")[0]}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.phone || "—"}</TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}
                        >
                          {u.roles?.map((r) => (
                            <Chip
                              key={r.id}
                              label={r.name}
                              size="small"
                              sx={{
                                fontSize: "0.68rem",
                                bgcolor: "#e8eaf6",
                                color: "#1a237e",
                                fontWeight: 600,
                              }}
                            />
                          ))}
                          {(!u.roles || u.roles.length === 0) && (
                            <Typography
                              fontSize="0.8rem"
                              color="text.secondary"
                            >
                              —
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => navigate(`/users/edit/${u.id}`)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(u.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={totalElements}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Rows per page:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} of ${count} users`
            }
            sx={{
              borderTop: "1px solid #e0e0e0",
              ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
                {
                  fontSize: "0.8rem",
                },
            }}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
