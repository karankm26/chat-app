import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import { loginSchema } from "../schema";
import { useFormik } from "formik";
import { Alert, Button, IconButton, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { userLogin } from "../utils/api";

export default function Login() {
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState({ error: "", msg: "" });
  const [open, setOpen] = useState(false);
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const handleSubmit = async (values) => {
    await userLogin({
      email: values.email,
      password: values.password,
    }).then((res) => {
      handleOpen(res);
    });
  };

  const handleOpen = (res) => {
    if (res.error) {
      setAlertMessage({
        error: "error",
        msg: res.error,
      });
    } else {
      setAlertMessage({
        error: "success",
        msg: "Login Success",
      });
      localStorage.setItem("user", JSON.stringify(res.user));
      navigate("/");
    }
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h2 className="text-center text-dark mt-2">Login</h2>

          <div className="card my-4">
            <form
              className="card-body cardbody-color p-lg-5"
              onSubmit={formik.handleSubmit}
            >
              <div className="text-center">
                <img
                  src="https://cdn.pixabay.com/photo/2016/03/31/19/56/avatar-1295397__340.png"
                  className="img-fluid profile-image-pic img-thumbnail rounded-circle my-3"
                  alt="profile"
                />
              </div>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  aria-describedby="emailHelp"
                  placeholder="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />{" "}
                {formik.touched.email && formik.errors.email && (
                  <p className="text-danger">{formik.errors.email}</p>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />{" "}
                {formik.touched.password && formik.errors.password && (
                  <p className="text-danger">{formik.errors.password}</p>
                )}
              </div>
              <div className="text-center">
                <button type="submit" className="btn btn-color px-5 mb-2 w-100">
                  Login
                </button>
              </div>
              <div
                id="emailHelp"
                className="form-text text-center mb-2 text-dark"
              >
                Not Registered?{" "}
                <Link to={"/register"} className="text-dark fw-bold">
                  {" "}
                  Create an Account
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        action={
          <>
            <IconButton
              aria-label="close"
              color="inherit"
              sx={{ p: 0.5 }}
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
          </>
        }
      >
        <Alert
          onClose={handleClose}
          severity={alertMessage.error}
          sx={{ width: "100%" }}
        >
          {alertMessage.msg}
        </Alert>
      </Snackbar>
    </div>
  );
}
