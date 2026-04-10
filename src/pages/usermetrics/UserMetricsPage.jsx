import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  MenuItem,
  TextField,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Skeleton,
  Alert,
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SavingsIcon from "@mui/icons-material/Savings";
import toast from "react-hot-toast";
import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";

const fmt = (v) =>
  v != null
    ? `₹ ${Number(v).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
    : "₹ 0.00";

// ── Metric Card ──
function MetricCard({
  label,
  value,
  icon: Icon,
  bgColor,
  iconColor,
  valueColor,
}) {
  return (
    <Card>
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box
          sx={{ p: 1.5, borderRadius: 2, bgcolor: bgColor, display: "flex" }}
        >
          <Icon sx={{ color: iconColor, fontSize: 28 }} />
        </Box>
        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={500}
            display="block"
          >
            {label}
          </Typography>
          <Typography
            variant="h6"
            fontWeight={700}
            color={valueColor || "text.primary"}
          >
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function UserMetricsPage() {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);

  // fetch users for dropdown
  useEffect(() => {
    api
      .get("/user/get-all", { params: { page: 0, size: 100 } })
      .then((r) => setUsers(r.data.data.content || []))
      .catch((e) => toast.error(e.message));
  }, []);

  // fetch metrics when user changes
  useEffect(() => {
    if (!userId) {
      setMetrics(null);
      return;
    }
    setLoading(true);
    api
      .get(`/user-metrics/${userId}`)
      .then((r) => setMetrics(r.data.data))
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [userId]);

  const cards = metrics
    ? [
        {
          label: "Amount Invested",
          value: fmt(metrics.amountInvested),
          icon: AccountBalanceWalletIcon,
          bgColor: "#e8eaf6",
          iconColor: "#1a237e",
          valueColor: "#1a237e",
        },
        {
          label: "Total DR Expense",
          value: fmt(metrics.totalDrExpense),
          icon: TrendingDownIcon,
          bgColor: "#ffebee",
          iconColor: "#b71c1c",
          valueColor: "#b71c1c",
        },
        {
          label: "Total CR Expense",
          value: fmt(metrics.totalCrExpense),
          icon: TrendingUpIcon,
          bgColor: "#e8f5e9",
          iconColor: "#1b5e20",
          valueColor: "#1b5e20",
        },
        {
          label: "Balance Amount",
          value: fmt(metrics.balanceAmount),
          icon: SavingsIcon,
          bgColor: metrics.balanceAmount >= 0 ? "#e8f5e9" : "#ffebee",
          iconColor: metrics.balanceAmount >= 0 ? "#1b5e20" : "#b71c1c",
          valueColor: metrics.balanceAmount >= 0 ? "#1b5e20" : "#b71c1c",
        },
      ]
    : [];

  return (
    <Box>
      <PageHeader title="User Metrics" />

      {/* User Selector */}
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
            Select User to View Metrics
          </Typography>
          <TextField
            select
            label="Select User"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            sx={{ minWidth: 320 }}
            size="small"
          >
            <MenuItem value="">-- Select a user --</MenuItem>
            {users.map((u) => (
              <MenuItem key={u.id} value={u.id}>
                {u.firstname} {u.lastname} — {u.email}
              </MenuItem>
            ))}
          </TextField>
        </CardContent>
      </Card>

      {/* Loading */}
      {loading && (
        <Grid container spacing={2} mb={3}>
          {[...Array(4)].map((_, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Card>
                <CardContent>
                  <Skeleton height={60} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Metrics */}
      {metrics && !loading && (
        <>
          {/* User Info Banner */}
          <Box
            sx={{
              bgcolor: "#1a237e",
              borderRadius: 2,
              px: 3,
              py: 2,
              mb: 3,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                bgcolor: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography fontWeight={800} color="#1a237e" fontSize="1rem">
                {metrics.userName
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </Typography>
            </Box>
            <Box>
              <Typography fontWeight={700} color="#fff" fontSize="1rem">
                {metrics.userName}
              </Typography>
              <Typography color="#9fa8da" fontSize="0.82rem">
                {metrics.email}
              </Typography>
            </Box>
          </Box>

          {/* 4 Metric Cards */}
          <Grid container spacing={2} mb={3}>
            {cards.map((card) => (
              <Grid item xs={12} sm={6} md={3} key={card.label}>
                <MetricCard {...card} />
              </Grid>
            ))}
          </Grid>

          {/* Net Expense Summary */}
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
                Summary
              </Typography>
              <Grid container spacing={2}>
                {[
                  [
                    "Amount Invested",
                    fmt(metrics.amountInvested),
                    "text.primary",
                  ],
                  [
                    "Total DR (Money Out)",
                    fmt(metrics.totalDrExpense),
                    "#b71c1c",
                  ],
                  [
                    "Total CR (Money In)",
                    fmt(metrics.totalCrExpense),
                    "#1b5e20",
                  ],
                  // ["Net Expense (DR - CR)", fmt(metrics.netExpense), "#1300e6"],
                  [
                    "Total Profit (CR - DR)",
                    fmt(metrics.netExpense),
                    "#1300e6",
                  ],
                ].map(([label, value, color]) => (
                  <Grid item xs={12} sm={6} key={label}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        borderBottom: "1px dashed #e0e0e0",
                        py: 1,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {label}
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        color={color}
                      >
                        {value}
                      </Typography>
                    </Box>
                  </Grid>
                ))}

                {/* Balance — full width */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      bgcolor:
                        metrics.balanceAmount >= 0 ? "#e8f5e9" : "#ffebee",
                      borderRadius: 2,
                      px: 2,
                      py: 1.5,
                    }}
                  >
                    <Typography
                      fontWeight={700}
                      color={metrics.balanceAmount >= 0 ? "#1b5e20" : "#b71c1c"}
                    >
                      Balance Amount (Invested - Net Expense)
                    </Typography>
                    <Typography
                      fontWeight={700}
                      fontSize="1.1rem"
                      color={metrics.balanceAmount >= 0 ? "#1b5e20" : "#b71c1c"}
                    >
                      {fmt(metrics.balanceAmount)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Expense Breakdown Table */}
          {/* <Card>
            <CardContent sx={{ pb: "16px !important" }}>
              <Typography
                variant="subtitle2"
                color="primary"
                fontWeight={700}
                textTransform="uppercase"
                letterSpacing={1}
                mb={2}
              >
                Expense Breakdown
              </Typography>

              {metrics.expenses?.length === 0 ? (
                <Alert severity="info">No expenses found for this user.</Alert>
              ) : (
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
                          "Mode",
                          "Type",
                          "Amount",
                          "Date",
                        ].map((h) => (
                          <TableCell key={h}>{h}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {metrics.expenses.map((exp, idx) => {
                        const isCR = exp.paymentType === "CR";
                        return (
                          <TableRow
                            key={idx}
                            sx={{ bgcolor: idx % 2 === 0 ? "#fafafa" : "#fff" }}
                          >
                            <TableCell>{idx + 1}</TableCell>
                            <TableCell>
                              <Typography
                                fontWeight={600}
                                color="primary.main"
                                fontSize="0.85rem"
                              >
                                {exp.carNumberPlate}
                              </Typography>
                            </TableCell>
                            <TableCell>{exp.purpose}</TableCell>
                            <TableCell>{exp.paymentMode}</TableCell>
                            <TableCell>
                              <Chip
                                label={exp.paymentType}
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
                                {isCR ? "+" : "-"}
                                {fmt(exp.amount)}
                              </Typography>
                            </TableCell>
                            <TableCell>{exp.expenseDate}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card> */}
        </>
      )}

      {/* Empty state */}
      {!userId && !loading && (
        <Card>
          <CardContent sx={{ py: 6, textAlign: "center" }}>
            <AccountBalanceWalletIcon
              sx={{ fontSize: 56, color: "#e0e0e0", mb: 2 }}
            />
            <Typography color="text.secondary">
              Select a user above to view their investment and expense metrics
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
