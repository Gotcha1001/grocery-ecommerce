import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
} from "react-icons/fi";

const quickLinks = [
  { label: "Home", href: "#" },
  { label: "Shop All", href: "#" },
  { label: "Fresh Produce", href: "#" },
  { label: "Special Offers", href: "#" },
  { label: "About Us", href: "#" },
  { label: "Contact", href: "#" },
];

const contactInfo = [
  {
    icon: FiPhone,
    label: "+27 31 555 0142",
    href: "tel:+27315550142",
  },
  {
    icon: FiMail,
    label: "support@grocerycart.com",
    href: "mailto:support@grocerycart.com",
  },
  {
    icon: FiMapPin,
    label: "123 Market Street, Durban, KwaZulu-Natal, 4001",
    href: "#",
  },
  {
    icon: FiClock,
    label: "Mon – Sat: 8:00 AM – 8:00 PM",
    href: null,
  },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-14 md:px-10 lg:px-16">
        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div>
            <a href="#" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg">
                <span className="text-lg font-bold">G</span>
              </div>
              <span className="text-xl font-bold text-text">
                Grocery<span className="text-primary">Cart</span>
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-6 text-muted">
              Fresh groceries and everyday essentials delivered straight to your
              doorstep.
            </p>
            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full"
              >
                <FiFacebook size={17} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full"
              >
                <FiInstagram size={17} />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-full"
              >
                <FiTwitter size={17} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-text">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-text">
              Contact Us
            </h3>
            <ul className="mt-4 space-y-4">
              {contactInfo.map(({ icon: Icon, label, href }) => (
                <li key={label} className="flex items-start gap-3">
                  <Icon size={17} className="mt-0.5 shrink-0 text-primary" />
                  {href ? (
                    <a
                      href={href}
                      className="text-sm leading-6 text-muted transition-colors hover:text-primary"
                    >
                      {label}
                    </a>
                  ) : (
                    <span className="text-sm leading-6 text-muted">
                      {label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} GroceryCart. All rights reserved</p>
          <p>
            Fresh groceries, delivered{" "}
            <span className="font-medium text-primary">with care.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
