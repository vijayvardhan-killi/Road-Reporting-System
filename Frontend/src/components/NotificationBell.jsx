import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "@/context/auth/authcontext";
import { getMyNotifications, markAllNotificationsRead, markNotificationRead } from "@/api/notification";
import { Button } from "@/components/ui/button";

const NotificationBell = () => {
  const { loggedIn } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const load = () => {
    getMyNotifications()
      .then(({ data, unreadCount }) => {
        setNotifications(data);
        setUnreadCount(unreadCount);
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (!loggedIn) return;
    load();
    const interval = setInterval(load, 30000); // light polling, no websockets in this MVP
    return () => clearInterval(interval);
  }, [loggedIn]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!loggedIn) return null;

  const handleOpen = () => {
    setOpen((v) => !v);
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    load();
  };

  const handleNotificationClick = async (n) => {
    if (!n.read) {
      await markNotificationRead(n._id);
      load();
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <Button variant="ghost" size="icon" onClick={handleOpen} className="relative">
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-md border bg-background shadow-lg z-50">
          <div className="flex items-center justify-between p-3 border-b">
            <span className="font-medium text-sm">Notifications</span>
            {unreadCount > 0 && (
              <button className="text-xs text-muted-foreground hover:underline" onClick={handleMarkAllRead}>
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 && (
              <p className="p-4 text-sm text-muted-foreground text-center">No notifications yet</p>
            )}
            {notifications.map((n) => (
              <Link
                key={n._id}
                to={n.ticket ? `/tickets/${n.ticket}` : "#"}
                onClick={() => handleNotificationClick(n)}
                className={`block p-3 text-sm border-b hover:bg-accent ${!n.read ? "bg-accent/40 font-medium" : ""}`}
              >
                {n.message}
                <div className="text-xs text-muted-foreground mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
