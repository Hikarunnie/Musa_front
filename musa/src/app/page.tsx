"use client";
import { useState, createContext, useContext } from "react";
import {
  Search, ShoppingCart, User, Compass, BookOpen, Settings, LogOut,
  ChevronRight, Plus, Minus, X, Upload, Check, Share2, Star,
  TrendingUp, Package, Heart, Bell, ChevronLeft, BarChart2,
  ArrowRight, Leaf, Sparkles, Store
} from "lucide-react";

type Page = "login" | "signup" | "explore" | "cart" | "studio" | "profile" | "published" | "create-listing";

interface Product {
  id: number; title: string; studio: string; price: number;
  category: string; image: string; rating: number; active?: boolean;
}
interface CartItem extends Product { qty: number; }
interface AppUser {
  name: string; username: string; email: string;
  isSeller: boolean; memberSince: string; earnings: number; rating: number;
}

const AppCtx = createContext<any>(null);
const useApp = () => useContext(AppCtx);

const PRODUCTS: Product[] = [
  { id:1,  title:"Blue Crochet Top",       studio:"Studio 138", price:45,  category:"Crochet", image:"🧶", rating:4.9, active:true },
  { id:2,  title:"Beaded Necklace",         studio:"Studio 22",  price:32,  category:"Jewelry", image:"📿", rating:4.7 },
  { id:3,  title:"Pink Shawls",             studio:"Studio 77",  price:28,  category:"Crochet", image:"🧣", rating:4.8 },
  { id:4,  title:"Pink Bralette",           studio:"Studio 44",  price:38,  category:"Crochet", image:"🩷", rating:4.6 },
  { id:5,  title:"Earthy Cardigan",         studio:"Studio 138", price:120, category:"Crochet", image:"🧥", rating:5.0, active:true },
  { id:6,  title:"Floral Press-on Nails",   studio:"Studio 99",  price:24,  category:"Jewelry", image:"💅", rating:4.5 },
  { id:7,  title:"Hexagon Cardigan",        studio:"Studio 138", price:100, category:"Crochet", image:"🌿", rating:4.8, active:true },
  { id:8,  title:"Crochet Set",             studio:"Studio 138", price:65,  category:"Crochet", image:"🎀", rating:4.7, active:true },
  { id:9,  title:"Crochet Keychains",       studio:"Studio 138", price:12,  category:"Crochet", image:"🔑", rating:4.9, active:true },
  { id:10, title:"Pink Flower Earrings",    studio:"Studio 55",  price:21,  category:"Jewelry", image:"🌸", rating:4.6 },
];

const CATEGORIES = ["All Crafts", "Crochet", "Jewelry", "Pottery", "Textile"];

