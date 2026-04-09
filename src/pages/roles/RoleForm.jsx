import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";

function RoleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      api
        .get(`/roles/${id}`)
        .then((r) => setName(r.data.data.role || ""))
        .catch((e) => toast.error(e.message));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Role name is required");
      return;
    }
    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/roles/${id}`, { name });
        toast.success("Role updated!");
      } else {
        await api.post("/roles", { name });
        toast.success("Role created!");
      }
      navigate("/roles");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <PageHeader title={isEdit ? "Edit Role" : "Add Role"} backTo="/roles" />

      <Card sx={{ maxWidth: 480 }}>
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
              Role Information
            </Typography>

            <TextField
              fullWidth
              label="Role Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              required
              error={Boolean(error)}
              helperText={error}
              placeholder="e.g. ROLE_ADMIN, ROLE_USER"
              sx={{ mb: 3 }}
            />

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
              <Button variant="outlined" onClick={() => navigate("/roles")}>
                Cancel
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default RoleForm;
