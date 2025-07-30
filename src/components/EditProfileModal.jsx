import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Grid,
  useMediaQuery,
  useTheme,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function EditProfileModal({ open, onClose, userData, onProfileUpdated }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [form, setForm] = useState({
    fullName: "",
    bio: "",
    isPrivate: false,
    socialMedia: {
      twitter: "",
      instagram: "",
      linkedin: "",
      github: "",
    },
  });

  const token = useSelector((state) => state?.user?.currentUser?.token);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      setForm({
        fullName: userData.fullName || "",
        bio: userData.bio || "",
        isPrivate: userData.isPrivate || false,
        socialMedia: {
          twitter: userData.socialMedia?.twitter || "",
          instagram: userData.socialMedia?.instagram || "",
          linkedin: userData.socialMedia?.linkedin || "",
          github: userData.socialMedia?.github || "",
        },
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name in form.socialMedia) {
      setForm((prev) => ({
        ...prev,
        socialMedia: { ...prev.socialMedia, [name]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSwitchChange = (e) => {
    setForm((prev) => ({ ...prev, isPrivate: e.target.checked }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName || form.fullName.length < 3 || form.fullName.length > 50) {
      newErrors.fullName = "Full name must be between 3 and 50 characters.";
    } else if (!/^[A-Za-z\s]+$/.test(form.fullName)) {
      newErrors.fullName = "Full name can only contain letters and spaces.";
    }

    const urlRegex = /^(https?:\/\/)?(www\.)?(twitter\.com|instagram\.com|linkedin\.com|github\.com)\/[A-Za-z0-9-_]+$/;
    Object.entries(form.socialMedia).forEach(([platform, url]) => {
      if (url && !urlRegex.test(url)) {
        newErrors[platform] = `Invalid ${platform} URL.`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/users/me`,
        form,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onProfileUpdated(res.data);
      onClose();
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm"  className="border rounded-lg" fullScreen={fullScreen}>
      <DialogTitle>Edit Profile</DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Full Name"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              fullWidth
              error={!!errors.fullName}
              helperText={errors.fullName}
              autoFocus
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Bio"
              name="bio"
              value={form.bio}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={form.isPrivate}
                  onChange={handleSwitchChange}
                  color="primary"
                />
              }
              label="Private Account"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={500} mt={2} mb={1}>
              Social Media Links
            </Typography>
          </Grid>

          {[ "linkedin", "github"].map((platform) => (
            <Grid item xs={12} sm={12} key={platform}>
              <TextField
                label={`${platform[0].toUpperCase() + platform.slice(1)} URL`}
                name={platform}
                value={form.socialMedia[platform]}
                onChange={handleChange}
                fullWidth
                error={!!errors[platform]}
                helperText={errors[platform]}
                placeholder={`https://${platform}.com/yourhandle`}
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
