import styles from "@/app/dashboard/dashboard.module.css";
import logo from "@/public/logo.png";
import Image from "next/image";
import document from "@/public/icons/document.png";
import setting from "@/public/icons/setting.png";
import home from "@/public/icons/home.png";

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarTop}>
        <Image src={logo} alt="logo" />
        <Image src={setting} alt="setting" />
      </div>
      <div className={styles.sidebarMenu}>
        {menu.map((item, idx) => (
          <div
            key={item.label}
            className={`${styles.sidebarItem} ${
              idx === 1 ? styles.active : ""
            }`}
          >
            <div className={`${styles.sidebarIcon}`}>
              <Image src={item.icon} alt={item.label} />
            </div>
            <div className={styles.sidebarLabel}>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const menu = [
  {
    label: "Dashboard",
    icon: home,
  },
  {
    label: "Todo",
    icon: document,
  },
];
