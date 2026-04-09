import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  FormControl,
  FormHelperText,
  Divider,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";

const EMPTY = {
  firstname: "",
  lastname: "",
  email: "",
  phone: "",
  password: "",
  roleIds: [],
};

function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(EMPTY);
  const [roles, setRoles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    // fetch all roles for checkboxes
    api
      .get("/roles/all")
      .then((r) => setRoles(r.data.data || []))
      .catch(() => {});

    if (isEdit) {
      api
        .get(`/user/${id}`)
        .then((r) => {
          const d = r.data.data;
          setForm({
            firstname: d.firstname || "",
            lastname: d.lastname || "",
            email: d.email || "",
            phone: d.phone || "",
            password: "", // never pre-fill password
            roleIds: d.roles?.map((r) => r.id) || [],
          });
        })
        .catch((e) => toast.error(e.message));
    }
  }, [id]);

  const validate = () => {
    const e = {};
    if (!form.firstname) e.firstname = "First name is required";
    if (!form.lastname) e.lastname = "Last name is required";
    if (!form.email) e.email = "Email is required";
    if (!isEdit && !form.password) e.password = "Password is required";
    if (form.roleIds.length === 0)
      e.roleIds = "Please assign at least one role";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // handle role checkbox toggle
  const handleRoleToggle = (roleId) => {
    setForm((prev) => {
      const exists = prev.roleIds.includes(roleId);
      return {
        ...prev,
        roleIds: exists
          ? prev.roleIds.filter((id) => id !== roleId)
          : [...prev.roleIds, roleId],
      };
    });
    setErrors((prev) => ({ ...prev, roleIds: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = { ...form };
      // don't send empty password on edit
      if (isEdit && !payload.password) delete payload.password;

      if (isEdit) {
        await api.put(`/user/${id}`, payload);
        toast.success("User updated successfully!");
      } else {
        await api.post("/user/add", payload);
        toast.success("User created successfully!");
      }
      navigate("/users");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <PageHeader title={isEdit ? "Edit User" : "Add User"} backTo="/users" />

      <Card sx={{ maxWidth: 750 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {/* Personal Info */}
            <Typography
              variant="subtitle2"
              color="primary"
              fontWeight={700}
              textTransform="uppercase"
              letterSpacing={1}
              mb={2}
            >
              Personal Information
            </Typography>

            <Grid container spacing={2} mb={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstname"
                  value={form.firstname}
                  onChange={handleChange}
                  required
                  error={Boolean(errors.firstname)}
                  helperText={errors.firstname}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastname"
                  value={form.lastname}
                  onChange={handleChange}
                  required
                  error={Boolean(errors.lastname)}
                  helperText={errors.lastname}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  error={Boolean(errors.email)}
                  helperText={errors.email}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={
                    isEdit ? "New Password (leave blank to keep)" : "Password"
                  }
                  name="password"
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  required={!isEdit}
                  error={Boolean(errors.password)}
                  helperText={errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setShowPass(!showPass)}
                        >
                          {showPass ? (
                            <VisibilityOffIcon fontSize="small" />
                          ) : (
                            <VisibilityIcon fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ mb: 3 }} />

            {/* Roles */}
            <Typography
              variant="subtitle2"
              color="primary"
              fontWeight={700}
              textTransform="uppercase"
              letterSpacing={1}
              mb={2}
            >
              Assign Roles
            </Typography>

            <FormControl error={Boolean(errors.roleIds)} sx={{ mb: 3 }}>
              <FormLabel sx={{ fontSize: "0.85rem", mb: 1 }}>
                Select one or more roles
              </FormLabel>
              <FormGroup row>
                {roles.map((role) => (
                  <FormControlLabel
                    key={role.id}
                    control={
                      <Checkbox
                        size="small"
                        checked={form.roleIds.includes(role.id)}
                        onChange={() => handleRoleToggle(role.id)}
                        sx={{
                          color: "#1a237e",
                          "&.Mui-checked": { color: "#1a237e" },
                        }}
                      />
                    }
                    label={
                      <Typography fontSize="0.875rem">{role.role}</Typography>
                    }
                  />
                ))}
              </FormGroup>
              {errors.roleIds && (
                <FormHelperText>{errors.roleIds}</FormHelperText>
              )}
            </FormControl>

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
              <Button variant="outlined" onClick={() => navigate("/users")}>
                Cancel
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default UserForm;
