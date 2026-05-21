"use client";

import { useEffect, useState, createContext, useContext } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Compass,
  BookOpen,
  Settings,
  LogOut,
  ChevronRight,
  Plus,
  Minus,
  X,
  Upload,
  Check,
  Share2,
  Star,
  Package,
  Heart,
  Bell,
  ChevronLeft,
  BarChart2,
  ArrowRight,
  Sparkles,
  Store,
  Lock,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("musa_token");
}

async function apiFetch(endpoint: string, options?: RequestInit) {
  const token = getToken();

  const res = await fetch(`${API}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "API request failed");
  }

  return res.json();
}

type Page =
  | "login"
  | "signup"
  | "explore"
  | "cart"
  | "studio"
  | "profile"
  | "published"
  | "create-listing";

interface Product {
  id: number;
  title: string;
  studio: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  active?: boolean;
}

interface CartItem extends Product {
  qty: number;
}

interface AppUser {
  name: string;
  username: string;
  email: string;
  isSeller: boolean;
  memberSince: string;
  earnings: number;
  rating: number;
  studio?: {
    id: number;
    name: string;
    craft_type: string;
    description: string;
  };
}

const AppCtx = createContext<any>(null);
const useApp = () => useContext(AppCtx);

const CATEGORIES = ["All Crafts", "Crochet", "Jewelry", "Pottery", "Textile"];

function mapBackendProduct(item: any): Product {
  return {
    id: Number(item.id),
    title: item.title || item.name || "Untitled Product",
    studio:
      item.studio?.name ||
      item.studio_name ||
      item.seller?.username ||
      item.creator ||
      "Musa Studio",
    price: Number(item.price || 0),
    category:
      item.category?.name ||
      item.category ||
      item.type ||
      "Craft",
    image:
      item.image ||
      item.image_url ||
      item.photo ||
      "https://i.pinimg.com/736x/d2/67/d8/d267d82e19e94dedc80a457c03f0f2f7.jpg",
    rating: Number(item.rating || 4.8),
    active: item.active ?? true,
  };
}

function CottonBallLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="14" cy="22" r="8" fill="#FFFEF8" opacity="0.9" />
      <circle cx="26" cy="22" r="8" fill="#FFFEF8" opacity="0.9" />
      <circle cx="20" cy="16" r="9" fill="#FFFEF8" />
      <circle cx="20" cy="26" r="6" fill="#FFFEF8" opacity="0.85" />
      <rect x="17" y="28" width="6" height="7" rx="2" fill="#a8c46a" />
    </svg>
  );
}

function Shell({
  children,
  page,
  setPage,
}: {
  children: React.ReactNode;
  page: Page;
  setPage: (p: Page) => void;
}) {
  const { cart } = useApp();

  const isAuth = !["login", "signup"].includes(page);
  const isFullscreen = ["login", "signup", "published"].includes(page);

  const navItems = [
    { id: "explore", icon: <Compass size={20} />, label: "Explore" },
    {
      id: "cart",
      icon: <ShoppingCart size={20} />,
      label: "Cart",
      badge: cart.length,
    },
    { id: "studio", icon: <BookOpen size={20} />, label: "My Studio" },
    { id: "profile", icon: <User size={20} />, label: "Profile" },
  ];

  if (isFullscreen) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: "var(--cream)" }}
      >
        <div className="w-full max-w-sm">{children}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: "var(--parchment)" }}>
      {isAuth && (
        <aside
          className="hidden md:flex flex-col w-72 shrink-0 sticky top-0 h-screen border-r"
          style={{ background: "var(--cream)", borderColor: "var(--pink-border)" }}
        >
          <div className="px-5 py-6 border-b" style={{ borderColor: "var(--pink-border)" }}>
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center"
                style={{ background: "var(--sage-dark)" }}
              >
                <CottonBallLogo size={26} />
              </div>
              <div>
                <p
                  className="font-bold text-xl"
                  style={{ color: "var(--charcoal)", fontFamily: "Georgia,serif" }}
                >
                  Musa
                </p>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  Craft Market
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setPage(item.id as Page)}
                className="flex items-center gap-4 px-4 py-3 rounded-2xl text-base font-medium transition-all relative w-full text-left"
                style={{
                  background: page === item.id ? "var(--pink-bg)" : "transparent",
                  color: page === item.id ? "var(--pink-dark)" : "var(--muted)",
                }}
              >
                {item.icon}
                {item.label}

                {item.badge ? (
                  <span
                    className="ml-auto text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
                    style={{
                      background: "var(--sage-dark)",
                      color: "var(--cream)",
                    }}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </nav>

          <div className="px-5 pb-6">
            <div
              className="rounded-3xl overflow-hidden shadow-card"
              style={{
                background: "var(--pink-bg)",
                border: "1px solid var(--pink-border)",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=500&q=80"
                alt="Handmade craft"
                className="w-full h-32 object-cover"
              />
              <div className="p-4">
                <p className="font-bold text-sm mb-1" style={{ color: "var(--pink-dark)" }}>
                  Open your studio
                </p>
                <p className="text-xs mb-3" style={{ color: "var(--bark)", opacity: 0.75 }}>
                  Sell cozy handmade pieces to people who love craft.
                </p>
                <button
                  onClick={() => setPage("studio")}
                  className="w-full rounded-xl py-2 text-xs font-semibold"
                  style={{ background: "var(--cream)", color: "var(--sage-dark)" }}
                >
                  Start selling
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}

      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 flex flex-col md:py-6 md:px-8">
          <div className="flex-1 flex flex-col w-full max-w-6xl mx-auto">
            <div
              className="flex-1 rounded-none md:rounded-3xl overflow-hidden md:shadow-soft relative flex flex-col border"
              style={{ background: "var(--cream)", borderColor: "var(--pink-border)" }}
            >
              <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
                {children}
              </div>

              {isAuth && (
                <nav
                  className="md:hidden sticky bottom-0 border-t flex justify-around py-2 px-2 z-40"
                  style={{
                    background: "var(--cream)",
                    borderColor: "var(--pink-border)",
                  }}
                >
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setPage(item.id as Page)}
                      className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all relative"
                      style={{
                        color: page === item.id ? "var(--pink-dark)" : "var(--muted)",
                        background: page === item.id ? "var(--pink-bg)" : "transparent",
                      }}
                    >
                      {item.icon}
                      <span style={{ fontSize: "10px" }}>{item.label}</span>

                      {item.badge ? (
                        <span
                          className="absolute -top-0.5 right-1 w-4 h-4 rounded-full flex items-center justify-center font-bold"
                          style={{
                            background: "var(--sage-dark)",
                            color: "var(--cream)",
                            fontSize: "9px",
                          }}
                        >
                          {item.badge}
                        </span>
                      ) : null}
                    </button>
                  ))}
                </nav>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function TopBar({
  title,
  subtitle,
  back,
  onBack,
  actions,
}: {
  title: string;
  subtitle?: string;
  back?: boolean;
  onBack?: () => void;
  actions?: React.ReactNode;
}) {
  return (
    <header
      className="sticky top-0 z-30 px-6 py-4 flex items-center gap-3 border-b"
      style={{
        background: "rgba(255,254,248,0.97)",
        backdropFilter: "blur(8px)",
        borderColor: "var(--pink-border)",
      }}
    >
      {back && (
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "var(--parchment)" }}
        >
          <ChevronLeft size={18} />
        </button>
      )}

      <div className="flex-1 min-w-0">
        {subtitle && (
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--sage)" }}>
            {subtitle}
          </p>
        )}

        <h1
          className="text-2xl font-bold truncate"
          style={{ color: "var(--charcoal)", fontFamily: "Georgia,serif" }}
        >
          {title}
        </h1>
      </div>

      {actions}
    </header>
  );
}

function ProductCard({
  product,
  onAdd,
  onRemoveFavourite,
}: {
  product: Product;
  onAdd: (p: Product) => void;
  onRemoveFavourite?: (id: number) => void;
}) {
  const { favourites, toggleFavourite } = useApp();
  const liked = favourites.includes(product.id);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAdd(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const handleHeart = () => {
    toggleFavourite(product.id);
    if (liked && onRemoveFavourite) onRemoveFavourite(product.id);
  };

  return (
    <div className="card animate-fadeIn flex flex-col">
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{ background: "var(--parchment)", height: "190px" }}
      >
        <img src={product.image} alt={product.title} className="w-full h-full object-cover" />

        <button
          onClick={handleHeart}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{ background: "rgba(255,255,255,0.88)" }}
        >
          <Heart
            size={15}
            style={{
              fill: liked ? "var(--rose)" : "none",
              color: liked ? "var(--rose)" : "var(--muted)",
            }}
          />
        </button>

        <div
          className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full"
          style={{ background: "rgba(255,255,255,0.9)" }}
        >
          <Star size={11} style={{ fill: "#f0a500", color: "#f0a500" }} />
          <span style={{ fontSize: "11px", color: "var(--charcoal)", fontWeight: 700 }}>
            {product.rating}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p
          style={{
            fontSize: "10px",
            color: "var(--muted)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {product.studio}
        </p>

        <p
          className="text-sm font-semibold leading-tight mt-1 flex-1"
          style={{ color: "var(--charcoal)" }}
        >
          {product.title}
        </p>

        <div className="flex items-center justify-between mt-3">
          <p className="text-base font-bold" style={{ color: "var(--sage-dark)" }}>
            ${product.price}
          </p>

          <button
            onClick={handleAdd}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
            style={{
              background: added ? "var(--mint)" : "var(--sage-dark)",
              color: added ? "var(--sage-dark)" : "var(--cream)",
            }}
          >
            {added ? <Check size={13} /> : <Plus size={13} />}
            {added ? "Added" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

function LoginPage({ setPage }: { setPage: (p: Page) => void }) {
  const { login } = useApp();

  const [form, setForm] = useState({
    email: "demo@musa.com",
    password: "password",
  });

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    if (!form.email || !form.password) {
      setErr("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      setErr("");

      const data = await apiFetch("/auth/login/", {
        method: "POST",
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const backendUser = data.user || data;

      login({
        name: backendUser.name || backendUser.full_name || backendUser.username || "User",
        username: backendUser.username || backendUser.email || "user",
        email: backendUser.email || form.email,
        isSeller: backendUser.is_seller ?? backendUser.isSeller ?? true,
        memberSince: backendUser.member_since || backendUser.memberSince || "2026",
        earnings: Number(backendUser.earnings || 0),
        rating: Number(backendUser.rating || 100),
      });

      if (data.access || data.token) {
        localStorage.setItem("musa_token", data.access || data.token);
      }

      setPage("explore");
    } catch (error) {
      setErr("Login failed. Check email/password or backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm animate-scaleIn">
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-soft"
            style={{ background: "var(--sage-dark)" }}
          >
            <CottonBallLogo size={32} />
          </div>

          <h1
            className="text-3xl font-bold"
            style={{ color: "var(--charcoal)", fontFamily: "Georgia,serif" }}
          >
            Musa
          </h1>

          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            Craft Market
          </p>
        </div>

        <div
          className="rounded-3xl p-6 shadow-soft"
          style={{ background: "white", border: "1px solid var(--pink-border)" }}
        >
          <h2
            className="text-xl font-bold mb-5"
            style={{ color: "var(--charcoal)", fontFamily: "Georgia,serif" }}
          >
            Welcome back
          </h2>

          {err && (
            <p
              className="text-sm mb-4 px-3 py-2 rounded-xl"
              style={{
                color: "var(--bark)",
                background: "rgba(255,212,212,0.45)",
              }}
            >
              {err}
            </p>
          )}

          <div className="space-y-3">
            <input
              className="input-field"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              className="input-field"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handle()}
            />
          </div>

          <button onClick={handle} disabled={loading} className="btn-primary w-full mt-5 py-3">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>

        <p className="text-center text-sm mt-5" style={{ color: "var(--muted)" }}>
          New to Musa?{" "}
          <button
            onClick={() => setPage("signup")}
            className="font-semibold hover:underline"
            style={{ color: "var(--sage)" }}
          >
            Create account
          </button>
        </p>
      </div>
    </div>
  );
}

function SignupPage({ setPage }: { setPage: (p: Page) => void }) {
  const { login } = useApp();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const handle = async () => {
  if (!form.name || !form.email || !form.password) return;

  try {
    const data = await apiFetch("/auth/register/", {
      method: "POST",
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password,
      }),
    });

    if (data.access || data.token) {
      localStorage.setItem("musa_token", data.access || data.token);
    }

    login({
      name: data.user?.name || form.name,
      username: form.username || form.name.toLowerCase().replace(/\s/g, "_"),
      email: data.user?.email || form.email,
      isSeller: false,
      memberSince: "2026",
      earnings: 0,
      rating: 0,
    });

    setPage("explore");
  } catch (err: any) {
  alert(err.message || "Signup failed");
}
};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm animate-scaleIn">
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-soft"
            style={{ background: "var(--sage-dark)" }}
          >
            <CottonBallLogo size={32} />
          </div>

          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--charcoal)", fontFamily: "Georgia,serif" }}
          >
            Join Musa
          </h1>
        </div>

        <div
          className="rounded-3xl p-6 shadow-soft"
          style={{ background: "white", border: "1px solid var(--pink-border)" }}
        >
          <div className="space-y-3">
            <input
              className="input-field"
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              className="input-field"
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />

            <input
              className="input-field"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              className="input-field"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button onClick={handle} className="btn-primary w-full mt-5 py-3">
            Create Account
          </button>
        </div>

        <p className="text-center text-sm mt-5" style={{ color: "var(--muted)" }}>
          Already have an account?{" "}
          <button
            onClick={() => setPage("login")}
            className="font-semibold hover:underline"
            style={{ color: "var(--sage)" }}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}

function ExplorePage({ setPage }: { setPage: (p: Page) => void }) {
  const { addToCart, user, products, setProducts } = useApp();

  const [cat, setCat] = useState("All Crafts");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(products.length === 0);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    apiFetch("/products/")
      .then((data) => {
        const rawProducts = Array.isArray(data) ? data : data.results || data.products || [];
        const mapped = rawProducts.map(mapBackendProduct);

        if (mounted) {
          setProducts(mapped);
        }
      })
      .catch(() => {
        if (mounted) {
          setError("Could not load products.");
          setProducts([]);
       }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [setProducts]);

  const filtered = products.filter((p: Product) => {
    const matchCat = cat === "All Crafts" || p.category === cat;

    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.studio.toLowerCase().includes(search.toLowerCase());

    return matchCat && matchSearch;
  });

  return (
    <div>
      <TopBar
        title="Discover Handmade"
        subtitle="Musa Craft Market"
        actions={
          <div className="flex items-center gap-2">
            {!user && (
              <button
                onClick={() => setPage("login")}
                className="hidden sm:block px-4 py-2 rounded-xl text-sm font-semibold"
                style={{ background: "var(--pink-bg)", color: "var(--pink-dark)" }}
              >
                Sign in
              </button>
            )}

            <button
              className="w-9 h-9 rounded-full flex items-center justify-center relative shrink-0"
              style={{ background: "var(--parchment)" }}
            >
              <Bell size={16} />
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                style={{ background: "var(--rose)" }}
              />
            </button>
          </div>
        }
      />

      <div className="px-6 pt-5">
        <div className="relative mb-4">
          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--muted)" }}
          />

          <input
            className="input-field"
            style={{ paddingLeft: "2.5rem" }}
            placeholder="Search handmade items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-4">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`tag${c === cat ? " active" : ""}`}
            >
              {c}
            </button>
          ))}
        </div>

        {error && (
          <p
            className="text-xs mb-4 rounded-xl px-3 py-2"
            style={{ background: "var(--pink-bg)", color: "var(--bark)" }}
          >
            {error}
          </p>
        )}
      </div>

      {loading ? (
        <div className="px-6 py-20 text-center">
          <p style={{ color: "var(--muted)" }}>Loading handmade products...</p>
        </div>
      ) : (
        <div className="px-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-8">
          {filtered.map((p: Product) => (
            <ProductCard key={p.id} product={p} onAdd={addToCart} />
          ))}
        </div>
      )}
    </div>
  );
}

function CartPage({ setPage }: { setPage: (p: Page) => void }) {
  const { cart, updateQty, removeFromCart } = useApp();
  const [giftWrap, setGiftWrap] = useState(false);

  const GIFT_WRAP_COST = 2.5;
  const subtotal = cart.reduce((s: number, i: CartItem) => s + i.price * i.qty, 0);
  const shipping = subtotal > 0 && subtotal < 75 ? 5 : 0;
  const total = subtotal + shipping + (giftWrap ? GIFT_WRAP_COST : 0);

  return (
    <div>
      <TopBar title="Your Cart" />

      <div className="px-6 pt-5 pb-8">
        {cart.length === 0 ? (
          <div className="text-center py-20">
            <p style={{ fontSize: "3rem" }} className="mb-3">
              🛒
            </p>

            <p className="font-semibold" style={{ color: "var(--charcoal)" }}>
              Your cart is empty
            </p>

            <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
              Browse handmade goods to fill it up
            </p>

            <button
              onClick={() => setPage("explore")}
              className="btn-primary mt-4 gap-2 py-2.5 px-4"
            >
              <Compass size={15} /> Browse Crafts
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-5">
              {cart.map((item: CartItem) => (
                <div key={item.id} className="card flex gap-4 p-4 animate-fadeIn">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 rounded-2xl object-cover shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: "10px", color: "var(--muted)", textTransform: "uppercase" }}>
                      {item.studio}
                    </p>

                    <p className="text-sm font-semibold truncate" style={{ color: "var(--charcoal)" }}>
                      {item.title}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      <div
                        className="flex items-center gap-3 rounded-xl px-3 py-1.5"
                        style={{ background: "var(--parchment)" }}
                      >
                        <button onClick={() => updateQty(item.id, item.qty - 1)}>
                          <Minus size={12} />
                        </button>

                        <span className="text-sm font-bold w-4 text-center">{item.qty}</span>

                        <button onClick={() => updateQty(item.id, item.qty + 1)}>
                          <Plus size={12} />
                        </button>
                      </div>

                      <p className="text-sm font-bold" style={{ color: "var(--sage-dark)" }}>
                        ${(item.price * item.qty).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="self-start"
                    style={{ color: "var(--muted)" }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div
              className="rounded-2xl p-4 mb-4 flex items-center gap-3"
              style={{
                background: "var(--pink-bg)",
                border: "1px solid var(--pink-border)",
              }}
            >
              <span className="text-xl">🎁</span>

              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: "var(--charcoal)" }}>
                  Gift Wrapping
                </p>

                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  Add a personal handmade note and wrapping (+${GIFT_WRAP_COST.toFixed(2)})
                </p>
              </div>

              <button
                onClick={() => setGiftWrap(!giftWrap)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold"
                style={{
                  background: giftWrap ? "var(--mint)" : "var(--sage-dark)",
                  color: giftWrap ? "var(--sage-dark)" : "var(--cream)",
                }}
              >
                {giftWrap ? (
                  <>
                    <Check size={13} /> Added
                  </>
                ) : (
                  <>
                    <Plus size={13} /> ${GIFT_WRAP_COST.toFixed(2)}
                  </>
                )}
              </button>
            </div>

            {shipping > 0 && (
              <div
                className="rounded-2xl p-4 mb-5 flex items-center gap-3"
                style={{ background: "rgba(255,212,212,0.42)" }}
              >
                <span>🚚</span>

                <p className="text-sm" style={{ color: "var(--bark)" }}>
                  Add <strong>${(75 - subtotal).toFixed(0)}</strong> more for free shipping
                </p>
              </div>
            )}

            <div
              className="rounded-2xl p-5 mb-5 shadow-card"
              style={{
                background: "white",
                border: "1px solid var(--pink-border)",
              }}
            >
              <p className="text-base font-bold mb-4" style={{ color: "var(--charcoal)" }}>
                Order Summary
              </p>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: "var(--muted)" }}>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                {giftWrap && (
                  <div className="flex justify-between">
                    <span style={{ color: "var(--muted)" }}>Gift wrapping</span>
                    <span>${GIFT_WRAP_COST.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span style={{ color: "var(--muted)" }}>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>

                <div className="h-px my-2" style={{ background: "var(--parchment)" }} />

                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span style={{ color: "var(--sage-dark)" }}>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button className="btn-primary w-full py-4 text-base gap-2">
              Checkout <ArrowRight size={18} />
            </button>

            <p className="text-center text-xs mt-3" style={{ color: "var(--muted)" }}>
              🔒 Secure Checkout
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function StudioRegistration({ setPage }: { setPage: (p: Page) => void }) {
  const { setStudioRegistered } = useApp();

  const [form, setForm] = useState({
    studioName: "",
    craftType: "",
    description: "",
  });

  const registerStudio = async () => {
  if (!form.studioName || !form.craftType) return;

  try {
    await apiFetch("/studios/me/", {
      method: "POST",
      body: JSON.stringify({
        name: form.studioName,
        craft_type: form.craftType,
        description: form.description,
      }),
    });

    setStudioRegistered(true);
  } catch (err) {
    alert("Studio registration failed. Make sure you are logged in.");
  }
};

  return (
    <div>
      <TopBar title="My Studio" subtitle="Creator Workspace" />

      <div className="px-5 py-5">
        <div
          className="rounded-[2rem] overflow-hidden shadow-soft border"
          style={{ background: "white", borderColor: "var(--pink-border)" }}
        >
          <div className="grid lg:grid-cols-[0.95fr_1fr] min-h-[430px]">
            <div className="relative hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1200&q=80"
                alt="Craft workspace"
                className="absolute inset-0 w-full h-full object-cover"
              />

              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(31,33,24,0.35), rgba(31,33,24,0.05))",
                }}
              />

              <div className="absolute left-6 bottom-6 max-w-xs">
                <p
                  className="text-xs font-bold uppercase tracking-widest mb-3"
                  style={{ color: "var(--sage-light)" }}
                >
                  Start selling
                </p>

                <h2
                  className="text-3xl font-bold leading-tight mb-2"
                  style={{ color: "var(--cream)", fontFamily: "Georgia,serif" }}
                >
                  Turn your craft into a cozy online studio.
                </h2>

                <p className="text-sm" style={{ color: "rgba(255,254,248,0.78)" }}>
                  Add your studio details, then create listings for handmade pieces.
                </p>
              </div>
            </div>

            <div className="p-5 md:p-7 flex items-center">
              <div className="w-full max-w-sm mx-auto">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: "var(--pink-bg)" }}
                >
                  <Store size={22} style={{ color: "var(--pink-dark)" }} />
                </div>

                <h1
                  className="text-3xl font-bold mb-1"
                  style={{ color: "var(--charcoal)", fontFamily: "Georgia,serif" }}
                >
                  Register your studio
                </h1>

                <p className="text-sm mb-5" style={{ color: "var(--muted)" }}>
                  Set up your seller space before publishing your first handmade item.
                </p>

                <div className="space-y-3">
                  <input
                    className="input-field"
                    placeholder="Studio name"
                    value={form.studioName}
                    onChange={(e) => setForm({ ...form, studioName: e.target.value })}
                  />

                  <select
                    className="input-field"
                    value={form.craftType}
                    onChange={(e) => setForm({ ...form, craftType: e.target.value })}
                  >
                    <option value="">Main craft type</option>
                    <option value="Crochet">Crochet</option>
                    <option value="Jewelry">Jewelry</option>
                    <option value="Pottery">Pottery</option>
                    <option value="Textile">Textile</option>
                    <option value="Mixed Crafts">Mixed Crafts</option>
                  </select>

                  <textarea
                    className="input-field resize-none"
                    rows={3}
                    placeholder="Describe your craft style..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <button onClick={() => setPage("explore")} className="btn-outline py-3">
                    Maybe later
                  </button>

                  <button onClick={registerStudio} className="btn-primary py-3 gap-2">
                    <Sparkles size={16} /> Register
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-3 mt-4">
          {[
            ["🧶", "List handmade items", "Upload your products with photos and pricing."],
            ["📦", "Manage orders", "Track purchases and studio activity."],
            ["🌿", "Grow your craft", "Build a small brand around your work."],
          ].map(([icon, title, text]) => (
            <div
              key={title}
              className="rounded-2xl p-4 border"
              style={{
                background: "var(--cream)",
                borderColor: "var(--pink-border)",
              }}
            >
              <p className="text-2xl mb-3">{icon}</p>
              <p className="font-bold mb-1" style={{ color: "var(--charcoal)" }}>
                {title}
              </p>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StudioPage({ setPage }: { setPage: (p: Page) => void }) {
  const { user, studioRegistered, products } = useApp();

  const myListings = products.filter((p: Product) => p.active);

  if (!user) {
    return (
      <div>
        <TopBar title="My Studio" subtitle="Creator Workspace" />

        <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
          <div
            className="w-16 h-16 rounded-3xl flex items-center justify-center mb-4"
            style={{ background: "var(--pink-bg)" }}
          >
            <Lock size={28} style={{ color: "var(--pink-dark)" }} />
          </div>

          <h2
            className="text-xl font-bold mb-2"
            style={{ color: "var(--charcoal)", fontFamily: "Georgia,serif" }}
          >
            Sign in to access your studio
          </h2>

          <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
            Create and manage your handmade listings after signing in.
          </p>

          <div className="flex gap-3">
            <button className="btn-primary py-2.5 px-5" onClick={() => setPage("login")}>
              Sign In
            </button>

            <button className="btn-outline py-2.5 px-5" onClick={() => setPage("signup")}>
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!studioRegistered) {
    return <StudioRegistration setPage={setPage} />;
  }

  return (
    <div>
      <div className="px-6 pt-6 pb-7" style={{ background: "var(--sage-dark)" }}>
        <div className="flex items-center gap-1.5 mb-1">
          <Store size={13} style={{ color: "var(--sage-light)" }} />

          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--sage-light)" }}
          >
            Creator Workspace
          </span>
        </div>

        <h1
          className="text-3xl font-bold mb-1"
          style={{ color: "var(--cream)", fontFamily: "Georgia,serif" }}
        >
          Studio 138
        </h1>

        <p className="text-sm mb-5" style={{ color: "rgba(255,254,248,0.75)" }}>
          Welcome back to your creative sanctuary.
        </p>

        <button
          onClick={() => setPage("create-listing")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold"
          style={{ background: "var(--cream)", color: "var(--sage-dark)" }}
        >
          <Plus size={15} /> Create New Listing
        </button>
      </div>

      <div className="grid grid-cols-3 gap-px border-b" style={{ background: "var(--pink-border)" }}>
        {[
          ["📦", "Active Listings", `${myListings.length} items`],
          ["💰", "Studio Earnings", `$${user?.earnings?.toLocaleString() ?? "0"}`],
          ["⭐", "Customer Love", `${user?.rating ?? 100}% Positive`],
        ].map(([icon, label, value]) => (
          <div
            key={label}
            className="flex flex-col items-center py-5 px-2 text-center"
            style={{ background: "var(--cream)" }}
          >
            <span className="text-xl mb-1">{icon}</span>

            <p className="text-sm font-bold" style={{ color: "var(--sage-dark)" }}>
              {value}
            </p>

            <p
              style={{
                fontSize: "10px",
                color: "var(--muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginTop: "2px",
              }}
            >
              {label}
            </p>
          </div>
        ))}
      </div>

      <div className="px-6 pt-5">
        <button
          className="w-full flex items-center gap-3 p-4 rounded-2xl mb-5 border"
          style={{ background: "white", borderColor: "var(--pink-border)" }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "var(--pink-bg)" }}
          >
            <BarChart2 size={18} style={{ color: "var(--pink-dark)" }} />
          </div>

          <div className="flex-1 text-left">
            <p className="text-sm font-semibold" style={{ color: "var(--charcoal)" }}>
              View Studio Analytics
            </p>

            <p className="text-xs" style={{ color: "var(--muted)" }}>
              Track views, sales & earnings
            </p>
          </div>

          <ChevronRight size={16} style={{ color: "var(--muted)" }} />
        </button>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {myListings.map((p: Product) => (
            <ProductCard key={p.id} product={p} onAdd={() => {}} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CreateListingPage({ setPage }: { setPage: (p: Page) => void }) {
  const [form, setForm] = useState({
    title: "",
    category: "",
    price: "",
    description: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);

  const handleImageFile = (file: File) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        image: reader.result as string,
      }));
    };

    reader.readAsDataURL(file);
  };

  const publishListing = async () => {
    if (!form.title || !form.category || !form.price) {
      alert("Please fill title, category, and price.");
      return;
    }

    try {
      setLoading(true);

      await apiFetch("/products/", {
        method: "POST",
        body: JSON.stringify({
          title: form.title,
          category: form.category,
          price: form.price,
          description: form.description,
          image: form.image,
          active: true,
        }),
      });

      setPage("published");
    } catch (err: any) {
      alert(err.message || "Could not publish product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <TopBar
        title="Create Listing"
        subtitle="New Product"
        back
        onBack={() => setPage("studio")}
      />

      <div className="px-6 pt-5 pb-8 space-y-4">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();

            const file = e.dataTransfer.files[0];

            if (file) {
              handleImageFile(file);
            }
          }}
          className="rounded-2xl p-8 flex flex-col items-center gap-2 cursor-pointer"
          style={{
            border: "2px dashed var(--muted-light)",
          }}
        >
          <input
            type="file"
            accept="image/*"
            hidden
            id="product-image"
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (file) {
                handleImageFile(file);
              }
            }}
          />

          <label
            htmlFor="product-image"
            className="cursor-pointer text-center w-full"
          >
            {form.image ? (
              <img
                src={form.image}
                alt="Preview"
                className="w-full h-64 object-cover rounded-2xl"
              />
            ) : (
              <>
                <Upload
                  size={28}
                  style={{
                    color: "var(--muted)",
                    margin: "0 auto",
                  }}
                />

                <p className="text-sm mt-2">
                  Click to upload or drag & drop
                </p>

                <p className="text-xs">
                  PNG, JPG up to 10MB
                </p>
              </>
            )}
          </label>
        </div>

        <input
          className="input-field"
          placeholder="Product title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <select
          className="input-field"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        >
          <option value="">Select category</option>
          <option value="Crochet">Crochet</option>
          <option value="Jewelry">Jewelry</option>
          <option value="Pottery">Pottery</option>
          <option value="Textile">Textile</option>
        </select>

        <input
          className="input-field"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />

        <textarea
          className="input-field resize-none"
          rows={4}
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <button
          onClick={publishListing}
          disabled={loading}
          className="btn-primary w-full py-3 gap-2"
        >
          <Sparkles size={15} />

          {loading ? "Publishing..." : "Publish"}
        </button>
      </div>
    </div>
  );
}

function PublishedPage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "var(--cream)" }}
    >
      <div className="w-full max-w-sm text-center animate-scaleIn">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-soft"
          style={{ background: "var(--sage)" }}
        >
          <Check size={36} style={{ color: "white" }} />
        </div>

        <h2
          className="text-2xl font-bold mb-2"
          style={{ color: "var(--charcoal)", fontFamily: "Georgia,serif" }}
        >
          Your item is now live ✨
        </h2>

        <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
          The community is ready to discover your newest creation.
        </p>

        <div className="space-y-3">
          <button onClick={() => setPage("studio")} className="btn-primary w-full py-3 gap-2">
            <BookOpen size={16} /> Go to My Studio
          </button>

          <button className="btn-outline w-full py-3 gap-2">
            <Share2 size={16} /> Share Listing
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfilePage({ setPage }: { setPage: (p: Page) => void }) {
  const { user, logout } = useApp();

  return (
    <div>
      <TopBar title="Profile" />

      <div className="px-6 pt-5 pb-8 space-y-4">
        <div
          className="rounded-3xl p-6 text-center shadow-card animate-fadeIn"
          style={{
            background: "white",
            border: "1px solid var(--pink-border)",
          }}
        >
          <div
            className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-3 text-2xl font-bold"
            style={{ background: "var(--pink-bg)", color: "var(--pink-dark)" }}
          >
            {user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>

          <h2
            className="text-lg font-bold"
            style={{ color: "var(--charcoal)", fontFamily: "Georgia,serif" }}
          >
            {user?.username ?? "Guest"}
          </h2>

          <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
            Member since {user?.memberSince ?? "2026"}
          </p>

          {!user && (
            <button onClick={() => setPage("login")} className="btn-primary mt-4 py-2 px-5">
              Sign in
            </button>
          )}
        </div>

        <div
          className="rounded-2xl shadow-card overflow-hidden"
          style={{
            background: "white",
            border: "1px solid var(--pink-border)",
          }}
        >
          {[
            { icon: <Heart size={18} />, label: "Favourites", action: () => setPage("explore") },
            { icon: <BookOpen size={18} />, label: "My Studio", action: () => setPage("studio") },
            { icon: <Settings size={18} />, label: "Settings", action: () => {} },
          ].map((item, i, arr) => (
            <button
              key={i}
              onClick={item.action}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors"
              style={{
                borderBottom: i < arr.length - 1 ? "1px solid var(--parchment)" : "none",
              }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{
                  background: "var(--pink-bg)",
                  color: "var(--pink-dark)",
                }}
              >
                {item.icon}
              </div>

              <span className="text-sm font-semibold flex-1" style={{ color: "var(--charcoal)" }}>
                {item.label}
              </span>

              <ChevronRight size={16} style={{ color: "var(--muted)" }} />
            </button>
          ))}
        </div>

        {user && (
          <button
            onClick={() => {
              logout();
              setPage("explore");
            }}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl shadow-card"
            style={{
              background: "white",
              color: "var(--rose)",
              border: "1px solid var(--pink-border)",
            }}
          >
            <LogOut size={18} />
            <span className="text-sm font-semibold flex-1 text-left">Logout</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>("explore");
  const [user, setUser] = useState<AppUser | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [studioRegistered, setStudioRegistered] = useState(false);
  const [favourites, setFavourites] = useState<number[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

useEffect(() => {
  const token = localStorage.getItem("musa_token");

  if (!token) return;

  apiFetch("/auth/me/")
    .then((data) => {
      setUser({
        name: data.name,
        username: data.username,
        email: data.email,
        isSeller: data.isSeller,
        memberSince: data.memberSince,
        earnings: Number(data.earnings || 0),
        rating: Number(data.rating || 0),
        studio: data.studio,
      });

      if (data.studio) {
        setStudioRegistered(true);
      }
    })
    .catch(() => {
      localStorage.removeItem("musa_token");
    });
  }, []);

  const toggleFavourite = (id: number) =>
    setFavourites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );

  const safePage = (p: Page): Page => {
    if (user && (p === "login" || p === "signup")) return "explore";
    return p;
  };

  const setPageSafe = (p: Page) => setPage(safePage(p));

  const addToCart = (p: Product) =>
    setCart((prev) => {
      const ex = prev.find((i) => i.id === p.id);
      return ex
        ? prev.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i))
        : [...prev, { ...p, qty: 1 }];
    });

  const updateQty = (id: number, qty: number) =>
    qty <= 0
      ? setCart((prev) => prev.filter((i) => i.id !== id))
      : setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));

  const removeFromCart = (id: number) =>
    setCart((prev) => prev.filter((i) => i.id !== id));

  const login = (u: AppUser) => {
    setUser(u);
    setPage((p) => (p === "login" || p === "signup" ? "explore" : p));
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    setStudioRegistered(false);
    setFavourites([]);
    localStorage.removeItem("musa_token");
  };

  return (
    <AppCtx.Provider
      value={{
        user,
        cart,
        studioRegistered,
        setStudioRegistered,
        addToCart,
        updateQty,
        removeFromCart,
        login,
        logout,
        favourites,
        toggleFavourite,
        products,
        setProducts,
      }}
    >
      <Shell page={page} setPage={setPageSafe}>
        {page === "login" && <LoginPage setPage={setPageSafe} />}
        {page === "signup" && <SignupPage setPage={setPageSafe} />}
        {page === "explore" && <ExplorePage setPage={setPageSafe} />}
        {page === "cart" && <CartPage setPage={setPageSafe} />}
        {page === "studio" && <StudioPage setPage={setPageSafe} />}
        {page === "create-listing" && <CreateListingPage setPage={setPageSafe} />}
        {page === "published" && <PublishedPage setPage={setPageSafe} />}
        {page === "profile" && <ProfilePage setPage={setPageSafe} />}
      </Shell>
    </AppCtx.Provider>
  );
}