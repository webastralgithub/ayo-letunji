import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const [user, setUser] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  const location = useLocation();

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user_details")));
  }, []);

  const toggleSubMenu = (submenu) => {
    setActiveSubMenu((prevSubMenu) => (prevSubMenu === submenu ? null : submenu));
  };

  return (
    <div className="sidenav">
      <Link
        to="/folders"
        className={
          location.pathname === "/folders"
            ? "nav-item nav-link px-3 active"
            : "nav-item nav-link px-3"
        }
      >
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-folder"
            viewBox="0 0 16 16"
          >
            {/* Folder icon path */}
          </svg>
          Folders
        </div>
        <img src="/images/icons/Vector.svg" alt="icon" />
      </Link>

      {user?.role_id === 1 && (
        <div>
          <div
            className="nav-item nav-link px-3"
            style={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            onClick={() => toggleSubMenu("settings")}
          >
            <Link to="#" style={{ flex: 1 }}>
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-gear"
                  viewBox="0 0 16 16"
                >
                  {/* Gear icon path */}
                </svg>
                Settings
              </div>
            </Link>
            <img
              src="/images/icons/Vector.svg"
              alt="icon"
              className={activeSubMenu === "settings" ? "rotate-icon" : ""}
            />
          </div>

          {activeSubMenu === "settings" && (
            <div className="pl-3">
              <Link
                to="/user"
                className={
                  location.pathname === "/user"
                    ? "nav-item nav-link px-3 active"
                    : "nav-item nav-link px-3"
                }
              >
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-person"
                    viewBox="0 0 16 16"
                  >
                    {/* Person icon path */}
                  </svg>
                  Manage User
                </div>
                <img src="/images/icons/Vector.svg" alt="icon" />
              </Link>

              <Link
                to="/attribute"
                className={
                  location.pathname === "/attribute"
                    ? "nav-item nav-link px-3 active"
                    : "nav-item nav-link px-3"
                }
              >
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-bookmark-plus"
                    viewBox="0 0 16 16"
                  >
                    {/* Bookmark icon path */}
                  </svg>
                  Manage Attribute
                </div>
                <img src="/images/icons/Vector.svg" alt="icon" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
