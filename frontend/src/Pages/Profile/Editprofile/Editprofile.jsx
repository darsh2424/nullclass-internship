import React, { useState, useEffect } from "react";
import { Box, Modal, IconButton, TextField } from "@mui/material";
import { useUserAuth } from "../../../context/UserAuthContext";
import CloseIcon from "@mui/icons-material/Close";
import "./Editprofile.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  height: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 8,
};

function Editchild({ dob, setdob }) {
  const [open, setopen] = useState(false);

  const handleopen = () => setopen(true);
  const handleclose = () => setopen(false);

  return (
    <>
      <div className="birthdate-section" onClick={handleopen}>
        <span>Edit</span>
      </div>
      <Modal
        hideBackdrop
        open={open}
        onClose={handleclose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 300, height: 300 }}>
          <div className="text">
            <h2>Edit date of birth</h2>
            <input
              type="date"
              value={dob}
              onChange={(e) => setdob(e.target.value)}
            />
            <button
              className="e-button"
              onClick={handleclose}
            >
              Cancel
            </button>
          </div>
        </Box>
      </Modal>
    </>
  );
}

const Editprofile = ({ loggedinuser, setLoggedinuser, handleProfileClick }) => {
  const [name, setname] = useState("");
  const [bio, setbio] = useState("");
  const [location, setlocation] = useState("");
  const [website, setwebsite] = useState("");
  const [open, setopen] = useState(false);
  const [dob, setdob] = useState("");
  const { setUserDetails } = useUserAuth();

  // Prefill form when modal opens
  useEffect(() => {
    if (open && loggedinuser) {
      setname(loggedinuser.name || "");
      setbio(loggedinuser.bio || "");
      setlocation(loggedinuser.location || "");
      setwebsite(loggedinuser.website || "");
      setdob(loggedinuser.dob || "");
    }
  }, [open, loggedinuser]);

  const handlesave = () => {
    const editinfo = { name, bio, location, website, dob };
    fetch(`${import.meta.env.VITE_BACKEND_URL}/userupdate/${loggedinuser?.email}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editinfo),
    })
      .then((res) => res.json())
      .then(() => {
        return fetch(`${import.meta.env.VITE_BACKEND_URL}/user?email=${loggedinuser?.email}`);
      })
      .then((res) => res.json())
      .then((data) => {
        const updatedUser = Array.isArray(data) ? data[0] : data;
        if (updatedUser) {
          alert("Profile updated successfully!");
          setUserDetails(updatedUser);
          setLoggedinuser(updatedUser);
          setopen(false);
        }
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  };

  return (
    <div>
      <button onClick={() => setopen(true)} className="Edit-profile-btn">
        Edit profile
      </button>

      <button className="Edit-profile-btn" onClick={handleProfileClick}>Edit Profile Photo</button>

      <Modal open={open} onClose={() => setopen(false)}>
        <Box style={style} className="modal">
          <div className="header">
            <IconButton onClick={() => setopen(false)}>
              <CloseIcon />
            </IconButton>
            <h2 className="header-title">Edit Profile</h2>
            <button className="save-btn" onClick={handlesave}>Save</button>
          </div>

          <form className="fill-content">
            <TextField
              className="text-field"
              fullWidth
              label="Name"
              variant="filled"
              value={name}
              onChange={(e) => setname(e.target.value)}
            />
            <TextField
              className="text-field"
              fullWidth
              label="Bio"
              variant="filled"
              value={bio}
              onChange={(e) => setbio(e.target.value)}
            />
            <TextField
              className="text-field"
              fullWidth
              label="Location"
              variant="filled"
              value={location}
              onChange={(e) => setlocation(e.target.value)}
            />
            <TextField
              className="text-field"
              fullWidth
              label="Website"
              variant="filled"
              value={website}
              onChange={(e) => setwebsite(e.target.value)}
            />
          </form>

          <div className="birthdate-section">
            <p>Birth Date</p>
            <p>:</p>
            <Editchild dob={dob} setdob={setdob} />
          </div>

          <div className="last-section">
            <h2>{dob ? dob : "Add your date of birth"}</h2>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Editprofile;
