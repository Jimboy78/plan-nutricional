"use client";

import React, { useState } from "react";

const NAV = ["Perfil & Macros", "Suplementos", "Plan por Dia", "Batch Cooking", "Lista de Compras"];
const BATCH_TABS = [
  { key:"proteina", label:"🍗 Proteinas",      color:"#0f2744", bg:"#eff6ff", border:"#bfdbfe" },
  { key:"carbo",    label:"🍚 Carbohidratos",  color:"#1e3a5f", bg:"#f0fdf4", border:"#bbf7d0" },
  { key:"verdura",  label:"🥦 Verduras",        color:"#166534", bg:"#f9fafb", border:"#e5e7eb" },
  { key:"extras",   label:"⚡ Extras",          color:"#92400e", bg:"#fff7ed", border:"#fed7aa" },
];

const SUPLEMENTOS = [
  { nom:"Creatina Monohidratada",  dosis:"5g/dia",              timing:"Con agua o en el batido post-entreno. Todos los dias, incluso sin entreno.",    nota:"Dosis correcta. No necesitas carga previa. El efecto es acumulativo.", color:"#22c55e" },
  { nom:"Proteina en Polvo",       dosis:"1 scoop post-entreno", timing:"Dentro de los 45 min post-esfuerzo.",                                           nota:"Usarla para completar los 180g diarios cuando no llegas con comida real.", color:"#22c55e" },
  { nom:"Vitamina D3",             dosis:"1000-2000 UI/dia",     timing:"Con una comida que tenga grasa (mejor absorcion).",                             nota:"Deficit frecuente en deportistas indoor. Pedir analitica para ajustar dosis exacta.", color:"#22c55e" },
  { nom:"Vitamina C",              dosis:"500-1000mg/dia",        timing:"Con las comidas principales.",                                                  nota:"Cofactor esencial para sintesis de colageno. Relevante post-sutura de menisco.", color:"#22c55e" },
  { nom:"Centrum Hombre",          dosis:"1 comprimido/dia",      timing:"Con almuerzo o cena.",                                                          nota:"Tomarlo siempre con comida para evitar nauseas y mejorar absorcion.", color:"#22c55e" },
];

const PLAN: Record<string, {
  label: string; kcal: number; cho: number; pro: number; fat: number; detalle: string;
  comidas: { hora: string; nom: string; desc: string }[];
}> = {
  basquet: {
    label:"Dia de Basquet 🏀", kcal:3400, cho:450, pro:180, fat:100, detalle:"Lunes / Miercoles / Viernes",
    comidas:[
      { hora:"7:30",  nom:"Desayuno",           desc:"Avena 80g (seca) + 300ml leche + 1 banana en rodajas + miel. Preparar en el momento." },
      { hora:"10:30", nom:"Colacion AM",         desc:"2 frutas + 20g frutos secos. Tupper chico." },
      { hora:"13:30", nom:"Almuerzo - Tupper",   desc:"150g proteina cocida + arroz 150g crudo (pesado antes de cocinar) + 150g verdura cocida." },
      { hora:"16:30", nom:"Pre-Basquet",         desc:"1 lata atun al agua + 2 fetas pan lactal. Sin grasa ni fibra alta. 2-3hs antes del partido." },
      { hora:"Partido", nom:"Hidratacion",       desc:"500ml agua 2hs antes. 150-200ml cada 20 min durante. Sales si superas 90 min continuos." },
      { hora:"Post",  nom:"Post-Basquet inmediato", desc:"Batido: 300ml leche + 1 scoop proteina + 1 banana + 3 cdas avena + 1 cda mantequilla mani + 5g creatina." },
      { hora:"22:30", nom:"Cena - Tupper",       desc:"150g proteina cocida + papa/batata 200g crudo + ensalada libre con oliva y limon." },
    ]
  },
  gimnasio: {
    label:"Dia de Gimnasio 💪", kcal:3100, cho:390, pro:180, fat:90, detalle:"Martes / Jueves / Sabado",
    comidas:[
      { hora:"7:30",  nom:"Desayuno",           desc:"Avena 70g (seca) + 300ml leche + 1 fruta + miel. Mas liviano que dia de basquet." },
      { hora:"10:30", nom:"Colacion AM",         desc:"200g yogur natural + 20g nueces + miel." },
      { hora:"13:30", nom:"Almuerzo - Tupper",   desc:"150g proteina cocida + fideos 75g crudo o arroz 120g crudo + 150g verdura cocida." },
      { hora:"16:30", nom:"Pre-Gimnasio",        desc:"200g yogur + 1 fruta + 20g nueces. 1-1.5hs antes." },
      { hora:"Gym",   nom:"Hidratacion",         desc:"500-700ml durante el entrenamiento." },
      { hora:"Post",  nom:"Post-Gimnasio inmediato", desc:"Mismo batido que dia de basquet + 5g creatina." },
      { hora:"21:30", nom:"Cena - Tupper",       desc:"150g proteina cocida + arroz integral 120g crudo + 150g verdura cocida." },
    ]
  },
  descanso: {
    label:"Dia de Descanso 😴", kcal:2700, cho:320, pro:175, fat:80, detalle:"Domingo",
    comidas:[
      { hora:"8:30",  nom:"Desayuno",      desc:"Avena 60g (seca) + 300ml leche + 1 fruta. Sin miel o minima." },
      { hora:"11:30", nom:"Colacion AM",   desc:"200g yogur + 20g nueces." },
      { hora:"14:00", nom:"Almuerzo - Tupper", desc:"150g proteina cocida + papa/batata 120g crudo + pure de calabaza 150g. Sin agregar mas carbo." },
      { hora:"17:30", nom:"Colacion PM",   desc:"1-2 frutas + 15g frutos secos." },
      { hora:"21:00", nom:"Cena - Tupper", desc:"150g proteina cocida + arroz 80g crudo + verduras grilladas libres." },
    ]
  }
};

