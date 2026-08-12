import { useEffect, useRef, useState, type FormEvent } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  ArrowUpRight,
  Bell,
  CalendarDays,
  Check,
  CheckCheck,
  CheckCircle2,
  ChevronDown,
  Clock3,
  CreditCard,
  KeyRound,
  LogOut,
  Search,
  Settings as SettingsIcon,
  UserRound,
  X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { Avatar } from "./Avatar";

/* =========================================================
   ROLE LABELS
========================================================= */

const ROLE_LABEL: Record<string, string> = {
  superadmin: "Administrator",
  admin: "Administrator",
  staff: "Staff",
};

/* =========================================================
   NOTIFICATIONS
========================================================= */

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: "Memberships expiring",
    message: "3 memberships expire this week",
    icon: Clock3,
    iconClass: "bg-amber-50 text-amber-600",
    read: false,
  },
  {
    id: 2,
    title: "Pending payments",
    message: "3 students have pending fees",
    icon: CreditCard,
    iconClass: "bg-orange-50 text-orange-600",
    read: false,
  },
  {
    id: 3,
    title: "Backup completed",
    message: "Daily backup completed successfully",
    icon: CheckCircle2,
    iconClass: "bg-emerald-50 text-emerald-600",
    read: false,
  },
];

/* =========================================================
   TRANSITIONS.DEV — NOTIFICATION BADGE
========================================================= */

const NOTIFICATION_BADGE_STYLES = `
:root {
  --badge-slide-dur: 260ms;
  --badge-pop-dur: 500ms;
  --badge-pop-close-dur: 180ms;
  --badge-fade-dur: 400ms;
  --badge-fade-close-dur: 180ms;
  --badge-blur: 2px;
  --badge-offset-x: -8.2px;
  --badge-offset-y: 12.4px;
  --badge-slide-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --badge-pop-ease: cubic-bezier(0.34, 1.36, 0.64, 1);
  --badge-close-ease: cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes t-badge-slide-in {
  from {
    transform: translate(
      var(--badge-offset-x),
      var(--badge-offset-y)
    );
  }

  to {
    transform: translate(0, 0);
  }
}

.t-badge {
  position: absolute;
  top: -4px;
  right: -5px;
  pointer-events: none;
  will-change: transform;
  z-index: 10;
}

.t-badge[data-open="true"] {
  animation:
    t-badge-slide-in
    var(--badge-slide-dur)
    var(--badge-slide-ease);
}

.t-badge-dot {
  display: flex;
  align-items: center;
  justify-content: center;

  min-width: 18px;
  height: 18px;
  padding: 0 4px;

  border-radius: 9999px;

  background: #ef4444;
  color: white;

  border: 2px solid white;

  font-size: 9px;
  font-weight: 700;
  line-height: 1;

  box-shadow:
    0 2px 5px rgba(239, 68, 68, 0.22);

  transform-origin: center;

  transform: scale(1);
  opacity: 1;
  filter: blur(0);

  transition:
    transform var(--badge-pop-dur) var(--badge-pop-ease),
    opacity var(--badge-fade-dur) var(--badge-pop-ease),
    filter var(--badge-pop-dur) var(--badge-pop-ease);

  will-change: transform, opacity, filter;
}

.t-badge[data-open="false"] .t-badge-dot {
  transform: scale(0);
  opacity: 0;
  filter: blur(var(--badge-blur));

  transition:
    transform
      var(--badge-pop-close-dur)
      var(--badge-close-ease),
    opacity
      var(--badge-fade-close-dur)
      var(--badge-close-ease),
    filter
      var(--badge-pop-close-dur)
      var(--badge-close-ease);
}

@media (prefers-reduced-motion: reduce) {
  .t-badge,
  .t-badge-dot {
    animation: none !important;
    transition: none !important;
  }
}
`;

if (
  typeof document !== "undefined" &&
  !document.getElementById("libraryos-notification-badge")
) {
  const style = document.createElement("style");

  style.id = "libraryos-notification-badge";
  style.textContent = NOTIFICATION_BADGE_STYLES;

  document.head.appendChild(style);
}

