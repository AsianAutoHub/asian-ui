import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Skeleton,
} from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";

const fmt = (v) =>
  v != null
    ? `₹ ${Number(v).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
    : "—";

function StatCard({ label, value, icon: Icon, color, bg }) {
  return (
    <Card>
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: bg, display: "flex" }}>
          <Icon sx={{ color, fontSize: 28 }} />
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            {label}
          </Typography>
          <Typography variant="h6" fontWeight={700} color="text.primary">
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [purchases, setPurchases] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [totalPurchaseCount, setTotalPurchaseCount] = useState(0);
  const [totalExpenseCount, setTotalExpenseCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get("/car-purchases/get-all", { params: { page: 0, size: 10 } }),

      api.get("/car-expenses/get-all", { params: { page: 0, size: 100 } }),
    ])
      .then(([p, e]) => {
        setPurchases(p.data.data?.content || []);
        setExpenses(e.data.data?.content || []);

        // ✅ use totalElements from backend for accurate counts
        setTotalPurchaseCount(p.data.data?.totalElements || 0);
        setTotalExpenseCount(e.data.data?.totalElements || 0);
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  // ✅ these now work correctly — purchases & expenses are arrays
  const totalPurchase = purchases.reduce(
    (s, p) => s + (p.purchaseAmount || 0),
    0,
  );
  const totalSale = purchases.reduce((s, p) => s + (p.saledAmount || 0), 0);
  const totalExpense = expenses.reduce(
    (s, e) => s + (e.paymentType === "DR" ? e.amount || 0 : -(e.amount || 0)),
    0,
  );
  const netProfit = totalSale - totalPurchase - totalExpense;
  const isProfit = netProfit >= 0;

  const stats = [
    {
      label: "Total Purchases",
      value: totalPurchaseCount,
      icon: DirectionsCarIcon,
      color: "#1a237e",
      bg: "#e8eaf6",
    },
    {
      label: "Total Expenses",
      value: totalExpenseCount,
      icon: ReceiptLongIcon,
      color: "#e65100",
      bg: "#fff3e0",
    },
    {
      label: "Total Sale Value",
      value: fmt(totalSale),
      icon: AccountBalanceIcon,
      color: "#1b5e20",
      bg: "#e8f5e9",
    },
    {
      label: isProfit ? "Net Profit" : "Net Loss",
      value: fmt(Math.abs(netProfit)),
      icon: TrendingUpIcon,
      color: isProfit ? "#1b5e20" : "#b71c1c",
      bg: isProfit ? "#e8f5e9" : "#ffebee",
    },
  ];

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} color="primary.main" mb={3}>
        Dashboard
      </Typography>

      {/* Stat Cards */}
      {/* <Grid container spacing={2} mb={3}>
        {stats.map((s) => (
          <Grid item xs={12} sm={6} md={3} key={s.label}>
            {loading ? (
              <Card>
                <CardContent>
                  <Skeleton height={60} />
                </CardContent>
              </Card>
            ) : (
              <StatCard {...s} />
            )}
          </Grid>
        ))}
      </Grid> */}

      {/* Recent Purchases Table */}
      <Card>
        <CardContent sx={{ pb: "16px !important" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              Stock
            </Typography>
            <Button
              size="small"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate("/car-purchases")}
              sx={{ color: "primary.main" }}
            >
              View All
            </Button>
          </Box>

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
                    "Purchased By",
                    "Status",
                  ].map((h) => (
                    <TableCell key={h}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  [...Array(4)].map((_, i) => (
                    <TableRow key={i}>
                      {[...Array(7)].map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : purchases.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      align="center"
                      sx={{ py: 4, color: "text.secondary" }}
                    >
                      No purchases found
                    </TableCell>
                  </TableRow>
                ) : (
                  purchases.map((p, idx) => (
                    <TableRow key={p.id} hover>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell
                        sx={{ fontWeight: 600, color: "primary.main" }}
                      >
                        {p.numberPlate}
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
                      <TableCell>{p.purchasedByFirstname}</TableCell>
                      <TableCell>
                        <Chip
                          label={p.saledAmount ? "Sold" : "Available"}
                          size="small"
                          color={p.saledAmount ? "success" : "warning"}
                          sx={{ fontSize: "0.68rem" }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}

// import React, { useEffect, useState } from "react";
// import {
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   Box,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
//   Chip,
//   Skeleton,
// } from "@mui/material";
// import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
// import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
// import TrendingUpIcon from "@mui/icons-material/TrendingUp";
// import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import api from "../../api/axios";

// const fmt = (v) =>
//   v != null
//     ? `₹ ${Number(v).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
//     : "—";

// function StatCard({ label, value, icon: Icon, color, bg }) {
//   return (
//     <Card>
//       <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//         <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: bg, display: "flex" }}>
//           <Icon sx={{ color, fontSize: 28 }} />
//         </Box>
//         <Box>
//           <Typography variant="caption" color="text.secondary" fontWeight={500}>
//             {label}
//           </Typography>
//           <Typography variant="h6" fontWeight={700} color="text.primary">
//             {value}
//           </Typography>
//         </Box>
//       </CardContent>
//     </Card>
//   );
// }

// export default function Dashboard() {
//   const [purchases, setPurchases] = useState([]);
//   const [expenses, setExpenses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     Promise.all([
//       api.get("/car-purchases/get-all"),
//       api.get("/car-expenses/get-all"),
//     ])
//       .then(([p, e]) => {
//         setPurchases(p.data.data || []);
//         setExpenses(e.data.data || []);
//       })
//       .catch((err) => toast.error(err.message))
//       .finally(() => setLoading(false));
//   }, []);

//   const totalPurchase = purchases.reduce(
//     (s, p) => s + (p.purchaseAmount || 0),
//     0,
//   );
//   const totalSale = purchases.reduce((s, p) => s + (p.saledAmount || 0), 0);
//   const totalExpense = expenses.reduce(
//     (s, e) => s + (e.paymentType === "DR" ? e.amount : -(e.amount || 0)),
//     0,
//   );
//   const netProfit = totalSale - totalPurchase - totalExpense;
//   const isProfit = netProfit >= 0;

//   const stats = [
//     {
//       label: "Total Purchases",
//       value: purchases.length,
//       icon: DirectionsCarIcon,
//       color: "#1a237e",
//       bg: "#e8eaf6",
//     },
//     {
//       label: "Total Expenses",
//       value: expenses.length,
//       icon: ReceiptLongIcon,
//       color: "#e65100",
//       bg: "#fff3e0",
//     },
//     {
//       label: "Total Sale Value",
//       value: fmt(totalSale),
//       icon: AccountBalanceIcon,
//       color: "#1b5e20",
//       bg: "#e8f5e9",
//     },
//     {
//       label: isProfit ? "Net Profit" : "Net Loss",
//       value: fmt(Math.abs(netProfit)),
//       icon: TrendingUpIcon,
//       color: isProfit ? "#1b5e20" : "#b71c1c",
//       bg: isProfit ? "#e8f5e9" : "#ffebee",
//     },
//   ];

//   return (
//     <Box>
//       <Typography variant="h5" fontWeight={700} color="primary.main" mb={3}>
//         Dashboard
//       </Typography>

//       {/* Stat Cards */}
//       <Grid container spacing={2} mb={3}>
//         {stats.map((s) => (
//           <Grid item xs={12} sm={6} md={3} key={s.label}>
//             {loading ? (
//               <Card>
//                 <CardContent>
//                   <Skeleton height={60} />
//                 </CardContent>
//               </Card>
//             ) : (
//               <StatCard {...s} />
//             )}
//           </Grid>
//         ))}
//       </Grid>

//       {/* Recent Purchases */}
//       <Card>
//         <CardContent sx={{ pb: "16px !important" }}>
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               mb: 2,
//             }}
//           >
//             <Typography variant="h6" fontWeight={600}>
//               Recent Car Purchases
//             </Typography>
//             <Button
//               size="small"
//               endIcon={<ArrowForwardIcon />}
//               onClick={() => navigate("/car-purchases")}
//               sx={{ color: "primary.main" }}
//             >
//               View All
//             </Button>
//           </Box>

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
//                     "Purchased By",
//                     "Status",
//                   ].map((h) => (
//                     <TableCell key={h}>{h}</TableCell>
//                   ))}
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {loading
//                   ? [...Array(4)].map((_, i) => (
//                       <TableRow key={i}>
//                         {[...Array(7)].map((_, j) => (
//                           <TableCell key={j}>
//                             <Skeleton />
//                           </TableCell>
//                         ))}
//                       </TableRow>
//                     ))
//                   : purchases.slice(0, 6).map((p, idx) => (
//                       <TableRow key={p.id} hover>
//                         <TableCell>{idx + 1}</TableCell>
//                         <TableCell
//                           sx={{ fontWeight: 600, color: "primary.main" }}
//                         >
//                           {p.numberPlate}
//                         </TableCell>
//                         <TableCell>{p.model}</TableCell>
//                         <TableCell>{fmt(p.purchaseAmount)}</TableCell>
//                         <TableCell>
//                           {p.saledAmount ? fmt(p.saledAmount) : "—"}
//                         </TableCell>
//                         <TableCell>{p.purchasedByFirstname}</TableCell>
//                         <TableCell>
//                           <Chip
//                             label={p.saledAmount ? "Sold" : "Available"}
//                             size="small"
//                             color={p.saledAmount ? "success" : "warning"}
//                             sx={{ fontSize: "0.68rem" }}
//                           />
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                 {!loading && purchases.length === 0 && (
//                   <TableRow>
//                     <TableCell
//                       colSpan={7}
//                       align="center"
//                       sx={{ py: 4, color: "text.secondary" }}
//                     >
//                       No purchases found
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }
