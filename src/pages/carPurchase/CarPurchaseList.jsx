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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArticleIcon from "@mui/icons-material/Article";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";

const fmt = (v) =>
  v != null
    ? `₹ ${Number(v).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
    : "—";

export default function CarPurchaseList() {
  const [purchases, setPurchases] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState(""); // local input state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const navigate = useNavigate();

  // ✅ Fetch from backend with page, size, search params
  const fetchAll = useCallback((pg, size, q) => {
    setLoading(true);
    api
      .get("/car-purchases/get-all", {
        params: { page: pg, size, search: q },
      })
      .then((r) => {
        const data = r.data.data;
        setPurchases(data.content || []);
        setTotalElements(data.totalElements || 0);
        setTotalPages(data.totalPages || 0);
      })
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Fetch on page, rowsPerPage, or search change
  useEffect(() => {
    fetchAll(page, rowsPerPage, search);
  }, [page, rowsPerPage, search, fetchAll]);

  // ✅ Debounce search — wait 500ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(0); // reset to first page on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleDelete = (id) => {
    if (!window.confirm("Delete this car purchase?")) return;
    api
      .delete(`/car-purchases/${id}`)
      .then(() => {
        toast.success("Deleted successfully");
        fetchAll(page, rowsPerPage, search);
      })
      .catch((e) => toast.error(e.message));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      <PageHeader
        title="Car Purchases"
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/car-purchases/new")}
          >
            Add Purchase
          </Button>
        }
      />

      <Card>
        <CardContent sx={{ pb: "0 !important" }}>
          {/* Search */}
          <TextField
            placeholder="Search by plate, model or buyer..."
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
                  {[
                    "#",
                    "Number Plate",
                    "Model",
                    "Colour",
                    "Fuel Type",
                    "Kmps",
                    "Manufactured Year",
                    "Purchase Amt",
                    "Sale Amt",
                    "Purchase Date",
                    "Purchased By",
                    "Status",
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
                ) : purchases.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      align="center"
                      sx={{ py: 5, color: "text.secondary" }}
                    >
                      No records found
                    </TableCell>
                  </TableRow>
                ) : (
                  purchases.map((p, idx) => (
                    <TableRow key={p.id} hover>
                      {/* ✅ Correct serial number across pages */}
                      <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                      <TableCell>
                        <Typography
                          fontWeight={600}
                          color="primary.main"
                          fontSize="0.85rem"
                        >
                          {p.numberPlate}
                        </Typography>
                      </TableCell>
                      <TableCell>{p.model}</TableCell>

                      <TableCell>{p.colour}</TableCell>
                      <TableCell>{p.fuelType}</TableCell>
                      <TableCell>{p.kmps}</TableCell>
                      <TableCell>{p.manufacturedYear}</TableCell>
                      <TableCell>{fmt(p.purchaseAmount)}</TableCell>
                      <TableCell>
                        {p.saledAmount ? fmt(p.saledAmount) : "—"}
                      </TableCell>
                      <TableCell>{p.purchaseDate}</TableCell>
                      <TableCell>{p.purchasedByFirstname}</TableCell>
                      <TableCell>
                        <Chip
                          label={p.saledAmount ? "Sold" : "Available"}
                          size="small"
                          color={p.saledAmount ? "success" : "warning"}
                          sx={{ fontSize: "0.68rem" }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() =>
                                navigate(`/car-purchases/edit/${p.id}`)
                              }
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(p.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Invoice">
                            <IconButton
                              size="small"
                              sx={{ color: "#1b5e20" }}
                              onClick={() => navigate(`/invoice?carId=${p.id}`)}
                            >
                              <ArticleIcon fontSize="small" />
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

          {/* ✅ Pagination driven by backend totalElements */}
          <TablePagination
            component="div"
            count={totalElements}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Rows per page:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} of ${count} records`
            }
            sx={{
              borderTop: "1px solid #e0e0e0",
              ".MuiTablePagination-toolbar": { minHeight: 48 },
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

// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Button,
//   Chip,
//   Tooltip,
//   Typography,
//   TextField,
//   InputAdornment,
//   Skeleton,
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import ArticleIcon from "@mui/icons-material/Article";
// import SearchIcon from "@mui/icons-material/Search";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import api from "../../api/axios";
// import PageHeader from "../../components/PageHeader";

// const fmt = (v) =>
//   v != null
//     ? `₹ ${Number(v).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
//     : "—";

// export default function CarPurchaseList() {
//   const [purchases, setPurchases] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const navigate = useNavigate();

//   const fetchAll = () => {
//     setLoading(true);
//     api
//       .get("/car-purchases/get-all")
//       .then((r) => {
//         setPurchases(r.data.data || []);
//         setFiltered(r.data.data || []);
//       })
//       .catch((e) => toast.error(e.message))
//       .finally(() => setLoading(false));
//   };

//   useEffect(() => {
//     fetchAll();
//   }, []);

//   useEffect(() => {
//     const q = search.toLowerCase();
//     setFiltered(
//       purchases.filter(
//         (p) =>
//           p.numberPlate?.toLowerCase().includes(q) ||
//           p.model?.toLowerCase().includes(q) ||
//           p.purchasedByFirstname?.toLowerCase().includes(q),
//       ),
//     );
//   }, [search, purchases]);

//   const handleDelete = (id) => {
//     if (!window.confirm("Delete this car purchase?")) return;
//     api
//       .delete(`/car-purchases/${id}`)
//       .then(() => {
//         toast.success("Deleted successfully");
//         fetchAll();
//       })
//       .catch((e) => toast.error(e.message));
//   };

//   return (
//     <Box>
//       <PageHeader
//         title="Car Purchases"
//         action={
//           <Button
//             variant="contained"
//             startIcon={<AddIcon />}
//             onClick={() => navigate("/car-purchases/new")}
//           >
//             Add Purchase
//           </Button>
//         }
//       />

//       <Card>
//         <CardContent sx={{ pb: "16px !important" }}>
//           {/* Search */}
//           <TextField
//             placeholder="Search by plate, model or buyer..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             size="small"
//             sx={{ mb: 2, width: 320 }}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon fontSize="small" color="action" />
//                 </InputAdornment>
//               ),
//             }}
//           />

//           <TableContainer
//             component={Paper}
//             elevation={0}
//             sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}
//           >
//             <Table size="small">
//               <TableHead>
//                 <TableRow>
//                   {[
//                     "#",
//                     "Number Plate",
//                     "Model",
//                     "Purchase Amt",
//                     "Sale Amt",
//                     "Purchase Date",
//                     "Purchased By",
//                     "Status",
//                     "Actions",
//                   ].map((h) => (
//                     <TableCell key={h}>{h}</TableCell>
//                   ))}
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {loading ? (
//                   [...Array(5)].map((_, i) => (
//                     <TableRow key={i}>
//                       {[...Array(9)].map((_, j) => (
//                         <TableCell key={j}>
//                           <Skeleton />
//                         </TableCell>
//                       ))}
//                     </TableRow>
//                   ))
//                 ) : filtered.length === 0 ? (
//                   <TableRow>
//                     <TableCell
//                       colSpan={9}
//                       align="center"
//                       sx={{ py: 5, color: "text.secondary" }}
//                     >
//                       No records found
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   filtered.map((p, idx) => (
//                     <TableRow key={p.id} hover>
//                       <TableCell>{idx + 1}</TableCell>
//                       <TableCell>
//                         <Typography
//                           fontWeight={600}
//                           color="primary.main"
//                           fontSize="0.85rem"
//                         >
//                           {p.numberPlate}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>{p.model}</TableCell>
//                       <TableCell>{fmt(p.purchaseAmount)}</TableCell>
//                       <TableCell>
//                         {p.saledAmount ? fmt(p.saledAmount) : "—"}
//                       </TableCell>
//                       <TableCell>{p.purchaseDate}</TableCell>
//                       <TableCell>{p.purchasedByFirstname}</TableCell>
//                       <TableCell>
//                         <Chip
//                           label={p.saledAmount ? "Sold" : "Available"}
//                           size="small"
//                           color={p.saledAmount ? "success" : "warning"}
//                           sx={{ fontSize: "0.68rem" }}
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <Box sx={{ display: "flex", gap: 0.5 }}>
//                           <Tooltip title="Edit">
//                             <IconButton
//                               size="small"
//                               color="primary"
//                               onClick={() =>
//                                 navigate(`/car-purchases/edit/${p.id}`)
//                               }
//                             >
//                               <EditIcon fontSize="small" />
//                             </IconButton>
//                           </Tooltip>
//                           <Tooltip title="Delete">
//                             <IconButton
//                               size="small"
//                               color="error"
//                               onClick={() => handleDelete(p.id)}
//                             >
//                               <DeleteIcon fontSize="small" />
//                             </IconButton>
//                           </Tooltip>
//                           <Tooltip title="Invoice">
//                             <IconButton
//                               size="small"
//                               sx={{ color: "#1b5e20" }}
//                               onClick={() => navigate(`/invoice?carId=${p.id}`)}
//                             >
//                               <ArticleIcon fontSize="small" />
//                             </IconButton>
//                           </Tooltip>
//                         </Box>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>

//           <Typography
//             variant="caption"
//             color="text.secondary"
//             sx={{ mt: 1, display: "block" }}
//           >
//             Showing {filtered.length} of {purchases.length} records
//           </Typography>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }
