import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";
import "./AvatarModal.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
  maxHeight: "90vh",
  overflowY: "auto",
};

const seeds = Array.from({ length: 12 }, (_, i) => `avatar${i + 1}`);

const AvatarModal = ({ open, onClose, onSelect }) => {
  const [loading, setLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [avatars, setAvatars] = useState([]);

  useEffect(() => {
    if (open) {
      setLoading(true);
      const avatarUrls = seeds.map((seed) => ({
        seed,
        url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`,
      }));
      // Fake loading delay
      setTimeout(() => {
        setAvatars(avatarUrls);
        setLoading(false);
      }, 1000);
    }
  }, [open]);

  const handleConfirm = () => {
    if (selectedAvatar) {
      onSelect(selectedAvatar);
      setSelectedAvatar(null);
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" mb={2}>
          Choose an Avatar
        </Typography>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 200,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <div className="avatar-grid">
              {avatars.map(({ seed, url }) => (
                <img
                  key={seed}
                  src={url}
                  alt={seed}
                  className={`avatar-option ${
                    selectedAvatar === url ? "selected" : ""
                  }`}
                  onClick={() => setSelectedAvatar(url)}
                />
              ))}
            </div>

            {selectedAvatar && (
              <div className="avatar-preview">
                <Typography variant="body1" mt={2}>
                  Selected Avatar:
                </Typography>
                <img src={selectedAvatar} alt="Preview" className="avatar-large" />
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={handleConfirm}
                >
                  Use this Avatar
                </Button>
              </div>
            )}
          </>
        )}
      </Box>
    </Modal>
  );
};

export default AvatarModal;