const BATCH: Record<string, {
  col: string; color: string; bg: string; border: string; tip: string;
  items: { nom: string; cant: string; tiempo: string; rinde: string; prep: string }[];
}> = {
  proteina: {
    col:"🍗 PROTEINAS", color:"#0f2744", bg:"#eff6ff", border:"#bfdbfe",
    tip:"Preparar 2-3 opciones distintas para rotar. Porciona de 150g cocido por tupper antes de guardar.",
    items:[
      { nom:"Pollo al horno en cubos",       cant:"600g crudo → ~450g cocido",  tiempo:"35 min", rinde:"3 tuppers x 150g", prep:"Ajo, pimenton, oregano, oliva. 200° x 30 min. Cubos al enfriar. Heladera 3-4 dias." },
      { nom:"Milanesa de pollo al horno",    cant:"6 unidades ~600g",           tiempo:"25 min", rinde:"3 dias",           prep:"Huevo batido + pan rallado + condimentos. 200° x 20 min. Sin freir." },
      { nom:"Albondigas de pollo al horno",  cant:"12 unidades",                tiempo:"30 min", rinde:"3-4 tuppers",      prep:"Carne picada de pollo + ajo + perejil + huevo + pan rallado. 200° x 20 min." },
      { nom:"Carne picada magra salteada",   cant:"400g crudo",                 tiempo:"20 min", rinde:"3 tuppers",        prep:"Saltear con cebolla, ajo, pimenton. Sin grasa extra. Guardar con jugo." },
      { nom:"Merluza/Lenguado al horno",     cant:"400g",                       tiempo:"18 min", rinde:"2 tuppers",        prep:"Limon, ajo, sal. 180° x 18 min. Consumir en 48hs. No freezar." },
      { nom:"Medallones de lentejas",        cant:"10 unidades",                tiempo:"45 min", rinde:"Freezar porciones",prep:"Lentejas cocidas + zanahoria rallada + pan rallado + huevo + condimentos. Horno o plancha." },
      { nom:"Huevos duros batch",            cant:"8 unidades",                 tiempo:"12 min", rinde:"4-5 dias",         prep:"Hervir 10 min desde agua fria. Guardar con cascara. Pelar solo al momento." },
      { nom:"Atun/Caballa en lata",          cant:"2-3 latas",                  tiempo:"0 min",  rinde:"Inmediato",        prep:"Sin preparacion. Al agua, no al aceite. Para pre-basquet o colaciones." },
    ]
  },
  carbo: {
    col:"🍚 CARBOHIDRATOS", color:"#1e3a5f", bg:"#f0fdf4", border:"#bbf7d0",
    tip:"Pesas siempre en CRUDO antes de cocinar. La cantidad varia segun el dia (ver tabla abajo).",
    items:[
      { nom:"Arroz blanco",          cant:"Basquet 150g / Gym 120g / Descanso 80g (crudo)", tiempo:"20 min", rinde:"1 tupper por porcion", prep:"Batch grande. Unas gotas de oliva para que no se pegue. Heladera 4-5 dias." },
      { nom:"Arroz integral",        cant:"Basquet 150g / Gym 120g / Descanso 80g (crudo)", tiempo:"45 min", rinde:"1 tupper por porcion", prep:"Mayor fibra. Preferido para cenas de dia gym. Lavar antes de cocinar." },
      { nom:"Fideos al dente",       cant:"Basquet 90g / Gym 75g / Descanso 55g (crudo)",  tiempo:"12 min", rinde:"1 tupper por porcion", prep:"Sin salsa si es batch. Oliva para que no se peguen. Heladera 3 dias." },
      { nom:"Papa y batata al horno",cant:"Basquet 200g / Gym 170g / Descanso 120g (crudo)",tiempo:"40 min", rinde:"1 tupper por porcion", prep:"Cubos sin cascara, oliva y sal. 200° x 35-40 min. No freezar." },
      { nom:"Batata entera al horno",cant:"Basquet 200g / Gym 170g / Descanso 120g (crudo)",tiempo:"45 min", rinde:"1 tupper por porcion", prep:"Entera con piel. 200° x 45 min. Facil de llevar, fria esta bien." },
      { nom:"Quinoa cocida",         cant:"Basquet 130g / Gym 100g / Descanso 70g (crudo)", tiempo:"18 min", rinde:"1 tupper por porcion", prep:"Lavar bien antes. 1:2 (quinoa:agua). Proteina completa + carbo en uno." },
      { nom:"Pure de papa y batata", cant:"Basquet 200g / Gym 170g / Descanso 120g (crudo)",tiempo:"30 min", rinde:"3-4 porciones",        prep:"Hervir y pisar. Sal y nuez moscada. Sin manteca." },
    ]
  },
  verdura: {
    col:"🥦 VERDURAS", color:"#166534", bg:"#f9fafb", border:"#e5e7eb",
    tip:"150-200g cocida por tupper. Las crudas armarlas el momento, no en batch.",
    items:[
      { nom:"Verduras grilladas mixtas",    cant:"500g mixtas → ~400g cocido",  tiempo:"25 min", rinde:"3-4 tuppers x 150g", prep:"Zapallito, berenjena, morron, cebolla. Grill o sarten, minimo aceite. Heladera 3 dias." },
      { nom:"Brocoli/Coliflor al vapor",    cant:"400g",                        tiempo:"10 min", rinde:"3 tuppers",           prep:"Vapor exacto 10 min. No pasar de coccion. Oliva + limon al servir." },
      { nom:"Espinaca/Acelga salteada",     cant:"400g crudo → ~200g cocido",   tiempo:"10 min", rinde:"3 tuppers",           prep:"Saltear con ajo y oliva. Reduce mucho al cocinar, usar cantidad generosa." },
      { nom:"Zanahoria y choclo hervidos",  cant:"4 zanahorias + 2 choclos",    tiempo:"20 min", rinde:"4 porciones",         prep:"Hervir juntos. Cortar choclos y guardar. Practicos y duran 4 dias." },
      { nom:"Pure de calabaza/zapallo",     cant:"400g",                        tiempo:"25 min", rinde:"3-4 tuppers",         prep:"Hervir y pisar. Sal y nuez moscada. Sin manteca." },
      { nom:"Tomate cherry + pepino",       cant:"Libre",                       tiempo:"2 min",  rinde:"2-3 dias",            prep:"Cortar y guardar. Para sumar volumen sin cocinar. No cuenta como verdura cocida." },
      { nom:"Ensalada cruda",               cant:"Libre",                       tiempo:"5 min",  rinde:"Inmediato SIEMPRE",   prep:"Lechuga, tomate, pepino, rucula. Oliva + limon. NO preparar en batch, se pudre." },
    ]
  },
  extras: {
    col:"⚡ EXTRAS POR TIPO DE ENTRENO", color:"#92400e", bg:"#fff7ed", border:"#fed7aa",
    tip:"No van al tupper principal. Son preparaciones separadas segun el dia.",
    items:[
      { nom:"Batido post-basquet / post-gym 🏀💪", cant:"1 preparacion",  tiempo:"3 min",  rinde:"Inmediato", prep:"300ml leche + 1 scoop proteina + 1 banana + 3 cdas avena + 1 cda man. mani + 5g creatina. Primeros 45 min post-esfuerzo." },
      { nom:"Pre-basquet liviano 🏀",              cant:"Tupper chico",    tiempo:"5 min",  rinde:"Inmediato", prep:"1 lata atun + 2 fetas pan lactal. Sin grasa ni fibra alta. 2-3hs antes." },
      { nom:"Pre-gimnasio moderado 💪",            cant:"Tupper chico",    tiempo:"3 min",  rinde:"Inmediato", prep:"200g yogur + 1 fruta + 20g nueces. 1-1.5hs antes." },
      { nom:"Snack recuperacion nocturna",         cant:"Tupper chico",    tiempo:"2 min",  rinde:"Inmediato", prep:"200g yogur natural + 20g nueces. Caseina de lenta digestion. Antes de dormir en dias de entreno." },
    ]
  }
};

