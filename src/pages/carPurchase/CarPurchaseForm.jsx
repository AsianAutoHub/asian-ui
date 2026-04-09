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
  Divider,
  CircularProgress,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";

const EMPTY = {
  numberPlate: "",
  model: "",
  purchaseAmount: "",
  purchaseDate: "",
  purchaseFrom: "",
  saledAmount: "",
  saledDate: "",
  purchasedById: "",
  colour: "",
  fuelType: "",
  kmps: "",
  manufacturedYear: "",
};

const FUEL_TYPE = ["PETROL", "DIESEL", "ELECTRIC", "HYBRID"];

function Field({
  label,
  name,
  type = "text",
  required,
  form,
  errors,
  onChange,
}) {
  return (
    <TextField
      fullWidth
      label={label}
      name={name}
      type={type}
      value={form[name]}
      onChange={onChange}
      required={required}
      error={Boolean(errors[name])}
      helperText={errors[name]}
      InputLabelProps={type === "date" ? { shrink: true } : undefined}
    />
  );
}

export default function CarPurchaseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(EMPTY);
  const [users, setUsers] = useState([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    api
      .get("/user/get-all")
      .then((r) => setUsers(r.data.data || []))
      .catch(() => {});

    if (isEdit) {
      api
        .get(`/car-purchases/get/${id}`)
        .then((r) => {
          const d = r.data.data;
          setForm({
            numberPlate: d.numberPlate || "",
            model: d.model || "",
            purchaseAmount: d.purchaseAmount || "",
            purchaseDate: d.purchaseDate || "",
            purchaseFrom: d.purchaseFrom || "",
            saledAmount: d.saledAmount || "",
            saledDate: d.saledDate || "",
            purchasedById: d.purchasedById || "",

            colour: d.colour || "",
            fuelType: d.fuelType || "",
            kmps: d.kmps || "",
            manufacturedYear: d.manufacturedYear || "",
          });
        })
        .catch((e) => toast.error(e.message));
    }
  }, [id]);

  const validate = () => {
    const e = {};
    if (!form.numberPlate) e.numberPlate = "Number plate is required";
    if (!form.model) e.model = "Car model is required";
    if (!form.purchaseAmount || form.purchaseAmount <= 0)
      e.purchaseAmount = "Valid purchase amount required";
    if (!form.purchaseDate) e.purchaseDate = "Purchase date is required";
    if (!form.purchaseFrom) e.purchaseFrom = "Purchase from is required";
    if (!form.purchasedById) e.purchasedById = "Please select a user";

    if (!form.colour) e.colour = "Car colour is required";
    if (!form.fuelType) e.fuelType = "fuel Type is required";
    if (!form.kmps || form.kmps <= 0) e.kmps = "kmps is required";
    if (!form.manufacturedYear || form.manufacturedYear <= 0)
      e.manufacturedYear = "ManufacturedYear is required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ✅ Single handleChange handles ALL fields correctly
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        purchaseAmount: parseFloat(form.purchaseAmount),
        saledAmount: form.saledAmount ? parseFloat(form.saledAmount) : null,
        purchasedById: parseInt(form.purchasedById),
        saledDate: form.saledDate || null,

        kmps: parseFloat(form.kmps),
        manufacturedYear: parseInt(form.manufacturedYear),
      };
      if (isEdit) {
        await api.put(`/car-purchases/${id}`, payload);
        toast.success("Car purchase updated!");
      } else {
        await api.post("/car-purchases/add", payload);
        toast.success("Car purchase created!");
      }
      navigate("/car-purchases");
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

  const currentYear = new Date().getFullYear();

  const yearOptions = [];
  for (let i = currentYear; i >= 1980; i--) {
    yearOptions.push({ label: i, value: i });
  }
  return (
    <Box>
      <PageHeader
        title={isEdit ? "Edit Car Purchase" : "Add Car Purchase"}
        backTo="/car-purchases"
      />

      <Card sx={{ maxWidth: 800 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {/* Purchase Info */}
            <Typography
              variant="subtitle2"
              color="primary"
              fontWeight={700}
              textTransform="uppercase"
              letterSpacing={1}
              mb={2}
            >
              Purchase Information
            </Typography>

            <Grid container spacing={2} mb={3}>
              <Grid item xs={12} sm={6}>
                <Field
                  label="Number Plate"
                  name="numberPlate"
                  form={form}
                  errors={errors}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  label="Make Model"
                  name="model"
                  form={form}
                  errors={errors}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  label="Colour"
                  name="colour"
                  form={form}
                  errors={errors}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <SelectField
                  label="Fuel Type"
                  name="fuelType"
                  required
                  options={FUEL_TYPE}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  label="kmps"
                  name="kmps"
                  form={form}
                  errors={errors}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <SelectField
                  label="Manufactured Year"
                  name="manufacturedYear"
                  required
                  options={yearOptions}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  label="Purchase From"
                  name="purchaseFrom"
                  form={form}
                  errors={errors}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  label="Purchase Date"
                  name="purchaseDate"
                  type="date"
                  form={form}
                  errors={errors}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  label="Purchase Amount"
                  name="purchaseAmount"
                  type="number"
                  form={form}
                  errors={errors}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Purchased By"
                  name="purchasedById"
                  value={form.purchasedById}
                  onChange={handleChange}
                  required
                  error={Boolean(errors.purchasedById)}
                  helperText={errors.purchasedById}
                >
                  <MenuItem value="">Select User</MenuItem>
                  {users.map((u) => (
                    <MenuItem key={u.id} value={u.id}>
                      {u.firstname}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            <Divider sx={{ mb: 3 }} />

            {/* Sale Info */}
            <Typography
              variant="subtitle2"
              color="primary"
              fontWeight={700}
              textTransform="uppercase"
              letterSpacing={1}
              mb={2}
            >
              Sale Information{" "}
              <Typography
                component="span"
                variant="caption"
                color="text.secondary"
              >
                (Optional)
              </Typography>
            </Typography>

            <Grid container spacing={2} mb={3}>
              <Grid item xs={12} sm={6}>
                <Field
                  label="Sale Amount"
                  name="saledAmount"
                  type="number"
                  form={form}
                  errors={errors}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  label="Sale Date"
                  name="saledDate"
                  type="date"
                  form={form}
                  errors={errors}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            {/* Actions */}
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
                onClick={() => navigate("/car-purchases")}
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
