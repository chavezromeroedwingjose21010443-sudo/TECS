import { useState, useRef } from "react";

// ── CONSTANTES ──────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "missing",    label: "Desaparecido",   icon: "🔴", color: "#DC2626", bg: "#FEF2F2" },
  { id: "found",      label: "Encontrado",     icon: "🟢", color: "#16A34A", bg: "#F0FDF4" },
  { id: "need_help",  label: "Necesita Ayuda", icon: "🟠", color: "#EA580C", bg: "#FFF7ED" },
  { id: "offer_help", label: "Ofrece Ayuda",   icon: "🔵", color: "#2563EB", bg: "#EFF6FF" },
];

const HELP_TYPES    = ["Rescate","Agua","Alimentos","Medicamentos","Atención médica","Refugio","Transporte"];
const HEALTH_STATUS = ["Estable","Herido leve","Herido grave","Inconsciente","Fallecido"];
const SEXES         = ["Masculino","Femenino","No especificado"];

const ESTADOS_VE = [
  "Amazonas","Anzoátegui","Apure","Aragua","Barinas","Bolívar","Carabobo",
  "Cojedes","Delta Amacuro","Distrito Capital","Falcón","Guárico","Lara",
  "Mérida","Miranda","Monagas","Nueva Esparta","Portuguesa","Sucre","Táchira",
  "Trujillo","Vargas","Yaracuy","Zulia",
];

// Venezuela: coordenadas aproximadas límites
// lat: 1.0 – 12.5   lng: -73.4 – -59.8
const VE_CITIES = [
  { name:"Caracas",      lat:10.48, lng:-66.87 },
  { name:"Maracaibo",    lat:10.63, lng:-71.64 },
  { name:"Valencia",     lat:10.16, lng:-68.00 },
  { name:"Barquisimeto", lat:10.07, lng:-69.32 },
  { name:"Maturín",      lat: 9.75, lng:-63.18 },
  { name:"Barcelona",    lat:10.13, lng:-64.69 },
  { name:"Maracay",      lat:10.25, lng:-67.60 },
  { name:"Mérida",       lat: 8.59, lng:-71.14 },
  { name:"San Cristóbal",lat: 7.77, lng:-72.22 },
  { name:"Cumaná",       lat:10.45, lng:-64.16 },
];

// ── DATOS INICIALES ─────────────────────────────────────────────────────────
const INITIAL_POSTS = [
  {
    id:"p1", type:"missing", name:"Laura Rodríguez Pérez", age:"28", sex:"Femenino",
    location:"Av. Libertador, Chacao", estado:"Miranda",
    phone:"0412-555-1234", lastSeen:"2025-10-15T14:30",
    description:"Cabello largo oscuro, vestido rojo. Desapareció luego del temblor.",
    images:["https://i.pravatar.cc/400?img=47"], resolved:false,
    lat:10.495, lng:-66.855, createdAt:"2025-10-15T16:00", comments:[], author:"Familia Rodríguez"
  },
  {
    id:"p2", type:"found", name:"Hombre mayor desconocido", age:"~65", sex:"Masculino",
    location:"Cruz Roja, Petare", estado:"Miranda",
    phone:"0414-888-5678", healthStatus:"Herido leve",
    description:"Encontrado desorientado. Sin documentos. Cicatriz en brazo derecho.",
    images:["https://i.pravatar.cc/400?img=68"], resolved:false,
    lat:10.468, lng:-66.797, createdAt:"2025-10-15T15:30", comments:[], author:"Brigada Norte"
  },
  {
    id:"p3", type:"need_help", name:"Familia Gómez Urdaneta", age:null, sex:null,
    location:"Urb. Las Acacias, Maracay", estado:"Aragua",
    phone:"0416-777-9012", helpTypes:["Rescate","Agua","Alimentos"],
    description:"5 personas atrapadas bajo escombros. Hay un bebé de 6 meses.",
    images:["https://picsum.photos/seed/rescue1/400/300"], resolved:false,
    lat:10.24, lng:-67.61, createdAt:"2025-10-15T14:00", comments:[], author:"Pedro Gómez"
  },
  {
    id:"p4", type:"offer_help", name:"Voluntarios Caracas Solidaria", age:null, sex:null,
    location:"Plaza Venezuela, Caracas", estado:"Distrito Capital",
    phone:"0212-333-4567", helpTypes:["Agua","Alimentos","Medicamentos"],
    description:"Camión con agua potable, alimentos y botiquín. Zona metropolitana.",
    images:[], resolved:false,
    lat:10.493, lng:-66.888, createdAt:"2025-10-15T13:00", comments:[], author:"CS Voluntarios"
  },
];

