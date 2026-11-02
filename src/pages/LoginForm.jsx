import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const LoginForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
      general: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});
    setLoading(true);

    try {
      const response = await api.post("/login", formData);

      // Login successful
      if (response.data.success && response.data.token) {
        // Store token
        localStorage.setItem("admin_token", response.data.token);

        // Navigate to dashboard
        navigate("/admin/dashboard");
      } else {
        setErrors({
          general: response.data.message || "Unable to sign in",
        });
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 422) {
          // Laravel validation errors
          setErrors(error.response.data.errors || {});
        } else {
          // Login error
          setErrors({
            general:
              error.response.data.message || "Invalid email or password",
          });
        }
      } else {
        setErrors({
          general: "Unable to connect to server",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <aside className="admin-login-aside" aria-label="YatraPulse administration">
        <div className="admin-login-aside-top">
          <span className="admin-login-kicker">YATRAPULSE / ADMIN</span>
          <span className="admin-login-index">01 — 03</span>
        </div>
        <div className="admin-login-aside-content">
          <p className="admin-login-overline">TRAVEL OPERATIONS</p>
          <h1>Good journeys start with good planning.</h1>
          <div className="admin-login-rule" aria-hidden="true">
            <span />
          </div>
          <p className="admin-login-aside-note">Your YatraPulse workspace, in one place.</p>
        </div>
        <span className="admin-login-aside-footer">BUILT FOR THE JOURNEY</span>
      </aside>

      <section className="admin-login-main">
        <div className="admin-login-layout">
          <form className="admin-login-form" onSubmit={handleSubmit}>
            <a className="admin-login-brand" href="/" aria-label="YatraPulse home">
              <img src="/YatraPulse_logo_transparent.png" alt="" />
              <span>YatraPulse</span>
            </a>

            <div className="admin-login-heading">
              <p className="admin-login-overline">ADMINISTRATOR ACCESS</p>
              <h2>Welcome back</h2>
              <p>Sign in to continue to your workspace.</p>
            </div>

            {errors.general && (
              <div className="admin-login-error" role="alert">
                {errors.general}
              </div>
            )}

            <div className="admin-login-field">
              <label htmlFor="email">Enter Email</label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="username"
                placeholder="you@example.com"
                value={formData.email}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                required
                onChange={handleChange}
              />
              {errors.email && (
                <span className="admin-login-field-error" id="email-error">
                  {Array.isArray(errors.email) ? errors.email[0] : errors.email}
                </span>
              )}
            </div>

            <div className="admin-login-field">
              <label htmlFor="password">Enter Password</label>
              <input
                type="password"
                id="password"
                name="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={formData.password}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "password-error" : undefined}
                required
                onChange={handleChange}
              />
              {errors.password && (
                <span className="admin-login-field-error" id="password-error">
                  {Array.isArray(errors.password)
                    ? errors.password[0]
                    : errors.password}
                </span>
              )}
            </div>

            <button
              className="admin-login-submit"
              type="submit"
              disabled={loading}
            >
              <span>{loading ? "Signing in..." : "Sign in"}</span>
              <span aria-hidden="true">&#8594;</span>
            </button>

            <p className="admin-login-footnote">YATRAPULSE ADMINISTRATION</p>
          </form>
        </div>
      </section>
    </main>
  );
};
export default LoginForm;
