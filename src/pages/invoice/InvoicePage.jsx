import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  MenuItem,
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
  CircularProgress,
  Skeleton,
  Alert,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";

const fmt = (v) =>
  v != null
    ? `₹ ${Number(v).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
    : "N/A";

function InfoBox({ label, value }) {
  return (
    <Box sx={{ bgcolor: "#f4f6f9", borderRadius: 2, p: 1.5 }}>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600} color="text.primary">
        {value || "N/A"}
      </Typography>
    </Box>
  );
}

export default function InvoicePage() {
  const [searchParams] = useSearchParams();
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(
    searchParams.get("carId") || "",
  );
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    //  api.get("/car-purchases/get-all").then((r) => setCars(r.data.data || []));
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
      .get(`/invoice/${carId}/data`)
      .then((r) => setPreview(r.data.data))
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  };

  const handleDownload = async () => {
    if (!selectedCar) {
      toast.error("Please select a car");
      return;
    }
    setDownloading(true);
    try {
      const res = await api.get(`/invoice/${selectedCar}/pdf`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" }),
      );
      const link = document.createElement("a");
      link.href = url;
      const car = cars.find((c) => String(c.id) === String(selectedCar));
      link.setAttribute(
        "download",
        `invoice_${car?.numberPlate || selectedCar}.pdf`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Invoice downloaded!");
    } catch {
      toast.error("Failed to download invoice");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Box>
      <PageHeader title="Invoice" />

      {/* Controls */}
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
            Select Car to Generate Invoice
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
              disabled={!selectedCar || downloading}
            >
              {downloading ? "Downloading..." : "Download PDF"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Loading skeleton */}
      {loading && (
        <Card>
          <CardContent>
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} height={40} sx={{ mb: 1 }} />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Preview */}
      {preview && !loading && (
        <Card>
          <CardContent>
            {/* Header */}
            <Box
              sx={{
                bgcolor: "#1a237e",
                borderRadius: 2,
                p: 3,
                mb: 3,
                textAlign: "center",
              }}
            >
              <Typography
                variant="h5"
                fontWeight={800}
                color="#fff"
                letterSpacing={2}
              >
                ASIAN AUTO HUB
              </Typography>
              <Typography variant="caption" color="#9fa8da">
                Vehicle Purchase & Expense Invoice
              </Typography>
            </Box>

            {/* Section 1 */}
            <Typography
              variant="subtitle2"
              color="primary"
              fontWeight={700}
              textTransform="uppercase"
              letterSpacing={1}
              mb={2}
            >
              Section 1 : Car Purchase Details
            </Typography>

            <Grid container spacing={1.5} mb={3}>
              {[
                ["Registration Number", preview.numberPlate],
                ["Make Model", preview.carModel],

                ["Colour", preview.colour],
                ["Fuel Type", preview.fuelType],
                ["Kmps", preview.kmps],
                ["Manufactured Year", preview.manufacturedYear],

                ["Purchased From", preview.purchaseFrom],
                ["Purchased By", preview.purchasedByName],
                ["Purchase Date", preview.purchaseDate],
                ["Purchase Amount", fmt(preview.purchaseAmount)],
                ["Sale Date", preview.saledDate || "Not sold yet"],
                [
                  "Sale Amount",
                  preview.saledAmount ? fmt(preview.saledAmount) : "N/A",
                ],
              ].map(([label, value]) => (
                <Grid item xs={6} sm={3} key={label}>
                  <InfoBox label={label} value={value} />
                </Grid>
              ))}
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Section 2 */}
            <Typography
              variant="subtitle2"
              color="primary"
              fontWeight={700}
              textTransform="uppercase"
              letterSpacing={1}
              mb={2}
            >
              Section 2 : Expense Details by User
            </Typography>

            {preview.userExpenseSummaries?.length === 0 && (
              <Alert severity="info" sx={{ mb: 2 }}>
                No expenses recorded for this car.
              </Alert>
            )}

            {preview.userExpenseSummaries?.map((summary) => (
              <Box key={summary.userName} sx={{ mb: 3 }}>
                {/* User header */}
                <Box
                  sx={{
                    bgcolor: "#e8eaf6",
                    border: "1px solid #9fa8da",
                    borderRadius: "8px 8px 0 0",
                    px: 2,
                    py: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    fontWeight={700}
                    color="primary.main"
                    fontSize="0.9rem"
                  >
                    {summary.userName}
                  </Typography>
                  <Typography
                    fontWeight={700}
                    color="primary.main"
                    fontSize="0.9rem"
                  >
                    Subtotal: {fmt(summary.userTotalAmount)}
                  </Typography>
                </Box>

                <TableContainer
                  component={Paper}
                  elevation={0}
                  sx={{
                    border: "1px solid #e0e0e0",
                    borderTop: "none",
                    borderRadius: "0 0 8px 8px",
                  }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        {[
                          "Date",
                          "Purpose",
                          "Payment Mode",
                          "Type",
                          "Amount",
                        ].map((h) => (
                          <TableCell key={h}>{h}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {summary.expenses.map((exp, i) => {
                        const isCR = exp.paymentType === "CR";
                        return (
                          <TableRow
                            key={i}
                            sx={{ bgcolor: i % 2 === 0 ? "#fafafa" : "#fff" }}
                          >
                            <TableCell>{exp.expenseDate}</TableCell>
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
                                {/* {isCR ? "+" : "-"} */}
                                {fmt(Math.abs(exp.amount))}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            ))}

            <Divider sx={{ my: 2 }} />

            {/* Summary totals */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 1,
              }}
            >
              {[
                ["Purchase Amount", fmt(preview.purchaseAmount)],
                
                ["Total Expenses", fmt(preview.totalExpenseAmount)],
                ["Sale Amount", fmt(preview.saledAmount)],
              ].map(([label, value]) => (
                <Box
                  key={label}
                  sx={{ display: "flex", gap: 6, alignItems: "center" }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight={500}
                    minWidth={160}
                    textAlign="right"
                  >
                    {label}
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    minWidth={140}
                    textAlign="right"
                  >
                    {value}
                  </Typography>
                </Box>
              ))}

              {/* Net Profit / Loss */}
              <Box
                sx={{
                  display: "flex",
                  gap: 6,
                  alignItems: "center",
                  bgcolor: preview.netProfit >= 0 ? "#e8f5e9" : "#ffebee",
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  mt: 0.5,
                }}
              >
                <Typography
                  variant="body1"
                  fontWeight={700}
                  minWidth={160}
                  textAlign="right"
                  color={preview.netProfit >= 0 ? "success.main" : "error.main"}
                >
                  {preview.netProfit >= 0 ? "Net Profit" : "Net Loss"}
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight={700}
                  minWidth={140}
                  textAlign="right"
                  color={preview.netProfit >= 0 ? "success.main" : "error.main"}
                >
                  {fmt(Math.abs(preview.netProfit))}
                </Typography>
              </Box>
            </Box>

            {/* Download button at bottom */}
            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                size="large"
                startIcon={
                  downloading ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <DownloadIcon />
                  )
                }
                onClick={handleDownload}
                disabled={downloading}
              >
                {downloading ? "Downloading..." : "Download PDF"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