// ── CONTACTOS DE EMERGENCIA ──────────────────────────────────────────────────
const EMERGENCY_CONTACTS = [
  {
    id: "bomberos",
    category: "Bomberos",
    icon: "🚒",
    color: "#DC2626",
    contacts: [
      { name: "Bomberos Antímano",          phone: "(0212) 472.20.54" },
      { name: "Bomberos Catia la Mar",       phone: "(0212) 351.99.66" },
      { name: "Bomberos Chacao",             phone: "(0212) 265.32.61" },
      { name: "Bomberos del Este (Cafetal)", phone: "(0212) 987.43.34 / 985.50.61" },
      { name: "Bomberos Sucre",             phone: "(0212) 985.36.40" },
      { name: "Bomberos El Cafetal",         phone: "(0212) 985.36.40 / 985.29.77" },
      { name: "Bomberos El Paraíso",         phone: "(0212) 481.09.61" },
      { name: "Bomberos El Valle",           phone: "(0212) 672.01.75 / 672.06.36" },
      { name: "Bomberos La Guaira",          phone: "(0212) 332.76.20 / 331.04.45" },
      { name: "Bomberos La Trinidad",        phone: "(0212) 943.43.61" },
      { name: "Bomberos La Urbina",          phone: "(0212) 241.66.41" },
      { name: "Bomberos Metropolitanos",     phone: "(0212) 545.45.45" },
      { name: "Bomberos Miranda",            phone: "(0212) 235.69.67" },
      { name: "Bomberos Plaza Venezuela",    phone: "(0212) 793.00.39 / 793.64.51" },
      { name: "Bomberos San Bernardino",     phone: "(0212) 577.92.09" },
    ],
  },
  {
    id: "hospitales",
    category: "Hospitales y Clínicas",
    icon: "🏥",
    color: "#16A34A",
    contacts: [
      { name: "Hospital Andrés Herrera Vegas (El Algodonal)", phone: "(212) 472.31.38" },
      { name: "Hospital Centro Médico IVSS (Caricuao)",       phone: "(212) 432.55.11" },
      { name: "Hospital Clínico Universitario (Chaguaramos)", phone: "(212) 606.71.11" },
      { name: "Hospital de Clínicas Caracas (San Bernardino)",phone: "(212) 508.61.11" },
      { name: "Hospital de Niños J.M. de Los Ríos",          phone: "(212) 574.35.11" },
      { name: "Hospital Dr. Domingo Luciani (El Llanito)",    phone: "(212) 257.87.12" },
      { name: "Hospital El Algodonal (Antímano)",             phone: "(212) 472.54.10" },
      { name: "Hospital El Manicomio",                        phone: "(212) 860.13.13" },
      { name: "Hospital José Gregorio Hernández",             phone: "(212) 870.78.97" },
      { name: "Hospital Miguel Pérez Carreño (Bella Vista)",  phone: "(212) 472.84.72" },
      { name: "Hospital Militar (San Martín)",                phone: "(212) 406.12.41" },
      { name: "Hospital Periférico de Catia",                 phone: "(212) 870.27.71" },
      { name: "Hospital Periférico de Coche",                 phone: "(212) 681.11.33" },
      { name: "Policlínica David Lobo (Santa Rosalía)",       phone: "(212) 541.54.65" },
      { name: "Policlínica La Arboleda (San Bernardino)",     phone: "(212) 550.18.11" },
      { name: "Policlínica Las Mercedes",                     phone: "(212) 993.23.23" },
      { name: "Policlínica Santiago de León (Sabana Grande)", phone: "(212) 762.90.25" },
      { name: "Centro Clínico Razetti (La Candelaria)",       phone: "(212) 597.02.48" },
      { name: "Centro Médico de Caracas (San Bernardino)",    phone: "(212) 555.91.11" },
      { name: "Clínica La Floresta (Los Palos Grandes)",      phone: "(212) 285.60.58" },
      { name: "Clínica Leopoldo Aguerrevere (Prados del Este)",phone: "(212) 907.08.11" },
      { name: "Clínica Rescarven (Santa Cecilia)",            phone: "(212) 239.56.86" },
    ],
  },
  {
    id: "proteccion",
    category: "Protección Civil",
    icon: "🛡️",
    color: "#F59E0B",
    contacts: [
      { name: "Protección Civil (línea gratuita)",            phone: "0800-5588427 / 0800-2668446 / 0800-2624368" },
      { name: "Instituto de Protección Civil",                phone: "(0212) 631.86.62 / 631.90.58 / 662.84.76" },
      { name: "Defensa Civil Alcaldía Mayor",                 phone: "(0212) 662.67.59 / 662.32.05" },
      { name: "Defensa Civil Nacional",                       phone: "0800.28326 / 0800.24845 / (0212) 483.98.05" },
    ],
  },
  {
    id: "policia",
    category: "Policía",
    icon: "👮",
    color: "#2563EB",
    contacts: [
      { name: "CICPC",                          phone: "(0212) 571.35.33 / 571.38.44 / 571.32.66" },
      { name: "Policía Metropolitana",           phone: "(0212) 862.58.71 / 862.58.72" },
      { name: "Policía Municipal de Chacao",     phone: "(0212) 264.12.56 / 264.00.50" },
      { name: "Policía Municipal de Baruta",     phone: "(0212) 943.28.55 / 943.62.77" },
      { name: "Policía Municipal de Sucre",      phone: "(0212) 242.21.11 / 242.22.11" },
      { name: "Policía Municipal del Hatillo",   phone: "(0212) 961.16.82" },
    ],
  },
  {
    id: "rescate",
    category: "Rescate",
    icon: "🚁",
    color: "#7C3AED",
    contacts: [
      { name: "Cuerpo de Emergencias, Rescate y Transmisiones", phone: "(0212) 545.47.47" },
      { name: "Grupo de Rescate Caracas (El Ávila)",            phone: "(0212) 615.63.86 / 415.46.61" },
      { name: "Grupo de Rescate Venezuela",                     phone: "(0212) 977.47.10" },
      { name: "Organización de Rescate Humboldt",               phone: "(0212) 234.22.34 / 0414.926.21.39" },
      { name: "Socorristas Cruz Roja",                          phone: "(0212) 571.47.13" },
    ],
  },
  {
    id: "transito",
    category: "Tránsito y Vías",
    icon: "🚦",
    color: "#0891B2",
    contacts: [
      { name: "Inspectoría Nacional de Tránsito (INT)",          phone: "167" },
      { name: "Vivex (Vigilancia Vías Expresas)",                phone: "(0212) 471.60.01 / 471.14.81" },
      { name: "Brigada de Restablecimiento de Vías (Min. Transporte)", phone: "(0212) 537.26.77" },
    ],
  },
];

// ── UTILIDADES ──────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2,10);

const timeAgo = (iso) => {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1)  return "ahora mismo";
  if (m < 60) return `hace ${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h}h`;
  return `hace ${Math.floor(h/24)}d`;
};

const compressImage = (file) => new Promise((resolve) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const MAX = 800;
      let w = img.width, h = img.height;
      if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", 0.75));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
});

// ── ESTILOS ─────────────────────────────────────────────────────────────────
const S = (dark) => {
  const surface  = dark ? "#1E293B" : "#FFFFFF";
  const bg       = dark ? "#0F172A" : "#F1F5F9";
  const border   = dark ? "#334155" : "#E2E8F0";
  const muted    = dark ? "#64748B" : "#94A3B8";
  const text     = dark ? "#E2E8F0" : "#0F172A";
  const inputBg  = dark ? "#0F172A" : "#F8FAFC";
  return {
    root:   { fontFamily:"'Inter','Segoe UI',system-ui,sans-serif", background:bg, color:text, minHeight:"100vh" },
    header: { background:"#0A1628", color:"#fff", padding:"0 16px", display:"flex", alignItems:"center",
               justifyContent:"space-between", height:58, position:"sticky", top:0, zIndex:100,
               boxShadow:"0 2px 12px rgba(0,0,0,.5)" },
    card:   { background:surface, borderRadius:14, padding:16, marginBottom:12,
               boxShadow: dark?"0 2px 8px rgba(0,0,0,.3)":"0 2px 8px rgba(0,0,0,.07)",
               border:`1px solid ${border}` },
    input:  { width:"100%", padding:"10px 12px", background:inputBg, color:text,
               border:`1px solid ${border}`, borderRadius:8, fontSize:14, outline:"none",
               boxSizing:"border-box", fontFamily:"inherit" },
    label:  { fontSize:12, fontWeight:600, color:muted, marginBottom:4, display:"block" },
    badge:  (c) => ({ display:"inline-flex", alignItems:"center", gap:4,
               background:c+"22", color:c, border:`1px solid ${c}44`,
               borderRadius:20, padding:"2px 8px", fontSize:11, fontWeight:600 }),
    tab:    (a) => ({ padding:"7px 14px", borderRadius:20, border:"none", cursor:"pointer",
               fontSize:12, fontWeight:600, whiteSpace:"nowrap",
               background: a?"#F59E0B":"rgba(255,255,255,.08)",
               color: a?"#0A1628":"rgba(255,255,255,.7)", transition:"all .2s" }),
    btnPrimary: { background:"#F59E0B", color:"#0A1628", border:"none", borderRadius:8,
               padding:"10px 18px", fontWeight:700, cursor:"pointer", fontSize:14 },
    btnDanger:  { background:"#DC2626", color:"#fff", border:"none", borderRadius:8,
               padding:"8px 14px", fontWeight:600, cursor:"pointer", fontSize:13 },
    btnGhost:   { background:"transparent", color:muted, border:`1px solid ${border}`,
               borderRadius:8, padding:"8px 14px", fontWeight:600, cursor:"pointer", fontSize:13 },
    btnSuccess: { background:"#16A34A", color:"#fff", border:"none", borderRadius:8,
               padding:"8px 14px", fontWeight:600, cursor:"pointer", fontSize:13 },
    muted, surface, border, text, inputBg,
  };
};

// ── GALERÍA ──────────────────────────────────────────────────────────────────
function Gallery({ images }) {
  const [zoom, setZoom] = useState(null);
  if (!images || images.length === 0) return null;
  return (
    <>
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:10 }}>
        {images.map((src,i) => (
          <img key={i} src={src} alt="" onClick={() => setZoom(src)}
            style={{ width:80, height:80, objectFit:"cover", borderRadius:8, cursor:"pointer",
                     border:"2px solid transparent", transition:"border .15s" }}
            onMouseOver={e=>e.currentTarget.style.border="2px solid #F59E0B"}
            onMouseOut={e=>e.currentTarget.style.border="2px solid transparent"}
          />
        ))}
      </div>
      {zoom && (
        <div onClick={()=>setZoom(null)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.92)",
          zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <img src={zoom} alt="" style={{ maxWidth:"95vw", maxHeight:"90vh", borderRadius:12, objectFit:"contain" }} />
          <button onClick={()=>setZoom(null)} style={{ position:"absolute", top:16, right:16,
            background:"rgba(255,255,255,.15)", color:"#fff", border:"none", borderRadius:"50%",
            width:36, height:36, fontSize:18, cursor:"pointer" }}>✕</button>
        </div>
      )}
    </>
  );
}

// ── MODAL CONFIRMACIÓN (reemplaza confirm()) ──────────────────────────────────
function ConfirmModal({ msg, onYes, onNo, dark }) {
  const s = S(dark);
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.6)", zIndex:900,
      display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ ...s.card, maxWidth:320, width:"100%", textAlign:"center", margin:0 }}>
        <div style={{ fontSize:32, marginBottom:8 }}>⚠️</div>
        <p style={{ margin:"0 0 20px", fontWeight:600, fontSize:15 }}>{msg}</p>
        <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
          <button style={s.btnGhost} onClick={onNo}>Cancelar</button>
          <button style={s.btnDanger} onClick={onYes}>Eliminar</button>
        </div>
      </div>
    </div>
  );
}

// ── TARJETA DE PUBLICACIÓN ────────────────────────────────────────────────────
function PostCard({ post, dark, onEdit, onDelete, onResolve, onComment }) {
  const s = S(dark);
  const cat = CATEGORIES.find(c => c.id === post.type);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText]   = useState("");
  const [copied, setCopied]             = useState(false);
  const [confirmDel, setConfirmDel]     = useState(false);

  const share = () => {
    const txt = `${cat.icon} ${cat.label}: ${post.name}\n📍 ${post.location}\n📞 ${post.phone}\n#RedEmergenciaVE`;
    navigator.clipboard?.writeText(txt).catch(()=>{});
    setCopied(true);
    setTimeout(()=>setCopied(false), 2000);
  };

  const sendComment = () => {
    if (!commentText.trim()) return;
    onComment(post.id, commentText.trim());
    setCommentText("");
  };

  return (
    <>
      {confirmDel && (
        <ConfirmModal
          msg={`¿Eliminar la publicación de "${post.name}"?`}
          dark={dark}
          onYes={() => { setConfirmDel(false); onDelete(post.id); }}
          onNo={()  => setConfirmDel(false)}
        />
      )}

      <div style={{ ...s.card, borderLeft:`4px solid ${cat.color}` }}>
        {/* banner resuelto */}
        {post.resolved && (
          <div style={{ background:"#16A34A22", border:"1px solid #16A34A44", borderRadius:8,
            padding:"5px 10px", fontSize:12, color:"#16A34A", fontWeight:700, marginBottom:8 }}>
            ✅ CASO RESUELTO
          </div>
        )}

        {/* cabecera */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={s.badge(cat.color)}>{cat.icon} {cat.label}</span>
            {post.type==="need_help" && !post.resolved && (
              <span style={{ display:"inline-block", width:8, height:8, borderRadius:"50%",
                background:"#DC2626", animation:"pulse 1.5s infinite" }} />
            )}
          </div>
          <span style={{ fontSize:11, color:s.muted }}>{timeAgo(post.createdAt)}</span>
        </div>

        {/* nombre */}
        <h3 style={{ margin:"0 0 6px", fontSize:17, fontWeight:700 }}>{post.name}</h3>

        {/* chips */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:8 }}>
          {post.age          && <span style={s.badge("#64748B")}>👤 {post.age} años</span>}
          {post.sex && post.sex !== "No especificado" &&
                           <span style={s.badge("#64748B")}>{post.sex==="Femenino"?"♀":"♂"} {post.sex}</span>}
          {post.healthStatus && <span style={s.badge(post.healthStatus==="Estable"?"#16A34A":"#DC2626")}>🏥 {post.healthStatus}</span>}
          {post.helpTypes?.map(h=><span key={h} style={s.badge("#EA580C")}>⚡ {h}</span>)}
          {post.estado       && <span style={s.badge("#6366F1")}>🗺️ {post.estado}</span>}
        </div>

        {/* ubicación y teléfono */}
        <div style={{ fontSize:13, color:s.muted, marginBottom:6, lineHeight:1.6 }}>
          <div>📍 <strong style={{ color:s.text }}>{post.location}</strong></div>
          <div>📞 <a href={`tel:${post.phone}`} style={{ color:"#F59E0B", textDecoration:"none", fontWeight:600 }}>{post.phone}</a></div>
          {post.lastSeen && <div>🕐 Visto: {new Date(post.lastSeen).toLocaleString("es-VE")}</div>}
        </div>

        {/* descripción */}
        {post.description && (
          <p style={{ fontSize:13, margin:"6px 0", lineHeight:1.5, color:s.text }}>{post.description}</p>
        )}

        {/* imágenes */}
        <Gallery images={post.images} />

        {/* acciones */}
        <div style={{ display:"flex", gap:6, marginTop:12, flexWrap:"wrap" }}>
          <button style={{ ...s.btnGhost, fontSize:12, padding:"6px 10px" }}
            onClick={()=>setShowComments(v=>!v)}>
            💬 {post.comments?.length||0}
          </button>
          <button style={{ ...s.btnGhost, fontSize:12, padding:"6px 10px" }} onClick={share}>
            {copied ? "✅ Copiado" : "📤 Compartir"}
          </button>
          {!post.resolved && (
            <button style={{ ...s.btnSuccess, fontSize:12, padding:"6px 10px" }} onClick={()=>onResolve(post.id)}>
              ✅ Resuelto
            </button>
          )}
          <button style={{ ...s.btnGhost, fontSize:12, padding:"6px 10px" }} onClick={()=>onEdit(post)}>
            ✏️ Editar
          </button>
          <button style={{ ...s.btnDanger, fontSize:12, padding:"6px 10px" }} onClick={()=>setConfirmDel(true)}>
            🗑️ Eliminar
          </button>
        </div>

        {/* comentarios */}
        {showComments && (
          <div style={{ marginTop:12, borderTop:`1px solid ${s.border}`, paddingTop:12 }}>
            {post.comments?.map((c,i)=>(
              <div key={i} style={{ fontSize:12, marginBottom:7, padding:"6px 10px",
                background:dark?"#0F172A":"#F8FAFC", borderRadius:8, lineHeight:1.4 }}>
                <strong>{c.author}</strong>: {c.text}
                <span style={{ color:s.muted, marginLeft:6 }}>{timeAgo(c.time)}</span>
              </div>
            ))}
            <div style={{ display:"flex", gap:6, marginTop:6 }}>
              <input value={commentText} onChange={e=>setCommentText(e.target.value)}
                placeholder="Escribe un comentario..." style={{ ...s.input, flex:1 }}
                onKeyDown={e=>e.key==="Enter"&&sendComment()} />
              <button style={s.btnPrimary} onClick={sendComment}>→</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ── FORMULARIO ────────────────────────────────────────────────────────────────
const BLANK_FORM = {
  name:"", phone:"", location:"", estado:"Distrito Capital",
  age:"", sex:"No especificado", description:"", lastSeen:"",
  helpTypes:[], healthStatus:"Estable", images:[],
};

function PostForm({ dark, onSubmit, editPost, onCancel }) {
  const s = S(dark);
  const [type, setType]   = useState(editPost?.type ?? "missing");
  const [form, setForm]   = useState(() => editPost ? {
    name:        editPost.name        ?? "",
    phone:       editPost.phone       ?? "",
    location:    editPost.location    ?? "",
    estado:      editPost.estado      ?? "Distrito Capital",
    age:         editPost.age         ?? "",
    sex:         editPost.sex         ?? "No especificado",
    description: editPost.description ?? "",
    lastSeen:    editPost.lastSeen    ?? "",
    helpTypes:   editPost.helpTypes   ?? [],
    healthStatus:editPost.healthStatus?? "Estable",
    images:      editPost.images      ?? [],
  } : { ...BLANK_FORM });

  const [errors, setErrors]     = useState({});
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const toggleHelp = (h) =>
    set("helpTypes", form.helpTypes.includes(h)
      ? form.helpTypes.filter(x=>x!==h)
      : [...form.helpTypes, h]);

  const handleImages = async (files) => {
    if (!files || files.length===0) return;
    setUploading(true);
    const compressed = await Promise.all(Array.from(files).map(compressImage));
    set("images", [...form.images, ...compressed]);
    setUploading(false);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())     e.name     = "Obligatorio";
    if (!form.phone.trim())    e.phone    = "Obligatorio";
    if (!form.location.trim()) e.location = "Obligatoria";
    if (type !== "offer_help" && form.images.length === 0) e.images = "Agrega al menos una foto";
    if (type === "missing") {
      if (!form.age)      e.age     = "Requerida";
      if (!form.lastSeen) e.lastSeen= "Requerida";
    }
    if ((type==="need_help"||type==="offer_help") && form.helpTypes.length===0)
      e.helpTypes = "Selecciona al menos uno";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    onSubmit({
      ...form, type,
      id:        editPost?.id        ?? uid(),
      createdAt: editPost?.createdAt ?? new Date().toISOString(),
      resolved:  editPost?.resolved  ?? false,
      comments:  editPost?.comments  ?? [],
      author:    editPost?.author    ?? "Usuario",
      lat: 7 + Math.random() * 5,
      lng: -73 + Math.random() * 12,
    });
  };

  const Field = ({ label, err, children }) => (
    <div style={{ marginBottom:14 }}>
      <label style={s.label}>
        {label}{err && <span style={{ color:"#DC2626" }}> — {err}</span>}
      </label>
      {children}
    </div>
  );

  const inputStyle = (errKey) => ({
    ...s.input,
    borderColor: errors[errKey] ? "#DC2626" : undefined,
  });

  return (
    <div style={{ padding:16, paddingBottom:40 }}>
      {/* volver */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
        <button style={s.btnGhost} onClick={onCancel}>← Volver</button>
        <h2 style={{ margin:0, fontSize:18 }}>
          {editPost ? "✏️ Editar publicación" : "📢 Nueva publicación"}
        </h2>
      </div>

      {/* tipo */}
      <Field label="Tipo de publicación">
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={()=>setType(c.id)} style={{
              padding:"10px 8px", borderRadius:10, cursor:"pointer", fontWeight:600, fontSize:13,
              border:`2px solid ${type===c.id ? c.color : (dark?"#334155":"#E2E8F0")}`,
              background: type===c.id ? c.bg : (dark?"#1E293B":"#F8FAFC"),
              color: type===c.id ? c.color : s.muted,
            }}>
              {c.icon} {c.label}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Nombre completo *" err={errors.name}>
        <input style={inputStyle("name")} value={form.name}
          onChange={e=>set("name",e.target.value)} placeholder="Ej: María González" />
      </Field>

      <Field label="Teléfono de contacto *" err={errors.phone}>
        <input style={inputStyle("phone")} value={form.phone} type="tel"
          onChange={e=>set("phone",e.target.value)} placeholder="Ej: 0412-555-1234" />
      </Field>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        <Field label="Estado">
          <select style={s.input} value={form.estado} onChange={e=>set("estado",e.target.value)}>
            {ESTADOS_VE.map(d=><option key={d}>{d}</option>)}
          </select>
        </Field>
        <Field label="Ubicación exacta *" err={errors.location}>
          <input style={inputStyle("location")} value={form.location}
            onChange={e=>set("location",e.target.value)} placeholder="Barrio, calle..." />
        </Field>
      </div>

      {/* campos específicos por tipo */}
      {type === "missing" && (
        <>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <Field label="Edad aprox. *" err={errors.age}>
              <input style={inputStyle("age")} value={form.age} type="number"
                onChange={e=>set("age",e.target.value)} placeholder="Ej: 28" />
            </Field>
            <Field label="Sexo">
              <select style={s.input} value={form.sex} onChange={e=>set("sex",e.target.value)}>
                {SEXES.map(x=><option key={x}>{x}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Última vez visto *" err={errors.lastSeen}>
            <input style={inputStyle("lastSeen")} type="datetime-local"
              value={form.lastSeen} onChange={e=>set("lastSeen",e.target.value)} />
          </Field>
        </>
      )}

      {type === "found" && (
        <Field label="Estado de salud">
          <select style={s.input} value={form.healthStatus} onChange={e=>set("healthStatus",e.target.value)}>
            {HEALTH_STATUS.map(h=><option key={h}>{h}</option>)}
          </select>
        </Field>
      )}

      {(type==="need_help"||type==="offer_help") && (
        <Field label={`Tipo de ayuda ${type==="need_help"?"requerida":"ofrecida"} *`} err={errors.helpTypes}>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {HELP_TYPES.map(h=>(
              <button key={h} onClick={()=>toggleHelp(h)} style={{
                padding:"6px 12px", borderRadius:20, border:"none", cursor:"pointer",
                fontSize:13, fontWeight:600,
                background: form.helpTypes.includes(h) ? "#EA580C" : (dark?"#334155":"#E2E8F0"),
                color: form.helpTypes.includes(h) ? "#fff" : s.muted,
              }}>{h}</button>
            ))}
          </div>
        </Field>
      )}

      <Field label="Descripción">
        <textarea style={{ ...s.input, minHeight:80, resize:"vertical" }}
          value={form.description} onChange={e=>set("description",e.target.value)}
          placeholder="Detalles, señas particulares, estado actual..." />
      </Field>

      <Field label={`Fotografías${type!=="offer_help"?" *":""}`} err={errors.images}>
        <div style={{ border:`2px dashed ${errors.images?"#DC2626":s.border}`,
          borderRadius:10, padding:16, textAlign:"center", cursor:"pointer",
          background:dark?"#0F172A":"#F8FAFC" }}
          onClick={()=>fileRef.current.click()}>
          <div style={{ fontSize:28 }}>📷</div>
          <div style={{ fontSize:13, color:s.muted, marginTop:4 }}>
            {uploading ? "⏳ Comprimiendo..." : "Toca para agregar fotos"}
          </div>
          <input ref={fileRef} type="file" accept="image/*" multiple style={{ display:"none" }}
            onChange={e=>handleImages(e.target.files)} />
        </div>
        {form.images.length > 0 && (
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:8 }}>
            {form.images.map((img,i)=>(
              <div key={i} style={{ position:"relative" }}>
                <img src={img} alt="" style={{ width:72, height:72, objectFit:"cover", borderRadius:8 }} />
                <button onClick={()=>set("images",form.images.filter((_,j)=>j!==i))} style={{
                  position:"absolute", top:-5, right:-5, width:20, height:20,
                  background:"#DC2626", color:"#fff", border:"none", borderRadius:"50%",
                  fontSize:11, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
                }}>✕</button>
              </div>
            ))}
          </div>
        )}
      </Field>

      <button style={{ ...s.btnPrimary, width:"100%", padding:14, fontSize:16, borderRadius:12 }}
        onClick={submit}>
        {editPost ? "💾 Guardar cambios" : "📢 Publicar ahora"}
      </button>
    </div>
  );
}

// ── MAPA VENEZUELA — 24 ESTADOS INTERACTIVOS ─────────────────────────────────
// Paths SVG reales de cada estado. viewBox="0 0 1000 800"
const VE_ESTADOS_SVG = [
  { id:"Zulia",           label:"Zulia",            capital:"Maracaibo",
    d:"M60,120 L90,100 L130,95 L155,110 L165,140 L170,175 L160,210 L140,240 L120,260 L100,280 L80,290 L60,285 L45,265 L35,240 L30,210 L35,175 L45,150 Z" },
  { id:"Falcón",          label:"Falcón",           capital:"Coro",
    d:"M155,90 L195,75 L235,70 L265,80 L275,100 L265,120 L240,130 L210,135 L180,128 L162,115 Z" },
  { id:"Lara",            label:"Lara",             capital:"Barquisimeto",
    d:"M165,140 L210,135 L245,145 L260,165 L255,195 L240,215 L215,225 L190,220 L170,205 L160,180 Z" },
  { id:"Yaracuy",         label:"Yaracuy",          capital:"San Felipe",
    d:"M240,130 L270,125 L285,140 L280,165 L260,170 L245,155 Z" },
  { id:"Carabobo",        label:"Carabobo",         capital:"Valencia",
    d:"M280,140 L310,135 L325,150 L320,175 L300,180 L282,168 Z" },
  { id:"Aragua",          label:"Aragua",           capital:"Maracay",
    d:"M320,150 L355,145 L370,160 L368,185 L350,198 L330,195 L315,178 Z" },
  { id:"Miranda",         label:"Miranda",          capital:"Los Teques",
    d:"M365,155 L400,148 L418,165 L415,192 L395,205 L372,200 L358,183 Z" },
  { id:"DistritoCapital", label:"Dtto. Capital",    capital:"Caracas",
    d:"M398,150 L415,148 L420,162 L410,172 L395,168 Z" },
  { id:"Vargas",          label:"La Guaira",        capital:"La Guaira",
    d:"M370,138 L412,132 L422,148 L400,150 L368,148 Z" },
  { id:"Mérida",          label:"Mérida",           capital:"Mérida",
    d:"M100,270 L140,258 L165,270 L175,300 L170,330 L150,350 L125,355 L100,340 L85,315 L88,290 Z" },
  { id:"Táchira",         label:"Táchira",          capital:"San Cristóbal",
    d:"M58,285 L100,278 L115,295 L110,330 L90,355 L65,360 L45,345 L40,315 L48,295 Z" },
  { id:"Trujillo",        label:"Trujillo",         capital:"Trujillo",
    d:"M140,240 L172,232 L190,248 L185,278 L165,290 L140,282 L125,262 Z" },
  { id:"Barinas",         label:"Barinas",          capital:"Barinas",
    d:"M165,290 L215,275 L255,285 L268,320 L260,360 L235,385 L200,390 L170,375 L150,350 L148,320 Z" },
  { id:"Portuguesa",      label:"Portuguesa",       capital:"Guanare",
    d:"M215,225 L255,220 L275,235 L272,268 L255,285 L215,278 L195,262 L200,238 Z" },
  { id:"Cojedes",         label:"Cojedes",          capital:"San Carlos",
    d:"M272,190 L305,185 L320,200 L315,228 L290,238 L268,228 L262,205 Z" },
  { id:"Guárico",         label:"Guárico",          capital:"San Juan de Los Morros",
    d:"M320,195 L375,188 L415,200 L430,240 L420,290 L395,320 L360,330 L325,318 L305,285 L298,248 L308,218 Z" },
  { id:"Anzoátegui",      label:"Anzoátegui",       capital:"Barcelona",
    d:"M415,175 L465,165 L510,170 L530,195 L525,235 L500,258 L462,265 L430,252 L415,225 L412,198 Z" },
  { id:"Sucre",           label:"Sucre",            capital:"Cumaná",
    d:"M490,150 L545,140 L580,148 L590,168 L575,188 L540,195 L505,185 L485,168 Z" },
  { id:"NuevaEsparta",    label:"Nueva Esparta",    capital:"La Asunción",
    d:"M575,128 L600,122 L612,134 L605,148 L585,150 L572,140 Z" },
  { id:"Monagas",         label:"Monagas",          capital:"Maturín",
    d:"M510,200 L560,192 L600,205 L610,238 L598,268 L565,278 L530,270 L505,248 L500,222 Z" },
  { id:"DeltaAmacuro",    label:"Delta Amacuro",    capital:"Tucupita",
    d:"M600,205 L650,198 L685,215 L690,255 L665,290 L635,298 L605,278 L595,248 L598,222 Z" },
  { id:"Bolívar",         label:"Bolívar",          capital:"Ciudad Bolívar",
    d:"M360,335 L430,320 L500,325 L560,340 L600,375 L615,430 L605,500 L570,560 L510,600 L440,615 L375,600 L320,565 L295,510 L300,450 L325,400 Z" },
  { id:"Amazonas",        label:"Amazonas",         capital:"Puerto Ayacucho",
    d:"M170,380 L235,390 L295,410 L320,460 L305,520 L270,570 L220,595 L170,590 L130,555 L115,500 L125,440 L150,400 Z" },
  { id:"Apure",           label:"Apure",            capital:"San Fernando",
    d:"M115,330 L165,320 L215,335 L260,358 L290,395 L285,445 L255,465 L210,460 L170,440 L135,410 L110,375 L105,345 Z" },
];

// Centro aproximado de cada estado para colocar el label y marcadores
const ESTADO_CENTERS = {
  "Zulia":{"x":98,"y":192},"Falcón":{"x":215,"y":100},"Lara":{"x":210,"y":178},
  "Yaracuy":{"x":262,"y":148},"Carabobo":{"x":302,"y":158},"Aragua":{"x":342,"y":172},
  "Miranda":{"x":388,"y":176},"DistritoCapital":{"x":407,"y":160},"Vargas":{"x":393,"y":142},
  "Mérida":{"x":130,"y":310},"Táchira":{"x":78,"y":320},"Trujillo":{"x":158,"y":262},
  "Barinas":{"x":208,"y":335},"Portuguesa":{"x":238,"y":255},"Cojedes":{"x":290,"y":212},
  "Guárico":{"x":365,"y":258},"Anzoátegui":{"x":470,"y":215},"Sucre":{"x":535,"y":168},
  "NuevaEsparta":{"x":590,"y":136},"Monagas":{"x":555,"y":232},"DeltaAmacuro":{"x":638,"y":248},
  "Bolívar":{"x":465,"y":460},"Amazonas":{"x":205,"y":490},"Apure":{"x":195,"y":398},
};

function MapaVenezuela({ posts, dark, filtro }) {
  const s = S(dark);
  const [hoveredEstado, setHoveredEstado] = useState(null);
  const [selectedEstado, setSelectedEstado] = useState(null);
  const [tooltip, setTooltip] = useState({ visible:false, x:0, y:0, name:"" });

  const filtered = filtro === "all" ? posts : posts.filter(p => p.type === filtro);

  // Publicaciones por estado
  const postsByEstado = {};
  filtered.forEach(p => {
    const key = p.estado;
    if (!postsByEstado[key]) postsByEstado[key] = [];
    postsByEstado[key].push(p);
  });

  // Color del estado según publicaciones
  const getEstadoFill = (estadoId) => {
    const estadoName = VE_ESTADOS_SVG.find(e => e.id === estadoId)?.label ?? estadoId;
    const estadoPosts = postsByEstado[estadoName] ?? postsByEstado[estadoId] ?? [];
    if (selectedEstado === estadoId) return "#F59E0B";
    if (hoveredEstado  === estadoId) return "#60A5FA";
    if (estadoPosts.length === 0) return dark ? "#1E3A5F" : "#93C5FD";
    // gradiente por urgencia
    const hasUrgent = estadoPosts.some(p => p.type === "need_help" && !p.resolved);
    if (hasUrgent) return "#DC2626";
    const hasFound  = estadoPosts.some(p => p.type === "found");
    if (hasFound)  return "#16A34A";
    const hasMissing = estadoPosts.some(p => p.type === "missing");
    if (hasMissing) return "#EA580C";
    return "#2563EB";
  };

  const estadoPostsList = selectedEstado
    ? (postsByEstado[VE_ESTADOS_SVG.find(e=>e.id===selectedEstado)?.label] ??
       postsByEstado[selectedEstado] ?? [])
    : [];

  return (
    <div style={{ margin:"0 16px 12px" }}>
      {/* Encabezado */}
      <div style={{ ...s.card, padding:"10px 14px", marginBottom:0,
        borderBottomLeftRadius:0, borderBottomRightRadius:0,
        display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
        <span style={{ fontWeight:700, fontSize:14 }}>🗺️ Mapa Interactivo — Venezuela</span>
        <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
          {CATEGORIES.map(c => (
            <span key={c.id} style={s.badge(c.color)}>{c.icon} {posts.filter(p=>p.type===c.id).length}</span>
          ))}
        </div>
      </div>

      {/* Leyenda de colores */}
      <div style={{ background: dark?"#0F172A":"#DBEAFE", padding:"6px 14px",
        display:"flex", gap:12, flexWrap:"wrap", fontSize:11, fontWeight:600 }}>
        <span style={{ color:"#DC2626" }}>🔴 Ayuda urgente</span>
        <span style={{ color:"#EA580C" }}>🟠 Desaparecido</span>
        <span style={{ color:"#16A34A" }}>🟢 Encontrado</span>
        <span style={{ color:"#2563EB" }}>🔵 Ofrece ayuda</span>
        <span style={{ color: dark?"#475569":"#94A3B8" }}>⬜ Sin reportes</span>
      </div>

      {/* SVG principal */}
      <div style={{ background: dark?"#0F172A":"#BFDBFE", position:"relative", cursor:"pointer",
        borderLeft:`1px solid ${s.border}`, borderRight:`1px solid ${s.border}` }}>
        <svg
          viewBox="0 0 800 680"
          style={{ width:"100%", height:"auto", display:"block" }}
          onMouseLeave={() => { setHoveredEstado(null); setTooltip({visible:false,x:0,y:0,name:""}); }}
        >
          {/* Fondo mar caribe */}
          <defs>
            <pattern id="waves" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M0,10 Q5,5 10,10 Q15,15 20,10" stroke={dark?"#1E3A5F":"#93C5FD"} strokeWidth="0.5" fill="none"/>
            </pattern>
          </defs>
          <rect width="800" height="680" fill="url(#waves)" opacity="0.5"/>
          <rect width="800" height="680" fill={dark?"#0F172A":"#BFDBFE"} opacity="0.6"/>

          {/* Estados */}
          {VE_ESTADOS_SVG.map(estado => {
            const fill = getEstadoFill(estado.id);
            const center = ESTADO_CENTERS[estado.id] ?? { x:400, y:400 };
            const estadoPosts = postsByEstado[estado.label] ?? postsByEstado[estado.id] ?? [];
            return (
              <g key={estado.id}
                onMouseEnter={e => {
                  setHoveredEstado(estado.id);
                  setTooltip({ visible:true, x:center.x, y:center.y-18,
                    name:`${estado.label} (${estado.capital}) — ${estadoPosts.length} reporte${estadoPosts.length!==1?"s":""}` });
                }}
                onMouseLeave={() => { setHoveredEstado(null); setTooltip({visible:false,x:0,y:0,name:""}); }}
                onClick={() => setSelectedEstado(prev => prev===estado.id ? null : estado.id)}
                style={{ cursor:"pointer" }}
              >
                <path
                  d={estado.d}
                  fill={fill}
                  stroke={dark?"#0F172A":"#ffffff"}
                  strokeWidth="1.5"
                  opacity={selectedEstado && selectedEstado!==estado.id ? 0.55 : 1}
                  style={{ transition:"fill 0.2s, opacity 0.2s" }}
                />
                {/* Nombre del estado */}
                <text x={center.x} y={center.y} textAnchor="middle" fontSize="7"
                  fill={dark?"#E2E8F0":"#0F172A"} fontWeight="700"
                  style={{ pointerEvents:"none", userSelect:"none" }}>
                  {estado.label}
                </text>
                {/* Badge de cantidad si hay reportes */}
                {estadoPosts.length > 0 && (
                  <g>
                    <circle cx={center.x+18} cy={center.y-12} r="7" fill="#DC2626"/>
                    <text x={center.x+18} y={center.y-9} textAnchor="middle" fontSize="6"
                      fill="#fff" fontWeight="800" style={{ pointerEvents:"none" }}>
                      {estadoPosts.length}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Tooltip flotante dentro del SVG */}
          {tooltip.visible && (
            <g style={{ pointerEvents:"none" }}>
              <rect x={tooltip.x - 80} y={tooltip.y - 16} width="160" height="18"
                rx="4" fill="rgba(0,0,0,0.82)"/>
              <text x={tooltip.x} y={tooltip.y - 4} textAnchor="middle" fontSize="7"
                fill="#fff" fontWeight="600">{tooltip.name}</text>
            </g>
          )}
        </svg>
      </div>

      {/* Panel del estado seleccionado */}
      {selectedEstado && (
        <div style={{ ...s.card, borderTopLeftRadius:0, borderTopRightRadius:0,
          borderTop:`3px solid #F59E0B`, marginTop:0 }}>
          {(() => {
            const est = VE_ESTADOS_SVG.find(e => e.id === selectedEstado);
            const estPosts = postsByEstado[est?.label] ?? postsByEstado[selectedEstado] ?? [];
            return (
              <>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                  <div>
                    <span style={{ fontWeight:800, fontSize:16 }}>📍 {est?.label}</span>
                    <span style={{ fontSize:12, color:s.muted, marginLeft:8 }}>Capital: {est?.capital}</span>
                  </div>
                  <button style={{ ...s.btnGhost, fontSize:11, padding:"4px 8px" }}
                    onClick={() => setSelectedEstado(null)}>✕ Cerrar</button>
                </div>

                {estPosts.length === 0 ? (
                  <div style={{ textAlign:"center", padding:"16px 0", color:s.muted, fontSize:13 }}>
                    ✅ Sin reportes activos en este estado
                  </div>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                      {CATEGORIES.map(c => {
                        const cnt = estPosts.filter(p=>p.type===c.id).length;
                        if (!cnt) return null;
                        return <span key={c.id} style={s.badge(c.color)}>{c.icon} {cnt} {c.label}</span>;
                      })}
                    </div>
                    {estPosts.map(p => {
                      const cat = CATEGORIES.find(c=>c.id===p.type);
                      return (
                        <div key={p.id} style={{ background: dark?"#0F172A":"#F8FAFC",
                          borderRadius:10, padding:"10px 12px",
                          borderLeft:`3px solid ${cat.color}` }}>
                          <div style={{ display:"flex", justifyContent:"space-between" }}>
                            <span style={{ fontWeight:700, fontSize:13 }}>{p.name}</span>
                            <span style={s.badge(cat.color)}>{cat.icon}</span>
                          </div>
                          <div style={{ fontSize:12, color:s.muted, marginTop:4 }}>
                            📍 {p.location} &nbsp;|&nbsp;
                            📞 <a href={`tel:${p.phone}`} style={{ color:"#F59E0B", textDecoration:"none", fontWeight:600 }}>{p.phone}</a>
                          </div>
                          {p.description && (
                            <div style={{ fontSize:12, marginTop:4, color:s.text, lineHeight:1.4 }}>
                              {p.description.slice(0,120)}{p.description.length>120?"…":""}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}

      <div style={{ padding:"6px 14px", background: dark?"#1E293B":"#EFF6FF",
        borderLeft:`1px solid ${s.border}`, borderRight:`1px solid ${s.border}`,
        borderBottom:`1px solid ${s.border}`, borderBottomLeftRadius:14, borderBottomRightRadius:14,
        fontSize:11, color:s.muted, textAlign:"center" }}>
        Toca un estado para ver los reportes activos · {filtered.length} publicaciones totales
      </div>
    </div>
  );
}

// ── STATS ─────────────────────────────────────────────────────────────────────
function StatsBar({ posts, dark }) {
  const s = S(dark);
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, padding:"12px 16px" }}>
      {CATEGORIES.map(c=>(
        <div key={c.id} style={{ ...s.card, padding:"10px 6px", textAlign:"center",
          margin:0, borderTop:`3px solid ${c.color}` }}>
          <div style={{ fontSize:18 }}>{c.icon}</div>
          <div style={{ fontSize:22, fontWeight:800, color:c.color }}>
            {posts.filter(p=>p.type===c.id).length}
          </div>
          <div style={{ fontSize:9, color:s.muted, fontWeight:600, textTransform:"uppercase", lineHeight:1.2 }}>
            {c.label}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── PANEL DE CONTACTOS ───────────────────────────────────────────────────────
function ContactsPanel({ dark, onClose }) {
  const s = S(dark);
  const [openCat, setOpenCat] = useState("bomberos");
  const [search, setSearch]   = useState("");
  const [copied, setCopied]   = useState(null);

  const copyPhone = (phone, id) => {
    navigator.clipboard?.writeText(phone).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const filtered = EMERGENCY_CONTACTS.map(cat => ({
    ...cat,
    contacts: cat.contacts.filter(c =>
      !search || c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
    ),
  })).filter(cat => !search || cat.contacts.length > 0);

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Encabezado */}
      <div style={{ background: "#0A1628", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
        <button style={{ ...s.btnGhost, borderColor: "rgba(255,255,255,.2)", color: "#fff", fontSize: 12 }} onClick={onClose}>
          ← Volver
        </button>
        <div>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>📞 Contactos de Emergencia</div>
          <div style={{ color: "rgba(255,255,255,.5)", fontSize: 11 }}>Caracas, Venezuela</div>
        </div>
      </div>

      {/* Banner urgente */}
      <div style={{ background: "#DC2626", color: "#fff", padding: "8px 16px", fontSize: 12, fontWeight: 700, textAlign: "center" }}>
        ⚠️ En caso de peligro inmediato llama al <span style={{ fontSize: 15 }}>171</span> (Emergencias) o <span style={{ fontSize: 15 }}>167</span> (Tránsito)
      </div>

      {/* Buscador */}
      <div style={{ padding: "10px 16px" }}>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre o número..."
            style={{ ...s.input, paddingLeft: 36 }} />
        </div>
      </div>

      {/* Tabs de categorías */}
      {!search && (
        <div style={{ display: "flex", gap: 6, overflowX: "auto", padding: "0 16px 10px" }}>
          {EMERGENCY_CONTACTS.map(cat => (
            <button key={cat.id} onClick={() => setOpenCat(cat.id)} style={{
              padding: "6px 12px", borderRadius: 20, border: "none", cursor: "pointer",
              whiteSpace: "nowrap", fontSize: 12, fontWeight: 700,
              background: openCat === cat.id ? cat.color : (dark ? "#334155" : "#E2E8F0"),
              color: openCat === cat.id ? "#fff" : s.muted,
              transition: "all .2s",
            }}>
              {cat.icon} {cat.category}
            </button>
          ))}
        </div>
      )}

      {/* Listado */}
      <div style={{ padding: "0 16px" }}>
        {filtered.map(cat => {
          const visible = search ? true : cat.id === openCat;
          if (!visible) return null;
          return (
            <div key={cat.id} style={{ marginBottom: 16 }}>
              {/* Título categoría */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 20 }}>{cat.icon}</span>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: cat.color }}>{cat.category}</h3>
                <span style={{ ...s.badge(cat.color), marginLeft: "auto" }}>{cat.contacts.length} números</span>
              </div>

              {/* Tarjetas de contacto */}
              {cat.contacts.map((c, i) => {
                const contactId = `${cat.id}-${i}`;
                const phones = c.phone.split(" / ");
                return (
                  <div key={i} style={{ ...s.card, margin: "0 0 8px", padding: "12px 14px",
                    borderLeft: `3px solid ${cat.color}` }}>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6, lineHeight: 1.3 }}>{c.name}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                      {phones.map((ph, pi) => (
                        <a key={pi} href={`tel:${ph.replace(/[\s().]/g, "")}`}
                          style={{ color: cat.color, textDecoration: "none", fontWeight: 700,
                            fontSize: 13, background: cat.color + "15", borderRadius: 6,
                            padding: "3px 8px", border: `1px solid ${cat.color}33` }}>
                          📞 {ph.trim()}
                        </a>
                      ))}
                      <button onClick={() => copyPhone(c.phone, contactId)} style={{
                        ...s.btnGhost, fontSize: 11, padding: "3px 8px", marginLeft: "auto",
                      }}>
                        {copied === contactId ? "✅" : "📋"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── PANEL ADMIN ───────────────────────────────────────────────────────────────
function AdminPanel({ posts, dark, onClose }) {
  const s = S(dark);
  const resolved = posts.filter(p=>p.resolved).length;
  const urgent   = posts.filter(p=>p.type==="need_help"&&!p.resolved).length;
  const stats = [
    { label:"Total",     value:posts.length,                                           color:"#6366F1" },
    { label:"Urgentes",  value:urgent,                                                 color:"#DC2626" },
    { label:"Resueltos", value:resolved,                                               color:"#16A34A" },
    { label:"Resolución",value:posts.length?Math.round(resolved/posts.length*100)+"%":"0%", color:"#F59E0B" },
  ];
  return (
    <div style={{ padding:16, paddingBottom:40 }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
        <button style={s.btnGhost} onClick={onClose}>← Volver</button>
        <h2 style={{ margin:0 }}>🛡️ Panel de Administración</h2>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
        {stats.map(st=>(
          <div key={st.label} style={{ ...s.card, margin:0, textAlign:"center", borderTop:`3px solid ${st.color}` }}>
            <div style={{ fontSize:26, fontWeight:800, color:st.color }}>{st.value}</div>
            <div style={{ fontSize:11, color:s.muted }}>{st.label}</div>
          </div>
        ))}
      </div>
      <div style={s.card}>
        <h3 style={{ margin:"0 0 12px", fontSize:14 }}>Todas las publicaciones</h3>
        {posts.map(p=>{
          const cat = CATEGORIES.find(c=>c.id===p.type);
          return (
            <div key={p.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
              padding:"8px 0", borderBottom:`1px solid ${s.border}`, fontSize:13 }}>
              <div>
                <span style={s.badge(cat.color)}>{cat.icon}</span>
                <span style={{ marginLeft:8, fontWeight:600 }}>{p.name}</span>
                {p.resolved && <span style={{ marginLeft:6, color:"#16A34A", fontSize:11 }}>✅</span>}
              </div>
              <span style={{ fontSize:11, color:s.muted }}>{p.estado}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── APP PRINCIPAL ─────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark]         = useState(false);
  const [posts, setPosts]       = useState(INITIAL_POSTS);
  const [view, setView]         = useState("feed");   // feed | form | admin | contacts
  const [showMap, setShowMap]   = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch]     = useState("");
  const [editPost, setEditPost] = useState(null);
  const [toast, setToast]       = useState(null);
  const [alertOff, setAlertOff] = useState(false);

  const s = S(dark);

  const showToast = (msg, type="success") => {
    setToast({ msg, type });
    setTimeout(()=>setToast(null), 3000);
  };

  const handleSubmit = (post) => {
    if (editPost) {
      setPosts(prev => prev.map(p => p.id===post.id ? post : p));
      showToast("✅ Publicación actualizada");
    } else {
      setPosts(prev => [post, ...prev]);
      showToast("📢 Publicación enviada a la comunidad");
    }
    setEditPost(null);
    setView("feed");
  };

  const handleDelete = (id) => {
    setPosts(prev => prev.filter(p => p.id !== id));
    showToast("🗑️ Publicación eliminada", "danger");
  };

  const handleResolve = (id) => {
    setPosts(prev => prev.map(p => p.id===id ? { ...p, resolved:true } : p));
    showToast("✅ Caso marcado como resuelto");
  };

  const handleComment = (id, text) => {
    setPosts(prev => prev.map(p => p.id===id
      ? { ...p, comments:[...(p.comments||[]), { text, author:"Tú", time:new Date().toISOString() }] }
      : p));
  };

  const handleEdit = (post) => {
    setEditPost(post);
    setView("form");
  };

  const filtered = posts.filter(p => {
    if (activeTab !== "all" && p.type !== activeTab) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.name?.toLowerCase().includes(q) ||
        p.phone?.includes(q) ||
        p.location?.toLowerCase().includes(q) ||
        p.estado?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q);
    }
    return true;
  });

  const urgentCount = posts.filter(p=>p.type==="need_help"&&!p.resolved).length;

  return (
    <div style={s.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
        @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(220,38,38,.4)}50%{box-shadow:0 0 0 8px rgba(220,38,38,0)}}
        @keyframes slideDown{from{transform:translateY(-20px);opacity:0}to{transform:translateY(0);opacity:1}}
        *{box-sizing:border-box;}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:#334155;border-radius:4px}
        select,input,textarea{-webkit-appearance:none;font-family:inherit}
      `}</style>

      {/* HEADER */}
      <header style={s.header}>
        <div style={{ display:"flex", alignItems:"center", gap:8, fontWeight:700 }}>
          <span style={{ fontSize:22 }}>🆘</span>
          <div>
            <div style={{ fontSize:13, fontWeight:800, letterSpacing:"-0.3px" }}>Red Comunitaria</div>
            <div style={{ fontSize:9, opacity:.6, fontWeight:500, letterSpacing:"1px", textTransform:"uppercase" }}>
              de Emergencia · Venezuela
            </div>
          </div>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          {urgentCount > 0 && (
            <span style={{ background:"#DC2626", color:"#fff", borderRadius:999, padding:"2px 8px", fontSize:11, fontWeight:700 }}>
              {urgentCount} urgente{urgentCount>1?"s":""}
            </span>
          )}
          <button onClick={()=>setView("contacts")}
            style={{ background:"rgba(255,255,255,.1)", border:"none", color:"#fff", borderRadius:8, padding:"6px 10px", cursor:"pointer", fontSize:13, fontWeight:700 }}>
            📞
          </button>
          <button onClick={()=>setView("admin")}
            style={{ background:"rgba(255,255,255,.1)", border:"none", color:"#fff", borderRadius:8, padding:"6px 10px", cursor:"pointer" }}>
            🛡️
          </button>
          <button onClick={()=>setDark(d=>!d)}
            style={{ background:"rgba(255,255,255,.1)", border:"none", color:"#fff", borderRadius:8, padding:"6px 10px", cursor:"pointer" }}>
            {dark?"☀️":"🌙"}
          </button>
        </div>
      </header>

      {/* ALERTA */}
      {!alertOff && (
        <div style={{ background:"#F59E0B", color:"#0A1628", padding:"8px 16px", fontSize:12,
          display:"flex", justifyContent:"space-between", alignItems:"center", fontWeight:600 }}>
          <span>⚠️ EMERGENCIA ACTIVA — Sismo 6.1 | Zona centro-norte de Venezuela</span>
          <button onClick={()=>setAlertOff(true)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:16, fontWeight:700 }}>✕</button>
        </div>
      )}

      {/* VISTAS */}
      {view === "admin" ? (
        <AdminPanel posts={posts} dark={dark} onClose={()=>setView("feed")} />
      ) : view === "contacts" ? (
        <ContactsPanel dark={dark} onClose={() => setView("feed")} />
      ) : view === "form" ? (
        <PostForm dark={dark} onSubmit={handleSubmit} editPost={editPost}
          onCancel={()=>{ setEditPost(null); setView("feed"); }} />
      ) : (
        <>
          {/* TABS */}
          <div style={{ display:"flex", gap:4, overflowX:"auto", padding:"12px 16px",
            background:"#0A1628", borderBottom:"1px solid rgba(255,255,255,.1)" }}>
            {[{ id:"all", label:"📋 Todos" }, ...CATEGORIES.map(c=>({ id:c.id, label:`${c.icon} ${c.label}` }))].map(t=>(
              <button key={t.id} style={s.tab(activeTab===t.id)} onClick={()=>setActiveTab(t.id)}>
                {t.label}
              </button>
            ))}
            <button style={s.tab(showMap)} onClick={()=>setShowMap(v=>!v)}>🗺️ Mapa</button>
          </div>

          {/* STATS */}
          <StatsBar posts={posts} dark={dark} />

          {/* MAPA */}
          {showMap && <MapaVenezuela posts={posts} dark={dark} filtro={activeTab} />}

          {/* BUSCADOR */}
          <div style={{ padding:"8px 16px" }}>
            <div style={{ position:"relative" }}>
              <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)" }}>🔍</span>
              <input value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="Buscar por nombre, teléfono, estado, ciudad..."
                style={{ ...s.input, paddingLeft:36 }} />
            </div>
          </div>

          <div style={{ padding:"4px 16px 8px", fontSize:12, color:s.muted }}>
            {filtered.length} publicación{filtered.length!==1?"es":""} encontrada{filtered.length!==1?"s":""}
            {search && ` para "${search}"`}
          </div>

          {/* FEED */}
          <div style={{ padding:"0 16px 100px" }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign:"center", padding:"40px 20px", color:s.muted }}>
                <div style={{ fontSize:40 }}>📭</div>
                <div style={{ fontWeight:600, fontSize:16, marginTop:8 }}>Sin publicaciones</div>
                <div style={{ fontSize:13, marginTop:4 }}>Toca + Publicar para agregar</div>
              </div>
            ) : filtered.map(post=>(
              <PostCard key={post.id} post={post} dark={dark}
                onEdit={handleEdit} onDelete={handleDelete}
                onResolve={handleResolve} onComment={handleComment} />
            ))}
          </div>
        </>
      )}

      {/* FAB */}
      {view!=="form" && view!=="admin" && view!=="contacts" && (
        <button onClick={()=>{ setEditPost(null); setView("form"); }} style={{
          position:"fixed", bottom:72, right:18, zIndex:99,
          background:"#F59E0B", color:"#0A1628", border:"none", borderRadius:999,
          padding:"13px 20px", fontWeight:800, fontSize:15, cursor:"pointer",
          boxShadow:"0 4px 20px rgba(245,158,11,.5)",
          display:"flex", alignItems:"center", gap:6,
        }}>
          <span style={{ fontSize:20, lineHeight:1 }}>+</span> Publicar
        </button>
      )}

      {/* NAV INFERIOR */}
      {view!=="form" && (
        <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:98,
          background:"#0A1628", borderTop:"1px solid rgba(255,255,255,.1)",
          display:"flex", justifyContent:"space-around", padding:"8px 0 10px" }}>
          {[
            { id:"feed",     icon:"🏠", label:"Inicio",    action:()=>setView("feed") },
            { id:"map",      icon:"🗺️", label:"Mapa",      action:()=>{ setView("feed"); setShowMap(v=>!v); } },
            { id:"contacts", icon:"📞", label:"Contactos", action:()=>setView("contacts") },
            { id:"admin",    icon:"🛡️", label:"Admin",     action:()=>setView("admin") },
          ].map(nav=>(
            <button key={nav.id} onClick={nav.action} style={{
              background:"none", border:"none", cursor:"pointer",
              color: view===nav.id ? "#F59E0B" : "rgba(255,255,255,.6)",
              display:"flex", flexDirection:"column", alignItems:"center", gap:2,
              padding:"4px 10px", fontSize:9, fontWeight:700,
              textTransform:"uppercase", letterSpacing:"0.5px", transition:"color .2s",
            }}>
              <span style={{ fontSize:19 }}>{nav.icon}</span>
              {nav.label}
            </button>
          ))}
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div style={{ position:"fixed", top:70, left:"50%", transform:"translateX(-50%)",
          background: toast.type==="danger" ? "#DC2626" : "#16A34A",
          color:"#fff", padding:"10px 20px", borderRadius:12, fontWeight:600,
          fontSize:13, zIndex:1001, boxShadow:"0 4px 20px rgba(0,0,0,.3)",
          animation:"slideDown .3s ease", whiteSpace:"nowrap" }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
