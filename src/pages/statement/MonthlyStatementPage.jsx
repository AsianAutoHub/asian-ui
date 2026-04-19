import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
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
  Alert,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import toast from "react-hot-toast";
import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";

const fmt = (v) =>
  v != null
    ? `₹ ${Number(v).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
    : "₹ 0.00";

function SummaryCard({ label, value, icon: Icon, bg, iconColor, valueColor }) {
  return (
    <Card>
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: bg }}>
          <Icon sx={{ color: iconColor, fontSize: 26 }} />
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

export default function MonthlyStatementPage() {
  const today = new Date().toISOString().split("T")[0];
  const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString()
    .split("T")[0];

  const [fromDate, setFromDate] = useState(firstDay);
  const [toDate, setToDate] = useState(today);
  const [statement, setStatement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleSearch = () => {
    if (!fromDate || !toDate) {
      toast.error("Please select both dates");
      return;
    }
    if (fromDate > toDate) {
      toast.error("From date cannot be after To date");
      return;
    }
    setLoading(true);
    api
      .get("/monthly-statement/data", { params: { fromDate, toDate } })
      .then((r) => setStatement(r.data.data))
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  };

  const handleDownload = async () => {
    if (!fromDate || !toDate) {
      toast.error("Please select dates");
      return;
    }
    setDownloading(true);
    try {
      const res = await api.get("/monthly-statement/pdf", {
        params: { fromDate, toDate },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `statement_${fromDate}_to_${toDate}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Statement downloaded!");
    } catch {
      toast.error("Failed to download statement");
    } finally {
      setDownloading(false);
    }
  };

  const summaryCards = statement
    ? [
        {
          label: "Cars Purchased",
          value: statement.totalCarsPurchased,
          icon: DirectionsCarIcon,
          bg: "#e8eaf6",
          iconColor: "#1a237e",
          valueColor: "#1a237e",
        },
        {
          label: "Cars Sold",
          value: statement.totalCarsSold,
          icon: DirectionsCarIcon,
          bg: "#e8f5e9",
          iconColor: "#1b5e20",
          valueColor: "#1b5e20",
        },
        {
          label: "Total DR Expenses",
          value: fmt(statement.totalDrInRange),
          icon: TrendingDownIcon,
          bg: "#ffebee",
          iconColor: "#b71c1c",
          valueColor: "#b71c1c",
        },
        {
          label: "Total CR Expenses",
          value: fmt(statement.totalCrInRange),
          icon: TrendingUpIcon,
          bg: "#e8f5e9",
          iconColor: "#1b5e20",
          valueColor: "#1b5e20",
        },
        {
          label: "Total Purchase Amt",
          value: fmt(statement.totalPurchaseAmount),
          icon: ReceiptLongIcon,
          bg: "#fff3e0",
          iconColor: "#e65100",
          valueColor: "#e65100",
        },
        {
          label: "Total Sale Amt",
          value: fmt(statement.totalSaleAmount),
          icon: ReceiptLongIcon,
          bg: "#e8f5e9",
          iconColor: "#1b5e20",
          valueColor: "#1b5e20",
        },
        {
          label: statement.totalProfit >= 0 ? "Net Profit" : "Net Loss",
          value: fmt(Math.abs(statement.totalProfit)),
          icon: statement.totalProfit >= 0 ? TrendingUpIcon : TrendingDownIcon,
          bg: statement.totalProfit >= 0 ? "#e8f5e9" : "#ffebee",
          iconColor: statement.totalProfit >= 0 ? "#1b5e20" : "#b71c1c",
          valueColor: statement.totalProfit >= 0 ? "#1b5e20" : "#b71c1c",
        },
      ]
    : [];

  return (
    <Box>
      <PageHeader title="Monthly Statement" />

      {/* Date Range Selector */}
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
            Select Date Range
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              alignItems: "flex-end",
            }}
          >
            <TextField
              label="From Date"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
              sx={{ width: 200 }}
            />
            <TextField
              label="To Date"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
              sx={{ width: 200 }}
            />
            <Button
              variant="outlined"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? "Loading..." : "Generate"}
            </Button>
            <Button
              variant="contained"
              startIcon={
                downloading ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <DownloadIcon />
                )
              }
              onClick={handleDownload}
              disabled={downloading || !statement}
            >
              {downloading ? "Downloading..." : "Download PDF"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Loading Skeletons */}
      {loading && (
        <Grid container spacing={2} mb={3}>
          {[...Array(7)].map((_, i) => (
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

      {statement && !loading && (
        <>
          {/* Summary Cards */}
          <Grid container spacing={2} mb={3}>
            {summaryCards.map((card) => (
              <Grid item xs={12} sm={6} md={3} key={card.label}>
                <SummaryCard {...card} />
              </Grid>
            ))}
          </Grid>

          {/* Car Purchase Details */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ pb: "16px !important" }}>
              <Typography
                variant="subtitle2"
                color="primary"
                fontWeight={700}
                textTransform="uppercase"
                letterSpacing={1}
                mb={2}
              >
                Car Purchase Details
              </Typography>

              {statement.carPurchases?.length === 0 ? (
                <Alert severity="info">
                  No car purchases found in this date range.
                </Alert>
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
                          "Plate",
                          "Model",
                          "Purchased From",
                          "Purchase Amt",
                          "Sale Amt",
                          "Expenses",
                          "Net Profit",
                          "Purchased By",
                          "Status",
                        ].map((h) => (
                          <TableCell key={h}>{h}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {statement.carPurchases.map((car, idx) => (
                        <TableRow
                          key={idx}
                          sx={{ bgcolor: idx % 2 === 0 ? "#fafafa" : "#fff" }}
                        >
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>
                            <Typography
                              fontWeight={600}
                              color="primary.main"
                              fontSize="0.82rem"
                            >
                              {car.numberPlate}
                            </Typography>
                          </TableCell>
                          <TableCell>{car.carModel}</TableCell>
                          <TableCell>{car.purchaseFrom}</TableCell>
                          <TableCell>{fmt(car.purchaseAmount)}</TableCell>
                          <TableCell>
                            {car.saledAmount ? fmt(car.saledAmount) : "—"}
                          </TableCell>
                          <TableCell
                            sx={{ color: "error.main", fontWeight: 600 }}
                          >
                            {fmt(car.totalExpenses)}
                          </TableCell>
                          <TableCell>
                            <Typography
                              fontWeight={700}
                              fontSize="0.82rem"
                              color={
                                car.netProfit >= 0
                                  ? "success.main"
                                  : "error.main"
                              }
                            >
                              {fmt(car.netProfit)}
                            </Typography>
                          </TableCell>
                          <TableCell>{car.purchasedByName}</TableCell>
                          <TableCell>
                            <Chip
                              label={car.status}
                              size="small"
                              sx={{
                                fontSize: "0.68rem",
                                fontWeight: 700,
                                bgcolor:
                                  car.status === "SOLD" ? "#e8f5e9" : "#fff8e1",
                                color:
                                  car.status === "SOLD" ? "#1b5e20" : "#e65100",
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>

          {/* User Metrics in Range */}
          <Card>
            <CardContent sx={{ pb: "16px !important" }}>
              <Typography
                variant="subtitle2"
                color="primary"
                fontWeight={700}
                textTransform="uppercase"
                letterSpacing={1}
                mb={2}
              >
                User Metrics in Range
              </Typography>

              {statement.userMetrics?.length === 0 ? (
                <Alert severity="info">
                  No user activity found in this date range.
                </Alert>
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
                          "User",
                          "Invested",
                          "DR (Out)",
                          "CR (In)",
                          "Net Expense",
                          "Balance",
                        ].map((h) => (
                          <TableCell key={h}>{h}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {statement.userMetrics.map((u, idx) => (
                        <TableRow
                          key={idx}
                          sx={{ bgcolor: idx % 2 === 0 ? "#fafafa" : "#fff" }}
                        >
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>
                            <Typography fontWeight={600} fontSize="0.85rem">
                              {u.userName}
                            </Typography>
                            <Typography
                              fontSize="0.75rem"
                              color="text.secondary"
                            >
                              {u.email}
                            </Typography>
                          </TableCell>
                          <TableCell>{fmt(u.amountInvested)}</TableCell>
                          <TableCell
                            sx={{ color: "error.main", fontWeight: 600 }}
                          >
                            {fmt(u.totalDr)}
                          </TableCell>
                          <TableCell
                            sx={{ color: "success.main", fontWeight: 600 }}
                          >
                            {fmt(u.totalCr)}
                          </TableCell>
                          <TableCell>{fmt(u.netExpense)}</TableCell>
                          <TableCell>
                            <Typography
                              fontWeight={700}
                              fontSize="0.85rem"
                              color={
                                u.balanceAmount >= 0
                                  ? "success.main"
                                  : "error.main"
                              }
                            >
                              {fmt(u.balanceAmount)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Empty state */}
      {!statement && !loading && (
        <Card>
          <CardContent sx={{ py: 6, textAlign: "center" }}>
            <ReceiptLongIcon sx={{ fontSize: 56, color: "#e0e0e0", mb: 2 }} />
            <Typography color="text.secondary">
              Select a date range and click Generate to view the statement
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