/* =========================================================
   HEADER
========================================================= */

export function DashboardHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const searchRef = useRef<HTMLInputElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  /* =========================================================
     DATE
  ========================================================= */

  const now = new Date();

  const dateLabel = now.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const dayLabel = now.toLocaleDateString(undefined, {
    weekday: "long",
  });

  const roleLabel = user ? (ROLE_LABEL[user.role] ?? user.role) : "";

  /* =========================================================
     UNREAD COUNT
  ========================================================= */

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  /* =========================================================
     KEYBOARD + OUTSIDE CLICK
  ========================================================= */

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }

      if (event.key === "Escape") {
        setNotifOpen(false);
        setUserOpen(false);
      }
    }

    function handleOutsideClick(event: MouseEvent) {
      const target = event.target as Node;

      if (notifRef.current && !notifRef.current.contains(target)) {
        setNotifOpen(false);
      }

      if (userRef.current && !userRef.current.contains(target)) {
        setUserOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleOutsideClick);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  /* =========================================================
     SEARCH
  ========================================================= */

  function handleSearchSubmit(event: FormEvent) {
    event.preventDefault();

    const value = query.trim();

    if (!value) return;

    navigate(`/students?search=${encodeURIComponent(value)}`);
  }

  /* =========================================================
     NOTIFICATION FUNCTIONS
  ========================================================= */

  function markNotificationRead(id: number) {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              read: true,
            }
          : notification,
      ),
    );
  }

  function markAllAsRead() {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      })),
    );
  }

  function handleViewAll() {
    setNotifOpen(false);

    /*
     * Change this route if your notification
     * page uses another URL.
     */
    navigate("/notifications");
  }

  /* =========================================================
     LOGOUT
  ========================================================= */

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <header
      className="
        relative z-30
        flex h-[72px]
        shrink-0
        items-center
        gap-4

        border-b
        border-slate-200/70

        bg-white/85

        px-4

        backdrop-blur-2xl
        backdrop-saturate-150

        sm:px-6
      "
    >
      {/* =====================================================
          SEARCH
      ===================================================== */}

      <form
        onSubmit={handleSearchSubmit}
        className="
          hidden
          w-full
          min-w-0
          max-w-[500px]
          md:block
        "
      >
        <div
          className="
            group
            flex h-[44px]
            items-center
            gap-2.5

            rounded-[13px]

            border
            border-slate-200/80

            bg-slate-50/75

            px-3.5

            transition-all
            duration-200

            focus-within:border-slate-300
            focus-within:bg-white

            focus-within:shadow-
            [0_0_0_3px_rgba(15,23,42,0.035),
            0_3px_10px_rgba(15,23,42,0.04)]
          "
        >
          <Search
            className="
              h-[17px]
              w-[17px]
              shrink-0
              text-slate-400

              transition-colors

              group-focus-within:text-slate-600
            "
            strokeWidth={2}
          />

          <input
            ref={searchRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="text"
            placeholder="Search students, seats, payments..."
            className="
              min-w-0
              flex-1

              bg-transparent

              text-[13.5px]
              font-medium
              tracking-[-0.01em]
              text-slate-800

              placeholder:font-normal
              placeholder:text-slate-400

              focus:outline-none
            "
          />

          {query ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setQuery("");
                searchRef.current?.focus();
              }}
              className="
                flex h-6 w-6
                shrink-0
                items-center
                justify-center

                rounded-full

                text-slate-400

                transition-all

                hover:bg-slate-200/80
                hover:text-slate-700
              "
            >
              <X className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          ) : (
            <kbd
              className="
                hidden
                shrink-0
                items-center

                rounded-[6px]

                border
                border-slate-200

                bg-white

                px-2
                py-1

                font-mono
                text-[10px]
                font-medium
                text-slate-400

                shadow-sm

                lg:inline-flex
              "
            >
              Ctrl K
            </kbd>
          )}
        </div>
      </form>

      {/* =====================================================
          RIGHT CONTROLS
      ===================================================== */}

      <div
        className="
          ml-auto
          flex h-full
          items-center
          gap-1.5
        "
      >
        {/* =================================================
            NOTIFICATION BUTTON
        ================================================= */}

        <div ref={notifRef} className="relative">
          <button
            type="button"
            aria-label="Notifications"
            onClick={() => {
              setNotifOpen((value) => !value);
              setUserOpen(false);
            }}
            className={`
              relative

              flex h-10 w-10
              items-center
              justify-center

              rounded-full

              transition-all
              duration-200

              ${
                notifOpen
                  ? `
                    bg-slate-100
                    text-slate-900
                  `
                  : `
                    text-slate-500

                    hover:bg-slate-100/80
                    hover:text-slate-900
                  `
              }
            `}
          >
            <Bell className="h-[18px] w-[18px]" strokeWidth={1.9} />

            {/* =============================================
                TRANSITIONS.DEV BADGE
            ============================================= */}

            <span className="t-badge" data-open={unreadCount > 0}>
              <span className="t-badge-dot">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            </span>
          </button>

          {/* =================================================
              NOTIFICATION POPOVER
          ================================================= */}

          {notifOpen && (
            <div
              className="
                absolute
                right-0
                top-[50px]
                z-50

                w-[350px]

                overflow-hidden

                rounded-[18px]

                border
                border-slate-200/80

                bg-white/95

                shadow-
                [0_22px_60px_rgba(15,23,42,0.14),
                0_3px_12px_rgba(15,23,42,0.06)]

                backdrop-blur-2xl
                backdrop-saturate-150
              "
            >
              {/* =============================================
                  POPOVER HEADER
              ============================================= */}

              <div
                className="
                  flex
                  items-center
                  justify-between

                  px-4
                  pb-2.5
                  pt-4
                "
              >
                <div className="min-w-0">
                  <h3
                    className="
                      text-[14px]
                      font-semibold
                      tracking-[-0.015em]
                      text-slate-900
                    "
                  >
                    Notifications
                  </h3>

                  <p
                    className="
                      mt-[2px]
                      text-[10.5px]
                      text-slate-400
                    "
                  >
                    {unreadCount > 0
                      ? `${unreadCount} unread notification${
                          unreadCount === 1 ? "" : "s"
                        }`
                      : "You're all caught up"}
                  </p>
                </div>

                {/* =========================================
                    SMALL ACTION BUTTONS
                ========================================= */}

                <div className="flex items-center gap-1">
                  {/* Mark all read */}

                  <button
                    type="button"
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                    title="Mark all as read"
                    aria-label="Mark all notifications as read"
                    className="
                      group

                      flex h-8 w-8
                      items-center
                      justify-center

                      rounded-full

                      text-slate-400

                      transition-all
                      duration-150

                      hover:bg-slate-100
                      hover:text-slate-800

                      disabled:pointer-events-none
                      disabled:opacity-35

                      active:scale-95
                    "
                  >
                    <CheckCheck
                      className="
                        h-[16px]
                        w-[16px]
                      "
                      strokeWidth={1.9}
                    />
                  </button>

                  {/* View all */}

                  <button
                    type="button"
                    onClick={handleViewAll}
                    title="View all notifications"
                    aria-label="View all notifications"
                    className="
                      flex h-8 w-8
                      items-center
                      justify-center

                      rounded-full

                      text-slate-400

                      transition-all
                      duration-150

                      hover:bg-slate-100
                      hover:text-slate-800

                      active:scale-95
                    "
                  >
                    <ArrowUpRight
                      className="
                        h-[15px]
                        w-[15px]
                      "
                      strokeWidth={1.9}
                    />
                  </button>
                </div>
              </div>

              {/* =============================================
                  DIVIDER
              ============================================= */}

              <div className="mx-3 h-px bg-slate-100" />

              {/* =============================================
                  NOTIFICATION ITEMS
              ============================================= */}

              <div className="p-2">
                {notifications.map((notification) => {
                  const Icon = notification.icon;

                  return (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() => markNotificationRead(notification.id)}
                      className={`
                        group

                        relative

                        flex w-full
                        items-start
                        gap-3

                        rounded-[12px]

                        px-2.5
                        py-2.5

                        text-left

                        transition-all
                        duration-150

                        ${
                          notification.read
                            ? `
                              hover:bg-slate-50/80
                            `
                            : `
                              bg-slate-50/60
                              hover:bg-slate-100/70
                            `
                        }
                      `}
                    >
                      {/* Icon */}

                      <span
                        className={`
                          mt-[1px]

                          flex h-8 w-8
                          shrink-0
                          items-center
                          justify-center

                          rounded-full

                          ${notification.iconClass}
                        `}
                      >
                        <Icon
                          className="
                            h-[15px]
                            w-[15px]
                          "
                          strokeWidth={2}
                        />
                      </span>

                      {/* Content */}

                      <span className="min-w-0 flex-1">
                        <span
                          className={`
                            block

                            text-[12.5px]
                            tracking-[-0.01em]

                            ${
                              notification.read
                                ? `
                                  font-medium
                                  text-slate-700
                                `
                                : `
                                  font-semibold
                                  text-slate-900
                                `
                            }
                          `}
                        >
                          {notification.title}
                        </span>

                        <span
                          className="
                            mt-[2px]
                            block

                            text-[11.5px]
                            leading-[17px]

                            text-slate-500
                          "
                        >
                          {notification.message}
                        </span>
                      </span>

                      {/* Read state */}

                      <span
                        className="
                          mt-2
                          flex h-4 w-4
                          shrink-0
                          items-center
                          justify-center
                        "
                      >
                        {notification.read ? (
                          <Check
                            className="
                              h-3.5
                              w-3.5
                              text-slate-300
                            "
                            strokeWidth={2}
                          />
                        ) : (
                          <span
                            className="
                              h-[6px]
                              w-[6px]

                              rounded-full

                              bg-orange-500

                              shadow-
                              [0_0_0_3px_rgba(249,115,22,0.09)]
                            "
                          />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* =============================================
                  BOTTOM VIEW ALL
                  Clean text fallback/action
              ============================================= */}

              <div
                className="
                  border-t
                  border-slate-100

                  p-2
                "
              >
                <button
                  type="button"
                  onClick={handleViewAll}
                  className="
                    flex h-9
                    w-full
                    items-center
                    justify-center
                    gap-1.5

                    rounded-[10px]

                    text-[11.5px]
                    font-semibold

                    text-slate-500

                    transition-colors

                    hover:bg-slate-50
                    hover:text-slate-900
                  "
                >
                  View all notifications
                  <ArrowUpRight
                    className="
                      h-3.5
                      w-3.5
                    "
                    strokeWidth={1.9}
                  />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* =================================================
            DATE
        ================================================= */}

        <div
          className="
            hidden
            h-10
            items-center
            gap-2.5

            rounded-[12px]

            px-3

            transition-colors

            hover:bg-slate-50/80

            lg:flex
          "
        >
          <CalendarDays
            className="
              h-[17px]
              w-[17px]
              text-slate-400
            "
            strokeWidth={1.8}
          />

          <div className="leading-tight">
            <p
              className="
                whitespace-nowrap

                text-[12px]
                font-semibold
                tracking-[-0.01em]

                text-slate-700
              "
            >
              {dateLabel}
            </p>

            <p
              className="
                mt-[1px]
                text-[10px]
                text-slate-400
              "
            >
              {dayLabel}
            </p>
          </div>
        </div>

        {/* Divider */}

        <div
          className="
            mx-1
            hidden
            h-7
            w-px
            bg-slate-200/80
            sm:block
          "
        />

        {/* =================================================
            USER ACCOUNT
        ================================================= */}

        <div ref={userRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setUserOpen((value) => !value);
              setNotifOpen(false);
            }}
            className={`
              group

              flex h-[48px]
              items-center
              gap-2.5

              rounded-[14px]

              px-1.5
              pr-2

              transition-all
              duration-200

              ${userOpen ? "bg-slate-100" : "hover:bg-slate-50"}
            `}
          >
            <span className="relative shrink-0">
              <Avatar name={user?.username ?? "Admin"} size={36} />

              <span
                className="
                  absolute
                  -bottom-[1px]
                  -right-[1px]

                  h-[10px]
                  w-[10px]

                  rounded-full

                  border-[2px]
                  border-white

                  bg-emerald-500
                "
              />
            </span>

            <span
              className="
                hidden
                min-w-0
                max-w-[130px]

                text-left
                leading-tight

                md:block
              "
            >
              <span
                className="
                  block
                  truncate

                  text-[12.5px]
                  font-semibold
                  tracking-[-0.01em]

                  text-slate-800
                "
              >
                {user?.username ?? "Admin"}
              </span>

              <span
                className="
                  mt-[2px]
                  block
                  truncate

                  text-[10.5px]
                  text-slate-400
                "
              >
                {roleLabel}
              </span>
            </span>

            <ChevronDown
              className={`
                hidden
                h-[14px]
                w-[14px]

                text-slate-400

                transition-transform
                duration-200

                sm:block

                ${userOpen ? "rotate-180" : ""}
              `}
              strokeWidth={2}
            />
          </button>

          {/* =================================================
              USER POPOVER
          ================================================= */}

          {userOpen && (
            <div
              className="
                absolute
                right-0
                top-[56px]
                z-50

                w-[250px]

                overflow-hidden

                rounded-[18px]

                border
                border-slate-200/80

                bg-white/95

                p-1.5

                shadow-
                [0_20px_55px_rgba(15,23,42,0.14),
                0_3px_12px_rgba(15,23,42,0.06)]

                backdrop-blur-2xl
                backdrop-saturate-150
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-3

                  px-2.5
                  pb-3
                  pt-2
                "
              >
                <Avatar name={user?.username ?? "Admin"} size={38} />

                <div className="min-w-0">
                  <p
                    className="
                      truncate

                      text-[13px]
                      font-semibold
                      tracking-[-0.01em]

                      text-slate-900
                    "
                  >
                    {user?.username ?? "Admin"}
                  </p>

                  <p
                    className="
                      mt-[2px]
                      truncate

                      text-[10.5px]
                      text-slate-400
                    "
                  >
                    {user?.email}
                  </p>
                </div>
              </div>

              <div className="mx-1 h-px bg-slate-100" />

              <div className="py-1">
                <Link
                  to="/settings"
                  onClick={() => setUserOpen(false)}
                  className="
                    flex
                    items-center
                    gap-2.5

                    rounded-[10px]

                    px-3
                    py-2.5

                    text-[12.5px]
                    font-medium
                    text-slate-600

                    transition-colors

                    hover:bg-slate-50
                    hover:text-slate-900
                  "
                >
                  <UserRound className="h-4 w-4" strokeWidth={1.8} />
                  Profile
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setUserOpen(false)}
                  className="
                    flex
                    items-center
                    gap-2.5

                    rounded-[10px]

                    px-3
                    py-2.5

                    text-[12.5px]
                    font-medium
                    text-slate-600

                    transition-colors

                    hover:bg-slate-50
                    hover:text-slate-900
                  "
                >
                  <SettingsIcon className="h-4 w-4" strokeWidth={1.8} />
                  Settings
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setUserOpen(false)}
                  className="
                    flex
                    items-center
                    gap-2.5

                    rounded-[10px]

                    px-3
                    py-2.5

                    text-[12.5px]
                    font-medium
                    text-slate-600

                    transition-colors

                    hover:bg-slate-50
                    hover:text-slate-900
                  "
                >
                  <KeyRound className="h-4 w-4" strokeWidth={1.8} />
                  Change password
                </Link>
              </div>

              <div className="mx-1 h-px bg-slate-100" />

              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    flex w-full
                    items-center
                    gap-2.5

                    rounded-[10px]

                    px-3
                    py-2.5

                    text-left
                    text-[12.5px]
                    font-medium

                    text-red-500

                    transition-colors

                    hover:bg-red-50
                    hover:text-red-600
                  "
                >
                  <LogOut className="h-4 w-4" strokeWidth={1.8} />
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