// ── Shell: centers app, shows desktop sidebar ─────────────────────────────────
function Shell({ children, page, setPage }: { children: React.ReactNode; page: Page; setPage: (p: Page) => void }) {
  const { cart } = useApp();
  const isAuth = !["login","signup"].includes(page);
  const isFullscreen = ["login","signup","published"].includes(page);

  const navItems = [
    { id:"explore", icon:<Compass size={20}/>, label:"Explore" },
    { id:"cart",    icon:<ShoppingCart size={20}/>, label:"Cart", badge: cart.length },
    { id:"studio",  icon:<BookOpen size={20}/>, label:"My Studio" },
    { id:"profile", icon:<User size={20}/>, label:"Profile" },
  ];

  if (isFullscreen) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{background:"var(--cream)"}}>
        <div className="w-full max-w-sm">{children}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{background:"var(--parchment)"}}>
      {/* Desktop sidebar */}
      {isAuth && (
        <aside className="hidden md:flex flex-col w-56 shrink-0 sticky top-0 h-screen border-r" style={{background:"var(--cream)", borderColor:"#e8e2d8"}}>
          {/* Logo */}
          <div className="px-5 py-5 border-b" style={{borderColor:"#e8e2d8"}}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:"var(--sage-dark)"}}>
                <Leaf size={16} style={{color:"var(--cream)"}}/>
              </div>
              <div>
                <p className="font-bold text-sm" style={{color:"var(--charcoal)", fontFamily:"Georgia,serif"}}>Musa</p>
                <p className="text-xs" style={{color:"var(--muted)"}}>Craft Market</p>
              </div>
            </div>
          </div>
          {/* Nav */}
          <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
            {navItems.map(item => (
              <button key={item.id} onClick={() => setPage(item.id as Page)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative w-full text-left"
                style={{
                  background: page===item.id ? "var(--mint)" : "transparent",
                  color: page===item.id ? "var(--sage-dark)" : "var(--muted)",
                }}>
                {item.icon}
                {item.label}
                {item.badge ? (
                  <span className="ml-auto text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center" style={{background:"var(--sage-dark)", color:"var(--cream)"}}>
                    {item.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </nav>
          {/* Bottom hint */}
          <div className="px-4 pb-5">
            <div className="rounded-2xl p-3 text-xs" style={{background:"var(--blush)"}}>
              <p className="font-bold mb-0.5" style={{color:"var(--bark)"}}>Share your craft</p>
              <p style={{color:"var(--bark)", opacity:0.7}}>Reach weavers worldwide</p>
            </div>
          </div>
        </aside>
      )}

      {/* Main content area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Inner container — phone-width on desktop, full on mobile */}
        <div className="flex-1 flex flex-col md:py-6 md:px-8">
          <div className="flex-1 flex flex-col w-full max-w-6xl mx-auto">
            <div className="flex-1 rounded-none md:rounded-3xl overflow-hidden md:shadow-soft relative flex flex-col border" style={{background:"var(--cream)", borderColor:"#E8E4D7"}}>
              {/* Page content */}
              <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
                {children}
              </div>
              {/* Mobile bottom nav */}
              {isAuth && (
                <nav className="md:hidden sticky bottom-0 border-t flex justify-around py-2 px-2 z-40" style={{background:"var(--cream)", borderColor:"#e8e2d8"}}>
                  {navItems.map(item => (
                    <button key={item.id} onClick={() => setPage(item.id as Page)}
                      className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all relative"
                      style={{ color: page===item.id ? "var(--sage)" : "var(--muted)", background: page===item.id ? "rgba(212,237,212,0.4)" : "transparent" }}>
                      {item.icon}
                      <span style={{fontSize:"10px"}}>{item.label}</span>
                      {item.badge ? (
                        <span className="absolute -top-0.5 right-1 w-4 h-4 rounded-full flex items-center justify-center font-bold" style={{background:"var(--sage-dark)", color:"var(--cream)", fontSize:"9px"}}>
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

// ── TopBar ────────────────────────────────────────────────────────────────────
function TopBar({ title, subtitle, back, onBack, actions }: { title: string; subtitle?: string; back?: boolean; onBack?: () => void; actions?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-30 px-4 py-3 flex items-center gap-3 border-b" style={{background:"rgba(250,247,242,0.97)", backdropFilter:"blur(8px)", borderColor:"#ede8df"}}>
      {back && (
        <button onClick={onBack} className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{background:"var(--parchment)"}}>
          <ChevronLeft size={18}/>
        </button>
      )}
      <div className="flex-1 min-w-0">
        {subtitle && <p className="text-xs font-semibold uppercase tracking-wider" style={{color:"var(--sage)"}}>{subtitle}</p>}
        <h1 className="text-lg font-bold truncate" style={{color:"var(--charcoal)", fontFamily:"Georgia,serif"}}>{title}</h1>
      </div>
      {actions}
    </header>
  );
}

// ── Product Card ──────────────────────────────────────────────────────────────
function ProductCard({ product, onAdd }: { product: Product; onAdd: (p: Product) => void }) {
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);
  const handleAdd = () => {
    onAdd(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };
  return (
    <div className="card animate-fadeIn flex flex-col">
      <div className="relative flex items-center justify-center" style={{background:"var(--parchment)", height:"150px"}}>
        <span style={{fontSize:"2.25rem"}}>{product.image}</span>
        <button onClick={() => setLiked(!liked)}
          className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{background:"rgba(255,255,255,0.85)"}}>
          <Heart size={13} style={{fill: liked ? "var(--rose)" : "none", color: liked ? "var(--rose)" : "var(--muted)"}}/>
        </button>
        <div className="absolute bottom-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full" style={{background:"rgba(255,255,255,0.85)"}}>
          <Star size={9} style={{fill:"#f0a500", color:"#f0a500"}}/>
          <span style={{fontSize:"10px", color:"var(--charcoal)", fontWeight:600}}>{product.rating}</span>
        </div>
      </div>
      <div className="p-3 flex flex-col flex-1">
        <p style={{fontSize:"9px", color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.05em"}}>{product.studio}</p>
        <p className="text-xs font-semibold leading-tight mt-0.5 flex-1" style={{color:"var(--charcoal)"}}>{product.title}</p>
        <div className="flex items-center justify-between mt-2">
          <p className="text-sm font-bold" style={{color:"var(--sage-dark)"}}>${product.price}</p>
          <button onClick={handleAdd}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all"
            style={{background: added ? "var(--mint)" : "var(--sage-dark)", color: added ? "var(--sage-dark)" : "var(--cream)"}}>
            {added ? <Check size={12}/> : <Plus size={12}/>}
            {added ? "Added" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── LOGIN ─────────────────────────────────────────────────────────────────────
function LoginPage({ setPage }: { setPage: (p: Page) => void }) {
  const { login } = useApp();
  const [form, setForm] = useState({ email:"demo@Musa.com", password:"password" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handle = () => {
    if (!form.email || !form.password) { setErr("Please fill in all fields."); return; }
    setLoading(true);
    setTimeout(() => {
      login({ name:"nn", username:"user_nn", email:form.email, isSeller:true, memberSince:"2023", earnings:1240, rating:100 });
      setPage("explore");
      setLoading(false);
    }, 700);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm animate-scaleIn">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-soft" style={{background:"var(--sage-dark)"}}>
            <Leaf size={28} style={{color:"var(--cream)"}}/>
          </div>
          <h1 className="text-3xl font-bold" style={{color:"var(--charcoal)", fontFamily:"Georgia,serif"}}>Musa</h1>
          <p className="text-sm mt-1" style={{color:"var(--muted)"}}>Craft Market</p>
        </div>
        <div className="rounded-3xl p-6 shadow-soft" style={{background:"white"}}>
          <h2 className="text-xl font-bold mb-5" style={{color:"var(--charcoal)", fontFamily:"Georgia,serif"}}>Welcome back</h2>
          {err && <p className="text-sm mb-4 px-3 py-2 rounded-xl" style={{color:"var(--rose)", background:"rgba(245,213,203,0.4)"}}>{err}</p>}
          <div className="space-y-3">
            {[{key:"email",type:"email",label:"Email",ph:"your@email.com"},{key:"password",type:"password",label:"Password",ph:"••••••••"}].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1" style={{color:"var(--muted)"}}>{f.label}</label>
                <input className="input-field" type={f.type} placeholder={f.ph}
                  value={(form as any)[f.key]} onChange={e => setForm({...form, [f.key]:e.target.value})}
                  onKeyDown={e => e.key==="Enter" && handle()}/>
              </div>
            ))}
          </div>
          <button onClick={handle} disabled={loading} className="btn-primary w-full mt-5 py-3 gap-2">
            {loading ? <span className="inline-block w-4 h-4 rounded-full border-2 animate-spin" style={{borderColor:"rgba(255,255,255,0.3)", borderTopColor:"white"}}/> : null}
            {loading ? "Signing in…" : "Sign In"}
          </button>
          <p className="text-center text-xs mt-3" style={{color:"var(--muted)"}}>
            Forgot password? <span className="cursor-pointer hover:underline" style={{color:"var(--sage)"}}>Reset</span>
          </p>
        </div>
        <p className="text-center text-sm mt-5" style={{color:"var(--muted)"}}>
          New to Musa?{" "}
          <button onClick={() => setPage("signup")} className="font-semibold hover:underline" style={{color:"var(--sage)"}}>Create account</button>
        </p>
      </div>
    </div>
  );
}

// ── SIGNUP ────────────────────────────────────────────────────────────────────
function SignupPage({ setPage }: { setPage: (p: Page) => void }) {
  const { login } = useApp();
  const [form, setForm] = useState({ name:"", username:"", email:"", password:"" });
  const [loading, setLoading] = useState(false);

  const handle = () => {
    if (!form.name || !form.email || !form.password) return;
    setLoading(true);
    setTimeout(() => {
      login({ name:form.name, username:form.username||form.name.toLowerCase().replace(/\s/g,"_"), email:form.email, isSeller:false, memberSince:"2026", earnings:0, rating:0 });
      setPage("explore");
      setLoading(false);
    }, 700);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm animate-scaleIn">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-soft" style={{background:"var(--sage-dark)"}}>
            <Sparkles size={28} style={{color:"var(--cream)"}}/>
          </div>
          <h1 className="text-2xl font-bold" style={{color:"var(--charcoal)", fontFamily:"Georgia,serif"}}>Join Musa</h1>
          <p className="text-sm mt-1" style={{color:"var(--muted)"}}>Discover handmade goods from real crafters</p>
        </div>
        <div className="rounded-3xl p-6 shadow-soft" style={{background:"white"}}>
          <div className="space-y-3">
            {[
              {key:"name",type:"text",label:"Full Name",ph:"Jane Doe"},
              {key:"username",type:"text",label:"Username",ph:"@jane_crafts"},
              {key:"email",type:"email",label:"Email",ph:"jane@email.com"},
              {key:"password",type:"password",label:"Password",ph:"Min 8 characters"},
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1" style={{color:"var(--muted)"}}>{f.label}</label>
                <input className="input-field" type={f.type} placeholder={f.ph}
                  value={(form as any)[f.key]} onChange={e => setForm({...form, [f.key]:e.target.value})}/>
              </div>
            ))}
          </div>
          <button onClick={handle} disabled={loading} className="btn-primary w-full mt-5 py-3 gap-2">
            {loading ? <span className="inline-block w-4 h-4 rounded-full border-2 animate-spin" style={{borderColor:"rgba(255,255,255,0.3)", borderTopColor:"white"}}/> : null}
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </div>
        <p className="text-center text-sm mt-5" style={{color:"var(--muted)"}}>
          Already have an account?{" "}
          <button onClick={() => setPage("login")} className="font-semibold hover:underline" style={{color:"var(--sage)"}}>Sign in</button>
        </p>
      </div>
    </div>
  );
}

// ── EXPLORE ───────────────────────────────────────────────────────────────────
function ExplorePage({ setPage }: { setPage: (p: Page) => void }) {
  const { addToCart } = useApp();
  const [cat, setCat] = useState("All Crafts");
  const [search, setSearch] = useState("");

  const filtered = PRODUCTS.filter(p => {
    const matchCat = cat === "All Crafts" || p.category === cat;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.studio.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div>
      <TopBar title="Craft Market" actions={
        <button className="w-8 h-8 rounded-full flex items-center justify-center relative shrink-0" style={{background:"var(--parchment)"}}>
          <Bell size={16}/>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{background:"var(--rose)"}}/>
        </button>
      }/>
      <div className="px-4 pt-3">
        <div className="relative mb-3">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{color:"var(--muted)"}}/>
          <input className="input-field pl-9" placeholder="Search handmade items…" value={search} onChange={e => setSearch(e.target.value)}/>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-3">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)} className={`tag${c===cat?" active":""}`}>{c}</button>
          ))}
        </div>
      </div>
      <div className="px-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-6">
        {filtered.map((p, i) => (
          <div key={p.id} style={{animationDelay:`${i*50}ms`}}>
            <ProductCard product={p} onAdd={addToCart}/>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-16" style={{color:"var(--muted)"}}>
            <p style={{fontSize:"2.5rem"}} className="mb-2">🧺</p>
            <p className="text-sm font-medium">No items found</p>
            <p className="text-xs mt-1">Try a different search or category</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── CART ──────────────────────────────────────────────────────────────────────
function CartPage({ setPage }: { setPage: (p: Page) => void }) {
  const { cart, updateQty, removeFromCart } = useApp();
  const subtotal = cart.reduce((s: number, i: CartItem) => s + i.price * i.qty, 0);
  const shipping = subtotal > 0 && subtotal < 75 ? 5 : 0;

  return (
    <div>
      <TopBar title="Your Cart" subtitle={cart.length ? `${cart.length} item${cart.length>1?"s":""}` : undefined}/>
      <div className="px-4 pt-4 pb-6">
        {cart.length === 0 ? (
          <div className="text-center py-20">
            <p style={{fontSize:"3rem"}} className="mb-3">🛒</p>
            <p className="font-semibold" style={{color:"var(--charcoal)"}}>Your cart is empty</p>
            <p className="text-sm mt-1" style={{color:"var(--muted)"}}>Browse handmade goods to fill it up</p>
            <button onClick={() => setPage("explore")} className="btn-primary mt-4 gap-2 py-2.5 px-4">
              <Compass size={15}/> Browse Crafts
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-4">
              {cart.map((item: CartItem) => (
                <div key={item.id} className="card flex gap-3 p-3 animate-fadeIn">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{background:"var(--parchment)"}}>{item.image}</div>
                  <div className="flex-1 min-w-0">
                    <p style={{fontSize:"9px", color:"var(--muted)", textTransform:"uppercase"}}>{item.studio}</p>
                    <p className="text-sm font-semibold truncate" style={{color:"var(--charcoal)"}}>{item.title}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 rounded-xl px-2 py-1" style={{background:"var(--parchment)"}}>
                        <button onClick={() => updateQty(item.id, item.qty-1)} className="w-5 h-5 flex items-center justify-center"><Minus size={11}/></button>
                        <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, item.qty+1)} className="w-5 h-5 flex items-center justify-center"><Plus size={11}/></button>
                      </div>
                      <p className="text-sm font-bold" style={{color:"var(--sage-dark)"}}>${(item.price*item.qty).toFixed(2)}</p>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="self-start" style={{color:"var(--muted)"}}><X size={15}/></button>
                </div>
              ))}
            </div>

            {/* Upsells */}
            <div className="rounded-2xl p-3 mb-3 flex items-start gap-3" style={{background:"rgba(212,237,212,0.35)"}}>
              <span>🎁</span>
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{color:"var(--charcoal)"}}>Gift Wrapping</p>
                <p className="text-xs" style={{color:"var(--muted)"}}>Add a personal touch to your order</p>
              </div>
              <button className="text-xs font-semibold underline whitespace-nowrap" style={{color:"var(--sage)"}}>+$2.50</button>
            </div>
            {shipping > 0 && (
              <div className="rounded-2xl p-3 mb-4 flex items-center gap-2" style={{background:"rgba(245,213,203,0.35)"}}>
                <span>🚚</span>
                <p className="text-xs" style={{color:"var(--bark)"}}>Add <strong>${(75-subtotal).toFixed(0)}</strong> more for free shipping</p>
              </div>
            )}

            {/* Order summary */}
            <div className="rounded-2xl p-4 mb-4 shadow-card" style={{background:"white"}}>
              <p className="text-sm font-bold mb-3" style={{color:"var(--charcoal)"}}>Order Summary</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span style={{color:"var(--muted)"}}>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span style={{color:"var(--muted)"}}>Shipping</span><span>{shipping===0 ? <span style={{color:"var(--sage-dark)"}}>Free</span> : `$${shipping}`}</span></div>
                <div className="h-px my-1" style={{background:"var(--parchment)"}}/>
                <div className="flex justify-between font-bold"><span>Total</span><span style={{color:"var(--sage-dark)"}}>${(subtotal+shipping).toFixed(2)}</span></div>
              </div>
            </div>

            <button className="btn-primary w-full py-3.5 text-base gap-2">
              Checkout <ArrowRight size={17}/>
            </button>
            <p className="text-center text-xs mt-2" style={{color:"var(--muted)"}}>🔒 Secure Checkout</p>
          </>
        )}
      </div>
    </div>
  );
}

// ── STUDIO ────────────────────────────────────────────────────────────────────
function StudioPage({ setPage }: { setPage: (p: Page) => void }) {
  const { user } = useApp();
  const myListings = PRODUCTS.filter(p => p.active);

  return (
    <div>
      {/* Hero header */}
      <div className="px-5 pt-5 pb-6" style={{background:"var(--sage-dark)"}}>
        <div className="flex items-center gap-1.5 mb-1">
          <Store size={12} style={{color:"var(--sage-light)"}}/>
          <span className="text-xs font-semibold uppercase tracking-wider" style={{color:"var(--sage-light)"}}>Creator Workspace</span>
        </div>
        <h1 className="text-2xl font-bold mb-1" style={{color:"var(--cream)", fontFamily:"Georgia,serif"}}>Studio 138</h1>
        <p className="text-sm mb-4" style={{color:"rgba(212,237,212,0.75)"}}>Welcome back to your creative sanctuary.</p>
        <button onClick={() => setPage("create-listing")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all hover:opacity-90"
          style={{background:"var(--cream)", color:"var(--sage-dark)"}}>
          <Plus size={15}/> Create New Listing
        </button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-px mx-0 border-b" style={{background:"#ddd", borderColor:"#e8e2d8"}}>
        {[
          { icon:"📦", label:"Active Listings", value:`${myListings.length} items` },
          { icon:"💰", label:"Studio Earnings",  value:`$${user?.earnings?.toLocaleString()??"0"}`, highlight:true },
          { icon:"⭐", label:"Customer Love",    value:`${user?.rating??100}% Positive` },
        ].map((s, i) => (
          <div key={i} className="flex flex-col items-center py-4 px-2 text-center" style={{background:"var(--cream)"}}>
            <span className="text-xl mb-1">{s.icon}</span>
            <p className="text-xs font-bold" style={{color: s.highlight ? "var(--sage-dark)" : "var(--charcoal)"}}>{s.value}</p>
            <p style={{fontSize:"9px", color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.05em", marginTop:"2px"}}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="px-4 pt-4">
        {/* Analytics button */}
        <button className="w-full flex items-center gap-3 p-3 rounded-2xl mb-5 border transition-all hover:shadow-card"
          style={{background:"white", borderColor:"#ede8df"}}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:"var(--mint)"}}>
            <BarChart2 size={17} style={{color:"var(--sage)"}}/>
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold" style={{color:"var(--charcoal)"}}>View Studio Analytics</p>
            <p className="text-xs" style={{color:"var(--muted)"}}>Track views, sales & earnings</p>
          </div>
          <ChevronRight size={16} style={{color:"var(--muted)"}}/>
        </button>

        {/* My Items */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold" style={{color:"var(--charcoal)"}}>My Items</h2>
          <button className="text-xs font-semibold" style={{color:"var(--sage)"}}>View All</button>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {myListings.map((p, i) => (
            <div key={p.id} className="card animate-fadeIn" style={{animationDelay:`${i*60}ms`}}>
              <div className="flex items-center justify-center rounded-t-2xl" style={{background:"var(--parchment)", height:"80px", fontSize:"2rem"}}>{p.image}</div>
              <div className="p-3">
                <p className="text-xs font-semibold truncate" style={{color:"var(--charcoal)"}}>{p.title}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="status-active">Active</span>
                  <span className="text-xs font-bold" style={{color:"var(--sage-dark)"}}>${p.price}</span>
                </div>
              </div>
            </div>
          ))}
          {/* New item tile */}
          <button onClick={() => setPage("create-listing")}
            className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed transition-all min-h-32 group"
            style={{borderColor:"var(--muted-light)", background:"transparent"}}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--sage)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--muted-light)"; }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:"var(--parchment)"}}>
              <Plus size={18} style={{color:"var(--muted)"}}/>
            </div>
            <span className="text-xs font-medium" style={{color:"var(--muted)"}}>New Item</span>
          </button>
        </div>

        {/* Notification strip */}
        <div className="flex items-center gap-3 p-3 rounded-2xl mb-6" style={{background:"rgba(245,213,203,0.4)"}}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{background:"var(--blush)"}}>
            <span>🧶</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold" style={{color:"var(--bark)"}}>Matched Yarn Found</p>
            <p className="text-xs" style={{color:"var(--bark)", opacity:.7}}>Cotton Candy Blue #402</p>
          </div>
          <button style={{color:"var(--muted)"}}><X size={14}/></button>
        </div>
      </div>
    </div>
  );
}

// ── CREATE LISTING ────────────────────────────────────────────────────────────
function CreateListingPage({ setPage }: { setPage: (p: Page) => void }) {
  const [form, setForm] = useState({ title:"", category:"", price:"", description:"" });
  const [image, setImage] = useState<string|null>(null);
  const [dragging, setDragging] = useState(false);
  const [saving, setSaving] = useState(false);

  const publish = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setPage("published"); }, 1000);
  };

  return (
    <div>
      <TopBar title="Create Listing" subtitle="New Product" back onBack={() => setPage("studio")}/>
      <div className="px-4 pt-4 pb-8 space-y-4">
        {/* Image upload */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{color:"var(--muted)"}}>Product Images</label>
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if(f) setImage(URL.createObjectURL(f)); }}
            className="rounded-2xl p-8 flex flex-col items-center gap-2 cursor-pointer transition-all"
            style={{border:`2px dashed ${dragging ? "var(--sage)" : "var(--muted-light)"}`, background: dragging ? "rgba(212,237,212,0.15)" : "transparent"}}>
            {image ? (
              <img src={image} alt="product" className="w-full h-36 object-cover rounded-xl"/>
            ) : (
              <>
                <Upload size={26} style={{color:"var(--muted)"}}/>
                <p className="text-sm text-center" style={{color:"var(--muted)"}}>Click to upload or drag & drop</p>
                <p className="text-xs" style={{color:"var(--muted)", opacity:.7}}>High quality PNG, JPG up to 10MB</p>
              </>
            )}
          </div>
        </div>

        {[
          {key:"title", label:"Product Title", type:"text", ph:"e.g. Hand-dyed Alpaca Wool Blanket"},
        ].map(f => (
          <div key={f.key}>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1" style={{color:"var(--muted)"}}>{f.label}</label>
            <input className="input-field" type={f.type} placeholder={f.ph}
              value={(form as any)[f.key]} onChange={e => setForm({...form, [f.key]:e.target.value})}/>
          </div>
        ))}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide mb-1" style={{color:"var(--muted)"}}>Category</label>
          <select className="input-field" value={form.category} onChange={e => setForm({...form, category:e.target.value})}>
            <option value="">Select category</option>
            {CATEGORIES.slice(1).map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide mb-1" style={{color:"var(--muted)"}}>Price (USD)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{color:"var(--muted)"}}>$</span>
            <input className="input-field pl-7" type="number" placeholder="0.00" value={form.price} onChange={e => setForm({...form, price:e.target.value})}/>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide mb-1" style={{color:"var(--muted)"}}>Description</label>
          <textarea className="input-field resize-none" rows={4}
            placeholder="Describe the texture, weight, and inspiration behind this piece…"
            value={form.description} onChange={e => setForm({...form, description:e.target.value})}/>
        </div>

        <div className="flex gap-3 pt-2">
          <button className="btn-outline flex-1 py-3">Save Draft</button>
          <button onClick={publish} disabled={saving} className="btn-primary flex-1 py-3 gap-2">
            {saving ? <span className="inline-block w-4 h-4 rounded-full border-2 animate-spin" style={{borderColor:"rgba(255,255,255,0.3)", borderTopColor:"white"}}/> : <Sparkles size={15}/>}
            {saving ? "Publishing…" : "Publish"}
          </button>
        </div>
        <p className="text-center text-xs" style={{color:"var(--muted)"}}>— Handmade with care in our studio —</p>
      </div>
    </div>
  );
}

// ── PUBLISHED ─────────────────────────────────────────────────────────────────
function PublishedPage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{background:"var(--cream)"}}>
      <div className="w-full max-w-sm text-center animate-scaleIn">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-soft" style={{background:"var(--sage)"}}>
          <Check size={36} style={{color:"white"}}/>
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{color:"var(--charcoal)", fontFamily:"Georgia,serif"}}>Your item is now live ✨</h2>
        <p className="text-sm mb-8" style={{color:"var(--muted)"}}>The community is ready to discover your newest creation.</p>

        <div className="card mb-6 overflow-hidden">
          <div className="flex items-center justify-center" style={{background:"var(--parchment)", height:"120px", fontSize:"3rem"}}>🌿</div>
          <div className="p-4 text-left">
            <p style={{fontSize:"10px", color:"var(--muted)", textTransform:"uppercase"}}>Organic Cotton Mix</p>
            <p className="text-sm font-semibold mt-0.5" style={{color:"var(--charcoal)"}}>Hexagon cardigan</p>
            <p className="text-lg font-bold mt-1" style={{color:"var(--sage-dark)"}}>$148.00</p>
          </div>
        </div>

        <div className="space-y-3">
          <button onClick={() => setPage("studio")} className="btn-primary w-full py-3 gap-2">
            <BookOpen size={16}/> Go to My Studio
          </button>
          <button className="btn-outline w-full py-3 gap-2">
            <Share2 size={16}/> Share Listing
          </button>
        </div>
      </div>
    </div>
  );
}

// ── PROFILE ───────────────────────────────────────────────────────────────────
function ProfilePage({ setPage }: { setPage: (p: Page) => void }) {
  const { user, logout } = useApp();

  return (
    <div>
      <TopBar title="Profile"/>
      <div className="px-4 pt-4 pb-8 space-y-4">
        {/* Profile card */}
        <div className="rounded-3xl p-5 text-center shadow-card animate-fadeIn" style={{background:"white"}}>
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-3 text-2xl font-bold" style={{background:"var(--blush)", color:"var(--bark)"}}>
            {user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <h2 className="text-lg font-bold" style={{color:"var(--charcoal)", fontFamily:"Georgia,serif"}}>{user?.username ?? "user_nn"}</h2>
          <p className="text-xs mt-0.5" style={{color:"var(--muted)"}}>Master Weaver · Member since {user?.memberSince ?? "2023"}</p>
          {user?.isSeller && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="status-active">Verified Seller</span>
              <span className="text-xs" style={{color:"var(--muted)"}}>★ {user.rating}% positive</span>
            </div>
          )}
        </div>

        {user?.isSeller && (
          <div className="grid grid-cols-3 gap-3">
            {[
              {label:"Earnings", value:`$${user.earnings}`},
              {label:"Listings",  value:PRODUCTS.filter(p=>p.active).length},
              {label:"Rating",    value:`${user.rating}%`},
            ].map(s => (
              <div key={s.label} className="rounded-2xl p-3 text-center shadow-card" style={{background:"white"}}>
                <p className="text-base font-bold" style={{color:"var(--sage-dark)"}}>{s.value}</p>
                <p style={{fontSize:"9px", color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.05em"}}>{s.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="rounded-2xl shadow-card overflow-hidden" style={{background:"white"}}>
          {[
            {icon:<BookOpen size={18}/>, label:"My Studio",   action:()=>setPage("studio")},
            {icon:<Package size={18}/>,  label:"My Listings", action:()=>setPage("studio")},
            {icon:<Settings size={18}/>, label:"Settings",    action:()=>{}},
          ].map((item, i, arr) => (
            <button key={i} onClick={item.action}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-parchment"
              style={{borderBottom: i<arr.length-1 ? "1px solid var(--parchment)" : "none"}}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:"var(--mint)", color:"var(--sage)"}}>
                {item.icon}
              </div>
              <span className="text-sm font-semibold flex-1" style={{color:"var(--charcoal)"}}>{item.label}</span>
              <ChevronRight size={16} style={{color:"var(--muted)"}}/>
            </button>
          ))}
        </div>

        <button onClick={() => { logout(); setPage("login"); }}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl shadow-card transition-colors hover:opacity-90"
          style={{background:"white", color:"var(--rose)"}}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:"rgba(245,213,203,0.5)"}}>
            <LogOut size={18} style={{color:"var(--rose)"}}/>
          </div>
          <span className="text-sm font-semibold flex-1 text-left">Logout</span>
        </button>

        {!user?.isSeller && (
          <div className="rounded-2xl p-4 text-center" style={{background:"var(--sage-dark)"}}>
            <p className="font-bold mb-1" style={{color:"var(--cream)"}}>Start Selling Your Crafts</p>
            <p className="text-xs mb-3" style={{color:"rgba(212,237,212,0.75)"}}>Turn your hobby into income</p>
            <button className="px-4 py-2 rounded-xl text-xs font-semibold" style={{background:"var(--cream)", color:"var(--sage-dark)"}}>Become a Seller</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>("login");
  const [user, setUser] = useState<AppUser | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (p: Product) => setCart(prev => {
    const ex = prev.find(i => i.id===p.id);
    return ex ? prev.map(i => i.id===p.id ? {...i, qty:i.qty+1} : i) : [...prev, {...p, qty:1}];
  });
  const updateQty = (id: number, qty: number) => qty<=0
    ? setCart(prev => prev.filter(i => i.id!==id))
    : setCart(prev => prev.map(i => i.id===id ? {...i, qty} : i));
  const removeFromCart = (id: number) => setCart(prev => prev.filter(i => i.id!==id));
  const login = (u: any) => setUser(u);
  const logout = () => { setUser(null); setCart([]); };

  return (
    <AppCtx.Provider value={{user, cart, addToCart, updateQty, removeFromCart, login, logout}}>
      <Shell page={page} setPage={setPage}>
        {page==="login"          && <LoginPage setPage={setPage}/>}
        {page==="signup"         && <SignupPage setPage={setPage}/>}
        {page==="explore"        && <ExplorePage setPage={setPage}/>}
        {page==="cart"           && <CartPage setPage={setPage}/>}
        {page==="studio"         && <StudioPage setPage={setPage}/>}
        {page==="create-listing" && <CreateListingPage setPage={setPage}/>}
        {page==="published"      && <PublishedPage setPage={setPage}/>}
        {page==="profile"        && <ProfilePage setPage={setPage}/>}
      </Shell>
    </AppCtx.Provider>
  );
}