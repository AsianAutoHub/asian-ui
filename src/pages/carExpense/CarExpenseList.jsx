import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  MenuItem,
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";
import { useSearchParams } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";

const fmt = (v) =>
  v != null
    ? `₹ ${Math.abs(Number(v)).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
    : "—";

export default function CarExpenseList() {
  const [searchParams] = useSearchParams();
  const [expenses, setExpenses] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [preview, setPreview] = useState(null);
  const [selectedCar, setSelectedCar] = useState(
    searchParams.get("carId") || "",
  );
  const [cars, setCars] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/car-purchases/get-all", { params: { page: 0, size: 100 } })
      .then((r) => setCars(r.data.data.content || []))
      .catch((e) => toast.error(e.message));
  }, []);

  useEffect(() => {
    if (selectedCar) loadPreview(selectedCar);
  }, [selectedCar]);

  const loadPreview = (carId) => {
    setLoading(true);
    setPreview(null);
    api
      .get(`/car-expenses/car/${carId}`)
      .then((r) => setExpenses(r.data.data))
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this expense?")) return;
    api
      .delete(`/car-expenses/${id}`)
      .then(() => {
        toast.success("Deleted");
        fetchAll(page, rowsPerPage, search);
      })
      .catch((e) => toast.error(e.message));
  };

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography
            variant="subtitle2"
            color="primary"
            fontWeight={700}
            textTransform="uppercase"
            letterSpacing={1}
            mb={2}
          >
            Select Car to Get Expenses
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <TextField
              select
              label="Select Car"
              value={selectedCar}
              onChange={(e) => setSelectedCar(e.target.value)}
              sx={{ minWidth: 320 }}
            >
              <MenuItem value="">-- Select a car --</MenuItem>
              {cars.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.numberPlate} — {c.model}
                </MenuItem>
              ))}
            </TextField>

            <Button
              variant="outlined"
              startIcon={<VisibilityIcon />}
              onClick={() => loadPreview(selectedCar)}
              disabled={!selectedCar || loading}
            >
              Preview
            </Button>
          </Box>
        </CardContent>
      </Card>

      <PageHeader
        title="Car Expenses"
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/car-expenses/new")}
          >
            Add Expense
          </Button>
        }
      />

      {selectedCar && (
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
                      "Car",
                      "Purpose",
                      "Payment Mode",
                      "Type",
                      "Amount",
                      "Date",
                      "Paid By",
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
                        {[...Array(9)].map((_, j) => (
                          <TableCell key={j}>
                            <Skeleton />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : expenses.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        align="center"
                        sx={{ py: 5, color: "text.secondary" }}
                      >
                        No expenses found
                      </TableCell>
                    </TableRow>
                  ) : (
                    expenses.map((e, idx) => {
                      const isCR = e.paymentType === "CR";
                      return (
                        <TableRow key={e.id} hover>
                          <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                          <TableCell>
                            <Typography
                              fontWeight={600}
                              color="primary.main"
                              fontSize="0.85rem"
                            >
                              {e.carNumberPlate}
                            </Typography>
                          </TableCell>
                          <TableCell>{e.purpose}</TableCell>
                          <TableCell>{e.paymentMode}</TableCell>
                          <TableCell>
                            <Chip
                              label={e.paymentType}
                              size="small"
                              sx={{
                                fontSize: "0.68rem",
                                fontWeight: 700,
                                bgcolor: isCR ? "#e8f5e9" : "#ffebee",
                                color: isCR ? "#1b5e20" : "#b71c1c",
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography
                              fontSize="0.85rem"
                              fontWeight={600}
                              color={isCR ? "success.main" : "error.main"}
                            >
                              {/* {isCR ? "+" : "-"} */}
                              {fmt(e.amount)}
                            </Typography>
                          </TableCell>
                          <TableCell>{e.expenseDate}</TableCell>
                          <TableCell>{e.paidByFirstname}</TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", gap: 0.5 }}>
                              <Tooltip title="Edit">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() =>
                                    navigate(`/car-expenses/edit/${e.id}`)
                                  }
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDelete(e.id)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
