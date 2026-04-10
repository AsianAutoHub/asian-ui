import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  MenuItem,
  Typography,
  CircularProgress,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";

const EMPTY = {
  amount: "",
  paymentMode: "",
  paymentType: "",
  purpose: "",
  expenseDate: "",
  carPurchaseId: "",
  paidById: "",
};
const PAYMENT_MODES = ["ONLINE", "OFFLINE"];
const PAYMENT_TYPES = ["CR", "DR"];

export default function CarExpenseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(EMPTY);
  const [users, setUsers] = useState([]);
  const [cars, setCars] = useState([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    api
      .get("/user/get-all", { params: { page: 0, size: 100 } })
      .then((r) => setUsers(r.data.data.content || []))
      .catch((e) => toast.error(e.message));
    // api
    //   .get("/user/get-all")
    //   .then((r) => setUsers(r.data.data || []))
    //   .catch(() => {});
    api

      .get("/car-purchases/get-all", { params: { page: 0, size: 1000 } })
      .then((r) => setCars(r.data.data.content || []))
      .catch((e) => toast.error(e.message));

    // .get("/car-purchases/get-all")
    // .then((r) => setCars(r.data.data || []))
    // .catch(() => {});
    if (isEdit) {
      api
        .get(`/car-expenses/get/${id}`)
        .then((r) => {
          const d = r.data.data;
          setForm({
            amount: d.amount || "",
            paymentMode: d.paymentMode || "",
            paymentType: d.paymentType || "",
            purpose: d.purpose || "",
            expenseDate: d.expenseDate || "",
            carPurchaseId: d.carPurchaseId || "",
            paidById: d.paidById || "",
          });
        })
        .catch((e) => toast.error(e.message));
    }
  }, [id]);

  const validate = () => {
    const e = {};
    if (!form.carPurchaseId) e.carPurchaseId = "Please select a car";
    if (!form.paidById) e.paidById = "Please select paid by user";
    if (!form.purpose) e.purpose = "Purpose is required";
    if (!form.amount || form.amount <= 0) e.amount = "Valid amount required";
    if (!form.paymentMode) e.paymentMode = "Payment mode is required";
    if (!form.paymentType) e.paymentType = "Payment type is required";
    if (!form.expenseDate) e.expenseDate = "Expense date is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        amount: parseFloat(form.amount),
        carPurchaseId: parseInt(form.carPurchaseId),
        paidById: parseInt(form.paidById),
      };
      if (isEdit) {
        await api.put(`/car-expenses/${id}`, payload);
        toast.success("Expense updated!");
      } else {
        await api.post("/car-expenses/add", payload);
        toast.success("Expense created!");
      }
      navigate("/car-expenses");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const SelectField = ({ label, name, options, required }) => (
    <TextField
      select
      fullWidth
      label={label}
      name={name}
      value={form[name]}
      onChange={handleChange}
      required={required}
      error={Boolean(errors[name])}
      helperText={errors[name]}
    >
      <MenuItem value="">Select {label}</MenuItem>
      {options.map((o) => (
        <MenuItem key={o.value ?? o} value={o.value ?? o}>
          {o.label ?? o}
        </MenuItem>
      ))}
    </TextField>
  );

  return (
    <Box>
      <PageHeader
        title={isEdit ? "Edit Expense" : "Add Expense"}
        backTo="/car-expenses"
      />

      <Card sx={{ maxWidth: 700 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Typography
              variant="subtitle2"
              color="primary"
              fontWeight={700}
              textTransform="uppercase"
              letterSpacing={1}
              mb={2}
            >
              Expense Information
            </Typography>

            <Grid container spacing={2} mb={3}>
              <Grid item xs={12} sm={6}>
                <SelectField
                  label="Car"
                  name="carPurchaseId"
                  required
                  options={cars.map((c) => ({
                    value: c.id,
                    label: `${c.numberPlate} — ${c.model}`,
                  }))}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <SelectField
                  label="Paid By"
                  name="paidById"
                  required
                  options={users.map((u) => ({
                    value: u.id,
                    label: u.firstname,
                  }))}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Purpose"
                  name="purpose"
                  value={form.purpose}
                  onChange={handleChange}
                  required
                  error={Boolean(errors.purpose)}
                  helperText={errors.purpose}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Amount"
                  name="amount"
                  type="number"
                  value={form.amount}
                  onChange={handleChange}
                  required
                  error={Boolean(errors.amount)}
                  helperText={errors.amount}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <SelectField
                  label="Payment Mode"
                  name="paymentMode"
                  required
                  options={PAYMENT_MODES}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Payment Type"
                  name="paymentType"
                  value={form.paymentType}
                  onChange={handleChange}
                  required
                  error={Boolean(errors.paymentType)}
                  helperText={errors.paymentType}
                >
                  <MenuItem value="">Select Type</MenuItem>
                  {PAYMENT_TYPES.map((t) => (
                    <MenuItem key={t} value={t}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            bgcolor: t === "CR" ? "#1b5e20" : "#b71c1c",
                          }}
                        />
                        {t === "CR"
                          ? "CR — Credit (Money In)"
                          : "DR — Debit (Money Out)"}
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Expense Date"
                  name="expenseDate"
                  type="date"
                  value={form.expenseDate}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ shrink: true }}
                  error={Boolean(errors.expenseDate)}
                  helperText={errors.expenseDate}
                />
              </Grid>
            </Grid>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                startIcon={
                  saving ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <SaveIcon />
                  )
                }
                disabled={saving}
              >
                {saving ? "Saving..." : isEdit ? "Update" : "Save"}
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate("/car-expenses")}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
