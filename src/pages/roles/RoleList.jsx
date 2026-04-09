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
  Tooltip,
  Typography,
  Skeleton,
  TablePagination,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";

export default function RoleList() {
  const [roles, setRoles] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const fetchAll = useCallback((pg, size) => {
    setLoading(true);
    api
      .get("/roles", { params: { page: pg, size } })
      .then((r) => {
        setRoles(r.data.data.content || []);
        setTotalElements(r.data.data.totalElements || 0);
      })
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchAll(page, rowsPerPage);
  }, [page, rowsPerPage, fetchAll]);

  const handleDelete = (id) => {
    if (!window.confirm("Delete this role?")) return;
    api
      .delete(`/roles/${id}`)
      .then(() => {
        toast.success("Role deleted");
        fetchAll(page, rowsPerPage);
      })
      .catch((e) => toast.error(e.message));
  };

  return (
    <Box>
      <PageHeader
        title="Roles"
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/roles/new")}
          >
            Add Role
          </Button>
        }
      />

      <Card>
        <CardContent sx={{ pb: "0 !important" }}>
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  {[
                    "#",
                    "Role Name",
                    "Created By",
                    "Created On",
                    "Actions",
                  ].map((h) => (
                    <TableCell key={h}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  [...Array(rowsPerPage)].map((_, i) => (
                    <TableRow key={i}>
                      {[...Array(5)].map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : roles.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      align="center"
                      sx={{ py: 5, color: "text.secondary" }}
                    >
                      No roles found
                    </TableCell>
                  </TableRow>
                ) : (
                  roles.map((r, idx) => (
                    <TableRow key={r.id} hover>
                      <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                      <TableCell>
                        <Typography
                          fontWeight={600}
                          color="primary.main"
                          fontSize="0.85rem"
                        >
                          {r.role}
                        </Typography>
                      </TableCell>
                      <TableCell>{r.createdBy || "—"}</TableCell>
                      <TableCell>
                        {r.createdOn
                          ? new Date(r.createdOn).toLocaleDateString("en-IN")
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => navigate(`/roles/edit/${r.id}`)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(r.id)}
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
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="Rows per page:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} of ${count} roles`
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