function TAG({ c, children }: { c?: string; children: React.ReactNode }) {
  return (
    <span style={{background:c||"#e5e7eb",color:"#1f2937",borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:600}}>
      {children}
    </span>
  );
}

function MacroBar({ label, val, max, color }: { label: string; val: number; max: number; color: string }) {
  return (
    <div style={{marginBottom:8}}>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}>
        <span style={{fontWeight:600}}>{label}</span><span style={{color:"#6b7280"}}>{val}g</span>
      </div>
      <div style={{background:"#e5e7eb",borderRadius:99,height:8}}>
        <div style={{background:color,borderRadius:99,height:8,width:`${Math.min(100,(val/max)*100)}%`}}/>
      </div>
    </div>
  );
}

export default function PlanNutricional() {
  const [tab, setTab] = useState(0);
  const [diaActivo, setDiaActivo] = useState("basquet");
  const [batchTab, setBatchTab] = useState("proteina");

  const plan = PLAN[diaActivo];
  const batch = BATCH[batchTab];

  return (
    <div style={{fontFamily:"'Segoe UI',sans-serif",background:"#f0f4f8",minHeight:"100vh",paddingBottom:40}}>

      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#0f2744,#1e4a8a)",padding:"24px 20px 18px",color:"#fff"}}>
        <div style={{maxWidth:820,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
            <div style={{background:"#e87722",borderRadius:10,padding:"5px 11px",fontWeight:800,fontSize:17}}>NB</div>
            <div>
              <div style={{fontSize:20,fontWeight:800}}>Programa Jugador NB</div>
              <div style={{fontSize:12,opacity:0.75}}>Sebastian Martini - Pivot - Union de Arroyo Seco</div>
            </div>
          </div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            {([["95 kg","Peso"],["1.85 m","Altura"],["25 anos","Edad"],["Basquet + Gym","Actividad"]] as const).map(([v,l])=>(
              <div key={l} style={{background:"rgba(255,255,255,0.12)",borderRadius:8,padding:"5px 12px",textAlign:"center"}}>
                <div style={{fontSize:14,fontWeight:700}}>{v}</div>
                <div style={{fontSize:10,opacity:0.7}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Nav principal */}
      <div style={{background:"#fff",borderBottom:"2px solid #e5e7eb",overflowX:"auto"}}>
        <div style={{maxWidth:820,margin:"0 auto",display:"flex"}}>
          {NAV.map((n,i)=>(
            <button key={n} onClick={()=>setTab(i)} style={{padding:"13px 16px",border:"none",background:"none",cursor:"pointer",fontWeight:tab===i?700:500,color:tab===i?"#e87722":"#374151",borderBottom:tab===i?"3px solid #e87722":"3px solid transparent",whiteSpace:"nowrap",fontSize:13}}>
              {n}
            </button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:820,margin:"20px auto",padding:"0 14px"}}>

        {/* TAB 0 - Perfil & Macros */}
        {tab===0 && (
          <div style={{display:"grid",gap:14}}>
            <div style={{background:"#fff",borderRadius:12,padding:18,boxShadow:"0 1px 4px rgba(0,0,0,0.08)"}}>
              <div style={{fontSize:13,color:"#6b7280",marginBottom:4}}>BMR calculado (Mifflin-St Jeor): <strong>1.986 kcal</strong></div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:12}}>
                {[
                  {tipo:"Dia de Basquet",sub:"Lun / Mie / Vie",kcal:3400,cho:450,pro:180,fat:100,color:"#1e4a8a",factor:"x1.75"},
                  {tipo:"Dia de Gimnasio",sub:"Mar / Jue / Sab",kcal:3100,cho:390,pro:180,fat:90,color:"#e87722",factor:"x1.6"},
                  {tipo:"Dia de Descanso",sub:"Domingo",kcal:2700,cho:320,pro:175,fat:80,color:"#6b7280",factor:"x1.375"},
                ].map(d=>(
                  <div key={d.tipo} style={{border:`2px solid ${d.color}`,borderRadius:10,padding:14}}>
                    <div style={{fontWeight:700,color:d.color,fontSize:13}}>{d.tipo}</div>
                    <div style={{fontSize:11,color:"#9ca3af",marginBottom:8}}>{d.sub} - {d.factor}</div>
                    <div style={{fontSize:24,fontWeight:800,color:"#0f2744",marginBottom:10}}>{d.kcal} <span style={{fontSize:13,fontWeight:400,color:"#6b7280"}}>kcal</span></div>
                    <MacroBar label="Carbohidratos" val={d.cho} max={500} color="#3b82f6"/>
                    <MacroBar label="Proteinas"     val={d.pro} max={220} color="#22c55e"/>
                    <MacroBar label="Grasas"        val={d.fat} max={130} color="#f59e0b"/>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabla de carbos por dia */}
            <div style={{background:"#fff",borderRadius:12,padding:18,boxShadow:"0 1px 4px rgba(0,0,0,0.08)"}}>
              <div style={{fontWeight:700,color:"#0f2744",fontSize:15,marginBottom:4}}>Cantidad de carbohidrato por tipo de dia</div>
              <div style={{fontSize:12,color:"#6b7280",marginBottom:12}}>Pesas siempre en crudo. Proteina y verdura no cambian (150g cocido cada una).</div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                  <thead>
                    <tr style={{background:"#f0f4f8"}}>
                      {["Carbohidrato","🏀 Basquet","💪 Gimnasio","😴 Descanso"].map(h=>(
                        <th key={h} style={{padding:"8px 12px",textAlign:"left",fontWeight:700,color:"#0f2744"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Arroz (cualquier tipo)","150g crudo","120g crudo","80g crudo"],
                      ["Papa / Batata","200g crudo","170g crudo","120g crudo"],
                      ["Fideos","90g crudo","75g crudo","55g crudo"],
                      ["Quinoa","130g crudo","100g crudo","70g crudo"],
                    ].map((r,i)=>(
                      <tr key={r[0]} style={{background:i%2===0?"#fff":"#f9fafb"}}>
                        {r.map((c,j)=>(
                          <td key={j} style={{padding:"8px 12px",color:j===0?"#0f2744":"#374151",fontWeight:j===0?600:400}}>{c}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{marginTop:10,background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:8,padding:"8px 12px",fontSize:12,color:"#1e40af"}}>
                La proteina y la verdura son iguales todos los dias: <strong>150g cocido por tupper</strong>. Solo el carbo cambia.
              </div>
            </div>
          </div>
        )}

        {/* TAB 1 - Suplementos */}
        {tab===1 && (
          <div style={{display:"grid",gap:12}}>
            {SUPLEMENTOS.map(s=>(
              <div key={s.nom} style={{background:"#fff",borderRadius:10,padding:16,boxShadow:"0 1px 4px rgba(0,0,0,0.07)",borderLeft:`4px solid ${s.color}`}}>
                <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8,marginBottom:8}}>
                  <div style={{fontWeight:700,fontSize:14,color:"#0f2744"}}>{s.nom}</div>
                  <TAG c="#dcfce7">Tomando</TAG>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,fontSize:13,marginBottom:8}}>
                  <div><span style={{color:"#6b7280"}}>Dosis: </span><strong>{s.dosis}</strong></div>
                  <div><span style={{color:"#6b7280"}}>Cuando: </span><strong>{s.timing}</strong></div>
                </div>
                <div style={{fontSize:12,color:"#374151",background:"#f9fafb",padding:"7px 10px",borderRadius:6}}>{s.nota}</div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2 - Plan por Dia */}
        {tab===2 && (
          <div>
            <div style={{display:"flex",gap:8,marginBottom:14}}>
              {([["basquet","🏀 Basquet","#1e4a8a"],["gimnasio","💪 Gimnasio","#e87722"],["descanso","😴 Descanso","#6b7280"]] as const).map(([k,l,c])=>(
                <button key={k} onClick={()=>setDiaActivo(k as string)} style={{padding:"7px 16px",borderRadius:20,border:`2px solid ${diaActivo===k?c:"#e5e7eb"}`,background:diaActivo===k?c:"#fff",color:diaActivo===k?"#fff":"#374151",cursor:"pointer",fontWeight:600,fontSize:13}}>
                  {l}
                </button>
              ))}
            </div>

            <div style={{background:"#fff",borderRadius:10,padding:14,marginBottom:12,boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}>
              <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
                <div>
                  <div style={{fontWeight:700,fontSize:15,color:"#0f2744"}}>{plan.label}</div>
                  <div style={{fontSize:12,color:"#9ca3af"}}>{plan.detalle}</div>
                </div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {([["kcal",plan.kcal,"#e87722"],["CHO",plan.cho+"g","#3b82f6"],["PRO",plan.pro+"g","#22c55e"],["FAT",plan.fat+"g","#f59e0b"]] as [string, string|number, string][]).map(([l,v,c])=>(
                    <div key={l} style={{background:"#f9fafb",borderRadius:8,padding:"5px 10px",textAlign:"center"}}>
                      <div style={{fontSize:13,fontWeight:700,color:c}}>{v}</div>
                      <div style={{fontSize:10,color:"#9ca3af"}}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{display:"grid",gap:10}}>
              {plan.comidas.map((c,i)=>(
                <div key={i} style={{background:"#fff",borderRadius:10,padding:14,boxShadow:"0 1px 4px rgba(0,0,0,0.07)",display:"flex",gap:12}}>
                  <div style={{minWidth:58,textAlign:"center",paddingTop:2}}>
                    <div style={{background:"#0f2744",color:"#fff",borderRadius:8,padding:"4px 6px",fontSize:11,fontWeight:700}}>{c.hora}</div>
                  </div>
                  <div>
                    <div style={{fontWeight:700,color:"#0f2744",fontSize:13,marginBottom:4}}>{c.nom}</div>
                    <div style={{fontSize:13,color:"#374151"}}>{c.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4 - Lista de Compras */}
        {tab===4 && (
          <div style={{display:"grid",gap:14}}>
            <div style={{background:"#fff7ed",border:"1px solid #fed7aa",borderRadius:10,padding:"10px 14px",fontSize:13,color:"#92400e"}}>
              Lista base para tener siempre en casa. Cantidades orientativas para una semana completa (6 dias de entreno + 1 descanso).
            </div>
            {[
              { cat:"🍗 Proteinas", color:"#0f2744", bg:"#eff6ff", border:"#bfdbfe", items:[
                ["Pechuga o muslos de pollo","1.5 kg"],
                ["Carne picada magra","500 g"],
                ["Merluza o lenguado","400 g"],
                ["Atun o caballa en lata (al agua)","4 latas"],
                ["Huevos","12 unidades"],
                ["Yogur natural entero","700 g"],
                ["Leche","1.5 L"],
                ["Queso magro / port salut light","200 g"],
              ]},
              { cat:"🍚 Carbohidratos", color:"#1e3a5f", bg:"#f0fdf4", border:"#bbf7d0", items:[
                ["Arroz blanco","1 kg"],
                ["Arroz integral","500 g"],
                ["Fideos","500 g"],
                ["Papa","1 kg"],
                ["Batata","500 g"],
                ["Avena arrollada","500 g"],
                ["Pan lactal integral","1 paquete"],
                ["Quinoa","300 g"],
              ]},
              { cat:"🥦 Verduras", color:"#166534", bg:"#f9fafb", border:"#e5e7eb", items:[
                ["Zapallito","4 unidades"],
                ["Berenjena","2 unidades"],
                ["Morron (rojo o verde)","3 unidades"],
                ["Brocoli","1 cabeza"],
                ["Calabaza o zapallo","500 g"],
                ["Zanahoria","4 unidades"],
                ["Choclo","2 unidades"],
                ["Espinaca o acelga","1 atado"],
                ["Tomate","4 unidades"],
                ["Lechuga / rucula","1 bolsa"],
                ["Pepino","2 unidades"],
              ]},
              { cat:"🥑 Grasas & Extras", color:"#78350f", bg:"#fff7ed", border:"#fed7aa", items:[
                ["Aceite de oliva extra virgen","1 botella"],
                ["Palta","3 unidades"],
                ["Nueces o almendras","200 g"],
                ["Mantequilla de mani (sin azucar)","1 frasco"],
                ["Miel","1 frasco chico"],
                ["Limones","4 unidades"],
                ["Pan rallado","1 paquete chico"],
                ["Lentejas","250 g"],
              ]},
              { cat:"🧴 Suplementos", color:"#374151", bg:"#f3f4f6", border:"#e5e7eb", items:[
                ["Proteina en polvo","segun stock"],
                ["Creatina monohidratada","segun stock"],
                ["Vitamina D3","segun stock"],
                ["Vitamina C","segun stock"],
                ["Centrum Hombre","segun stock"],
              ]},
            ].map(g=>(
              <div key={g.cat} style={{background:"#fff",borderRadius:12,padding:16,boxShadow:"0 1px 4px rgba(0,0,0,0.07)",borderLeft:`4px solid ${g.color}`}}>
                <div style={{fontWeight:700,color:g.color,fontSize:14,marginBottom:10}}>{g.cat}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:"0 12px"}}>
                  {g.items.map(([nom,cant])=>(
                    <React.Fragment key={nom}>
                      <div style={{fontSize:13,color:"#374151",padding:"5px 0",borderBottom:"1px solid #f3f4f6"}}>- {nom}</div>
                      <div style={{fontSize:12,color:"#6b7280",padding:"5px 0",borderBottom:"1px solid #f3f4f6",textAlign:"right",whiteSpace:"nowrap"}}>{cant}</div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3 - Batch Cooking */}
        {tab===3 && (
          <div>
            <div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:13,color:"#1e40af"}}>
              <strong>Flujo del domingo:</strong> Cocinas todo en bulk → pesas en crudo primero → porcionas en tuppers etiquetados → Lun-Jue a la heladera, Vie-Dom al freezer.
            </div>

            <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
              {BATCH_TABS.map(t=>(
                <button key={t.key} onClick={()=>setBatchTab(t.key)} style={{padding:"7px 16px",borderRadius:20,border:`2px solid ${batchTab===t.key?t.color:"#e5e7eb"}`,background:batchTab===t.key?t.color:"#fff",color:batchTab===t.key?"#fff":"#374151",cursor:"pointer",fontWeight:600,fontSize:13,transition:"all 0.2s"}}>
                  {t.label}
                </button>
              ))}
            </div>

            <div style={{background:"#fff",borderRadius:12,padding:18,boxShadow:"0 1px 4px rgba(0,0,0,0.08)"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8,marginBottom:10}}>
                <h3 style={{margin:0,color:batch.color,fontSize:15,fontWeight:800}}>{batch.col}</h3>
                <div style={{background:batch.bg,border:`1px solid ${batch.border}`,borderRadius:6,padding:"4px 10px",fontSize:12,color:batch.color}}>💡 {batch.tip}</div>
              </div>
              <div style={{display:"grid",gap:8}}>
                {batch.items.map(it=>(
                  <div key={it.nom} style={{background:"#f9fafb",borderRadius:8,padding:"10px 12px",display:"grid",gridTemplateColumns:"1fr auto",gap:"4px 12px",alignItems:"start"}}>
                    <div>
                      <div style={{fontWeight:700,color:"#0f2744",fontSize:13,marginBottom:3}}>{it.nom}</div>
                      <div style={{fontSize:12,color:"#6b7280"}}>{it.prep}</div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end"}}>
                      <TAG c="#dbeafe">{it.cant}</TAG>
                      <TAG c="#dcfce7">⏱ {it.tiempo}</TAG>
                      <TAG c="#fef3c7">📦 {it.rinde}</TAG>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
