import { useSelector } from "react-redux";
import { User, Mail, Calendar, AtSign } from "lucide-react";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);

  const formatDOB = (dob) => {
    if (!dob) return "Not set";

    return new Date(dob).toLocaleDateString([], {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const fields = [
    {
      icon: User,
      label: "Full Name",
      value: user?.fullName,
    },
    {
      icon: AtSign,
      label: "Username",
      value: user?.userName
        ? `@${user.userName}`
        : "Not set",
    },
    {
      icon: Mail,
      label: "Email",
      value: user?.email,
    },
    {
      icon: Calendar,
      label: "Date of Birth",
      value: formatDOB(user?.DOB),
    },
  ];

  return (
    <div className="orbit-page">
      {/* ================= HEADER ================= */}

      <div className="orbit-page-header">
        <div>
          <h1 className="text-orbit-text">Profile</h1>

          <p className="text-orbit-muted">
            Your account details
          </p>
        </div>
      </div>

      {/* ================= CONTENT ================= */}

      <div className="orbit-content">
        {/* ================= PROFILE HERO ================= */}

        <div
          className="
            orbit-profile-hero
            rounded-[var(--orbit-radius-lg)]
            border
            border-orbit-line
            bg-orbit-surface
            shadow-[var(--orbit-shadow-sm)]
          "
        >
          {/* Avatar */}

          {user?.avatar ? (
            <img
              src={user.avatar}
              alt=""
              className="
                orbit-avatar
                orbit-profile-avatar
                border-2
                border-orbit-primary
              "
            />
          ) : (
            <div
              className="
                orbit-avatar
                orbit-profile-avatar
                border-2
                border-orbit-primary
                bg-orbit-bg
                text-orbit-primary
              "
              aria-hidden="true"
            >
              {user?.fullName?.slice(0, 1) || "?"}
            </div>
          )}

          {/* Name */}

          <h2 className="text-orbit-text">
            {user?.fullName || "Your profile"}
          </h2>

          {/* Username */}

          <p className="text-orbit-muted">
            @{user?.userName || ""}
          </p>
        </div>

        {/* ================= PROFILE DETAILS ================= */}

        <div
          className="
            orbit-profile-card
            rounded-[var(--orbit-radius-lg)]
            border
            border-orbit-line
            bg-orbit-surface
            shadow-[var(--orbit-shadow-sm)]
          "
        >
          {fields.map((field) => {
            const Icon = field.icon;

            return (
              <div
                key={field.label}
                className="
                  orbit-profile-field
                  border-b
                  border-orbit-line
                  last:border-b-0
                "
              >
                <div
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-orbit-bg
                    text-orbit-primary
                  "
                >
                  <Icon
                    size={17}
                    aria-hidden="true"
                  />
                </div>

                <div className="min-w-0">
                  <span className="text-orbit-muted">
                    {field.label}
                  </span>

                  <strong className="text-orbit-text">
                    {field.value || "Not set"}
                  </strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Profile;