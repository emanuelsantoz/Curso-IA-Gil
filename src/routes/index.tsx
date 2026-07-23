import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

import logoAsset from "@/assets/logo_barracred.png.asset.json";
import oqueQueremosAsset from "@/assets/oquequeremos.png.asset.json";
import cerebroImg from "@/assets/ch-cerebro.png";
import conhecimentoImg from "@/assets/ch-conhecimento.png";
import habilidadesImg from "@/assets/ch-habilidades.png";
import contextoImg from "@/assets/ch-contexto.png";
import acaoImg from "@/assets/ch-acao.png";
import custosImg from "@/assets/custos.png";
import tokenVisualImg from "@/assets/token-visual.png";
import projImg from "@/assets/proj.png";

const CHAPTER_IMAGES: Record<string, string> = {
  "CÉREBRO": cerebroImg,
  "CONHECIMENTO": conhecimentoImg,
  "CONTEXTO": contextoImg,
  "HABILIDADES": habilidadesImg,
  "AÇÃO": acaoImg,
};

export const Route = createFileRoute("/")({
  component: Presentation,
});

/* ---------- Layout primitives ---------- */

function SlideShell({
  chapter,
  children,
  align = "left",
  padded = true,
}: {
  chapter?: string;
  children: ReactNode;
  align?: "left" | "center";
  padded?: boolean;
}) {
  return (
    <div className="slide-content">
      {chapter && (
        <div
          className="slide-chapter-tag absolute flex items-center gap-4"
          style={{ top: 50, left: 90 }}
        >
          {Object.entries(CHAPTER_IMAGES).map(([name, img]) => (
            <img
              key={name}
              src={img}
              alt={name}
              style={{
                width: name === chapter ? 120 : 80,
                height: name === chapter ? 120 : 80,
                objectFit: "contain",
                filter: name === chapter ? "none" : "grayscale(100%)",
                border: name === chapter ? "4px solid #f97316" : "2px solid transparent",
                borderRadius: "50%",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      )}
      <div
        className="absolute inset-0 flex flex-col"
        style={{
          paddingLeft: padded ? 110 : 0,
          paddingRight: padded ? 110 : 0,
          paddingTop: 180,
          paddingBottom: 120,
          justifyContent: align === "center" ? "center" : "flex-start",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <div className="slide-label mb-8">{children}</div>;
}

function Underline({ children }: { children: ReactNode }) {
  return <span className="accent-underline">{children}</span>;
}

function Card({ title, body, num }: { title: string; body?: string; num?: string }) {
  return (
    <div
      className="flex flex-col"
      style={{
        border: "2px solid #111",
        padding: "36px 40px",
        minHeight: 240,
      }}
    >
      {num && <div className="slide-label text-accent mb-4">{num}</div>}
      <div style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.1, marginBottom: 16 }}>
        {title}
      </div>
      {body && (
        <div
          className="slide-body"
          style={{ color: "#444" }}
          dangerouslySetInnerHTML={{ __html: body }}
        />
      )}
    </div>
  );
}

/* ---------- Chapter divider ---------- */

function ChapterCover({
  num,
  name,
  image,
  range,
}: {
  num: string;
  name: string;
  image: string;
  range: string;
}) {
  return (
    <div className="slide-content">
      <div className="slide-chapter-tag absolute" style={{ top: 60, left: 110 }}>
        {range}
      </div>
      <div
        className="absolute inset-0 grid"
        style={{ gridTemplateColumns: "1.1fr 0.9fr", alignItems: "center" }}
      >
        <div style={{ paddingLeft: 110 }}>
          <div className="slide-label mb-8">Capítulo {num}</div>
          <div className="slide-hero">
            <Underline>{name}</Underline>
          </div>
        </div>
        <div className="flex items-center justify-center" style={{ paddingRight: 110 }}>
          <img src={image} alt={name} style={{ width: 620, height: 620, objectFit: "contain" }} />
        </div>
      </div>
    </div>
  );
}

/* ---------- Slides ---------- */

type Slide = { id: number; render: () => ReactNode };

const SLIDES: Slide[] = [
  // 1 — Cover
  {
    id: 1,
    render: () => (
      <div className="slide-content">
        <div className="absolute" style={{ top: 90, left: 110 }}>
          <img src={logoAsset.url} alt="Barracred" style={{ height: 110 }} />
        </div>
        <div
          className="absolute flex flex-col"
          style={{ left: 110, right: 110, top: 340 }}
        >
          <div className="slide-label mb-10">Formação Interna · Barracred</div>
          <div className="slide-hero" style={{ maxWidth: 1600 }}>
            Inteligência Artificial:<br />
            do <Underline>Cérebro</Underline> à <Underline>Ação</Underline>.
          </div>
          <div className="slide-statement mt-14" style={{ maxWidth: 1400, color: "#333" }}>
            Ferramentas mudam. Os conceitos permanecem. É essa base que te prepara para evoluir
          </div>
        </div>
      </div>
    ),
  },
  // 2 — O que queremos meme
  {
    id: 2,
    render: () => (
      <div className="slide-content flex items-center justify-center">
        <img
          src={oqueQueremosAsset.url}
          alt="O que queremos"
          style={{ maxWidth: "82%", maxHeight: "88%", objectFit: "contain" }}
        />
      </div>
    ),
  },
  // 3 — Estrutura de um agente
  {
    id: 3,
    render: () => (
      <SlideShell>
        <Label>Mapa da apresentação</Label>
        <div className="slide-title mb-16" style={{ maxWidth: 1500 }}>
          A estrutura de um <Underline>agente de IA</Underline>.
        </div>
        <div
          className="grid gap-8"
          style={{ gridTemplateColumns: "repeat(5, 1fr)", marginTop: 40 }}
        >
          {[
            { n: "01", t: "Cérebro", i: cerebroImg },
            { n: "02", t: "Conhecimento", i: conhecimentoImg },
            { n: "03", t: "Contexto", i: contextoImg },
            { n: "04", t: "Habilidades", i: habilidadesImg },
            { n: "05", t: "Ação", i: acaoImg },
          ].map((c, i) => (
            <div key={c.n} className="flex flex-col items-center justify-center">
              <img src={c.i} alt={c.t} style={{ width: 240, height: 240, objectFit: "contain" }} />
              <div style={{ fontSize: 42, fontWeight: 700, marginTop: 12 }}>{c.t}</div>
            </div>
          ))}
        </div>
      </SlideShell>
    ),
  },
  // 4 — Cover Cérebro
  { id: 4, render: () => <ChapterCover num="01" name="Cérebro" image={cerebroImg} range="" /> },
  // 5 — Evolução timeline
  {
    id: 5,
    render: () => (
      <SlideShell chapter="CÉREBRO">
        <Label>Como chegamos até aqui</Label>
        <div className="slide-title mb-14" style={{ maxWidth: 1500 }}>
          A <Underline>evolução</Underline> da IA.
        </div>
        <div className="relative" style={{ marginTop: 30 }}>
          <div style={{ height: 4, background: "#111", position: "absolute", top: 40, left: 0, right: 0 }} />
          <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
            {[
              { y: "anos 70–80", t: "IA baseada em regras" },
              { y: "anos 90–2000", t: "IA estatística e Machine Learning" },
              { y: "2010 → hoje", t: "Era do aprendizado profundo (Deep Learning)" },
              { y: "2020 → hoje", t: "Era das LLMs e IA Generativa" },
            ].map((step, i) => (
              <div key={step.y} className="flex flex-col items-start" style={{ paddingTop: 20 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 999,
                    background: '#ff6b00',
                    marginBottom: 30,
                  }}
                />
                <div className="slide-label" style={{ color: "#111" }}>{step.y}</div>
                <div style={{ fontSize: 30, fontWeight: 600, marginTop: 12, lineHeight: 1.2 }}>
                  {step.t}
                </div>
              </div>
            ))}
          </div>
        </div>
      </SlideShell>
    ),
  },
  // 6 — LLMs
  {
    id: 6,
    render: () => (
      <SlideShell chapter="CÉREBRO">
        <Label>O motor da IA generativa</Label>
        <div className="slide-title mb-10" style={{ maxWidth: 1500 }}>
          O que são <Underline>LLMs</Underline>?
        </div>
        <div className="slide-statement mb-16" style={{ maxWidth: 1400, color: "#333" }}>
          Large Language Models são modelos treinados em enormes volumes de texto para prever a próxima palavra, permitindo conversar, escrever e raciocinar.
        </div>
        <div className="grid gap-8" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          <Card num="Texto" title="LLMs" body="Chat, resumo, redação e análise." />
          <Card num="Visão" title="Multimodais" body="Interpretam imagens, áudio e vídeo." />
          <Card num="Ação" title="Modelos de raciocínio" body="Pensam por etapas antes de responder." />
        </div>
      </SlideShell>
    ),
  },
  // 7 — Modelos populares
  {
    id: 7,
    render: () => (
      <SlideShell chapter="CÉREBRO">
        <Label>Panorama atual</Label>
        <div className="slide-title mb-14" style={{ maxWidth: 1500 }}>
          Modelos mais <Underline>populares</Underline> hoje.
        </div>
        <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
          {[
            { b: "OpenAI", m: "GPT-5.4 / GPT-4o" },
            { b: "Anthropic", m: "Claude Sonnet 4.6" },
            { b: "Google", m: "Gemini 3.1 PRO" },
            { b: "Open source", m: "Llama · DeepSeek v4" },
          ].map((x) => (
            <div key={x.b} style={{ borderLeft: "4px solid #ff6b00", paddingLeft: 24 }}>
              <div className="slide-label" style={{ color: "#111" }}>{x.b}</div>
              <div style={{ fontSize: 34, fontWeight: 700, marginTop: 14, lineHeight: 1.15 }}>{x.m}</div>
            </div>
          ))}
        </div>
      </SlideShell>
    ),
  },
  // 8 — Tokens e limitações
  {
    id: 8,
    render: () => (
      <SlideShell chapter="CÉREBRO">
        <Label>A unidade que o modelo "enxerga"</Label>
        <div className="slide-title mb-10" style={{ maxWidth: 1500 }}>
          <Underline>Tokens</Underline> e limitações.
        </div>
        <div className="slide-statement mb-14" style={{ maxWidth: 1500, color: "#333" }}>
          Tudo que entra e sai do modelo é medido em tokens. Cada modelo tem uma "janela" máxima do que consegue lembrar de uma vez.
        </div>
        <div className="grid gap-10" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          <div>
            <div className="slide-num text-accent">~5</div>
            <div className="slide-body" style={{ color: "#444", marginTop: 10 }}>
              caracteres equivale 1 token (português).
            </div>
          </div>
          <div>
            <div className="slide-num text-accent">200k</div>
            <div className="slide-body" style={{ color: "#444", marginTop: 10 }}>
              tokens de contexto em modelos usuais.
            </div>
          </div>
          <div>
            <div className="slide-num text-accent">1M+</div>
            <div className="slide-body" style={{ color: "#444", marginTop: 10 }}>
              tokens nos modelos mais recentes.
            </div>
          </div>
        </div>
      </SlideShell>
    ),
  },
  // 9 — Visualização de Tokens
  {
    id: 9,
    render: () => (
      <SlideShell chapter="CÉREBRO">
        <Label>Exemplo prático</Label>
        <div className="slide-title mb-10" style={{ maxWidth: 1500 }}>
          Como <Underline>prever</Underline> próximo token
        </div>
        <div className="flex items-center justify-center flex-1" style={{ marginTop: 20 }}>
          <a href="https://poloclub.github.io/transformer-explainer/" target="_blank">
          <img
            src={tokenVisualImg}
            alt="Visualização de Tokens"
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: 12 }}
          />
          </a>
        </div>
      </SlideShell>
    ),
  },
  // 10 — Custos
  {
    id: 10,
    render: () => (
      <SlideShell chapter="CÉREBRO">
        <Label>Você paga pelo que usa</Label>
        <div className="slide-title mb-10" style={{ maxWidth: 1500 }}>
          <Underline>Custos</Underline> por token.
        </div>
        <div className="grid gap-10 items-end" style={{ gridTemplateColumns: "repeat(4, 1fr)", height: 380 }}>
          {[
            { m: "Modelo econômico", h: 40, p: "US$ 0,30 + US$ 2,5 / 1M" },
            { m: "Modelo para uso geral", h: 60, p: "US$ 0,50 + US$ 3 / 1M" },
            { m: "Modelo para planejar", h: 140, p: "US$ 3 + US$ 15 / 1M" },
            { m: "Modelo mais avançado", h: 340, p: "US$ 10 + US$ 50 / 1M" },

          ].map((b, i) => (
            <div key={b.m} className="flex flex-col items-start h-full justify-end">
              <div
                style={{
                  width: "100%",
                  height: b.h,
                  background: i === 3 ? "#ff6b00" : "#111",
                }}
              />
              <div className="slide-label" style={{ color: "#111", marginTop: 20 }}>{b.m}</div>
              <div style={{ fontSize: 26, fontWeight: 600, marginTop: 8 }}>{b.p}</div>
            </div>
          ))}
        </div>
      </SlideShell>
    ),
  },
  // 11 — Custos imagem
  {
    id: 11,
    render: () => (
      <SlideShell chapter="CÉREBRO">
        <div className="flex items-center justify-center h-full w-full">
          <img
            src={custosImg}
            alt="Custos"
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
          />
        </div>
      </SlideShell>
    ),
  },
  // 12 — Cover Conhecimento
  { id: 12, render: () => <ChapterCover num="02" name="Conhecimento extra" image={conhecimentoImg} range="" /> },
  // 13 — Assistentes web
  {
    id: 13,
    render: () => (
      <SlideShell chapter="CONHECIMENTO">
        <Label>Onde conversamos com a IA</Label>
        <div className="slide-title mb-14" style={{ maxWidth: 1500 }}>
          <Underline>Assistentes web</Underline> por chat.
        </div>
        <div className="grid gap-8" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          <Card num="OpenAI" title="ChatGPT" body="O mais conhecido. Forte em texto, imagem e voz." />
          <Card num="Google" title="Gemini" body="Integrado ao Workspace, YouTube e Google Search." />
          <Card num="Anthropic" title="Claude" body="Ótimo para textos longos e análise de documentos." />
        </div>
      </SlideShell>
    ),
  },
  // 14 — Projeto no ChatGPT
  {
    id: 14,
    render: () => (
      <SlideShell chapter="CONHECIMENTO">
        <Label>Memória de trabalho</Label>
        <div className="slide-title mb-10" style={{ maxWidth: 1500 }}>
          Vantagem dos <Underline>projetos</Underline>
        </div>
        <div className="flex items-center justify-center flex-1" style={{ marginTop: 20 }}>
          <img
            src={projImg}
            alt="Projetos no ChatGPT"
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: 12 }}
          />
        </div>
      </SlideShell>
    ),
  },
  // 15 — NotebookLM
  {
    id: 15,
    render: () => (
      <SlideShell chapter="CONHECIMENTO">
        <Label>Base de fontes confiáveis</Label>
        <div className="slide-title mb-10" style={{ maxWidth: 1500 }}>
          Por que usar?
        </div>
        <div className="grid gap-8 mt-10" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          <Card 
            title="Respostas específicas" 
            body="Respostas extraídas <strong>exclusivamente dos seus arquivos</strong> (PDFs, Google Docs, Links, Youtube)." 
          />
          <Card 
            title="Resumos Instantâneos" 
            body="Criação automática de <strong>guias de estudo</strong>, FAQs, <strong>cronogramas e briefing</strong> de documentos extensos." 
          />
          <Card 
            title="Resumo em áudio" 
            body="Transforma seus textos em um <strong>podcast interativo</strong> gravado por dois apresentadores virtuais." 
          />
        </div>
      </SlideShell>
    ),
  },
  // 16 — Aplicações no Dia a Dia
  {
    id: 16,
    render: () => (
      <SlideShell chapter="CONHECIMENTO">
        <Label>Na Prática</Label>
        <div className="slide-title mb-20" style={{ maxWidth: 1500 }}>
          <Underline>Aplicações</Underline> no Dia a Dia.
        </div>
        <div className="grid gap-8" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
          <Card 
            title="Estudantes e Pesquisadores" 
            body="Sintetize dezenas de artigos científicos, crie resumos para provas e encontre citações exatas em segundos." 
          />
          <Card 
            title="Profissionais e Gestores" 
            body="Analise relatórios de mercado, atas de reunião e contratos sem perder tempo lendo centenas de páginas." 
          />
        </div>
      </SlideShell>
    ),
  },
  // 17 — Encerramento Dia 1 & Spoiler Dia 2
  {
    id: 17,
    render: () => (
      <SlideShell>
        <div className="slide-hero mb-10" style={{ fontSize: 100, lineHeight: 1 }}>
          Resumo e <Underline>Spoiler</Underline>
        </div>
        
        <div className="grid grid-cols-2 gap-32 w-full">
          {/* Dia 1 */}
          <div className="flex flex-col gap-10 p-10 bg-slate-100">
            <div className="slide-label text-accent" style={{ fontSize: 24, letterSpacing: "0.2em" }}>O que aprendemos hoje</div>
            <div className="flex flex-col gap-6">
              {[
                { p: "Emanuel", t: "LLMs, modelos e Tokens" },
                { p: "Tayna", t: "Evolução da IA" },
                { p: "Gil", t: "Enriquecendo contexto" },
              ].map(item => (
                <div key={item.p} className="flex flex-col">
                  <span style={{ fontSize: 45, fontWeight: 800, color: "#111" }}>{item.t}</span>
                  <span style={{ fontSize: 30, color: "#9B9B9B", marginTop: -5 }}>{item.p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dia 2 */}
          <div className="flex flex-col gap-10 bg-orange-200 p-10">
            <div className="slide-label text-accent" style={{ fontSize: 24, letterSpacing: "0.2em" }}> Spoiler para próximo encontro</div>
            <div className="flex flex-col gap-6">
              {[
                { p: "Gil", t: "Prompt Engineering" },
                { p: "Israel", t: "Criação de Skills" },
              ].map(item => (
                <div key={item.p} className="flex flex-col">
                  <span style={{ fontSize: 45, fontWeight: 800, color: "#111" }}>{item.t}</span>
                  <span style={{ fontSize: 30, color: "darkorange", marginTop: -5 }}>{item.p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12" style={{ fontSize: 32, color: "#111", fontWeight: 600 }}>
          Dúvidas? Nos vemos semana que vem (dia 30).
        </div>
      </SlideShell>
    ),
  },
  // 16 — Cover Contexto
  { id: 17, render: () => <ChapterCover num="03" name="Contexto" image={contextoImg} range="" /> },
  // 17 — O que é contexto
  {
    id: 18,
    render: () => (
      <SlideShell chapter="CONTEXTO">
        <Label>O ingrediente que muda tudo</Label>
        <div className="slide-title mb-10" style={{ maxWidth: 1500 }}>
          O que é <Underline>contexto</Underline>?
        </div>
        <div className="slide-statement" style={{ maxWidth: 1500, color: "#333" }}><br />
          São as definições que a IA recebe para entender quem você é, o que você quer e como deve responder. Sem contexto, ela <strong>chuta o que faltou definir</strong> ou deixa genérico.
        </div>
      </SlideShell>
    ),
  },
  // 18 — Anatomia
  {
    id: 19,
    render: () => (
      <SlideShell chapter="CONTEXTO">
        <Label>Como se monta um bom prompt</Label>
        <div className="slide-title mb-14" style={{ maxWidth: 1500 }}>
          A <Underline>anatomia</Underline> de um prompt.
        </div>
        <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
          {[
            { n: "01", t: "Personificação (Role)", d: "Quem a IA deve parecer ser.", letter:"R" },
            { n: "02", t: "Tarefa, Objetivo", d: "O que você quer alcançar.", letter:"T" },
            { n: "03", t: "Contexto adicional", d: "Especificações, arquivos, material, restrições, exemplos, público-alvo", letter:"C" },
            { n: "04", t: "Formato", d: "Formato esperado.", letter:"F" },
          ].map((x, i) => (
            <div key={x.n}> <br/>
              <div style={{ fontSize: 84, fontWeight: 700, marginTop: 10, borderBottom: `6px solid #111`, paddingTop: 20, color: x.letter == "C" ? "#ff6b00" : "#111" }}>{x.letter}</div>
              <div style={{ fontSize: 34, fontWeight: 700, marginTop: 10 }}>{x.t}</div>
              <div className="slide-body" style={{ color: "#555", marginTop: 8 }}>{x.d}</div>
            </div>
          ))}
        </div>
      </SlideShell>
    ),
  },
  // 19 — Exercício falado
  {
    id: 20,
    render: () => (
      <SlideShell chapter="CONTEXTO" align="center">
        <Label>Pausa para reflexão</Label>
        <div className="slide-hero" style={{ maxWidth: 1600 }}>
          Vamos fazer um exercício <Underline>falado</Underline>?
        </div>
        <div className="slide-statement" style={{ maxWidth: 1500, color: "#333" }}>
          <br />Qual é o prompt para uma nova campanha de marketing?<br /><br />
        </div>
      </SlideShell>
    ),
  },
  // 20 — Mão na massa: contexto
  {
    id: 21,
    render: () => (
      <SlideShell chapter="CONTEXTO">
        <Label>Exercício 1/4 · Mão na massa</Label>
        <div className="slide-title mb-10" style={{ maxWidth: 1500 }}>
          O poder da <Underline>personificação</Underline>
        </div>
        <br /><br />
        <div className="slide-statement" style={{ maxWidth: 1500, color: "#000" }}>
          <strong>Atue como um arquiteto de software com 20 anos de experiência, especialista em sistemas críticos e mentor de equipes de desenvolvimento.</strong><br />
          Explique como melhorar a qualidade de um software.
        </div>
      </SlideShell>
    ),
  },
  // 21 — Mão na massa: exemplo
  {
    id: 22,
    render: () => (
      <SlideShell chapter="CONTEXTO">
        <Label>Exercício 2/4 · Mão na massa</Label>
        <div className="slide-title mb-10" style={{ maxWidth: 1500 }}>
          Instruir através de <Underline>exemplo</Underline>
        </div>
        <div className="slide-statement" style={{ maxWidth: 1500, color: "#333" }}>
          Um bom exemplo vale mais do que dez linhas explicando.
        </div><br />
        <ul className="slide-statement list-disc list-inside pl-6" style={{ maxWidth: 1500, color: "#333" }}>
          <li>User story de implementação autenticação via Google</li>
          <li>Pull request de bugfix de timeout na integração com o serviço de pagamentos</li>
          <li>Histórico de consumo de tokens</li>
        </ul>
      </SlideShell>
    ),
  },
  // 22 — Cadeia de pensamento
  {
    id: 23,
    render: () => (
      <SlideShell chapter="CONTEXTO">
        <Label>Exercício 3/4 · Mão na massa</Label>
        <div className="slide-title mb-10" style={{ maxWidth: 1500 }}>
          Pensando em <Underline>etapas</Underline>.
        </div><br /><br />
        <div className="slide-statement" style={{ maxWidth: 1500, color: "#333" }}>
          <strong>Vamos resolver este problema em etapas. Após responder, aguarde minha confirmação para continuar o assunto.</strong>
          <br /><br />
          Primeiro: identifique os principais desafios da migração.
        </div><br /><br />
        <div className="slide-statement" style={{ maxWidth: 1500, color: "#333" }}>
          Agora proponha uma arquitetura.
        </div>
      </SlideShell>
    ),
  },
  // 23 — Iteração
  {
    id: 24,
    render: () => (
      <SlideShell chapter="CONTEXTO">
        <Label>Exercício 4/4 · Mão na massa</Label>
        <div className="slide-title mb-10" style={{ maxWidth: 1500 }}>
          Construindo prompt por <Underline>iteração com IA</Underline>
        </div>
        <br /><br />
        <div className="slide-statement" style={{ maxWidth: 1500, color: "#333" }}>
          <br />Quero criar .... <br />
          <strong>Antes de responder, faça todas as perguntas necessárias para entender o problema. Não faça suposições. Somente depois que eu responder às perguntas, elabore a solução.</strong>
        </div>
      </SlideShell>
    ),
  },
    // 15 — Markdown
  {
    id: 25,
    render: () => (
      <SlideShell chapter="CONTEXTO">
        <Label>O formato preferido das IAs</Label>
        <div className="slide-title mb-10" style={{ maxWidth: 1500 }}>
          Prompts <Underline>reutilizáveis</Underline>.
        </div>
        <div className="slide-statement" style={{ maxWidth: 1500, color: "#333" }}>
          Através de arquivo de instruções na forma de texto simples é possível especificar, descrever experiências, processos e conhecimentos reutilizáveis.
        </div>
        <div className="slide-statement" style={{ maxWidth: 1500, color: "#333", marginTop: 80 }}>
          Tá, mas como faço isso no ChatGPT/Gemini?
        </div>
      </SlideShell>
    ),
  },
  // 24 — Cover Habilidades
  { id: 26, render: () => <ChapterCover num="04" name="Habilidades" image={habilidadesImg} range="" /> },

  // 25 — Skills
  {
    id: 27,
    render: () => (
      <SlideShell chapter="HABILIDADES">
        <Label>Do contexto ao reaproveitamento</Label>
        <div className="slide-title mb-10" style={{ maxWidth: 1500 }}>
          Skill é <Underline>execução reutilizável</Underline>.
        </div>
        <div className="slide-statement" style={{ maxWidth: 1450, color: "#333" }}>
          O pedido pode ser curto porque a skill ja carrega contexto, criterio e formato.
        </div>
        <div className="skill-demo">
          <div className="skill-demo-stage">
            <div className="skill-demo-doc">
              <div className="skill-demo-doc-header">skill.md</div>
              <div className="skill-demo-doc-line">
                <span># papel</span>
                <span>cobranca amigavel B2B</span>
              </div>
              <div className="skill-demo-doc-line">
                <span># objetivo</span>
                <span>cobrar sem soar agressivo</span>
              </div>
              <div className="skill-demo-doc-line">
                <span># criterios</span>
                <span>educado, claro, com prazo</span>
              </div>
              <div className="skill-demo-doc-line">
                <span># formato</span>
                <span>assunto + corpo + CTA</span>
              </div>
            </div>
            <div className="skill-demo-chat">
              <div className="skill-demo-chat-header">
                <span>ChatGPT</span>
                <span className="skill-demo-chat-pill">skill ativa</span>
              </div>
              <div className="skill-demo-user">
                Gere um e-mail curto cobrando a fatura em atraso.
              </div>
              <div className="skill-demo-assistant">
                <div className="skill-demo-assistant-title">Resposta guiada pela skill</div>
                <div className="skill-demo-assistant-line"><strong>Assunto:</strong> Regularizacao da fatura pendente</div>
                <div className="skill-demo-assistant-line"><strong>Tom:</strong> cordial, objetivo e sem confronto</div>
                <div className="skill-demo-assistant-line"><strong>CTA:</strong> solicitar confirmacao do pagamento ate amanha</div>
              </div>
            </div>
          </div>
          <div className="skill-demo-copy">
            <div className="skill-demo-point">
              <div className="slide-label" style={{ color: "#111" }}>Prompt curto</div>
              <div className="skill-demo-point-text">Quem usa nao precisa reexplicar tudo.</div>
            </div>
            <div className="skill-demo-point">
              <div className="slide-label" style={{ color: "#111" }}>Contexto salvo</div>
              <div className="skill-demo-point-text">A skill leva junto papel, regra e formato.</div>
            </div>
            <div className="skill-demo-point">
              <div className="slide-label" style={{ color: "#111" }}>Resposta consistente</div>
              <div className="skill-demo-point-text">A saida segue um padrao reutilizavel.</div>
            </div>
          </div>
        </div>
      </SlideShell>
    ),
  },
  // 26 — Da conversa ao método
  {
    id: 28,
    render: () => (
      <SlideShell chapter="HABILIDADES">
        <Label>Da cabeça ao texto</Label>
        <div className="slide-title mb-8" style={{ maxWidth: 1500, fontSize: 76, lineHeight: 0.98 }}>
          Transformando experiência em <Underline>skill</Underline>.
        </div>
        <div className="slide-statement" style={{ maxWidth: 1250, color: "#333", fontSize: 38, lineHeight: 1.12 }}>
          Uma skill é um pedaço do seu jeito de pensar, escrito em texto para a IA repetir com padrão.
        </div>
        <div className="skill-metaphor">
          <div className="skill-brain-panel">
            <div className="slide-label" style={{ color: "#111" }}>No humano</div>
            <div className="brain-shell">
              <div className="brain-orbit brain-orbit-1" />
              <div className="brain-orbit brain-orbit-2" />
              <div className="brain-orbit brain-orbit-3" />
              <div className="brain-chip brain-chip-1">Tom</div>
              <div className="brain-chip brain-chip-2">Critérios</div>
              <div className="brain-chip brain-chip-3">Passos</div>
              <div className="brain-chip brain-chip-4">Exemplos</div>
              <div className="brain-core">
                experiência<br />humana
              </div>
            </div>
            <div className="slide-caption" style={{ maxWidth: 360, marginTop: 14, fontSize: 20 }}>
              Uma forma de pensar e executar que hoje ainda está espalhada na sua cabeça.
            </div>
          </div>
          <div className="skill-transfer">
            <div className="skill-transfer-line" />
            <div className="slide-label" style={{ color: "#111" }}>Extrair e organizar</div>
            <div className="skill-transfer-copy">
              transformar jeito de pensar em instrução reutilizável
            </div>
          </div>
          <div className="skill-box-panel">
            <div className="slide-label" style={{ color: "#111" }}>Na caixinha</div>
            <div className="skill-file-card">
              <div className="skill-file-header">skill.md</div>
              <div className="skill-file-line">
                <span># papel</span>
                <span>especialista...</span>
              </div>
              <div className="skill-file-line">
                <span># objetivo</span>
                <span>o que fazer</span>
              </div>
              <div className="skill-file-line">
                <span># passos</span>
                <span>como executar</span>
              </div>
              <div className="skill-file-line">
                <span># critérios</span>
                <span>o que validar</span>
              </div>
              <div className="skill-file-line">
                <span># formato</span>
                <span>como responder</span>
              </div>
            </div>
            <div className="slide-caption" style={{ maxWidth: 360, marginTop: 14, fontSize: 20 }}>
              A IA não improvisa do zero. Ela reutiliza o padrão salvo em texto.
            </div>
          </div>
        </div>
      </SlideShell>
    ),
  },
  // 27 — Exemplos por público
  {
    id: 29,
    render: () => (
      <SlideShell chapter="HABILIDADES">
        <Label>Mesma lógica, mundos diferentes</Label>
        <div className="slide-title mb-14" style={{ maxWidth: 1500 }}>
          Uma lógica. <Underline>Quatro mundos</Underline>.
        </div>
        <div className="audience-grid">
          {[
            {
              n: "Desenvolvimento",
              t: "PR, user story e análise técnica.",
              d: "Transforme uma rotina recorrente em método reutilizável. <a href='/pr.md' target='_blank'>Ver exemplo</a>",
            },
            {
              n: "Marketing",
              t: "Briefing, campanha e tom de marca.",
              d: "A IA passa a repetir o mesmo raciocínio criativo com consistência.",
            },
            {
              n: "Vídeo",
              t: "Roteiro, cortes e descrição final.",
              d: "Um bom fluxo reduz retrabalho e acelera a produção.",
            },
            {
              n: "Operação",
              t: "Resumo, resposta e histórico útil.",
              d: "Padronize tarefas de toda semana. <a href='/consumo.md' target='_blank'>Ver exemplo</a>",
            },
          ].map((world, i) => (
            <div key={world.n} className="audience-card" style={{ animationDelay: `${i * 0.6}s` }}>
              <div className="slide-label" style={{ color: "#111" }}>{world.n}</div>
              <div className="skill-step-title" style={{ marginTop: 14 }}>{world.t}</div>
              <div
                className="skill-step-body"
                style={{ marginTop: 18 }}
                dangerouslySetInnerHTML={{ __html: world.d }}
              />
            </div>
          ))}
        </div>
      </SlideShell>
    ),
  },
  // 28 — Cover Ação
  { id: 30, render: () => <ChapterCover num="05" name="Ação" image={acaoImg} range="" /> },

  // 29 — Exercício final
  {
    id: 31,
    render: () => (
      <SlideShell chapter="AÇÃO">
        <Label>Exercício final · Mão na massa</Label>
        <div className="slide-title mb-10" style={{ maxWidth: 1500 }}>
          O que merece virar <Underline>método</Underline>?
        </div>
        <div className="slide-statement" style={{ maxWidth: 1500, color: "#333" }}>
          Se repete toda semana, custa mais do que parece.
        </div>
        <div className="action-grid">
          {[
            {
              n: "01",
              t: "Observe",
              d: "Escolha algo que você vive reexplicando para a IA.",
            },
            {
              n: "02",
              t: "Estruture",
              d: "Defina contexto, passos, restrições e formato esperado.",
            },
            {
              n: "03",
              t: "Reutilize",
              d: "Teste, refine e salve como skill para o próximo caso.",
            },
          ].map((item, i) => (
            <div key={item.n} className="action-card" style={{ animationDelay: `${i * 0.45}s` }}>
              <div className="slide-label" style={{ color: "#111" }}>{item.n}</div>
              <div className="skill-step-title" style={{ marginTop: 14 }}>{item.t}</div>
              <div className="skill-step-body" style={{ marginTop: 18 }}>{item.d}</div>
              <div className="action-card-bar" style={{ animationDelay: `${0.2 + i * 0.45}s` }} />
            </div>
          ))}
        </div>
      </SlideShell>
    ),
  },
  // 30 — Encerramento meme
  {
    id: 32,
    render: () => (
      <div className="slide-content flex items-center justify-center">
        <img
          src={oqueQueremosAsset.url}
          alt="O que queremos"
          style={{ maxWidth: "82%", maxHeight: "88%", objectFit: "contain" }}
        />
      </div>
    ),
  },
  // 31 — Agradecimento
  {
    id: 33,
    render: () => (
      <div className="slide-content flex flex-col items-center justify-center text-center px-50">
        <div className="slide-statement mb-12" style={{ maxWidth: 1400, fontSize: 42, color: "#444" }}>
          <strong>Ontem:</strong><br /> você apenas conversava com a IA. ("oi chat")
        </div>
        <div className="slide-title mb-12" style={{ maxWidth: 1100, fontSize: 60, lineHeight: 1.1 }}>
          Hoje:<br /> você extrai melhor informação, e<br /> cria habilidades reutilizáveis para futuros agentes.
        </div><br /><br />
        <div className="slide-statement" style={{ maxWidth: 1200, color: "#444", fontSize: 42 }}>
          <strong>No próximo módulo:</strong><br />
          🔄 Fluxos que executam sequência de tarefas<br />
          ⚙️ Pequenas automações dinâmicas<br />
          📅 Agendamento de ações diárias<br />
        </div>
      </div>
    ),
  },

];

/* ---------- Presentation shell ---------- */

function Presentation() {
  const [index, setIndex] = useState(0);

  const go = useCallback((next: number) => {
    setIndex((cur) => {
      const clamped = Math.min(Math.max(next, 0), SLIDES.length - 1);
      const url = new URL(window.location.href);
      url.searchParams.set("slide", String(clamped + 1));
      window.history.replaceState({}, "", url.toString());
      return clamped;
    });
  }, []);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("slide");
    const n = p ? parseInt(p, 10) : 1;
    const next = Math.min(Math.max((isNaN(n) ? 1 : n) - 1, 0), SLIDES.length - 1);
    setIndex(next);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        go(index + 1);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        go(index - 1);
      } else if (e.key === "Home") go(0);
      else if (e.key === "End") go(SLIDES.length - 1);
      else if (e.key === "f" || e.key === "F") {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, go]);

  useEffect(() => {
    document.title = `${index + 1}/${SLIDES.length} · Inteligência Artificial — Barracred`;
  }, [index]);

  // Fit scale
  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  useLayoutEffect(() => {
    const update = () => {
      if (!stageRef.current) return;
      const { clientWidth: w, clientHeight: h } = stageRef.current;
      setScale(Math.min(w / 1920, h / 1080));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const slide = SLIDES[index];

  return (
    <div className="min-h-screen w-full flex flex-col" style={{ background: "#f5f5f5" }}>
      <div ref={stageRef} className="relative flex-1 overflow-hidden">
        <div className="slide-wrapper" style={{ transform: `scale(${scale})` }}>
          {slide.render()}
        </div>
      </div>

      {/* Controls */}
      <div
        className="fixed flex items-center gap-3 px-4 py-2 rounded-full"
        style={{
          left: "50%",
          transform: "translateX(-50%)",
          bottom: 24,
          background: "rgba(17,17,17,0.85)",
          color: "white",
          backdropFilter: "blur(6px)",
          fontFamily: "Poppins",
        }}
      >
        <button
          onClick={() => go(index - 1)}
          className="px-3 py-1 text-sm font-medium hover:opacity-70"
          aria-label="Anterior"
        >
          ←
        </button>
        <div className="text-sm tabular-nums" style={{ minWidth: 60, textAlign: "center" }}>
          {index + 1} / {SLIDES.length}
        </div>
        <button
          onClick={() => go(index + 1)}
          className="px-3 py-1 text-sm font-medium hover:opacity-70"
          aria-label="Próximo"
        >
          →
        </button>
      </div>
    </div>
  );
}
